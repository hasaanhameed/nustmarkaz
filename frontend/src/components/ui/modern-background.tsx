import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernBackgroundProps {
    className?: string;
    blobColor1?: string;
    blobColor2?: string;
    blobColor3?: string;
}

export function ModernBackground({
    className,
    blobColor1 = "bg-primary/10",
    blobColor2 = "bg-accent/10",
    blobColor3 = "bg-blue-400/10",
}: ModernBackgroundProps) {
    return (
        <div className={cn("fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background", className)}>
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-grid-subtle opacity-100" />

            {/* Dynamic Blobs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -150, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className={cn("absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px]", blobColor1)}
            />

            <motion.div
                animate={{
                    x: [0, -100, 80, 0],
                    y: [0, 120, -60, 0],
                    scale: [1, 0.8, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className={cn("absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px]", blobColor2)}
            />

            <motion.div
                animate={{
                    x: [0, 150, -100, 0],
                    y: [0, 80, 150, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className={cn("absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full blur-[140px]", blobColor3)}
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
