import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: ReactNode;
  imageUrl: string;
  speed?: number;
  className?: string;
}

export function ParallaxSection({ 
  children, 
  imageUrl, 
  speed = 0.5,
  className 
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const elementVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (elementVisible) {
        setOffsetY((scrolled - elementTop) * speed);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${offsetY}px)`,
          willChange: "transform",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
