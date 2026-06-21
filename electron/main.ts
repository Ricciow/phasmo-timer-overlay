import { app, BrowserWindow, screen, globalShortcut } from "electron";
import { fileURLToPath } from "node:url";
import { windowManager } from "node-window-manager";
import path from "path";

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

    // Importante: forward: true passa os cliques adiante para o jogo
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

function desregistrarAtalhos() {
    if (!registradoAtalhos) return;
    registradoAtalhos = false;
    globalShortcut.unregister("1");
    globalShortcut.unregister("2");
    globalShortcut.unregister("3");
    globalShortcut.unregister("4");
    globalShortcut.unregister("5");
    globalShortcut.unregister(",");
    globalShortcut.unregister(".");
    globalShortcut.unregister("Space");
    globalShortcut.unregister("r");
}

function registrarAtalhos() {
    if (registradoAtalhos) return;
    registradoAtalhos = true;
    
    globalShortcut.register("1", () => win?.webContents.send("toggle-timer-incenso"));
    globalShortcut.register("2", () => win?.webContents.send("toggle-timer-hunt-cd"));
    globalShortcut.register("3", () => win?.webContents.send("toggle-timer-hunt"));
    globalShortcut.register("4", () => win?.webContents.send("toggle-timer-som"));
    globalShortcut.register("5", () => win?.webContents.send("toggle-timer-onryo"));
    globalShortcut.register(",", () => win?.webContents.send("change-map-backward"));
    globalShortcut.register(".", () => win?.webContents.send("change-map-forward"));
    globalShortcut.register("Space", () => win?.webContents.send("velocidade-step"));
    globalShortcut.register("r", () => win?.webContents.send("reset-timers"));
}

let isGameFocused = true;
let gameWasOpen = false;

function startPhasmophobiaMonitor() {
    const TARGET_WINDOW_TITLE = "Phasmophobia";
    
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
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("will-quit", () => {
    if (monitorInterval) clearInterval(monitorInterval);
    globalShortcut.unregisterAll();
});