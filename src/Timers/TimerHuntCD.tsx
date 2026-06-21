import { Context } from "../ContextProvider";
import { Timer } from "./Timer";
import { useContext, useEffect, useState } from "react";

export function TimerHuntCD() {
    const { difficulty, reset } = useContext(Context)!;
    const [tempo, setTempo] = useState(0);
    const [color, setColor] = useState<string | undefined>(undefined);

    const TEMPO_INICIAL = 25;
    const TEMPO_DEMON = 5;

    useEffect(() => {
        const lidarComAtalho = () => {
            setTempo(TEMPO_INICIAL);
            setColor(undefined);
        };

        const removerListener =
            window.electronAPI?.onToggleTimerHuntCD(lidarComAtalho);

        return () => {
            if (removerListener) {
                removerListener();
            }
        };
    }, []);

    useEffect(() => {
        setTempo(0);
        setColor(undefined);
    }, [difficulty, reset]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (tempo > 0) {
            timeout = setTimeout(() => {
                setTempo(tempo - 1);
            }, 1000);
            if (tempo <= TEMPO_DEMON) {
                setColor("demon");
            }
        } else {
            setColor(undefined);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [tempo]);

    return <Timer titulo="CD Caça" tempo={tempo} color={color} />;
}
