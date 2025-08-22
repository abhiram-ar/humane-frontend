import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  data?: { month: string; count: number }[];
};
export const NewSignupsChart: React.FC<Props> = ({ data }) => {
  return (
    <Card className="border-0 bg-transparent p-0 shadow-none">
      <CardHeader className="p-0">
        <CardDescription>Showing total signups for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer className="h-30 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} className="opacity-25" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="count"
              type="linear"
              fill="var(--color-pop-green)"
              fillOpacity={0.5}
              stroke="white"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
