import { app, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import { windowManager } from "node-window-manager";
import { uIOhook, UiohookKey } from "uiohook-napi";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

let win: BrowserWindow | null = null;
let monitorInterval: NodeJS.Timeout | null = null;
let registradoAtalhos = false;

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width } = primaryDisplay.workAreaSize;

    const overlayWidth = 460;
    const overlayHeight = 700;
    const margin = 20;

    const posX = width - overlayWidth - margin;
    const posY = margin;

    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, "icon.ico"),
        width: overlayWidth,
        height: overlayHeight,
        x: posX,
        y: posY,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        show: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    win.setIgnoreMouseEvents(true, { forward: true });

    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString(),
        );
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
}

function handleKeyDown(e: { keycode: number; ctrlKey?: boolean, shiftKey?: boolean }) {
    if (e.ctrlKey && e.keycode === UiohookKey.Escape) {
        app.quit();
    }

    if (!registradoAtalhos) return;

    switch (e.keycode) {
        case UiohookKey["1"]:
            win?.webContents.send("toggle-timer-incenso");
            break;
        case UiohookKey["2"]:
            win?.webContents.send("toggle-timer-hunt-cd");
            break;
        case UiohookKey["3"]:
            win?.webContents.send("toggle-timer-hunt");
            break;
        case UiohookKey["4"]:
            win?.webContents.send("toggle-timer-som");
            break;
        case UiohookKey["5"]:
            win?.webContents.send("toggle-timer-onryo");
            break;
        case UiohookKey.Comma:
            win?.webContents.send("change-map-backward");
            break;
        case UiohookKey.Period:
            win?.webContents.send("change-map-forward");
            break;
        case UiohookKey.Space:
            win?.webContents.send("velocidade-step");
            break;
        case UiohookKey.R:
            win?.webContents.send("reset-timers");
            break;
    }
}

function desregistrarAtalhos() {
    registradoAtalhos = false;
}

function registrarAtalhos() {
    registradoAtalhos = true;
}

let isGameFocused = true;
let gameWasOpen = false;

function startPhasmophobiaMonitor() {
    const TARGET_WINDOW_TITLE = "Phasmophobia";
    
    uIOhook.on("keydown", handleKeyDown);
    uIOhook.start();

    monitorInterval = setInterval(() => {
        try {
            const allWindows = windowManager.getWindows();
            const isGameOpen = allWindows.some(w => w.getTitle() === TARGET_WINDOW_TITLE);

            if (!isGameOpen) {
                if (gameWasOpen) {
                    app.quit();
                }
                return;
            }

            gameWasOpen = true;
            const activeWindow = windowManager.getActiveWindow();
            
            if (activeWindow) {
                const title = activeWindow.getTitle();
                const currentlyFocused = (title === TARGET_WINDOW_TITLE);

                if (currentlyFocused !== isGameFocused) {
                    isGameFocused = currentlyFocused;

                    if (isGameFocused) {
                        registrarAtalhos();
                    } else {
                        desregistrarAtalhos();
                    }

                    win?.webContents.send("toggle-menu", isGameFocused);
                }
            }
        } catch (err) {
            console.error("Erro no monitor de janelas:", err);
        }
    }, 500);
}

app.whenReady().then(() => {
    createWindow();
    startPhasmophobiaMonitor();
});

app.on("window-all-closed", () => {
    if (monitorInterval) clearInterval(monitorInterval);
    uIOhook.stop();
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("will-quit", () => {
    if (monitorInterval) clearInterval(monitorInterval);
    uIOhook.stop();
});