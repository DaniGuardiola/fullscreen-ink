import { type Instance, render } from "ink";

import { FullScreenBox } from "./FullScreenBox.js";

type InkRender = typeof render;
type WithFullScreen = (...args: Parameters<InkRender>) => {
  instance: Instance;
  start: () => Promise<void>;
  waitUntilExit: () => Promise<void>;
};

async function write(content: string) {
  return new Promise<void>((resolve, reject) => {
    process.stdout.write(content, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function cleanUpOnExit(instance: Instance) {
  await instance.waitUntilExit();
  await write("\x1b[?1049l"); // exit alternate buffer
}

export const withFullScreen: WithFullScreen = (node, options) => {
  const instance = render(null, options);
  const exitPromise = cleanUpOnExit(instance);
  function waitUntilExit() {
    return exitPromise;
  }

  return {
    instance: instance,
    start: async () => {
      await write("\x1b[?1049h"); // enter alternate buffer
      instance.rerender(<FullScreenBox>{node}</FullScreenBox>);
    },
    waitUntilExit,
  };
};
