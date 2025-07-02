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
  const hookValues = useControlGroup();
  const {
    dataRule,
    loading,
    groups,
    addGroup,
    // --- Functions to be passed to columns ---
    // deleteGroup, // Now part of columnActions
    // sendCommand, // Now part of columnActions
    // pushImsi,
    // deleteImsiInGroup,
    // configDevice,
    // imsiData,
    // dataGroupDetail,
  } = hookValues;

  const tableColumns = React.useMemo(() => {
    // สร้าง object `columnActions` ที่จะส่งให้ createColumns
    // โดย map functions จาก hook useControlGroup
    const columnActions = {
      // commandType จะถูกกำหนดโดย Dialog, dimPercent ก็เช่นกัน
      onSendCommand: (groupCode: string, commandType: 'ON' | 'OFF' | 'DIM', dimPercent: string) => {
        return hookValues.sendCommand("group", groupCode, commandType, dimPercent);
      },
      onDeleteGroup: hookValues.deleteGroup,
      onPushImsi: hookValues.pushImsi,
      onDeleteImsiInGroup: hookValues.deleteImsiInGroup,
      onConfigDevice: hookValues.configDevice,
      fetchImsiList: hookValues.imsiData, // Function to get list of all IMSIs
      fetchGroupDetails: hookValues.dataGroupDetail, // Function to get devices in a group
    };

    return createColumns(columnActions, dataRule || {}); // ส่ง dataRule ไปด้วย, ถ้ายังไม่มีให้เป็น object ว่าง
  }, [hookValues, dataRule]);

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