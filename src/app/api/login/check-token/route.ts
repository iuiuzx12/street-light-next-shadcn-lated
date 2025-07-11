"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST() {
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

export async function GET() {
  try {
    
    const token = (await cookies()).get("token");
    const response = await fetch (process.env.API_URL + '/StreetLight/checkLogin' , {
      method: 'POST',
      headers: {
        "Authorization" : "Bearer " + token?.value
      },
    });

    const dataResponse = await response.json();
    
    if(dataResponse.result === false){
      return NextResponse.json("401", {
        status: 401,
      });
    }else{
      return NextResponse.json("200", {
        status: 200,
      });
    }
    
  } catch  {
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
}