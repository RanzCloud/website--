import {Request,Response} from "express"; import bcrypt from "bcryptjs"; import prisma from "../config/prisma"; import {AksesPGService} from "../services/aksespg.service"; import {encrypt} from "../utils/crypto";
export class CheckoutController{
 static async create(q:Request,r:Response){
  const {productId,username,email,password,serverName}=q.body;
  if(!productId||!username||!email||!password||!serverName)return r.status(400).json({success:false,message:"Data checkout belum lengkap"});
  const p=await prisma.product.findFirst({where:{id:productId,active:true}});if(!p)return r.status(404).json({success:false,message:"Produk tidak ditemukan"});
  const dep=await AksesPGService.createDeposit(p.price);const invoice=`RZ-${Date.now()}`;
  const o=await prisma.order.create({data:{invoice,productId:p.id,userId:q.user?.id,email,username,passwordHash:await bcrypt.hash(password,12),encryptedPassword:encrypt(password),serverName,amount:p.price,depositId:dep.depositId}});
  r.status(201).json({success:true,data:{invoice:o.invoice,depositId:dep.depositId,qrString:dep.qrString,amount:dep.totalAmount??p.price,status:"PENDING"}})
 }
}