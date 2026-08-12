import {Request,Response} from "express"; import prisma from "../config/prisma"; import {SettingsService} from "../services/settings.service";
const secrets=new Set(["PTERO_API_KEY","AKSESPG_API_KEY"]);
export class SettingsController{
 static async list(_q:Request,r:Response){const rows=await prisma.setting.findMany({orderBy:{key:"asc"}});r.json({success:true,data:rows.map(x=>({key:x.key,value:secrets.has(x.key)?"********":x.value}))})}
 static async save(q:Request,r:Response){const {key,value}=q.body;if(!key||typeof value!=="string")return r.status(400).json({success:false,message:"Invalid setting"});if(secrets.has(key)&&value==="********")return r.json({success:true});await SettingsService.set(key,value);r.json({success:true})}
}