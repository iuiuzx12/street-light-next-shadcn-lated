"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGroupDialog({ open, onOpenChange }: AddGroupDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [groupDesc, setGroupDesc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/group/push-data-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_name: groupName,
          group_desc: groupDesc,
        }),
      })

      if (!response.ok) throw new Error("Failed to create group")

      toast.success("สร้างกลุ่มสำเร็จ", {
        description: `กลุ่ม "${groupName}" ถูกสร้างเรียบร้อยแล้ว`,
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถสร้างกลุ่มได้ กรุณาลองใหม่อีกครั้ง",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setGroupName("")
      setGroupDesc("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มกลุ่มใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อสร้างกลุ่มสำหรับจัดการอุปกรณ์
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-name" className="text-right">ชื่อกลุ่ม</Label>
            <Input id="group-name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="col-span-3" placeholder="เช่น กลุ่ม A, โซน 1"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-desc" className="text-right">รายละเอียด</Label>
            <Input id="group-desc" value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} className="col-span-3" placeholder="เช่น อุปกรณ์โซนด้านหน้า"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !groupName}>
            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}