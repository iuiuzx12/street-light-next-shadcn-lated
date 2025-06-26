
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Layout component จะรับ props ชื่อ children ซึ่งคือเนื้อหาของแต่ละหน้า (page.tsx)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {/* ตรงนี้คือจุดสำคัญ! 
            Next.js จะนำเนื้อหาจากไฟล์ page.tsx ของแต่ละหน้ามาใส่แทนที่ {children} ให้เราอัตโนมัติ
          */}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}