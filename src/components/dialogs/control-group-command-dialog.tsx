// src/components/dialogs/control-group-command-dialog.tsx
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

interface ControlGroupCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupCode: string;

  onSendCommand: (groupCode: string, commandType: 'ON' | 'OFF' | 'DIM', dimPercent: string) => void;
}


import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

export const ControlGroupCommandDialog: React.FC<ControlGroupCommandDialogProps> = ({
  isOpen,
  onClose,
  groupName,
  groupCode,
  onSendCommand,
}) => {
  const [commandType, setCommandType] = useState<'ON' | 'OFF' | 'DIM'>('ON');
  const [dimPercent, setDimPercent] = useState<string>('100');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSendCommand(groupCode, commandType, commandType === 'DIM' ? dimPercent : '100');
      onClose(); // Close dialog on success
    } catch (error) {
      console.error("Failed to send command:", error);
      // TODO: Show error message to user
      alert(`เกิดข้อผิดพลาดในการส่งคำสั่ง: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose(); // Reset state if needed when closing via overlay click or Esc
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ควบคุมกลุ่ม: {groupName}</DialogTitle>
          <DialogDescription>
            เลือกคำสั่งและค่าที่ต้องการส่งไปยังกลุ่มอุปกรณ์นี้
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup
            value={commandType}
            onValueChange={(value: 'ON' | 'OFF' | 'DIM') => setCommandType(value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ON" id="cmd-on" />
              <Label htmlFor="cmd-on">ON (เปิด)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OFF" id="cmd-off" />
              <Label htmlFor="cmd-off">OFF (ปิด)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DIM" id="cmd-dim" />
              <Label htmlFor="cmd-dim">DIM (หรี่)</Label>
            </div>
          </RadioGroup>

          {commandType === 'DIM' && (
            <div className="space-y-2">
              <Label htmlFor="dim-percent">เปอร์เซ็นต์การหรี่ (0-100)</Label>
              <Input
                id="dim-percent"
                type="number"
                min="0"
                max="100"
                value={dimPercent}
                onChange={(e) => setDimPercent(e.target.value)}
                placeholder="เช่น 50"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'กำลังส่ง...' : 'ยืนยันและส่งคำสั่ง'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
