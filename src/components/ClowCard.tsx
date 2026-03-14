import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ClowCard as ClowCardType } from "../data/cards";
import { useEffect, useState } from "react";
import { CardEffects, getCardEffect } from "./CardEffects";

interface ClowCardProps {
  card?: ClowCardType;
  isFlipped: boolean;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export function ClowCard({ card, isFlipped, onClick, className, delay = 0 }: ClowCardProps) {
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      // Show effects slightly after flip starts to match the reveal
      const timer = setTimeout(() => setShowEffects(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowEffects(false);
    }
  }, [isFlipped]);

  return (
    <div 
      className={cn("relative w-[147px] h-[324px] cursor-pointer perspective-1000 flex-shrink-0 group", className)}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        // 900 degrees = 2.5 spins (180 + 360 * 2), ends up showing the front
        animate={{ rotateY: isFlipped ? 900 : 0 }}
        transition={{ type: "spring", stiffness: 45, damping: 12, delay }}
      >
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rounded-xl border-[6px] border-[#e6c27a] bg-[#8b1c31] shadow-xl flex items-center justify-center overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-2 border border-[#e6c27a] rounded-lg opacity-70"></div>
          <div className="w-24 h-24 rounded-full border-2 border-[#e6c27a] flex items-center justify-center relative">
             <div className="absolute w-16 h-16 border-2 border-[#e6c27a] rotate-45"></div>
             <div className="absolute w-16 h-16 border-2 border-[#e6c27a]"></div>
             <div className="w-8 h-8 bg-[#e6c27a] rounded-full flex items-center justify-center z-10">
                <div className="w-6 h-6 bg-[#8b1c31] rounded-full"></div>
             </div>
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#e6c27a]">
            <Star size={16} fill="currentColor" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#e6c27a]">
            <Star size={16} fill="currentColor" />
          </div>
        </div>

        {/* Front of the card (Image) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-[6px] border-[#e6c27a] shadow-xl bg-white flex flex-col">
          {card ? (
            <img 
              src={card.imageUrl} 
              alt={card.name}
              className="w-full h-full object-contain bg-[#fdf5e6]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showEffects && card && (
          <CardEffects type={getCardEffect(card.id)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Star({ size, fill }: { size: number, fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}
