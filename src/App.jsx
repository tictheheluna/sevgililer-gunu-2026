import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import Envelope from './components/Envelope';
import Timeline from './components/Timeline';
import RelationshipStats from './components/RelationshipStats';
import Gallery from './components/Gallery';
import Reasons from './components/Reasons';
import BucketList from './components/BucketList';
import Proposal from './components/Proposal';
import HeartCursor from './components/HeartCursor';
import StarBackground from './components/StarBackground';
import InteractiveIntro from './components/InteractiveIntro';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [started, setStarted] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  const startJourney = () => {
    setStarted(true);
    // Initial confetti for the button click
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ffe4e6', '#be123c']
    });
  };

  const handleIntroComplete = () => {
    setShowMainContent(true);
    window.scrollTo(0, 0); // Reset scroll for main content
  };

  return (
    <div className="min-h-screen bg-love-50/50 text-love-900 font-body selection:bg-love-200 overflow-x-hidden">

      <StarBackground />
      <HeartCursor />
      <MusicPlayer />

      {!started && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-love-50/50 backdrop-blur-[1px] px-4 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/heart-necklace.png')] opacity-10 pointer-events-none"></div>
          <h1 className="font-romantic text-7xl md:text-9xl text-love-600 mb-8 animate-pulse drop-shadow-sm">
            Bizim Hikayemiz
          </h1>
          <p className="text-love-800/80 mb-10 text-xl max-w-md font-light">
            Her saniyesine değer... Sesini açmayı unutma.
          </p>
          <button
            onClick={startJourney}
            className="group px-10 py-4 bg-gradient-to-r from-love-500 to-love-600 text-white rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 active:scale-95"
          >
            <Heart fill="white" size={24} className="group-hover:animate-ping" />
            Başla
          </button>
          {/* Music reminder + curvy arrow wrapper */}
          <div className="relative mt-6 z-40">
            <p className="text-love-400 text-base font-medium animate-pulse text-center whitespace-nowrap">
              Müziği açmayı unutma!
            </p>
            {/* Arrow starts directly below the text, extends to bottom-right */}
            <svg
              className="absolute pointer-events-none"
              style={{
                top: '100%',
                left: '50%',
                width: '50vw',
                height: '40vh',
                overflow: 'visible',
              }}
              viewBox="0 0 500 400"
              fill="none"
            >
              {/* 3 bold S-curves, always moving right toward play button */}
              <path
                d="M 0 0
                   Q 40 50, 80 20
                   T 160 80
                   T 240 160
                   T 320 240
                   T 450 350"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="8 5"
                fill="none"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="1000"
                  to="0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              {/* Arrowhead pointing toward play button */}
              <path
                d="M440 335 L455 352 L435 360"
                stroke="#fb7185"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      )}

      {started && !showMainContent && (
        <InteractiveIntro onComplete={handleIntroComplete} />
      )}

      {started && showMainContent && (
        <main className="container mx-auto px-4 py-12 flex flex-col gap-32 pb-64 fade-in">

          <section className="min-h-[70vh] flex flex-col items-center justify-center pt-10">
            <Envelope />
          </section>

          <section className="w-full scroll-mt-20">
            <h2 className="text-4xl md:text-6xl font-romantic text-center mb-16 text-love-700">Zaman Tünelimiz</h2>
            <Timeline />
          </section>

          <section className="w-full scroll-mt-20">
            <h2 className="text-4xl md:text-6xl font-romantic text-center mb-16 text-love-700">İstatistiklerimiz</h2>
            <RelationshipStats />
          </section>

          <section className="w-full scroll-mt-20">
            <h2 className="text-4xl md:text-6xl font-romantic text-center mb-16 text-love-700">Anılarımız</h2>
            <Gallery />
          </section>

          <section className="w-full scroll-mt-20">
            <h2 className="text-4xl md:text-6xl font-romantic text-center mb-16 text-love-700">Seni Sevmemin 11 Nedeni</h2>
            <p className="text-center text-love-400 mb-8 -mt-10">(Kartlara tıklayarak ilerle)</p>
            <Reasons />
          </section>

          <section className="w-full scroll-mt-20">
            <h2 className="text-4xl md:text-6xl font-romantic text-center mb-16 text-love-700">Gelecek Hayallerimiz</h2>
            <BucketList />
          </section>

          <section className="min-h-[60vh] flex flex-col items-center justify-center scroll-mt-20">
            <Proposal />
          </section>

          <footer className="text-center text-love-300 text-sm pb-8">
            Seni Seviyorum ❤️ 2026
          </footer>

        </main>
      )}

    </div>
  );
}

export default App;
