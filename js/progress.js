/**
 * Progress script for MyFitnessPal:
 * - Time-filtered weight tracking line chart with trendline
 * - Daily calorie intake bar chart
 * - Exercise energy burned chart
 * - Macro average statistics
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('progress-chart-container')) return;

    const user = auth.getCurrentUser();
    if (!user) return;

    let weightChartInstance = null;
    let nutritionChartInstance = null;
    let exerciseChartInstance = null;

    const dateRangeSelect = document.getElementById('date-range');
    const startingWeightEl = document.getElementById('starting-weight');
    const currentWeightDisplayEl = document.getElementById('current-weight-display');
    const goalWeightDisplayEl = document.getElementById('goal-weight-display');
    const weightChangeEl = document.getElementById('weight-change');

    const nutritionTitleEl = document.getElementById('nutrition-title');
    const avgCaloriesEl = document.getElementById('avg-calories');
    const avgCarbsEl = document.getElementById('avg-carbs');
    const avgProteinEl = document.getElementById('avg-protein');
    const avgFatEl = document.getElementById('avg-fat');

    const totalWorkoutsEl = document.getElementById('total-workouts');
    const totalMinutesEl = document.getElementById('total-minutes');
    const totalCaloriesBurnedEl = document.getElementById('total-calories-burned');

    function updateProgressView() {
        const currentUser = auth.getCurrentUser();
        const rangeDays = parseInt(dateRangeSelect.value) || 30;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (rangeDays - 1));

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        // Filter user data
        const weightData = (currentUser.data.weight || []).filter(d => d.date >= startStr && d.date <= endStr);
        const foodData = (currentUser.data.food || []).filter(d => d.date >= startStr && d.date <= endStr);
        const exerciseData = (currentUser.data.exercise || []).filter(d => d.date >= startStr && d.date <= endStr);

        renderWeightSection(currentUser, weightData);
        renderNutritionSection(foodData, rangeDays);
        renderExerciseSection(exerciseData);
    }

    function renderWeightSection(currentUser, weightData) {
        const allWeights = [...(currentUser.data.weight || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
        const startW = allWeights.length > 0 ? allWeights[0].value : 72.5;
        const currentW = currentUser.goals.currentWeight || (allWeights.length > 0 ? allWeights[allWeights.length - 1].value : 68.2);
        const goalW = currentUser.goals.goalWeight || 65.0;
        const diff = currentW - startW;

        if (startingWeightEl) startingWeightEl.textContent = `${startW.toFixed(1)} kg`;
        if (currentWeightDisplayEl) currentWeightDisplayEl.textContent = `${currentW.toFixed(1)} kg`;
        if (goalWeightDisplayEl) goalWeightDisplayEl.textContent = `${goalW.toFixed(1)} kg`;

        if (weightChangeEl) {
            weightChangeEl.textContent = `${diff <= 0 ? '' : '+'}${diff.toFixed(1)} kg`;
            weightChangeEl.style.color = diff <= 0 ? 'var(--success)' : 'var(--danger)';
        }

        // Prepare chart labels and data
        const sortedPeriodWeights = [...weightData].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedPeriodWeights.map(d => {
            const dt = new Date(d.date + 'T00:00:00');
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const points = sortedPeriodWeights.map(d => d.value);

        const canvas = document.getElementById('weight-chart');
        if (!canvas) return;

        if (weightChartInstance) {
            weightChartInstance.data.labels = labels;
            weightChartInstance.data.datasets[0].data = points;
            weightChartInstance.update();
        } else {
            weightChartInstance = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Weight (kg)',
                        data: points,
                        borderColor: '#0066ee',
                        backgroundColor: 'rgba(0, 102, 238, 0.08)',
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#0066ee',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` ${ctx.parsed.y.toFixed(1)} kg`
                            }
                        }
                    },
                    scales: {
                        y: {
                            min: Math.min(...points, goalW) - 1,
                            max: Math.max(...points, startW) + 1,
                            grid: { color: '#f1f5f9' },
                            ticks: {
                                callback: (val) => `${val} kg`
                            }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }

    function renderNutritionSection(foodData, rangeDays) {
        let totalCals = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;

        const dailyMap = {};

        foodData.forEach(entry => {
            const food = (typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []).find(f => f.id === entry.foodId);
            if (food) {
                const cals = food.nutrition.calories * entry.servings;
                totalCals += cals;
                totalCarbs += ((food.nutrition.carbs || 0) * entry.servings);
                totalProtein += ((food.nutrition.protein || 0) * entry.servings);
                totalFat += ((food.nutrition.fat || 0) * entry.servings);

                dailyMap[entry.date] = (dailyMap[entry.date] || 0) + cals;
            }
        });

        const distinctDays = Math.max(1, Object.keys(dailyMap).length);
        const avgCals = Math.round(totalCals / distinctDays);
        const avgCarbs = Math.round(totalCarbs / distinctDays);
        const avgProtein = Math.round(totalProtein / distinctDays);
        const avgFat = Math.round(totalFat / distinctDays);

        if (avgCaloriesEl) avgCaloriesEl.textContent = `${avgCals} kcal`;
        if (avgCarbsEl) avgCarbsEl.textContent = `${avgCarbs}g`;
        if (avgProteinEl) avgProteinEl.textContent = `${avgProtein}g`;
        if (avgFatEl) avgFatEl.textContent = `${avgFat}g`;
        if (nutritionTitleEl) nutritionTitleEl.textContent = `Avg across active days: ${avgCals} kcal/day`;

        const datesSorted = Object.keys(dailyMap).sort();
        const labels = datesSorted.map(d => {
            const dt = new Date(d + 'T00:00:00');
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const calsValues = datesSorted.map(d => Math.round(dailyMap[d]));

        const canvas = document.getElementById('nutrition-chart');
        if (!canvas) return;

        if (nutritionChartInstance) {
            nutritionChartInstance.data.labels = labels;
            nutritionChartInstance.data.datasets[0].data = calsValues;
            nutritionChartInstance.update();
        } else {
            nutritionChartInstance = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Calories Consumed',
                        data: calsValues,
                        backgroundColor: '#0066ee',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' },
                            ticks: { callback: (v) => `${v} kcal` }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }

    function renderExerciseSection(exerciseData) {
        const uniqueWorkoutDays = new Set(exerciseData.map(e => e.date)).size;
        const totalMins = exerciseData.reduce((s, e) => s + (e.duration || 0), 0);
        const totalBurned = exerciseData.reduce((s, e) => s + (e.caloriesBurned || 0), 0);

        if (totalWorkoutsEl) totalWorkoutsEl.textContent = uniqueWorkoutDays;
        if (totalMinutesEl) totalMinutesEl.textContent = `${totalMins} min`;
        if (totalCaloriesBurnedEl) totalCaloriesBurnedEl.textContent = `${totalBurned} kcal`;

        const dailyBurnMap = {};
        exerciseData.forEach(e => {
            dailyBurnMap[e.date] = (dailyBurnMap[e.date] || 0) + (e.caloriesBurned || 0);
        });

        const datesSorted = Object.keys(dailyBurnMap).sort();
        const labels = datesSorted.map(d => {
            const dt = new Date(d + 'T00:00:00');
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const burnValues = datesSorted.map(d => dailyBurnMap[d]);

        const canvas = document.getElementById('exercise-chart');
        if (!canvas) return;

        if (exerciseChartInstance) {
            exerciseChartInstance.data.labels = labels;
            exerciseChartInstance.data.datasets[0].data = burnValues;
            exerciseChartInstance.update();
        } else {
            exerciseChartInstance = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Calories Burned',
                        data: burnValues,
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' },
                            ticks: { callback: (v) => `${v} kcal` }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }

    dateRangeSelect?.addEventListener('change', updateProgressView);
    updateProgressView();
});