import React, { useState } from 'react';
import { Search, Filter, Plus, Users as UsersIcon, Edit, Trash2, Shield, Stethoscope, UserCog, UserCheck } from 'lucide-react';
import UserModal from '../components/users/UserModal';

const Users = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Dr. Smith',
            email: 'dr.smith@bloom.com',
            role: 'admin',
            specialty: 'Nutricionista',
            phone: '+55 11 98765-4321',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
            status: 'active',
            createdAt: '2023-01-15'
        },
        {
            id: 2,
            name: 'Dra. Ana Clara',
            email: 'ana.clara@bloom.com',
            role: 'doctor',
            specialty: 'Nutróloga',
            phone: '+55 11 91234-5678',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71edce6c18?w=400',
            status: 'active',
            createdAt: '2023-02-20'
        },
        {
            id: 3,
            name: 'Carlos Eduardo',
            email: 'carlos@bloom.com',
            role: 'assistant',
            specialty: '',
            phone: '+55 11 99876-5432',
            avatar: '',
            status: 'active',
            createdAt: '2023-03-10'
        },
        {
            id: 4,
            name: 'Maria Santos',
            email: 'maria@bloom.com',
            role: 'receptionist',
            specialty: '',
            phone: '+55 11 97654-3210',
            avatar: '',
            status: 'inactive',
            createdAt: '2023-04-05'
        }
    ]);

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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleAddUser = (userData) => {
        const newUser = {
            ...userData,
            id: users.length + 1,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers([...users, newUser]);
        setIsModalOpen(false);
    };

    const handleEditUser = (userData) => {
        setUsers(users.map(user =>
            user.id === editingUser.id ? { ...user, ...userData } : user
        ));
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            setUsers(users.filter(user => user.id !== userId));
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
