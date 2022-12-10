const { createWindow } = require("./electron");
const { app } = require("electron");
const isDev = require("electron-is-dev");

// require("../src/DB/db");

app.whenReady().then(createWindow);

try {
  require("electron-reloader")(module);
} catch (_) {}

app.allowRendererProcessReuse = false;
