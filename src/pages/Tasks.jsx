import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Calendar } from 'lucide-react';
import { upcomingTasks } from '../lib/mockData';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        ...upcomingTasks.map(t => ({ ...t, status: 'pending' })),
        { id: 4, title: 'Update inventory', due: 'Next Week', status: 'completed' },
        { id: 5, title: 'Staff meeting', due: 'Friday', status: 'pending' },
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
        ));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Tarefas</h2>
                    <p className="text-muted-foreground mt-1">Mantenha-se organizado com seus afazeres diários.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nova Tarefa
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pending Tasks */}
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    <div className="p-4 border-b border-border bg-secondary/30">
                        <h3 className="font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent" />
                            Pendente
                        </h3>
                    </div>
                    <div className="divide-y divide-border">
                        {tasks.filter(t => t.status === 'pending').map((task) => (
                            <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-secondary/10 transition-colors group">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="mt-1 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Circle className="w-5 h-5" />
                                </button>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{task.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {task.due}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.filter(t => t.status === 'pending').length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                Nenhuma tarefa pendente. Bom trabalho!
                            </div>
                        )}
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    <div className="p-4 border-b border-border bg-secondary/30">
                        <h3 className="font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Concluído
                        </h3>
                    </div>
                    <div className="divide-y divide-border">
                        {tasks.filter(t => t.status === 'completed').map((task) => (
                            <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-secondary/10 transition-colors opacity-60">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="mt-1 text-green-500 transition-colors"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground line-through">{task.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {task.due}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.filter(t => t.status === 'completed').length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                Nenhuma tarefa concluída ainda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
