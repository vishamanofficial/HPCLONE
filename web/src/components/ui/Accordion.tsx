"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div
            key={idx}
            className="border border-border rounded-2xl bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 shadow-xs"
          >
            <button
              id={`accordion-button-${idx}`}
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${idx}`}
              className="w-full min-h-[52px] px-6 py-4 flex items-center justify-between text-left gap-4 font-semibold text-text-primary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 cursor-pointer"
            >
              <span className="text-base sm:text-lg tracking-headline">{item.title}</span>
              <span className="text-primary flex-shrink-0 w-8 h-8 rounded-full bg-surface border border-border/80 flex items-center justify-center transition-transform duration-200">
                {isOpen ? (
                  <Minus className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <Plus className="w-4 h-4 transition-transform duration-200" />
                )}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-panel-${idx}`}
                  role="region"
                  aria-labelledby={`accordion-button-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border/40 pt-4">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
export default Accordion;
