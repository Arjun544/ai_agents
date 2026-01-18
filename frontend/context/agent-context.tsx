"use client"

import {
    Activity,
    Calendar,
    DollarSign,
    GraduationCap,
    User,
} from "lucide-react"
import * as React from "react"

export type Agent = {
    name: string
    logo: React.ElementType
}

interface AgentContextType {
    activeAgent: Agent
    setActiveAgent: (agent: Agent) => void
    agents: Agent[]
}

const AgentContext = React.createContext<AgentContextType | undefined>(undefined)

// Sample data moved here
const initialAgents: Agent[] = [
    {
        name: "Personal",
        logo: User,
    },
    {
        name: "Planner",
        logo: Calendar,
    },
    {
        name: "Coach",
        logo: GraduationCap,
    },
    {
        name: "Health",
        logo: Activity,
    },
    {
        name: "Finance",
        logo: DollarSign,
    },
]

export function AgentProvider({ children }: { children: React.ReactNode }) {
    // Default to the first agent
    const [activeAgent, setActiveAgent] = React.useState<Agent>(initialAgents[0])

    return (
        <AgentContext.Provider value={{ activeAgent, setActiveAgent, agents: initialAgents }}>
            {children}
        </AgentContext.Provider>
    )
}

export function useAgent() {
    const context = React.useContext(AgentContext)
    if (context === undefined) {
        throw new Error("useAgent must be used within an AgentProvider")
    }
    return context
}
