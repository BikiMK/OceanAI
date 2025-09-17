import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const defaultData: Array<{name: string, value: number, color: string, count: string}> = [];

interface SpeciesDiversityChartProps {
  data?: Array<{name: string, value: number, color: string, count: string}>;
}

const SpeciesDiversityChart = ({ data = defaultData }: SpeciesDiversityChartProps) => {
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
            formatter={(value, name, props) => [
              `${value}% (${props.payload?.count || 'N/A'} fish)`, name
            ]}
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
