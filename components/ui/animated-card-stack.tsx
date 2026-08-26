"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export interface StackCard {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface AnimatedCardStackProps {
  cards: StackCard[];
  /** Libellé du bouton d'action de chaque carte. */
  actionLabel?: string;
  /** Libellé du bouton qui fait défiler la pile. */
  cycleLabel?: string;
}

/*
 * La sortie des cartes est orchestrée manuellement (animate + onAnimationComplete
 * + démontage par état) plutôt qu'avec AnimatePresence : les exit animations ne se
 * déclenchent pas avec framer-motion 12.42 sous le React canary de Next 16, ce qui
 * laissait des nœuds fantômes s'accumuler dans le DOM.
 */
interface StackItem {
  key: number;
  cardIndex: number;
  status: "stack" | "exiting";
  /** false pour les cartes du premier rendu : pas d'animation d'entrée au mount. */
  animateEnter: boolean;
}

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
];

const exitAnimation = {
  y: 340,
  scale: 1,
};

const enterAnimation = {
  y: -16,
  scale: 0.9,
};

function CardContent({
  card,
  actionLabel,
}: {
  card: StackCard;
  actionLabel: string;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="-outline-offset-1 relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-black/10">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 640px) 324px, 512px"
          className="select-none object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-foreground">
            {card.title}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {card.description}
          </span>
        </div>
        <Link
          href={card.href}
          className="flex h-10 shrink-0 cursor-pointer select-none items-center gap-0.5 rounded-full bg-foreground pl-4 pr-3 text-sm font-medium text-background transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {actionLabel}
          <ChevronRight className="size-4" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

export default function AnimatedCardStack({
  cards,
  actionLabel = "Voir",
  cycleLabel = "Faire défiler",
}: AnimatedCardStackProps) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<StackItem[]>(() =>
    cards.slice(0, 3).map((_, i) => ({
      key: i,
      cardIndex: i,
      status: "stack" as const,
      animateEnter: false,
    })),
  );
  const [nextKey, setNextKey] = useState(cards.slice(0, 3).length);

  if (cards.length === 0) return null;

  const stackItems = items.filter((item) => item.status === "stack");

  const handleCycle = () => {
    const front = stackItems[0];
    const lastIndex = stackItems[stackItems.length - 1]?.cardIndex ?? 0;
    if (!front) return;
    setItems((prev) => [
      ...prev.map((item) =>
        item.key === front.key
          ? { ...item, status: "exiting" as const }
          : item,
      ),
      {
        key: nextKey,
        cardIndex: (lastIndex + 1) % cards.length,
        status: "stack" as const,
        animateEnter: true,
      },
    ]);
    setNextKey((prev) => prev + 1);
  };

  const removeItem = (key: number) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2">
      <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
        {items.map((item) => {
          const stackIndex = stackItems.findIndex((s) => s.key === item.key);
          const isExiting = item.status === "exiting";
          const { scale, y } = isExiting
            ? exitAnimation
            : (positionStyles[stackIndex] ?? positionStyles[2]);

          return (
            <motion.div
              key={item.key}
              initial={item.animateEnter ? enterAnimation : false}
              animate={{ y, scale }}
              onAnimationComplete={() => {
                if (isExiting) removeItem(item.key);
              }}
              transition={{
                type: "spring",
                duration: reduceMotion ? 0 : 1,
                bounce: 0,
              }}
              style={{
                zIndex: isExiting ? 10 : 3 - stackIndex,
                left: "50%",
                x: "-50%",
                bottom: 0,
              }}
              className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-border bg-card p-1 shadow-lg will-change-transform sm:w-[512px]"
            >
              <CardContent
                card={cards[item.cardIndex % cards.length]}
                actionLabel={actionLabel}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-border py-4">
        <button
          type="button"
          onClick={handleCycle}
          disabled={cards.length < 2}
          className="flex h-9 cursor-pointer select-none items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-background px-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {cycleLabel}
        </button>
      </div>
    </div>
  );
}
