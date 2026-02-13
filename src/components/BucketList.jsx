import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

const initialItems = [
    { id: 1, text: "Birlikte Bleach izlemek", done: false },
    { id: 2, text: "Devlet memuru olup seninle evlenmek", done: false },
    { id: 3, text: "Ankara gezisi", done: false },
    { id: 4, text: "Sabaha kadar dans etmek", done: false },
    { id: 5, text: "Birlikte bir evcil hayvan sahiplenmek", done: false },
    { id: 6, text: "Çocukluğum olman", done: false },
    { id: 7, text: "Beraber anime cosplayi yapmak", done: false },
];

const BucketList = () => {
    const [items, setItems] = useState(initialItems);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-love-100">
            <ul className="space-y-4">
                {items.map((item, index) => (
                    <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${item.done ? 'bg-love-50' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleItem(item.id)}
                    >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${item.done ? 'bg-love-500 border-love-500' : 'border-gray-300'}`}>
                            {item.done ? <Check size={18} className="text-white" /> : <Circle size={18} className="text-transparent" />}
                        </div>
                        <span className={`text-lg ${item.done ? 'text-love-800 line-through decoration-love-400' : 'text-gray-700'}`}>
                            {item.text}
                        </span>
                    </motion.li>
                ))}
            </ul>
            <p className="text-center text-love-300 mt-6 text-sm italic">
                (Listeye yenilerini eklemek için tıkla... Şaka, bana söyle ekleyelim!)
            </p>
        </div>
    );
};

export default BucketList;
