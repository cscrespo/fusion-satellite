import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            navigate('/login');
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Building2, label: 'Empresas', path: '/admin/tenants' },
        { icon: Users, label: 'Usuários Globais', path: '/admin/users' },
        { icon: Settings, label: 'Configurações', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Bloom Admin</h1>
                            <p className="text-xs text-slate-400">Super Admin</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
