import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
    {
        date: "İlk Tanışma",
        title: "Her Şeyin Başladığı Gün",
        description: "Seni ilk gördüğümde hayatımda sonsuza dek kalacağını biliyordum...",
        image: "/timeline/1.1.jpeg",
    },
    {
        date: "İlk Gecemiz",
        title: "O sabaha kadar süren telefon konuşmamız...",
        description: "O gün ben senin olmak istediğimi anlamıştım.",
        image: "/timeline/1.2.jpeg",
    },
    {
        date: "İlk Buluşmamız",
        title: "Buluşana kadar saniyeler yıllar, ama sen gittikten sonra sanki bir göz kırpışı kadar hızlı :(",
        description: "Seninle geçen her saniye benim için bir hediye.",
        image: "/timeline/1.3.jpeg",
    },
    {
        date: "Bugün",
        title: "Birlikte Geçen Her An",
        description: "Seninle geçen her saniye benim için bir hediye.",
        image: "/timeline/1.4.jpeg",
    },
    {
        date: "Gelecek",
        title: "Sonsuza Dek",
        description: "Daha yazılacak çok hikayemiz var...",
        image: "/timeline/1.5.jpeg",
    }
];

const TimelineItem = ({ data, index }) => (
    <motion.div
        className={`flex w-full mb-12 relative ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
    >
        {/* Center Line Dot */}
        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-love-500 rounded-full border-4 border-white z-10 shadow-md top-6" />

        {/* Content Card */}
        <div className={`w-[45%] p-6 bg-white rounded-xl shadow-lg border border-love-100 relative ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
            <span className="text-love-400 font-bold block mb-2">{data.date}</span>
            <h3 className="text-xl font-bold text-love-700 mb-2">{data.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{data.description}</p>

            {/* Photo */}
            <div className="w-full aspect-square mt-4 rounded-lg overflow-hidden group">
                <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
        </div>
    </motion.div>
);

const Timeline = () => {
    return (
        <div className="w-full max-w-4xl mx-auto relative px-4">
            {/* Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-love-200" />

            {timelineData.map((item, index) => (
                <TimelineItem key={index} data={item} index={index} />
            ))}
        </div>
    );
};

export default Timeline;
