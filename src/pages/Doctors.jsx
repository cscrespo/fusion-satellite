import React, { useState } from 'react';
import { Search, Filter, Plus, Stethoscope, Loader2 } from 'lucide-react';
import DoctorCard from '../components/doctors/DoctorCard';
import DoctorModal from '../components/doctors/DoctorModal';
import { useDoctors } from '../context/DoctorContext';

const Doctors = () => {
    const { doctors, loading, addDoctor } = useDoctors();
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const specialties = ['all', ...new Set(doctors.map(d => d.specialty))];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
        return matchesSearch && matchesSpecialty;
    });

    const handleAddDoctor = async (newDoctor) => {
        try {
            await addDoctor(newDoctor);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(`Erro ao cadastrar especialista: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Especialistas</h2>
                    <p className="text-muted-foreground mt-1">Conecte-se com nossa rede de médicos parceiros.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Especialista
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou especialidade..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[150px]"
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                    >
                        <option value="all">Todas Especialidades</option>
                        {specialties.filter(s => s !== 'all').map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            {filteredDoctors.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-lg font-medium">Nenhum especialista encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            )}

            <DoctorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddDoctor}
            />
        </div>
    );
};

export default Doctors;
