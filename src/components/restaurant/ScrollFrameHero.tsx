import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';

const TOTAL_FRAMES = 174;

/**
 * Frame 001 = fully assembled biryani plate (start of animation).
 * Frame 174 = dramatic exploded state (end of animation).
 * Animation plays 1→174 as user scrolls. Poster = frame 1.
 */
const POSTER_FRAME = '/biriyani-frames/ezgif-frame-001.jpg';

const SCROLL_CONFIG = {
  desktop: {
    scrollHeight: '400vh',
    stiffness: 100,
    damping: 30,
    frameStep: 1,
  },
  mobile: {
    scrollHeight: '180vh',
    stiffness: 200,
    damping: 25,
    frameStep: 2,
  },
} as const;

export const ScrollFrameHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesReady, setImagesReady] = useState(false);

  /**
   * THE KEY STATE: controls which layer is visible.
   *
   * false = show POSTER (the perfect assembled biryani — frame 174)
   * true  = show CANVAS (scroll-driven animation has taken over)
   *
   * This only flips to `true` when the user ACTUALLY SCROLLS.
   * It has NOTHING to do with image loading being complete.
   *
   * This eliminates the root cause: previously the poster was hidden as soon
   * as images finished loading (loading → false), causing the canvas to
   * show its initial state (frame 0 = exploded) before any scroll.
   */
  const [animationActive, setAnimationActive] = useState(false);

  // Ref mirror of animationActive — checked synchronously inside callbacks
  const animationActiveRef = useRef(false);

  const isMobile = useIsMobile();
  const config = isMobile ? SCROLL_CONFIG.mobile : SCROLL_CONFIG.desktop;

  const frameIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += config.frameStep) {
      indices.push(i);
    }
    if (indices[indices.length - 1] !== TOTAL_FRAMES) {
      indices.push(TOTAL_FRAMES);
    }
    return indices;
  }, [config.frameStep]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: config.stiffness,
    damping: config.damping,
    restDelta: 0.001,
  });

  const frameArrayIndex = useTransform(
    smoothProgress,
    [0, 1],
    [0, frameIndices.length - 1]
  );

  // Preload all frames in the background (hidden — poster stays on top)
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    let cancelled = false;
    const totalToLoad = frameIndices.length;

    for (const frameNum of frameIndices) {
      const img = new Image();
      const padded = String(frameNum).padStart(3, '0');
      img.src = `/biriyani-frames/ezgif-frame-${padded}.jpg`;
      const done = () => {
        if (cancelled) return;
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setImagesReady(true);
        }
      };
      img.onload = done;
      img.onerror = done;
      loadedImages.push(img);
    }

    setImages(loadedImages);
    return () => { cancelled = true; };
  }, [frameIndices]);

  // Draw a frame index to the canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const clampedIndex = Math.min(Math.max(Math.floor(index), 0), images.length - 1);
    const frame = images[clampedIndex];
    if (!frame?.complete || !frame.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = frame.width / frame.height;
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

    ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // Handle canvas resize — always redraw the assembled last frame until user scrolls
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (images.length > 0) {
        // If scrolling: redraw current scroll frame. If not: redraw frame 0 (assembled).
        const idx = animationActiveRef.current
          ? Math.floor(frameArrayIndex.get())
          : 0;
        drawFrame(idx);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameArrayIndex, drawFrame]);

  /**
   * SCROLL ACTIVATION — this is the only place we flip animationActive.
   *
   * When user first scrolls:
   * 1. Pre-draw the correct frame to canvas (so canvas isn't blank when it fades in)
   * 2. Mark the ref synchronously (so the subscription callback can start drawing)
   * 3. Mark the state (so React re-renders and reveals the canvas / hides poster)
   */
  useEffect(() => {
    const activateAnimation = () => {
      if (animationActiveRef.current) return; // already activated, ignore

      // Pre-draw correct frame BEFORE canvas becomes visible to avoid blank flash
      if (imagesReady && images.length > 0) {
        drawFrame(Math.floor(frameArrayIndex.get()));
      }

      animationActiveRef.current = true;
      setAnimationActive(true);
    };

    window.addEventListener('scroll', activateAnimation, { once: true, passive: true });
    return () => window.removeEventListener('scroll', activateAnimation);
  }, [imagesReady, images, drawFrame, frameArrayIndex]);

  /**
   * Scroll-driven frame subscription.
   * Guard is checked via ref INSIDE the callback — fully synchronous, zero delay.
   */
  useEffect(() => {
    if (!imagesReady || images.length === 0) return;

    const unsubscribe = frameArrayIndex.on('change', (latest) => {
      if (!animationActiveRef.current) return; // poster still showing — ignore
      drawFrame(latest);
    });

    return () => unsubscribe();
  }, [imagesReady, images, frameArrayIndex, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: config.scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/**
          * POSTER — The perfect assembled biryani (frame 174).
          * Visible on initial load. Hidden ONLY when user has scrolled (animationActive).
          * NOT hidden when images finish loading (old bug).
          */}
        <img
          src={POSTER_FRAME}
          alt="V Grand Biryani assembled"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          style={{
            opacity: animationActive ? 0 : 1,
            transition: 'opacity 0.4s ease',
            zIndex: 2,
          }}
        />

        {/**
          * CANVAS — scroll-driven frame animation.
          * Hidden until user scrolls (animationActive = true).
          * By the time it becomes visible, the correct frame is already pre-drawn.
          */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: animationActive ? 1 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 1,
          }}
        />

        {/* Overlay Content */}
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
              <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs">
                Scroll to Assemble
              </span>
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
