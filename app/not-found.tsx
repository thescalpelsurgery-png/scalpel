"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Activity, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#05221C] flex flex-col items-center justify-center p-4 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-primary/10 blur-3xl"
                        style={{
                            width: Math.random() * 400 + 200,
                            height: Math.random() * 400 + 200,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 50 - 25, 0],
                            y: [0, Math.random() * 50 - 25, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Hexagon pattern background */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <div className="relative z-10 text-center max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative inline-block mb-12">
                        <motion.h1
                            className="text-[12rem] md:text-[18rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/50 to-transparent flex justify-center items-center gap-8"
                            animate={{
                                scale: [1, 1.02, 1],
                                rotateY: [0, 5, 0, -5, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            404
                        </motion.h1>

                        {/* EKG Pulse Line Overlay */}
                        <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 flex items-center overflow-hidden">
                            <motion.div
                                className="w-full h-[3px] bg-primary/50 relative"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="w-24 h-24 text-primary animate-pulse blur-[1px]" />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Page Anatomy <span className="text-primary italic text-2xl md:text-4xl">Not Found</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-md mx-auto leading-relaxed">
                            We've performed a thorough scan, but this specific path seems to have been redirected or removed.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white px-8 py-7 rounded-full text-lg font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(73,94,87,0.3)] hover:shadow-[0_0_50px_rgba(73,94,87,0.5)] transition-all duration-500 group"
                                >
                                    <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                    Return to Surgery
                                </Button>
                            </Link>

                            <Link href="/events">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-primary/30 hover:border-primary text-primary hover:bg-primary/10 px-8 py-7 rounded-full text-lg font-bold flex items-center gap-3 transition-all duration-500"
                                >
                                    <Search className="w-5 h-5" />
                                    Find Events
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Floating Icons */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <motion.div
                        className="absolute top-20 right-0 text-primary/20"
                        animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
                        transition={{ duration: 7, repeat: Infinity }}
                    >
                        <AlertCircle size={80} />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 left-0 text-primary/20"
                        animate={{ y: [0, 30, 0], rotate: [0, -45, 0] }}
                        transition={{ duration: 9, repeat: Infinity }}
                    >
                        <Search size={100} />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
