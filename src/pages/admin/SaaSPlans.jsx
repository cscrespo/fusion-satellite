import React, { useState, useEffect } from 'react';
import { Package, Check, X, Plus, Edit2, Trash2, Smartphone, Monitor, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SaaSPlans = () => {
    const [plans, setPlans] = useState([]);
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: plansData, error: plansError } = await supabase
                .from('saas_plans')
                .select(`
                    *,
                    saas_plan_features (
                        enabled,
                        saas_features (id, key, name, platform, category)
                    )
                `)
                .order('price_monthly');

            if (plansError) throw plansError;

            const { data: featuresData, error: featuresError } = await supabase
                .from('saas_features')
                .select('*')
                .order('platform', { ascending: false }) // Web first, then Mobile
                .order('name');

            if (featuresError) throw featuresError;

            setPlans(plansData);
            setFeatures(featuresData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeature = async (planId, featureId, currentStatus) => {
        try {
            if (currentStatus) {
                await supabase
                    .from('saas_plan_features')
                    .delete()
                    .match({ plan_id: planId, feature_id: featureId });
            } else {
                await supabase
                    .from('saas_plan_features')
                    .insert({ plan_id: planId, feature_id: featureId, enabled: true });
            }
            fetchData();
        } catch (error) {
            console.error('Error toggling feature:', error);
        }
    };

    const handleSavePlan = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('saas_plans')
                .update({
                    name: editingPlan.name,
                    description: editingPlan.description,
                    price_monthly: editingPlan.price_monthly,
                    price_yearly: editingPlan.price_yearly,
                    limits: editingPlan.limits
                })
                .eq('id', editingPlan.id);

            if (error) throw error;
            setEditingPlan(null);
            fetchData();
        } catch (error) {
            console.error('Error updating plan:', error);
            alert('Erro ao atualizar plano');
        }
    };

    const renderFeatureGroup = (plan, platformTitle, platformKey, icon) => {
        const platformFeatures = features.filter(f => f.platform === platformKey || f.platform === 'both');

        return (
            <div className="mb-6">
                <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {icon}
                    {platformTitle}
                </h4>
                <div className="space-y-2">
                    {platformFeatures.map((feature) => {
                        const isEnabled = plan.saas_plan_features.some(
                            pf => pf.saas_features.id === feature.id && pf.enabled
                        );

                        return (
                            <div key={feature.id} className="flex items-center justify-between group py-1">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleFeature(plan.id, feature.id, isEnabled)}
                                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                                            }`}
                                    >
                                        {isEnabled && <Check className="w-3 h-3" />}
                                    </button>
                                    <span className={`text-sm ${isEnabled ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {feature.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestão de Planos & Apps</h1>
                    <p className="text-slate-500">Configure os recursos do Painel Web e do App do Paciente</p>
                </div>
                {/* <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novo Plano
                </button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-[300px]">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                            {editingPlan?.id === plan.id ? (
                                <form onSubmit={handleSavePlan} className="space-y-3">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1 rounded border border-slate-300 text-sm font-bold"
                                        value={editingPlan.name}
                                        onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full px-3 py-1 rounded border border-slate-300 text-xs"
                                        rows="2"
                                        value={editingPlan.description || ''}
                                        onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase">Mensal</label>
                                            <input
                                                type="number"
                                                className="w-full px-2 py-1 rounded border border-slate-300 text-sm"
                                                value={editingPlan.price_monthly || 0}
                                                onChange={e => setEditingPlan({ ...editingPlan, price_monthly: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase">Anual</label>
                                            <input
                                                type="number"
                                                className="w-full px-2 py-1 rounded border border-slate-300 text-sm"
                                                value={editingPlan.price_yearly || 0}
                                                onChange={e => setEditingPlan({ ...editingPlan, price_yearly: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1">
                                            <Save className="w-3 h-3" /> Salvar
                                        </button>
                                        <button type="button" onClick={() => setEditingPlan(null)} className="flex-1 bg-slate-200 text-slate-600 text-xs py-1.5 rounded">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        <button onClick={() => setEditingPlan(plan)} className="text-slate-400 hover:text-indigo-600">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{plan.description}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900">R$ {plan.price_monthly}</span>
                                        <span className="text-sm text-slate-500">/mês</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        ou R$ {plan.price_yearly} /ano
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Features */}
                        <div className="p-6 flex-1">
                            {renderFeatureGroup(plan, 'Painel Web', 'web', <Monitor className="w-4 h-4" />)}
                            <div className="border-t border-slate-100 my-4" />
                            {renderFeatureGroup(plan, 'App do Paciente', 'mobile', <Smartphone className="w-4 h-4" />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SaaSPlans;
