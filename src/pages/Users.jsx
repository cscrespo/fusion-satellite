import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users as UsersIcon, Edit, Trash2, Shield, Stethoscope, UserCog, UserCheck, Loader2 } from 'lucide-react';
import UserModal from '../components/users/UserModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { profile } = useAuth(); // Access organization_id
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const roles = {
        admin: { label: 'Administrador', icon: Shield, color: 'text-purple-600 bg-purple-50 border-purple-100' },
        doctor: { label: 'Médico', icon: Stethoscope, color: 'text-blue-600 bg-blue-50 border-blue-100' },
        assistant: { label: 'Assistente', icon: UserCog, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        receptionist: { label: 'Recepcionista', icon: UserCheck, color: 'text-amber-600 bg-amber-50 border-amber-100' }
    };

    const fetchUsers = async () => {
        if (!profile?.organization_id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('organization_id', profile.organization_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedUsers = data.map(u => ({
                id: u.id,
                name: u.full_name,
                email: u.email,
                role: u.role,
                specialty: u.specialty,
                phone: u.phone,
                avatar: u.avatar_url,
                status: u.status || 'active',
                createdAt: u.created_at
            }));

            setUsers(mappedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [profile?.organization_id]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleAddUser = async (userData) => {
        try {
            // Validate password for new users
            if (!userData.password) {
                alert('Senha é obrigatória para novos usuários');
                return;
            }

            const { data, error } = await supabase.rpc('create_user_with_password', {
                email: userData.email,
                password: userData.password,
                full_name: userData.name,
                role: userData.role,
                organization_id: profile.organization_id,
                specialty: userData.specialty || null,
                phone: userData.phone || null,
                avatar_url: userData.avatar || null
            });

            if (error) throw error;

            fetchUsers();
            setIsModalOpen(false);
            alert('Usuário criado com sucesso!');
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Erro ao criar usuário: ' + error.message);
        }
    };

    const handleEditUser = async (userData) => {
        try {
            const dbPayload = {
                full_name: userData.name,
                email: userData.email,
                role: userData.role,
                specialty: userData.specialty,
                phone: userData.phone,
                status: userData.status,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('profiles')
                .update(dbPayload)
                .eq('id', editingUser.id);

            if (error) throw error;

            fetchUsers();
            setEditingUser(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Erro ao atualizar usuário: ' + error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', userId);

                if (error) throw error;

                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Erro ao excluir usuário: ' + error.message);
            }
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Usuários</h2>
                    <p className="text-muted-foreground mt-1">Gerencie os usuários com acesso ao sistema</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Novo Usuário
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-100 text-sm font-medium">Administradores</span>
                        <Shield className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100 text-sm font-medium">Médicos</span>
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'doctor').length}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-100 text-sm font-medium">Assistentes</span>
                        <UserCog className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'assistant').length}</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-100 text-sm font-medium">Recepcionistas</span>
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'receptionist').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[150px]"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">Todas as Funções</option>
                        <option value="admin">Administradores</option>
                        <option value="doctor">Médicos</option>
                        <option value="assistant">Assistentes</option>
                        <option value="receptionist">Recepcionistas</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Função</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Telefone</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => {
                                const RoleIcon = roles[user.role].icon;
                                return (
                                    <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-border"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-foreground">{user.name}</p>
                                                    {user.specialty && (
                                                        <p className="text-xs text-muted-foreground">{user.specialty}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roles[user.role].color}`}>
                                                <RoleIcon className="w-3.5 h-3.5" />
                                                {roles[user.role].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-muted-foreground">{user.phone || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${user.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-slate-50 text-slate-700 border-slate-100'
                                                }`}>
                                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <UsersIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Nenhum usuário encontrado.</p>
                    </div>
                )}
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                initialData={editingUser}
            />
        </div>
    );
};

export default Users;
