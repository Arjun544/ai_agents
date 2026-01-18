import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // // Prefetch proposals for server-side rendering
    // prefetch(trpc.proposal.getRecent.queryOptions({ limit: 10 }));
    // // Prefetch user credits for server-side rendering
    // prefetch(trpc.user.getCredits.queryOptions());
    // const queryClient = getQueryClient();
    // const dehydratedState = dehydrate(queryClient);

    // Fetch session on server for faster initial load
    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // });

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full">
                <AppSidebar />
                {/* <HydrateClient>
                    <AppSidebar
                        dehydratedState={dehydratedState}
                        initialSession={session}
                    />
                </HydrateClient> */}
                <SidebarInset className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-white px-6">
                        <SidebarTrigger />
                    </header>
                    <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
