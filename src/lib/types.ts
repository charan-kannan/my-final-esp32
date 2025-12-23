import type { LucideIcon } from "lucide-react";

export type RiskLevel = "SAFE" | "CAUTION" | "DANGER";

export type SensorType = "Temperature" | "Humidity" | "Air Quality" | "Gas" | "Noise" | "Light" | "EM Radiation";

export type SensorData = {
  id: number;
  type: SensorType;
  value: number;
  unit: string;
  riskLevel: RiskLevel;
  history: { time: string; value: number }[];
  min: number;
  max: number;
};
