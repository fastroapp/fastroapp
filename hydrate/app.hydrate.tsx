import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client?dev";
import { createElement } from "https://esm.sh/react@18.2.0?dev";
import App from "../pages/App.tsx";
// deno-lint-ignore no-explicit-any
declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}
const props = window.__INITIAL_DATA__ || {};
delete window.__INITIAL_DATA__;
const el = createElement(App, props);
hydrateRoot(document.getElementById("root") as Element, el);
