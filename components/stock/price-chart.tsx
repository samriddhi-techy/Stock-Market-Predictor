"use client";

import { memo, useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { TIMEFRAMES, TimeframeLabel } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils/format';
import { SkeletonChart } from '@/components/ui/skeleton-chart';

// ─── Data generation ────────────────────────────────────────────────────────

function generateHistoricalData(basePrice: number, days: number) {
  const data = [];
  let price = basePrice * (0.85 + Math.random() * 0.1); // start slightly lower
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * 0.04 * price;
    price = Math.max(price + change, basePrice * 0.5);

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50_000_000) + 10_000_000,
      prediction:
        i < 7
          ? parseFloat((price * (1 + (Math.random() - 0.35) * 0.08)).toFixed(2))
          : null,
    });
  }
  return data;
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">
        {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 dark:text-slate-400">{entry.name}</span>
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {entry.value != null ? formatCurrency(entry.value) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface PriceChartProps {
  basePrice: number;
  symbol: string;
  data?: any[];
  onTimeframeChange?: (timeframe: TimeframeLabel) => void;
  isLoading?: boolean;
  activeTimeframe?: TimeframeLabel;
  className?: string;
}

export const PriceChart = memo(function PriceChart({
  basePrice,
  symbol,
  data: externalData,
  onTimeframeChange,
  isLoading: externalIsLoading,
  activeTimeframe: externalActiveTimeframe,
  className,
}: PriceChartProps) {
  const [internalTimeframe, setInternalTimeframe] = useState<TimeframeLabel>('1M');
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  const activeTimeframe = externalActiveTimeframe || internalTimeframe;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

  const selectedDays = useMemo(
    () => TIMEFRAMES.find((t) => t.label === activeTimeframe)?.days ?? 30,
    [activeTimeframe]
  );

  const generatedData = useMemo(
    () => generateHistoricalData(basePrice, selectedDays),
    [basePrice, selectedDays]
  );

  const data = externalData || generatedData;
  const dataCount = externalData ? externalData.length : selectedDays;

  const handleTimeframeChange = (label: TimeframeLabel) => {
    if (onTimeframeChange) {
      onTimeframeChange(label);
    } else {
      setInternalIsLoading(true);
      setInternalTimeframe(label);
      setTimeout(() => setInternalIsLoading(false), 300);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Time range selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {symbol} Price History
        </span>
        <div
          role="group"
          aria-label="Chart time range"
          className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg"
        >
          {TIMEFRAMES.map(({ label }) => (
            <button
              key={label}
              onClick={() => handleTimeframeChange(label)}
              aria-pressed={activeTimeframe === label}
              aria-label={`Show ${label} chart`}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                activeTimeframe === label
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <SkeletonChart />
      ) : (
        <div
          className="h-80 w-full"
          role="img"
          aria-label={`Price chart for ${symbol} over ${activeTimeframe}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-price-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`grad-pred-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  if (dataCount <= 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
                  if (dataCount <= 90) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return d.toLocaleDateString('en-US', { month: 'short' });
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v.toFixed(0)}`}
                width={56}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconSize={8}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="price"
                name="Actual Price"
                stroke="#3b82f6"
                strokeWidth={2}
                fill={`url(#grad-price-${symbol})`}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="prediction"
                name="AI Prediction"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 3"
                fill={`url(#grad-pred-${symbol})`}
                dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#10b981', strokeWidth: 0 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
