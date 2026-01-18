import { LoginForm } from "@/components/ui/features/login/login-form"
import Image from "next/image"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <Image
                            src="/logo_svg.svg"
                            alt="Persona"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                        />
                        <h1 className="text-lg font-bold tracking-wider">Persona</h1>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:flex flex-col gap-20 items-center justify-center text-center">
                <Image
                    src="/logo_svg.svg"
                    alt="Persona"
                    width={200}
                    height={200}
                    className="h-20 w-auto"
                />
                <p className="text-lg font-semibold">Persona adapts to how you work and think.</p>
            </div>
        </div>
    )
}
