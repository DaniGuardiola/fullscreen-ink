import { useStdout } from "ink";
import { useCallback, useEffect, useState } from "react";

/**
 * Returns an up to date screen size object with `height` and `width` properties
 * that reflect the current size of the terminal (rows and columns in stdout).
 */
export function useScreenSize() {
  const { stdout } = useStdout();
  const getSize = useCallback(
    () => ({ height: stdout.rows, width: stdout.columns }),
    [stdout],
  );
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    function onResize() {
      setSize(getSize());
    }
    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout, getSize]);

  return size;
}
