/**
 * Handles all authentication-related logic, session management,
 * route protection, and instant demo data seeding for MyFitnessPal.
 */

// Helper to resolve URLs correctly whether at root or inside /pages/
function resolvePageUrl(target) {
    const isPagesDir = window.location.pathname.includes('/pages/');
    if (target === 'index.html' || target === 'index' || target === '/') {
        return isPagesDir ? '../index.html' : 'index.html';
    }
    const cleanTarget = target.replace(/^pages\//, '').replace(/^\//, '');
    return isPagesDir ? cleanTarget : `pages/${cleanTarget}`;
}

class Auth {
    constructor() {
        this.users = localStore.get('users') || [];
        this.currentUser = sessionStore.get('currentUser') || null;

        // Auto-seed demo user if none exists
        this.ensureDemoUser();

        // If no user in session, check if we should auto-login demo or keep session
        if (!this.currentUser) {
            const savedSession = localStore.get('active_session_user');
            if (savedSession) {
                this.currentUser = savedSession;
                sessionStore.set('currentUser', savedSession);
            }
        }
    }

    /**
     * Seeds a realistic, rich demo profile for "Sarah Jenkins" with 14-day history,
     * daily meals, exercise, weight loss curve, and water tracking.
     */
    ensureDemoUser() {
        const demoEmail = 'demo@myfitnesspal.com';
        let demo = this.users.find(u => u.email === demoEmail);

        const getDateString = (offsetDays = 0) => {
            const d = new Date();
            d.setDate(d.getDate() + offsetDays);
            return d.toISOString().split('T')[0];
        };

        const todayStr = getDateString(0);

        if (!demo) {
            demo = {
                id: 'demo-user-1',
                username: 'sarah_fitness',
                email: demoEmail,
                password: 'password123',
                isPremium: true,
                streak: 14,
                profile: {
                    displayName: 'Sarah Jenkins',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                    birthdate: '1996-05-14',
                    gender: 'female',
                    height: 168,
                    activityLevel: 'moderate'
                },
                goals: {
                    startingWeight: 72.5,
                    currentWeight: 68.2,
                    goalWeight: 65.0,
                    weeklyGoal: 0.5,
                    dailyCalories: 2100,
                    waterGoalOz: 64, // 8 glasses
                    macros: { carbs: 45, protein: 30, fat: 25 },
                    weeklyExercise: 4
                },
                data: {
                    water: {
                        [todayStr]: 6 // 6 out of 8 glasses
                    },
                    weight: [
                        { date: getDateString(-30), value: 72.5, notes: 'Starting journey' },
                        { date: getDateString(-25), value: 71.8, notes: 'Clean eating week 1' },
                        { date: getDateString(-20), value: 71.1, notes: 'Hit workout goal' },
                        { date: getDateString(-15), value: 70.3, notes: 'Halfway to 70kg' },
                        { date: getDateString(-10), value: 69.6, notes: 'Energy feels amazing' },
                        { date: getDateString(-5), value: 68.9, notes: 'Down 3.6kg' },
                        { date: todayStr, value: 68.2, notes: 'Weekly weigh-in' }
                    ],
                    food: [
                        // TODAY'S MEALS
                        { id: 'f-1', date: todayStr, meal: 'Breakfast', foodId: 'food-2', servings: 1 }, // Scrambled eggs (182)
                        { id: 'f-2', date: todayStr, meal: 'Breakfast', foodId: 'food-5', servings: 1 }, // Avocado toast (260)
                        { id: 'f-3', date: todayStr, meal: 'Breakfast', foodId: 'food-8', servings: 1 }, // Latte (170)
                        { id: 'f-4', date: todayStr, meal: 'Lunch', foodId: 'food-11', servings: 1 },    // Chicken breast (248)
                        { id: 'f-5', date: todayStr, meal: 'Lunch', foodId: 'food-21', servings: 1 },    // Brown rice (218)
                        { id: 'f-6', date: todayStr, meal: 'Lunch', foodId: 'food-39', servings: 1 },    // Broccoli (55)
                        { id: 'f-7', date: todayStr, meal: 'Dinner', foodId: 'food-12', servings: 1 },   // Salmon (310)
                        { id: 'f-8', date: todayStr, meal: 'Dinner', foodId: 'food-23', servings: 0.75 }, // Quinoa (166)
                        { id: 'f-9', date: todayStr, meal: 'Dinner', foodId: 'food-41', servings: 1 },   // Asparagus (35)
                        { id: 'f-10', date: todayStr, meal: 'Snacks', foodId: 'food-4', servings: 1 },   // Greek yogurt (100)
                        { id: 'f-11', date: todayStr, meal: 'Snacks', foodId: 'food-37', servings: 1 },  // Blueberries (84)
                        { id: 'f-12', date: todayStr, meal: 'Snacks', foodId: 'food-29', servings: 0.5 },// Almonds (82)

                        // YESTERDAY MEALS
                        { id: 'f-y1', date: getDateString(-1), meal: 'Breakfast', foodId: 'food-3', servings: 1 },
                        { id: 'f-y2', date: getDateString(-1), meal: 'Breakfast', foodId: 'food-6', servings: 1 },
                        { id: 'f-y3', date: getDateString(-1), meal: 'Lunch', foodId: 'food-48', servings: 1 },
                        { id: 'f-y4', date: getDateString(-1), meal: 'Dinner', foodId: 'food-15', servings: 1 },
                        { id: 'f-y5', date: getDateString(-1), meal: 'Dinner', foodId: 'food-24', servings: 1 },
                        { id: 'f-y6', date: getDateString(-1), meal: 'Snacks', foodId: 'food-43', servings: 1 }
                    ],
                    exercise: [
                        { id: 'ex-t1', date: todayStr, exerciseId: 'ex-1', duration: 30, intensity: 'moderate', caloriesBurned: 345 },
                        { id: 'ex-y1', date: getDateString(-1), exerciseId: 'ex-10', duration: 45, intensity: 'moderate', caloriesBurned: 290 },
                        { id: 'ex-y2', date: getDateString(-3), exerciseId: 'ex-3', duration: 40, intensity: 'moderate', caloriesBurned: 360 },
                        { id: 'ex-y3', date: getDateString(-5), exerciseId: 'ex-1', duration: 35, intensity: 'moderate', caloriesBurned: 400 }
                    ],
                    bookings: [
                        { id: 'b-1', proId: 'pro-1', proName: 'Alex Johnson', date: getDateString(2), time: '10:00 AM', status: 'Confirmed' }
                    ]
                }
            };
            this.users.push(demo);
            localStore.set('users', this.users);
        }
        return demo;
    }

    /**
     * 1-Click Demo Login for portfolio reviewers & recruiters
     */
    loginDemoUser() {
        const demo = this.ensureDemoUser();
        this.currentUser = demo;
        sessionStore.set('currentUser', demo);
        localStore.set('active_session_user', demo);
        window.location.href = resolvePageUrl('dashboard.html');
        return true;
    }

    signUp(username, email, password) {
        if (this.users.find(user => user.username === username || user.email === email)) {
            return { success: false, message: 'Username or email already exists.' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters.' };
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            isPremium: false,
            streak: 1,
            profile: {
                displayName: username,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                birthdate: '1998-01-01',
                gender: 'male',
                height: 175,
                activityLevel: 'moderate'
            },
            goals: {
                startingWeight: 75.0,
                currentWeight: 75.0,
                goalWeight: 70.0,
                weeklyGoal: 0.5,
                dailyCalories: 2000,
                waterGoalOz: 64,
                macros: { carbs: 50, protein: 25, fat: 25 },
                weeklyExercise: 3
            },
            data: {
                water: { [todayStr]: 0 },
                weight: [{ date: todayStr, value: 75.0, notes: 'Starting weight' }],
                food: [],
                exercise: [],
                bookings: []
            }
        };

        this.users.push(newUser);
        localStore.set('users', this.users);
        this.currentUser = newUser;
        sessionStore.set('currentUser', newUser);
        localStore.set('active_session_user', newUser);

        return { success: true, message: 'Account created successfully!' };
    }

    login(emailOrUsername, password) {
        const user = this.users.find(
            u => (u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.username.toLowerCase() === emailOrUsername.toLowerCase()) && u.password === password
        );
        if (user) {
            this.currentUser = user;
            sessionStore.set('currentUser', user);
            localStore.set('active_session_user', user);
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        sessionStore.remove('currentUser');
        localStore.remove('active_session_user');
        window.location.href = resolvePageUrl('login.html');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = sessionStore.get('currentUser') || localStore.get('active_session_user');
        }
        return this.currentUser;
    }

    updateUser(updatedUser) {
        this.currentUser = updatedUser;
        sessionStore.set('currentUser', updatedUser);
        localStore.set('active_session_user', updatedUser);
        const userIndex = this.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = updatedUser;
            localStore.set('users', this.users);
        }
    }

    checkLoginStatus() {
        const path = window.location.pathname;
        const isProtected = ['dashboard.html', 'food-diary.html', 'exercise.html', 'progress.html', 'goals.html', 'settings.html', 'professionals.html'].some(p => path.endsWith(p));
        const isPublicAuth = ['login.html', 'signup.html'].some(p => path.endsWith(p));

        let user = this.getCurrentUser();
        if (isProtected && !user) {
            // Smooth portfolio reviewer experience: auto-seed demo user
            user = this.ensureDemoUser();
            this.currentUser = user;
            sessionStore.set('currentUser', user);
            localStore.set('active_session_user', user);
        }
    }

    updateHeaderNav() {
        const navMenu = document.getElementById('nav-menu');
        const authButtons = document.querySelector('.auth-buttons');
        const user = this.getCurrentUser();

        if (navMenu) {
            navMenu.innerHTML = '';
            if (user) {
                navMenu.innerHTML = `
                    <li><a href="${resolvePageUrl('dashboard.html')}" class="${window.location.pathname.endsWith('dashboard.html') ? 'active' : ''}">Dashboard</a></li>
                    <li><a href="${resolvePageUrl('food-diary.html')}" class="${window.location.pathname.endsWith('food-diary.html') ? 'active' : ''}">Food</a></li>
                    <li><a href="${resolvePageUrl('exercise.html')}" class="${window.location.pathname.endsWith('exercise.html') ? 'active' : ''}">Exercise</a></li>
                    <li><a href="${resolvePageUrl('progress.html')}" class="${window.location.pathname.endsWith('progress.html') ? 'active' : ''}">Progress</a></li>
                    <li><a href="${resolvePageUrl('professionals.html')}" class="${window.location.pathname.endsWith('professionals.html') ? 'active' : ''}">Coaches</a></li>
                    <li><a href="${resolvePageUrl('premium.html')}" class="premium-nav-link ${window.location.pathname.endsWith('premium.html') ? 'active' : ''}"><i class="fas fa-crown"></i> Premium</a></li>
                `;
            } else {
                navMenu.innerHTML = `
                    <li><a href="${resolvePageUrl('index.html')}#features">Features</a></li>
                    <li><a href="${resolvePageUrl('index.html')}#calculator">Calorie Tool</a></li>
                    <li><a href="${resolvePageUrl('index.html')}#food-database">Food Search</a></li>
                    <li><a href="${resolvePageUrl('premium.html')}"><i class="fas fa-crown"></i> Premium</a></li>
                `;
            }
        }

        if (authButtons) {
            authButtons.innerHTML = '';
            if (user) {
                authButtons.innerHTML = `
                    <div class="user-header-profile">
                        <div class="user-streak-badge" title="Consecutive logging streak">
                            <i class="fas fa-fire"></i> <span>${user.streak || 14}d</span>
                        </div>
                        <div class="user-dropdown">
                            <button class="user-menu-btn">
                                <img src="${user.profile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80'}" alt="Avatar" class="header-avatar">
                                <span class="header-username">${user.profile.displayName || user.username}</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <div class="dropdown-user-info">
                                    <strong>${user.profile.displayName}</strong>
                                    <small>${user.email}</small>
                                    ${user.isPremium ? '<span class="badge-premium"><i class="fas fa-crown"></i> Premium Member</span>' : '<span class="badge-free">Free Plan</span>'}
                                </div>
                                <div class="dropdown-divider"></div>
                                <a href="${resolvePageUrl('goals.html')}"><i class="fas fa-bullseye"></i> My Goals</a>
                                <a href="${resolvePageUrl('progress.html')}"><i class="fas fa-chart-line"></i> Weight & Progress</a>
                                <a href="${resolvePageUrl('settings.html')}"><i class="fas fa-cog"></i> Settings</a>
                                <div class="dropdown-divider"></div>
                                <a href="#" id="logout-btn" class="text-danger"><i class="fas fa-sign-out-alt"></i> Log Out</a>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('logout-btn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            } else {
                authButtons.innerHTML = `
                    <button class="btn btn-demo-pill" id="quick-demo-btn" title="Recruiter 1-Click Test Drive">
                        <i class="fas fa-rocket"></i> Demo Drive
                    </button>
                    <a href="${resolvePageUrl('login.html')}" class="btn btn-secondary">Log In</a>
                    <a href="${resolvePageUrl('signup.html')}" class="btn btn-primary">Sign Up</a>
                `;
                document.getElementById('quick-demo-btn')?.addEventListener('click', () => {
                    this.loginDemoUser();
                });
            }
        }
    }
}

// Instantiate Auth
const auth = new Auth();

// Global init on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    auth.checkLoginStatus();
    auth.updateHeaderNav();

    // Mobile menu toggle
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
            toggle.classList.toggle('active');
        });
    }

    // Demo drive buttons anywhere on the page
    document.querySelectorAll('.btn-demo-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.loginDemoUser();
        });
    });
});