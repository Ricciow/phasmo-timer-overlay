import { Context } from "../ContextProvider";
import { Difficulty } from "../tipos";
import { Timer } from "./Timer";
import { useContext, useEffect, useState } from "react";

const TimeMap: Record<Difficulty["difficulty"], number> = {
    1: 30,
    2: 50,
    3: 60,
};

export function TimerHunt() {
    const { difficulty, reset } = useContext(Context);
    const TEMPO_INICIAL = TimeMap[difficulty] ?? 30;
    const TEMPO_OBAMBO = TEMPO_INICIAL * 0.2;
    const TEMPO_AMALDICOADO = 20;

    const [tempo, setTempo] = useState(TEMPO_INICIAL);
    const [color, setColor] = useState<string | undefined>(undefined);
    const [isHaunted, setIsHaunted] = useState(false);

    useEffect(() => {
        const lidarComAtalho = () => {
            setTempo(TEMPO_INICIAL);
            setColor(undefined);
            setIsHaunted(false);
        };

        const removerListener = window.electronAPI?.onToggleTimerHunt(lidarComAtalho);

        return () => {
            if (removerListener) removerListener();
        };
    }, [TEMPO_INICIAL]);

    useEffect(() => {
        setTempo(0);
        setColor(undefined);
        setIsHaunted(true);
    }, [difficulty, reset]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (tempo > 0) {
            timeout = setTimeout(() => {
                setTempo((prev) => prev - 1);
            }, 1000);

            if (!isHaunted && tempo <= TEMPO_OBAMBO) {
                setColor("obambo");
            }
        } else if (tempo === 0 && !isHaunted) {
            setIsHaunted(true);
            setTempo(TEMPO_AMALDICOADO);
            setColor("amaldicoado");
        } else if (tempo === 0 && isHaunted) {
            setColor(undefined);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [tempo, isHaunted, TEMPO_OBAMBO, TEMPO_AMALDICOADO]);

    return <Timer titulo="Caça" tempo={tempo} color={color} />;
}