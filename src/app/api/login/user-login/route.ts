"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    return NextResponse.json(
      { error: "Failed to get admins" },
      {
        status: 500,
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to get admins" },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
    try{
    const data = await req.json();
    const response = await fetch(process.env.API_URL + '/StreetLight/accountLogin',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"   
        },
        body: JSON.stringify(data)
    });

    const dataResponse  = await response.json();
    if(dataResponse.reult === false){
        return NextResponse.json("401", {
            status: 401,
        });
    }else{
        const oneDay = 24 * 60 * 60;
        const cookieStore = await cookies();
        cookieStore.set('token', dataResponse.dataReturn, { expires: Date.now() + oneDay });
        return NextResponse.json("200", {
            status: 200, 
        });
    }
    }catch {
        return NextResponse.json(
            { error: "Server Error" },
            {
                status: 500,
            }
        );
    }
}
