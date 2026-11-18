/**
 * Goals script powering weight projections, BMR calculations,
 * and macronutrient ratio splits with live gram converters.
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    if (!user) return;

    let macroChartInstance = null;

    // Weight Elements
    const weightGoalForm = document.getElementById('weight-goal-form');
    const currentWeightInput = document.getElementById('current-weight');
    const goalWeightInput = document.getElementById('goal-weight');
    const weeklyGoalSelect = document.getElementById('weekly-goal');
    const goalWeightDisplay = document.getElementById('goal-weight-display');
    const goalDateDisplay = document.getElementById('goal-date');

    // Nutrition Elements
    const nutritionGoalForm = document.getElementById('nutrition-goal-form');
    const dailyCaloriesInput = document.getElementById('daily-calories-input');
    const carbsPercentInput = document.getElementById('carbs-percent');
    const proteinPercentInput = document.getElementById('protein-percent');
    const fatPercentInput = document.getElementById('fat-percent');
    const carbsGramsCalc = document.getElementById('carbs-grams-calc');
    const proteinGramsCalc = document.getElementById('protein-grams-calc');
    const fatGramsCalc = document.getElementById('fat-grams-calc');
    const macrosTotalDisplay = document.getElementById('macros-total');
    const macroError = document.getElementById('macro-error');
    const saveNutritionBtn = document.getElementById('save-nutrition-btn');

    // Exercise Elements
    const exerciseGoalForm = document.getElementById('exercise-goal-form');
    const weeklyExerciseSelect = document.getElementById('weekly-exercise');

    function loadUserGoals() {
        const goals = user.goals || {};

        if (currentWeightInput) currentWeightInput.value = goals.currentWeight || 68.2;
        if (goalWeightInput) goalWeightInput.value = goals.goalWeight || 65.0;
        if (weeklyGoalSelect) weeklyGoalSelect.value = goals.weeklyGoal !== undefined ? goals.weeklyGoal : 0.5;

        if (dailyCaloriesInput) dailyCaloriesInput.value = goals.dailyCalories || 2100;
        if (carbsPercentInput) carbsPercentInput.value = (goals.macros && goals.macros.carbs) || 45;
        if (proteinPercentInput) proteinPercentInput.value = (goals.macros && goals.macros.protein) || 30;
        if (fatPercentInput) fatPercentInput.value = (goals.macros && goals.macros.fat) || 25;

        if (weeklyExerciseSelect) weeklyExerciseSelect.value = goals.weeklyExercise || 4;

        updateWeightGoalSummary();
        updateMacroInputs();
    }

    function updateWeightGoalSummary() {
        const currentWeight = parseFloat(currentWeightInput?.value) || 68.2;
        const goalWeight = parseFloat(goalWeightInput?.value) || 65.0;
        const weeklyGoalRate = parseFloat(weeklyGoalSelect?.value) || 0.5;

        if (goalWeightDisplay) goalWeightDisplay.textContent = goalWeight.toFixed(1);

        if (weeklyGoalRate !== 0 && currentWeight > 0 && goalWeight > 0) {
            const diff = Math.abs(currentWeight - goalWeight);
            const weeksNeeded = diff / Math.abs(weeklyGoalRate);

            if (weeksNeeded > 0 && weeksNeeded < 520) {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + Math.round(weeksNeeded * 7));
                const options = { month: 'long', day: 'numeric', year: 'numeric' };
                if (goalDateDisplay) goalDateDisplay.textContent = targetDate.toLocaleDateString('en-US', options);
            }
        }
    }

    function updateMacroInputs() {
        const cals = parseInt(dailyCaloriesInput?.value) || 2100;
        const carbs = parseInt(carbsPercentInput?.value) || 0;
        const protein = parseInt(proteinPercentInput?.value) || 0;
        const fat = parseInt(fatPercentInput?.value) || 0;
        const total = carbs + protein + fat;

        const carbsGrams = Math.round((cals * (carbs / 100)) / 4);
        const proteinGrams = Math.round((cals * (protein / 100)) / 4);
        const fatGrams = Math.round((cals * (fat / 100)) / 9);

        if (carbsGramsCalc) carbsGramsCalc.textContent = `${carbsGrams}g`;
        if (proteinGramsCalc) proteinGramsCalc.textContent = `${proteinGrams}g`;
        if (fatGramsCalc) fatGramsCalc.textContent = `${fatGrams}g`;

        if (macrosTotalDisplay) {
            macrosTotalDisplay.textContent = `${total}%`;
            macrosTotalDisplay.style.color = total === 100 ? 'var(--success)' : 'var(--danger)';
        }

        if (macroError) {
            if (total !== 100) {
                macroError.classList.remove('hidden');
                if (saveNutritionBtn) saveNutritionBtn.disabled = true;
            } else {
                macroError.classList.add('hidden');
                if (saveNutritionBtn) saveNutritionBtn.disabled = false;
            }
        }

        renderMacroChart(carbs, protein, fat);
    }

    function renderMacroChart(carbs, protein, fat) {
        const canvas = document.getElementById('macros-chart');
        if (!canvas) return;

        const data = [carbs, protein, fat];
        const colors = ['#10b981', '#f59e0b', '#8b5cf6'];

        if (macroChartInstance) {
            macroChartInstance.data.datasets[0].data = data;
            macroChartInstance.update();
        } else {
            macroChartInstance = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Carbs', 'Protein', 'Fat'],
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    [currentWeightInput, goalWeightInput, weeklyGoalSelect].forEach(el => {
        el?.addEventListener('input', updateWeightGoalSummary);
        el?.addEventListener('change', updateWeightGoalSummary);
    });

    [dailyCaloriesInput, carbsPercentInput, proteinPercentInput, fatPercentInput].forEach(el => {
        el?.addEventListener('input', updateMacroInputs);
    });

    weightGoalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = auth.getCurrentUser();
        currentUser.goals.currentWeight = parseFloat(currentWeightInput.value);
        currentUser.goals.goalWeight = parseFloat(goalWeightInput.value);
        currentUser.goals.weeklyGoal = parseFloat(weeklyGoalSelect.value);
        auth.updateUser(currentUser);
        showToast('Weight goals successfully saved!', 'success');
    });

    nutritionGoalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = auth.getCurrentUser();
        currentUser.goals.dailyCalories = parseInt(dailyCaloriesInput.value);
        currentUser.goals.macros = {
            carbs: parseInt(carbsPercentInput.value),
            protein: parseInt(proteinPercentInput.value),
            fat: parseInt(fatPercentInput.value)
        };
        auth.updateUser(currentUser);
        showToast('Nutrition targets & macros updated!', 'success');
    });

    exerciseGoalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = auth.getCurrentUser();
        currentUser.goals.weeklyExercise = parseInt(weeklyExerciseSelect.value);
        auth.updateUser(currentUser);
        showToast('Weekly fitness target saved!', 'success');
    });

    loadUserGoals();
});