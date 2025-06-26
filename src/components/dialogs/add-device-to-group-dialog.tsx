// src/components/dialogs/add-device-to-group-dialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label'; // Assuming Label is in ui folder
import { ListImsi } from '@/interface/control';

// Mock interface, replace with actual import

interface AddDeviceToGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupCode: string;
  onAddDevice: (groupCode: string, groupName: string, imsi: string) => Promise<any>;
  fetchImsiList: () => Promise<ListImsi[]>; // Ensure this returns the correct type
}

export const AddDeviceToGroupDialog: React.FC<AddDeviceToGroupDialogProps> = ({
  isOpen,
  onClose,
  groupName,
  groupCode,
  onAddDevice,
  fetchImsiList,
}) => {
  const [imsiList, setImsiList] = useState<ListImsi[]>([]);
  const [selectedImsi, setSelectedImsi] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingImsi, setIsFetchingImsi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFetchingImsi(true);
      fetchImsiList()
        .then((data) => {
          setImsiList(data || []); // Ensure data is an array
          setSelectedImsi(''); // Reset selection
        })
        .catch(error => {
          console.error("Failed to fetch IMSI list:", error);
          alert(`เกิดข้อผิดพลาดในการดึงรายการ IMSI: ${error instanceof Error ? error.message : String(error)}`);
          setImsiList([]); // Set to empty array on error
        })
        .finally(() => setIsFetchingImsi(false));
    }
  }, [isOpen, fetchImsiList]);

  const handleAdd = async () => {
    if (!selectedImsi) {
      alert('กรุณาเลือก IMSI ที่ต้องการเพิ่ม');
      return;
    }
    setIsLoading(true);
    try {
      await onAddDevice(groupCode, groupName, selectedImsi);
      onClose(); // Close dialog on success
    } catch (error) {
      console.error("Failed to add device to group:", error);
      alert(`เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์เข้ากลุ่ม: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มอุปกรณ์เข้ากลุ่ม: {groupName}</DialogTitle>
          <DialogDescription>
            เลือก IMSI ของอุปกรณ์ที่ต้องการเพิ่มเข้ากลุ่มนี้
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isFetchingImsi ? (
            <p>กำลังโหลดรายการ IMSI...</p>
          ) : imsiList.length === 0 ? (
            <p>ไม่พบข้อมูล IMSI หรือไม่สามารถโหลดได้</p>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="imsi-select">เลือก IMSI</Label>
              <Select
                value={selectedImsi}
                onValueChange={setSelectedImsi}
                disabled={isLoading}
              >
                <SelectTrigger id="imsi-select">
                  <SelectValue placeholder="-- กรุณาเลือก IMSI --" />
                </SelectTrigger>
                <SelectContent>
                  {imsiList.map((item) => (
                    <SelectItem key={item.imsi} value={item.imsi}>
                      {item.imsi}{item.device_name ? ` (${item.device_name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button onClick={handleAdd} disabled={isLoading || isFetchingImsi || imsiList.length === 0}>
            {isLoading ? 'กำลังเพิ่ม...' : 'เพิ่มอุปกรณ์'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
