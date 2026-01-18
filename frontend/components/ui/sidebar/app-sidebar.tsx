"use client"

import {
    Edit2,
    Home
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar"
import { AgentSwitcher } from "./agent-switcher"
import { NavHistory } from "./nav-history"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
    navUser: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/logo_svg.svg",
    },
    navMain: [
        {
            title: "New Chat",
            url: "#",
            icon: Edit2,
            isActive: false,
        },
        {
            title: "Home",
            url: "#",
            icon: Home,
            isActive: true,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <AgentSwitcher />
                <NavMain items={data.navMain} />
            </SidebarHeader>
            <SidebarContent>
                <NavHistory />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.navUser} />
            </SidebarFooter>
        </Sidebar>
    )
}
