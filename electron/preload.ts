import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) =>
            listener(event, ...args),
        );
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },
});

contextBridge.exposeInMainWorld("electronAPI", {
    onToggleWindow: (callback: (isFocused?: boolean) => void) => {
        const listener = (_event: IpcRendererEvent, isFocused?: boolean) => {
            callback(isFocused);
        };

        ipcRenderer.on("toggle-menu", listener);
        
        return () => {
            ipcRenderer.off("toggle-menu", listener);
        };
    },
    onToggleTimerIncenso: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("toggle-timer-incenso", callback);

        return () => {
            ipcRenderer.off("toggle-timer-incenso", callback);
        };
    },
    onToggleTimerHuntCD: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("toggle-timer-hunt-cd", callback);
        return () => {
            ipcRenderer.off("toggle-timer-hunt-cd", callback);
        }
    },
    onToggleTimerHunt: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("toggle-timer-hunt", callback);
        return () => {
            ipcRenderer.off("toggle-timer-hunt", callback);
        }
    },
    onToggleTimerSom: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("toggle-timer-som", callback);
        return () => {
            ipcRenderer.off("toggle-timer-som", callback);
        }
    },
    onToggleTimerOnryo: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("toggle-timer-onryo", callback);
        return () => {
            ipcRenderer.off("toggle-timer-onryo", callback);
        }
    },
    onChangeMapForward: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("change-map-forward", callback);
        return () => {
            ipcRenderer.off("change-map-forward", callback);
        }
    },
    onChangeMapBackward: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("change-map-backward", callback);
        return () => {
            ipcRenderer.off("change-map-backward", callback);
        }
    },
    onVelocidadeStep: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("velocidade-step", callback);
        return () => {
            ipcRenderer.off("velocidade-step", callback);
        }
    },
    onResetTimers: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on("reset-timers", callback);
        return () => {
            ipcRenderer.off("reset-timers", callback);
        }
    },
});
