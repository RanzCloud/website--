import dotenv from "dotenv"; dotenv.config();
export const env={port:Number(process.env.PORT??3000),jwtSecret:process.env.JWT_SECRET!,frontendUrl:process.env.FRONTEND_URL??"http://localhost:3001"};