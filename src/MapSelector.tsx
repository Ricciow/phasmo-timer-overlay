import { useContext, useEffect, useState } from "react";
import "./MapSelector.css"
import { Context } from "./ContextProvider";

export function MapSelector() {
    const { difficulty, reset } = useContext(Context);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        setIsHidden(false);
        const timeout = setTimeout(() => {
            setIsHidden(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [difficulty]);

    useEffect(() => {
        setIsHidden(true);
    }, [reset]);

    return (
        <div className={`map-selector ${isHidden ? 'hidden' : ''}`}>
            <p className="map p">P<div className={`map-overlay ${difficulty === 1 ? 'map-overlay-selected' : ''}`}/></p>
            <p className="map m">M<div className={`map-overlay ${difficulty === 2 ? 'map-overlay-selected' : ''}`}/></p>
            <p className="map g">G<div className={`map-overlay ${difficulty === 3 ? 'map-overlay-selected' : ''}`}/></p>
        </div>
    );
}