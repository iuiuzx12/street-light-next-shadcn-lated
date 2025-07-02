// src/components/dialogs/config-device-dialog.tsx
import React from 'react';
// import { ListDevice } from '@/app/interface/control'; // Adjust path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';


import { useState, useEffect } from 'react';
import { ListDevice } from '@/interface/control'; // Adjust path
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfigDeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  device: ListDevice | null; // Can be null if no device is selected
  groupName: string;
  onConfigDevice: (groupName: string, imsi: string, lat: string, long: string, poleName: string, govName: string) => Promise<any>;
}

export const ConfigDeviceDialog: React.FC<ConfigDeviceDialogProps> = ({
  isOpen,
  onClose,
  device,
  groupName,
  onConfigDevice,
}) => {
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [poleName, setPoleName] = useState('');
  const [govName, setGovName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (device && isOpen) {
      setLat(device.lat || '');
      setLong(device.long || '');
      setPoleName(device.street_light_name || '');
      setGovName(device.gov_name || '');
    } else if (!isOpen) {
      // Reset form when dialog is closed
      setLat('');
      setLong('');
      setPoleName('');
      setGovName('');
    }
  }, [device, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!device?.imsi) return;

    setIsLoading(true);
    try {
      await onConfigDevice(groupName, device.imsi, lat, long, poleName, govName);
      onClose(); // Close dialog on success
    } catch (error) {
      console.error("Failed to save device configuration:", error);
      alert(`เกิดข้อผิดพลาดในการบันทึกการตั้งค่า: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !device) return null; // Don't render if not open or no device

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if(!openState) onClose();}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ตั้งค่าอุปกรณ์: {device.imsi}</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลการตั้งค่าสำหรับอุปกรณ์ IMSI: {device.imsi}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="เช่น 13.7563" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="long">Longitude</Label>
              <Input id="long" value={long} onChange={(e) => setLong(e.target.value)} placeholder="เช่น 100.5018" disabled={isLoading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="poleName">ชื่อเสา (Pole Name)</Label>
            <Input id="poleName" value={poleName} onChange={(e) => setPoleName(e.target.value)} placeholder="เช่น Pole A-001" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="govName">ชื่อหน่วยงาน (Gov Name)</Label>
            <Input id="govName" value={govName} onChange={(e) => setGovName(e.target.value)} placeholder="เช่น กฟน." disabled={isLoading} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
