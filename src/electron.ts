import { app, BrowserWindow, systemPreferences } from "electron"
import * as path from "path"
import * as isDev from "electron-is-dev";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
  });

  if(systemPreferences.getMediaAccessStatus("camera")!="granted") {
    systemPreferences.askForMediaAccess("camera")
  }

  mainWindow.loadURL(
    isDev
      ? "http://localhost:1234"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
