const { BrowserWindow, ipcMain } = require("electron");
const Task = require("../src/models/Task");
const isDev = require("electron-is-dev");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  // win.loadFile("app/index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

ipcMain.on("new-task", async (e, arg) => {
  try {
    const event = await Task.create(arg);
    e.reply("new-task-created", JSON.stringify(event));
  } catch (error) {
    console.log(error, "error");
  }
});

ipcMain.on("get-tasks", async (e, arg) => {
  const tasks = await Task.find();
  e.reply("get-tasks", JSON.stringify(tasks));
});

ipcMain.on("delete-task", async (e, args) => {
  const taskDeleted = await Task.findByIdAndDelete(args);
  e.reply("delete-task-success", JSON.stringify(taskDeleted));
});

ipcMain.on("update-task", async (e, args) => {
  const updatedTask = await Task.findByIdAndUpdate(
    args._id,
    { $set: { name: args.name, description: args.description } },
    { new: true }
  );
  e.reply("update-task-success", JSON.stringify(updatedTask));
});

ipcMain.on("save-recordings", async (e, arg) => {
  const buffer = Buffer.from(
    arg.split("base64,")[1], // only use encoded data after "base64,"
    "base64"
  );
  fs.writeFileSync("Recording/audio.mp3", buffer);
  console.log(`wrote ${buffer.byteLength.toLocaleString()} bytes to file.`);

  fs.writeFileSync(
    "Recording/helloworld.txt",
    "Recording has been saved successfully",
    function (err) {
      if (err) return console.log(err);
      console.log("Hello World > helloworld.txt");
    }
  );
});

ipcMain.on("song-list", async (e, arg) => {
  let temp = [];
  fs.readdirSync("src/Recording").forEach((file) => {
    temp.push(file);
  });

  e.reply("song-list", JSON.stringify({ temp, dir: "../Recording/beats.mp3" }));
});

module.exports = { createWindow };

// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
// const path = require("path");
// const isDev = require("electron-is-dev");
// let mainWindow;
// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 1200,
//         height: 800,
//         icon: ""
//     });

//     mainWindow.loadURL(
//         isDev
//         ? "http://localhost:3000"
//         : `file://${path.join(__dirname, "../build/index.html")}`
//     );
//     mainWindow.on("closed", () => (mainWindow = null));
// }

// app.on("ready", createWindow);
// app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//     app.quit();
//     }
// });

// app.on("activate", () => {
//     if (mainWindow === null) {
//     createWindow();
//     }
// });
