import { Context } from "../ContextProvider";
import { Timer } from "./Timer";
import { useContext, useEffect, useRef, useState } from "react";

export function TimerOnryo() {
    const { difficulty, reset } = useContext(Context)!;
    const [tempo, setTempo] = useState(0);
    const primeiro = useRef(true);

    const TEMPO_INICIAL = 30;
    const TEMPO_POSTERIOR = 20;

    useEffect(() => {
        const lidarComAtalho = () => {
            setTempo(primeiro.current ? TEMPO_INICIAL : TEMPO_POSTERIOR);
            primeiro.current = false;
        };

        const removerListener =
            window.electronAPI?.onToggleTimerOnryo(lidarComAtalho);

        return () => {
            if (removerListener) {
                removerListener();
            }
        };
    }, []);

    useEffect(() => {
        setTempo(0);
        primeiro.current = true;
    }, [difficulty, reset]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (tempo > 0) {
            timeout = setTimeout(() => {
                setTempo(tempo - 1);
            }, 1000);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [tempo]);

    return <Timer titulo="Fogo" tempo={tempo}/>;
}
