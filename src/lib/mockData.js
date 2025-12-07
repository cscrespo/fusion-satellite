export const mockPatients = [
    {
        id: 1,
        name: 'Alice Johnson',
        age: 34,
        startWeight: 85,
        currentWeight: 78,
        goalWeight: 65,
        status: 'Active',
        phone: '(11) 98765-4321',
        address: 'Rua das Flores, 123, Jardim Primavera, São Paulo - SP',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
        detailedHistory: [
            { date: '2023-10-01', weight: 85.0, fatMass: 32.0, leanMass: 53.0 },
            { date: '2023-10-15', weight: 83.5, fatMass: 31.2, leanMass: 52.3 },
            { date: '2023-11-01', weight: 82.0, fatMass: 30.0, leanMass: 52.0 },
            { date: '2023-11-15', weight: 80.5, fatMass: 28.8, leanMass: 51.7 },
            { date: '2023-12-01', weight: 79.0, fatMass: 27.5, leanMass: 51.5 },
            { date: '2023-12-15', weight: 78.0, fatMass: 26.5, leanMass: 51.5 },
        ],
        measurements: [
            { subject: 'Cintura', A: 95, B: 88, fullMark: 120 },
            { subject: 'Quadril', A: 110, B: 105, fullMark: 120 },
            { subject: 'Peito', A: 98, B: 94, fullMark: 120 },
            { subject: 'Braço', A: 32, B: 30, fullMark: 50 },
            { subject: 'Coxa', A: 60, B: 56, fullMark: 80 },
        ],
        tasks: [
            { id: 1, title: 'Beber 3L de água', status: 'pending', due: 'Hoje' },
            { id: 2, title: 'Caminhada 30min', status: 'completed', due: 'Ontem' }
        ],
        medications: [
            { id: 1, name: 'Vitamina D', dosage: '2000UI', frequency: 'Diário', time: 'Manhã', notes: 'Tomar com refeição' }
        ],
        supplements: [
            { id: 1, name: 'Whey Protein', dosage: '1 scoop', frequency: 'Pós-treino', time: 'Tarde', notes: 'Com água' }
        ],
        diet: [
            { id: 1, time: '08:00', name: 'Café da Manhã', description: 'Ovos mexidos (2 un) + Mamão (1 fatia) + Aveia (30g)' },
            { id: 2, time: '12:30', name: 'Almoço', description: 'Frango grelhado (150g) + Arroz integral (100g) + Legumes' },
            { id: 3, time: '16:00', name: 'Lanche', description: 'Whey Protein (1 dose) + Fruta' },
            { id: 4, time: '20:00', name: 'Jantar', description: 'Peixe assado (150g) + Salada à vontade + Azeite (1 col)' }
        ],
        nutritionGoals: {
            calories: 2000,
            protein: 160,
            carbs: 200,
            fat: 65,
            water: 3000 // ml
        },
        dailyLogs: {
            date: new Date().toISOString().split('T')[0],
            waterIntake: 1250,
            meals: [
                { id: 101, time: '08:15', type: 'Café da Manhã', name: 'Ovos e Fruta', calories: 350, macros: { p: 25, c: 30, f: 12 }, photo: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=150&q=80' },
                { id: 102, time: '12:45', type: 'Almoço', name: 'Frango com Batata', calories: 550, macros: { p: 45, c: 50, f: 15 }, photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80' }
            ],
            checklist: [
                { id: 1, task: 'Beber 500ml de água ao acordar', completed: true },
                { id: 2, task: 'Tomar Creatina (5g)', completed: true },
                { id: 3, task: 'Comer 2 frutas', completed: false },
                { id: 4, task: 'Não ingerir açúcar refinado', completed: true }
            ]
        },
        adherenceLogs: {
            [new Date().toISOString().split('T')[0]]: [
                { id: 1, name: 'Vitamina D', type: 'medication', dosage: '2000UI', scheduledTime: '08:00', status: 'taken', takenAt: '08:15' },
                { id: 2, name: 'Whey Protein', type: 'supplement', dosage: '1 scoop', scheduledTime: '16:00', status: 'pending', takenAt: null },
                { id: 3, name: 'Magnésio', type: 'supplement', dosage: '200mg', scheduledTime: '21:00', status: 'pending', takenAt: null }
            ]
        },
        dietPlan: {
            monday: {
                meals: [
                    { id: 1, name: 'Café da Manhã', time: '07:30', items: [{ id: 1, food: 'Ovos Mexidos', quantity: '2 un' }, { id: 2, food: 'Pão Integral', quantity: '2 fatias' }] },
                    { id: 2, name: 'Almoço', time: '12:30', items: [{ id: 3, food: 'Frango Grelhado', quantity: '150g' }, { id: 4, food: 'Arroz Integral', quantity: '100g' }, { id: 5, food: 'Feijão', quantity: '1 concha' }] },
                    { id: 3, name: 'Jantar', time: '19:30', items: [{ id: 6, food: 'Peixe Assado', quantity: '150g' }, { id: 7, food: 'Salada Verde', quantity: 'À vontade' }] }
                ],
                macros: { calories: 1950, protein: 160, carbs: 180, fat: 60 }
            },
            tuesday: {
                meals: [
                    { id: 1, name: 'Café da Manhã', time: '07:30', items: [{ id: 1, food: 'Iogurte Natural', quantity: '170g' }, { id: 2, food: 'Granola', quantity: '30g' }] },
                    { id: 2, name: 'Almoço', time: '12:30', items: [{ id: 3, food: 'Carne Moída', quantity: '150g' }, { id: 4, food: 'Purê de Batata', quantity: '120g' }] }
                ],
                macros: { calories: 1900, protein: 155, carbs: 190, fat: 55 }
            }
        },
        consultations: [
            {
                id: 1,
                date: '2025-11-15T14:30:00',
                doctor: 'Dr. Smith',
                specialty: 'Nutricionista',
                type: 'Presencial',
                transcription: 'Paciente relata melhora na disposição, mas dificuldade em manter a dieta nos finais de semana. Sente fome excessiva à tarde.',
                notes: 'Paciente motivado, porém ansioso com resultados imediatos.',
                objective: {
                    weight: 79.5,
                    bp: '120/80',
                    notes: 'Leve retenção de líquidos observada.'
                },
                assessment: 'Evolução positiva, necessidade de ajuste proteico no lanche da tarde.',
                plan: [
                    'Aumentar aporte de fibras no almoço.',
                    'Incluir opção de lanche proteico (iogurte + whey) às 16h.',
                    'Manter suplementação atual.'
                ]
            },
            {
                id: 2,
                date: '2025-10-10T10:00:00',
                doctor: 'Dr. Smith',
                specialty: 'Nutricionista',
                type: 'Online',
                transcription: 'Primeira consulta. Queixa principal: ganho de peso nos últimos 2 anos e fadiga crônica.',
                notes: 'Histórico familiar de diabetes.',
                objective: {
                    weight: 85.0,
                    bp: '130/85',
                    notes: 'Exames de sangue solicitados.'
                },
                assessment: 'Sobrepeso grau I, sedentarismo.',
                plan: [
                    'Iniciar caminhadas leves 3x na semana.',
                    'Dieta hipocalórica leve para adaptação.',
                    'Solicitação de exames laboratoriais completos.'
                ]
            }
        ],
        currentPlan: {
            name: 'Protocolo Monjauro 2ml',
            frequency: 'Acompanhamento Semanal'
        },
        bodyComposition: {
            fat: 22,
            leanMass: 32
        },
        followUp: {
            startDate: '2025-11-15',
            currentPhase: 'Adaptação',
            weekCurrent: 3,
            weekTotal: 12,
            focus: 'Ajuste de dosagem e controle de saciedade.',
            nextEvaluation: '2025-12-15'
        },
        nextSteps: [
            { id: 1, text: 'Exames de sangue (Jejum)', completed: false },
            { id: 2, text: 'Retorno com Nutricionista', completed: false }
        ],
        alerts: [
            { id: 1, text: 'Peso estagnado há 2 semanas.', type: 'warning' },
            { id: 2, text: 'Esqueceu medicação (Omega 3) ontem.', type: 'critical' }
        ]
    },
    { id: 2, name: 'Bob Smith', age: 45, startWeight: 102, currentWeight: 95, goalWeight: 85, status: 'Active', phone: '(21) 99999-8888', address: 'Av. Atlântica, 400, Copacabana, Rio de Janeiro - RJ', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
    { id: 3, name: 'Charlie Brown', age: 29, startWeight: 90, currentWeight: 88, goalWeight: 75, status: 'Active', phone: '(31) 97777-6666', address: 'Rua da Bahia, 1000, Centro, Belo Horizonte - MG', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80' },
    { id: 4, name: 'Diana Prince', age: 31, startWeight: 70, currentWeight: 68, goalWeight: 60, status: 'Inactive', phone: '(41) 95555-4444', address: 'Rua XV de Novembro, 500, Centro, Curitiba - PR', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' },
    { id: 5, name: 'Evan Wright', age: 50, startWeight: 110, currentWeight: 105, goalWeight: 90, status: 'Active', phone: '(51) 93333-2222', address: 'Av. Ipiranga, 2000, Praia de Belas, Porto Alegre - RS', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80' },
];

export const weightHistoryData = [
    { name: 'Semana 1', weight: 85 },
    { name: 'Semana 2', weight: 83.5 },
    { name: 'Semana 3', weight: 82 },
    { name: 'Semana 4', weight: 80.5 },
    { name: 'Semana 5', weight: 79 },
    { name: 'Semana 6', weight: 78 },
];

export const recentActivities = [
    { id: 1, patient: 'Alice Johnson', action: 'Registrou peso', time: '2 horas atrás' },
    { id: 2, patient: 'Bob Smith', action: 'Concluiu tarefa', time: '4 horas atrás' },
    { id: 3, patient: 'Charlie Brown', action: 'Atualizou medidas', time: '1 dia atrás' },
];

export const upcomingTasks = [
    { id: 1, title: 'Revisar plano de dieta da Alice', due: 'Hoje' },
    { id: 2, title: 'Ligar para Bob para check-in', due: 'Amanhã' },
    { id: 3, title: 'Preparar relatório mensal', due: 'Em 2 dias' },
];

export const mockDoctors = [
    {
        id: 1,
        name: 'Dra. Ana Clara',
        specialty: 'Nutróloga',
        crm: '123456-SP',
        rqe: '45678',
        bio: 'Especialista em emagrecimento saudável e performance esportiva. Foco em reeducação alimentar e equilíbrio hormonal.',
        rating: 4.9,
        reviews: 124,
        price: 350.00,
        status: 'online',
        nextAvailable: 'Hoje, 14:00',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80'
    },
    {
        id: 2,
        name: 'Dr. Roberto Campos',
        specialty: 'Endocrinologista',
        crm: '654321-SP',
        rqe: '87654',
        bio: 'Experiência em tratamento de diabetes, tireoide e distúrbios metabólicos. Abordagem integrativa.',
        rating: 4.8,
        reviews: 98,
        price: 400.00,
        status: 'busy',
        nextAvailable: 'Amanhã, 09:00',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80'
    },
    {
        id: 3,
        name: 'Dra. Júlia Mendes',
        specialty: 'Psicóloga',
        crm: 'CRP 06/12345',
        rqe: '',
        bio: 'Foco em transtornos alimentares e ansiedade. Terapia Cognitivo-Comportamental (TCC).',
        rating: 5.0,
        reviews: 56,
        price: 250.00,
        status: 'offline',
        nextAvailable: 'Quarta, 10:00',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&q=80'
    },
    {
        id: 4,
        name: 'Dr. Carlos Eduardo',
        specialty: 'Cardiologista',
        crm: '987654-SP',
        rqe: '11223',
        bio: 'Prevenção cardiovascular e acompanhamento de hipertensão. Check-up completo.',
        rating: 4.7,
        reviews: 82,
        price: 380.00,
        status: 'online',
        nextAvailable: 'Hoje, 16:30',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80'
    }
];
