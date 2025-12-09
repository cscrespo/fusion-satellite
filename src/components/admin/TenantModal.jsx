import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, Mail, Check, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TenantModal = ({ isOpen, onClose, onSave, tenant = null }) => {
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        plan_id: '',
        email: '',
        status: 'active',
        password: '' // New password field
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name,
                slug: tenant.slug,
                plan_id: tenant.plan_id || '',
                email: tenant.email || '',
                status: tenant.status,
                password: '' // Don't show existing password
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                plan_id: plans.length > 0 ? plans[0].id : '',
                email: '',
                status: 'active',
                password: ''
            });
        }
    }, [tenant, isOpen, plans]);

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('saas_plans')
                .select('id, name, price')
                .eq('is_active', true)
                .order('price');

            if (error) throw error;
            setPlans(data);

            if (!tenant && data.length > 0) {
                setFormData(prev => ({ ...prev, plan_id: data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;

            // 1. Update/Create Organization
            if (tenant) {
                const { data, error } = await supabase
                    .from('organizations')
                    .update({
                        name: formData.name,
                        slug: formData.slug,
                        email: formData.email,
                        status: formData.status,
                        plan_id: formData.plan_id
                    })
                    .eq('id', tenant.id)
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            } else {
                const { data, error } = await supabase
                    .from('organizations')
                    .insert([{
                        name: formData.name,
                        slug: formData.slug,
                        email: formData.email,
                        status: formData.status,
                        plan_id: formData.plan_id
                    }])
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            }

            // 2. Update Password if provided (Only for existing tenants for now, or if email exists)
            if (formData.password) {
                if (formData.email) {
                    const { error: pwdError } = await supabase.rpc('admin_update_password', {
                        target_email: formData.email,
                        new_password: formData.password
                    });

                    if (pwdError) {
                        console.error('Password update error:', pwdError);
                        alert(`Empresa salva, mas erro ao atualizar senha: ${pwdError.message}`);
                    }
                } else {
                    alert('Empresa salva, mas senha não atualizada pois não há email definido.');
                }
            }

            onSave(result);
            onClose();
        } catch (error) {
            console.error('Error saving tenant:', error);
            alert('Erro ao salvar empresa: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        {tenant ? 'Editar Empresa' : 'Nova Empresa'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                placeholder="Ex: Clínica Saúde"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                pattern="[a-z0-9-]+"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                placeholder="ex: clinica-saude"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email do Admin</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                placeholder="admin@clinica.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {tenant ? 'Nova Senha (Opcional)' : 'Senha do Admin'}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                placeholder={tenant ? "Deixe em branco para manter" : "Senha inicial"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {tenant && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Isso alterará a senha de login do usuário admin desta empresa.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plano</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                value={formData.plan_id}
                                onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                            >
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name} (R$ {plan.price})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">Ativo</option>
                                <option value="suspended">Inativo (Suspenso)</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenantModal;
