import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { logApi } from "../api/logApi";
import { useAuth } from "./AuthContext";

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchDailySummary = useCallback(async (dateToFetch) => {
    if (!isAuthenticated) return;
    setLoadingSummary(true);
    try {
      const d = dateToFetch || selectedDate;
      const { data } = await logApi.getSummary(d);
      if (data?.success) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error("[HealthContext Error] Failed to fetch summary", err);
    } finally {
      setLoadingSummary(false);
    }
  }, [isAuthenticated, selectedDate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDailySummary(selectedDate);
    }
  }, [isAuthenticated, selectedDate, fetchDailySummary]);

  return (
    <HealthContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        summary,
        loadingSummary,
        refreshSummary: () => fetchDailySummary(selectedDate),
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
