import prisma from "../config/prisma";
import {PterodactylService} from "./pterodactyl.service";
import {decrypt} from "../utils/crypto";

export async function provisionOrder(orderId:string){
  const order=await prisma.order.findUnique({where:{id:orderId},include:{product:true,server:true}});
  if(!order) throw new Error("Order tidak ditemukan");
  if(order.paymentStatus!=="PAID") throw new Error("Pembayaran belum PAID");
  if(order.provisioned && order.server) return order.server;

  const password=decrypt(order.encryptedPassword);
  const pUser=await PterodactylService.ensureUser(order.email,order.username,password);
  const getNum=(key:string, fallback:number)=>Number(process.env[key]??fallback);
  const attrs=await PterodactylService.createServer({
    name:order.serverName,userId:pUser.id,
    eggId:getNum("PTERO_EGG_ID",1),nestId:getNum("PTERO_NEST_ID",1),nodeId:getNum("PTERO_NODE_ID",1),
    locationId:process.env.PTERO_LOCATION_ID?Number(process.env.PTERO_LOCATION_ID):undefined,
    memory:order.product.ram,disk:order.product.disk,cpu:order.product.cpu,
    dockerImage:process.env.PTERO_DOCKER_IMAGE??"ghcr.io/pterodactyl/yolks:nodejs_22",
    startup:process.env.PTERO_STARTUP??"npm start",
    environment:{STARTUP_CMD:process.env.PTERO_STARTUP_CMD??"npm start"}
  });
  return prisma.$transaction(async tx=>{
    const server=await tx.server.create({data:{
      orderId:order.id,pteroUserId:pUser.id,pteroServerId:attrs.id,username:order.username,
      serverName:order.serverName,panelUrl:(await (await import("./settings.service")).SettingsService.required("PTERO_URL"))
    }});
    await tx.order.update({where:{id:order.id},data:{provisioned:true}});
    return server;
  });
}
