import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StarBackground = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const starCount = 70;
        const colors = ['#FFD700', '#FF1493', '#FFFFFF', '#FF69B4', '#00FFFF']; // Gold, DeepPink, White, HotPink, Cyan

        const newStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 2, // Larger stars (2px to 5px)
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        backgroundColor: star.color,
                        boxShadow: `0 0 ${star.size * 2}px ${star.color}` // Dynamic glow matching color
                    }}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1], // Pulse effect
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.delay
                    }}
                />
            ))}
        </div>
    );
};

export default StarBackground;
