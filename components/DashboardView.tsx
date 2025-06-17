
import React from 'react';
import { HealthLog } from '../types';
import { EyeStrainSeverity, Mood } from '../constants';
import { Card } from './common/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  healthLogs: HealthLog[];
}

interface ChartDataPoint {
  date: string; // Short date format for XAxis
  hydration?: number;
  sleep?: number;
  mood?: Mood;
  eyeStrain?: EyeStrainSeverity;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ healthLogs }) => {
  const last7DaysData: ChartDataPoint[] = React.useMemo(() => {
    const today = new Date();
    const data: ChartDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const logForDay = healthLogs.find(log => log.date === dateString);
      
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hydration: logForDay?.hydration,
        sleep: logForDay?.sleep,
        mood: logForDay?.mood,
        eyeStrain: logForDay?.eyeStrain,
      });
    }
    return data;
  }, [healthLogs]);

  if (healthLogs.length === 0) {
    return (
      <Card title="7-Day Dashboard">
        <p className="text-slate-400 text-center py-8">No health data logged yet. Start logging to see your trends!</p>
      </Card>
    );
  }
  
  const moodToNumeric = (mood: Mood | undefined) => {
    if (!mood) return undefined;
    const order = [Mood.AWFUL, Mood.BAD, Mood.OKAY, Mood.GOOD, Mood.GREAT];
    return order.indexOf(mood) + 1; // 1 to 5
  };

  const eyeStrainToNumeric = (strain: EyeStrainSeverity | undefined) => {
    if (!strain) return undefined;
    const order = [EyeStrainSeverity.NONE, EyeStrainSeverity.MILD, EyeStrainSeverity.MODERATE, EyeStrainSeverity.SEVERE];
    return order.indexOf(strain); // 0 to 3
  };
  
  const moodData = last7DaysData.map(d => ({ ...d, moodValue: moodToNumeric(d.mood) }));
  const eyeStrainData = last7DaysData.map(d => ({ ...d, eyeStrainValue: eyeStrainToNumeric(d.eyeStrain) }));

  const chartMargin = { top: 5, right: 20, left: -20, bottom: 5 };
  const tickFill = "#94a3b8"; // slate-400

  return (
    <Card title="7-Day Dashboard" className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-teal-300 mb-3">Hydration (glasses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7DaysData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke={tickFill} />
              <YAxis stroke={tickFill} domain={[0, 'dataMax + 2']} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.375rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#cbd5e1' }}/>
              <Legend />
              <Line type="monotone" dataKey="hydration" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-medium text-teal-300 mb-3">Sleep (hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7DaysData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke={tickFill} />
              <YAxis stroke={tickFill} domain={[0, 'dataMax + 1']} allowDecimals={false}/>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.375rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#cbd5e1' }}/>
              <Legend />
              <Line type="monotone" dataKey="sleep" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-medium text-teal-300 mb-3">Mood Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke={tickFill} />
              <YAxis 
                stroke={tickFill} 
                domain={[0, 5]} 
                ticks={[1,2,3,4,5]} 
                tickFormatter={(value) => [Mood.AWFUL, Mood.BAD, Mood.OKAY, Mood.GOOD, Mood.GREAT][value-1]?.split(' ')[1] || ''} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.375rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#cbd5e1' }}
                formatter={(value: number) => [Mood.AWFUL, Mood.BAD, Mood.OKAY, Mood.GOOD, Mood.GREAT][value-1] || 'N/A'}
              />
              <Legend />
              <Bar dataKey="moodValue" name="Mood" fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-teal-300 mb-3">Eye Strain Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
             <BarChart data={eyeStrainData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke={tickFill} />
              <YAxis 
                stroke={tickFill} 
                domain={[0, 3]} 
                ticks={[0,1,2,3]}
                tickFormatter={(value) => [EyeStrainSeverity.NONE, EyeStrainSeverity.MILD, EyeStrainSeverity.MODERATE, EyeStrainSeverity.SEVERE][value] || ''} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.375rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#cbd5e1' }}
                formatter={(value: number) => [EyeStrainSeverity.NONE, EyeStrainSeverity.MILD, EyeStrainSeverity.MODERATE, EyeStrainSeverity.SEVERE][value] || 'N/A'}
              />
              <Legend />
              <Bar dataKey="eyeStrainValue" name="Eye Strain" fill="#f472b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
