const { BrowserWindow, ipcMain } = require("electron");

const isDev = require("electron-is-dev");
const path = require("path");
const fs = require("fs");
const process = require("process");
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    autoHideMenuBar: false,
  });

  // win.loadFile("app/index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  win.webContents.openDevTools();
}

// ipcMain.on("new-task", async (e, arg) => {
//   try {
//     const event = await Task.create(arg);
//     e.reply("new-task-created", JSON.stringify(event));
//   } catch (error) {
//     console.log(error, "error");
//   }
// });

// ipcMain.on("get-tasks", async (e, arg) => {
//   const tasks = await Task.find();
//   e.reply("get-tasks", JSON.stringify(tasks));
// });

// ipcMain.on("delete-task", async (e, args) => {
//   const taskDeleted = await Task.findByIdAndDelete(args);
//   e.reply("delete-task-success", JSON.stringify(taskDeleted));
// });

// ipcMain.on("update-task", async (e, args) => {
//   const updatedTask = await Task.findByIdAndUpdate(
//     args._id,
//     { $set: { name: args.name, description: args.description } },
//     { new: true }
//   );
//   e.reply("update-task-success", JSON.stringify(updatedTask));
// });

ipcMain.on("save-recordings", async (e, arg) => {
  const buffer = Buffer.from(
    arg.buffer.split("base64,")[1], // only use encoded data after "base64,"
    "base64"
  );

  const publicDirectoryPath = isDev
    ? path.join(__dirname, "../public/Recording/" + arg.name + ".mp3")
    : process.cwd() + "/resources/Recordings/" + arg.name + ".mp3";

  fs.writeFile(publicDirectoryPath, buffer, (error, data) => {
    if (error) {
      e.reply(
        "save-recordings-status",
        JSON.stringify({
          temp: `wrote ${buffer.byteLength.toLocaleString()} bytes to file.`,
          path: publicDirectoryPath,
          error,
        })
      );
      return;
    }
    e.reply(
      "save-recordings-status",
      JSON.stringify({
        temp: `wrote ${buffer.byteLength.toLocaleString()} bytes to file.`,
        path: publicDirectoryPath,
        data,
      })
    );
  });
});

ipcMain.on("song-list", async (e, arg) => {
  let temp = [];

  const publicDirectoryPath = isDev
    ? path.join(__dirname, "../public/Recording")
    : process.cwd() + "/resources/Recordings";
  // : `${path.join(__dirname, "/Recording")}`;
  let newFolder = process.cwd() + "/resources/Recordings";

  if (!isDev) {
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder);
    }
  }

  fs.readdirSync(publicDirectoryPath).forEach((file) => {
    temp.push({ file, isNew: false });
  });

  e.reply(
    "song-list",
    JSON.stringify({
      temp,
      newFolder,
      isDev: isDev,
      path: { publicDirectoryPath, test: publicDirectoryPath.slice(0, -5) },
    })
  );
});

module.exports = { createWindow };
