import axios from "axios";
import { SettingsService } from "./settings.service";

type PteroUser={id:number;username:string;email:string};
export class PterodactylService {
  private static async client(){
    const base=(await SettingsService.required("PTERO_URL")).replace(/\/+$/,"");
    const key=await SettingsService.required("PTERO_API_KEY");
    return axios.create({baseURL:`${base}/api/application`,headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json","Accept":"Application/vnd.pterodactyl.v1+json"},timeout:20000});
  }
  static async ensureUser(email:string,username:string,password:string):Promise<PteroUser>{
    const c=await this.client();
    const existing=await c.get("/users",{params:{filter:email}}).catch(()=>null);
    const found=existing?.data?.data?.find((x:any)=>x.attributes?.email===email);
    if(found) return found.attributes;
    const r=await c.post("/users",{email,username,first_name:username,last_name:"Ranz",password,root_admin:false,language:"en"});
    return r.data.attributes;
  }
  static async createServer(input:{name:string;userId:number;eggId:number;nestId:number;nodeId:number;locationId?:number;memory:number;disk:number;cpu:number;dockerImage:string;startup:string;environment:Record<string,string>}){
    const c=await this.client();
    const r=await c.post("/servers",{
      name:input.name,user:input.userId,nest:input.nestId,egg:input.eggId,docker_image:input.dockerImage,
      startup:input.startup,environment:input.environment,
      limits:{memory:input.memory,swap:0,disk:input.disk,io:500,cpu:input.cpu},
      feature_limits:{databases:0,allocations:1,backups:0},
      deployment:{locations:input.locationId?[input.locationId]:[],dedicated_ip:false,port_range:[]},
      start_on_completion:true
    });
    return r.data.attributes;
  }
}
