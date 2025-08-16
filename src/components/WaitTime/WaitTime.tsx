import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import "./WaitTime.css";

interface Props {
  parkId: number
  parkName: string
}

interface WaitTimeResponse {
  land_name: string,
  ride_name: string,
  wait_time: number,
  is_open: boolean,
  last_updated: string,
}

const WaitTime: React.FC<Props> = ({ parkId, parkName }) => {
  const [waitTimes, setWaitTimes] = useState<WaitTimeResponse[]>([]);
  const [currentLand, setCurrentLand] = useState<string>("");
  const [currentLandIndex, setCurrentLandIndex] = useState<number>(0);
  const [currentRide, setCurrentRide] = useState<string>("");
  const [currentWaitTime, setCurrentWaitTime] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchWaitTime = async () => {
    const time = await invoke<WaitTimeResponse[]>("fetch_ride_wait_times", { parkId });
    setWaitTimes(time);
  }

  useEffect(() => {
    const initialStartup = async () => {
      await fetchWaitTime();
    };
    initialStartup().catch(console.error);

    const refetchInterval = setInterval(() => {
      fetchWaitTime();
    }, 900000);

    return () => clearInterval(refetchInterval);
  }, []);

  useEffect(() => {
    if (waitTimes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentLandIndex((prevIndex) => (prevIndex + 1) % waitTimes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [waitTimes]);

  useEffect(() => {
    if (waitTimes.length === 0) return;
    const current = waitTimes[currentLandIndex];
    setCurrentLand(current.land_name);
    setCurrentRide(current.ride_name);
    setCurrentWaitTime(current.wait_time);
    setIsOpen(current.is_open);
  }, [currentLandIndex, waitTimes]);

  useEffect(() => {
    setCurrentLand(waitTimes[0]?.land_name || "");
    setCurrentRide(waitTimes[0]?.ride_name || "");
    setCurrentWaitTime(waitTimes[0]?.wait_time);
    setIsOpen(waitTimes[0]?.is_open || false);
  }, [waitTimes]);

  return (
    <div className={`wait-time-container ${parkName.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className="wait-time">
      <h1>{parkName}</h1>
      <h2>{currentLand}</h2>
      <h3>{currentRide}</h3>
      <h4>Wait Time:</h4>
      <p>{isOpen ? `${currentWaitTime} Minutes` : "Closed"}</p>
    </div>
    </div>
  );
}

export default WaitTime;