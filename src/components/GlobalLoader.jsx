import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlobalLoader — A premium, animated loading component.
 * 
 * Props:
 * - message (string): The main loading message. Default: "Loading…"
 * - sub (string): A supporting subtitle. Default: ""
 * - fullScreen (bool): Whether to take full viewport height. Default: true
 * - size (string): "sm" | "md" | "lg". Default: "md"
 */
const GlobalLoader = ({
    message = 'Loading…',
    sub = '',
    fullScreen = true,
    size = 'md',
}) => {
    const sizeMap = {
        sm: { ring: 'w-8 h-8 border-[3px]', text: 'text-sm', dot: 'w-1.5 h-1.5' },
        md: { ring: 'w-14 h-14 border-4', text: 'text-base', dot: 'w-2 h-2' },
        lg: { ring: 'w-20 h-20 border-[5px]', text: 'text-lg', dot: 'w-2.5 h-2.5' },
    };
    const s = sizeMap[size] || sizeMap.md;

    const container = fullScreen
        ? 'min-h-screen'
        : 'min-h-[240px]';

    return (
        <div className={`${container} flex items-center justify-center bg-[#F0F2F5]`}>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center gap-5 px-6 py-10"
            >
                {/* Ring spinner with inner logo dot */}
                <div className="relative flex items-center justify-center">
                    {/* Outer spinning ring */}
                    <div
                        className={`${s.ring} border-green-200 border-t-green-600 rounded-full animate-spin`}
                    />
                    {/* Inner pulsing dot */}
                    <motion.div
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute w-3 h-3 bg-green-600 rounded-full"
                    />
                </div>

                {/* Animated dots */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={`${s.dot} bg-green-500 rounded-full`}
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className={`${s.text} font-black text-[#0f2942]`}>{message}</p>
                    {sub && (
                        <p className="text-sm text-gray-400 font-medium mt-1">{sub}</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default GlobalLoader;
