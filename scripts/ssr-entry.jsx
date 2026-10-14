import { renderToString } from "react-dom/server";
import App from "../src/App.jsx";

// Render initial app state (splash overlay + wizard). localStorage/window/document
// are undefined in Node; the app's try/catch guards handle that and fall back to defaults.
process.stdout.write(renderToString(<App />));
