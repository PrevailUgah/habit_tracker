const STORAGE_KEY = 'focusSevenData';
const MAX_HABITS = 7;

// DOM Elements
const newHabitInput = document.getElementById('new-habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitsList = document.getElementById('habits-list');
const historyBtn = document.getElementById('history-btn');
const historyModal = document.getElementById('history-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const historyContent = document.getElementById('history-content');
const toast = document.getElementById('toast');

// State
let habits = [];

// Initialize
function init() {
    loadData();
    checkStreaks();
    render();
    setupEventListeners();
}

// Data Management
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            habits = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing data', e);
            habits = [];
        }
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

// Streak Logic
// Logic: On app load, compare Date.now() with the lastEntryDate. If > 24 hours, break the streak.
function checkStreaks() {
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    let modified = false;

    habits.forEach(habit => {
        if (habit.logs && habit.logs.length > 0) {
            const lastLog = habit.logs[habit.logs.length - 1];
            const lastEntryDate = new Date(lastLog.date).getTime();

            if (now - lastEntryDate > TWENTY_FOUR_HOURS) {
                if (habit.streak !== 0) {
                    habit.streak = 0;
                    modified = true;
                }
            }
        }
    });

    if (modified) {
        saveData();
    }
}

// UI Rendering
function render() {
    renderHabits();
    updateAddButtonState();
}

function updateAddButtonState() {
    if (habits.length >= MAX_HABITS) {
        addHabitBtn.disabled = true;
        newHabitInput.disabled = true;
        newHabitInput.placeholder = "Max 7 Focus Areas Reached";
    } else {
        addHabitBtn.disabled = false;
        newHabitInput.disabled = false;
        newHabitInput.placeholder = "Enter a new focus area (max 7)";
    }
}

function renderHabits() {
    habitsList.innerHTML = '';

    if (habits.length === 0) {
        habitsList.innerHTML = `<div class="empty-state">No focus areas yet. Add one above!</div>`;
        return;
    }

    habits.forEach(habit => {
        const hasLoggedToday = checkLoggedToday(habit);
        
        const card = document.createElement('div');
        card.className = 'habit-card';
        card.innerHTML = `
            <div class="habit-header">
                <div class="habit-name">${escapeHTML(habit.name)}</div>
                <div style="display: flex; align-items: center;">
                    <div class="streak-badge">
                        <svg class="streak-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                        ${habit.streak}
                    </div>
                    <button class="delete-habit-btn" data-id="${habit.id}" title="Delete Focus">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
            ${hasLoggedToday ? 
                `<div class="log-input-group"><input type="text" value="Done for today!" disabled style="opacity: 0.7; border: 1px solid var(--accent-color);"><button class="log-btn success" disabled>
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </button></div>` :
                `<div class="log-input-group">
                    <input type="text" id="log-input-${habit.id}" placeholder="What did you improve today?">
                    <button class="log-btn" data-id="${habit.id}">Log</button>
                </div>`
            }
        `;
        habitsList.appendChild(card);
    });
}

function checkLoggedToday(habit) {
    if (!habit.logs || habit.logs.length === 0) return false;
    
    const lastLog = habit.logs[habit.logs.length - 1];
    const lastLogDate = new Date(lastLog.date);
    const today = new Date();
    
    return lastLogDate.getFullYear() === today.getFullYear() &&
           lastLogDate.getMonth() === today.getMonth() &&
           lastLogDate.getDate() === today.getDate();
}

function renderHistory() {
    historyContent.innerHTML = '';
    
    if (habits.length === 0) {
        historyContent.innerHTML = `<div class="empty-state">No history available yet.</div>`;
        return;
    }

    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - SEVEN_DAYS;

    habits.forEach(habit => {
        const recentLogs = habit.logs.filter(log => new Date(log.date).getTime() >= sevenDaysAgo);
        
        if (recentLogs.length > 0) {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            let logsHtml = recentLogs.reverse().map(log => `
                <li>
                    <div class="log-date">${new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</div>
                    <div class="log-text">${escapeHTML(log.improvement)}</div>
                </li>
            `).join('');

            historyItem.innerHTML = `
                <div class="history-habit-name">${escapeHTML(habit.name)}</div>
                <ul class="history-log-list">
                    ${logsHtml}
                </ul>
            `;
            historyContent.appendChild(historyItem);
        }
    });

    if (historyContent.innerHTML === '') {
        historyContent.innerHTML = `<div class="empty-state">No improvement logs in the last 7 days.</div>`;
    }
}

// Actions
function addHabit(name) {
    if (habits.length >= MAX_HABITS) return;
    
    const newHabit = {
        id: Date.now().toString(),
        name: name.trim(),
        streak: 0,
        logs: []
    };
    
    habits.push(newHabit);
    saveData();
    render();
}

function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    saveData();
    render();
}

function logImprovement(id, improvementText) {
    const habit = habits.find(h => h.id === id);
    if (!habit || !improvementText.trim()) return;

    if (checkLoggedToday(habit)) return; // Already logged today

    habit.logs.push({
        date: new Date().toISOString(),
        improvement: improvementText.trim()
    });
    
    habit.streak += 1;
    saveData();
    
    // UI Update
    render();
    showToast();
}

// Utils
function showToast() {
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Event Listeners
function setupEventListeners() {
    addHabitBtn.addEventListener('click', () => {
        if (newHabitInput.value.trim()) {
            addHabit(newHabitInput.value);
            newHabitInput.value = '';
        }
    });

    newHabitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && newHabitInput.value.trim()) {
            addHabit(newHabitInput.value);
            newHabitInput.value = '';
        }
    });

    habitsList.addEventListener('click', (e) => {
        // Handle Log button click
        const logBtn = e.target.closest('.log-btn');
        if (logBtn && !logBtn.disabled) {
            const id = logBtn.dataset.id;
            const inputElement = document.getElementById(`log-input-${id}`);
            const text = inputElement.value;
            
            if (text.trim()) {
                // Success animation class immediately
                logBtn.classList.add('success');
                setTimeout(() => {
                    logImprovement(id, text);
                }, 500); // Wait for animation to complete
            } else {
                inputElement.focus();
                // simple shake effect
                inputElement.style.animation = 'pulse 0.2s';
                setTimeout(() => inputElement.style.animation = '', 200);
            }
        }

        // Handle Delete button click
        const deleteBtn = e.target.closest('.delete-habit-btn');
        if (deleteBtn) {
            if (confirm('Are you sure you want to remove this focus area?')) {
                deleteHabit(deleteBtn.dataset.id);
            }
        }
    });

    historyBtn.addEventListener('click', () => {
        renderHistory();
        historyModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        historyModal.classList.add('hidden');
    });

    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.add('hidden');
        }
    });
}

// Start App
init();
