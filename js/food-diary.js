/**
 * Food Diary script powering MyFitnessPal diary:
 * - Date navigation and date-specific food rendering
 * - Granular meal breakdown (Breakfast, Lunch, Dinner, Snacks) with full macros
 * - Real-time food search modal with categories
 * - Serving multiplier with live FDA Nutrition Facts preview
 * - Barcode scan simulation
 * - Custom food creation
 * - Daily grand nutrition totals calculation (consumed vs goal vs remaining)
 * - 5-week weight projection completion calculation
 */

document.addEventListener('DOMContentLoaded', () => {
    let user = auth.getCurrentUser() || auth.ensureDemoUser();

    let currentDate = new Date();
    let currentMeal = 'Breakfast';
    let selectedFood = null;
    let selectedCategory = 'all';

    // --- DOM Elements ---
    const currentDateDisplay = document.getElementById('current-date-display');
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');

    // Equation summary elements
    const diaryCalGoal = document.getElementById('diary-cal-goal');
    const diaryCalsConsumed = document.getElementById('diary-cals-consumed');
    const diaryCalsBurned = document.getElementById('diary-cals-burned');
    const diaryCalsRemaining = document.getElementById('diary-cals-remaining');

    // Totals Table Elements
    const totalCalsEl = document.getElementById('total-calories');
    const totalCarbsEl = document.getElementById('total-carbs');
    const totalFatEl = document.getElementById('total-fat');
    const totalProteinEl = document.getElementById('total-protein');
    const totalSodiumEl = document.getElementById('total-sodium');
    const totalSugarEl = document.getElementById('total-sugar');

    const goalCalsEl = document.getElementById('goal-calories');
    const goalCarbsEl = document.getElementById('goal-carbs');
    const goalFatEl = document.getElementById('goal-fat');
    const goalProteinEl = document.getElementById('goal-protein');
    const goalSodiumEl = document.getElementById('goal-sodium');
    const goalSugarEl = document.getElementById('goal-sugar');

    const remainingCalsEl = document.getElementById('remaining-calories');
    const remainingCarbsEl = document.getElementById('remaining-carbs');
    const remainingFatEl = document.getElementById('remaining-fat');
    const remainingProteinEl = document.getElementById('remaining-protein');
    const remainingSodiumEl = document.getElementById('remaining-sodium');
    const remainingSugarEl = document.getElementById('remaining-sugar');

    // Add Food Modal Elements
    const addFoodModal = document.getElementById('add-food-modal');
    const modalMealName = document.getElementById('modal-meal-name');
    const modalFoodSearch = document.getElementById('modal-food-search');
    const modalFoodResults = document.getElementById('modal-food-results');
    const foodDetailPanel = document.getElementById('food-detail-panel');
    const servingsMultiplier = document.getElementById('servings-multiplier');
    const confirmLogFoodBtn = document.getElementById('confirm-log-food-btn');

    // FDA Label Elements
    const panelFoodName = document.getElementById('panel-food-name');
    const panelFoodBrand = document.getElementById('panel-food-brand');
    const nfServingSize = document.getElementById('nf-serving-size');
    const nfCaloriesAmount = document.getElementById('nf-calories-amount');
    const nfFat = document.getElementById('nf-fat');
    const nfSodium = document.getElementById('nf-sodium');
    const nfCarbs = document.getElementById('nf-carbs');
    const nfFiber = document.getElementById('nf-fiber');
    const nfSugar = document.getElementById('nf-sugar');
    const nfProtein = document.getElementById('nf-protein');

    // Complete Diary Modal
    const completeDiaryBtn = document.getElementById('complete-diary-btn');
    const completionModal = document.getElementById('completion-modal');
    const completionText = document.getElementById('completion-text');
    const projectedWeightDisplay = document.getElementById('projected-weight-display');

    /**
     * Updates and renders the food diary for the currently selected date
     */
    function updateDiaryForCurrentDate() {
        const currentUser = auth.getCurrentUser();
        const dateStr = currentDate.toISOString().split('T')[0];
        const isToday = new Date().toDateString() === currentDate.toDateString();

        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        currentDateDisplay.textContent = isToday ? `Today, ${currentDate.toLocaleDateString('en-US', options)}` : currentDate.toLocaleDateString('en-US', options);

        const foodForDate = (currentUser.data.food || []).filter(f => f.date === dateStr);
        const exerciseForDate = (currentUser.data.exercise || []).filter(e => e.date === dateStr);

        renderMealTables(foodForDate);
        renderDiaryTotals(foodForDate, exerciseForDate, currentUser);
    }

    /**
     * Renders meal tables: Breakfast, Lunch, Dinner, Snacks
     */
    function renderMealTables(foodEntries) {
        const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

        meals.forEach(meal => {
            const tbody = document.getElementById(`${meal.toLowerCase()}-entries`);
            const calBadge = document.getElementById(`${meal.toLowerCase()}-calories`);
            const subtotalText = document.getElementById(`${meal.toLowerCase()}-macro-subtotal`);

            if (!tbody) return;

            const entries = foodEntries.filter(e => e.meal === meal);
            let mealCals = 0;
            let mealCarbs = 0;
            let mealFat = 0;
            let mealProtein = 0;

            if (entries.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="empty-meal-state" style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">
                            No food logged for ${meal}. Click "+ Add Food" below to log.
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = entries.map(entry => {
                    const food = (typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []).find(f => f.id === entry.foodId);
                    if (!food) return '';

                    const cals = Math.round(food.nutrition.calories * entry.servings);
                    const carbs = Math.round((food.nutrition.carbs || 0) * entry.servings);
                    const fat = Math.round((food.nutrition.fat || 0) * entry.servings);
                    const protein = Math.round((food.nutrition.protein || 0) * entry.servings);
                    const sodium = Math.round((food.nutrition.sodium || 0) * entry.servings);
                    const sugar = Math.round((food.nutrition.sugar || 0) * entry.servings);

                    mealCals += cals;
                    mealCarbs += carbs;
                    mealFat += fat;
                    mealProtein += protein;

                    return `
                        <tr data-entry-id="${entry.id}">
                            <td>
                                <span class="food-row-name">${food.name}</span>
                                <span class="food-row-brand">${food.brand || 'Generic'} • ${food.serving.unit}</span>
                            </td>
                            <td class="text-right" style="font-weight: 600;">${entry.servings}</td>
                            <td class="text-right" style="font-weight: 800; color: var(--navy-deep);">${cals}</td>
                            <td class="text-right" style="color: var(--macro-carbs); font-weight: 600;">${carbs}g</td>
                            <td class="text-right" style="color: var(--macro-fat); font-weight: 600;">${fat}g</td>
                            <td class="text-right" style="color: var(--macro-protein); font-weight: 600;">${protein}g</td>
                            <td class="text-right" style="color: var(--text-muted);">${sodium}mg</td>
                            <td class="text-right">
                                <button class="delete-btn-ghost delete-entry-btn" data-id="${entry.id}" title="Remove entry">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            if (calBadge) calBadge.textContent = `${Math.round(mealCals)} kcal`;
            if (subtotalText) {
                subtotalText.innerHTML = `Subtotal: <strong>${Math.round(mealCals)} kcal</strong> • C: ${mealCarbs}g • F: ${mealFat}g • P: ${mealProtein}g`;
            }
        });

        // Attach delete listeners
        document.querySelectorAll('.delete-entry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const entryId = e.currentTarget.getAttribute('data-id');
                deleteFoodEntry(entryId);
            });
        });
    }

    /**
     * Deletes a food entry
     */
    function deleteFoodEntry(entryId) {
        const currentUser = auth.getCurrentUser();
        currentUser.data.food = currentUser.data.food.filter(f => f.id !== entryId);
        auth.updateUser(currentUser);
        updateDiaryForCurrentDate();
        showToast('Food entry removed from diary', 'success');
    }

    /**
     * Calculates and renders grand nutrition totals vs goals
     */
    function renderDiaryTotals(foodEntries, exerciseEntries, currentUser) {
        const dailyGoal = currentUser.goals.dailyCalories || 2100;
        const macroPct = currentUser.goals.macros || { carbs: 45, protein: 30, fat: 25 };

        const goalCarbs = Math.round((dailyGoal * (macroPct.carbs / 100)) / 4);
        const goalProtein = Math.round((dailyGoal * (macroPct.protein / 100)) / 4);
        const goalFat = Math.round((dailyGoal * (macroPct.fat / 100)) / 9);
        const goalSodium = 2300;
        const goalSugar = 50;

        let totalCals = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalProtein = 0;
        let totalSodium = 0;
        let totalSugar = 0;

        foodEntries.forEach(entry => {
            const food = (typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []).find(f => f.id === entry.foodId);
            if (food) {
                totalCals += (food.nutrition.calories * entry.servings);
                totalCarbs += ((food.nutrition.carbs || 0) * entry.servings);
                totalFat += ((food.nutrition.fat || 0) * entry.servings);
                totalProtein += ((food.nutrition.protein || 0) * entry.servings);
                totalSodium += ((food.nutrition.sodium || 0) * entry.servings);
                totalSugar += ((food.nutrition.sugar || 0) * entry.servings);
            }
        });

        const totalBurned = exerciseEntries.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
        const remainingCals = dailyGoal - totalCals + totalBurned;

        // Equation top banner
        if (diaryCalGoal) diaryCalGoal.textContent = dailyGoal.toLocaleString();
        if (diaryCalsConsumed) diaryCalsConsumed.textContent = Math.round(totalCals).toLocaleString();
        if (diaryCalsBurned) diaryCalsBurned.textContent = Math.round(totalBurned).toLocaleString();
        if (diaryCalsRemaining) {
            diaryCalsRemaining.textContent = `${Math.round(remainingCals).toLocaleString()} kcal`;
            diaryCalsRemaining.style.color = remainingCals >= 0 ? 'var(--accent-cyan)' : 'var(--danger)';
        }

        // Totals row
        if (totalCalsEl) totalCalsEl.textContent = Math.round(totalCals);
        if (totalCarbsEl) totalCarbsEl.textContent = Math.round(totalCarbs);
        if (totalFatEl) totalFatEl.textContent = Math.round(totalFat);
        if (totalProteinEl) totalProteinEl.textContent = Math.round(totalProtein);
        if (totalSodiumEl) totalSodiumEl.textContent = Math.round(totalSodium);
        if (totalSugarEl) totalSugarEl.textContent = Math.round(totalSugar);

        // Goal row
        if (goalCalsEl) goalCalsEl.textContent = dailyGoal;
        if (goalCarbsEl) goalCarbsEl.textContent = goalCarbs;
        if (goalFatEl) goalFatEl.textContent = goalFat;
        if (goalProteinEl) goalProteinEl.textContent = goalProtein;
        if (goalSodiumEl) goalSodiumEl.textContent = goalSodium;
        if (goalSugarEl) goalSugarEl.textContent = goalSugar;

        // Remaining row
        const remCarbs = goalCarbs - totalCarbs;
        const remFat = goalFat - totalFat;
        const remProtein = goalProtein - totalProtein;
        const remSodium = goalSodium - totalSodium;
        const remSugar = goalSugar - totalSugar;

        if (remainingCalsEl) {
            remainingCalsEl.textContent = Math.round(remainingCals);
            remainingCalsEl.style.color = remainingCals >= 0 ? 'var(--primary-blue)' : 'var(--danger)';
        }
        if (remainingCarbsEl) remainingCarbsEl.textContent = Math.round(remCarbs);
        if (remainingFatEl) remainingFatEl.textContent = Math.round(remFat);
        if (remainingProteinEl) remainingProteinEl.textContent = Math.round(remProtein);
        if (remainingSodiumEl) remainingSodiumEl.textContent = Math.round(remSodium);
        if (remainingSugarEl) remainingSugarEl.textContent = Math.round(remSugar);
    }

    // --- Date Navigation Events ---
    prevDayBtn?.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDiaryForCurrentDate();
    });

    nextDayBtn?.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDiaryForCurrentDate();
    });

    // --- Modal: Open for Meal ---
    document.querySelectorAll('.add-food-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentMeal = e.currentTarget.getAttribute('data-meal') || 'Breakfast';
            if (modalMealName) modalMealName.textContent = currentMeal;
            if (modalFoodSearch) modalFoodSearch.value = '';
            selectedFood = null;
            if (foodDetailPanel) foodDetailPanel.classList.add('hidden');
            if (confirmLogFoodBtn) confirmLogFoodBtn.disabled = true;
            renderModalFoodList();
            addFoodModal.classList.add('show');
        });
    });

    // Close modal
    addFoodModal?.querySelectorAll('.modal-close, .modal-close-btn').forEach(b => {
        b.addEventListener('click', () => addFoodModal.classList.remove('show'));
    });
    addFoodModal?.addEventListener('click', (e) => {
        if (e.target === addFoodModal) addFoodModal.classList.remove('show');
    });

    // Modal Tabs
    document.querySelectorAll('.modal-tab-btn').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.modal-tab-panel').forEach(p => p.classList.add('hidden'));

            tabBtn.classList.add('active');
            const tabId = `tab-${tabBtn.getAttribute('data-tab')}`;
            document.getElementById(tabId)?.classList.remove('hidden');
        });
    });

    // Food category pills inside modal
    document.querySelectorAll('.food-modal-pills .quick-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.food-modal-pills .quick-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedCategory = pill.getAttribute('data-category');
            renderModalFoodList(modalFoodSearch.value);
        });
    });

    // Live search inside modal
    modalFoodSearch?.addEventListener('input', (e) => {
        renderModalFoodList(e.target.value);
    });

    /**
     * Renders search results in Add Food modal
     */
    function renderModalFoodList(query = '') {
        if (!modalFoodResults || typeof searchFoodDatabase === 'undefined') return;

        const results = searchFoodDatabase(query, selectedCategory).slice(0, 15);
        if (results.length === 0) {
            modalFoodResults.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                    No items found matching "${query}".
                </div>
            `;
            return;
        }

        modalFoodResults.innerHTML = results.map(food => {
            const isSelected = selectedFood && selectedFood.id === food.id;
            return `
                <div class="food-select-item ${isSelected ? 'selected' : ''}" data-food-id="${food.id}">
                    <div>
                        <strong style="font-size: 14px; color: var(--text-main); display: block;">${food.name}</strong>
                        <span style="font-size: 12px; color: var(--text-muted);">${food.brand || 'Generic'} • ${food.serving.unit}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; font-size: 15px; color: var(--navy-deep);">${food.nutrition.calories} kcal</div>
                        <div style="font-size: 11px; color: var(--text-muted);">
                            C: ${food.nutrition.carbs}g • P: ${food.nutrition.protein}g • F: ${food.nutrition.fat}g
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        modalFoodResults.querySelectorAll('.food-select-item').forEach(item => {
            item.addEventListener('click', () => {
                const foodId = item.getAttribute('data-food-id');
                const food = FOOD_DATABASE.find(f => f.id === foodId);
                if (food) selectFoodForLogging(food);
            });
        });
    }

    /**
     * Selects a food and populates the FDA label
     */
    function selectFoodForLogging(food) {
        selectedFood = food;
        document.querySelectorAll('.food-select-item').forEach(el => {
            el.classList.toggle('selected', el.getAttribute('data-food-id') === food.id);
        });

        if (foodDetailPanel) foodDetailPanel.classList.remove('hidden');
        if (confirmLogFoodBtn) confirmLogFoodBtn.disabled = false;

        updateFDALabel();
    }

    /**
     * Updates FDA Nutrition Label with current serving multiplier
     */
    function updateFDALabel() {
        if (!selectedFood) return;

        const mult = parseFloat(servingsMultiplier?.value) || 1.0;

        if (panelFoodName) panelFoodName.textContent = selectedFood.name;
        if (panelFoodBrand) panelFoodBrand.textContent = `${selectedFood.brand || 'Generic'} • Default: ${selectedFood.serving.unit}`;
        if (nfServingSize) nfServingSize.textContent = `${mult} × ${selectedFood.serving.unit}`;
        if (nfCaloriesAmount) nfCaloriesAmount.textContent = Math.round(selectedFood.nutrition.calories * mult);
        if (nfFat) nfFat.textContent = `${(selectedFood.nutrition.fat * mult).toFixed(1)}g`;
        if (nfSodium) nfSodium.textContent = `${Math.round(selectedFood.nutrition.sodium * mult)}mg`;
        if (nfCarbs) nfCarbs.textContent = `${(selectedFood.nutrition.carbs * mult).toFixed(1)}g`;
        if (nfFiber) nfFiber.textContent = `${((selectedFood.nutrition.fiber || 0) * mult).toFixed(1)}g`;
        if (nfSugar) nfSugar.textContent = `${((selectedFood.nutrition.sugar || 0) * mult).toFixed(1)}g`;
        if (nfProtein) nfProtein.textContent = `${(selectedFood.nutrition.protein * mult).toFixed(1)}g`;
    }

    servingsMultiplier?.addEventListener('input', updateFDALabel);

    // Barcode sample click simulation
    document.querySelectorAll('.barcode-sample-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const barcode = btn.getAttribute('data-barcode');
            const food = typeof getFoodById !== 'undefined' ? getFoodById(barcode) : null;
            if (food) {
                // Switch back to search tab and highlight item
                document.querySelector('.modal-tab-btn[data-tab="search"]')?.click();
                selectFoodForLogging(food);
                showToast(`Scanned Barcode: ${food.name}!`, 'success');
            }
        });
    });

    // Custom Food Form submission
    const customFoodForm = document.getElementById('custom-food-form');
    customFoodForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('custom-name')?.value.trim();
        const servingUnit = document.getElementById('custom-serving')?.value.trim() || '1 serving';
        const cals = parseFloat(document.getElementById('custom-calories')?.value) || 0;
        const carbs = parseFloat(document.getElementById('custom-carbs')?.value) || 0;
        const protein = parseFloat(document.getElementById('custom-protein')?.value) || 0;
        const fat = parseFloat(document.getElementById('custom-fat')?.value) || 0;

        if (!name || !cals) return;

        const newFood = {
            id: `custom-${Date.now()}`,
            name: name,
            brand: 'Custom Food',
            category: 'meals',
            serving: { size: 1, unit: servingUnit, grams: 100 },
            nutrition: { calories: cals, carbs, protein, fat, fiber: 0, sugar: 0, sodium: 100 }
        };

        FOOD_DATABASE.unshift(newFood);
        selectFoodForLogging(newFood);
        document.querySelector('.modal-tab-btn[data-tab="search"]')?.click();
        showToast(`Created custom food: ${name}`, 'success');
    });

    // Confirm Log Food to Diary
    confirmLogFoodBtn?.addEventListener('click', () => {
        if (!selectedFood) return;

        const mult = parseFloat(servingsMultiplier?.value) || 1.0;
        const dateStr = currentDate.toISOString().split('T')[0];
        const currentUser = auth.getCurrentUser();

        const newEntry = {
            id: `f-${Date.now()}`,
            date: dateStr,
            meal: currentMeal,
            foodId: selectedFood.id,
            servings: mult
        };

        if (!currentUser.data.food) currentUser.data.food = [];
        currentUser.data.food.push(newEntry);
        auth.updateUser(currentUser);

        addFoodModal.classList.remove('show');
        updateDiaryForCurrentDate();
        showToast(`Added ${selectedFood.name} to ${currentMeal}!`, 'success');
    });

    // Complete Diary Handler
    completeDiaryBtn?.addEventListener('click', () => {
        const currentUser = auth.getCurrentUser();
        const dateStr = currentDate.toISOString().split('T')[0];
        const foodForDate = (currentUser.data.food || []).filter(f => f.date === dateStr);
        const exForDate = (currentUser.data.exercise || []).filter(e => e.date === dateStr);

        let totalCals = 0;
        foodForDate.forEach(entry => {
            const food = (typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []).find(f => f.id === entry.foodId);
            if (food) totalCals += (food.nutrition.calories * entry.servings);
        });
        const totalBurned = exForDate.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
        const dailyGoal = currentUser.goals.dailyCalories || 2100;
        const deficit = dailyGoal - totalCals + totalBurned;

        // 35 days (5 weeks) projection: 7700 kcal per kg of fat
        const projectedWeightLossKg = (deficit * 35) / 7700;
        const currentW = currentUser.goals.currentWeight || 68.2;
        const projWeight = Math.max(45, currentW - projectedWeightLossKg);

        if (completionText) {
            completionText.innerHTML = `
                If every day were like today, with your calorie deficit of <strong>${Math.max(0, Math.round(deficit))} kcal</strong>:
            `;
        }
        if (projectedWeightDisplay) {
            projectedWeightDisplay.textContent = `${projWeight.toFixed(1)} kg`;
        }

        completionModal?.classList.add('show');
    });

    completionModal?.querySelectorAll('.modal-close, .modal-close-btn').forEach(b => {
        b.addEventListener('click', () => completionModal.classList.remove('show'));
    });
    completionModal?.addEventListener('click', (e) => {
        if (e.target === completionModal) completionModal.classList.remove('show');
    });

    // Initial Diary Render
    updateDiaryForCurrentDate();

    // Auto-open modal via URL params (convenient for portfolio showcases and test automation)
    const urlParams = new URLSearchParams(window.location.search);
    const autoModal = urlParams.get('openModal');
    if (autoModal) {
        currentMeal = autoModal;
        if (modalMealName) modalMealName.textContent = currentMeal;
        const autoSearch = urlParams.get('search');
        if (autoSearch && modalFoodSearch) {
            modalFoodSearch.value = autoSearch;
            const results = searchFoodDatabase(autoSearch);
            renderModalFoodList(results);
            if (results.length > 0) {
                selectFoodForLogging(results[0]);
            }
        } else {
            renderModalFoodList();
        }
        addFoodModal?.classList.add('show');
    }
});