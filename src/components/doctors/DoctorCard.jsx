import React from 'react';
import { Star, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="p-6 flex flex-col items-center text-center relative">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-primary/20 to-blue-500/20 mb-4 group-hover:scale-105 transition-transform duration-300">
                    <img
                        src={doctor.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80'}
                        alt={doctor.name}
                        className="w-full h-full rounded-full object-cover border-2 border-background shadow-sm"
                    />
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-foreground">{doctor.name}</h3>
                <p className="text-primary font-medium text-sm mb-1">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground mb-3">CRM: {doctor.crm} {doctor.rqe && `• RQE: ${doctor.rqe}`}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-700">{doctor.rating}</span>
                    <span className="text-xs text-amber-600/80">({doctor.reviews} avaliações)</span>
                </div>

                {/* Bio Preview */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 px-2">
                    {doctor.bio}
                </p>

                {/* Actions */}
                <div className="w-full grid grid-cols-2 gap-3">
                    <Link
                        to={`/doctors/${doctor.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                    >
                        <Calendar className="w-4 h-4" />
                        Perfil
                    </Link>
                    <Link
                        to={`/consultation/${doctor.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all text-sm font-medium shadow-lg shadow-primary/20"
                    >
                        <Calendar className="w-4 h-4" />
                        Agendar
                    </Link>
                </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-secondary/30 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Telemedicina</span>
                </div>
                <div className="font-semibold text-foreground">
                    R$ {doctor.price.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
