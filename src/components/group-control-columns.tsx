// src/components/group-control-columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ListDevice } from "@/interface/control" // ตรวจสอบ path
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Copy } from "lucide-react"
import Image from "next/image"

// Helper สำหรับการ Copy Text
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // อาจจะเพิ่ม toast notification ที่นี่
}

export const columns: ColumnDef<ListDevice>[] = [
  {
    accessorKey: "street_light_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Street Light Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.street_light_name
      return (
        <div className="flex items-center gap-2">
          <span>{name}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(name)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "gov_name",
    header: "Governor",
  },
  {
    accessorKey: "imsi",
    header: "IMSI",
     cell: ({ row }) => {
      const imsi = row.original.imsi
      return (
        <div className="flex items-center gap-2">
          <span>{imsi}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(imsi)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
    {
    accessorKey: "last_command",
    header: "Last Command",
  },
  {
    accessorKey: "last_update",
    header: "Last Update",
  },
    {
    accessorKey: "last_power",
    header: "Last Power",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      // คุณต้องมี icons object นี้ในไฟล์ หรือ import มา
      const icons: { [key: number]: string } = {
        0: "/icon/lamp/lamp-gray-a.png",
        1: "/icon/lamp/lamp-gray-m.png",
        2: "/icon/lamp/lamp-gray-e.png",
        3: "/icon/lamp/lamp-gray-dis.png",
        4: "/icon/lamp/lamp-green-a.png",
        5: "/icon/lamp/lamp-green-m.png",
        6: "/icon/lamp/lamp-green-e.png",
        7: "/icon/lamp/lamp-green-dis.png",
        8: "/icon/lamp/lamp-yellow.png",
        9: "/icon/lamp/lamp-blue-a.png",
        10: "/icon/lamp/lamp-red-dis24.png",
    };
      return <Image src={icons[Number(status)]} width={30} height={30} alt={`status-${status}`} />
    }
  },
]