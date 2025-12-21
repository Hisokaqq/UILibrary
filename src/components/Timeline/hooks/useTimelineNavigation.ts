import { useEffect, useRef, useState } from "react";

interface UseTimelineNavigationProps<T> {
  groupedData: Record<string, T[]>;
}

export const useTimelineNavigation = <T>({
  groupedData,
}: UseTimelineNavigationProps<T>) => {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);

  const [showHint, setShowHint] = useState(true);

  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const groups = Object.entries(groupedData);
      const nGroups = groups.length;
      if (nGroups === 0) return;

      const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (navKeys.includes(e.key)) {
        setShowHint(false);
      }

      const currentGroupItems = groups[selectedGroup][1];
      const nItems = currentGroupItems.length;

      if (e.key === "ArrowRight") {
        setSelectedGroup((prev) => Math.min(prev + 1, nGroups - 1));
        setSelectedItem(0);
      } else if (e.key === "ArrowLeft") {
        setSelectedGroup((prev) => Math.max(prev - 1, 0));
        setSelectedItem(0);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedItem < nItems - 1) {
          setSelectedItem((prev) => prev + 1);
        } else if (selectedGroup < nGroups - 1) {
          setSelectedGroup((prev) => prev + 1);
          setSelectedItem(0);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedItem > 0) {
          setSelectedItem((prev) => prev - 1);
        } else if (selectedGroup > 0) {
          const prevGroupIndex = selectedGroup - 1;
          const prevGroupItems = groups[prevGroupIndex][1];
          setSelectedGroup(prevGroupIndex);
          setSelectedItem(prevGroupItems.length - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groupedData, selectedGroup, selectedItem]);

  useEffect(() => {
    const groups = Object.entries(groupedData);
    if (groups.length === 0) return;
    const lastGroupIdx = groups.length - 1;
    const lastItemIdx = groups[lastGroupIdx][1].length - 1;

    if (selectedGroup === 0 && selectedItem === 0) {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (selectedGroup === lastGroupIdx && selectedItem === lastItemIdx) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
      return;
    }
    const key = `${selectedGroup}-${selectedItem}`;
    const element = itemsRef.current[key];

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [groupedData, selectedGroup, selectedItem]);

  return {
    selectedGroup,
    selectedItem,
    itemsRef,
    containerRef,
    showHint,
  };
};
