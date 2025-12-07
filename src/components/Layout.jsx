import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, Activity, DollarSign, Stethoscope, UserCog, LogOut, Package } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { branding } = useBranding();

    const navItems = [
        { icon: LayoutDashboard, label: 'Painel', path: '/' },
        { icon: Users, label: 'Pacientes', path: '/patients' },
        { icon: Stethoscope, label: 'Especialistas', path: '/doctors' },
        { icon: Package, label: 'Planos', path: '/plans' },
        { icon: UserCog, label: 'Usuários', path: '/users' },
        { icon: DollarSign, label: 'Faturas', path: '/invoices' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-6 flex items-center gap-2 border-b border-border">
                    {branding.logoInternal ? (
                        <img
                            src={branding.logoInternal}
                            alt={branding.platformName}
                            className="h-8 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML += `<h1 class="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">${branding.platformName}</h1>`;
                            }}
                        />
                    ) : (
                        <>
                            <Activity className="w-8 h-8 text-primary" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                {branding.platformName}
                            </h1>
                        </>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <Icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border space-y-3">
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {user ? getUserInitials(user.name) : 'DD'}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">{user?.name || 'Dr. Demo'}</span>
                            <span className="text-xs text-muted-foreground truncate">{user?.specialty || 'Nutricionista'}</span>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background/50 relative">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
