import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernBackgroundProps {
    className?: string;
    variant?: "blobs" | "geometric" | "combined";
}

export function ModernBackground({
    className,
    variant = "combined",
}: ModernBackgroundProps) {
    return (
        <div className={cn("fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background", className)}>
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-grid-subtle opacity-20" />

            {/* Background Blobs (The "Emotional" Layer) */}
            {(variant === "blobs" || variant === "combined") && (
                <div className="absolute inset-0 overflow-hidden opacity-60">
                    <motion.div
                        animate={{
                            x: [0, 100, -50, 0],
                            y: [0, -150, 50, 0],
                            scale: [1, 1.2, 0.9, 1],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-primary/40"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 80, 0],
                            y: [0, 120, -60, 0],
                            scale: [1, 0.8, 1.1, 1],
                        }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-accent/40"
                    />
                </div>
            )}

            {/* Geometric Structures (The "Logical/Journey" Layer) */}
            {(variant === "geometric" || variant === "combined") && (
                <div className="absolute inset-0 overflow-hidden">
                    {/* Animated Line 1 */}
                    <motion.div
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rotate-[-15deg]"
                    />

                    {/* Floating Geometric Shapes */}
                    <GeometricShape delay={0} size={150} x="10%" y="20%" rotate={45} />
                    <GeometricShape delay={2} size={200} x="80%" y="15%" rotate={-25} type="triangle" />
                    <GeometricShape delay={4} size={120} x="70%" y="70%" rotate={15} type="circle" />
                    <GeometricShape delay={1} size={180} x="15%" y="65%" rotate={60} />

                    {/* Connecting Lines (Journey Paths) */}
                    <svg className="absolute inset-0 w-full h-full opacity-25">
                        <motion.path
                            d="M 100,200 Q 400,100 700,400 T 1200,200"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                </div>
            )}

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}

function GeometricShape({
    size, x, y, rotate, delay, type = "rect"
}: {
    size: number; x: string; y: string; rotate: number; delay: number; type?: "rect" | "triangle" | "circle"
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1],
                rotate: [rotate, rotate + 10, rotate - 10, rotate],
                y: [0, -20, 0]
            }}
            transition={{
                duration: 8,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ width: size, height: size, left: x, top: y }}
            className="absolute flex items-center justify-center"
        >
            <div className={cn(
                "w-full h-full border border-primary/40 backdrop-blur-md shadow-2xl",
                type === "rect" && "rounded-3xl",
                type === "triangle" && "clip-path-triangle", // Needs utility in tailwind
                type === "circle" && "rounded-full"
            )}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[inherit]" />
            </div>
        </motion.div>
    );
}
