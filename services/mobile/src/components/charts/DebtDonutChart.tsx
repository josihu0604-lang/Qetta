/**
 * Debt Donut Chart Component
 * 
 * Visualizes debt breakdown in a donut chart format
 * Uses pure CSS and SVG for zero dependencies
 */

'use client';

import { Text } from '@hephaitos/ui';
import { useState } from 'react';

interface DebtBreakdown {
  type: string;
  amount: number;
  percentage: number;
  color: string;
}

interface DebtDonutChartProps {
  data: DebtBreakdown[];
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  centerValue?: string;
}

export function DebtDonutChart({
  data,
  size = 200,
  strokeWidth = 30,
  centerText = '총 채무',
  centerValue,
}: DebtDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercentage = 0;

  return (
    <div className="flex flex-col items-center">
      {/* SVG Donut Chart */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label={`채무 분포 차트: ${data.map(d => `${d.type} ${d.percentage}%`).join(', ')}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Data segments */}
        {data.map((item, index) => {
          const segmentPercentage = item.percentage;
          const offset = circumference - (cumulativePercentage / 100) * circumference;
          const dashArray = `${(segmentPercentage / 100) * circumference} ${circumference}`;
          
          cumulativePercentage += segmentPercentage;

          return (
            <circle
              key={item.type}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={hoveredIndex === index ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${center} ${center})`}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
              }}
            />
          );
        })}

        {/* Center text */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="fill-gray-600 dark:fill-gray-400 text-xs font-medium"
        >
          {centerText}
        </text>
        {centerValue && (
          <text
            x={center}
            y={center + 15}
            textAnchor="middle"
            className="fill-gray-900 dark:fill-white text-lg font-bold"
          >
            {centerValue}
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-6 w-full space-y-2">
        {data.map((item, index) => (
          <div
            key={item.type}
            className="flex items-center justify-between rounded-lg p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-900"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Text className="font-medium">{item.type}</Text>
            </div>
            <div className="text-right">
              <Text className="font-semibold">
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  minimumFractionDigits: 0,
                }).format(item.amount)}
              </Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                {item.percentage.toFixed(1)}%
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
