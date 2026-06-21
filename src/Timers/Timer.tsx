import './Timer.css';

interface TimerProps {
    titulo: string;
    tempo: number;
    color?: string;
}

export function Timer({ titulo, tempo, color }: Readonly<TimerProps>) {
    let minutos = Math.floor(tempo / 60);
    let segundos = tempo % 60;

    return (
        <div className="timer">
            <h3>{titulo}</h3>
            <p className={color || 'default'}>{minutos}:{segundos < 10 ? `0${segundos}` : segundos}</p>
        </div>
    )
}