
import { useState, useEffect } from "react";

export const useJobTrackerSettings = () => {
  const [autoAddJobs, setAutoAddJobs] = useState<boolean>(false);

  // Load setting from localStorage on mount
  useEffect(() => {
    const savedSetting = localStorage.getItem("autoAddJobsToTracker");
    if (savedSetting !== null) {
      setAutoAddJobs(JSON.parse(savedSetting));
    }
  }, []);

  // Save setting to localStorage whenever it changes
  const toggleAutoAddJobs = (enabled: boolean) => {
    setAutoAddJobs(enabled);
    localStorage.setItem("autoAddJobsToTracker", JSON.stringify(enabled));
  };

  return {
    autoAddJobs,
    toggleAutoAddJobs,
  };
};
