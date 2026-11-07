import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              borderRadius: '2px',
              fontSize: '11px',
            }}
          />
          <Bar dataKey="count" fill="var(--primary)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardMonthlyChart;
