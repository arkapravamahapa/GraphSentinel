'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

export type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
  global?: boolean;
  style?: React.CSSProperties;
};

export function Spotlight({
  className,
  size = 280,
  springOptions = { bounce: 0, damping: 25, stiffness: 200 },
  global = true,
  style,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        if (!global && parent !== document.body && parent !== document.documentElement) {
          parent.style.position = 'relative';
          parent.style.overflow = 'hidden';
        }
        setParentElement(parent);
      }
    }
  }, [global]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (global) {
        mouseX.set(event.clientX);
        mouseY.set(event.clientY);
        return;
      }
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [global, mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (global) {
      const onMouseMove = (e: MouseEvent) => {
        setIsHovered(true);
        handleMouseMove(e);
      };
      const onMouseEnter = () => setIsHovered(true);
      const onMouseLeave = () => setIsHovered(false);

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseenter', onMouseEnter);
        document.removeEventListener('mouseleave', onMouseLeave);
      };
    }

    if (!parentElement) return;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', () => setIsHovered(true));
    parentElement.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true));
      parentElement.removeEventListener('mouseleave', () => setIsHovered(false));
    };
  }, [global, parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none rounded-full blur-2xl transition-opacity duration-300',
        global ? 'fixed z-50' : 'absolute z-10',
        'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)]',
        'from-zinc-50 via-zinc-100 to-zinc-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        background:
          'radial-gradient(circle at center, rgba(255, 255, 255, 0.14) 0%, rgba(34, 211, 238, 0.07) 35%, rgba(168, 85, 247, 0.03) 60%, transparent 80%)',
        mixBlendMode: 'screen',
        ...style,
      }}
    />
  );
}

export default Spotlight;
