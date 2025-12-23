'use client';

import { useSensorData } from '@/hooks/use-sensor-data';
import { SensorCard, SensorCardSkeleton } from '@/components/sensor-card';
import { SENSOR_TYPES } from '@/lib/constants';

export function Dashboard() {
  const { sensors, isLoading } = useSensorData();

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {isLoading
        ? SENSOR_TYPES.map((_, index) => <SensorCardSkeleton key={index} />)
        : sensors.map(sensor => <SensorCard key={sensor.id} sensor={sensor} />)}
    </div>
  );
}
