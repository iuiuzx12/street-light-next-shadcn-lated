"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Power, PlusCircle, Trash2 } from "lucide-react";

//สิทธ์ผู้ใช้
import { RuleUserItem } from "@/model/rule";

import { ListGroupAll } from "@/interface/control"; // กรุณาตรวจสอบ Path ของ Interface ให้ถูกต้อง
import { Button } from "@/components/ui/button";

//import {ButtonModelControl} from "@/components/button-group-control"


// สร้าง Type สำหรับ Actions ที่จะรับเข้ามา
export type ColumnActions = {
  onCommand: (groupCode: string, commandType: 'ON' | 'OFF' | 'DIM') => void
  onDelete: ( groupName: string , groupCode: string) => void
  // สามารถเพิ่ม Actions อื่นๆ ได้ที่นี่ เช่น onAddDevice
}

// แก้ไข Signature ของฟังก์ชัน columns ให้รับ props
export const columns = (actions: ColumnActions, dataRule : RuleUserItem): ColumnDef<ListGroupAll>[] => [
  {
    accessorKey: "group_name",
    header: "Group Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("group_name")}</div>,
    size: 200, // กำหนดขนาดคอลัมน์
  },
  {
    accessorKey: "count_device",
    header: () => <div className="text-center">Device Count</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("count_device")}</div>;
    },
    size: 120, // กำหนดขนาดคอลัมน์
  },
  {
  id: "actions",
    header: () => <div className="text-right pr-32">Actions</div>,
    cell: ({ row }) => {
      const group = row.original

      return (
        <div className="flex justify-end pr-6"> {/* ใช้ justify-end และ padding-right */}
          <div className="flex gap-2"> {/* ลด gap เป็น 2 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => actions.onCommand(group.group_code, 'ON')}
              className="flex items-center gap-1 px-2 py-1 text-xs"
              
            >
              <Power className="h-3 w-3 text-blue-500" />
              <span>ควบคุม</span>
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alert(`Adding device to ${group.group_name}`)}
              className="flex items-center gap-1 px-2 py-1 text-xs"
              disabled={!(dataRule.control ?? false)}
            >
              <PlusCircle className="h-3 w-3 text-green-500" />
              <span>เพิ่มอุปกรณ์</span>
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (confirm(`คุณแน่ใจหรือไม่ที่จะลบกลุ่ม "${group.group_name}"?`)) {
                  actions.onDelete(group.group_name, group.group_code)
                }
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
              disabled= {!(dataRule.config ?? false)}
            >
              <Trash2 className="h-3 w-3" />
              <span>ลบกลุ่ม</span>
            </Button>
          </div>
        </div>
      )
    },
    size: 450,
    minSize: 400,
  }
]