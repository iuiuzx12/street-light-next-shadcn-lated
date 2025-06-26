// src/components/dialogs/manage-group-devices-dialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { ListDevice } from '@/app/interface/control'; // Adjust path as needed

interface ManageGroupDevicesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupCode: string;
  // fetchGroupDetails: (groupName: string) => Promise<ListDevice[]>;
  // onDeleteImsi: (groupName: string, groupCode: string, imsi: string) => Promise<any>;
  // onOpenConfigDeviceDialog: (device: ListDevice) => void; // To open another dialog for config
}

import { useState, useEffect, useCallback } from 'react';
import { ListDevice } from '@/interface/control'; // Ensure this path is correct
import { RuleUserItem } from '@/model/rule'; // For checking permissions
import { ConfigDeviceDialog } from './config-device-dialog'; // The dialog for configuring a single device
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";


interface ManageGroupDevicesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupCode: string;
  fetchGroupDetails: (groupName: string) => Promise<ListDevice[]>;
  onDeleteImsi: (groupName: string, groupCode: string, imsi: string) => Promise<ListDevice[] | undefined>;
  onConfigDevice: (groupName: string, imsi: string, lat: string, long: string, poleName: string, govName: string) => Promise<ListDevice[] | undefined>;
  dataRule: RuleUserItem;
}

export const ManageGroupDevicesDialog: React.FC<ManageGroupDevicesDialogProps> = ({
  isOpen,
  onClose,
  groupName,
  groupCode,
  fetchGroupDetails,
  onDeleteImsi,
  onConfigDevice,
  dataRule,
}) => {
  const [devices, setDevices] = useState<ListDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigDeviceDialogOpen, setIsConfigDeviceDialogOpen] = useState(false);
  const [selectedDeviceForConfig, setSelectedDeviceForConfig] = useState<ListDevice | null>(null);

  const loadDevices = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const fetchedDevices = await fetchGroupDetails(groupName);
      setDevices(fetchedDevices || []);
    } catch (error) {
      console.error("Failed to fetch group devices:", error);
      alert(`เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์ในกลุ่ม: ${error instanceof Error ? error.message : String(error)}`);
      setDevices([]);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, groupName, fetchGroupDetails]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleDeleteImsi = async (imsi: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์ IMSI: ${imsi} ออกจากกลุ่ม ${groupName}?`)) {
      return;
    }
    setIsLoading(true); // Indicate loading for the delete operation
    try {
      const updatedDevices = await onDeleteImsi(groupName, groupCode, imsi);
      if (updatedDevices) {
        setDevices(updatedDevices);
      } else {
        // If onDeleteImsi doesn't return the list, reload it.
        // This depends on the API's behavior.
        await loadDevices();
      }
    } catch (error) {
      console.error("Failed to delete IMSI from group:", error);
      alert(`เกิดข้อผิดพลาดในการลบ IMSI: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfigDialog = (device: ListDevice) => {
    setSelectedDeviceForConfig(device);
    setIsConfigDeviceDialogOpen(true);
  };

  const handleConfigDeviceSave = async (gName: string, imsi: string, lat: string, long: string, poleName: string, govName: string) => {
    // This function is passed to ConfigDeviceDialog
    // It will call onConfigDevice and then refresh the list of devices
    setIsLoading(true); // Optionally show loading on the main dialog too
    try {
      const updatedDevices = await onConfigDevice(gName, imsi, lat, long, poleName, govName);
      if (updatedDevices) {
        setDevices(updatedDevices);
      } else {
        await loadDevices(); // Fallback to reload if API doesn't return updated list
      }
      setIsConfigDeviceDialogOpen(false); // Close config dialog on success
    } catch (error) {
      console.error("Failed to configure device:", error);
      // Error alert will be shown in ConfigDeviceDialog, or handle here if preferred
      // For now, let ConfigDeviceDialog handle its own submit errors.
      // alert(`เกิดข้อผิดพลาดในการตั้งค่าอุปกรณ์: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="sm:max-w-2xl"> {/* Increased width for table */}
          <DialogHeader>
            <DialogTitle>จัดการอุปกรณ์ในกลุ่ม: {groupName}</DialogTitle>
            <DialogDescription>
              ดู แก้ไขการตั้งค่า หรือลบอุปกรณ์ออกจากกลุ่มนี้
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            {isLoading && <p className="text-center">กำลังโหลดข้อมูลอุปกรณ์...</p>}
            {!isLoading && devices.length === 0 && (
              <p className="text-center text-gray-500">ไม่พบอุปกรณ์ในกลุ่มนี้</p>
            )}
            {!isLoading && devices.length > 0 && (
              <ScrollArea className="h-[300px] rounded-md border"> {/* Scrollable Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IMSI</TableHead>
                      <TableHead>ชื่ออุปกรณ์</TableHead>
                      <TableHead className="text-right">ดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.imsi}>
                        <TableCell className="font-medium">{device.imsi}</TableCell>
                        <TableCell>{device.imsi || "N/A"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenConfigDialog(device)}
                            disabled={!(dataRule.config ?? false) || isLoading}
                          >
                            ตั้งค่า
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImsi(device.imsi)}
                            disabled={!(dataRule.config ?? false) || isLoading}
                          >
                            ลบ
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedDeviceForConfig && (
        <ConfigDeviceDialog
          isOpen={isConfigDeviceDialogOpen}
          onClose={() => {
            setIsConfigDeviceDialogOpen(false);
            setSelectedDeviceForConfig(null);
          }}
          device={selectedDeviceForConfig}
          groupName={groupName} // Pass groupName
          onConfigDevice={handleConfigDeviceSave} // Pass the wrapper save function
        />
      )}
    </>
  );
};
