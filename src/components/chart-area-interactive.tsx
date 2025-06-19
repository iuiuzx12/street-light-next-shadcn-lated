// file: components/MyDashboard.tsx

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" // จาก shadcn/ui
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart" // จาก shadcn/ui
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react"

// 1. สร้าง Chart Component ที่ปรับปรุงแล้ว
// ----------------------------------------------------
const SalesAreaChart = () => {
  // ข้อมูลจากโค้ดเดิมของคุณ
  const originalLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const originalData = [120, 200, 150, 400, 280, 350];

  // 2. แปลงข้อมูลให้อยู่ในรูปแบบที่ Recharts ต้องการ
  // ใช้ useMemo เพื่อประสิทธิภาพ ไม่ต้องคำนวณใหม่ทุกครั้งที่ re-render
  const chartData = useMemo(() => {
    return originalLabels.map((label, index) => ({
      month: label,
      sales: originalData[index] || 0,
    }));
  }, [originalLabels, originalData]);

  // 3. กำหนดค่า Config สำหรับ Chart
  const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--primary))", // ใช้สีหลักจาก theme ของ shadcn/ui
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Data</CardTitle>
        <CardDescription>Total sales over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month" // key สำหรับแกน X จากข้อมูลของเรา
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value} // แสดง label ตามที่ให้มา
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="sales" // key สำหรับข้อมูลแกน Y
              type="natural"
              fill="url(#fillSales)"
              stroke="var(--color-sales)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


// 4. สร้าง Dashboard Component หลักที่รวมทุกอย่าง
// ----------------------------------------------------
export const ChartAreaInteractive: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* ส่วนของการ์ด 4 ใบ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนการใช้งาน</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 ครั้ง</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะการเชื่อมต่อ</CardTitle>
            <XCircleIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Disconnected</div>
            <p className="text-xs text-muted-foreground">Last connected: 2 days ago</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะออนไลน์</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
             <p className="text-xs text-muted-foreground">Since 10:30 AM</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค่าไฟ</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">ต่ำกว่าเกณฑ์</div>
             <p className="text-xs text-muted-foreground">Check power source</p>
          </CardContent>
        </Card>
      </div>

      {/* ส่วนของกราฟ */}
      <div>
        <SalesAreaChart />
      </div>
    </div>
  )
}

