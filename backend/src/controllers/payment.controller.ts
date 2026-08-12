import {Request,Response} from "express";
import prisma from "../config/prisma";
import {AksesPGService} from "../services/aksespg.service";
import {provisionOrder} from "../services/provisioning.service";

export class PaymentController {
 static async status(q:Request,r:Response){
  const order=await prisma.order.findUnique({where:{invoice:q.params.invoice},include:{server:true}});
  if(!order || order.userId!==q.user?.id) return r.status(404).json({success:false,message:"Order not found"});

  if(order.paymentStatus==="PENDING" && order.depositId){
    try{
      const payment=await AksesPGService.status(order.depositId);
      const s=String(payment.status||"").toLowerCase();
      if(["success","paid","settled","completed"].includes(s)){
        await prisma.order.update({where:{id:order.id},data:{
          paymentStatus:"PAID",
          paymentReference:order.depositId
        }});
        try { await provisionOrder(order.id); }
        catch(e){ console.error("Provisioning after payment failed:",e); }
      } else if(["expired","cancelled","failed"].includes(s)){
        await prisma.order.update({where:{id:order.id},data:{paymentStatus:s.toUpperCase()}});
      }
    }catch(e){ console.error("AksesPG status check:",e); }
  }

  const fresh=await prisma.order.findUnique({where:{id:order.id},include:{server:true}});
  r.json({success:true,data:{
    invoice:fresh!.invoice,
    status:fresh!.paymentStatus,
    provisioned:fresh!.provisioned,
    server:fresh!.server?{
      panelUrl:fresh!.server.panelUrl,
      username:fresh!.server.username,
      serverName:fresh!.server.serverName
    }:null
  }});
 }
 static async webhook(q:Request,r:Response){
   // Keamanan utama menggunakan polling resmi Check Status AksesPG.
   // Endpoint ini tetap tersedia jika AksesPG nantinya menyediakan webhook.
   return r.status(410).json({success:false,message:"Use AksesPG Check Status polling"});
 }
}
