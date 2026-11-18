/**
 * Premium membership script powering interactive plan selection
 * and demo plan toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    const statusText = document.getElementById('current-membership-status');
    const toggleBtn = document.getElementById('toggle-premium-status-btn');

    function updateStatusUI() {
        const currentUser = auth.getCurrentUser();
        const isPrem = currentUser ? currentUser.isPremium : false;
        if (statusText) {
            statusText.textContent = isPrem ? 'Premium (Active)' : 'Free Tier';
            statusText.style.color = isPrem ? '#fbbf24' : '#94a3b8';
        }
    }

    toggleBtn?.addEventListener('click', () => {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            auth.loginDemoUser();
            return;
        }
        currentUser.isPremium = !currentUser.isPremium;
        auth.updateUser(currentUser);
        auth.updateHeaderNav();
        updateStatusUI();
        showToast(`Switched account to: ${currentUser.isPremium ? 'Premium Plan' : 'Free Tier'}`, 'success');
    });

    document.querySelectorAll('.select-plan-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentUser = auth.getCurrentUser();
            if (!currentUser) {
                auth.loginDemoUser();
                return;
            }
            currentUser.isPremium = true;
            auth.updateUser(currentUser);
            auth.updateHeaderNav();
            updateStatusUI();
            showToast('Welcome to MyFitnessPal Premium! All features unlocked.', 'success');
        });
    });

    updateStatusUI();
});