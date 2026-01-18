"use client"

import {
    ArrowUpRight,
    Link as LinkIcon,
    LogIn,
    MoreHorizontal,
    StarOff,
    Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { SignInButton, useAuth } from "@clerk/nextjs"

interface History {
    name: string
    url: string
    emoji: string
}

export function NavHistory() {
    const { isMobile } = useSidebar()
    const { isSignedIn } = useAuth()
    const history: History[] = [];

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>History</SidebarGroupLabel>

            {!isSignedIn && (
                <div className="px-2">
                    <Card className="shadow-none border-dashed">
                        <CardContent className="p-4 text-center space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Sign in to view your history and save your chats.
                                </p>
                            </div>
                            <SignInButton mode="modal">
                                <Button size="sm" className="w-full h-8" variant="outline">
                                    <LogIn className="mr-2 size-3" />
                                    Sign In
                                </Button>
                            </SignInButton>
                        </CardContent>
                    </Card>
                </div>
            )}
            <SidebarMenu>
                {history.map((item: History) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url} title={item.name}>
                                <span>{item.emoji}</span>
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <StarOff className="text-muted-foreground" />
                                    <span>Remove from Favorites</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LinkIcon className="text-muted-foreground" />
                                    <span>Copy Link</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ArrowUpRight className="text-muted-foreground" />
                                    <span>Open in New Tab</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Trash2 className="text-muted-foreground" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
