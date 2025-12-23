'use client';

import { useState } from 'react';
import { useSensorData } from '@/hooks/use-sensor-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { Activity } from 'lucide-react';

const SENSORS_TO_MONITOR = ["Temperature", "Humidity", "Gas", "Air Quality"] as const;
type SensorToMonitor = typeof SENSORS_TO_MONITOR[number];

const sensorColors: Record<SensorToMonitor, string> = {
  "Temperature": 'hsl(var(--chart-1))',
  "Humidity": 'hsl(var(--chart-4))',
  "Gas": 'hsl(var(--chart-5))',
  "Air Quality": 'hsl(var(--chart-2))',
};

export function RealTimeMonitoring() {
  const { sensors, isLoading } = useSensorData();
  const [activeSensors, setActiveSensors] = useState<SensorToMonitor[]>(["Temperature", "Humidity", "Gas", "Air Quality"]);

  const toggleSensor = (sensorType: SensorToMonitor) => {
    setActiveSensors(prev =>
      prev.includes(sensorType)
        ? prev.filter(s => s !== sensorType)
        : [...prev, sensorType]
    );
  };

  const monitoredSensors = sensors.filter(s => SENSORS_TO_MONITOR.includes(s.type as SensorToMonitor));

  const chartData = monitoredSensors.length > 0
    ? monitoredSensors[0].history.map((_, i) => {
        const dataPoint: { name: string, [key: string]: number | string } = { name: `${i}` };
        monitoredSensors.forEach(sensor => {
          if (sensor.history[i]) {
            dataPoint[sensor.type] = sensor.history[i].value;
          }
        });
        return dataPoint;
      })
    : [];

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <Activity />
                Real-Time Monitoring
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 mb-4">
                {SENSORS_TO_MONITOR.map(type => (
                    <Skeleton key={type} className="h-10 w-28" />
                ))}
            </div>
            <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
            <Activity />
            Real-Time Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {SENSORS_TO_MONITOR.map(type => (
            <Button
              key={type}
              variant={activeSensors.includes(type) ? 'default' : 'outline'}
              onClick={() => toggleSensor(type)}
              className={cn("transition-all", {
                'bg-primary text-primary-foreground': activeSensors.includes(type),
                'border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary': !activeSensors.includes(type),
              })}
              style={activeSensors.includes(type) ? {
                backgroundColor: sensorColors[type],
                borderColor: sensorColors[type],
                color: 'hsl(var(--primary-foreground))',
                boxShadow: `0 0 10px ${sensorColors[type]}`
              } : {
                 borderColor: sensorColors[type],
                 color: sensorColors[type],
              }}
            >
              {type}
            </Button>
          ))}
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.9)',
                    borderColor: 'hsl(var(--border))',
                }}
                labelStyle={{color: 'hsl(var(--foreground))'}}
                />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              {monitoredSensors.map(sensor => (
                <Line
                  key={sensor.type}
                  type="monotone"
                  dataKey={sensor.type}
                  stroke={sensorColors[sensor.type as SensorToMonitor]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  hide={!activeSensors.includes(sensor.type as SensorToMonitor)}
                  name={sensor.type}
                  filter={`drop-shadow(0 0 4px ${sensorColors[sensor.type as SensorToMonitor]})`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
