import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsChartProps {
  rentals: Array<{ createdAt: string; price: number }>;
  payments: Array<{ createdAt: string; amount: number }>;
}

function makeBuckets(
  rentals: AnalyticsChartProps["rentals"],
  payments: AnalyticsChartProps["payments"],
) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  return days.map((date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const inRange = (createdAt: string) => {
      const value = new Date(createdAt).getTime();
      return value >= date.getTime() && value < next.getTime();
    };
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      rentals: rentals.filter((item) => inRange(item.createdAt)).length,
      spent: rentals
        .filter((item) => inRange(item.createdAt))
        .reduce((total, item) => total + item.price, 0),
      funded: payments
        .filter((item) => inRange(item.createdAt))
        .reduce((total, item) => total + item.amount, 0),
    };
  });
}

export function AnalyticsChart({ rentals, payments }: AnalyticsChartProps) {
  const data = useMemo(
    () => makeBuckets(rentals, payments),
    [rentals, payments],
  );
  const hasActivity = data.some((item) => item.rentals > 0 || item.funded > 0);

  return (
    <div className="analytics-chart" data-testid="dashboard-analytics-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 12, right: 4, left: -24, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rentalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9bc85f" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#9bc85f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fundedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78e2dc" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#78e2dc" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(126, 151, 154, .16)"
            strokeDasharray="3 5"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#89999d", fontSize: 10 }}
            dy={8}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#89999d", fontSize: 10 }}
          />
          <Tooltip
            cursor={{ stroke: "rgba(120, 170, 90, .35)" }}
            contentStyle={{
              border: "1px solid #dce7e3",
              borderRadius: 8,
              background: "rgba(250, 253, 251, .96)",
              boxShadow: "0 12px 30px rgba(35, 66, 75, .12)",
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => [
              name === "funded" ? `$${value.toFixed(2)}` : value,
              name === "funded" ? "Added funds" : "Rentals",
            ]}
          />
          <Area
            type="monotone"
            dataKey="rentals"
            stroke="#83a957"
            strokeWidth={2.5}
            fill="url(#rentalFill)"
            activeDot={{
              r: 4,
              fill: "#83a957",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
          <Area
            type="monotone"
            dataKey="funded"
            stroke="#5ab6b0"
            strokeWidth={2}
            fill="url(#fundedFill)"
            activeDot={{
              r: 4,
              fill: "#5ab6b0",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {!hasActivity && (
        <div className="analytics-empty">
          Your activity will appear here as you rent numbers and add funds.
        </div>
      )}
    </div>
  );
}
