"use client";

import { useControlGroup } from "@/hooks/useControlGroup";
import { GroupTable } from "@/components/group-table";
import { columns } from "@/components/group-table-columns";

export default function ControlGroupPage() {
  const { 
    groups, 
    loading, 
    addGroup, 
    deleteGroup, 
    sendCommand 
  } = useControlGroup();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Control Group Management</h1>
      
      <GroupTable
        // เรียกใช้ฟังก์ชัน columns() และส่ง actions ที่จำเป็นเข้าไป
        columns={columns({
          onDelete: deleteGrou,
          onCommand: (groupCode, commandType) => {
            return sendCommand(groupCode, groupCode, commandType, '100');
          }
        })}
        data={groups}
        onAddGroup={addGroup}
      />
    </div>
  );
}