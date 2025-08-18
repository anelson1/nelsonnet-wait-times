
import Fireworks from "@fireworks-js/react";
import "./App.css";
import WaitTime from "./components/WaitTime/WaitTime";
import { useEffect, useRef, useState } from "react";

function App() {
  const [showFireworks, setShowFireworks] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {

    const triggerFireworks = () => {
      setShowFireworks(true);
      timeoutRef.current = setTimeout(() => {
        setShowFireworks(false);
      }, 10000);
    };

    triggerFireworks();

    const interval = setInterval(triggerFireworks, 300000);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleTap = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setShowFireworks(false);
    }

    setShowFireworks(true);
    timeoutRef.current = setTimeout(() => {
      setShowFireworks(false);
    }, 10000);
  };
  return (
    <main className="container" onClick={handleTap}>
      {showFireworks && (
        <Fireworks
          options={{
            opacity: 0.5,
            delay: { min: 50, max: 200 }
          }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: 999,
          }}
        />
      )}
      <WaitTime parkId={6} parkName="Magic Kingdom" />
      <div className="divider" />
      <WaitTime parkId={5} parkName="Epcot" />
      <div className="divider" />
      <WaitTime parkId={7} parkName="Hollywood Studios" />
      <div className="divider" />
      <WaitTime parkId={8} parkName="Animal Kingdom" />
    </main>
  );
}

export default App;
