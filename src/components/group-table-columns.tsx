"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Power, PlusCircle, Trash2 } from "lucide-react";

//สิทธ์ผู้ใช้
import { RuleUserItem } from "@/model/rule";

import { ListGroupAll } from "@/interface/control"; // กรุณาตรวจสอบ Path ของ Interface ให้ถูกต้อง
import { Button } from "@/components/ui/button";
import { ListImsi } from "@/interface/control";

//import {ButtonModelControl} from "@/components/button-group-control"


import React, { useState } from 'react'; // Import useState
import { ListDevice } from "@/interface/control"; // จำเป็นสำหรับ ConfigDeviceDialog และ ManageDialog


import { ControlGroupCommandDialog, AddDeviceToGroupDialog, ManageGroupDevicesDialog } from "./dialogs"


// สร้าง Type สำหรับ Actions ที่จะรับเข้ามา
export type ColumnActions = {
  onSendCommand: (groupCode: string, commandType: 'ON' | 'OFF' | 'DIM', dimPercent: string) => Promise<any>;
  onDeleteGroup: (groupName: string, groupCode: string) => Promise<void>;
  onPushImsi: (groupName: string, groupCode: string, imsi: string) => Promise<ListDevice[] | undefined>;
  onDeleteImsiInGroup: (groupName: string, groupCode: string, imsi: string) => Promise<ListDevice[] | undefined>;
  onConfigDevice: (groupName: string, imsi: string, lat: string, long: string, poleName: string, govName: string) => Promise<ListDevice[] | undefined>;
  fetchImsiList: () => Promise<ListImsi[]>; // ควรเป็น ListImsi[] หรือ type ที่ถูกต้อง
  fetchGroupDetails: (groupName: string) => Promise<ListDevice[]>;
}

// แก้ไข Signature ของฟังก์ชัน columns ให้รับ props
export const columns = (actions: ColumnActions, dataRule: RuleUserItem): ColumnDef<ListGroupAll>[] => [
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
      const group = row.original;
      const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
      const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
      const [isManageDevicesDialogOpen, setIsManageDevicesDialogOpen] = useState(false);

      return (
        <>
          <div className="flex justify-end pr-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCommandDialogOpen(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs"
                disabled={!(dataRule.control ?? false)}
              >
                <Power className="h-3 w-3 text-blue-500" />
                <span>ควบคุม</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddDeviceDialogOpen(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs"
                disabled={!(dataRule.config ?? false)} // เพิ่มอุปกรณ์คือการ config
              >
                <PlusCircle className="h-3 w-3 text-green-500" />
                <span>เพิ่มอุปกรณ์</span>
              </Button>

              <Button // ปุ่มใหม่สำหรับจัดการอุปกรณ์
                variant="outline"
                size="sm"
                onClick={() => setIsManageDevicesDialogOpen(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs"
                // การจัดการอุปกรณ์ (ดู, แก้ไข config, ลบ imsi) ถือเป็นการ config
                disabled={!(dataRule.config ?? false) && !(dataRule.control ?? false)} // อาจจะต้องเปิดให้ control ดูได้ แต่ config แก้ไขได้
              >
                <MoreHorizontal className="h-3 w-3" /> 
                <span>จัดการ</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`คุณแน่ใจหรือไม่ที่จะลบกลุ่ม "${group.group_name}"?`)) {
                    actions.onDeleteGroup(group.group_name, group.group_code);
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                disabled={!(dataRule.config ?? false)}
              >
                <Trash2 className="h-3 w-3" />
                <span>ลบกลุ่ม</span>
              </Button>
            </div>
          </div>

          {/* Dialogs */}
          <ControlGroupCommandDialog
            isOpen={isCommandDialogOpen}
            onClose={() => setIsCommandDialogOpen(false)}
            groupName={group.group_name}
            groupCode={group.group_code}
            onSendCommand={actions.onSendCommand}
          />
          <AddDeviceToGroupDialog
            isOpen={isAddDeviceDialogOpen}
            onClose={() => setIsAddDeviceDialogOpen(false)}
            groupName={group.group_name}
            groupCode={group.group_code}
            onAddDevice={actions.onPushImsi}
            fetchImsiList={actions.fetchImsiList} // Pass the function to fetch IMSIs
          />
          <ManageGroupDevicesDialog
            isOpen={isManageDevicesDialogOpen}
            onClose={() => setIsManageDevicesDialogOpen(false)}
            groupName={group.group_name}
            groupCode={group.group_code}
            fetchGroupDetails={actions.fetchGroupDetails}
            onDeleteImsi={actions.onDeleteImsiInGroup}
            // onOpenConfigDeviceDialog will be handled inside ManageGroupDevicesDialog
            // by potentially opening another ConfigDeviceDialog instance.
            // We need to pass onConfigDevice for that.
            onConfigDevice={actions.onConfigDevice} 
            dataRule={dataRule} // Pass dataRule for disabling actions within the dialog
          />
        </>
      );
    },
    size: 450,
    minSize: 400,
  }
]