/**
 * Global application script for MyFitnessPal.
 * Handles common UI interactions, toast notifications, FAQ accordions,
 * landing page interactive search and calorie calculator widgets.
 */

// Toast notification helper
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // --- Landing Page Interactive Food Search Widget ---
    const landingFoodSearch = document.getElementById('landing-food-search');
    const landingResultsGrid = document.getElementById('landing-results-grid');
    const filterPills = document.querySelectorAll('.food-filter-pills .quick-pill');

    if (landingFoodSearch && landingResultsGrid && typeof FOOD_DATABASE !== 'undefined') {
        let currentCategory = 'all';

        const renderLandingResults = (query = '') => {
            const results = searchFoodDatabase(query, currentCategory).slice(0, 8);
            if (results.length === 0) {
                landingResultsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--text-muted);">
                        <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
                        No foods found matching "${query}". Try searching for 'Chicken', 'Oats', 'Salmon', or 'Avocado'.
                    </div>
                `;
                return;
            }

            landingResultsGrid.innerHTML = results.map(food => `
                <div class="live-food-card">
                    <div class="live-food-info">
                        <strong>${food.name}</strong>
                        <span>${food.brand} • ${food.serving.unit}</span>
                    </div>
                    <div class="live-food-macros">
                        <div class="cals">${food.nutrition.calories} kcal</div>
                        <div class="macro-tags">
                            C: ${food.nutrition.carbs}g • P: ${food.nutrition.protein}g • F: ${food.nutrition.fat}g
                        </div>
                    </div>
                </div>
            `).join('');
        };

        // Initial render
        renderLandingResults();

        landingFoodSearch.addEventListener('input', (e) => {
            renderLandingResults(e.target.value);
        });

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = pill.getAttribute('data-category');
                renderLandingResults(landingFoodSearch.value);
            });
        });
    }

    // --- Landing Page Calorie & Macro Calculator Widget ---
    const calcBtn = document.getElementById('calc-calculate-btn');
    if (calcBtn) {
        const updateLandingCalculator = () => {
            const gender = document.getElementById('calc-gender')?.value || 'female';
            const age = parseFloat(document.getElementById('calc-age')?.value) || 28;
            const height = parseFloat(document.getElementById('calc-height')?.value) || 168; // cm
            const weight = parseFloat(document.getElementById('calc-weight')?.value) || 68; // kg
            const activity = parseFloat(document.getElementById('calc-activity')?.value) || 1.4;
            const goal = document.getElementById('calc-goal')?.value || 'lose';

            // Mifflin-St Jeor Equation
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            bmr = gender === 'male' ? bmr + 5 : bmr - 161;

            let tdee = bmr * activity;
            let targetCals = tdee;

            if (goal === 'lose') {
                targetCals = tdee - 500; // ~0.5kg/week fat loss
            } else if (goal === 'gain') {
                targetCals = tdee + 350; // Lean surplus
            }

            targetCals = Math.max(Math.round(targetCals), 1200);

            // Suggested Macro split (45% Carbs, 30% Protein, 25% Fat)
            const carbsGrams = Math.round((targetCals * 0.45) / 4);
            const proteinGrams = Math.round((targetCals * 0.30) / 4);
            const fatGrams = Math.round((targetCals * 0.25) / 9);

            const calDisplay = document.getElementById('calc-result-cals');
            const carbsDisplay = document.getElementById('calc-result-carbs');
            const proteinDisplay = document.getElementById('calc-result-protein');
            const fatDisplay = document.getElementById('calc-result-fat');

            if (calDisplay) calDisplay.textContent = targetCals.toLocaleString();
            if (carbsDisplay) carbsDisplay.textContent = `${carbsGrams}g`;
            if (proteinDisplay) proteinDisplay.textContent = `${proteinGrams}g`;
            if (fatDisplay) fatDisplay.textContent = `${fatGrams}g`;
        };

        calcBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateLandingCalculator();
            showToast('Personalized Calorie Target Updated!', 'success');
        });

        // Auto update on input changes
        ['calc-gender', 'calc-age', 'calc-height', 'calc-weight', 'calc-activity', 'calc-goal'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', updateLandingCalculator);
        });

        // Run once on load
        updateLandingCalculator();
    }
});