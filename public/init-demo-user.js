// Initialize demo user for testing
const demoUser = {
    id: 1,
    name: 'Dr. Demo',
    email: 'demo@bloom.com',
    password: 'demo1234',
    role: 'admin',
    specialty: 'Nutricionista',
    phone: '+55 11 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    createdAt: new Date().toISOString()
};

// Save to localStorage
const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
if (!existingUsers.some(u => u.email === 'demo@bloom.com')) {
    existingUsers.push(demoUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    console.log('✅ Demo user created successfully!');
    console.log('Email: demo@bloom.com');
    console.log('Password: demo1234');
} else {
    console.log('ℹ️ Demo user already exists');
}
