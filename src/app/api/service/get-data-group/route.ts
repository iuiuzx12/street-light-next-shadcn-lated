"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type {ListImsi} from "@/interface/control";
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
      process.env.API_URL + "/StreetLight/getListDataGroup",
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
      
      interface ApiGroupItem {
        groupCode: string;
        groupName: string;
        // Add other properties from the API response here if they exist.
      }

      

      // 3. Apply the types to the map function and the resulting array.
      const transformedArray: ListImsi[] = dataResponse.dataReturn.map((item: ApiGroupItem) => ({
        key: item.groupCode,
        value: item.groupName,
      }));

      return NextResponse.json(
        {
          data: transformedArray,
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
