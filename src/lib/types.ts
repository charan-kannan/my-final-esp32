import type { LucideIcon } from "lucide-react";

export type RiskLevel = "SAFE" | "CAUTION" | "DANGER";

export type SensorType = "EM Radiation" | "Gas" | "Air Quality" | "Temperature" | "Humidity" | "Noise" | "Light";

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
