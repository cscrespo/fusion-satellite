import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const MeasurementsRadar = ({ data }) => {
    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold mb-6">Comparativo de Medidas (cm)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg">
                                            <p className="text-sm font-bold mb-2">{label}</p>
                                            <div className="space-y-1">
                                                <p className="text-sm text-blue-500 font-medium flex justify-between gap-4">
                                                    <span>Atual:</span>
                                                    <span className="font-bold">{payload[1].value} cm</span>
                                                </p>
                                                <p className="text-sm text-gray-400 font-medium flex justify-between gap-4">
                                                    <span>Inicial:</span>
                                                    <span className="font-bold">{payload[0].value} cm</span>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Radar
                            name="Inicial"
                            dataKey="A"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            fill="#94a3b8"
                            fillOpacity={0.2}
                        />
                        <Radar
                            name="Atual"
                            dataKey="B"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.5}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MeasurementsRadar;
