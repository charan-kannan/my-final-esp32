'use client';

import { useSensorData } from '@/hooks/use-sensor-data';
import { SensorCard, SensorCardSkeleton } from '@/components/sensor-card';
import { SENSOR_TYPES } from '@/lib/constants';
import { RealTimeMonitoring } from '@/components/real-time-monitoring';

export function Dashboard() {
  const { sensors, isLoading } = useSensorData();

  const displayedSensors = ['Temperature', 'Humidity', 'Air Quality', 'Gas', 'Noise', 'Light', 'EM Radiation'];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-7">
        {isLoading
          ? displayedSensors.map(type => <SensorCardSkeleton key={type} />)
          : sensors.filter(s => displayedSensors.includes(s.type)).map(sensor => <SensorCard key={sensor.id} sensor={sensor} />)}
      </div>
      <div className="mt-8">
        <RealTimeMonitoring />
      </div>
    </>
  );
}
