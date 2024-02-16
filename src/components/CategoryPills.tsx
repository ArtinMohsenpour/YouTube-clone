import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";

type CategoryPillProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

const TRANSLATE_AMOUNT = 200;

//

export function CategoryPills({
  categories,
  selectedCategory,
  onSelect,
}: CategoryPillProps) {
  const [translate, setTranslate] = useState(0);
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (containerRef.current == null) return;

    const observer = new ResizeObserver((entries) => {
      const container = entries[0].target; // equals = containerRef.current
      if (container == null) return;

      setIsLeftVisible(translate > 0);
      setIsRightVisible(
        translate + container.clientWidth < container.scrollWidth
      );
    });
    observer.observe(containerRef.current);
  }, [categories, translate]);

  return (
    <div ref={containerRef} className="overflow-x-hidden relative ">
      <div
        className="flex whitespace-nowrap gap-3 transition-transform w-[max-content] "
        style={{ transform: `translateX(-${translate}px)` }}
      >
        {categories.map((category) => {
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "dark" : "default"}
              className="py-1 px-3 rounded-lg whitespace-nowrap"
              onClick={() => onSelect(category)}
            >
              {category}
            </Button>
          );
        })}

        <Button className="py-1 px-3 rounded-lg whitespace-nowrap">
          Javascript
        </Button>
      </div>
      {isLeftVisible && (
        <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-gradient-to-r from-white from-50% to-transparent w-24 h-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-auto p-1.5"
            onClick={() => {
              setTranslate((translate) => {
                const newTranslate = translate - TRANSLATE_AMOUNT;
                if (newTranslate <= 0) return 0;
                return newTranslate;
              });
            }}
          >
            <ChevronLeft />
          </Button>
        </div>
      )}
      {isRightVisible && (
        <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-l from-white from-50% to-transparent w-24 h-full flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-auto p-1.5"
            onClick={() => {
              
              setTranslate((translate) => {
                if (containerRef.current == null) return translate;
                const edge = containerRef.current.scrollWidth;
                const width = containerRef.current.clientWidth;
                const newTranslate = translate + TRANSLATE_AMOUNT;
                if (newTranslate + width >= edge) {
                  return edge - width;
                }
                return newTranslate;
              });
            }}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
