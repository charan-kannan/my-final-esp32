import type { SensorType } from './types';

export const SENSOR_TYPES: SensorType[] = ["EM Radiation", "Gas", "Air Quality", "Temperature", "Humidity", "Noise", "Light"];

export const SENSOR_THRESHOLDS: Record<SensorType, { caution: number; danger: number; min: number; max: number; unit: string }> = {
    "EM Radiation": { caution: 5, danger: 10, min: 0, max: 15, unit: "mG" },
    "Gas": { caution: 5, danger: 10, min: 0, max: 20, unit: "ppm" },
    "Air Quality": { caution: 100, danger: 150, min: 10, max: 300, unit: "AQI" },
    "Temperature": { caution: 28, danger: 35, min: 10, max: 40, unit: "°C" },
    "Humidity": { caution: 70, danger: 85, min: 20, max: 90, unit: "%" },
    "Noise": { caution: 85, danger: 100, min: 30, max: 120, unit: "dB" },
    "Light": { caution: 1000, danger: 2000, min: 0, max: 3000, unit: "lux" },
};
