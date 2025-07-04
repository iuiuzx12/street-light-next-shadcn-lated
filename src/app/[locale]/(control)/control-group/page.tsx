"use client";

import React from "react";
import { useControlGroup } from "@/hooks/useControlGroup";
import { GroupTable } from "@/components/group-table";
import { columns as createColumns } from "@/components/group-table-columns";

// --- Import Components ที่จะใช้สำหรับ Layout ---
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ControlGroupPage() {
  // Logic เดิมจาก useControlGroup hook
  const { 
    dataRule,
    loading,
    groups,
    addGroup,
    pushImsi,
    deleteGroup,
    deleteImsiInGroup,
    sendCommand,
    dataLatLong,
    imsiData,
    configDevice,
    dataGroupDetail
  } = useControlGroup();

  // สร้าง columns definition - ส่วนนี้ยังคงเหมือนเดิมทุกประการ
  // เพื่อให้ทำงานร่วมกับ group-table-columns.tsx ได้
  const tableColumns = React.useMemo(
    () => createColumns({
      onDelete: deleteGroup,
      onCommand: (groupCode, commandType) => {
        // จากโค้ดเดิมของคุณ มีการส่งค่าคงที่ `groupCode` ไป 2 ครั้ง
        // และ '100' ซึ่งผมคงไว้ตามเดิม
        return sendCommand(groupCode, groupCode, commandType, '100');
      }
    }),
    [deleteGroup, sendCommand]
  );

  // สร้าง Loading Skeleton UI ที่สวยงามขึ้น
  // ออกแบบให้มีเค้าโครงเหมือนหน้าจริงมากที่สุด
  const PageSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            {/* Skeleton ของปุ่ม Add Group ที่อยู่ใน Table Toolbar */}
            <Skeleton className="h-10 w-32" /> 
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Skeleton ของช่อง Search */}
          <Skeleton className="h-10 w-full max-w-sm" /> 
          <div className="border rounded-md">
            {/* Skeleton ของ Table Header */}
            <Skeleton className="h-12 w-full" /> 
            {/* Skeleton ของ Table Body */}
            <Skeleton className="h-64 w-full" /> 
          </div>
          {/* Skeleton ของ Pagination */}
          <div className="flex items-center justify-end space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // --- ส่วนการ Render หลักของหน้า Page ---

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {loading ? (
        // ถ้ายังโหลดอยู่ ให้แสดง Skeleton UI
        <PageSkeleton />
      ) : (
        // เมื่อโหลดเสร็จแล้ว แสดงหน้าจริงใน Card Layout
        <Card x-chunk="dashboard-02-chunk-1">
          <CardHeader>
            <CardTitle>จัดการกลุ่มควบคุม (Group Management)</CardTitle>
            <CardDescription>
              เพิ่ม, ลบ, และส่งคำสั่งควบคุมไปยังกลุ่มอุปกรณ์ทั้งหมด
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* วาง GroupTable Component ไว้ที่นี่ */}
            <GroupTable
              columns={tableColumns}
              data={groups}
              onAddGroup={addGroup}
              // loading prop ไม่จำเป็นต้องส่งให้ GroupTable แล้ว 
              // เพราะเราจัดการ state ที่ page level
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}