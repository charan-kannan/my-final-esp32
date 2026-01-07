'use client';

import { useState } from 'react';
import { useSensorData } from '@/hooks/use-sensor-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { Activity } from 'lucide-react';
import { useUser } from '@/firebase';
import { useSettings } from './settings-provider';

const SENSORS_TO_MONITOR = ["EM Radiation", "Gas", "Air Quality", "Temperature", "Humidity", "Noise", "Light"] as const;
type SensorToMonitor = typeof SENSORS_TO_MONITOR[number];

const sensorColors: Record<SensorToMonitor, string> = {
  "Temperature": 'hsl(var(--chart-1))',
  "Humidity": 'hsl(var(--chart-2))',
  "Air Quality": 'hsl(var(--chart-3))',
  "Gas": 'hsl(var(--chart-4))',
  "Noise": 'hsl(var(--chart-5))',
  "Light": 'hsl(var(--chart-6))',
  "EM Radiation": 'hsl(var(--primary))',
};

export function RealTimeMonitoring() {
  const { user } = useUser();
  const settings = useSettings();
  const { sensors, isLoading } = useSensorData(user, settings);
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
      <Card className="border-cyber-subtle bg-cyber-gray/60 backdrop-blur-sm">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow font-display uppercase tracking-wider">
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
    <Card className="border-cyber-subtle bg-cyber-gray/60 backdrop-blur-sm transition-all hover:border-neon-cyan/50 hover:bg-cyber-subtle/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-glow font-display uppercase tracking-wider">
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
              className="font-mono uppercase transition-all"
              style={activeSensors.includes(type) ? {
                backgroundColor: sensorColors[type],
                borderColor: sensorColors[type],
                color: 'hsl(var(--primary-foreground))',
                boxShadow: `0 0 10px ${sensorColors[type]}, inset 0 0 5px ${sensorColors[type]}`
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
                        <linearGradient key={sensor.id} id={`fill-chart-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={sensorColors[sensor.type as SensorToMonitor]} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={sensorColors[sensor.type as SensorToMonitor]} stopOpacity={0.05}/>
                        </linearGradient>
                    ))}
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12, fontFamily: 'var(--font-mono)'}} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12, fontFamily: 'var(--font-mono)'}} unit={activeSensors.length === 1 ? sensors.find(s=>s.type === activeSensors[0])?.unit : undefined} />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.8)',
                    borderColor: 'hsl(var(--border))',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'var(--font-mono)',
                }}
                labelStyle={{color: 'hsl(var(--foreground))'}}
                />
              <Legend 
                wrapperStyle={{fontSize: "14px", fontFamily: 'var(--font-mono)', textTransform: 'uppercase'}}
                formatter={(value, entry) => {
                  const color = sensorColors[value as SensorToMonitor];
                  return <span style={{ color }}>{value}</span>;
                }}
              />
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
                    fill={`url(#fill-chart-${sensor.id})`}
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
