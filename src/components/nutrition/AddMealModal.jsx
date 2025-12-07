import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, Loader2, Utensils } from 'lucide-react';

const AddMealModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [activeTab, setActiveTab] = useState('manual');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [formData, setFormData] = useState({
        time: '',
        type: 'Café da Manhã',
        name: '',
        calories: '',
        p: '',
        c: '',
        f: '',
        photo: null
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    time: initialData.time,
                    type: initialData.type,
                    name: initialData.name,
                    calories: initialData.calories,
                    p: initialData.macros.p,
                    c: initialData.macros.c,
                    f: initialData.macros.f,
                    photo: initialData.photo
                });
                setActiveTab('manual'); // Edit is usually manual
            } else {
                // Default to current time rounded to nearest 15 min
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0');
                setFormData({
                    time: `${hours}:${minutes}`,
                    type: 'Lanche',
                    name: '',
                    calories: '',
                    p: '',
                    c: '',
                    f: '',
                    photo: null
                });
                setActiveTab('manual');
            }
        }
    }, [isOpen, initialData]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsAnalyzing(true);
            // Simulate AI Analysis delay
            setTimeout(() => {
                setIsAnalyzing(false);
                setFormData(prev => ({
                    ...prev,
                    name: 'Prato Detectado (AI)',
                    calories: '450',
                    p: '30',
                    c: '40',
                    f: '15',
                    photo: URL.createObjectURL(file)
                }));
            }, 2000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            calories: parseInt(formData.calories),
            macros: {
                p: parseInt(formData.p),
                c: parseInt(formData.c),
                f: parseInt(formData.f)
            }
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl w-full max-w-lg shadow-2xl border border-border flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-primary" />
                        {initialData ? 'Editar Refeição' : 'Registrar Refeição'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-1 bg-secondary/30 mx-6 mt-6 rounded-xl flex gap-1">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'manual' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Manual
                    </button>
                    <button
                        onClick={() => setActiveTab('photo')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'photo' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Foto (AI)
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {activeTab === 'photo' && !formData.photo && (
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/10 transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-sm font-medium">Analisando alimentos...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Tirar foto ou escolher da galeria</p>
                                        <p className="text-xs text-muted-foreground mt-1">Nossa IA irá identificar os alimentos e calcular os macros.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(activeTab === 'manual' || formData.photo) && (
                        <form id="meal-form" onSubmit={handleSubmit} className="space-y-4">
                            {formData.photo && (
                                <div className="relative h-40 rounded-xl overflow-hidden mb-4 group">
                                    <img src={formData.photo} alt="Meal" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                        <Loader2 className="w-3 h-3" /> Preenchido via AI
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Horário</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-2.5 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo</label>
                                    <select
                                        className="w-full p-2.5 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Café da Manhã</option>
                                        <option>Almoço</option>
                                        <option>Lanche</option>
                                        <option>Jantar</option>
                                        <option>Ceia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome da Refeição</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Omelete com Queijo"
                                    className="w-full p-2.5 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Kcal</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-blue-600 dark:text-blue-400">Prot (g)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2 bg-blue-50/50 border border-blue-100 dark:border-blue-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.p}
                                        onChange={(e) => setFormData({ ...formData, p: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Carb (g)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2 bg-yellow-50/50 border border-yellow-100 dark:border-yellow-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                                        value={formData.c}
                                        onChange={(e) => setFormData({ ...formData, c: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-rose-600 dark:text-rose-400">Gord (g)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2 bg-rose-50/50 border border-rose-100 dark:border-rose-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                        value={formData.f}
                                        onChange={(e) => setFormData({ ...formData, f: e.target.value })}
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-6 border-t border-border flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary transition-colors"
                    >
                        Cancelar
                    </button>
                    {(activeTab === 'manual' || formData.photo) && (
                        <button
                            type="submit"
                            form="meal-form"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                        >
                            {initialData ? 'Salvar Alterações' : 'Adicionar Refeição'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMealModal;
