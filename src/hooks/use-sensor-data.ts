'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SensorData, RiskLevel } from '@/lib/types';
import { SENSOR_TYPES, SENSOR_THRESHOLDS } from '@/lib/constants';

const HISTORY_LENGTH = 20;

function getRiskLevel(type: keyof typeof SENSOR_THRESHOLDS, value: number): RiskLevel {
  const thresholds = SENSOR_THRESHOLDS[type];
  if (value >= thresholds.danger) return 'DANGER';
  if (value >= thresholds.caution) return 'CAUTION';
  return 'SAFE';
}

const generateInitialSensors = (): SensorData[] => {
  return SENSOR_TYPES.map((type, index) => {
    const { min, max, unit } = SENSOR_THRESHOLDS[type];
    const initialValue = min + (max - min) / 2;
    return {
      id: index,
      type: type,
      value: initialValue,
      unit: unit,
      riskLevel: getRiskLevel(type, initialValue),
      history: Array(HISTORY_LENGTH)
        .fill(0)
        .map((_, i) => ({ time: `t-${i}`, value: initialValue })),
      min,
      max,
    };
  });
};

export function useSensorData() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This effect handles firing toasts when a sensor enters a DANGER state.
    sensors.forEach(sensor => {
      // Find the previous state of the sensor to check if the risk level changed.
      const previousHistoryValue = sensor.history[sensor.history.length - 2]?.value;
      if (previousHistoryValue === undefined) return;

      const previousRiskLevel = getRiskLevel(sensor.type, previousHistoryValue);
      const currentRiskLevel = sensor.riskLevel;
      
      if (currentRiskLevel === 'DANGER' && previousRiskLevel !== 'DANGER') {
        toast({
          variant: 'destructive',
          title: 'High-Risk Alert!',
          description: `${sensor.type} levels are dangerously high: ${sensor.value.toFixed(
            2
          )} ${sensor.unit}`,
        });
      }
    });
  }, [sensors, toast]);


  const updateSensorData = useCallback(() => {
    setSensors(prevSensors => {
      // If it's the first run, generate initial data.
      if (prevSensors.length === 0) {
        return generateInitialSensors();
      }
      return prevSensors.map(sensor => {
        const { min, max } = SENSOR_THRESHOLDS[sensor.type];
        const change = (Math.random() - 0.5) * (max - min) * 0.1;
        let newValue = sensor.value + change;
        if (newValue > max) newValue = max;
        if (newValue < min) newValue = min;

        const newRiskLevel = getRiskLevel(sensor.type, newValue);
        const newHistory = [
          ...sensor.history.slice(1),
          { time: new Date().toISOString(), value: newValue },
        ];

        return {
          ...sensor,
          value: newValue,
          riskLevel: newRiskLevel,
          history: newHistory,
        };
      });
    });
  }, []);

  useEffect(() => {
    // Initialize data once.
    if (!isInitialized) {
        setSensors(generateInitialSensors());
        setIsInitialized(true);
    }
    
    // Set up the interval to update sensor data.
    const interval = setInterval(updateSensorData, 2000);
    return () => clearInterval(interval);
  }, [isInitialized, updateSensorData]);

  return { sensors, isLoading: !isInitialized };
}
