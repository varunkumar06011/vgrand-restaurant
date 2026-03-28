import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

const TOTAL_FRAMES = 174;

export const ScrollFrameHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map progress (0-1) to frame index (1-174)
  const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `/biriyani-frames/ezgif-frame-${frameNum}.jpg`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === TOTAL_FRAMES) {
                setLoading(false);
            }
        };
        loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Draw frame to canvas
  useEffect(() => {
    if (loading || images.length === 0 || !canvasRef.current) return;

    const unsubscribe = frameIndex.on('change', (latest) => {
        const index = Math.floor(latest) - 1;
        const currentFrame = images[index];
        if (currentFrame && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                // Clear and draw
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                
                // Maintain aspect ratio (assuming images are 16:9 or similar)
                const canvasAspect = canvasRef.current.width / canvasRef.current.height;
                const imgAspect = currentFrame.width / currentFrame.height;
                
                let drawWidth = canvasRef.current.width;
                let drawHeight = canvasRef.current.height;
                let offsetX = 0;
                let offsetY = 0;

                if (canvasAspect > imgAspect) {
                    drawHeight = drawWidth / imgAspect;
                    offsetY = (canvasRef.current.height - drawHeight) / 2;
                } else {
                    drawWidth = drawHeight * imgAspect;
                    offsetX = (canvasRef.current.width - drawWidth) / 2;
                }

                context.drawImage(currentFrame, offsetX, offsetY, drawWidth, drawHeight);
            }
        }
    });

    return () => unsubscribe();
  }, [loading, images, frameIndex]);

  // Handle window resize for canvas
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            
            // Re-draw current frame
            const index = Math.floor(frameIndex.get()) - 1;
            const currentFrame = images[index];
            if (currentFrame) {
                const context = canvasRef.current.getContext('2d');
                if (context) {
                    context.drawImage(currentFrame, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameIndex]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
            <div className="text-secondary animate-pulse text-2xl font-serif">
               Arranging the Royal Spices...
            </div>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="h-full w-full object-cover opacity-80"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center px-4">
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
