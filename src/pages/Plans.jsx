import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, Users, DollarSign, Package, Loader2 } from 'lucide-react';
import PlanCard from '../components/plans/PlanCard';
import PlanModal from '../components/plans/PlanModal';
import DeletePlanModal from '../components/plans/DeletePlanModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { profile } = useAuth(); // Access organization_id
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [deletingPlan, setDeletingPlan] = useState(null);

    // Fetch Plans
    const fetchPlans = async () => {
        if (!profile?.organization_id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('treatment_plans')
                .select('*')
                .eq('organization_id', profile.organization_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB fields to Frontend props
            const mappedPlans = data.map(p => ({
                ...p,
                duration: p.duration_months,
                billingCycle: p.billing_cycle,
                maxPatients: p.max_patients,
                currentPatients: p.current_patients,
                createdAt: p.created_at,
                updatedAt: p.updated_at
            }));

            setPlans(mappedPlans);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [profile?.organization_id]);

    // Stats
    const totalPlans = plans.length;
    const activePlans = plans.filter(p => p.status === 'active').length;
    const totalPatients = plans.reduce((sum, p) => sum + p.currentPatients, 0);
    const totalRevenue = plans
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + (p.price * p.currentPatients), 0);

    // Filtros
    const filteredPlans = plans.filter(plan => {
        const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || plan.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Handlers
    const handleCreatePlan = async (planData) => {
        try {
            // Map Frontend -> DB
            const dbPayload = {
                organization_id: profile.organization_id,
                name: planData.name,
                description: planData.description,
                category: planData.category,
                price: parseFloat(planData.price),
                duration_months: parseInt(planData.duration),
                billing_cycle: planData.billingCycle,
                status: planData.status || 'active',
                icon: planData.icon || '📋', // Default icon
                max_patients: parseInt(planData.maxPatients),
                features: planData.features,
                contraindications: planData.contraindications,
                requirements: planData.requirements
            };

            const { data, error } = await supabase
                .from('treatment_plans')
                .insert(dbPayload)
                .select()
                .single();

            if (error) throw error;

            fetchPlans(); // Refresh list
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating plan:', error);
            alert('Erro ao criar plano: ' + error.message);
        }
    };

    const handleUpdatePlan = async (planData) => {
        try {
            const dbPayload = {
                name: planData.name,
                description: planData.description,
                category: planData.category,
                price: parseFloat(planData.price),
                duration_months: parseInt(planData.duration),
                billing_cycle: planData.billingCycle,
                status: planData.status,
                icon: planData.icon,
                max_patients: parseInt(planData.maxPatients),
                features: planData.features,
                contraindications: planData.contraindications,
                requirements: planData.requirements,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('treatment_plans')
                .update(dbPayload)
                .eq('id', editingPlan.id);

            if (error) throw error;

            fetchPlans();
            setEditingPlan(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating plan:', error);
            alert('Erro ao atualizar plano: ' + error.message);
        }
    };

    const handleDeletePlan = async (planId) => {
        try {
            const { error } = await supabase
                .from('treatment_plans')
                .delete()
                .eq('id', planId);

            if (error) throw error;

            setPlans(plans.filter(p => p.id !== planId));
            setDeletingPlan(null);
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Erro ao excluir plano: ' + error.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Planos de Tratamento</h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seus protocolos e assinaturas
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Novo Plano
                </button>
            </div >

            {/* Stats */}
            < div className="grid grid-cols-1 md:grid-cols-4 gap-4" >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100 text-sm font-medium">Total de Planos</span>
                        <Package className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{totalPlans}</p>
                    <p className="text-blue-100 text-sm mt-1">{activePlans} ativos</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-100 text-sm font-medium">Pacientes Ativos</span>
                        <Users className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{totalPatients}</p>
                    <p className="text-emerald-100 text-sm mt-1">Em todos os planos</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-100 text-sm font-medium">Receita Mensal</span>
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">
                        R$ {totalRevenue.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-purple-100 text-sm mt-1">Estimada</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-100 text-sm font-medium">Ticket Médio</span>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">
                        R$ {totalPatients > 0 ? Math.round(totalRevenue / totalPatients).toLocaleString('pt-BR') : '0'}
                    </p>
                    <p className="text-orange-100 text-sm mt-1">Por paciente</p>
                </div>
            </div >

            {/* Filters */}
            < div className="bg-card p-4 rounded-2xl border border-border shadow-sm" >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar planos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[150px]"
                        >
                            <option value="all">Todas Categorias</option>
                            <option value="medication">💊 Medicamentos</option>
                            <option value="nutrition">🥗 Nutrição</option>
                            <option value="fitness">🏃 Fitness</option>
                            <option value="wellness">🧘 Bem-estar</option>
                            <option value="other">📋 Outro</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[120px]"
                    >
                        <option value="all">Todos Status</option>
                        <option value="active">✓ Ativos</option>
                        <option value="inactive">○ Inativos</option>
                    </select>
                </div>
            </div >

            {/* Plans Grid */}
            < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
                {
                    filteredPlans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={(plan) => {
                                setEditingPlan(plan);
                                setIsModalOpen(true);
                            }}
                            onDelete={(plan) => setDeletingPlan(plan)}
                        />
                    ))
                }
            </div >

            {
                filteredPlans.length === 0 && (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground">Nenhum plano encontrado.</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCategoryFilter('all');
                                setStatusFilter('all');
                            }}
                            className="mt-4 text-primary hover:underline text-sm"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )
            }

            {/* Modals */}
            <PlanModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPlan(null);
                }}
                onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
                initialData={editingPlan}
            />

            <DeletePlanModal
                isOpen={!!deletingPlan}
                plan={deletingPlan}
                onClose={() => setDeletingPlan(null)}
                onConfirm={handleDeletePlan}
            />
        </div >
    );
};

export default Plans;
