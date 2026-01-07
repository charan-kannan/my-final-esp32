'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData, RiskLevel } from '@/lib/types';
import { SENSOR_TYPES, SENSOR_THRESHOLDS } from '@/lib/constants';
import type { User } from 'firebase/auth';
import type { SettingsContextType } from '@/components/settings-provider';
import { useToast } from './use-toast';
import { sendAlertNotification } from '@/ai/flows/send-alert-notification';

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

export function useSensorData(user: User | null, settings: SettingsContextType) {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const previousSensorsRef = useRef<SensorData[]>([]);

  useEffect(() => {
    previousSensorsRef.current = sensors;
  }, [sensors]);

  const triggerNotifications = useCallback((newSensorState: SensorData, oldSensorState: SensorData | undefined) => {
    if (!user || !oldSensorState) return;

    const becameDanger = newSensorState.riskLevel === 'DANGER' && oldSensorState.riskLevel !== 'DANGER';

    if (becameDanger) {
      if (settings.pushAlerts) {
        toast({
          variant: "destructive",
          title: `🚨 DANGER: ${newSensorState.type} Alert`,
          description: `The ${newSensorState.type} level has reached a dangerous value of ${newSensorState.value.toFixed(1)} ${newSensorState.unit}. Please take immediate action.`,
        });
      }
      if (settings.emailAlerts && user.email) {
        console.log(`Sending email for ${newSensorState.type}...`);
        sendAlertNotification({
            userEmail: user.email,
            sensorType: newSensorState.type,
            sensorValue: newSensorState.value,
            unit: newSensorState.unit
        }).then(response => {
            console.log(response.message);
        }).catch(error => {
            console.error("Failed to send alert notification:", error);
        });
      }
    }
  }, [user, settings.pushAlerts, settings.emailAlerts, toast]);


  const updateSensorData = useCallback(() => {
    setSensors(currentSensors => {
      const newSensors = currentSensors.map(sensor => {
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

      // Check for state changes and trigger notifications
      newSensors.forEach(newSensor => {
        const oldSensor = previousSensorsRef.current.find(s => s.id === newSensor.id);
        triggerNotifications(newSensor, oldSensor);
      });

      return newSensors;
    });
  }, [triggerNotifications]);

  useEffect(() => {
    if (!isInitialized) {
      const initialSensors = generateInitialSensors();
      setSensors(initialSensors);
      previousSensorsRef.current = initialSensors;
      setIsInitialized(true);
    }
    
    const interval = setInterval(updateSensorData, 2000);
    return () => clearInterval(interval);
  }, [isInitialized, updateSensorData]);

  return { sensors, isLoading: !isInitialized };
}
