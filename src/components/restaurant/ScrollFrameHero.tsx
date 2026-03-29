import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';

const TOTAL_FRAMES = 174;

/** Last frame shown as instant poster — the complete biryani plate */
const POSTER_FRAME = '/biriyani-frames/ezgif-frame-174.jpg';

/**
 * Responsive scroll configuration.
 * Mobile uses much shorter scroll distance so users aren't "scroll-blocked".
 * Desktop retains the full cinematic experience.
 */
const SCROLL_CONFIG = {
  desktop: {
    scrollHeight: '400vh',   // 4x viewport — premium cinematic scroll
    stiffness: 100,          // Smooth, cinematic spring
    damping: 30,
    frameStep: 1,            // Load every frame (174 total)
  },
  mobile: {
    scrollHeight: '180vh',   // ~1.8x viewport — quick, not frustrating
    stiffness: 200,          // Snappier response for touch
    damping: 25,
    frameStep: 2,            // Load every 2nd frame (87 total) — saves bandwidth
  },
} as const;

export const ScrollFrameHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Pick config based on screen size
  const config = isMobile ? SCROLL_CONFIG.mobile : SCROLL_CONFIG.desktop;

  // Determine which frames to load
  const frameIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += config.frameStep) {
      indices.push(i);
    }
    // Always include the last frame for a clean ending
    if (indices[indices.length - 1] !== TOTAL_FRAMES) {
      indices.push(TOTAL_FRAMES);
    }
    return indices;
  }, [config.frameStep]);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress — snappier on mobile
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: config.stiffness,
    damping: config.damping,
    restDelta: 0.001
  });

  // Map progress (0-1) to index in the loaded frames array
  const frameArrayIndex = useTransform(
    smoothProgress,
    [0, 1],
    [0, frameIndices.length - 1]
  );

  // Preload images (respects frameStep — mobile loads fewer)
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    let cancelled = false;

    const totalToLoad = frameIndices.length;

    for (const frameNum of frameIndices) {
      const img = new Image();
      const padded = String(frameNum).padStart(3, '0');
      img.src = `/biriyani-frames/ezgif-frame-${padded}.jpg`;
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setLoading(false);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setLoading(false);
        }
      };
      loadedImages.push(img);
    }

    setImages(loadedImages);

    return () => {
      cancelled = true;
    };
  }, [frameIndices]);

  // Draw current frame to canvas
  const drawFrame = React.useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const clampedIndex = Math.min(
      Math.max(Math.floor(index), 0),
      images.length - 1
    );
    const currentFrame = images[clampedIndex];
    if (!currentFrame || !currentFrame.complete || !currentFrame.naturalWidth) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Cover-fit the image (like object-fit: cover)
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = currentFrame.width / currentFrame.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      drawHeight = drawWidth / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    context.drawImage(currentFrame, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // Draw the LAST frame immediately on load so users never see a blank screen
  useEffect(() => {
    if (loading || images.length === 0) return;

    // Immediately draw the last frame (complete biryani) on load
    drawFrame(images.length - 1);
  }, [loading, images, drawFrame]);

  // Subscribe to frame changes on scroll
  useEffect(() => {
    if (loading || images.length === 0) return;

    const unsubscribe = frameArrayIndex.on('change', (latest) => {
      drawFrame(latest);
    });

    return () => unsubscribe();
  }, [loading, images, frameArrayIndex, drawFrame]);

  // Handle window resize for canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Re-draw current frame after resize
      if (images.length > 0) {
        const currentIdx = frameArrayIndex.get();
        drawFrame(currentIdx);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameArrayIndex, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: config.scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Static poster image — shows INSTANTLY before any JS loads */}
        <img
          src={POSTER_FRAME}
          alt="V Grand Biryani"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          fetchPriority="high"
        />

        {/* Canvas overlays the poster once frames are loaded and scroll begins */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          style={{ zIndex: loading ? -1 : 1 }}
        />

        {/* Overlay Content — z-10 ensures it's above poster + canvas */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 text-center px-4">
            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6 uppercase"
                style={{ textShadow: '0 0 40px rgba(255,153,51,0.5)' }}
            >
                Raja of <span className="text-primary">Biryanis</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-2xl text-gold max-w-2xl font-medium tracking-wide"
            >
                Deconstructing the essence of authentic Andhra spices.
                Experience the cinematic assembly of royalty.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12"
            >
                <div className="flex flex-col items-center gap-4">
                    <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs">Scroll to Assemble</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-12 w-[2px] bg-gradient-to-b from-primary to-transparent"
                    />
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScrollFrameHero;
