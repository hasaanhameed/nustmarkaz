import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
    textColor?: string;
}

export function Logo({ className, size = "md", showText = false, textColor }: LogoProps) {
    const heightClasses = {
        sm: "h-6",
        md: "h-10",
        lg: "h-14",
        xl: "h-20",
    };

    return (
        <img
            src="/images/newlogo.jpg"
            alt="Logo"
            className={cn("w-auto object-contain", heightClasses[size], className)}
        />
    );
}
