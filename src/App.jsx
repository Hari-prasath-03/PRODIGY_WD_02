/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import playIcon from "./assets/play.png";
import pauseIcon from "./assets/pause.png";
import restartIcon from "./assets/restart.png";
import flagIcon from "./assets/flag.png";
import "./App.css";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startBtn, setStartBtn] = useState(true);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);
  const [flagArray, setFlagArray] = useState([]);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    setBlink(false);
    const intervel = setInterval(() => {
      setBlink(true);
    },250);
    return () => clearInterval(intervel);
  },[flagArray]);

  const start = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
    console.log(startTimeRef.current);
    setStartBtn(!startBtn);
  };

  const stop = () => {
    setIsRunning(false);
    setStartBtn(!startBtn);
  };

  const [count, setCount] = useState(1);
  const flag = (time) => {
    if (count == 1 || flagArray[0].time != time) {
      setCount((prevCount) => (prevCount += 1));
      setFlagArray([{ id: count, time: time }, ...flagArray]);
    }
  };

  const handleDisplay = () => {
    setStartBtn(!startBtn);
    isRunning ? stop() : start();
  };

  const reset = () => {
    setElapsedTime(0);
    setIsRunning(false);
    setStartBtn(true);
    setFlagArray([]);
    setCount(1);
  };

  const padStart = (num) => {
    return num < 10 ? "0" + String(num) : String(num);
  };

  const formatTime = () => {
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    minutes = padStart(minutes);
    seconds = padStart(seconds);
    milliseconds = padStart(milliseconds);

    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div className="flex flex-col items-center gap-y-3 bg-white py-5 px-10 min-w-80 shadow-lg shadow-black md:gap-y-12"> {/* Page container */}
      <div className="w-full text-3xl font-bold text-[#383838] opacity-80 font-mono mb-4">
        Stopwatch
      </div> {/*Title*/}
      <div
        onClick={handleDisplay}
        className="flex flex-col items-center justify-center bg-white border-[5px] border-[hsl(0,0%,75%)] rounded-[50%] p-6"
      >
        <div className="flex items-center justify-center font-mono text-[2.8rem] px-2 font-black text-[hsl(0,0%,25%)] h-[160px] w-[165px] md:px-2">
          {blink && formatTime()}
        </div> {/* Display Border end*/}
      </div> {/* Display end*/}
      <div className="flex flex-col h-32 overflow-x-auto scroll-x md:h-40 md:gap-x-[5px]"> {/*flag timing*/}
        {flagArray &&
          flagArray.map((flagTime, i) => (
            <>
              <span
                key={i}
                className="text-2xl font-bold tracking-wide opacity-75 font-mono"
              >
                <span className="opacity-75">
                  {flagTime.id}
                </span>
                &nbsp;&nbsp;&nbsp;{flagTime.time}
              </span>
            </>
          ))}
      </div> {/*flag timing end*/}
      <div className="flex gap-5"> {/* Controles container */}
        {(isRunning || elapsedTime != 0) && (
          <button className="btn relative restart" onClick={reset}>
            <img
              src={restartIcon}
              alt="restartIcon"
              className="h-8 w-8 opacity-70"
            />
          </button>
        )}
        {startBtn ? (
          <button className="btn" onClick={start}>
            <img
              src={playIcon}
              alt="playIcon"
              className="h-[4.2rem] w-[4.2rem]"
            />
          </button>
        ) : (
          <button className="btn" onClick={stop}>
            <img
              src={pauseIcon}
              alt="playIcon"
              className="h-[4.2rem] w-[4.2rem]"
            />
          </button>
        )}
        {(isRunning || elapsedTime != 0) && (
          <button
            className="btn relative flag"
            onClick={() => flag(formatTime())}
          >
            <img src={flagIcon} alt="playIcon" className="h-8 w-8 opacity-70" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

{
  /* <div>
      <button className="btn bg-[hsl(115,100%,40%)] hover:bg-[hsl(115,100%,35%)]" onClick={start}>Start</button>
      <button className="btn bg-[hsl(0,90%,50%)] hover:bg-[hsl(0,90%,45%)]" onClick={stop}>Stop</button>
      <button className="btn bg-[hsl(205,90%,60%)] hover:bg-[hsl(205,90%,55%)]" onClick={reset}>Reset</button>
    </div> */
}
