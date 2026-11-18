// Comprehensive MyFitnessPal Exercise Database
const EXERCISE_DATABASE = [
    // CARDIO
    {
        id: 'ex-1',
        name: 'Running (Moderate Pace, ~6 mph / 10 km/h)',
        category: 'cardio',
        icon: 'fas fa-running',
        calsPerMinute: 11.5,
        defaultDuration: 30
    },
    {
        id: 'ex-2',
        name: 'Running (Vigorous Pace, ~7.5 mph / 12 km/h)',
        category: 'cardio',
        icon: 'fas fa-running',
        calsPerMinute: 14.5,
        defaultDuration: 25
    },
    {
        id: 'ex-3',
        name: 'Outdoor Cycling (Moderate Effort, 12-14 mph)',
        category: 'cardio',
        icon: 'fas fa-biking',
        calsPerMinute: 9.0,
        defaultDuration: 45
    },
    {
        id: 'ex-4',
        name: 'Stationary Cycling (Spin Class / HIIT)',
        category: 'cardio',
        icon: 'fas fa-biking',
        calsPerMinute: 10.5,
        defaultDuration: 45
    },
    {
        id: 'ex-5',
        name: 'Brisk Walking (3.5 mph / 5.6 km/h, Incline)',
        category: 'cardio',
        icon: 'fas fa-walking',
        calsPerMinute: 5.5,
        defaultDuration: 45
    },
    {
        id: 'ex-6',
        name: 'Swimming (Freestyle, Moderate Laps)',
        category: 'cardio',
        icon: 'fas fa-swimmer',
        calsPerMinute: 9.5,
        defaultDuration: 35
    },
    {
        id: 'ex-7',
        name: 'Rowing Machine (Moderate to High Intensity)',
        category: 'cardio',
        icon: 'fas fa-water',
        calsPerMinute: 10.0,
        defaultDuration: 25
    },
    {
        id: 'ex-8',
        name: 'Jump Rope (Continuous Intervals)',
        category: 'cardio',
        icon: 'fas fa-bolt',
        calsPerMinute: 13.0,
        defaultDuration: 20
    },
    {
        id: 'ex-9',
        name: 'HIIT / Circuit Training (Bodyweight + Cardio)',
        category: 'cardio',
        icon: 'fas fa-fire',
        calsPerMinute: 11.0,
        defaultDuration: 30
    },

    // STRENGTH & FLEXIBILITY
    {
        id: 'ex-10',
        name: 'Weight Lifting (Upper Body Hypertrophy)',
        category: 'strength',
        icon: 'fas fa-dumbbell',
        calsPerMinute: 6.5,
        defaultDuration: 50
    },
    {
        id: 'ex-11',
        name: 'Weight Lifting (Legs & Glutes, Squats/Deadlifts)',
        category: 'strength',
        icon: 'fas fa-dumbbell',
        calsPerMinute: 8.0,
        defaultDuration: 55
    },
    {
        id: 'ex-12',
        name: 'Vinyasa Flow Yoga',
        category: 'flexibility',
        icon: 'fas fa-spa',
        calsPerMinute: 4.5,
        defaultDuration: 60
    },
    {
        id: 'ex-13',
        name: 'Pilates (Mat & Core Resistance)',
        category: 'strength',
        icon: 'fas fa-heartbeat',
        calsPerMinute: 5.2,
        defaultDuration: 45
    },
    {
        id: 'ex-14',
        name: 'Full Body Stretching & Mobility Routine',
        category: 'flexibility',
        icon: 'fas fa-child',
        calsPerMinute: 3.0,
        defaultDuration: 20
    }
];

function searchExerciseDatabase(query, category = 'all') {
    if (!query && category === 'all') return EXERCISE_DATABASE;
    const q = (query || '').toLowerCase().trim();
    return EXERCISE_DATABASE.filter(ex => {
        const matchesQuery = !q || ex.name.toLowerCase().includes(q);
        const matchesCategory = category === 'all' || ex.category === category;
        return matchesQuery && matchesCategory;
    });
}