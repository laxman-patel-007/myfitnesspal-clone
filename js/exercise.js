/**
 * Exercise Diary script powering workout tracking, calorie burn estimation,
 * date-specific logs, and exercise search.
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    if (!user) return;

    let currentDate = new Date();
    let selectedExercise = null;
    let selectedCategory = 'all';

    // DOM Elements
    const currentDateEl = document.getElementById('current-date');
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');

    const caloriesBurnedEl = document.getElementById('calories-burned');
    const exerciseTimeEl = document.getElementById('exercise-time');
    const exerciseGoalProgressEl = document.getElementById('exercise-goal-progress');
    const exerciseGoalEl = document.getElementById('exercise-goal');
    const exerciseEntriesContainer = document.getElementById('exercise-entries');

    // Modal Elements
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    const addExerciseModal = document.getElementById('add-exercise-modal');
    const exerciseSearchInput = document.getElementById('exercise-search-input');
    const exerciseListContainer = document.getElementById('exercise-list-container');
    const exerciseDetails = document.getElementById('exercise-details');
    const selectedExerciseName = document.getElementById('selected-exercise-name');
    const calculatedCalsPreview = document.getElementById('calculated-cals-preview');
    const exerciseDuration = document.getElementById('exercise-duration');
    const exerciseIntensity = document.getElementById('exercise-intensity');
    const confirmAddExerciseBtn = document.getElementById('confirm-add-exercise-btn');

    /**
     * Updates and renders the exercise diary for the current date
     */
    function updateExerciseForDate() {
        const currentUser = auth.getCurrentUser();
        const dateStr = currentDate.toISOString().split('T')[0];
        const isToday = new Date().toDateString() === currentDate.toDateString();

        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        currentDateEl.textContent = isToday ? `Today, ${currentDate.toLocaleDateString('en-US', options)}` : currentDate.toLocaleDateString('en-US', options);

        const exercisesForDate = (currentUser.data.exercise || []).filter(e => e.date === dateStr);

        // Calculate totals for today
        const totalBurned = exercisesForDate.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
        const totalMinutes = exercisesForDate.reduce((sum, ex) => sum + (ex.duration || 0), 0);

        if (caloriesBurnedEl) caloriesBurnedEl.textContent = totalBurned;
        if (exerciseTimeEl) exerciseTimeEl.textContent = totalMinutes;

        // Weekly goal calculation (distinct days in past 7 days)
        const past7Days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            past7Days.push(d.toISOString().split('T')[0]);
        }
        const workoutDaysCount = new Set(
            (currentUser.data.exercise || []).filter(e => past7Days.includes(e.date)).map(e => e.date)
        ).size;

        if (exerciseGoalProgressEl) exerciseGoalProgressEl.textContent = workoutDaysCount;
        if (exerciseGoalEl) exerciseGoalEl.textContent = currentUser.goals.weeklyExercise || 4;

        renderExerciseEntries(exercisesForDate);
    }

    /**
     * Renders today's workout cards
     */
    function renderExerciseEntries(exercises) {
        if (!exerciseEntriesContainer) return;

        if (exercises.length === 0) {
            exerciseEntriesContainer.innerHTML = `
                <div class="empty-meal-state" style="padding: 30px; text-align: center;">
                    <i class="fas fa-running" style="font-size: 32px; color: var(--text-light); margin-bottom: 10px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 14px;">No workouts logged for this date.</p>
                    <button class="btn btn-primary btn-sm mt-3" id="empty-add-exercise-btn">
                        <i class="fas fa-plus"></i> Add Workout
                    </button>
                </div>
            `;
            document.getElementById('empty-add-exercise-btn')?.addEventListener('click', openModal);
            return;
        }

        exerciseEntriesContainer.innerHTML = exercises.map(ex => {
            const info = (typeof EXERCISE_DATABASE !== 'undefined' ? EXERCISE_DATABASE : []).find(e => e.id === ex.exerciseId) || { name: 'Workout', icon: 'fas fa-dumbbell' };
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: var(--bg-page); margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 42px; height: 42px; border-radius: 10px; background: #ecfdf5; color: var(--success); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <i class="${info.icon || 'fas fa-running'}"></i>
                        </div>
                        <div>
                            <strong style="font-size: 15px; color: var(--text-main); display: block;">${info.name}</strong>
                            <span style="font-size: 13px; color: var(--text-muted);">${ex.duration} mins • ${ex.intensity || 'moderate'} intensity</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="font-size: 18px; font-weight: 800; color: var(--success); text-align: right;">
                            -${ex.caloriesBurned} kcal
                        </div>
                        <button class="delete-btn-ghost delete-ex-btn" data-id="${ex.id}" title="Delete workout">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        exerciseEntriesContainer.querySelectorAll('.delete-ex-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exId = e.currentTarget.getAttribute('data-id');
                const currentUser = auth.getCurrentUser();
                currentUser.data.exercise = currentUser.data.exercise.filter(x => x.id !== exId);
                auth.updateUser(currentUser);
                updateExerciseForDate();
                showToast('Workout entry removed', 'success');
            });
        });
    }

    // --- Modal Logic ---
    function openModal() {
        if (exerciseSearchInput) exerciseSearchInput.value = '';
        selectedExercise = null;
        if (exerciseDetails) exerciseDetails.classList.add('hidden');
        if (confirmAddExerciseBtn) confirmAddExerciseBtn.disabled = true;
        renderExerciseList();
        addExerciseModal?.classList.add('show');
    }

    addExerciseBtn?.addEventListener('click', openModal);

    addExerciseModal?.querySelectorAll('.modal-close, .modal-close-btn').forEach(b => {
        b.addEventListener('click', () => addExerciseModal.classList.remove('show'));
    });
    addExerciseModal?.addEventListener('click', (e) => {
        if (e.target === addExerciseModal) addExerciseModal.classList.remove('show');
    });

    // Category pills inside exercise modal
    document.querySelectorAll('#exercise-cat-pills .quick-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('#exercise-cat-pills .quick-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedCategory = pill.getAttribute('data-category');
            renderExerciseList(exerciseSearchInput.value);
        });
    });

    exerciseSearchInput?.addEventListener('input', (e) => {
        renderExerciseList(e.target.value);
    });

    function renderExerciseList(query = '') {
        if (!exerciseListContainer || typeof searchExerciseDatabase === 'undefined') return;

        const results = searchExerciseDatabase(query, selectedCategory);
        if (results.length === 0) {
            exerciseListContainer.innerHTML = `<div style="text-align: center; padding: 16px; color: var(--text-muted);">No exercises found.</div>`;
            return;
        }

        exerciseListContainer.innerHTML = results.map(ex => {
            const isSelected = selectedExercise && selectedExercise.id === ex.id;
            return `
                <div class="food-select-item ${isSelected ? 'selected' : ''}" data-ex-id="${ex.id}">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="${ex.icon}" style="color: var(--primary-blue); font-size: 16px;"></i>
                        <div>
                            <strong style="font-size: 14px; color: var(--text-main);">${ex.name}</strong>
                            <span style="font-size: 12px; color: var(--text-muted); display: block;">~${ex.calsPerMinute} kcal/min (Moderate)</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        exerciseListContainer.querySelectorAll('.food-select-item').forEach(item => {
            item.addEventListener('click', () => {
                const exId = item.getAttribute('data-ex-id');
                const ex = EXERCISE_DATABASE.find(x => x.id === exId);
                if (ex) selectExercise(ex);
            });
        });
    }

    function selectExercise(ex) {
        selectedExercise = ex;
        document.querySelectorAll('#exercise-list-container .food-select-item').forEach(el => {
            el.classList.toggle('selected', el.getAttribute('data-ex-id') === ex.id);
        });

        if (exerciseDetails) exerciseDetails.classList.remove('hidden');
        if (selectedExerciseName) selectedExerciseName.textContent = ex.name;
        if (exerciseDuration) exerciseDuration.value = ex.defaultDuration || 30;
        if (confirmAddExerciseBtn) confirmAddExerciseBtn.disabled = false;

        calculateBurn();
    }

    function calculateBurn() {
        if (!selectedExercise) return;
        const dur = parseFloat(exerciseDuration?.value) || 30;
        const intensity = exerciseIntensity?.value || 'moderate';

        let intensityMult = 1.0;
        if (intensity === 'light') intensityMult = 0.8;
        if (intensity === 'vigorous') intensityMult = 1.35;

        const totalCals = Math.round(dur * selectedExercise.calsPerMinute * intensityMult);
        if (calculatedCalsPreview) calculatedCalsPreview.textContent = `-${totalCals} kcal`;
        return totalCals;
    }

    exerciseDuration?.addEventListener('input', calculateBurn);
    exerciseIntensity?.addEventListener('change', calculateBurn);

    // Confirm Add Exercise
    confirmAddExerciseBtn?.addEventListener('click', () => {
        if (!selectedExercise) return;

        const dur = parseFloat(exerciseDuration?.value) || 30;
        const intensity = exerciseIntensity?.value || 'moderate';
        const burned = calculateBurn();
        const dateStr = currentDate.toISOString().split('T')[0];

        const currentUser = auth.getCurrentUser();
        const newWorkout = {
            id: `ex-${Date.now()}`,
            date: dateStr,
            exerciseId: selectedExercise.id,
            duration: dur,
            intensity: intensity,
            caloriesBurned: burned
        };

        if (!currentUser.data.exercise) currentUser.data.exercise = [];
        currentUser.data.exercise.push(newWorkout);
        auth.updateUser(currentUser);

        addExerciseModal.classList.remove('show');
        updateExerciseForDate();
        showToast(`Logged ${selectedExercise.name} (-${burned} kcal)!`, 'success');
    });

    // Date Navigation
    prevDayBtn?.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateExerciseForDate();
    });

    nextDayBtn?.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateExerciseForDate();
    });

    // Initial Load
    updateExerciseForDate();
});