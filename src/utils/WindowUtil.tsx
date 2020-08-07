import { useEffect, useState } from "react";

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

export const useCurrentWitdh = () => {
  // save current window width in the state object
  let [width, setWidth] = useState(getWidth());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: number | undefined = undefined;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return width;
};

export const useCurrentHeight = () => {
  // save current window width in the state object
  let [height, setHeight] = useState(getHeight());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: number | undefined = undefined;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setHeight(getHeight()), 150);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return height;
};

export const useKeyListener = () => {
  const handleKeyDown = (event: WheelEvent) => {
    if (event.ctrlKey === true) {
      console.warn("no scroll");
      event.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener("wheel", handleKeyDown);
  });
};
