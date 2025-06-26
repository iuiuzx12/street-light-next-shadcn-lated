"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddGroupDialog } from "./dialogs/add-group-dialog" // import dialog ที่แก้ไขแล้ว
import { ChevronDown, PlusCircle } from "lucide-react"

export function AddItemDropdown() {
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false)

  return (
    <>
      {/* วาง Dialog ไว้ที่นี่ และส่ง state กับ function 
        เพื่อควบคุมการเปิด-ปิด 
      */}
      <AddGroupDialog
        open={isAddGroupDialogOpen}
        onOpenChange={setIsAddGroupDialogOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <PlusCircle className="mr-2 h-4 w-4" />
            เพิ่ม
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* เมื่อกดเมนูนี้ ให้สั่งเปิด Dialog */}
          <DropdownMenuItem onSelect={() => setIsAddGroupDialogOpen(true)}>
            เพิ่มกลุ่มใหม่
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            เพิ่มอุปกรณ์ (เร็วๆ นี้)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}