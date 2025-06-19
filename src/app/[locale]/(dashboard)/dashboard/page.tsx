import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import data from "./data.json";

export default function Page() {
  // ไม่ต้องมี SidebarProvider หรือ AppSidebar ที่นี่อีกแล้ว
  // เหลือแค่ส่วนของเนื้อหาเพียวๆ
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}