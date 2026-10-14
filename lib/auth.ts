import {cookies} from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';
import {db} from './db';
const secret=()=>{if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32)throw new Error('Set JWT_SECRET (at least 32 characters)');return new TextEncoder().encode(process.env.JWT_SECRET)};
export async function createToken(id:string){return new SignJWT({sub:id}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret())}
export async function currentUser(){try{const token=(await cookies()).get('teamflow_session')?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret());if(!payload.sub)return null;return await db.user.findUnique({where:{id:payload.sub},select:{id:true,name:true,email:true,role:true}})}catch{return null}}
export const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/',maxAge:60*60*24*7};
