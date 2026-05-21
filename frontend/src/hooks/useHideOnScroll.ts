import { useEffect, useRef, useState } from "react";

export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastScroll.current;

      if (y < 40) {
        setHidden(false);
      } else if (goingDown && y - lastScroll.current > 6) {
        setHidden(true);
      } else if (!goingDown && lastScroll.current - y > 6) {
        setHidden(false);
      }
      lastScroll.current = y;
    }

    function onTouch() {
      setHidden(false);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return hidden;
}