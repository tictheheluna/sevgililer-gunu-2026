import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const reasons = [
    "Bana baktığında dünyayı durduruyorsun.",
    "En kötü günlerimi bile aydınlatıyorsun.",
    "Fazla zekisin.",
    "Benimle saçmalamayı seviyorsun.",
    "Hayallerime ortak oluyorsun.",
    "Varlığın bana huzur veriyor.",
    "Sarılınca evimde hissediyorum.",
    "Sinirlendiğinde çok tatlı oluyorsun",
    "Beni olduğum gibi seviyorsun.",
    "Birlikte büyüyoruz.",
    "Sen, sensin. Sadece bu bile yeter.",
    "Ve daha sayamayacağım sonsuzlarca 11 neden..."
];

const Reasons = () => {
    const [index, setIndex] = useState(0);

    const nextReason = () => {
        setIndex((prev) => (prev + 1) % reasons.length);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">

            <div className="relative w-80 h-96 md:w-96 md:h-[500px]">
                <AnimatePresence mode="popLayout">
                    {reasons.slice(index, index + 3).reverse().map((reason, i) => {
                        // Calculate actual index in the reasons array
                        const actualIndex = (index + (2 - i)) % reasons.length;
                        const isTop = actualIndex === index;

                        return (
                            <motion.div
                                key={`${actualIndex}-${index}`} // Unique key to force re-render/animate
                                className={`absolute inset-0 bg-white rounded-2xl shadow-xl border border-love-100 flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none
                            ${isTop ? 'z-30' : i === 1 ? 'z-20' : 'z-10'}`}
                                style={{
                                    scale: isTop ? 1 : 1 - (2 - i) * 0.05,
                                    y: isTop ? 0 : (2 - i) * 20,
                                    rotate: isTop ? 0 : (Math.random() - 0.5) * 5
                                }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, scale: isTop ? 1 : 1 - (2 - i) * 0.05, y: isTop ? 0 : (2 - i) * 20 }}
                                exit={{ x: 300, opacity: 0, rotate: 20 }}
                                transition={{ duration: 0.5 }}
                                onClick={isTop ? nextReason : undefined}
                                whileHover={isTop ? { scale: 1.05 } : {}}
                                whileTap={isTop ? { cursor: 'grabbing' } : {}}
                            >
                                <Heart className="text-love-500 mb-6" size={48} fill={actualIndex === reasons.length - 1 ? "currentColor" : "none"} />
                                <h3 className="font-romantic text-3xl md:text-4xl text-love-800 leading-relaxed">
                                    {reason}
                                </h3>
                                <span className="absolute bottom-4 text-xs text-love-300 font-sans">
                                    {actualIndex + 1} / {reasons.length}
                                </span>
                                {isTop && (
                                    <span className="absolute -bottom-12 text-sm text-love-400 animate-bounce">
                                        Sonrakini görmek için tıkla
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default Reasons;
