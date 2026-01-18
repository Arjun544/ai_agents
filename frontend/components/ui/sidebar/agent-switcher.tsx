"use client"

import { ChevronDown } from "lucide-react"
import Image from "next/image"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAgent } from "@/context/agent-context"

export function AgentSwitcher() {
    const { agents, activeAgent, setActiveAgent } = useAgent()

    if (!activeAgent) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="w-fit px-1.5">
                            <Image
                                src="/logo_svg.svg"
                                alt="Persona"
                                width={120}
                                height={40}
                                className="h-6 w-auto"
                            />
                            <span className="truncate font-medium">{activeAgent.name}</span>
                            <ChevronDown className="opacity-50" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-64 rounded-lg"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Agents
                        </DropdownMenuLabel>
                        {agents.map((agent, index) => (
                            <DropdownMenuItem
                                key={agent.name}
                                onClick={() => setActiveAgent(agent)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-8 items-center justify-center rounded-md border">
                                    <agent.logo className="size-4 shrink-0" />
                                </div>
                                {agent.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
