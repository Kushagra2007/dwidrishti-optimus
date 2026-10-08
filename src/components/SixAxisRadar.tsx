"use client";

import React from "react";

export interface RadarDataPoint {
  axis: string;
  label: string;
  value: number; // 0 to 100
  uncertainty: number; // 0.0 to 1.0 (high uncertainty hatched)
}

interface SixAxisRadarProps {
  data: RadarDataPoint[];
  color?: string;
  size?: number;
}

export function SixAxisRadar({ data, color = "#2F5BFF", size = 300 }: SixAxisRadarProps) {
  const center = size / 2;
  const radius = size * 0.38;

  // 6 points on a circle: -90 degrees is top
  const getCoordinates = (index: number, val: number) => {
    const angle = (-90 + index * 60) * (Math.PI / 180);
    const r = (val / 100) * radius;
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  };

  const polygonPoints = data
    .map((d, i) => {
      const [x, y] = getCoordinates(i, d.value);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label="Six-axis framing radar chart"
      >
        <defs>
          <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2" height="4" transform="translate(0,0)" fill={color} opacity="0.3" />
          </pattern>
        </defs>

        {/* Concentric Grid Polygons: 33%, 66%, 100% */}
        {[33, 66, 100].map((level) => (
          <polygon
            key={level}
            points={data
              .map((_, i) => {
                const [x, y] = getCoordinates(i, level);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(" ")}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}

        {/* Radial Axis Lines and Labels */}
        {data.map((d, i) => {
          const [xOuter, yOuter] = getCoordinates(i, 100);
          const [xLabel, yLabel] = getCoordinates(i, 122);
          return (
            <g key={d.axis}>
              <line x1={center} y1={center} x2={xOuter} y2={yOuter} stroke="var(--line)" strokeWidth="1" />
              <text
                x={xLabel}
                y={yLabel}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-bold fill-fg font-ui"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill={color}
          fillOpacity="0.18"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vertex Dots */}
        {data.map((d, i) => {
          const [x, y] = getCoordinates(i, d.value);
          return (
            <circle
              key={d.axis}
              cx={x}
              cy={y}
              r={d.uncertainty > 0.4 ? "4.5" : "3.5"}
              fill={d.uncertainty > 0.4 ? "var(--volt)" : color}
              stroke="var(--fg)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
