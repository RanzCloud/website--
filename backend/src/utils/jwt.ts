import jwt from "jsonwebtoken"; import {env} from "../config/env";
export type AuthPayload={id:string;role:"USER"|"ADMIN";email?:string};
export const signToken=(p:AuthPayload)=>jwt.sign(p,env.jwtSecret,{expiresIn:"7d"});
export const verifyToken=(t:string)=>jwt.verify(t,env.jwtSecret) as AuthPayload;