import React from 'react';
import { motion } from 'framer-motion';

const photos = [
    { id: 1, src: '/photos/1.jpeg', caption: "Gülüşün..." },
    { id: 2, src: '/photos/2.jpeg', caption: "Birlikte..." },
    { id: 3, src: '/photos/3.jpeg', caption: "Maceralarımız" },
    { id: 4, src: '/photos/4.jpeg', caption: "Huzur" },
    { id: 5, src: '/photos/5.jpeg', caption: "Sürprizler" },
    { id: 6, src: '/photos/6.jpeg', caption: "Sonsuzluk" },
];

const Gallery = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto p-4">
            {photos.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/5] md:aspect-square bg-white p-2"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ rotate: Math.random() * 4 - 2, scale: 1.02 }}
                >
                    <div className="w-full h-full overflow-hidden rounded-lg relative">
                        <img
                            src={photo.src}
                            alt={photo.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-romantic text-3xl drop-shadow-md">{photo.caption}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Gallery;
