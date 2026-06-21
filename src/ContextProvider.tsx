import { createContext, useEffect, useState } from "react";
import { Difficulty } from "./tipos";

interface ContextValues {
    difficulty: Difficulty["difficulty"];
    reset: number;
}

interface ChildrenProps {
    children: React.ReactNode;
}

export const Context = createContext<ContextValues>({
    difficulty: 1,
    reset: 0,
});

export function ContextProvider({ children }: Readonly<ChildrenProps>) {
    const [difficulty, setDifficulty] = useState<ContextValues["difficulty"]>(1);
    const [reset, setReset] = useState<ContextValues["reset"]>(0);

    useEffect(() => {
        const lidarComAtalhoFrente = () => {
            setDifficulty((prev) => (prev === 3 ? 1 : (prev + 1)) as Difficulty["difficulty"]);
        };

        const lidarComAtalhoTras = () => {
            setDifficulty((prev) => (prev === 1 ? 3 : (prev - 1)) as Difficulty["difficulty"]);
        }

        const lidarComReset = () => {
            setReset((prev) => prev + 1);
        };

        const removerListenerForward = window.electronAPI?.onChangeMapForward(lidarComAtalhoFrente);
        const removerListenerBackward = window.electronAPI?.onChangeMapBackward(lidarComAtalhoTras);
        const removerListenerReset = window.electronAPI?.onResetTimers(lidarComReset);

        return () => {
            if (removerListenerForward) {
                removerListenerForward();
            }
            if (removerListenerBackward) {
                removerListenerBackward();
            }
            if (removerListenerReset) {
                removerListenerReset();
            }
        };
    }, []);

    return (
        <Context.Provider value={{ difficulty, reset }}>
            {children}
        </Context.Provider>
    );
}