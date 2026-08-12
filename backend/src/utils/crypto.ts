import crypto from "crypto";
const key = () => {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw) throw new Error("APP_ENCRYPTION_KEY belum dikonfigurasi");
  return crypto.createHash("sha256").update(raw).digest();
};
export function encrypt(text:string){
  const iv=crypto.randomBytes(12), cipher=crypto.createCipheriv("aes-256-gcm",key(),iv);
  const data=Buffer.concat([cipher.update(text,"utf8"),cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${data.toString("base64url")}`;
}
export function decrypt(payload:string){
  const [ivS,tagS,dataS]=payload.split(".");
  const decipher=crypto.createDecipheriv("aes-256-gcm",key(),Buffer.from(ivS,"base64url"));
  decipher.setAuthTag(Buffer.from(tagS,"base64url"));
  return Buffer.concat([decipher.update(Buffer.from(dataS,"base64url")),decipher.final()]).toString("utf8");
}
