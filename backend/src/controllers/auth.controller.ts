import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { signToken } from "../utils/jwt";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      if (
        typeof email !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string" ||
        password.length < 8
      ) {
        return res.status(400).json({
          success: false,
          message: "Data tidak valid"
        });
      }

      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email sudah digunakan"
        });
      }

      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: "Username sudah digunakan"
        });
      }

      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: await bcrypt.hash(password, 12)
        }
      });

      return res.status(201).json({
        success: true,
        token: signToken({
          id: user.id,
          email: user.email,
          role: "USER"
        })
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server"
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (
        !user ||
        !(await bcrypt.compare(password, user.password))
      ) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah"
        });
      }

      return res.json({
        success: true,
        token: signToken({
          id: user.id,
          email: user.email,
          role: "USER"
        })
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server"
      });
    }
  }

  static async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const admin = await prisma.admin.findUnique({
        where: { email }
      });

      if (
        !admin ||
        !(await bcrypt.compare(password, admin.password))
      ) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah"
        });
      }

      return res.json({
        success: true,
        token: signToken({
          id: admin.id,
          email: admin.email,
          role: "ADMIN"
        })
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server"
      });
    }
  }
    }
