import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeTenants: 0,
        totalUsers: 0,
        mrr: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // 1. Tenants Count
            const { count: totalTenants, error: tenantsError } = await supabase
                .from('organizations')
                .select('*', { count: 'exact', head: true });

            const { count: activeTenants } = await supabase
                .from('organizations')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // 2. Users Count
            const { count: totalUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // 3. MRR (Mock calculation based on plan types for now)
            // In a real scenario, we would sum up active subscriptions
            const { data: orgs } = await supabase
                .from('organizations')
                .select('plan_type');

            let mrr = 0;
            orgs?.forEach(org => {
                if (org.plan_type === 'premium') mrr += 299;
                if (org.plan_type === 'enterprise') mrr += 999;
                if (org.plan_type === 'basic') mrr += 99;
            });

            setStats({
                totalTenants: totalTenants || 0,
                activeTenants: activeTenants || 0,
                totalUsers: totalUsers || 0,
                mrr
            });

        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Geral</h1>
                <p className="text-slate-500">Visão geral da plataforma Bloom</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Empresas"
                    value={stats.totalTenants}
                    icon={Building2}
                    color="bg-blue-500"
                    subtext={`${stats.activeTenants} ativas`}
                />
                <StatCard
                    title="Usuários Totais"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="MRR Estimado"
                    value={`R$ ${stats.mrr.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    subtext="Receita recorrente mensal"
                />
                <StatCard
                    title="Alertas"
                    value="0"
                    icon={AlertCircle}
                    color="bg-amber-500"
                    subtext="Nenhum problema crítico"
                />
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Atividade Recente</h2>
                <div className="text-center py-12 text-slate-400">
                    <p>Nenhuma atividade recente registrada.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
