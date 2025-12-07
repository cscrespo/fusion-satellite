import React, { useState } from 'react';
import {
    Search, Filter, Download, MoreHorizontal,
    DollarSign, Clock, CheckCircle2, AlertCircle,
    FileText, Send, Printer, Trash2, Edit
} from 'lucide-react';
import InvoiceModal from '../components/invoices/InvoiceModal';
import SendInvoiceModal from '../components/invoices/SendInvoiceModal';

const Invoices = () => {
    // Mock Data
    const [invoices, setInvoices] = useState([
        { id: 'INV-2023-001', patient: 'Alice Johnson', date: '2023-10-15', dueDate: '2023-10-15', amount: 350.00, status: 'Paid', service: 'Consulta Inicial + Bioimpedância' },
        { id: 'INV-2023-002', patient: 'Bob Smith', date: '2023-10-20', dueDate: '2023-10-20', amount: 200.00, status: 'Paid', service: 'Retorno Mensal' },
        { id: 'INV-2023-003', patient: 'Charlie Brown', date: '2023-10-25', dueDate: '2023-11-01', amount: 1500.00, status: 'Pending', service: 'Pacote Semestral (6 Consultas)' },
        { id: 'INV-2023-004', patient: 'Diana Prince', date: '2023-10-28', dueDate: '2023-10-30', amount: 200.00, status: 'Overdue', service: 'Retorno Mensal' },
        { id: 'INV-2023-005', patient: 'Evan Wright', date: '2023-11-01', dueDate: '2023-11-05', amount: 350.00, status: 'Pending', service: 'Consulta Inicial' },
        { id: 'INV-2023-006', patient: 'Fiona Green', date: '2023-11-02', dueDate: '2023-11-02', amount: 200.00, status: 'Paid', service: 'Retorno Mensal' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal States
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [sendingInvoice, setSendingInvoice] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    // Stats Calculation
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

    // Filtering
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // CRUD Operations
    const handleAddInvoice = (newInvoice) => {
        const invoiceWithId = {
            ...newInvoice,
            id: `INV-2023-${(invoices.length + 1).toString().padStart(3, '0')}`
        };
        setInvoices([invoiceWithId, ...invoices]);
    };

    const handleUpdateInvoice = (updatedInvoice) => {
        setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? { ...updatedInvoice, id: editingInvoice.id } : inv));
        setEditingInvoice(null);
    };

    const handleDeleteInvoice = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta fatura?')) {
            setInvoices(invoices.filter(inv => inv.id !== id));
        }
        setActiveMenu(null);
    };

    const handlePrint = (invoice) => {
        alert(`Imprimindo fatura ${invoice.id}...`);
        setActiveMenu(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Overdue': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-3 h-3" />;
            case 'Pending': return <Clock className="w-3 h-3" />;
            case 'Overdue': return <AlertCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Paid': return 'Pago';
            case 'Pending': return 'Pendente';
            case 'Overdue': return 'Atrasado';
            default: return status;
        }
    };

    return (
        <div className="space-y-8 pb-20" onClick={() => setActiveMenu(null)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Faturas</h2>
                    <p className="text-muted-foreground mt-1">Gerencie pagamentos e acompanhe o fluxo de caixa.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingInvoice(null);
                        setIsInvoiceModalOpen(true);
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <DollarSign className="w-5 h-5" />
                    Nova Fatura
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Receita Total</p>
                        <h3 className="text-2xl font-bold text-foreground">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Pendente</p>
                        <h3 className="text-2xl font-bold text-foreground">R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Em Atraso</p>
                        <h3 className="text-2xl font-bold text-foreground">R$ {overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex flex-col md:flex-row items-center gap-4 bg-secondary/10">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou ID..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="Paid">Pagos</option>
                            <option value="Pending">Pendentes</option>
                            <option value="Overdue">Atrasados</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Fatura</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Serviço</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="w-8 h-8 opacity-20" />
                                            <p>Nenhuma fatura encontrada.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="group hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground text-sm">{invoice.id}</span>
                                                <span className="text-xs text-muted-foreground">{invoice.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {invoice.patient.charAt(0)}
                                                </div>
                                                <span className="font-medium text-sm text-foreground">{invoice.patient}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-muted-foreground">{invoice.service}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-foreground">R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                                {getStatusIcon(invoice.status)}
                                                {getStatusLabel(invoice.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSendingInvoice(invoice);
                                                        setIsSendModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Enviar por Email"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePrint(invoice);
                                                    }}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Imprimir"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenu(activeMenu === invoice.id ? null : invoice.id);
                                                        }}
                                                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                        title="Mais Opções"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>

                                                    {activeMenu === invoice.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border z-10 animate-in fade-in zoom-in duration-200">
                                                            <div className="p-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingInvoice(invoice);
                                                                        setIsInvoiceModalOpen(true);
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteInvoice(invoice.id);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                onSubmit={editingInvoice ? handleUpdateInvoice : handleAddInvoice}
                initialData={editingInvoice}
            />

            <SendInvoiceModal
                isOpen={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
                invoice={sendingInvoice}
            />
        </div>
    );
};

export default Invoices;
