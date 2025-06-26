"use client";
import React, { FC, useCallback, useMemo, useState, useEffect } from "react";

// --- Shadcn UI & TanStack Table Imports ---
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

// --- Icons ---
import { RefreshCcw, CircleArrowLeft, Search, SendIcon } from "lucide-react";

// --- Your Types, Components, and Hooks ---
import { ListDevice } from "@/interface/control";
import { ListLatLong } from "@/interface/map";
import StaticMapXYZComponent from "@/components/map/map-xyz";
import { useTranslations } from "next-intl";
import { RuleUserItem } from "@/model/rule";
import { columns } from "./group-control-columns"; // <-- Import columns ที่เราสร้างขึ้นมาใหม่

interface TableProps {
  dataRule: RuleUserItem;
  groupName: string;
  groupCode: string;
  listDevice: ListDevice[];
  onReloadLatLong: (typeSearch: string, dataSearch: string) => Promise<ListLatLong[]>;
  onSendCommand: (
    typeOpen: string,
    value: string,
    commandType: string,
    dimPercent: string
  ) => Promise<ListLatLong[]>;
}

const TableControlGroup: FC<TableProps> = ({
  dataRule,
  groupName,
  groupCode,
  listDevice,
  onReloadLatLong,
  onSendCommand,
}) => {
  const t = useTranslations("ControlGroup");

  // --- State Management (ส่วนใหญ่ยังคงเดิม) ---
  const [getListDevice, setListDevice] = useState(listDevice);
  let [isValueSlider, setValueSlider] = useState<number | number[]>([80]); // Slider ของ shadcn รับ Array
  let [isOpenLight, setIsOpenLight] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Timer and Response State (เหมือนเดิม)
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isResponse, setResponse] = useState(0);
  const [isNotResponse, setNotResponse] = useState(0);
  const [data, setData] = useState<Array<ListLatLong>>([]);
  
  // --- TanStack Table State ---
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  // --- Table Instance using useReactTable ---
  const table = useReactTable({
    data: getListDevice,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // --- Logic Functions (ส่วนใหญ่ยังคงเดิม) ---
  // Timer functions (startTimer, stopTimer, etc.) ไม่ต้องแก้ไข
    const startTimer = useCallback(() => {setSeconds(0);
        setIsRunning(true);
        setData([]);
        const id = setInterval(() => {
        setSeconds((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
        return id;
    }, []);

    const stopTimer = useCallback((id: NodeJS.Timeout) => {
      if (id) {
        clearInterval(id);
        setIsRunning(false);
      }
    },[]);

    const formatTime = (time: number): string => { 
        const minutes = Math.floor(time / 60);
        const secs = time % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${
        secs < 10 ? "0" : ""
        }${secs}`;
    };

  // Response control logic (เหมือนเดิม)
  const responseControl = (data: ListLatLong[]) => { 
        let open = 0;
        let close = 0;
        data.forEach(function(element){
            
            if(element.status === "1"){
            open += 1;
            } else if (element.status === "0"){
            close +=1
            }else{
            close +=1
            }
        });
        setResponse(open)
        setNotResponse(close)
   };
  
  // onReloadDataLatLong (ปรับเล็กน้อยเพื่อใช้ rowSelection)
  const onReloadDataLatLong = useCallback(async () => {
    const selectedImsi = table.getFilteredSelectedRowModel().rows.map(row => row.original.imsi);
    const isSelectAll = Object.keys(rowSelection).length === getListDevice.length;

    if (isSelectAll || selectedImsi.length === 0) {
      const result = await onReloadLatLong("group", JSON.stringify([groupCode]));
      if (result) { setData(result); responseControl(result); }
    } else {
      const result = await onReloadLatLong("imsi", JSON.stringify(selectedImsi));
      if (result) { setData(result); responseControl(result); }
    }
  }, [rowSelection, table, groupCode, onReloadLatLong, getListDevice.length]);

  // handleSend (ปรับเล็กน้อยเพื่อใช้ rowSelection)
  const handleSend = useCallback(async () => {
    setIsOpenLight(true);
    const id_time = startTimer();
    setIntervalId(id_time);
    
    const sliderValue = Array.isArray(isValueSlider) ? isValueSlider[0] : isValueSlider;
    const dim = sliderValue === 0 ? "1" : sliderValue!.toString();
    const command = sliderValue === 0 ? "0" : "1";
    
    const selectedImsi = table.getFilteredSelectedRowModel().rows.map(row => row.original.imsi);
    const isSelectAll = Object.keys(rowSelection).length === getListDevice.length;

    let result;
    if (isSelectAll || selectedImsi.length === 0) {
      result = await onSendCommand("group", JSON.stringify([groupCode]), command, dim);
    } else {
      result = await onSendCommand("multi_imsi", JSON.stringify(selectedImsi), command, dim);
    }

    if (result) {
      setData(result);
      responseControl(result);
      stopTimer(id_time);
    }
  }, [rowSelection, isValueSlider, startTimer, onSendCommand, groupCode, table, stopTimer, getListDevice.length]);
  
  const handleBack = useCallback(() => setIsOpenLight(false), []);


  // --- JSX Rendering ---
  return (
    <Skeleton className="w-full rounded-lg">
      {isOpenLight === false ? (
        // --- VIEW 1: Table View ---
        <div className="w-full p-4 space-y-4">
          {/* Top Controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium">{t(`select-brightness`)}</label>
              <Slider
                defaultValue={[80]}
                max={100}
                step={1}
                onValueChange={setValueSlider}
                className="pt-2"
              />
            </div>
            <Button size="lg" onClick={handleSend} disabled={Object.keys(rowSelection).length === 0}>
              {t(`send`)} <SendIcon className="ml-2 h-4 w-4" />
            </Button>
            <Input
              placeholder={t(`search-by-name-imsi`)}
              value={(table.getColumn("street_light_name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("street_light_name")?.setFilterValue(event.target.value)}
              className="col-span-1 md:col-span-2"
            />
          </div>
          
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t(`no-device-found`)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
                <select
                    className="border p-2 rounded-md"
                    value={table.getState().pagination.pageSize}
                    onChange={e => { table.setPageSize(Number(e.target.value)) }}
                    aria-label="Rows per page"
                >
                    {[10, 15, 20].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {t(`previous`)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {t(`next`)}
                </Button>
            </div>
          </div>
        </div>
      ) : (
        // --- VIEW 2: Response View ---
        <div className="p-4 space-y-4">
          <Progress value={isRunning ? undefined : 100} className="w-full" />
           <div className="grid grid-cols-3 gap-4 text-center font-medium">
             <div className="p-2 border rounded-md"> {t(`successes`)} : {isResponse} {t(`lamp`)}</div>
             <div className="p-2 border rounded-md"> {t(`unsuccessful`)} : {isNotResponse} {t(`lamp`)}</div>
             <Button onClick={onReloadDataLatLong} size="lg" className="w-full">
                <RefreshCcw className="h-5 w-5" />
             </Button>
           </div>
           
           <div className="border rounded-md p-4 text-center">
             <h3 className="font-bold text-lg">{t(`command-summary`)}</h3>
             <div className="grid grid-cols-4 gap-2 mt-2">
                <div><strong>{t(`group`)}:</strong> {groupName}</div>
                <div><strong>{t(`command`)}:</strong> { (Array.isArray(isValueSlider) ? isValueSlider[0] : isValueSlider) === 0 ? t(`turn-off`) : t(`turn-on`)}</div>
                <div><strong>{t(`lux`)}:</strong> {Array.isArray(isValueSlider) ? isValueSlider[0] : isValueSlider}</div>
                <div><strong>{t(`time`)}:</strong> {formatTime(seconds)}</div>
             </div>
           </div>

          <StaticMapXYZComponent high="h-[calc(100vh-490px)]" data={data} dataRule={dataRule} />
          
          <Button onClick={handleBack}>
            <CircleArrowLeft className="mr-2 h-5 w-5" /> {t(`back`)}
          </Button>
        </div>
      )}
    </Skeleton>
  );
};

export default TableControlGroup;