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

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      maxAge: -1,
      path: '/',
    });

    return NextResponse.json(
        {
          data: true,
        },
        {
          status: 200,
        }
      );
  } catch {
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
}