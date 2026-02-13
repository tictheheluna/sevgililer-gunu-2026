import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const Proposal = () => {
    const [accepted, setAccepted] = useState(false);
    const [noBtnPosition, setNoBtnPosition] = useState({ top: 'auto', left: 'auto' });

    const handleNoHover = (e) => {
        // Calculate random position within the container
        // We can just use fixed layout or relative to container
        // For simplicity, let's use random transforms
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;

        // Actually, setting state to re-render with new styles logic might be jittery.
        // Let's use direct DOM manipulation or Framer Motion variants for smoother "runaway".
        // Better: Random absolute position if relative? 
        // Let's try transform translate.

        e.target.style.transform = `translate(${x}px, ${y}px)`;
        e.target.style.transition = 'transform 0.2s ease-out';
    };

    const handleYes = () => {
        setAccepted(true);
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#e11d48']
        });
        // Fire more confetti after a delay
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 120,
                origin: { y: 0.7 },
            });
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center relative min-h-[50vh] w-full max-w-4xl mx-auto text-center px-4">

            <AnimatePresence>
                {!accepted ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-12"
                    >
                        <h2 className="font-romantic text-5xl md:text-7xl text-love-600">
                            Benimle sayısız 14 Şubat kutlar mısın?
                        </h2>
                        <div className="flex gap-8 items-center justify-center w-full relative h-32">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleYes}
                                className="px-12 py-4 bg-love-500 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl z-20"
                            >
                                EVET!
                            </motion.button>

                            <motion.button
                                onMouseEnter={handleNoHover}
                                className="px-8 py-3 bg-gray-300 text-gray-600 text-lg font-semibold rounded-full shadow-inner z-10"
                                style={{ position: 'relative' }} // ensure it can be transformed
                            >
                                Hayır
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-2xl border-4 border-love-300"
                    >
                        <div className="w-full max-w-sm aspect-square bg-love-50 rounded-xl mb-6 flex items-center justify-center overflow-hidden mx-auto">
                            <img
                                src="/photos/muah.jpeg"
                                alt="Biz"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-romantic text-5xl text-love-600 mb-4">Seni Çok Seviyorum!</h3>
                        <p className="text-xl text-gray-700">Daha nice güzel anılarımıza...</p>
                        <Heart size={48} className="text-love-500 mt-6 animate-bounce" fill="currentColor" />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Proposal;
