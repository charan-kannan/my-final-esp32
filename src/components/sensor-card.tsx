'use client';

import type { SensorData, RiskLevel } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { sensorIcons } from '@/lib/sensor-icons';
import { Skeleton } from '@/components/ui/skeleton';

const riskLevelColors: Record<RiskLevel, string> = {
  SAFE: 'text-[hsl(var(--chart-2))] drop-shadow-[0_0_3px_hsl(var(--chart-2))]',
  CAUTION: 'text-[hsl(var(--chart-4))] drop-shadow-[0_0_3px_hsl(var(--chart-4))]',
  DANGER: 'text-destructive drop-shadow-[0_0_3px_hsl(var(--destructive))]',
};

const chartColors: Record<RiskLevel, string> = {
    SAFE: "var(--chart-2)",
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
    <Card className="flex flex-col border-border/20 bg-background/30 backdrop-blur-lg transition-all hover:border-border/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-primary/80">
          <Icon className="h-4 w-4" />
          {sensor.type}
        </CardTitle>
        <span className={cn('text-xs font-bold', riskColor)}>{sensor.riskLevel}</span>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]">
            {sensor.value.toFixed(1)}
            </span>
            <span className="text-sm font-normal text-primary/70">{sensor.unit}</span>
        </div>
        <div className="h-[80px] w-full pt-4">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={sensor.history}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
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
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel />}
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
        <Card className="flex flex-col border-primary/20 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="mt-4 h-[80px] w-full" />
            </CardContent>
        </Card>
    )
}
