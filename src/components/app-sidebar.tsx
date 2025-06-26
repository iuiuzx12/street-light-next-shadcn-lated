"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "ภาพรวม",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "ภาพรวม Period",
          url: "/dashboard",
        },
        {
          title: "ภาพรวม Daily",
          url: "#",
        }
      ],
    },
    {
      title: "ควบคุม",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "แบบกลุ่ม",
          url: "/control-group",
        },
        {
          title: "ตั้งเวลา",
          url: "#",
        },
        {
          title: "รายโคม",
          url: "#",
        },
      ],
    },
    {
      title: "แผนที่",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "แผนที่ทั้งหมด",
          url: "#",
        },
        {
          title: "ขาดการเชื่อมต่อ",
          url: "#",
        }    
      ],
    },
    {
      title: "ตั้งค่า",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "จัดการผู้ใช้",
          url: "#",
        },
        {
          title: "ตั้งค่าเมนู",
          url: "#",
        },
        {
          title: "ตั้งค่าการแจ้งเตือน",
          url: "#",
        }
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
