import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Fish', value: 45, color: 'hsl(199 89% 48%)' },
  { name: 'Crustaceans', value: 25, color: 'hsl(187 85% 53%)' },
  { name: 'Mollusks', value: 20, color: 'hsl(166 76% 60%)' },
  { name: 'Other', value: 10, color: 'hsl(142 71% 45%)' },
];

const SpeciesDiversityChart = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(217 33% 17%)',
              border: '1px solid hsl(217 33% 23%)',
              borderRadius: '8px',
              color: 'hsl(213 31% 91%)'
            }}
          />
          <Legend 
            wrapperStyle={{ 
              color: 'hsl(213 31% 91%)',
              fontSize: '14px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeciesDiversityChart;
