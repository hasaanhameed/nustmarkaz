import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
    textColor?: string;
}

export function Logo({ className, size = "md", showText = false, textColor }: LogoProps) {
    const heightClasses = {
        sm: "h-10",
        md: "h-14",
        lg: "h-20",
        xl: "h-32",
    };

    return (
        <img
            src="/images/finallogo.png"
            alt="Logo"
            className={cn("w-auto object-contain rounded-2xl", heightClasses[size], className)}
        />
    );
}
