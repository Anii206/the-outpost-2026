import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from 'recharts';

interface MonthlyData {
  month: string;
  count: number;
  volume: number;
}

interface DashboardMonthlyChartProps {
  data: MonthlyData[];
}

export const DashboardMonthlyChart: React.FC<DashboardMonthlyChartProps> = ({ data }) => {
  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 10, left: -22, bottom: 0 }}>
          <XAxis
            dataKey="month"
            stroke="var(--text-muted)"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'var(--border)', opacity: 0.25 }}
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              borderRadius: '2px',
              fontSize: '11px',
              boxShadow: '3px 3px 0px var(--border-strong)',
            }}
          />
          <Bar dataKey="count" fill="var(--primary)" radius={[2, 2, 0, 0]}>
            <LabelList dataKey="count" position="top" fill="var(--text)" fontSize={10} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardMonthlyChart;
