import axios from "axios";
import { SettingsService } from "./settings.service";

export class AksesPGService {
  static async createDeposit(amount:number){
    const base=(await SettingsService.required("AKSESPG_BASE_URL")).replace(/\/+$/,"");
    const key=await SettingsService.required("AKSESPG_API_KEY");
    const r=await axios.post(`${base}/v1/deposit/create`,
      {amount,method:"qris"},
      {headers:{"X-API-Key":key,"Content-Type":"application/json"},timeout:15000});
    if(!r.data?.success || !r.data?.data?.depositId) throw new Error("Respons Create Deposit AksesPG tidak valid");
    return r.data.data as {depositId:string;amount:number;totalAmount:number;qrString:string;status:string};
  }

  static async status(depositId:string){
    const base=(await SettingsService.required("AKSESPG_BASE_URL")).replace(/\/+$/,"");
    const key=await SettingsService.required("AKSESPG_API_KEY");
    const r=await axios.get(`${base}/v1/deposit/status/${encodeURIComponent(depositId)}`,
      {headers:{"X-API-Key":key},timeout:15000});
    if(!r.data?.success) throw new Error("Respons Check Status AksesPG tidak valid");
    return r.data.data as {status:string;paidAmount?:number};
  }
}
