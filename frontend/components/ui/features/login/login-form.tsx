import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { MailIcon } from "lucide-react"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <h1 className="text-2xl font-bold">Let's get you logged in</h1>
                <Field>
                    <Button variant="outline" type="button">
                        <MailIcon />
                        Continue with Google
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
