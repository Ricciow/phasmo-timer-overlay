import { Context } from "../ContextProvider";
import { Timer } from "./Timer";
import { useContext, useEffect, useState } from "react";

export function TimerIncenso() {
    const { difficulty, reset } = useContext(Context)!;
    const [tempo, setTempo] = useState(0);
    const [color, setColor] = useState<string | undefined>(undefined);
    const [isSpirit, setIsSpirit] = useState(true);

    const TEMPO_INICIAL = 90;
    const TEMPO_DEMON = 30;
    const TEMPO_SPIRIT = 90;

    useEffect(() => {
        const lidarComAtalho = () => {
            setTempo(TEMPO_INICIAL);
            setIsSpirit(false);
            setColor(undefined);
        };

        const removerListener =
            window.electronAPI?.onToggleTimerIncenso(lidarComAtalho);

        return () => {
            if (removerListener) {
                removerListener();
            }
        };
    }, []);

    useEffect(() => {
        setTempo(0);
        setColor(undefined);
        setIsSpirit(true);
    }, [difficulty, reset]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (tempo > 0) {
            timeout = setTimeout(() => {
                setTempo(tempo - 1);
            }, 1000);
            if (tempo <= TEMPO_DEMON && !isSpirit) {
                setColor("demon");
            }
        } else if (tempo == 0 && !isSpirit) {
            setIsSpirit(true);
            setTempo(TEMPO_SPIRIT);
            setColor("spirit");
        } else {
            setColor(undefined);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [tempo, isSpirit]);

    return <Timer titulo="Incenso" tempo={tempo} color={color} />;
}
