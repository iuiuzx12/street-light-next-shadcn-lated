import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button as ShadcnButton } from "../ui/button";

import { X, Check, Power, PowerOff, Sunset, Timer, Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import { Switch } from "../ui/switch";

interface Props {
  disabled: boolean;
  deviceId: string;
  typeMode: string;
  using: boolean;
}

const ThumbIcon = ({ typeMode }: { typeMode: string }) => {
  if (typeMode === "time") return <Timer className="h-4 w-4 text-slate-500" />;
  if (typeMode === "manual") return <Hand className="h-4 w-4 text-slate-500" />;
  return <Sunset className="h-4 w-4 text-slate-500" />;
};

const ButtonModeAuto: React.FC<Props> = ({ disabled, deviceId, typeMode, using }) => {
  const t = useTranslations("ControlIndividual");
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {setIsOpen(true)};
  const onClose = () => {setIsOpen(false)};
  const [selected, setSelected] = useState(using);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState("");

  const handleOpenDetail = () => {
    setLoading(false);
    setSuccess("");
    onOpen();
  };

  const handleCancel = () => {
    setLoading(false);
    setSuccess("");
    onClose();
  };

  const handleConfirmChange = () => {
    fetchSetmode();
    setLoading(true);
    setSuccess("");
  };

  const fetchSetmode = async (): Promise<any> => {
    try {
      const res = await fetch("/api/command/set-mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          mode:
            selected === true
              ? "manual"
              : typeMode === "manual"
              ? "light"
              : typeMode,
          imsi: deviceId,
          wait_time: "10",
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await res.json();
      if (result.data === "") {
        setLoading(false);
        setSuccess("false");
        //onClose();
      } else {
        setLoading(false);
        setSuccess("true");
        setSelected(!selected);
        onClose();
      }
      return "data";
    } catch (error) {
      console.error("Error fetching users:", error);
      return "data";
    }
  };

  return (
    <>
        <div className="flex items-center gap-2">
            {/* End Content (PowerOff) */}
            <PowerOff className={`h-5 w-5 ${selected ? 'text-slate-400' : 'text-green-500'}`} />

            <Switch
                checked={selected}
                disabled={!disabled}
                onCheckedChange={handleOpenDetail}
                className="data-[state=checked]:bg-green-500" // <-- การปรับสี
            />
            
            {/* Start Content (Power) */}
            <Power className={`h-5 w-5 ${selected ? 'text-green-500' : 'text-slate-400'}`} />

            {/* Thumb Icon (วางไว้ข้างๆ) */}
            <div className="p-1 border rounded-md">
                <ThumbIcon typeMode={typeMode} />
            </div>
        </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <h1 className="text-center">
                {t(`device-id`)} {deviceId} ?
              </h1>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <ShadcnButton
              disabled={isLoading}
              className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
              onClick={handleConfirmChange}
            >
              {isLoading ? "" : <Check />}
            </ShadcnButton>
            <ShadcnButton
              className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15 w-full"
              onClick={handleCancel}
            >
              <X />
            </ShadcnButton>
          </div>
          <DialogFooter className="self-center">
            <h1 className={isSuccess === "false" ? "text-red-500" : "text-green-500"}>
              {isSuccess === "false"
                ? t(`unsuccessful`)
                : isSuccess === ""
                ? ""
                : t(`successes`)}
            </h1>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ButtonModeAuto;