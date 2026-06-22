import { Context } from "../ContextProvider";
import { Timer } from "./Timer";
import { useContext, useEffect, useState } from "react";

export function TimerSom() {
    const { difficulty, reset } = useContext(Context);
    const [tempo, setTempo] = useState(0);
    const [color, setColor] = useState<string | undefined>(undefined);

    const TEMPO_INICIAL = 80;
    const TEMPO_MYLING = TEMPO_INICIAL - 64;

    useEffect(() => {
        const lidarComAtalho = () => {
            setTempo(TEMPO_INICIAL);
            setColor(undefined);
        };

        const removerListener =
            window.electronAPI?.onToggleTimerSom(lidarComAtalho);

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
            if (tempo <= TEMPO_MYLING) {
                setColor("myling");
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

    return <Timer titulo="Som" tempo={tempo} color={color} />;
}