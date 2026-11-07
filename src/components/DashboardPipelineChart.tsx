import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';

interface PipelineData {
  name: string;
  count: number;
  fill: string;
}

interface DashboardPipelineChartProps {
  data: PipelineData[];
}

export const DashboardPipelineChart: React.FC<DashboardPipelineChartProps> = ({ data }) => {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 18, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
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
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            <LabelList dataKey="count" position="top" fill="var(--text)" fontSize={11} fontWeight={700} />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardPipelineChart;
