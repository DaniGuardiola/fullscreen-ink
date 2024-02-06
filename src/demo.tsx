import { Box, Text, useApp } from "ink";
import { useEffect, useState } from "react";

import { withFullScreen } from "./withFullScreen.js";

function DemoApp() {
  const [state, setState] = useState<"hello" | "goodbye">("hello");
  useEffect(() => {
    setTimeout(() => setState("goodbye"), 1000);
  });
  return state === "hello" ? <HelloWorld /> : <GoodbyeWorld />;
}

function HelloWorld() {
  return (
    <Box
      flexGrow={1}
      borderStyle="round"
      alignItems="center"
      justifyContent="center"
    >
      <Text>Hello, world!</Text>
    </Box>
  );
}

function GoodbyeWorld() {
  const app = useApp();
  useEffect(() => {
    setTimeout(app.exit, 1000);
  }, [app.exit]);
  return (
    <Box
      flexGrow={1}
      borderStyle="round"
      alignItems="center"
      justifyContent="center"
    >
      <Text>Goodbye, world! Exiting in 1 second...</Text>
    </Box>
  );
}

function waitOneSecond() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

const ink = withFullScreen(<DemoApp />);

console.log("Launching app in 1 second...");
await waitOneSecond();

await ink.start();

await ink.waitUntilExit();
console.log("Exited full screen app!");
