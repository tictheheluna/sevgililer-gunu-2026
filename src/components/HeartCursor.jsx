import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeartCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const newHeart = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY
            };

            setTrail((prev) => [...prev.slice(-10), newHeart]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Clean up old trail items
    useEffect(() => {
        const interval = setInterval(() => {
            setTrail((prev) => prev.filter(item => Date.now() - item.id < 500));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
            {/* Main Cursor */}
            <div
                className="fixed w-4 h-4 bg-love-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
                style={{ left: position.x, top: position.y }}
            />

            {/* Trail */}
            <AnimatePresence>
                {trail.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.5, y: -20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed text-love-400 text-xl font-bold"
                        style={{ left: heart.x, top: heart.y }}
                    >
                        ♥
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HeartCursor;
