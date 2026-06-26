"use client";

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
import { generateIntraday } from "@/lib/mock-data";

export function IntradayChart({ base, seed = 1 }: { base: number; seed?: number }) {
  const data = useMemo(() => generateIntraday(base, 78, seed), [base, seed]);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 18, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="intradayFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#115e3c" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#115e3c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eef1ee" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#7c8a82"
            tickLine={false}
            axisLine={false}
            interval={Math.floor(data.length / 6)}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="#7c8a82"
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 20", "dataMax + 20"]}
            tick={{ fontSize: 11 }}
            width={56}
            tickFormatter={(v) => v.toLocaleString("en-IN")}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              boxShadow: "0 12px 30px -16px rgba(13,31,23,0.18)",
              fontSize: 12,
              padding: "8px 10px",
            }}
            formatter={(v) => [`₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Price"]}
            labelStyle={{ color: "var(--color-fg-subtle)", fontSize: 11 }}
          />
          <Area type="monotone" dataKey="price" stroke="#115e3c" strokeWidth={2} fill="url(#intradayFill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
