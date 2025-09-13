import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { region: 'Atlantic', stocks: 450 },
  { region: 'Pacific', stocks: 680 },
  { region: 'Indian', stocks: 320 },
  { region: 'Arctic', stocks: 140 },
];

const FishStocksChart = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 23%)" />
          <XAxis 
            dataKey="region" 
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
          <Bar dataKey="stocks" fill="hsl(199 89% 48%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FishStocksChart;
