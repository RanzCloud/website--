"use client";
import {useParams} from "next/navigation";
import {useEffect,useState} from "react";
import {api,authHeader} from "@/lib/api";

export default function Payment(){
 const {invoice}=useParams<{invoice:string}>();
 const [d,setD]=useState<any>();
 const [o,setO]=useState<any>();

 useEffect(()=>{
   const x=localStorage.getItem(`invoice:${invoice}`);
   if(x)setD(JSON.parse(x));
   const tick=()=>api.get(`/orders/${invoice}/status`,{headers:authHeader()})
     .then(x=>setO(x.data.data)).catch(()=>{});
   tick();
   const id=setInterval(tick,5000);
   return()=>clearInterval(id);
 },[invoice]);

 return <main className="mx-auto max-w-xl px-6 pt-32 text-center">
  <div className="glass rounded-3xl p-8">
   <h1 className="text-3xl font-black">Pembayaran QRIS</h1>
   <p className="mt-3 text-slate-400">{invoice}</p>
   {o?.status==="PAID"&&o?.server ? <>
     <p className="mt-6 text-emerald-300">Pembayaran berhasil. Panel sudah aktif.</p>
     <div className="mt-6 rounded-2xl bg-black/30 p-5 text-left">
       <p>Username: <b>{o.server.username}</b></p>
       <p className="mt-2">Password: <b>Password yang kamu isi saat checkout</b></p>
       <p className="mt-2">Server: <b>{o.server.serverName}</b></p>
     </div>
     <a href={o.server.panelUrl} target="_blank" className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black">Buka Panel</a>
   </> : <>
     <p className="mt-6 text-2xl text-cyan-300">Rp {d?.amount?.toLocaleString("id-ID")}</p>
     <div className="mt-6 rounded-2xl bg-white p-5 text-black">
       <div className="mb-3 text-sm text-slate-600">Scan QRIS dari aplikasi pembayaran kamu</div>
       <div className="break-all">{d?.qrString??"Memuat QR..."}</div>
     </div>
     <p className="mt-6 text-amber-300">{o?.status??"PENDING"} — otomatis mengecek pembayaran...</p>
   </>}
  </div>
 </main>
}
