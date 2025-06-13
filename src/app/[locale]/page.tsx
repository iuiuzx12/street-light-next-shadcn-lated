"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    
    <div className="flex justify-center items-center h-screen">
      <div className="p-4">
        <Loading/>
      </div>
    </div>
  );
}