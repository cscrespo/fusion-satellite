import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BodyCompositionChart = ({ data }) => {
    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Composição Corporal</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Massa Magra
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Massa Gorda
                    </div>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorLean" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
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
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg">
                                            <p className="text-sm font-medium mb-2">{new Date(label).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
                                            <div className="space-y-1">
                                                <p className="text-sm text-emerald-600 font-medium flex justify-between gap-4">
                                                    <span>Massa Magra:</span>
                                                    <span className="font-bold">{payload[0].value} kg</span>
                                                </p>
                                                <p className="text-sm text-amber-600 font-medium flex justify-between gap-4">
                                                    <span>Massa Gorda:</span>
                                                    <span className="font-bold">{payload[1].value} kg</span>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="leanMass"
                            stackId="1"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#colorLean)"
                            name="Massa Magra (kg)"
                            fillOpacity={1}
                        />
                        <Area
                            type="monotone"
                            dataKey="fatMass"
                            stackId="1"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill="url(#colorFat)"
                            name="Massa Gorda (kg)"
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BodyCompositionChart;
