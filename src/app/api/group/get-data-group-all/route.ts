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
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const data = await req.json();
    const response = await fetch(
      process.env.API_URL + "/StreetLight/getListDataGroupAll",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
        body: JSON.stringify(data),
      }
    );

    const dataResponse = await response.json();
    if (dataResponse.result === false) {
      return NextResponse.json("401", {
        status: 401,
      });
    } else {

      return NextResponse.json(
        {
          data: dataResponse.dataReturn,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    
    console.log(error);
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
}
