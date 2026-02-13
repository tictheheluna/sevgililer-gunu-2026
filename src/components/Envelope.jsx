import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Envelope = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [zIndex, setZIndex] = useState(10);

    const toggleEnvelope = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Opening: Wait 1.2s (when letter is at top) before bringing to front
            setTimeout(() => {
                setZIndex(50);
            }, 1200);
        } else {
            // Closing: Immediately send to back
            setZIndex(10);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-4 pb-[20vh] w-full bg-transparent">
            <div className="relative w-[720px] h-[480px] cursor-pointer z-10 scale-[0.45] md:scale-90 transition-transform" onClick={toggleEnvelope}>
                {/* Envelope Flap (Top) */}
                <motion.div
                    className="absolute top-0 left-0 w-0 h-0 z-30 origin-top border-l-[360px] border-l-transparent border-t-[250px] border-r-[360px] border-r-transparent border-t-love-500"
                    animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 30 }}
                    transition={{
                        rotateX: { duration: 0.8, ease: "easeInOut" },
                        zIndex: { delay: isOpen ? 0.4 : 0 }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                />

                {/* Envelope Body (Back) */}
                <div className="absolute top-0 left-0 w-full h-full bg-love-300 z-0 rounded-b-3xl shadow-2xl" />

                {/* Letter Inside */}
                <motion.div
                    className="absolute top-4 left-8 right-8 bg-white h-[400px] p-8 shadow-md flex flex-col items-center text-center"
                    initial={{ y: 0, scale: 0.95 }}
                    style={{ zIndex: zIndex }}
                    animate={isOpen ? {
                        y: [0, -480, 20],
                        scale: [0.95, 0.95, 1]
                    } : {
                        y: 0,
                        scale: 0.95
                    }}
                    transition={{
                        delay: 0.5,
                        duration: 2,
                        times: [0, 0.6, 1],
                        ease: "easeInOut"
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title */}
                    <p className="font-romantic text-5xl text-love-800 mb-1 shrink-0">Sevgililer Günün</p>
                    <p className="font-romantic text-5xl text-love-800 mb-4 shrink-0">Kutlu Olsun!</p>

                    {/* Divider */}
                    <div className="w-24 h-0.5 bg-love-300 rounded-full mb-4 shrink-0" />

                    {/* Scrollable message area */}
                    <div className="flex-1 overflow-y-auto w-full px-2 text-love-700 text-lg leading-relaxed font-body scrollbar-thin">
                        <p>
                            Benim canım sevgilim Findanım... Şuan bu satırları 14 Şubata 4 saat kala hazırlıyorum. Aslında dün gece yayında Githuba bu proje için girmiştim. Son dakika hediyesi anlayacağınnn. napalım şuan param olmadığından elimden bu kadarı geldi. Umarım hediyemi beğenirsin. Bu projeyi biraz yapay zeka, birazdan daha az da kendi yeteneğim ve çoookkkkça da sevgimi kattımm. Seninle çıktığım bu yolda türlü badireler ve binlerce güzel zamanlarımız oldu. bir ömüre sığabilecek ama ruhuma sığamayacak kadar büyük şeyler yaşadık. İYİ Kİ DE YAŞADIK, YAŞIYORUZ. Bu 14 Şubattan dileğim sağlıklı, mutlu, huzurlu, güçlü ve en önemlisi senle olan binlerce, yüzbinlerce milyarlarca 14 Şubatı kutlamak. İyi ki varsın sevgilim. seni çok seviyorummmm. MMMMMMMMMMMMMMUUUUUUUUUUUUUUUUUUUUUUUUAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH.
                        </p>
                    </div>

                    <span className="text-sm text-love-400 mt-3 font-body shrink-0">Aşağı kaydır...</span>
                    <Heart className="mt-1 text-love-400 animate-bounce shrink-0" size={18} />
                </motion.div>

                {/* Envelope Front (Left) */}
                <div className="absolute top-0 left-0 w-0 h-0 z-20 pointer-events-none border-t-[240px] border-t-transparent border-l-[360px] border-l-love-400 border-b-[240px] border-b-love-400 rounded-bl-3xl" />

                {/* Envelope Front (Right) */}
                <div className="absolute top-0 right-0 w-0 h-0 z-20 pointer-events-none border-t-[240px] border-t-transparent border-r-[360px] border-r-love-400 border-b-[240px] border-b-love-400 rounded-br-3xl" />

                {/* Envelope Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-0 z-20 pointer-events-none border-l-[360px] border-l-transparent border-b-[240px] border-b-love-500 border-r-[360px] border-r-transparent rounded-b-3xl" />

            </div>

            <p className="mt-12 text-love-600 animate-pulse font-semibold text-3xl font-romantic">
                {isOpen ? "Aşkımızın hikayesini oku..." : "Zarfı açmak için tıkla"}
            </p>
        </div>
    );
};

export default Envelope;
