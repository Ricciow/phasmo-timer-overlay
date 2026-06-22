import { useEffect, useState, useRef, useContext } from 'react';
import './Timers/Timer.css';
import { Context } from './ContextProvider';

export function Velocidade() {
    const [velocidade, setVelocidade] = useState<number | string>(0);
    const { difficulty, reset } = useContext(Context);
    const taps = useRef<number[]>([]);
    const resetTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const lidarComAtalho = () => {
            const agora = Date.now();
            taps.current.push(agora);

            if (taps.current.length > 5) {
                taps.current.shift();
            }

            if (taps.current.length >= 2) {
                let somaBpm = 0;
                let contagem = 0;

                for (let i = 1; i < taps.current.length; i++) {
                    const diffSegundos = (taps.current[i] - taps.current[i - 1]) / 1000;
                    if (diffSegundos > 0) {
                        somaBpm += (60 / diffSegundos);
                        contagem++;
                    }
                }

                if (contagem > 0) {
                    const bpmMedio = somaBpm / contagem;
                    let speedCalculada = bpmMedio / (60 + bpmMedio * 0.075);
                    
                    if (speedCalculada > 5.0) speedCalculada = 5.0;
                    if (speedCalculada < 0) speedCalculada = 0;

                    setVelocidade(speedCalculada.toFixed(2));
                }
            }

            if (resetTimeout.current) clearTimeout(resetTimeout.current);
            resetTimeout.current = setTimeout(() => {
                taps.current = [];
                setVelocidade(0);
            }, 5000);
        };

        const removerListener = window.electronAPI?.onVelocidadeStep?.(lidarComAtalho);

        return () => {
            if (removerListener) {
                removerListener();
            }
            if (resetTimeout.current) {
                clearTimeout(resetTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        setVelocidade(0);
        taps.current = [];
    }, [difficulty, reset]);

    return (
        <div className="timer">
            <h3>Velocidade</h3>
            <p className="speed">{velocidade === 0 ? "---" : `${velocidade} m/s`}</p>
        </div>
    )
}