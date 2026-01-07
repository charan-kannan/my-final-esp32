import { Thermometer, Droplets, Leaf, Flame, Volume2, Sun, RadioTower } from 'lucide-react';
import type { SensorType } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

export const sensorIcons: Record<SensorType, LucideIcon> = {
  "Temperature": Thermometer,
  "Humidity": Droplets,
  "Air Quality": Leaf,
  "Gas/Smoke": Flame,
  "Noise": Volume2,
  "Light": Sun,
  "EM Radiation": RadioTower,
};
