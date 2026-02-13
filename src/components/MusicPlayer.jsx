import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Music, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const YOUTUBE_VIDEO_ID = '1KOMeskUvPc';

const MusicPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    // Load YouTube IFrame API script once
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            initPlayer();
            return;
        }

        // Create the API script tag
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        // YouTube API calls this global function when ready
        window.onYouTubeIframeAPIReady = () => {
            initPlayer();
        };

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, []);

    const initPlayer = () => {
        if (playerRef.current) return; // already initialized

        playerRef.current = new window.YT.Player('yt-music-player', {
            videoId: YOUTUBE_VIDEO_ID,
            playerVars: {
                autoplay: 0,
                loop: 1,
                playlist: YOUTUBE_VIDEO_ID, // required for loop to work
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                origin: window.location.origin,
            },
            events: {
                onReady: () => {
                    setReady(true);
                    playerRef.current.setVolume(50);
                },
                onStateChange: (event) => {
                    // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
                    if (event.data === 1) {
                        setPlaying(true);
                    } else if (event.data === 2 || event.data === 0) {
                        setPlaying(false);
                    }
                },
            },
        });
    };

    const togglePlay = useCallback(() => {
        if (!playerRef.current || !ready) return;
        if (playing) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, [playing, ready]);

    return (
        <div className="fixed bottom-4 right-4 z-[60]">
            {/* Hidden YouTube player — positioned off-screen, 1x1 pixel */}
            <div
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            >
                <div id="yt-music-player" />
            </div>

            {/* Visible play/pause button */}
            <motion.button
                onClick={togglePlay}
                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-love-600 hover:text-love-800 transition-colors border-2 border-love-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <AnimatePresence mode="wait">
                    {playing ? (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <Pause size={20} fill="currentColor" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="paused"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                        >
                            <Play size={20} fill="currentColor" className="ml-0.5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
            <AnimatePresence>
                {playing && (
                    <motion.div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <Music size={20} className="text-love-400 animate-bounce" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MusicPlayer;
