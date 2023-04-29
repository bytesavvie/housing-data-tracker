// React
import React, { type FC } from "react";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

// Custom Types
import { type ChangeOverTimeChartDataPoint } from "../../customTypes";

interface IProps {
  containerClasses?: string;
  chartData: ChangeOverTimeChartDataPoint[];
  dataKey: keyof ChangeOverTimeChartDataPoint;
  barName: string;
  barColor: string;
}

const PercentBarChart: FC<IProps> = ({
  containerClasses,
  chartData,
  dataKey,
  barName,
  barColor,
}) => {
  return (
    <div className={containerClasses ? containerClasses : ""}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            style={{ fill: "#f3f4f6" }}
            minTickGap={10}
            tickSize={10}
          />
          <YAxis width={50} unit="%" style={{ fill: "#f3f4f6" }} />
          <Tooltip
            formatter={(value: number | string) => {
              return `${value}%`;
            }}
            contentStyle={{
              background: "rgba(0, 0, 0, 0.9)",
              color: "white",
              borderRadius: "5px",
              border: "1px solid black",
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill={barColor} name={barName} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PercentBarChart;
