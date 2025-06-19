"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Power, PlusCircle, Trash2 } from "lucide-react"

import { ListGroupAll } from "@/interface/control" // กรุณาตรวจสอบ Path ของ Interface ให้ถูกต้อง
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// สร้าง Type สำหรับ Actions ที่จะรับเข้ามา
export type ColumnActions = {
  onCommand: (groupCode: string, commandType: 'ON' | 'OFF' | 'DIM') => void
  onDelete: (groupCode: string, groupName: string) => void
  // สามารถเพิ่ม Actions อื่นๆ ได้ที่นี่ เช่น onAddDevice
}

// แก้ไข Signature ของฟังก์ชัน columns ให้รับ props
export const columns = (actions: ColumnActions): ColumnDef<ListGroupAll>[] => [
  {
    accessorKey: "group_name",
    header: "Group Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("group_name")}</div>
  },
  {
    accessorKey: "group_code",
    header: "Group Code",
  },
  {
    accessorKey: "count_device",
    header: () => <div className="text-center">Device Count</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("count_device")}</div>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const group = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>คำสั่ง</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => actions.onCommand(group.group_code, 'ON')}>
                <Power className="mr-2 h-4 w-4 text-blue-500" />
                <span>ควบคุม</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Adding device to ${group.group_name}`)}>
                <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>เพิ่มอุปกรณ์</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  if (confirm(`คุณแน่ใจหรือไม่ที่จะลบกลุ่ม "${group.group_name}"?`)) {
                    actions.onDelete(group.group_code, group.group_name)
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>ลบกลุ่ม</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]