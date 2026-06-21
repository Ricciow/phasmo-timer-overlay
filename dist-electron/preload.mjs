"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  onToggleWindow: (callback) => {
    const listener = (_event, isFocused) => {
      callback(isFocused);
    };
    electron.ipcRenderer.on("toggle-menu", listener);
    return () => {
      electron.ipcRenderer.off("toggle-menu", listener);
    };
  },
  onToggleTimerIncenso: (callback) => {
    electron.ipcRenderer.on("toggle-timer-incenso", callback);
    return () => {
      electron.ipcRenderer.off("toggle-timer-incenso", callback);
    };
  },
  onToggleTimerHuntCD: (callback) => {
    electron.ipcRenderer.on("toggle-timer-hunt-cd", callback);
    return () => {
      electron.ipcRenderer.off("toggle-timer-hunt-cd", callback);
    };
  },
  onToggleTimerHunt: (callback) => {
    electron.ipcRenderer.on("toggle-timer-hunt", callback);
    return () => {
      electron.ipcRenderer.off("toggle-timer-hunt", callback);
    };
  },
  onToggleTimerSom: (callback) => {
    electron.ipcRenderer.on("toggle-timer-som", callback);
    return () => {
      electron.ipcRenderer.off("toggle-timer-som", callback);
    };
  },
  onToggleTimerOnryo: (callback) => {
    electron.ipcRenderer.on("toggle-timer-onryo", callback);
    return () => {
      electron.ipcRenderer.off("toggle-timer-onryo", callback);
    };
  },
  onChangeMapForward: (callback) => {
    electron.ipcRenderer.on("change-map-forward", callback);
    return () => {
      electron.ipcRenderer.off("change-map-forward", callback);
    };
  },
  onChangeMapBackward: (callback) => {
    electron.ipcRenderer.on("change-map-backward", callback);
    return () => {
      electron.ipcRenderer.off("change-map-backward", callback);
    };
  },
  onVelocidadeStep: (callback) => {
    electron.ipcRenderer.on("velocidade-step", callback);
    return () => {
      electron.ipcRenderer.off("velocidade-step", callback);
    };
  },
  onResetTimers: (callback) => {
    electron.ipcRenderer.on("reset-timers", callback);
    return () => {
      electron.ipcRenderer.off("reset-timers", callback);
    };
  }
});
