'use client';

import type { SensorData, RiskLevel } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';
import { sensorIcons } from '@/lib/sensor-icons';
import { Skeleton } from '@/components/ui/skeleton';

const riskLevelColors: Record<RiskLevel, string> = {
  SAFE: 'text-neon-green',
  CAUTION: 'text-neon-yellow',
  DANGER: 'text-neon-red',
};

const chartColors: Record<RiskLevel, string> = {
    SAFE: "var(--chart-1)",
    CAUTION: "var(--chart-4)",
    DANGER: "var(--chart-3)",
};

const chartConfig = {
  value: {
    label: 'Value',
  },
};

export function SensorCard({ sensor }: { sensor: SensorData }) {
  const Icon = sensorIcons[sensor.type];
  const riskColor = riskLevelColors[sensor.riskLevel];
  const chartColor = chartColors[sensor.riskLevel];

  return (
    <Card className="flex flex-col border-cyber-subtle bg-cyber-gray/60 backdrop-blur-sm transition-all hover:border-neon-cyan/50 hover:bg-cyber-subtle/80 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground/80 font-mono uppercase">
          <Icon className="h-4 w-4" />
          {sensor.type}
        </CardTitle>
        <span className={cn('text-xs font-bold font-mono', riskColor, `drop-shadow-[0_0_3px_currentColor]`)}>{sensor.riskLevel}</span>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex flex-col">
            <span className="font-mono text-2xl font-bold text-glow">
            {sensor.value.toFixed(1)}
            </span>
            <span className="text-xs font-normal text-foreground/70 font-mono">{sensor.unit}</span>
        </div>
        <div className="h-[60px] w-full mt-2">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={sensor.history}
              margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id={`fill-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`hsl(${chartColor})`} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={`hsl(${chartColor})`} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="natural"
                fill={`url(#fill-${sensor.id})`}
                stroke={`hsl(${chartColor})`}
                strokeWidth={2}
                dot={false}
                filter={`drop-shadow(0 0 5px hsl(${chartColor}))`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  indicator="line" 
                  hideLabel 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.8)',
                    borderColor: 'hsl(var(--border))',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'var(--font-mono)',
                  }}
                />}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function SensorCardSkeleton() {
    return (
        <Card className="flex flex-col border-cyber-subtle bg-cyber-gray/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
                <div className='space-y-1'>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="mt-4 h-[80px] w-full" />
            </CardContent>
        </Card>
    )
}
