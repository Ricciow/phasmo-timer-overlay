import "./App.css";
import { useEffect, useState } from "react";
import { TimerIncenso } from "./Timers/TimerIncenso.tsx";
import { TimerHuntCD } from "./Timers/TimerHuntCD.tsx";
import { TimerSom } from "./Timers/TimerSom.tsx";
import { MapSelector } from "./MapSelector.tsx";
import { TimerOnryo } from "./Timers/TimerOnryo.tsx";
import { TimerHunt } from "./Timers/TimerHunt.tsx";
import { Velocidade } from "./Velocidade.tsx";
import { ContextProvider } from "./ContextProvider.tsx";

function App() {
    const [menuAberto, setMenuAberto] = useState(true);

    useEffect(() => {
        const lidarComAtalho = (isFocused: boolean) => {
            setMenuAberto(isFocused);
        };

        const removerListener = window.electronAPI?.onToggleWindow(lidarComAtalho);

        return () => {
            if (removerListener) {
                removerListener();
            }
        };
    }, []);

    return (
        menuAberto && (
            <div className="app-container">
                <ContextProvider>
                    <MapSelector />
                    <div className="timers-container">
                        <TimerIncenso />
                        <TimerHuntCD />
                        <TimerHunt />
                        <TimerSom />
                        <Velocidade />
                        <TimerOnryo />
                    </div>
                </ContextProvider>
            </div>
        )
    );
}

export default App;
