/**
 * Settings script powering profile customizations, membership status,
 * data export, and demo-reseed utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Elements
    const tabBtns = document.querySelectorAll('.settings-tab-btn');
    const panels = document.querySelectorAll('.settings-panel');

    const profileForm = document.getElementById('profile-form');
    const displayNameInput = document.getElementById('display-name');
    const avatarUrlInput = document.getElementById('avatar-url-input');
    const profileAvatarPreview = document.getElementById('profile-avatar-preview');
    const genderSelect = document.getElementById('gender');
    const heightInput = document.getElementById('height');
    const activityLevelSelect = document.getElementById('activity-level');

    const emailInput = document.getElementById('email');
    const currentPlanEl = document.getElementById('current-plan');

    const exportBtn = document.getElementById('export-all');
    const resetDataBtn = document.getElementById('reset-data-btn');
    const reseedDemoBtn = document.getElementById('reseed-demo-btn');

    function loadUserSettings() {
        const currentUser = auth.getCurrentUser();
        const profile = currentUser.profile || {};

        if (displayNameInput) displayNameInput.value = profile.displayName || currentUser.username;
        if (avatarUrlInput) avatarUrlInput.value = profile.avatar || '';
        if (profileAvatarPreview && profile.avatar) profileAvatarPreview.src = profile.avatar;
        if (genderSelect) genderSelect.value = profile.gender || 'female';
        if (heightInput) heightInput.value = profile.height || 168;
        if (activityLevelSelect) activityLevelSelect.value = profile.activityLevel || 'moderate';

        if (emailInput) emailInput.value = currentUser.email;
        if (currentPlanEl) currentPlanEl.textContent = currentUser.isPremium ? 'Premium (Active)' : 'Free Tier';
    }

    // Avatar preview live change
    avatarUrlInput?.addEventListener('input', (e) => {
        if (profileAvatarPreview && e.target.value.trim().length > 10) {
            profileAvatarPreview.src = e.target.value.trim();
        }
    });

    // Tab Navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = `panel-${btn.getAttribute('data-tab')}`;
            document.getElementById(targetId)?.classList.add('active');
        });
    });

    // Save Profile
    profileForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = auth.getCurrentUser();

        currentUser.profile.displayName = displayNameInput.value.trim();
        currentUser.profile.avatar = avatarUrlInput.value.trim();
        currentUser.profile.gender = genderSelect.value;
        currentUser.profile.height = parseFloat(heightInput.value);
        currentUser.profile.activityLevel = activityLevelSelect.value;

        auth.updateUser(currentUser);
        auth.updateHeaderNav();
        showToast('Profile preferences updated!', 'success');
    });

    // Export Data JSON
    exportBtn?.addEventListener('click', () => {
        const currentUser = auth.getCurrentUser();
        const dataStr = JSON.stringify(currentUser, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `myfitnesspal_archive_${currentUser.username}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Data archive downloaded!', 'success');
    });

    // Restore Demo Data
    reseedDemoBtn?.addEventListener('click', () => {
        const users = storage.getUsers();
        delete users['demo-user-1'];
        storage.saveUsers(users);
        auth.ensureDemoUser();
        auth.loginDemoUser();
        showToast('Demo data restored! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    });

    // Reset Data
    resetDataBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all your logged food, workouts, and weight data?')) {
            const currentUser = auth.getCurrentUser();
            currentUser.data = {
                weight: [{ date: new Date().toISOString().split('T')[0], value: currentUser.goals.currentWeight || 68.2 }],
                food: [],
                exercise: [],
                water: {},
                bookings: []
            };
            auth.updateUser(currentUser);
            showToast('Health entries cleared.', 'info');
            loadUserSettings();
        }
    });

    loadUserSettings();
});