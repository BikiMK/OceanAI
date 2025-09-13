import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', temperature: 16.2 },
  { month: 'Feb', temperature: 16.8 },
  { month: 'Mar', temperature: 17.5 },
  { month: 'Apr', temperature: 18.1 },
  { month: 'May', temperature: 18.7 },
  { month: 'Jun', temperature: 18.4 },
];

const OceanTempChart = () => {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 23%)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(217 33% 23%)' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(217 33% 23%)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(217 33% 17%)',
              border: '1px solid hsl(217 33% 23%)',
              borderRadius: '8px',
              color: 'hsl(213 31% 91%)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="hsl(199 89% 48%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(199 89% 48%)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OceanTempChart;
