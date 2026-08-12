import prisma from "../config/prisma";
export class SettingsService{
 static async get(key:string){const x=await prisma.setting.findUnique({where:{key}});return x?.value??null}
 static async required(key:string){const v=await this.get(key);if(!v)throw new Error(`Setting ${key} belum dikonfigurasi`);return v}
 static async set(key:string,value:string){return prisma.setting.upsert({where:{key},update:{value},create:{key,value}})}
}