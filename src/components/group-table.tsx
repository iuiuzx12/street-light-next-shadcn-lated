"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusCircle, Users, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogProps
} from "@/components/ui/customDialog";
import {Label, Input} from '@/components/ui/formDialog';



import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "./ui/badge";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];


  

interface GroupDialogProps {
  onGroupCreate?: (groupName: string) => void;
  onGroupCreateAsync?: (groupName: string) => Promise<void>;
  className?: string;
  buttonText?: string;
  maxLength?: number;
  validation?: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => string | null;
  };
}

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

const statuCsolorMap: Record <string, BadgeVariant> = {
  active : "success",
  paused : "destructive",
  vacation : "warning"
}




const INITIAL_VISIBLE_COLUMNS = ["group_name", "sub_district", "total_rtu", "actions"];

// Interface สำหรับ Props ที่ Component นี้รับเข้ามา
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAddGroup: (groupName: string) => Promise<boolean>
}

export function GroupTable<TData, TValue>({
  columns,
  data,
  onAddGroup,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [isDialogOpen, setDialogOpen] = React.useState(false)
  const [newGroupName, setNewGroupName] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleSaveNewGroup = async () => {
    if (!newGroupName.trim()) {
      alert("กรุณากรอกชื่อกลุ่ม")
      return
    }
    const success = await onAddGroup(newGroupName)
    if (success) {
      setNewGroupName("")
      setDialogOpen(false)
    } else {
      alert("เกิดข้อผิดพลาดในการเพิ่มกลุ่ม")
    }
  }

  return (
    <div className="w-full">
      {/* --- Toolbar --- */}
      <div className="flex items-center py-4">
        <Input
          placeholder="ค้นหาชื่อกลุ่ม..."
          value={(table.getColumn("group_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("group_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มกลุ่มใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>สร้างกลุ่มใหม่</DialogTitle>
              <DialogDescription>
                กรอกชื่อสำหรับกลุ่มใหม่ที่นี่ กดบันทึกเพื่อยืนยัน
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  ชื่อกลุ่ม
                </Label>
                <Input
                  id="name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="col-span-3"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNewGroup()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveNewGroup}>บันทึก</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Table --- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* --- Pagination --- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          ทั้งหมด {table.getFilteredRowModel().rows.length} กลุ่ม
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ก่อนหน้า
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          ถัดไป
        </Button>
      </div>
    </div>
  )
}