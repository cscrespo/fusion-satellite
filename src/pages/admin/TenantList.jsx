import React, { useState, useEffect } from 'react';
import { Building2, Search, Plus, MoreVertical, Shield, Globe, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TenantModal from '../../components/admin/TenantModal';

const TenantList = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTenants(data);
        } catch (error) {
            console.error('Error fetching tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = (savedTenant) => {
        if (selectedTenant) {
            setTenants(tenants.map(t => t.id === savedTenant.id ? savedTenant : t));
        } else {
            setTenants([savedTenant, ...tenants]);
        }
    };

    const handleEdit = (tenant) => {
        setSelectedTenant(tenant);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedTenant(null);
        setIsModalOpen(true);
    };

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'suspended': return 'bg-amber-100 text-amber-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
                    <p className="text-slate-500">Gerencie todas as clínicas cadastradas</p>
                </div>
                <button
                    onClick={handleNew}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nova Empresa
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, slug ou email..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresa</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plano</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Criado em</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        Nenhuma empresa encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                    {tenant.logo_auth_url ? (
                                                        <img src={tenant.logo_auth_url} alt="" className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Building2 className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{tenant.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{tenant.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                                                {tenant.plan_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)} capitalize`}>
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(tenant.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(tenant)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TenantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                tenant={selectedTenant}
            />
        </div>
    );
};

export default TenantList;
