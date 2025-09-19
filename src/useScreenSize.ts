import { useStdout } from "ink";
import { useCallback, useEffect, useState } from "react";

const isDeno = typeof Deno !== 'undefined';

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
    if (isDeno) {
      Deno.addSignalListener('SIGWINCH', onResize);
    }
    return () => {
      stdout.off("resize", onResize);
      if (isDeno) {
        Deno.removeSignalListener('SIGWINCH', onResize);
      }
    };
  }, [stdout, getSize]);

  return size;
}
