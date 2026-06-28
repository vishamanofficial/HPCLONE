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
            className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-300 hover:border-primary/20"
          >
            <button
              id={`accordion-button-${idx}`}
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${idx}`}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-semibold text-text-primary hover:text-primary transition-colors focus:outline-none"
            >
              <span className="text-base sm:text-lg">{item.title}</span>
              <span className="text-primary flex-shrink-0">
                {isOpen ? (
                  <Minus className="w-5 h-5 transition-transform duration-300 rotate-180" />
                ) : (
                  <Plus className="w-5 h-5 transition-transform duration-300 rotate-0" />
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
