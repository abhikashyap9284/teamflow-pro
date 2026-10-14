import {NextResponse} from 'next/server';
import {db} from '@/lib/db';

export const dynamic='force-dynamic';
export async function GET(){
  const configured=Boolean(process.env.DATABASE_URL&&process.env.JWT_SECRET&&process.env.JWT_SECRET.length>=32);
  if(!configured)return NextResponse.json({ok:false,error:'Missing DATABASE_URL or JWT_SECRET (at least 32 characters). Set them in .env for localhost and Vercel Environment Variables for production.'},{status:503});
  try{
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ok:true,database:'connected'});
  }catch(error){
    console.error('Health check database error',error);
    return NextResponse.json({ok:false,error:'Database connection failed. Verify DATABASE_URL and run npx prisma db push.'},{status:503});
  }
}
