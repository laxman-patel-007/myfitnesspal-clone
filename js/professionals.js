/**
 * Professionals and Coaches booking script.
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    if (!user) return;

    const grid = document.getElementById('professionals-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookingModal = document.getElementById('booking-modal');
    const bookingProName = document.getElementById('booking-pro-name');
    const timeSlotsList = document.getElementById('time-slots-list');
    const confirmBookingBtn = document.getElementById('confirm-booking-btn');

    let selectedProfessional = null;
    let selectedTimeSlot = null;

    function renderProfessionals(filter = 'all') {
        if (!grid) return;
        grid.innerHTML = '';
        const professionals = (typeof PROFESSIONALS_DATABASE !== 'undefined') ? PROFESSIONALS_DATABASE : [];
        const filteredPros = professionals.filter(pro => filter === 'all' || pro.type === filter);

        if (filteredPros.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No professionals found for this category.</p>';
            return;
        }

        filteredPros.forEach(pro => {
            const card = document.createElement('div');
            card.className = 'pro-card';
            card.innerHTML = `
                <img src="${pro.photo}" alt="${pro.name}" class="pro-avatar">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3 style="font-size: 17px; font-weight: 800; color: var(--navy-deep); margin-bottom: 2px;">${pro.name}</h3>
                            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--primary-blue);">${pro.type === 'trainer' ? 'Certified Personal Trainer' : 'Registered Dietitian'}</span>
                        </div>
                        <div style="font-size: 13px; font-weight: 700; color: #b45309; background: #fef3c7; padding: 2px 8px; border-radius: var(--radius-full);">
                            ★ ${pro.rating.toFixed(1)}
                        </div>
                    </div>
                    <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0; line-height: 1.4;">${pro.bio}</p>
                    <div class="pro-specialties">
                        ${pro.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-light);">
                        <span style="font-size: 15px; font-weight: 800; color: var(--navy-deep);">$${Math.round(pro.price / 80)}/session</span>
                        <button class="btn btn-sm btn-primary book-btn" data-id="${pro.id}">Book Consultation</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        grid.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const proId = e.currentTarget.getAttribute('data-id');
                openBookingModal(proId);
            });
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProfessionals(btn.getAttribute('data-filter'));
        });
    });

    function openBookingModal(proId) {
        selectedProfessional = PROFESSIONALS_DATABASE.find(p => p.id === proId);
        if (!selectedProfessional) return;

        if (bookingProName) bookingProName.textContent = selectedProfessional.name;
        selectedTimeSlot = null;
        if (confirmBookingBtn) confirmBookingBtn.disabled = true;

        generateTimeSlots();
        bookingModal?.classList.add('show');
    }

    function generateTimeSlots() {
        if (!timeSlotsList) return;
        timeSlotsList.innerHTML = '';
        const slots = ['09:00 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

        slots.forEach(slot => {
            const btn = document.createElement('button');
            btn.className = 'slot-btn';
            btn.textContent = slot;
            btn.addEventListener('click', () => {
                timeSlotsList.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedTimeSlot = slot;
                if (confirmBookingBtn) confirmBookingBtn.disabled = false;
            });
            timeSlotsList.appendChild(btn);
        });
    }

    confirmBookingBtn?.addEventListener('click', () => {
        if (!selectedProfessional || !selectedTimeSlot) return;

        const currentUser = auth.getCurrentUser();
        if (!currentUser.data.bookings) currentUser.data.bookings = [];

        currentUser.data.bookings.push({
            id: `bk-${Date.now()}`,
            professionalId: selectedProfessional.id,
            name: selectedProfessional.name,
            slot: selectedTimeSlot,
            date: new Date().toLocaleDateString()
        });

        auth.updateUser(currentUser);
        bookingModal?.classList.remove('show');
        showToast(`Consultation booked with ${selectedProfessional.name} at ${selectedTimeSlot}!`, 'success');
    });

    bookingModal?.querySelectorAll('.modal-close, .modal-close-btn').forEach(b => {
        b.addEventListener('click', () => bookingModal.classList.remove('show'));
    });
    bookingModal?.addEventListener('click', (e) => {
        if (e.target === bookingModal) bookingModal.classList.remove('show');
    });

    renderProfessionals();
});