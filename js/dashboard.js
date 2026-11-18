/**
 * Dashboard script powering the MyFitnessPal dashboard:
 * - Calorie equation calculations
 * - Macronutrient distribution chart and progress meters
 * - Interactive 8-glass water tracking widget
 * - Weight modal logging
 * - Recent meal and workout displays
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    if (!user) return;

    let macroChartInstance = null;
    const todayStr = new Date().toISOString().split('T')[0];

    // --- DOM Elements ---
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarName = document.getElementById('sidebar-name');
    const streakDaysCount = document.getElementById('streak-days-count');
    const todayDateBadge = document.getElementById('today-date-badge');
    
    // Calorie Equation
    const calorieGoalEl = document.getElementById('calorie-goal');
    const caloriesConsumedEl = document.getElementById('calories-consumed');
    const caloriesBurnedEl = document.getElementById('calories-burned');
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const calorieProgressEl = document.getElementById('calorie-progress');
    const caloriePercentText = document.getElementById('calorie-percent-text');

    // Macros
    const macroCenterCals = document.getElementById('macro-center-cals');
    const carbsConsumedEl = document.getElementById('carbs-consumed');
    const carbsGoalEl = document.getElementById('carbs-goal');
    const carbsProgressEl = document.getElementById('carbs-progress');
    const carbsGoalPct = document.getElementById('carbs-goal-pct');

    const proteinConsumedEl = document.getElementById('protein-consumed');
    const proteinGoalEl = document.getElementById('protein-goal');
    const proteinProgressEl = document.getElementById('protein-progress');
    const proteinGoalPct = document.getElementById('protein-goal-pct');

    const fatConsumedEl = document.getElementById('fat-consumed');
    const fatGoalEl = document.getElementById('fat-goal');
    const fatProgressEl = document.getElementById('fat-progress');
    const fatGoalPct = document.getElementById('fat-goal-pct');

    // Water Tracker
    const waterGlassesContainer = document.getElementById('water-glasses-container');
    const waterGlassesCount = document.getElementById('water-glasses-count');
    const waterMlCount = document.getElementById('water-ml-count');
    const waterPlusBtn = document.getElementById('water-plus-btn');
    const waterMinusBtn = document.getElementById('water-minus-btn');
    const quickAddWaterBtn = document.getElementById('quick-add-water-btn');

    // Weight & Modals
    const currentWeightBadge = document.getElementById('current-weight-badge');
    const openWeightModalBtn = document.getElementById('open-weight-modal-btn');
    const addWeightModal = document.getElementById('add-weight-modal');
    const addWeightForm = document.getElementById('add-weight-form');
    const weightInput = document.getElementById('weight-input');

    // Entries
    const recentFoodEntries = document.getElementById('recent-food-entries');
    const recentExerciseEntries = document.getElementById('recent-exercise-entries');

    /**
     * Updates and renders the complete dashboard
     */
    function renderDashboard() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        // User profile & sidebar
        if (sidebarAvatar && currentUser.profile.avatar) {
            sidebarAvatar.src = currentUser.profile.avatar;
        }
        if (sidebarName) {
            sidebarName.textContent = currentUser.profile.displayName || currentUser.username;
        }
        if (streakDaysCount) {
            streakDaysCount.textContent = currentUser.streak || 14;
        }
        if (todayDateBadge) {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            todayDateBadge.innerHTML = `<i class="far fa-calendar"></i> Today, ${new Date().toLocaleDateString('en-US', options)}`;
        }
        if (currentWeightBadge) {
            currentWeightBadge.textContent = `${currentUser.goals.currentWeight.toFixed(1)} kg`;
        }

        // Calculations for today
        const foodToday = (currentUser.data.food || []).filter(f => f.date === todayStr);
        const exerciseToday = (currentUser.data.exercise || []).filter(e => e.date === todayStr);

        let totalCalsConsumed = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;

        foodToday.forEach(entry => {
            const food = (typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []).find(f => f.id === entry.foodId);
            if (food) {
                totalCalsConsumed += (food.nutrition.calories * entry.servings);
                totalCarbs += (food.nutrition.carbs * entry.servings);
                totalProtein += (food.nutrition.protein * entry.servings);
                totalFat += (food.nutrition.fat * entry.servings);
            }
        });

        const totalCalsBurned = exerciseToday.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
        const dailyCalGoal = currentUser.goals.dailyCalories || 2100;
        const netCalories = totalCalsConsumed - totalCalsBurned;
        const calsRemaining = dailyCalGoal - totalCalsConsumed + totalCalsBurned;

        // Populate Calorie Equation
        if (calorieGoalEl) calorieGoalEl.textContent = dailyCalGoal.toLocaleString();
        if (caloriesConsumedEl) caloriesConsumedEl.textContent = Math.round(totalCalsConsumed).toLocaleString();
        if (caloriesBurnedEl) caloriesBurnedEl.textContent = Math.round(totalCalsBurned).toLocaleString();
        if (caloriesRemainingEl) {
            caloriesRemainingEl.textContent = Math.round(calsRemaining).toLocaleString();
            caloriesRemainingEl.style.color = calsRemaining >= 0 ? 'var(--primary-blue)' : 'var(--danger)';
        }

        const calPct = Math.round((totalCalsConsumed / dailyCalGoal) * 100);
        if (calorieProgressEl) {
            calorieProgressEl.style.width = `${Math.min(calPct, 100)}%`;
            calorieProgressEl.style.background = calPct > 105 ? 'var(--danger)' : 'linear-gradient(90deg, var(--primary-blue), var(--accent-cyan))';
        }
        if (caloriePercentText) {
            caloriePercentText.textContent = `${calPct}% of daily budget logged`;
        }

        // Calculate macro goals in grams
        const macroPct = currentUser.goals.macros || { carbs: 45, protein: 30, fat: 25 };
        const carbsGoalGrams = Math.round((dailyCalGoal * (macroPct.carbs / 100)) / 4);
        const proteinGoalGrams = Math.round((dailyCalGoal * (macroPct.protein / 100)) / 4);
        const fatGoalGrams = Math.round((dailyCalGoal * (macroPct.fat / 100)) / 9);

        if (macroCenterCals) macroCenterCals.textContent = Math.round(totalCalsConsumed);

        if (carbsConsumedEl) carbsConsumedEl.textContent = Math.round(totalCarbs);
        if (carbsGoalEl) carbsGoalEl.textContent = carbsGoalGrams;
        if (carbsGoalPct) carbsGoalPct.textContent = `${macroPct.carbs}%`;
        if (carbsProgressEl) {
            const carbsPct = Math.min(Math.round((totalCarbs / carbsGoalGrams) * 100), 100);
            carbsProgressEl.style.width = `${carbsPct}%`;
        }

        if (proteinConsumedEl) proteinConsumedEl.textContent = Math.round(totalProtein);
        if (proteinGoalEl) proteinGoalEl.textContent = proteinGoalGrams;
        if (proteinGoalPct) proteinGoalPct.textContent = `${macroPct.protein}%`;
        if (proteinProgressEl) {
            const proteinPct = Math.min(Math.round((totalProtein / proteinGoalGrams) * 100), 100);
            proteinProgressEl.style.width = `${proteinPct}%`;
        }

        if (fatConsumedEl) fatConsumedEl.textContent = Math.round(totalFat);
        if (fatGoalEl) fatGoalEl.textContent = fatGoalGrams;
        if (fatGoalPct) fatGoalPct.textContent = `${macroPct.fat}%`;
        if (fatProgressEl) {
            const fatPct = Math.min(Math.round((totalFat / fatGoalGrams) * 100), 100);
            fatProgressEl.style.width = `${fatPct}%`;
        }

        // Render Macro Doughnut Chart
        renderMacroDoughnut(totalCarbs, totalProtein, totalFat);

        // Render Water Tracker
        renderWaterTracker(currentUser);

        // Render Recent Meals
        renderRecentMeals(foodToday);

        // Render Recent Exercises
        renderRecentExercises(exerciseToday);
    }

    /**
     * Renders Chart.js Doughnut Chart for Macros
     */
    function renderMacroDoughnut(carbs, protein, fat) {
        const canvas = document.getElementById('macro-chart');
        if (!canvas) return;

        const total = carbs + protein + fat;
        const data = total > 0 ? [carbs, protein, fat] : [1, 1, 1];
        const colors = total > 0 ? ['#10b981', '#f59e0b', '#8b5cf6'] : ['#e2e8f0', '#e2e8f0', '#e2e8f0'];

        if (macroChartInstance) {
            macroChartInstance.data.datasets[0].data = data;
            macroChartInstance.data.datasets[0].backgroundColor = colors;
            macroChartInstance.update();
        } else {
            macroChartInstance = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Carbs', 'Protein', 'Fat'],
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 3,
                        borderColor: '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => ` ${context.label}: ${Math.round(context.raw)}g`
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Renders 8 Interactive Water Glasses
     */
    function renderWaterTracker(currentUser) {
        if (!waterGlassesContainer) return;

        if (!currentUser.data.water) currentUser.data.water = {};
        const glassesLogged = currentUser.data.water[todayStr] !== undefined ? currentUser.data.water[todayStr] : 6;
        const totalGlasses = 8;

        if (waterGlassesCount) waterGlassesCount.textContent = glassesLogged;
        if (waterMlCount) waterMlCount.textContent = (glassesLogged * 250).toLocaleString();

        waterGlassesContainer.innerHTML = '';
        for (let i = 1; i <= totalGlasses; i++) {
            const isFilled = i <= glassesLogged;
            const glass = document.createElement('div');
            glass.className = `water-glass-icon ${isFilled ? 'filled' : ''}`;
            glass.title = `Glass ${i} (250 ml)`;
            glass.innerHTML = `<i class="fas fa-tint"></i>`;
            glass.addEventListener('click', () => {
                const newCount = (i === glassesLogged) ? i - 1 : i;
                updateWaterCount(newCount);
            });
            waterGlassesContainer.appendChild(glass);
        }
    }

    function updateWaterCount(count) {
        const currentUser = auth.getCurrentUser();
        const safeCount = Math.max(0, Math.min(12, count));
        currentUser.data.water[todayStr] = safeCount;
        auth.updateUser(currentUser);
        renderWaterTracker(currentUser);
        showToast(`Water updated: ${safeCount} glasses (${safeCount * 250} ml)`, 'success');
    }

    if (waterPlusBtn) {
        waterPlusBtn.addEventListener('click', () => {
            const u = auth.getCurrentUser();
            const current = u.data.water[todayStr] || 0;
            updateWaterCount(current + 1);
        });
    }

    if (waterMinusBtn) {
        waterMinusBtn.addEventListener('click', () => {
            const u = auth.getCurrentUser();
            const current = u.data.water[todayStr] || 0;
            updateWaterCount(current - 1);
        });
    }

    if (quickAddWaterBtn) {
        quickAddWaterBtn.addEventListener('click', () => {
            const u = auth.getCurrentUser();
            const current = u.data.water[todayStr] || 0;
            updateWaterCount(current + 1);
        });
    }

    /**
     * Renders Today's Meals in Recent Box
     */
    function renderRecentMeals(foodEntries) {
        if (!recentFoodEntries) return;

        if (foodEntries.length === 0) {
            recentFoodEntries.innerHTML = `
                <div class="empty-meal-state">
                    <i class="fas fa-utensils" style="font-size: 28px; margin-bottom: 8px; opacity: 0.4;"></i>
                    <p>No meals logged yet today.</p>
                    <a href="food-diary.html" class="btn btn-sm btn-primary mt-2">Open Food Diary</a>
                </div>
            `;
            return;
        }

        recentFoodEntries.innerHTML = foodEntries.slice(0, 5).map(entry => {
            const food = (typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []).find(f => f.id === entry.foodId);
            if (!food) return '';
            const cals = Math.round(food.nutrition.calories * entry.servings);
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-light);">
                    <div>
                        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--primary-blue);">${entry.meal}</div>
                        <strong style="font-size: 13px; color: var(--text-main);">${food.name}</strong>
                        <div style="font-size: 11px; color: var(--text-muted);">${entry.servings} × ${food.serving.unit}</div>
                    </div>
                    <div style="font-size: 14px; font-weight: 800; color: var(--navy-deep);">${cals} kcal</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Renders Today's Workouts in Recent Box
     */
    function renderRecentExercises(exercises) {
        if (!recentExerciseEntries) return;

        if (exercises.length === 0) {
            recentExerciseEntries.innerHTML = `
                <div class="empty-meal-state">
                    <i class="fas fa-running" style="font-size: 28px; margin-bottom: 8px; opacity: 0.4;"></i>
                    <p>No workouts recorded today.</p>
                    <a href="exercise.html" class="btn btn-sm btn-primary mt-2">Log an Exercise</a>
                </div>
            `;
            return;
        }

        recentExerciseEntries.innerHTML = exercises.map(ex => {
            const exInfo = (typeof EXERCISE_DATABASE !== 'undefined' ? EXERCISE_DATABASE : []).find(e => e.id === ex.exerciseId) || { name: 'Workout', icon: 'fas fa-dumbbell' };
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-light);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: #ecfdf5; color: var(--success); display: flex; align-items: center; justify-content: center;">
                            <i class="${exInfo.icon || 'fas fa-fire'}"></i>
                        </div>
                        <div>
                            <strong style="font-size: 13px; color: var(--text-main);">${exInfo.name}</strong>
                            <div style="font-size: 11px; color: var(--text-muted);">${ex.duration} minutes • ${ex.intensity || 'moderate'}</div>
                        </div>
                    </div>
                    <div style="font-size: 14px; font-weight: 800; color: var(--success);">-${ex.caloriesBurned} kcal</div>
                </div>
            `;
        }).join('');
    }

    // --- Add Weight Modal Handlers ---
    if (openWeightModalBtn && addWeightModal) {
        openWeightModalBtn.addEventListener('click', () => {
            const currentUser = auth.getCurrentUser();
            if (weightInput) weightInput.value = currentUser.goals.currentWeight || 68.2;
            addWeightModal.classList.add('show');
        });

        addWeightModal.querySelectorAll('.modal-close, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', () => addWeightModal.classList.remove('show'));
        });

        addWeightModal.addEventListener('click', (e) => {
            if (e.target === addWeightModal) addWeightModal.classList.remove('show');
        });

        if (addWeightForm) {
            addWeightForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newWeight = parseFloat(weightInput.value);
                const notes = document.getElementById('weight-notes')?.value || 'Daily check-in';
                if (!newWeight || isNaN(newWeight)) return;

                const currentUser = auth.getCurrentUser();
                currentUser.goals.currentWeight = newWeight;
                
                const existingIndex = currentUser.data.weight.findIndex(w => w.date === todayStr);
                if (existingIndex !== -1) {
                    currentUser.data.weight[existingIndex].value = newWeight;
                    currentUser.data.weight[existingIndex].notes = notes;
                } else {
                    currentUser.data.weight.push({ date: todayStr, value: newWeight, notes });
                }

                auth.updateUser(currentUser);
                addWeightModal.classList.remove('show');
                renderDashboard();
                showToast(`Logged weight: ${newWeight.toFixed(1)} kg!`, 'success');
            });
        }
    }

    // Initial Dashboard Render
    renderDashboard();
});