# fullscreen-ink

Create responsive, full-screen Ink terminal apps.

## Usage

```bash
npm i fullscreen-ink
```

```jsx
import { withFullScreen } from "fullscreen-ink";

withFullScreen(<App />).start();
```

The app will be full-screen and will resize responsively as the terminal window changes size. After the app is closed, the previous content of the terminal will be restored.

### Ink `render` options

You can pass any options that Ink's `render` function accepts to `withFullScreen`:

```jsx
withFullScreen(<App />, { exitOnCtrlC: false }).start();
```

### The Ink instance

If you need the Ink "instance" (normally returned from Ink's `render` function), you can access it through the `instance` property of the object returned from `withFullScreen`:

```jsx
const ink = withFullScreen(<App />);
// ...
ink.instance.rerender(<SomethingElse />);
```

If you access it, keep in mind that due to how `fullscreen-ink` works, there might be a race condition unless you wait for the `start` method to resolve. For example:

```jsx
const ink = withFullScreen(<App />);
await ink.start();
ink.instance.rerender(<SomethingElse />);
```

### Waiting for the app to exit

Instead of calling `waitUntilExit` on the Ink instance, you must use the `waitUntilExit` property of the object:

```jsx
const ink = withFullScreen(<App />);
// ...
await ink.waitUntilExit();
// do something after the app has closed
```

### Exiting the app

If you use a method like `process.exit` to close the app, the terminal will likely be left in a weird state. Instead, you should use the `exit` method of Ink's `useApp`:

```js
import { useApp } from "ink";

// somewhere in a component
const app = useApp();
app.exit();
```

### Obtaining the screen size

The hook used under the hood to obtain the screen size is `useScreenSize`, which returns an object with `height` and `width` properties that reflect the current size of the terminal (rows and columns in stdout). If you have an advanced use case, it is also available for direct use:

```js
import { useScreenSize } from "fullscreen-ink";

function MyComponent() {
  const { height, width } = useScreenSize();
  // use height and width as needed
}
```

## How it works

Full screen is achieved through the combination of two things:

### Alternate screen buffer

When the app starts, the terminal is switched to the alternate screen buffer. This means that the app will be the only thing visible in the terminal. When the app is closed, the previous content of the terminal will be restored.

This is similar to what happens when you run popular terminal apps like `vim` or `less` in the terminal.

### FullScreenBox component

The `FullScreenBox` component is a simple Ink component that fills the entire terminal window. This is achieved by accessing the terminal's size through Ink's `useStdout` hook and rendering a box with the same dimensions. The size is updated on `resize` events, so the box will always fill the terminal window throughout its lifetime.

This component is automatically added to the root of the app when you use `withFullScreen`. If you need a custom layout (e.g. you want to add a border around the whole app), you can simply create an Ink `<Box />` with flex-grow at the root of your app and it will fill the entire terminal window.

You can also use the component directly without `withFullScreen`, but you will have to handle the alternate screen buffer (if you want it) yourself. The component has the same API as Ink's `Box` component, except that it defaults to the `width` and `height` values that match the terminal window.
