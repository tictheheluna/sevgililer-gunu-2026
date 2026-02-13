import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Calendar, MapPin, Phone, Coffee } from 'lucide-react';

const stats = [
    { icon: Calendar, label: "Birlikte Geçen Gün", value: 187, suffix: " gün", color: "from-love-200 to-love-400" },
    { icon: Heart, label: "Söylenen Seni Seviyorum", value: 9999, suffix: "+", color: "from-love-300 to-love-500" },
    { icon: MessageCircle, label: "Gönderilen Mesaj Boyutu", value: 5.9, suffix: "+ GB", color: "from-love-200 to-love-300" },
    { icon: Phone, label: "Telefon Görüşmesi", value: 160, suffix: "+ saat", color: "from-love-300 to-love-400" },
    { icon: MapPin, label: "Birlikte Gezilen Yer", value: 12, suffix: " yer", color: "from-love-200 to-love-400" },
    { icon: Coffee, label: "Paylaşılan Kahve", value: Infinity, suffix: " fincan", color: "from-love-300 to-love-500" },
];

// Animated counter that counts up when visible
const AnimatedNumber = ({ target, suffix }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isFinite(target)) return; // Skip animation for Infinity
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 2000;
                    const steps = 60;
                    const increment = target / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref} className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm">
            {isFinite(target) ? count.toLocaleString('tr-TR') : '∞'}{suffix}
        </span>
    );
};

const RelationshipStats = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        className={`relative overflow-hidden rounded-2xl p-6 text-center bg-gradient-to-br ${stat.color} shadow-xl`}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-2 right-2 opacity-10">
                            <Icon size={80} />
                        </div>

                        <Icon className="mx-auto mb-3 text-white/90" size={28} />
                        <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                        <p className="text-white/80 text-sm mt-2 font-medium">{stat.label}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default RelationshipStats;
