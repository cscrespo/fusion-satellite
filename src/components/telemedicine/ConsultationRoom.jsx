import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, MoreVertical, Settings, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDoctors } from '../../lib/mockData';

const ConsultationRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [duration, setDuration] = useState(0);

    const doctor = mockDoctors.find(d => d.id === parseInt(id));

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        if (window.confirm('Deseja encerrar a consulta?')) {
            navigate('/doctors');
        }
    };

    if (!doctor) return <div>Médico não encontrado</div>;

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                        <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{doctor.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {formatTime(duration)}
                        </div>
                    </div>
                </div>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center">
                {/* Doctor Video (Mock) */}
                <img
                    src={doctor.avatar}
                    alt="Doctor Feed"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 blur-3xl scale-110"
                />
                <div className="relative z-0 flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl">
                        <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white/50 text-sm">Conectado com criptografia ponta-a-ponta</p>
                </div>

                {/* Self View (PIP) */}
                <div className="absolute bottom-24 right-6 w-32 h-48 bg-slate-800 rounded-xl border border-white/10 shadow-xl overflow-hidden">
                    {isVideoOff ? (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                            <User className="w-10 h-10" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-700 animate-pulse" /> // Mock camera feed
                    )}
                    <div className="absolute bottom-2 left-2 text-[10px] font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">
                        Você
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="h-20 bg-slate-950 flex items-center justify-center gap-4 px-6">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 px-8"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>

                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-4 rounded-full transition-all ${showChat ? 'bg-primary text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                    <MessageSquare className="w-6 h-6" />
                </button>

                <button className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all">
                    <MoreVertical className="w-6 h-6" />
                </button>
            </div>

            {/* Chat Sidebar (Mock) */}
            {showChat && (
                <div className="absolute right-0 top-0 bottom-20 w-80 bg-slate-900 border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-200">
                    <div className="p-4 border-b border-white/10 text-white font-bold">Chat</div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none text-sm text-white/90">
                            Olá! Como posso ajudar hoje?
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <input
                            type="text"
                            placeholder="Digite uma mensagem..."
                            className="w-full bg-slate-800 border-none rounded-full px-4 py-2 text-white text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultationRoom;
