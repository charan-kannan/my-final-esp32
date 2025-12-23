'use client';

import { useState } from 'react';
import { useSensorData } from '@/hooks/use-sensor-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
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

const chartColors: Record<SensorToMonitor, string> = {
    "Temperature": "var(--chart-1)",
    "Humidity": "var(--chart-4)",
    "Gas": "var(--chart-5)",
    "Air Quality": "var(--chart-2)",
  };

export function RealTimeMonitoring() {
  const { sensors, isLoading } = useSensorData();
  const [activeSensors, setActiveSensors] = useState<SensorToMonitor[]>(["Temperature", "Humidity"]);

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
      <Card className="border-border/20 bg-background/30 backdrop-blur-lg">
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
    <Card className="border-border/20 bg-background/30 backdrop-blur-lg transition-all hover:border-border/40">
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
              className="transition-all bg-transparent backdrop-blur-xl"
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
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    {monitoredSensors.map(sensor => (
                        <linearGradient key={sensor.id} id={`fill-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={`hsl(${chartColors[sensor.type as SensorToMonitor]})`} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={`hsl(${chartColors[sensor.type as SensorToMonitor]})`} stopOpacity={0.1}/>
                        </linearGradient>
                    ))}
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} unit={activeSensors.length === 1 ? sensors.find(s=>s.type === activeSensors[0])?.unit : undefined} />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.8)',
                    borderColor: 'hsl(var(--border))',
                    backdropFilter: 'blur(10px)',
                }}
                labelStyle={{color: 'hsl(var(--foreground))'}}
                />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              {monitoredSensors.map(sensor => (
                 <Area
                    key={sensor.type}
                    type="monotone"
                    dataKey={sensor.type}
                    stroke={sensorColors[sensor.type as SensorToMonitor]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, filter: `drop-shadow(0 0 8px ${sensorColors[sensor.type as SensorToMonitor]})` }}
                    hide={!activeSensors.includes(sensor.type as SensorToMonitor)}
                    name={sensor.type}
                    fill={`url(#fill-${sensor.id})`}
                    filter={`drop-shadow(0 0 8px ${sensorColors[sensor.type as SensorToMonitor]})`}
                  />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
