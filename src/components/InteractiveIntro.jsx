import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const RESISTANCE_ZONE = 0.96;  // Start resistance at 96% of track
const HOLD_DURATION = 3000;    // 3 seconds of holding at 100% before break

const InteractiveIntro = ({ onComplete }) => {
    const [stage, setStage] = useState(0);
    const [displayValue, setDisplayValue] = useState(0);
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [nextShake, setNextShake] = useState(false);

    // Refs for zero-rerender drag
    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const fillRef = useRef(null);
    const extTrackRef = useRef(null);
    const extFillRef = useRef(null);
    const cardRef = useRef(null);
    const crackRef = useRef(null);
    const isDraggingRef = useRef(false);
    const currentX = useRef(0);
    const rafId = useRef(null);
    const lastDisplayUpdate = useRef(0);

    // Resistance & break state
    const hasBrokenRef = useRef(false);
    const resistStartTime = useRef(null); // timestamp when thumb hits 100%
    const shakeTimerRef = useRef(null);
    const breakTimerRef = useRef(null);
    const reachedEdgeRef = useRef(false); // true when thumb has reached 100%

    const handleNoHover = () => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setNoButtonPos({ x, y });
    };

    const getLoveMessage = (val) => {
        if (val === 0) return "Hadi ama... 🥺";
        if (val < 100) return `Bu kadar mı? (%${val})`;
        if (val < 1000) return "Daha fazlası! 🚀";
        if (val < 5000) return "Sonsuzluğa ve ötesine! ✨❤️";
        return "WOOOW Beni bu kadar çok mu seviyorsun?? 🥰💖";
    };

    // Card shake effect (via CSS transform, no rerender)
    const shakeCard = useCallback((intensity) => {
        const card = cardRef.current;
        if (!card) return;
        const dx = (Math.random() - 0.5) * intensity;
        const dy = (Math.random() - 0.5) * intensity * 0.5;
        card.style.transform = `translate(${dx}px, ${dy}px)`;
        // Reset after a frame
        if (shakeTimerRef.current) cancelAnimationFrame(shakeTimerRef.current);
        shakeTimerRef.current = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (card) card.style.transform = '';
            });
        });
    }, []);

    // Break-through burst effect with crack visual
    const triggerBreak = useCallback(() => {
        const card = cardRef.current;
        const crack = crackRef.current;
        if (!card) return;

        // Show crack effect at the edge
        if (crack) {
            crack.style.opacity = '1';
            crack.style.transform = 'translate(-50%, -50%) scale(1)';
            // Fade out crack after animation
            setTimeout(() => {
                if (crack) {
                    crack.style.opacity = '0';
                    crack.style.transform = 'translate(-50%, -50%) scale(0.5)';
                }
            }, 600);
        }

        // Big shake
        card.style.transform = 'scale(1.03)';
        setTimeout(() => { if (card) card.style.transform = ''; }, 200);

        // Confetti burst from right edge of track
        const trackEl = trackRef.current;
        if (trackEl) {
            const rect = trackEl.getBoundingClientRect();
            const cx = rect.right / window.innerWidth;
            const cy = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 50,
                spread: 80,
                startVelocity: 25,
                origin: { x: cx, y: cy },
                colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#ffd700'],
                gravity: 0.8,
                ticks: 80,
            });
        }

        // Reset thumb glow
        if (thumbRef.current) thumbRef.current.style.boxShadow = '';
    }, []);

    // Direct DOM update — no React rerender during drag
    const updateVisuals = useCallback((rawMouseX) => {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        const fill = fillRef.current;
        const extTrack = extTrackRef.current;
        const extFill = extFillRef.current;
        if (!track || !thumb) return;

        const trackWidth = track.getBoundingClientRect().width;
        const resistStart = trackWidth * RESISTANCE_ZONE;
        let visualX = Math.max(0, rawMouseX);

        // --- Phase logic ---
        if (!hasBrokenRef.current) {
            if (rawMouseX >= resistStart) {
                if (!reachedEdgeRef.current) {
                    // PHASE 1: Resistance from 96% → 100%
                    // Thumb moves slowly toward the edge with dampened movement
                    const delta = rawMouseX - resistStart;
                    const dampRange = trackWidth - resistStart;
                    // Cubic ease-out: fast at first, slows near edge
                    const rawProgress = Math.min(delta / (dampRange * 3), 1); // need 3x the range to reach 100%
                    const dampened = resistStart + dampRange * (1 - Math.pow(1 - rawProgress, 3));
                    visualX = Math.min(dampened, trackWidth);

                    // Mild shake during Phase 1
                    const shakeIntensity = 1 + rawProgress * 4;
                    shakeCard(shakeIntensity);

                    // Check if thumb visually reached the edge
                    if (dampened >= trackWidth * 0.998) {
                        reachedEdgeRef.current = true;
                        // Start Phase 2: 3-second hold timer
                        resistStartTime.current = performance.now();
                        if (breakTimerRef.current) clearTimeout(breakTimerRef.current);
                        breakTimerRef.current = setTimeout(() => {
                            if (!hasBrokenRef.current && isDraggingRef.current) {
                                hasBrokenRef.current = true;
                                resistStartTime.current = null;
                                reachedEdgeRef.current = false;
                                triggerBreak();
                            }
                        }, HOLD_DURATION);
                    }
                } else {
                    // PHASE 2: Holding at 100% — thumb pinned at edge
                    visualX = trackWidth;

                    const elapsed = performance.now() - (resistStartTime.current || performance.now());
                    const holdProgress = Math.min(elapsed / HOLD_DURATION, 1);

                    // Escalating shake over 3 seconds
                    const shakeIntensity = 3 + holdProgress * 14;
                    shakeCard(shakeIntensity);
                }
            } else {
                // Left the resistance zone — reset everything
                reachedEdgeRef.current = false;
                if (resistStartTime.current !== null) {
                    resistStartTime.current = null;
                }
                if (breakTimerRef.current) {
                    clearTimeout(breakTimerRef.current);
                    breakTimerRef.current = null;
                }
            }
        } else {
            // Already broken through — free movement beyond edge
        }

        const clampedX = Math.max(0, visualX);

        // Thumb position via transform (GPU composited)
        thumb.style.transform = `translate(${clampedX}px, -50%)`;

        // Scale & glow thumb during resistance phases
        if (!hasBrokenRef.current && rawMouseX >= resistStart) {
            let pressure = 0;
            if (reachedEdgeRef.current && resistStartTime.current !== null) {
                // Phase 2: escalating pressure based on hold time
                const elapsed = performance.now() - resistStartTime.current;
                pressure = Math.min(elapsed / HOLD_DURATION, 1);
            } else {
                // Phase 1: mild pressure
                const delta = rawMouseX - resistStart;
                const dampRange = trackWidth - resistStart;
                pressure = Math.min(delta / (dampRange * 3), 1) * 0.3;
            }
            const sc = 1 + pressure * 0.35;
            thumb.style.transform = `translate(${clampedX}px, -50%) scale(${sc})`;
            thumb.style.boxShadow = `0 0 ${pressure * 25}px rgba(225,29,72,${pressure * 0.8})`;
        } else if (hasBrokenRef.current) {
            thumb.style.boxShadow = '';
        }

        // Fill width
        const fillPct = Math.min((clampedX / trackWidth) * 100, 100);
        if (fill) fill.style.width = `${fillPct}%`;

        // Overflow track (only if broken through)
        const isOver = hasBrokenRef.current && clampedX > trackWidth;
        const overflowPx = isOver ? clampedX - trackWidth : 0;

        if (extTrack) {
            extTrack.style.width = `${overflowPx}px`;
            extTrack.style.opacity = isOver ? '1' : '0';
        }
        if (extFill) {
            extFill.style.width = `${overflowPx}px`;
            extFill.style.opacity = isOver ? '1' : '0';
        }

        // Compute love value
        let newValue;
        if (clampedX <= trackWidth) {
            newValue = (clampedX / trackWidth) * 100;
        } else {
            const extra = clampedX - trackWidth;
            newValue = 100 + Math.pow(extra, 1.5);
        }
        const rounded = Math.floor(newValue);

        // Throttle React state update to every 80ms
        const now2 = performance.now();
        if (now2 - lastDisplayUpdate.current > 80) {
            lastDisplayUpdate.current = now2;
            setDisplayValue(rounded);
        }
        currentX.current = clampedX;
    }, [shakeCard, triggerBreak]);

    const handlePointerDown = useCallback((e) => {
        e.preventDefault();
        (e.target).setPointerCapture(e.pointerId);
        isDraggingRef.current = true;
        // Reset break state if starting from scratch (thumb is back at start)
        if (currentX.current < (trackRef.current?.getBoundingClientRect().width || 300) * RESISTANCE_ZONE) {
            hasBrokenRef.current = false;
            reachedEdgeRef.current = false;
            resistStartTime.current = null;
        }
        if (thumbRef.current) thumbRef.current.style.cursor = 'grabbing';
    }, []);

    const handlePointerMove = useCallback((e) => {
        if (!isDraggingRef.current || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Use rAF for smooth, batched DOM writes
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            updateVisuals(x);
        });
    }, [updateVisuals]);

    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
        if (thumbRef.current) {
            thumbRef.current.style.cursor = 'grab';
            thumbRef.current.style.boxShadow = '';
        }
        // Reset card transform & resistance state
        if (cardRef.current) cardRef.current.style.transform = '';
        reachedEdgeRef.current = false;
        resistStartTime.current = null;
        if (breakTimerRef.current) {
            clearTimeout(breakTimerRef.current);
            breakTimerRef.current = null;
        }
        // Final state sync
        setDisplayValue(() => {
            const track = trackRef.current;
            if (!track) return 0;
            const trackWidth = track.getBoundingClientRect().width;
            const x = currentX.current;
            if (x <= trackWidth) return Math.floor((x / trackWidth) * 100);
            return Math.floor(100 + Math.pow(x - trackWidth, 1.5));
        });
    }, []);

    useEffect(() => {
        const moveFn = handlePointerMove;
        const upFn = handlePointerUp;
        window.addEventListener('pointermove', moveFn, { passive: true });
        window.addEventListener('pointerup', upFn);
        return () => {
            window.removeEventListener('pointermove', moveFn);
            window.removeEventListener('pointerup', upFn);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [handlePointerMove, handlePointerUp]);

    const handleYesClick = () => {
        setStage(2);
        confetti({
            particleCount: 200,
            spread: 150,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#bae6fd']
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">

            <AnimatePresence mode="wait">
                {/* STAGE 1: Love Meter */}
                {stage === 0 && (
                    <motion.div
                        key="love-meter"
                        ref={cardRef}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 mx-4 border border-white/50"
                        style={{ overflow: 'visible', willChange: 'transform' }}
                    >
                        <h2 className="text-3xl font-romantic text-love-600 mb-2">Gülfidanım, sevgilim...</h2>
                        <p className="text-love-800 mb-8 text-lg">Beni ne kadar seviyorsun?</p>

                        {/* Track Area */}
                        <div className="mb-8 relative w-full h-12 flex items-center" style={{ overflow: 'visible' }}>
                            <div
                                className="relative w-full h-3 bg-gray-200 rounded-full"
                                ref={trackRef}
                                style={{ overflow: 'visible' }}
                            >
                                {/* Gradient fill (inside track) */}
                                <div
                                    ref={fillRef}
                                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-love-400 to-love-600"
                                    style={{ width: '0%', willChange: 'width' }}
                                />

                                {/* Extended gray track (outside box) */}
                                <div
                                    ref={extTrackRef}
                                    className="absolute top-1/2 -translate-y-1/2 h-3 rounded-r-full"
                                    style={{
                                        left: '100%',
                                        width: '0px',
                                        opacity: 0,
                                        background: 'linear-gradient(to right, #d1d5db, #e5e7eb)',
                                        willChange: 'width, opacity',
                                    }}
                                />

                                {/* Gradient fill on extended track */}
                                <div
                                    ref={extFillRef}
                                    className="absolute top-1/2 -translate-y-1/2 h-3 rounded-r-full bg-gradient-to-r from-love-600 to-love-500"
                                    style={{
                                        left: '100%',
                                        width: '0px',
                                        opacity: 0,
                                        boxShadow: '0 0 15px rgba(225,29,72,0.6)',
                                        willChange: 'width, opacity',
                                    }}
                                />

                                {/* Crack/Break visual at the edge */}
                                <div
                                    ref={crackRef}
                                    className="absolute pointer-events-none z-40"
                                    style={{
                                        left: '100%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%) scale(0.5)',
                                        width: '60px',
                                        height: '60px',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                                        background: 'radial-gradient(circle, transparent 30%, rgba(225,29,72,0.3) 50%, transparent 70%)',
                                        filter: 'blur(1px)',
                                    }}
                                >
                                    {/* Crack lines */}
                                    <svg viewBox="0 0 60 60" className="w-full h-full">
                                        <line x1="30" y1="5" x2="30" y2="55" stroke="#f43f5e" strokeWidth="2" opacity="0.8" />
                                        <line x1="30" y1="30" x2="10" y2="10" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />
                                        <line x1="30" y1="30" x2="50" y2="12" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />
                                        <line x1="30" y1="30" x2="8" y2="48" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />
                                        <line x1="30" y1="30" x2="52" y2="50" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />
                                        <line x1="30" y1="30" x2="5" y2="30" stroke="#ec4899" strokeWidth="1" opacity="0.5" />
                                        <line x1="30" y1="30" x2="55" y2="28" stroke="#ec4899" strokeWidth="1" opacity="0.5" />
                                    </svg>
                                </div>

                                {/* Heart Thumb */}
                                <div
                                    ref={thumbRef}
                                    onPointerDown={handlePointerDown}
                                    className="absolute top-1/2 w-12 h-12 -ml-6 bg-white border-2 border-love-500 rounded-full shadow-lg flex items-center justify-center z-50 select-none touch-none"
                                    style={{
                                        transform: 'translate(0px, -50%)',
                                        cursor: 'grab',
                                        willChange: 'transform',
                                        left: 0,
                                        transition: 'box-shadow 0.2s ease',
                                    }}
                                >
                                    <Heart className="w-6 h-6 text-love-600 fill-love-600 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <motion.div
                            key={Math.floor(displayValue / 100)}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="mt-4 text-2xl font-bold text-love-600 h-16 flex items-center justify-center"
                        >
                            {displayValue > 100 && (
                                <motion.span
                                    className="mr-2 text-3xl"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.6 }}
                                >
                                    🔥
                                </motion.span>
                            )}
                            {getLoveMessage(displayValue)}
                        </motion.div>

                        <button
                            onClick={() => {
                                if (displayValue < 100) {
                                    setNextShake(true);
                                    setTimeout(() => setNextShake(false), 500);
                                } else {
                                    setStage(1);
                                }
                            }}
                            className={`group px-10 py-4 rounded-full text-xl font-semibold shadow-xl flex items-center gap-3 mx-auto transition-all duration-300 ${displayValue >= 100
                                ? 'bg-gradient-to-r from-love-500 to-love-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                                : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                } ${nextShake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
                        >
                            <Heart fill={displayValue >= 100 ? "white" : "#9ca3af"} size={24} className={displayValue >= 100 ? "group-hover:animate-ping" : ""} />
                            İleri
                        </button>
                    </motion.div>
                )}

                {/* STAGE 2: Proposal */}
                {stage === 1 && (
                    <motion.div
                        key="proposal"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 mx-4 border border-white/50"
                    >
                        <h2 className="text-3xl md:text-4xl font-romantic text-love-700 mb-8 leading-tight">
                            Götünü Yiyim miii<br />Nolarrrrr
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center h-48 relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleYesClick}
                                className="group px-10 py-4 bg-gradient-to-r from-love-500 to-love-600 text-white rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 z-20"
                            >
                                <Heart fill="white" size={24} className="group-hover:animate-ping" />
                                Evet!
                            </motion.button>

                            <motion.button
                                animate={noButtonPos}
                                onMouseEnter={handleNoHover}
                                className="px-6 py-3 bg-gray-300 text-gray-600 rounded-xl text-lg font-medium shadow-md absolute md:static"
                                style={{
                                    position: noButtonPos.x !== 0 ? 'absolute' : 'relative',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Hayır
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* STAGE 3: Celebration */}
                {stage === 2 && (
                    <motion.div
                        key="celebration"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center relative z-10 mx-4 border-2 border-love-200"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mb-6 inline-block"
                        >
                            <Heart className="w-20 h-20 text-love-500 fill-love-500 drop-shadow-lg" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-love-800 mb-4">
                            YUPPİİİİİ! HAMMM HAMMM HAMMMMMMMM MAMMAMİAA LEZZZİZOOOO! 💖✨
                        </h2>

                        <p className="text-xl text-love-600 mb-8 font-medium">
                            Şimdi gel ve hediyeni al ehehe:<br />
                            <span className="text-2xl block mt-2">
                                Kocamannn bir sarılma ve devasa bir öpücük! 🎁🥰❤️💋💕
                            </span>
                        </p>

                        <button
                            onClick={onComplete}
                            className="group px-10 py-4 bg-gradient-to-r from-love-500 to-love-600 text-white rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto active:scale-95 animate-bounce"
                        >
                            <Heart fill="white" size={24} className="group-hover:animate-ping" />
                            Hediyene Git
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveIntro;
