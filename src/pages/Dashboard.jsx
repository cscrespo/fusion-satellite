import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingDown, ClipboardList, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockPatients, weightHistoryData, recentActivities, upcomingTasks } from '../lib/mockData';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            {change && (
                <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {change}
                </div>
            )}
        </div>
        <h3 className="text-muted-foreground font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
);

const Dashboard = () => {
    const totalWeightLost = mockPatients.reduce((acc, curr) => acc + (curr.startWeight - curr.currentWeight), 0);
    const activePatients = mockPatients.filter(p => p.status === 'Active').length;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Visão Geral</h2>
                    <p className="text-muted-foreground mt-1">Bem-vindo de volta, Dr. Smith. Aqui está o que está acontecendo hoje.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Baixar Relatório
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total de Pacientes"
                    value={mockPatients.length}
                    change="+12% desde o mês passado"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Peso Total Perdido"
                    value={`${totalWeightLost} kg`}
                    change="+5% desde o mês passado"
                    icon={TrendingDown}
                    trend="up"
                />
                <StatCard
                    title="Tarefas Pendentes"
                    value={upcomingTasks.length}
                    change="-2 desde ontem"
                    icon={ClipboardList}
                    trend="down"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="text-lg font-bold mb-6">Tendência Média de Perda de Peso</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightHistoryData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="text-lg font-bold mb-6">Atividade Recente</h3>
                    <div className="space-y-6">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                                <div>
                                    <p className="font-medium text-sm">{activity.patient}</p>
                                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-lg font-bold mb-4">Próximas Tarefas</h3>
                        <div className="space-y-4">
                            {upcomingTasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                                    <div className="w-4 h-4 border-2 border-primary rounded-full" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">{task.due}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
