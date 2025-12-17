'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Пн', views: 45, apps: 12 },
  { name: 'Вт', views: 52, apps: 15 },
  { name: 'Ср', views: 38, apps: 8 },
  { name: 'Чт', views: 65, apps: 23 },
  { name: 'Пт', views: 48, apps: 18 },
  { name: 'Сб', views: 25, apps: 5 },
  { name: 'Вс', views: 30, apps: 7 },
];

export function AnalyticsChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#000000" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorViews)" 
          />
          <Area 
            type="monotone" 
            dataKey="apps" 
            stroke="#22c55e" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorApps)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <span className="text-gray-500">Просмотры:</span>
          <span className="font-medium">{payload[0].value}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-gray-500">Отклики:</span>
          <span className="font-medium">{payload[1].value}</span>
        </div>
      </div>
    );
  }
  return null;
}
