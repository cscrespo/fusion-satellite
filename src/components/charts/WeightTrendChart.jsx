import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const WeightTrendChart = ({ data, goalWeight }) => {
    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Evolução de Peso</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Peso
                    <span className="w-2 h-2 rounded-full bg-green-500 ml-2"></span>
                    Meta
                </div>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            dy={10}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            domain={['dataMin - 2', 'dataMax + 2']}
                            tickFormatter={(value) => `${value}kg`}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg">
                                            <p className="text-sm font-medium mb-1">{new Date(label).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
                                            <p className="text-lg font-bold text-primary">
                                                {payload[0].value} kg
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Meta: {goalWeight} kg
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <ReferenceLine y={goalWeight} stroke="#10b981" strokeDasharray="5 5" strokeOpacity={0.7} />
                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="#3b82f6"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorWeight)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeightTrendChart;
