"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { SensorData, RiskLevel } from '@/lib/types';
import { SENSOR_TYPES, SENSOR_THRESHOLDS } from '@/lib/constants';

const HISTORY_LENGTH = 20;

function getRiskLevel(type: keyof typeof SENSOR_THRESHOLDS, value: number): RiskLevel {
    const thresholds = SENSOR_THRESHOLDS[type];
    if (value >= thresholds.danger) return "DANGER";
    if (value >= thresholds.caution) return "CAUTION";
    return "SAFE";
}

const generateInitialSensors = () => {
    return SENSOR_TYPES.map((type, index) => {
        const { min, max, unit } = SENSOR_THRESHOLDS[type];
        const initialValue = min + (max - min) / 2;
        return {
            id: index,
            type: type,
            value: initialValue,
            unit: unit,
            riskLevel: getRiskLevel(type, initialValue),
            history: Array(HISTORY_LENGTH).fill(0).map((_, i) => ({ time: `t-${i}`, value: initialValue })),
            min,
            max
        };
    });
};


export function useSensorData() {
    const [sensors, setSensors] = useState<SensorData[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { toast } = useToast();

    const updateSensorData = useCallback(() => {
        setSensors(prevSensors => {
            return prevSensors.map(sensor => {
                const { min, max } = SENSOR_THRESHOLDS[sensor.type];
                const change = (Math.random() - 0.5) * (max - min) * 0.1;
                let newValue = sensor.value + change;
                if (newValue > max) newValue = max;
                if (newValue < min) newValue = min;
                
                const newRiskLevel = getRiskLevel(sensor.type, newValue);

                if (newRiskLevel === "DANGER" && sensor.riskLevel !== "DANGER") {
                    toast({
                        variant: "destructive",
                        title: "High-Risk Alert!",
                        description: `${sensor.type} levels are dangerously high: ${newValue.toFixed(2)} ${sensor.unit}`,
                    });
                }

                const newHistory = [...sensor.history.slice(1), { time: new Date().toISOString(), value: newValue }];

                return {
                    ...sensor,
                    value: newValue,
                    riskLevel: newRiskLevel,
                    history: newHistory,
                };
            });
        });
    }, [toast]);
    
    useEffect(() => {
        setSensors(generateInitialSensors());
        setIsInitialized(true);
        
        const interval = setInterval(updateSensorData, 2000);
        return () => clearInterval(interval);
    }, [updateSensorData]);
    

    return { sensors, isLoading: !isInitialized };
}
