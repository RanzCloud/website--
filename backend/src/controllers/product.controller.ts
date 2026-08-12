import {Request,Response} from "express"; import prisma from "../config/prisma";
export class ProductController{
 static async publicList(_q:Request,r:Response){r.json({success:true,data:await prisma.product.findMany({where:{active:true},orderBy:{createdAt:"desc"}})})}
 static async adminList(_q:Request,r:Response){r.json({success:true,data:await prisma.product.findMany({orderBy:{createdAt:"desc"}})})}
 static async create(q:Request,r:Response){const x=q.body;const d=await prisma.product.create({data:{name:String(x.name),ram:Number(x.ram),disk:Number(x.disk),cpu:Number(x.cpu),price:Number(x.price),description:x.description?String(x.description):undefined,active:x.active!==false}});r.status(201).json({success:true,data:d})}
 static async update(q:Request,r:Response){const d=await prisma.product.update({where:{id:q.params.id},data:q.body});r.json({success:true,data:d})}
 static async remove(q:Request,r:Response){await prisma.product.delete({where:{id:q.params.id}});r.json({success:true})}
}