import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import PlanCard from '../components/plans/PlanCard';
import PlanModal from '../components/plans/PlanModal';
import DeletePlanModal from '../components/plans/DeletePlanModal';

const Plans = () => {
    const [plans, setPlans] = useState([
        {
            id: 1,
            name: 'Protocolo Mounjaro',
            description: 'Tratamento completo com Mounjaro (Tirzepatida) para controle de peso e diabetes tipo 2',
            category: 'medication',
            price: 890,
            duration: 3,
            billingCycle: 'monthly',
            status: 'active',
            features: [
                'Consultas mensais',
                'Medicação incluída',
                'Acompanhamento nutricional',
                'Suporte 24/7',
                'Exames laboratoriais'
            ],
            contraindications: [
                'Gravidez',
                'Histórico de pancreatite',
                'Diabetes tipo 1',
                'Insuficiência renal grave'
            ],
            requirements: [
                'IMC > 27',
                'Exames laboratoriais recentes',
                'Avaliação médica completa'
            ],
            icon: '💊',
            maxPatients: 50,
            currentPatients: 32,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'Plano Nutricional Premium',
            description: 'Acompanhamento nutricional completo com dieta personalizada e suporte contínuo',
            category: 'nutrition',
            price: 450,
            duration: 6,
            billingCycle: 'monthly',
            status: 'active',
            features: [
                'Consultas quinzenais',
                'Plano alimentar personalizado',
                'Receitas exclusivas',
                'Grupo de suporte',
                'App de acompanhamento'
            ],
            contraindications: [
                'Transtornos alimentares graves'
            ],
            requirements: [
                'Avaliação nutricional inicial',
                'Comprometimento com o plano'
            ],
            icon: '🥗',
            maxPatients: 100,
            currentPatients: 67,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10'
        },
        {
            id: 3,
            name: 'Programa Emagrecimento 90 Dias',
            description: 'Programa intensivo de emagrecimento com acompanhamento multidisciplinar',
            category: 'fitness',
            price: 350,
            duration: 3,
            billingCycle: 'monthly',
            status: 'active',
            features: [
                'Treinos personalizados',
                'Nutrição esportiva',
                'Acompanhamento semanal',
                'Grupo motivacional',
                'Desafios mensais'
            ],
            contraindications: [
                'Problemas cardíacos graves',
                'Lesões não tratadas'
            ],
            requirements: [
                'Atestado médico',
                'Avaliação física inicial'
            ],
            icon: '🏃',
            maxPatients: 30,
            currentPatients: 24,
            createdAt: '2024-02-01',
            updatedAt: '2024-02-01'
        },
        {
            id: 4,
            name: 'Protocolo Tirzepatida',
            description: 'Tratamento com Tirzepatida para perda de peso e controle glicêmico',
            category: 'medication',
            price: 920,
            duration: 6,
            billingCycle: 'monthly',
            status: 'active',
            features: [
                'Medicação de última geração',
                'Monitoramento contínuo',
                'Ajustes de dosagem',
                'Suporte nutricional',
                'Acompanhamento médico semanal'
            ],
            contraindications: [
                'Gravidez e lactação',
                'Histórico de câncer medular de tireoide',
                'Pancreatite'
            ],
            requirements: [
                'IMC > 30 ou IMC > 27 com comorbidades',
                'Exames completos',
                'Consulta de triagem'
            ],
            icon: '💉',
            maxPatients: 40,
            currentPatients: 18,
            createdAt: '2024-01-20',
            updatedAt: '2024-01-20'
        },
        {
            id: 5,
            name: 'Bem-Estar Integral',
            description: 'Programa holístico de saúde mental e física com práticas integrativas',
            category: 'wellness',
            price: 280,
            duration: 12,
            billingCycle: 'monthly',
            status: 'inactive',
            features: [
                'Sessões de meditação',
                'Yoga terapêutico',
                'Orientação nutricional',
                'Coaching de saúde',
                'Workshops mensais'
            ],
            contraindications: [],
            requirements: [
                'Questionário de saúde',
                'Entrevista inicial'
            ],
            icon: '🧘',
            maxPatients: 60,
            currentPatients: 0,
            createdAt: '2023-12-01',
            updatedAt: '2024-01-05'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [deletingPlan, setDeletingPlan] = useState(null);

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

    const handleCreatePlan = (planData) => {
        const newPlan = {
            ...planData,
            id: plans.length + 1,
            currentPatients: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setPlans([...plans, newPlan]);
    };

    const handleUpdatePlan = (planData) => {
        setPlans(plans.map(p =>
            p.id === editingPlan.id
                ? { ...p, ...planData, updatedAt: new Date().toISOString() }
                : p
        ));
        setEditingPlan(null);
    };

    const handleDeletePlan = (planId) => {
        setPlans(plans.filter(p => p.id !== planId));
    };

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
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
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
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map(plan => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        onEdit={(plan) => {
                            setEditingPlan(plan);
                            setIsModalOpen(true);
                        }}
                        onDelete={(plan) => setDeletingPlan(plan)}
                    />
                ))}
            </div>

            {filteredPlans.length === 0 && (
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
            )}

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
        </div>
    );
};

export default Plans;
