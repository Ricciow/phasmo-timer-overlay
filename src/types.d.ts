// Define o formato da sua API exposta no preload
export interface ElectronAPI {
  onToggleWindow: (callback: (isFocused: boolean) => void) => () => void;
  onToggleTimerIncenso: (callback: () => void) => () => void;
  onToggleTimerHuntCD: (callback: () => void) => () => void;
  onToggleTimerHunt: (callback: () => void) => () => void;
  onToggleTimerSom: (callback: () => void) => () => void;
  onToggleTimerOnryo: (callback: () => void) => () => void;
  onChangeMapForward: (callback: () => void) => () => void;
  onChangeMapBackward: (callback: () => void) => () => void;
  onVelocidadeStep: (callback: () => void) => () => void;
  onResetTimers: (callback: () => void) => () => void;
}

// Estende a interface Window nativa do navegador
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}