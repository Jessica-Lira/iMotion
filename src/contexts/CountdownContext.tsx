import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";

interface CountdownContextData{
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps{
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

//para que não diminua um segundo quando clicar em 'Abandonar o ciclo'
let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider( {children}: CountdownProviderProps ) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(25 * 60); //25minutos
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes =  Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown(){
        setIsActive(true);
    }

    function resetCountdown(){
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setTime(25 * 60); //resetar o contador
        setHasFinished(false);
    }

    useEffect(() => {
        if(isActive && time > 0) {
            countdownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time === 0){ /*quando o contador zerar*/
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time])

    return(
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown,
        }}>
            {children}
        </CountdownContext.Provider>
    )
}