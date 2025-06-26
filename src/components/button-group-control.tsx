"use client";

import { ListDevice } from "@/interface/control";
import { ListLatLong } from "@/interface/map";
import { RuleUserItem } from "@/model/rule";
import { Truck , Power} from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
    
} from "@/components/ui/dialog";






interface Props {
    rule : RuleUserItem
    groupName : string
    groupCode : string
    onReloadLatlong : (typeSearch : string, dataSearch : string) => Promise<ListLatLong[]>;
    onDetail: (group_name : string) => Promise<ListDevice[]>;
    onSendCommand : (typeOpen : string , value : string , commandType : string, dimPercent : string) => Promise<ListLatLong[]>;
}


const ButtonModelControl : React.FC<Props> = ({rule, groupName, groupCode, onDetail , onSendCommand, onReloadLatlong}) => {

    const [isOpen, setIsOpen] = useState(false);
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const [dataListDevice , setDataListDevice] = useState<ListDevice[]>([]);

    const handleOpenDetail = async () => {
        const dataListDevice = await onDetail(groupName);
        setDataListDevice(dataListDevice);

        onOpen();
    }

    return (
        <>
            <Button
                style={{ float : "right"}}
                aria-label="control group"
                disabled = {!rule.control}
                size= "lg"
                className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15"
                onClick={handleOpenDetail}
            > ควบคุม <Power /> 
            </Button>


            <Dialog open={isOpen} onOpenChange={setIsOpen}> 
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>ควบคุม</DialogTitle>
                        <DialogDescription>
                            จัดการกลุ่มและอุปกรณ์ควบคุม
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex w-full flex-col">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-full">
                                Table
                            </div>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default ButtonModelControl;