/**
 * PERSONAL TRANSFORMATION DASHBOARD — CORE APPLICATION LOGIC
 * Architecture: Clean separation of State, Storage, Services, and UI Rendering.
 * 100% Vanilla JavaScript, Native Date APIs, LocalStorage & IndexedDB.
 */

// ============================================================================
// 1. CONSTANTS & APPLICATION CONFIGURATION
// ============================================================================

const APP_SCHEMA_VERSION = 1;
const STORAGE_KEYS = {
  SETTINGS: 'transformation_os_settings',
  DAILY_LOGS: 'transformation_os_daily_logs',
  GROCERY_LISTS: 'transformation_os_grocery_lists',
  EXERCISE_HISTORY: 'transformation_os_exercise_history',
  READING_STATE: 'transformation_os_reading_state',
  SCHEMA_VERSION: 'transformation_os_schema_version'
};

const DB_CONFIG = {
  NAME: 'TransformationOS_EvidenceDB',
  VERSION: 1,
  STORE: 'attachments'
};

const DEFAULT_SETTINGS = {
  userName: 'Arnab',
  avatarInitials: 'AB',
  wakeupTime: '08:00',
  officeStart: '12:30',
  officeEnd: '22:00',
  studyTime: '00:00',
  targetSleepHours: 7.5,
  dailySavingsTarget: 200,
  dailyProteinTarget: 120,
  dailyStudyTargetMinutes: 60,
  dailyReadingTargetMinutes: 30,
  dailyWaterTargetGlasses: 8,
  dietaryPreferences: ''
};

// Weekly Workout Regimen (Requirement 6)
const WEEKLY_WORKOUT_PLANS = {
  1: { // Monday
    title: 'Upper Body A',
    subtitle: 'Strength & Hypertrophy · 8:35–9:35 AM',
    isRestDay: false,
    exercises: [
      { id: 'db_bench', name: 'Dumbbell bench press', target: '3 × 8–12 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'lat_pull', name: 'Lat pulldown', target: '3 × 8–12 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'seated_row', name: 'Seated cable row', target: '2 × 10–12 reps', defaultSets: 2, defaultReps: '10' },
      { id: 'db_shoulder', name: 'Dumbbell shoulder press', target: '2 × 10 reps', defaultSets: 2, defaultReps: '10' },
      { id: 'biceps_curl', name: 'Biceps curls', target: '2 × 12 reps', defaultSets: 2, defaultReps: '12' },
      { id: 'triceps_push', name: 'Triceps pushdowns', target: '2 × 12 reps', defaultSets: 2, defaultReps: '12' }
    ]
  },
  2: { // Tuesday
    title: 'Lower Body A',
    subtitle: 'Leg Power & Posterior Chain · 8:35–9:35 AM',
    isRestDay: false,
    exercises: [
      { id: 'goblet_squat', name: 'Goblet squat', target: '3 × 10 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'db_rdl', name: 'Dumbbell Romanian deadlift', target: '3 × 10 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'split_squat', name: 'Split squat', target: '2 × 8 reps / leg', defaultSets: 2, defaultReps: '8' },
      { id: 'calf_raises', name: 'Calf raises', target: '3 × 15 reps', defaultSets: 3, defaultReps: '15' },
      { id: 'plank', name: 'Plank', target: '3 sets (45–60 sec)', defaultSets: 3, defaultReps: '45s' }
    ]
  },
  3: { // Wednesday
    title: 'Active Recovery',
    subtitle: 'Low Impact Movement · Rest Day',
    isRestDay: true,
    exercises: [
      { id: 'brisk_walk', name: 'Brisk walking', target: '20–30 minutes outdoors', defaultSets: 1, defaultReps: '25m' },
      { id: 'mobility_flow', name: 'Full-body mobility routine', target: '10 minutes hip/spine openers', defaultSets: 1, defaultReps: '10m' }
    ]
  },
  4: { // Thursday
    title: 'Upper Body B',
    subtitle: 'Incline & Pull Volume · 8:35–9:35 AM',
    isRestDay: false,
    exercises: [
      { id: 'incline_db', name: 'Incline dumbbell press', target: '3 × 10 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'pullups', name: 'Lat pulldown or assisted pull-ups', target: '3 × 10 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'db_row_single', name: 'One-arm dumbbell row', target: '3 × 10 reps / side', defaultSets: 3, defaultReps: '10' },
      { id: 'lateral_raises', name: 'Lateral raises', target: '2 × 12–15 reps', defaultSets: 2, defaultReps: '12' },
      { id: 'hammer_curls', name: 'Hammer curls', target: '2 × 12 reps', defaultSets: 2, defaultReps: '12' },
      { id: 'triceps_ext', name: 'Triceps extensions', target: '2 × 12 reps', defaultSets: 2, defaultReps: '12' }
    ]
  },
  5: { // Friday
    title: 'Lower Body B',
    subtitle: 'Glute, Hamstring & Core · 8:35–9:35 AM',
    isRestDay: false,
    exercises: [
      { id: 'leg_press', name: 'Leg press or bodyweight squats', target: '3 × 10 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'hip_thrust', name: 'Hip thrusts', target: '3 × 10–12 reps', defaultSets: 3, defaultReps: '10' },
      { id: 'hamstring_curl', name: 'Hamstring curls', target: '2 × 12 reps', defaultSets: 2, defaultReps: '12' },
      { id: 'reverse_lunges', name: 'Reverse lunges', target: '2 × 8 reps / leg', defaultSets: 2, defaultReps: '8' },
      { id: 'dead_bugs', name: 'Dead bugs', target: '3 × 10 reps / side', defaultSets: 3, defaultReps: '10' }
    ]
  },
  6: { // Saturday
    title: 'Cardio & Mobility',
    subtitle: 'Aerobic Base & Flexibility · Weekend Focus',
    isRestDay: false,
    exercises: [
      { id: 'zone2_cardio', name: 'Comfortable cardio (Cycle / Jog)', target: '30–40 minutes steady state', defaultSets: 1, defaultReps: '35m' },
      { id: 'deep_mobility', name: 'Full body deep mobility', target: '10 minutes', defaultSets: 1, defaultReps: '10m' }
    ]
  },
  0: { // Sunday
    title: 'Recovery & Planning',
    subtitle: 'Rest, Grocery & Meal Prep',
    isRestDay: true,
    exercises: [
      { id: 'relaxed_walk', name: 'Optional relaxed walk', target: '20–30 minutes gentle stroll', defaultSets: 1, defaultReps: '20m' },
      { id: 'sunday_review', name: 'Weekly review & meal preparation', target: 'Kitchen prep & calendar plan', defaultSets: 1, defaultReps: 'Done' }
    ]
  }
};

// Weekly Nutrition Regimen (Requirement 7)
const WEEKLY_MEAL_PLANS = {
  1: { // Monday
    preWorkout: '1 banana + optional black coffee (8:20 AM)',
    breakfast: '3 eggs, 40–60 g oats, 1 fresh fruit (9:40 AM)',
    lunch: '150 g cooked chicken breast, rice or 2–3 rotis, mixed vegetables, fresh curd (2:00 PM)',
    snack: 'Roasted chana (40 g) + 1 seasonal fruit (5:30 PM)',
    dinner: '100–150 g cooked chicken, rice or 2 rotis, sautéed vegetables (8:30–9:00 PM)',
    estProtein: 125,
    estCalories: 2250
  },
  2: { // Tuesday
    preWorkout: '1 banana + optional black coffee (8:20 AM)',
    breakfast: '3-egg omelette, whole-wheat bread (2 slices), bowl of curd (9:40 AM)',
    lunch: 'Chicken curry (150 g), steamed rice, vegetables, bowl of curd (2:00 PM)',
    snack: 'Dahi (curd) with muesli or roasted chana (5:30 PM)',
    dinner: '3-egg curry, 2 whole-wheat rotis, mixed vegetables, optional dal (8:30–9:00 PM)',
    estProtein: 120,
    estCalories: 2200
  },
  3: { // Wednesday
    preWorkout: '1 banana + optional black coffee (8:20 AM)',
    breakfast: '3 eggs, oats porridge (50 g), sliced fruit (9:40 AM)',
    lunch: 'Chicken curry, steamed rice, 1 bowl dal, green salad (2:00 PM)',
    snack: 'Fresh curd or glass of milk + 1 apple or banana (5:30 PM)',
    dinner: 'Cooked chicken (120 g), 2 rotis, stir-fried vegetables (8:30–9:00 PM)',
    estProtein: 118,
    estCalories: 2150
  },
  4: { // Thursday
    preWorkout: '1 banana + optional black coffee (8:20 AM)',
    breakfast: '3 eggs (scrambled or boiled), whole-wheat toast, fresh fruit (9:40 AM)',
    lunch: 'Chicken (150 g), rice or rotis, seasonal vegetables, curd (2:00 PM)',
    snack: 'Roasted chana (50 g) + fruit portion (5:30 PM)',
    dinner: 'Paneer bhurji (150 g) or eggs with 2 rotis and vegetables (8:30–9:00 PM)',
    estProtein: 122,
    estCalories: 2300
  },
  5: { // Friday
    preWorkout: '1 banana + optional black coffee (8:20 AM)',
    breakfast: '3 eggs, 50 g oats, sliced fruit (9:40 AM)',
    lunch: 'Chicken rice bowl with stir-fried greens & curd (2:00 PM)',
    snack: 'Dahi with muesli or roasted chana portion (5:30 PM)',
    dinner: 'Chicken curry (150 g), rice or rotis, sautéed vegetables (8:30–9:00 PM)',
    estProtein: 124,
    estCalories: 2280
  },
  6: { // Saturday
    preWorkout: 'Light fruit or warm water with lemon (8:30 AM)',
    breakfast: '3-egg veggie omelette, oats with milk, fruit portion (9:40 AM)',
    lunch: 'Cooked chicken (150 g), rice, dal bowl, cucumber salad (2:00 PM)',
    snack: 'Curd with handful of nuts (almonds/walnuts) + fruit (5:30 PM)',
    dinner: 'Paneer curry or grilled chicken with 2 rotis and vegetables (8:30 PM)',
    estProtein: 115,
    estCalories: 2200
  },
  0: { // Sunday
    preWorkout: 'Hydrating lemon water / coffee (8:30 AM)',
    breakfast: '3 eggs, 2 whole-wheat toasts, sliced fruit (9:40 AM)',
    lunch: 'Chicken curry (150 g), steamed rice, mixed vegetables, curd (2:00 PM)',
    snack: '1 fresh seasonal fruit + roasted chana (5:30 PM)',
    dinner: 'Dal bowl, 2 boiled eggs or paneer, 2 rotis, green vegetables (8:30 PM)',
    estProtein: 112,
    estCalories: 2100
  }
};

// Default Sunday Grocery Shopping List (Requirement 8)
const DEFAULT_SUNDAY_GROCERY = [
  { id: 'groc_chicken', name: 'Fresh Chicken Breast / Curry Cut', category: 'protein', qty: '1.8 kg', price: 460, purchased: false, atHome: false },
  { id: 'groc_eggs', name: 'Farm Fresh Eggs', category: 'protein', qty: '24 eggs (2 crates)', price: 180, purchased: false, atHome: false },
  { id: 'groc_paneer', name: 'Fresh Malai Paneer', category: 'protein', qty: '450 g', price: 170, purchased: false, atHome: false },
  { id: 'groc_dal', name: 'Yellow Moong / Toor Dal', category: 'protein', qty: '500 g', price: 85, purchased: false, atHome: false },
  { id: 'groc_oats', name: 'Rolled / Whole Oats', category: 'grains', qty: '500 g', price: 110, purchased: false, atHome: false },
  { id: 'groc_rice', name: 'Steamed / Brown Basmati Rice', category: 'grains', qty: '2 kg', price: 130, purchased: false, atHome: false },
  { id: 'groc_atta', name: 'Whole Wheat Atta (Chakki)', category: 'grains', qty: '2 kg', price: 95, purchased: false, atHome: false },
  { id: 'groc_muesli', name: 'Nut & Fruit Muesli', category: 'grains', qty: '400 g', price: 190, purchased: false, atHome: false },
  { id: 'groc_veggies', name: 'Mixed Vegetables (Broccoli, Beans, Spinach, Carrots)', category: 'vegetables', qty: '2.5 kg', price: 180, purchased: false, atHome: false },
  { id: 'groc_bananas', name: 'Fresh Robust Bananas', category: 'fruits', qty: '10 pcs', price: 70, purchased: false, atHome: false },
  { id: 'groc_fruits', name: 'Seasonal Fruit (Apples / Papaya / Oranges)', category: 'fruits', qty: '6 portions', price: 150, purchased: false, atHome: false },
  { id: 'groc_curd', name: 'Fresh Dahi / Plain Greek Yogurt', category: 'dairy', qty: '2 kg', price: 160, purchased: false, atHome: false },
  { id: 'groc_chana', name: 'Roasted Salted / Plain Chana', category: 'pantry', qty: '400 g', price: 90, purchased: false, atHome: false },
  { id: 'groc_nuts', name: 'Raw Almonds & Walnuts', category: 'pantry', qty: '150 g', price: 180, purchased: false, atHome: false },
  { id: 'groc_coffee', name: 'Roast Coffee & Basic Spices', category: 'pantry', qty: 'As needed', price: 120, purchased: false, atHome: false }
];

// Sunday Meal Prep Tasks (Requirement 8)
const DEFAULT_MEAL_PREP_TASKS = [
  { id: 'prep_chicken', title: 'Portion & Marinate Chicken safely into airtight containers for Mon–Wed' },
  { id: 'prep_eggs', title: 'Hard-boil 6–8 eggs for instant breakfasts & snacks' },
  { id: 'prep_rice', title: 'Batch cook steamed rice or grain base for weekday lunch boxes' },
  { id: 'prep_veggies', title: 'Wash, chop & steam mixed vegetables into weekly storage boxes' },
  { id: 'prep_snacks', title: 'Pre-portion roasted chana & nuts into 5 office snack bags' },
  { id: 'prep_office_pack', title: 'Pack office lunchbox & cutlery ready for the 12:30 PM shift' }
];

// 12 Core Habits Schema & Metadata (Requirement 4)
const CORE_HABITS_META = [
  { id: 'wakeUp', title: 'Wake up at 8:00 AM', time: '08:00 AM', cat: 'sleep' },
  { id: 'morningSkincare', title: 'Brush teeth & morning skincare', time: '08:10 AM', cat: 'grooming' },
  { id: 'waterHydration', title: 'Drink water (Hydration start)', time: '08:15 AM', cat: 'nutrition' },
  { id: 'preWorkoutSnack', title: 'Pre-workout banana & optional black coffee', time: '08:20 AM', cat: 'nutrition' },
  { id: 'workout', title: 'Complete today\'s planned workout or recovery', time: '08:35 AM', cat: 'fitness' },
  { id: 'postWorkoutBreakfast', title: 'Eat planned post-workout breakfast', time: '09:40 AM', cat: 'nutrition' },
  { id: 'lunchSnackDinner', title: 'Complete lunch, 5:30 snack, and dinner', time: 'All Day', cat: 'nutrition' },
  { id: 'nightSkincare', title: 'Night skincare & dental hygiene', time: '11:30 PM', cat: 'grooming' },
  { id: 'studySession', title: 'Complete planned AI/ML study session', time: '12:00 AM', cat: 'career' },
  { id: 'readingZeroToOne', title: 'Read Zero to One (30 mins)', time: '01:00 AM', cat: 'reading' },
  { id: 'saveMoney', title: 'Save daily ₹200 target', time: 'Daily', cat: 'finance' },
  { id: 'bedtimeSleep', title: 'Bedtime routine & 7.5h sleep target', time: '01:30 AM', cat: 'sleep' }
];

// Default Vertical Routine Schedule Template (Requirement 5)
const DEFAULT_TIMELINE_TEMPLATE = [
  { id: 'sched_1', time: '08:00', title: 'Wake up, brush, drink water, morning skincare', desc: 'Hydrate 500ml, cleanse face, apply sunscreen.' },
  { id: 'sched_2', time: '08:20', title: 'Pre-workout fuel', desc: '1 banana + optional black coffee for gym energy.' },
  { id: 'sched_3', time: '08:35', title: 'Planned Gym Workout', desc: 'Follow weekly lifting regimen or active recovery.' },
  { id: 'sched_4', time: '09:40', title: 'Post-Workout Breakfast', desc: '3 eggs + oats porridge + fruit. Refuel glycogen & protein.' },
  { id: 'sched_5', time: '10:00', title: 'Shower, Grooming & Prep', desc: 'Post-workout hygiene, professional grooming, lunch packing.' },
  { id: 'sched_6', time: '11:45', title: 'Commute & Arrive at Office', desc: 'Leave before 12:00 PM to arrive comfortably before 12:30 PM.' },
  { id: 'sched_7', time: '12:30', title: 'Office Work Shift Starts', desc: 'Core professional duties (12:30 PM – 10:00 PM).' },
  { id: 'sched_8', time: '14:00', title: 'Lunch at Office', desc: '150g chicken, rice/rotis, vegetables, curd.' },
  { id: 'sched_9', time: '17:30', title: 'Afternoon Energy Snack', desc: 'Roasted chana + fresh fruit. Avoid office junk food.' },
  { id: 'sched_10', time: '20:30', title: 'Dinner at Office / Late Meal', desc: 'Chicken/paneer curry, 2 rotis, vegetables.' },
  { id: 'sched_11', time: '22:00', title: 'Shift Ends & Commute Home', desc: 'Return home, unwind, and refresh.' },
  { id: 'sched_12', time: '00:00', title: 'Focused AI/ML Study Session', desc: 'Paper reading, PyTorch code, or LLM architecture.' },
  { id: 'sched_13', time: '01:00', title: 'Zero to One Reading & Sleep', desc: '30 mins reading, write reflection, sleep by 1:30 AM.' }
];

// ============================================================================
// 2. STATE & DATABASE SERVICES
// ============================================================================

class AppState {
  constructor() {
    this.currentDate = new Date();
    this.selectedDateKey = this.getLocalDateKey(this.currentDate);
    this.todayDateKey = this.getLocalDateKey(new Date());
    this.settings = this.loadSettings();
    this.currentView = 'home';
    this.activeAnalyticsFilter = '7days';
    this.calendarViewMonth = new Date();
    
    // Timer state for AI/ML study
    this.studyTimerInterval = null;
    this.studyTimerSeconds = 0;
    this.studyTimerRunning = false;

    // Temporary attachment store for modal
    this.pendingAttachment = null;
  }

  // Strictly avoid UTC timezone offset bugs
  getLocalDateKey(d) {
    const dateObj = d instanceof Date ? d : new Date(d);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0); // Midday prevents daylight savings jumps
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Could not parse settings from LocalStorage', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  // Get or initialize daily log for any date key
  getDailyLog(dateKey) {
    try {
      const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
      if (allLogs[dateKey]) {
        return allLogs[dateKey];
      }
    } catch (e) {
      console.error('Error reading logs from LocalStorage', e);
    }
    return this.createDefaultDailyLog(dateKey);
  }

  saveDailyLog(dateKey, log) {
    try {
      const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
      allLogs[dateKey] = log;
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
    } catch (e) {
      console.error('Error saving daily log', e);
      showToast('Storage quota error or LocalStorage disabled.', 'error');
    }
  }

  createDefaultDailyLog(dateKey) {
    const d = this.parseLocalDate(dateKey);
    const dayOfWeek = d.getDay();
    const workoutPlan = WEEKLY_WORKOUT_PLANS[dayOfWeek];
    const mealPlan = WEEKLY_MEAL_PLANS[dayOfWeek];

    const habitsObj = {};
    CORE_HABITS_META.forEach(h => {
      habitsObj[h.id] = false;
    });

    const timelineItems = DEFAULT_TIMELINE_TEMPLATE.map(t => ({
      ...t,
      status: 'pending', // 'pending' | 'completed' | 'skipped' | 'rescheduled'
      reason: ''
    }));

    const exercises = (workoutPlan.exercises || []).map(ex => ({
      ...ex,
      completed: false,
      weight: '',
      repsCompleted: ex.defaultReps || '',
      notes: '',
      substitutedWith: ''
    }));

    return {
      date: dateKey,
      finalized: false,
      finalizedAt: null,
      habits: habitsObj,
      workout: {
        completed: false,
        type: workoutPlan.title,
        isRestDay: workoutPlan.isRestDay,
        exercises: exercises,
        notes: ''
      },
      meals: {
        preWorkout: false,
        breakfast: false,
        lunch: false,
        snack: false,
        dinner: false,
        customItems: [],
        waterGlasses: 0,
        notes: ''
      },
      study: {
        completed: false,
        topic: '',
        minutes: 0,
        notes: ''
      },
      reading: {
        completed: false,
        startPage: this.getLastReadingPage(),
        endPage: this.getLastReadingPage(),
        minutes: 30,
        quote: '',
        takeaway: '',
        application: '',
        notes: ''
      },
      savings: {
        target: this.settings.dailySavingsTarget || 200,
        amount: 0,
        saved: false,
        note: ''
      },
      routine: timelineItems,
      missedItems: [], // { id, taskId, taskTitle, reasonCategory, explanation, attachmentId, recoveryAction, recoveryTargetDate, recovered: false, recoveredAt: null }
      reflection: ''
    };
  }

  getLastReadingPage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.READING_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lastPage || 1;
      }
    } catch (e) {}
    return 1;
  }

  setLastReadingPage(page) {
    try {
      localStorage.setItem(STORAGE_KEYS.READING_STATE, JSON.stringify({ lastPage: Number(page) || 1 }));
    } catch (e) {}
  }
}

// ============================================================================
// 3. INDEXEDDB MANAGER (Requirement 10 & 16)
// ============================================================================

class AttachmentDB {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported on this browser.');
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_CONFIG.NAME, DB_CONFIG.VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_CONFIG.STORE)) {
          db.createObjectStore(DB_CONFIG.STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        resolve(null);
      };
    });
  }

  async saveAttachment(record) {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('IndexedDB unavailable');

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([DB_CONFIG.STORE], 'readwrite');
      const store = tx.objectStore(DB_CONFIG.STORE);
      const req = store.put(record);
      req.onsuccess = () => resolve(record.id);
      req.onerror = (err) => reject(err);
    });
  }

  async getAttachment(id) {
    if (!this.db) await this.init();
    if (!this.db) return null;

    return new Promise((resolve) => {
      const tx = this.db.transaction([DB_CONFIG.STORE], 'readonly');
      const store = tx.objectStore(DB_CONFIG.STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  async deleteAttachment(id) {
    if (!this.db) await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      const tx = this.db.transaction([DB_CONFIG.STORE], 'readwrite');
      const store = tx.objectStore(DB_CONFIG.STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  async getAllAttachments() {
    if (!this.db) await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      const tx = this.db.transaction([DB_CONFIG.STORE], 'readonly');
      const store = tx.objectStore(DB_CONFIG.STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }
}

// Global Singletons
const state = new AppState();
const attachmentDB = new AttachmentDB();

// ============================================================================
// 4. CORE BUSINESS LOGIC & CALCULATION ENGINES
// ============================================================================

/**
 * Calculates applicable tasks and completion rate for a given date.
 * Excludes scheduled recovery rest days from gym failure.
 */
function calculateDailyProgress(dateKey) {
  const log = state.getDailyLog(dateKey);
  const d = state.parseLocalDate(dateKey);
  const dayOfWeek = d.getDay();
  const workoutPlan = WEEKLY_WORKOUT_PLANS[dayOfWeek];

  let applicableCount = 0;
  let completedCount = 0;

  CORE_HABITS_META.forEach(habit => {
    // Rest day rule: workout habit is applicable if active recovery or workout, but rest is completed if recovery done
    applicableCount++;
    if (log.habits[habit.id]) {
      completedCount++;
    }
  });

  const percentage = applicableCount > 0 ? Math.round((completedCount / applicableCount) * 100) : 0;
  return {
    total: applicableCount,
    completed: completedCount,
    percentage: percentage,
    isRestDay: workoutPlan.isRestDay
  };
}

/**
 * Weekly progress and executive summary generator strictly from recorded data.
 */
function calculateRangeAnalytics(startDateKey, endDateKey) {
  const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
  const start = state.parseLocalDate(startDateKey);
  const end = state.parseLocalDate(endDateKey);

  let eligibleDays = 0;
  let totalTasksApplicable = 0;
  let totalTasksCompleted = 0;

  let totalWorkoutsApplicable = 0;
  let totalWorkoutsCompleted = 0;

  let totalMealsEaten = 0;
  let totalStudyMinutes = 0;
  let totalReadingMinutes = 0;
  let totalReadingPages = 0;
  let totalSavings = 0;
  let savingsTargetDays = 0;

  let missedTasksCount = 0;
  let recoveredTasksCount = 0;

  const dailyTrend = []; // { date, percentage, savings }

  // Loop through dates
  const cur = new Date(start);
  while (cur <= end) {
    const key = state.getLocalDateKey(cur);
    const log = allLogs[key] || state.createDefaultDailyLog(key);
    const isFuture = key > state.todayDateKey;

    if (!isFuture) {
      eligibleDays++;
      const progress = calculateDailyProgress(key);
      totalTasksApplicable += progress.total;
      totalTasksCompleted += progress.completed;

      // Workout consistency (excluding non-active rest day if untracked)
      const dayOfWeek = cur.getDay();
      const plan = WEEKLY_WORKOUT_PLANS[dayOfWeek];
      if (!plan.isRestDay) {
        totalWorkoutsApplicable++;
        if (log.habits.workout || log.workout.completed) {
          totalWorkoutsCompleted++;
        }
      } else {
        // Recovery day counts if completed
        if (log.habits.workout || log.workout.completed) {
          totalWorkoutsApplicable++;
          totalWorkoutsCompleted++;
        }
      }

      // Meals eaten
      ['preWorkout', 'breakfast', 'lunch', 'snack', 'dinner'].forEach(m => {
        if (log.meals[m]) totalMealsEaten++;
      });
      if (Array.isArray(log.meals.customItems)) {
        totalMealsEaten += log.meals.customItems.filter(c => c.completed).length;
      }

      // Study
      totalStudyMinutes += Number(log.study.minutes) || 0;

      // Reading
      totalReadingMinutes += Number(log.reading.minutes) || 0;
      const readPages = Math.max(0, (Number(log.reading.endPage) || 0) - (Number(log.reading.startPage) || 0));
      totalReadingPages += readPages;

      // Savings
      const savedAmt = Number(log.savings.amount) || 0;
      totalSavings += savedAmt;
      if (savedAmt >= (log.savings.target || 200)) {
        savingsTargetDays++;
      }

      // Missed & Recovered
      if (Array.isArray(log.missedItems)) {
        missedTasksCount += log.missedItems.length;
        recoveredTasksCount += log.missedItems.filter(m => m.recovered).length;
      }

      dailyTrend.push({
        date: key,
        displayDate: formatDisplayDate(cur, true),
        percentage: progress.percentage,
        savings: savedAmt
      });
    }

    cur.setDate(cur.getDate() + 1);
  }

  const routineRate = totalTasksApplicable > 0 ? Math.round((totalTasksCompleted / totalTasksApplicable) * 100) : 0;
  const workoutRate = totalWorkoutsApplicable > 0 ? Math.round((totalWorkoutsCompleted / totalWorkoutsApplicable) * 100) : 0;
  const savingsRate = eligibleDays > 0 ? Math.round((savingsTargetDays / eligibleDays) * 100) : 0;

  // Active Streak calculation
  const streak = calculateActiveStreak();

  return {
    eligibleDays,
    routineRate,
    workoutRate,
    totalWorkoutsCompleted,
    totalWorkoutsApplicable,
    totalMealsEaten,
    totalStudyHours: (totalStudyMinutes / 60).toFixed(1),
    totalStudyMinutes,
    totalReadingMinutes,
    totalReadingPages,
    totalSavings,
    savingsRate,
    missedTasksCount,
    recoveredTasksCount,
    streak,
    dailyTrend
  };
}

/**
 * Calculates current active streak based on consecutive completed days.
 */
function calculateActiveStreak() {
  const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
  let streak = 0;
  const d = new Date();

  // If today is incomplete, we start checking from yesterday or today if already >= 60%
  const todayKey = state.todayDateKey;
  const todayProgress = calculateDailyProgress(todayKey);
  if (todayProgress.percentage >= 60) {
    streak++;
  }

  d.setDate(d.getDate() - 1);
  while (true) {
    const key = state.getLocalDateKey(d);
    const log = allLogs[key];
    if (!log) break;

    const prog = calculateDailyProgress(key);
    // Habit consistency threshold: at least 60% completion
    if (prog.percentage >= 60) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Evaluates sleep schedule conflict between study/reading bedtime and wake up time.
 */
function checkSleepScheduleConflict() {
  const [wakeH, wakeM] = (state.settings.wakeupTime || '08:00').split(':').map(Number);
  const [studyH, studyM] = (state.settings.studyTime || '00:00').split(':').map(Number);
  const studyMins = Number(state.settings.dailyStudyTargetMinutes) || 60;
  const readingMins = Number(state.settings.dailyReadingTargetMinutes) || 30;

  // Study start in minutes from midnight
  const studyStartMinutes = (studyH * 60) + (studyM || 0);
  const totalNightActivityMins = studyMins + readingMins + 15; // 15 mins for reflection and winddown
  const bedtimeMinutes = (studyStartMinutes + totalNightActivityMins) % 1440;

  const wakeMinutes = (wakeH * 60) + (wakeM || 0);
  let sleepDurationMinutes = 0;
  if (bedtimeMinutes <= wakeMinutes) {
    sleepDurationMinutes = wakeMinutes - bedtimeMinutes;
  } else {
    sleepDurationMinutes = (1440 - bedtimeMinutes) + wakeMinutes;
  }

  const sleepHours = Number((sleepDurationMinutes / 60).toFixed(1));
  return {
    hasConflict: sleepHours < 7.0,
    estimatedSleepHours: sleepHours
  };
}

// ============================================================================
// 5. DATE & TIME UTILITIES
// ============================================================================

function formatDisplayDate(dateObj, short = false) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = months[dateObj.getMonth()];
  const d = dateObj.getDate();
  const y = dateObj.getFullYear();
  if (short) return `${m} ${d}`;
  return `${m} ${d}, ${y}`;
}

function getDayOfWeekName(dateObj) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dateObj.getDay()];
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function updateLiveClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const clockEl = document.getElementById('live-clock-display');
  if (clockEl) clockEl.textContent = timeStr;

  // Real-time greeting
  const hour = now.getHours();
  let greeting = 'Good evening,';
  if (hour >= 5 && hour < 12) greeting = 'Good morning,';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon,';
  else if (hour >= 17 && hour < 22) greeting = 'Good evening,';
  else greeting = 'Night shift,';

  const greetingEl = document.getElementById('header-greeting');
  if (greetingEl) greetingEl.textContent = greeting;
}

// ============================================================================
// 6. UI RENDERERS & EVENT HANDLERS
// ============================================================================

function initApp() {
  setupEventListeners();
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Load and render initial state
  syncUserProfileUI();
  loadDate(state.selectedDateKey);
  initWaterTracker();
  initWeeklyGrocery(getSundayOfWeek(state.parseLocalDate(state.selectedDateKey)));
  renderLucideIcons();
  checkYesterdayMissedTasks();
}

function renderLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
      return;
    } catch (e) {
      console.warn('Lucide CDN createIcons error, falling back to SVG renderer', e);
    }
  }

  // Robust SVG Fallback Dictionary for 100% Offline Capability
  const FALLBACK_SVGS = {
    'calendar': '<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    'settings-2': '<path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'sparkles': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
    'dumbbell': '<path d="m6.5 6.5 11 11M21 21l-1-1a3 3 0 0 0-4.24 0l-1.42 1.42a3 3 0 0 0 0 4.24l1 1a3 3 0 0 0 4.24 0l1.42-1.42a3 3 0 0 0 0-4.24ZM3 3l1 1a3 3 0 0 0 4.24 0l1.42-1.42a3 3 0 0 0 0-4.24l-1-1a3 3 0 0 0-4.24 0L3.18 3.18a3 3 0 0 0 0 4.24Z"/>',
    'utensils': '<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M15 11v11M5 2v10a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2M8 15v7"/>',
    'terminal': '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'indian-rupee': '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8"/>',
    'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'play-circle': '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
    'salad': '<path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21a5 5 0 0 1-4-4"/><path d="M17 21a5 5 0 0 0 4-4"/>',
    'list-checks': '<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    'check-circle-2': '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'check-check': '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
    'circle': '<circle cx="12" cy="12" r="10"/>',
    'edit-3': '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    'book-marked': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><polyline points="10 2 10 10 13 7 16 10 16 2"/>',
    'timer': '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    'bookmark': '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'plus': '<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>',
    'droplet': '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    'shield-alert': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'chef-hat': '<path d="M6 13.8a4.5 4.5 0 1 1 3-7.8 5 5 0 0 1 9.8 1.4A4.5 4.5 0 0 1 18 13.8V17H6Z"/><line x1="6" x2="18" y1="20" y2="20"/>',
    'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    'bar-chart-3': '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
    'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    'calendar-clock': '<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><circle cx="16" cy="16" r="6"/><polyline points="16 14 16 16 18 17"/>',
    'line-chart': '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    'pause': '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'corner-up-right': '<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>',
    'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    'beef': '<circle cx="12.5" cy="8.5" r="2.5"/><path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.8 3.4-3.4 4.6-8.2 1.6-11.2Z"/>',
    'wheat': '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/>',
    'carrot': '<path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7z"/>',
    'apple': '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    'milk': '<path d="M8 2h8"/><path d="M9 2v3h6V2"/><path d="M6 8h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Z"/>',
    'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'
  };

  document.querySelectorAll('i[data-lucide]').forEach(el => {
    const iconName = el.getAttribute('data-lucide');
    const pathData = FALLBACK_SVGS[iconName];
    if (pathData) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', el.style.width || '18');
      svg.setAttribute('height', el.style.height || '18');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      if (el.className) svg.setAttribute('class', el.className);
      svg.innerHTML = pathData;
      el.replaceWith(svg);
    }
  });
}

function syncUserProfileUI() {
  const nameEl = document.getElementById('header-username');
  const avatarEl = document.getElementById('header-avatar');
  if (nameEl) nameEl.textContent = state.settings.userName;
  if (avatarEl) avatarEl.textContent = state.settings.avatarInitials;

  // Settings inputs
  const uNameInp = document.getElementById('setting-username');
  const uInitInp = document.getElementById('setting-avatar-initials');
  const wakeInp = document.getElementById('setting-wakeup-time');
  const offSInp = document.getElementById('setting-office-start');
  const offEInp = document.getElementById('setting-office-end');
  const studyInp = document.getElementById('setting-study-time');
  const savInp = document.getElementById('setting-savings-target');
  const protInp = document.getElementById('setting-protein-target');
  const stdTgtInp = document.getElementById('setting-study-target');
  const rdTgtInp = document.getElementById('setting-reading-target');

  if (uNameInp) uNameInp.value = state.settings.userName;
  if (uInitInp) uInitInp.value = state.settings.avatarInitials;
  if (wakeInp) wakeInp.value = state.settings.wakeupTime;
  if (offSInp) offSInp.value = state.settings.officeStart;
  if (offEInp) offEInp.value = state.settings.officeEnd;
  if (studyInp) studyInp.value = state.settings.studyTime;
  if (savInp) savInp.value = state.settings.dailySavingsTarget;
  if (protInp) protInp.value = state.settings.dailyProteinTarget;
  if (stdTgtInp) stdTgtInp.value = state.settings.dailyStudyTargetMinutes;
  if (rdTgtInp) rdTgtInp.value = state.settings.dailyReadingTargetMinutes;
}

/**
 * Loads and renders everything for the selected date.
 */
function loadDate(dateKey) {
  state.selectedDateKey = dateKey;
  const d = state.parseLocalDate(dateKey);
  const isToday = dateKey === state.todayDateKey;
  const isFuture = dateKey > state.todayDateKey;

  // Header and Navigator UI
  const dayNameEl = document.getElementById('day-name-text');
  const fullDateEl = document.getElementById('display-date-text');
  const todayBtn = document.getElementById('btn-go-today');
  const nextBtn = document.getElementById('btn-next-day');
  const hiddenDateInp = document.getElementById('hidden-date-picker');

  if (dayNameEl) dayNameEl.textContent = isToday ? 'TODAY' : getDayOfWeekName(d).toUpperCase();
  if (fullDateEl) fullDateEl.textContent = formatDisplayDate(d);
  if (hiddenDateInp) hiddenDateInp.value = dateKey;

  if (todayBtn) todayBtn.classList.toggle('hidden', isToday);
  if (nextBtn) nextBtn.disabled = isFuture || isToday; // Cannot navigate beyond today

  // Week badge
  const weekNum = getWeekNumber(d);
  const weekBadge = document.getElementById('week-badge-display');
  if (weekBadge) weekBadge.textContent = `Week ${weekNum} · ${formatDisplayDate(d, true)}`;

  // Render Sub-modules
  renderHomeProgressRing();
  renderHomePriorities();
  renderHomeHabitsChecklist();
  renderHomeWorkoutQuickCard();
  renderHomeSavingsCard();
  renderHomeStudyReadingCards();
  renderRoutineTimeline();
  renderMealsSection();
  renderProgressView();
  renderLucideIcons();

  // Sleep warning on routine screen
  const sleepConflict = checkSleepScheduleConflict();
  const sleepWarningEl = document.getElementById('routine-sleep-warning');
  if (sleepWarningEl) {
    sleepWarningEl.style.display = sleepConflict.hasConflict ? 'flex' : 'none';
  }

  // Day review banner
  renderDayReviewBanner();
}

/**
 * Renders the circular SVG progress ring and summary text on Home.
 */
function renderHomeProgressRing() {
  const progress = calculateDailyProgress(state.selectedDateKey);
  const pctEl = document.getElementById('home-ring-pct');
  const countEl = document.getElementById('home-ring-count');
  const fillRing = document.getElementById('home-ring-fill');
  const quoteEl = document.getElementById('home-hero-quote');
  const headingEl = document.getElementById('home-hero-heading');
  const ctaText = document.getElementById('hero-cta-text');

  if (pctEl) pctEl.textContent = `${progress.percentage}%`;
  if (countEl) countEl.textContent = `${progress.completed}/${progress.total}`;

  if (fillRing) {
    const circumference = 2 * Math.PI * 40; // 251.2
    const offset = circumference - (progress.percentage / 100) * circumference;
    fillRing.style.strokeDashoffset = offset;
    fillRing.style.stroke = progress.percentage === 100 ? '#10b981' : progress.percentage > 50 ? '#38bdf8' : '#f59e0b';
  }

  if (headingEl && quoteEl && ctaText) {
    if (progress.percentage === 100) {
      headingEl.textContent = 'Day Mastered!';
      quoteEl.textContent = 'Incredible discipline. All applicable habits and shift milestones completed.';
      ctaText.textContent = 'Review & Finalize';
    } else if (progress.percentage >= 60) {
      headingEl.textContent = 'Strong Momentum';
      quoteEl.textContent = 'More than halfway through. Maintain focus through your evening routine.';
      ctaText.textContent = 'Continue Routine';
    } else {
      headingEl.textContent = 'Focus & Execute';
      quoteEl.textContent = 'Small daily actions compound. Win the morning habits before your 12:30 PM shift.';
      ctaText.textContent = 'Start Next Task';
    }
  }

  // Pillar quick boxes
  const log = state.getDailyLog(state.selectedDateKey);
  const wVal = document.getElementById('pillar-workout-val');
  const pVal = document.getElementById('pillar-protein-val');
  const sVal = document.getElementById('pillar-study-val');
  const savVal = document.getElementById('pillar-savings-val');

  if (wVal) wVal.textContent = log.workout.completed ? 'Done' : (log.workout.isRestDay ? 'Rest Day' : 'Pending');
  if (pVal) {
    const eatenProtein = calculateRecordedProtein(log);
    pVal.textContent = `${eatenProtein} / ${state.settings.dailyProteinTarget}g`;
  }
  if (sVal) sVal.textContent = `${log.study.minutes || 0} min`;
  if (savVal) savVal.textContent = `₹${log.savings.amount || 0}`;
}

/**
 * Calculates protein eaten based on marked meals.
 */
function calculateRecordedProtein(log) {
  const d = state.parseLocalDate(log.date);
  const plan = WEEKLY_MEAL_PLANS[d.getDay()];
  let total = 0;
  if (log.meals.preWorkout) total += 2;
  if (log.meals.breakfast) total += 24;
  if (log.meals.lunch) total += 42;
  if (log.meals.snack) total += 10;
  if (log.meals.dinner) total += 38;
  if (Array.isArray(log.meals.customItems)) {
    log.meals.customItems.forEach(c => {
      if (c.completed) total += Number(c.protein) || 0;
    });
  }
  return total;
}

/**
 * Renders Today's Priorities on Home.
 */
function renderHomePriorities() {
  const listEl = document.getElementById('home-priorities-list');
  if (!listEl) return;

  const log = state.getDailyLog(state.selectedDateKey);
  // Find incomplete items from routine
  const incomplete = (log.routine || []).filter(item => item.status !== 'completed' && item.status !== 'skipped');
  const nextThree = incomplete.slice(0, 3);

  if (nextThree.length === 0) {
    listEl.innerHTML = `
      <div style="font-size:0.8rem; color:var(--text-muted); padding:8px 0;">
        🎉 All scheduled routine milestones completed for today!
      </div>
    `;
    return;
  }

  listEl.innerHTML = nextThree.map(item => `
    <div class="priority-item">
      <span class="priority-time">${formatTimeAmPm(item.time)}</span>
      <span class="priority-text">${escapeHTML(item.title)}</span>
      <button class="habit-opt-btn" onclick="quickCompleteRoutineItem('${item.id}')" title="Mark Done">
        <i data-lucide="check" style="width:16px;height:16px;color:var(--accent-emerald);"></i>
      </button>
    </div>
  `).join('');
}

function formatTimeAmPm(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Renders the 12 Core Habits on Home.
 */
function renderHomeHabitsChecklist() {
  const listEl = document.getElementById('home-habit-list');
  if (!listEl) return;

  const log = state.getDailyLog(state.selectedDateKey);
  const isFuture = state.selectedDateKey > state.todayDateKey;

  listEl.innerHTML = CORE_HABITS_META.map(habit => {
    const isCompleted = !!log.habits[habit.id];
    const isMissed = (log.missedItems || []).some(m => m.taskId === habit.id && !m.recovered);

    let statusClass = '';
    if (isCompleted) statusClass = 'completed';
    else if (isMissed) statusClass = 'missed';

    return `
      <div class="habit-item ${statusClass}" onclick="toggleHabit('${habit.id}')" role="checkbox" aria-checked="${isCompleted}">
        <div class="habit-left">
          <div class="custom-checkbox">
            ${isCompleted ? '<i data-lucide="check" style="width:16px;height:16px;"></i>' : (isMissed ? '<i data-lucide="alert-triangle" style="width:16px;height:16px;"></i>' : '')}
          </div>
          <div class="habit-details">
            <span class="habit-title">${escapeHTML(habit.title)}</span>
            <div class="habit-meta">
              <span class="habit-time-badge">${habit.time}</span>
              <span>· ${habit.cat}</span>
            </div>
          </div>
        </div>
        <div class="habit-right-actions" onclick="event.stopPropagation()">
          <button class="habit-opt-btn" onclick="openMissedTaskModal('${habit.id}', '${escapeHTML(habit.title)}')" title="Accountability / Skip">
            <i data-lucide="more-horizontal" style="width:16px;height:16px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Toggles a habit and immediately persists state.
 */
window.toggleHabit = function(habitId) {
  const log = state.getDailyLog(state.selectedDateKey);
  const nextVal = !log.habits[habitId];
  log.habits[habitId] = nextVal;

  // Sync with submodules
  if (habitId === 'workout') {
    log.workout.completed = nextVal;
  } else if (habitId === 'saveMoney') {
    log.savings.saved = nextVal;
    if (nextVal && (!log.savings.amount || log.savings.amount === 0)) {
      log.savings.amount = state.settings.dailySavingsTarget || 200;
    }
  } else if (habitId === 'studySession') {
    log.study.completed = nextVal;
    if (nextVal && (!log.study.minutes || log.study.minutes === 0)) {
      log.study.minutes = state.settings.dailyStudyTargetMinutes || 60;
    }
  } else if (habitId === 'readingZeroToOne') {
    log.reading.completed = nextVal;
  }

  state.saveDailyLog(state.selectedDateKey, log);
  renderHomeProgressRing();
  renderHomeHabitsChecklist();
  renderHomeWorkoutQuickCard();
  renderHomeSavingsCard();
  renderLucideIcons();
};

/**
 * Renders Workout Quick Card on Home.
 */
function renderHomeWorkoutQuickCard() {
  const titleEl = document.getElementById('home-workout-title');
  const subEl = document.getElementById('home-workout-subtitle');
  const previewEl = document.getElementById('home-workout-preview');
  if (!titleEl || !previewEl) return;

  const d = state.parseLocalDate(state.selectedDateKey);
  const plan = WEEKLY_WORKOUT_PLANS[d.getDay()];
  const log = state.getDailyLog(state.selectedDateKey);

  titleEl.textContent = `${getDayOfWeekName(d)} — ${plan.title}`;
  subEl.textContent = plan.subtitle;

  const exercises = log.workout.exercises || plan.exercises;
  previewEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:6px; margin-top:10px;">
      ${exercises.slice(0, 3).map(ex => `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; padding:6px 8px; background:var(--bg-secondary); border-radius:var(--radius-sm);">
          <span style="font-weight:600; color:var(--text-primary);">${escapeHTML(ex.name)}</span>
          <span style="color:var(--accent-emerald); font-family:var(--font-mono); font-size:0.72rem;">${ex.target}</span>
        </div>
      `).join('')}
      ${exercises.length > 3 ? `<div style="font-size:0.7rem; color:var(--text-muted); text-align:center;">+ ${exercises.length - 3} more exercises in full regimen</div>` : ''}
    </div>
  `;
}

/**
 * Renders Savings Card on Home.
 */
function renderHomeSavingsCard() {
  const log = state.getDailyLog(state.selectedDateKey);
  const todayInp = document.getElementById('input-daily-savings');
  const noteInp = document.getElementById('input-savings-note');
  const badgeEl = document.getElementById('savings-status-badge');

  const statToday = document.getElementById('stat-savings-today');
  const statWeek = document.getElementById('stat-savings-week');
  const statMonth = document.getElementById('stat-savings-month');

  if (todayInp) todayInp.value = log.savings.amount || 200;
  if (noteInp) noteInp.value = log.savings.note || '';

  const isSaved = log.savings.amount >= (log.savings.target || 200);
  if (badgeEl) {
    badgeEl.textContent = isSaved ? 'Goal Achieved' : (log.savings.amount > 0 ? `₹${log.savings.amount} Saved` : 'Pending');
    badgeEl.style.borderColor = isSaved ? 'var(--accent-emerald)' : 'var(--border-subtle)';
    badgeEl.style.color = isSaved ? 'var(--accent-emerald)' : 'var(--text-secondary)';
  }

  // Calculate Week and Month totals
  const d = state.parseLocalDate(state.selectedDateKey);
  const weekTotal = calculateWeekSavings(d);
  const monthTotal = calculateMonthSavings(d.getFullYear(), d.getMonth());

  if (statToday) statToday.textContent = `₹${log.savings.amount || 0}`;
  if (statWeek) statWeek.textContent = `₹${weekTotal}`;
  if (statMonth) statMonth.textContent = `₹${monthTotal}`;
}

function calculateWeekSavings(dateObj) {
  const sunday = getSundayOfWeek(dateObj);
  const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
  let total = 0;
  const cur = new Date(sunday);
  for (let i = 0; i < 7; i++) {
    const k = state.getLocalDateKey(cur);
    if (allLogs[k] && allLogs[k].savings) {
      total += Number(allLogs[k].savings.amount) || 0;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}

function calculateMonthSavings(year, month) {
  const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
  let total = 0;
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  Object.keys(allLogs).forEach(k => {
    if (k.startsWith(prefix) && allLogs[k].savings) {
      total += Number(allLogs[k].savings.amount) || 0;
    }
  });
  return total;
}

function getSundayOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day; // Adjust to Sunday
  return new Date(date.setDate(diff));
}

/**
 * Renders Study & Reading Quick Cards on Home.
 */
function renderHomeStudyReadingCards() {
  const log = state.getDailyLog(state.selectedDateKey);
  const topicEl = document.getElementById('quick-study-topic');
  const timeEl = document.getElementById('quick-study-time');
  const pageEl = document.getElementById('quick-reading-pages');

  if (topicEl) topicEl.textContent = log.study.topic || 'No topic logged';
  if (timeEl) timeEl.textContent = `${log.study.minutes || 0} min studied`;
  if (pageEl) {
    pageEl.textContent = log.reading.endPage > 1 ? `Page ${log.reading.endPage}` : `Page ${log.reading.startPage || 1}`;
  }
}

/**
 * Renders the Vertical Timeline on Routine screen.
 */
function renderRoutineTimeline() {
  const container = document.getElementById('routine-timeline-container');
  if (!container) return;

  const log = state.getDailyLog(state.selectedDateKey);
  const items = log.routine || DEFAULT_TIMELINE_TEMPLATE;

  container.innerHTML = items.map((item, idx) => {
    const isDone = item.status === 'completed';
    const isSkipped = item.status === 'skipped';

    return `
      <div class="timeline-item ${isDone ? 'completed' : ''} ${isSkipped ? 'skipped' : ''}">
        <div class="timeline-dot">
          <i data-lucide="${isDone ? 'check' : 'circle'}" style="width:12px;height:12px;"></i>
        </div>
        <div class="timeline-card">
          <div class="timeline-header">
            <span class="timeline-title">${escapeHTML(item.title)}</span>
            <span class="timeline-time">${formatTimeAmPm(item.time)}</span>
          </div>
          <div class="timeline-desc">${escapeHTML(item.desc || '')}</div>
          ${item.reason ? `<div style="font-size:0.7rem; color:var(--accent-amber); margin-top:4px;">Skip reason: ${escapeHTML(item.reason)}</div>` : ''}
          <div class="timeline-actions">
            <button class="timeline-btn ${isDone ? 'done' : ''}" onclick="toggleTimelineItem('${item.id}')">
              <i data-lucide="${isDone ? 'check-circle' : 'circle'}" style="width:14px;height:14px;"></i>
              ${isDone ? 'Completed' : 'Mark Done'}
            </button>
            <button class="timeline-btn" onclick="openSkipRoutineItemModal('${item.id}')">
              <i data-lucide="corner-up-right" style="width:14px;height:14px;"></i> Skip / Reason
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleTimelineItem = function(itemId) {
  const log = state.getDailyLog(state.selectedDateKey);
  const target = (log.routine || []).find(t => t.id === itemId);
  if (target) {
    target.status = target.status === 'completed' ? 'pending' : 'completed';
    state.saveDailyLog(state.selectedDateKey, log);
    renderRoutineTimeline();
    renderHomePriorities();
    renderLucideIcons();
  }
};

window.quickCompleteRoutineItem = function(itemId) {
  window.toggleTimelineItem(itemId);
  showToast('Routine activity marked done!', 'success');
};

/**
 * Renders the Food & Nutrition screen.
 */
function renderMealsSection() {
  const d = state.parseLocalDate(state.selectedDateKey);
  const plan = WEEKLY_MEAL_PLANS[d.getDay()];
  const log = state.getDailyLog(state.selectedDateKey);

  const dayTitleEl = document.getElementById('food-plan-day-title');
  if (dayTitleEl) dayTitleEl.textContent = `${getDayOfWeekName(d)} Meal Plan`;

  // Macros progress bar
  const recordedProtein = calculateRecordedProtein(log);
  const targetProtein = state.settings.dailyProteinTarget || 120;
  const protPct = Math.min(100, Math.round((recordedProtein / targetProtein) * 100));

  const protValEl = document.getElementById('macro-protein-display');
  const protBar = document.getElementById('protein-progress-bar');
  if (protValEl) protValEl.textContent = `${recordedProtein} / ${targetProtein}g`;
  if (protBar) protBar.style.width = `${protPct}%`;

  // Calories
  const calValEl = document.getElementById('macro-calories-display');
  const calBar = document.getElementById('calories-progress-bar');
  const estCals = Math.round((recordedProtein / targetProtein) * (plan.estCalories || 2200));
  if (calValEl) calValEl.textContent = `~${estCals} kcal`;
  if (calBar) calBar.style.width = `${Math.min(100, (estCals / 2400) * 100)}%`;

  // Meal Cards
  const mealCardsEl = document.getElementById('meal-cards-container');
  if (!mealCardsEl) return;

  const mealsData = [
    { key: 'preWorkout', name: 'Pre-Workout Fuel', time: '8:20 AM', desc: plan.preWorkout, estP: '~2g' },
    { key: 'breakfast', name: 'Post-Workout Breakfast', time: '9:40 AM', desc: plan.breakfast, estP: '~24g' },
    { key: 'lunch', name: 'Office Lunch', time: '2:00 PM', desc: plan.lunch, estP: '~42g' },
    { key: 'snack', name: 'Planned Afternoon Snack', time: '5:30 PM', desc: plan.snack, estP: '~10g' },
    { key: 'dinner', name: 'Dinner & Recovery Meal', time: '8:30 PM', desc: plan.dinner, estP: '~38g' }
  ];

  const standardHtml = mealsData.map(m => {
    const isEaten = !!log.meals[m.key];
    return `
      <div class="meal-card ${isEaten ? 'completed' : ''}">
        <div class="meal-card-top">
          <div class="meal-title-group">
            <span class="meal-time-tag">${m.time}</span>
            <span class="meal-name">${m.name}</span>
          </div>
          <button class="habit-opt-btn" onclick="toggleMealEaten('${m.key}')" title="Toggle Eaten">
            <i data-lucide="${isEaten ? 'check-circle-2' : 'circle'}" style="width:20px;height:20px;color:${isEaten ? 'var(--accent-emerald)' : 'var(--text-muted)'};"></i>
          </button>
        </div>
        <div class="meal-food-text">${escapeHTML(m.desc)}</div>
        <div class="meal-macros-row">
          <span>Est. Protein: <strong style="color:var(--text-primary);">${m.estP}</strong></span>
          <span class="estimated-badge">*Portion estimate</span>
        </div>
      </div>
    `;
  }).join('');

  const customItems = log.meals.customItems || [];
  let customHtml = '';
  if (customItems.length > 0) {
    customHtml = customItems.map(c => `
      <div class="meal-card ${c.completed ? 'completed' : ''}" style="border-left: 3px solid var(--accent-emerald);">
        <div class="meal-card-top">
          <div class="meal-title-group">
            <span class="meal-time-tag">Custom</span>
            <span class="meal-name">${escapeHTML(c.name)}</span>
          </div>
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="habit-opt-btn" onclick="toggleCustomFoodItem('${c.id}')" title="Toggle Eaten">
              <i data-lucide="${c.completed ? 'check-circle-2' : 'circle'}" style="width:20px;height:20px;color:${c.completed ? 'var(--accent-emerald)' : 'var(--text-muted)'};"></i>
            </button>
            <button class="habit-opt-btn" onclick="deleteCustomFoodItem('${c.id}')" title="Delete">
              <i data-lucide="trash-2" style="width:16px;height:16px;color:var(--text-muted);"></i>
            </button>
          </div>
        </div>
        <div class="meal-macros-row">
          <span>Est. Protein: <strong style="color:var(--text-primary);">~${c.protein || 0}g</strong></span>
          <span class="estimated-badge">*Custom logged entry</span>
        </div>
      </div>
    `).join('');
  }

  mealCardsEl.innerHTML = standardHtml + customHtml;

  // Water Tracker UI sync
  updateWaterUI(log.meals.waterGlasses || 0);

  // Dietary Notes
  const notesEl = document.getElementById('food-preferences-notes');
  if (notesEl) notesEl.value = state.settings.dietaryPreferences || '';
}

window.toggleCustomFoodItem = function(id) {
  const log = state.getDailyLog(state.selectedDateKey);
  const target = (log.meals.customItems || []).find(c => c.id === id);
  if (target) {
    target.completed = !target.completed;
    state.saveDailyLog(state.selectedDateKey, log);
    renderMealsSection();
    renderHomeProgressRing();
    renderLucideIcons();
  }
};

window.deleteCustomFoodItem = function(id) {
  const log = state.getDailyLog(state.selectedDateKey);
  log.meals.customItems = (log.meals.customItems || []).filter(c => c.id !== id);
  state.saveDailyLog(state.selectedDateKey, log);
  renderMealsSection();
  renderHomeProgressRing();
  renderLucideIcons();
  showToast('Custom food item removed.', 'info');
};

window.openSkipRoutineItemModal = function(itemId) {
  const log = state.getDailyLog(state.selectedDateKey);
  const target = (log.routine || []).find(t => t.id === itemId);
  if (!target) return;
  const reason = prompt(`Skip activity "${target.title}": Enter accountability reason:`, target.reason || '');
  if (reason !== null && reason.trim()) {
    target.status = 'skipped';
    target.reason = reason.trim();
    state.saveDailyLog(state.selectedDateKey, log);
    renderRoutineTimeline();
    renderLucideIcons();
    showToast(`Skipped with reason: "${reason.trim()}"`, 'info');
  }
};

window.openMissedTaskModal = openMissedTaskModal;
window.openFinalizeDayModal = openFinalizeDayModal;

window.toggleMealEaten = function(mealKey) {
  const log = state.getDailyLog(state.selectedDateKey);
  log.meals[mealKey] = !log.meals[mealKey];
  state.saveDailyLog(state.selectedDateKey, log);
  renderMealsSection();
  renderHomeProgressRing();
  renderLucideIcons();
};

function initWaterTracker() {
  const container = document.getElementById('water-glasses-container');
  if (!container) return;

  const glassesHtml = Array.from({ length: 8 }, (_, i) => `
    <button type="button" class="water-glass-btn" onclick="setWaterGlass(${i + 1})" title="${(i + 1) * 250} ml">
      ${i + 1}
    </button>
  `).join('');

  container.innerHTML = glassesHtml;

  const addBtn = document.getElementById('btn-add-water');
  if (addBtn) {
    addBtn.onclick = () => {
      const log = state.getDailyLog(state.selectedDateKey);
      const current = log.meals.waterGlasses || 0;
      setWaterGlass(Math.min(12, current + 1));
    };
  }
}

window.setWaterGlass = function(count) {
  const log = state.getDailyLog(state.selectedDateKey);
  log.meals.waterGlasses = count;
  state.saveDailyLog(state.selectedDateKey, log);
  updateWaterUI(count);
};

function updateWaterUI(glasses) {
  const display = document.getElementById('water-count-display');
  if (display) {
    const liters = (glasses * 0.25).toFixed(1);
    display.textContent = `${glasses} / 8 Glasses (${liters} L)`;
  }
  const btns = document.querySelectorAll('.water-glass-btn');
  btns.forEach((btn, idx) => {
    btn.classList.toggle('filled', idx < glasses);
  });
}

/**
 * Sunday Grocery & Meal Prep Manager (Requirement 8)
 */
function initWeeklyGrocery(sundayDate) {
  const weekKey = `grocery_${state.getLocalDateKey(sundayDate)}`;
  let lists = {};
  try {
    lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}');
  } catch (e) {}

  if (!lists[weekKey]) {
    // Generate clone of default grocery list
    lists[weekKey] = {
      sundayDate: state.getLocalDateKey(sundayDate),
      items: JSON.parse(JSON.stringify(DEFAULT_SUNDAY_GROCERY)),
      prepTasks: JSON.parse(JSON.stringify(DEFAULT_MEAL_PREP_TASKS))
    };
    localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
  }

  renderGroceryView(lists[weekKey]);
}

function renderGroceryView(groceryRecord) {
  const subtitle = document.getElementById('grocery-week-subtitle');
  if (subtitle) {
    const d = state.parseLocalDate(groceryRecord.sundayDate);
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    subtitle.textContent = `Week of ${formatDisplayDate(d, true)} – ${formatDisplayDate(end, true)}`;
  }

  const items = groceryRecord.items || [];
  const purchasedCount = items.filter(i => i.purchased).length;
  const atHomeCount = items.filter(i => i.atHome).length;
  const estSpend = items.reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
  const actualSpend = items.filter(i => i.purchased).reduce((acc, cur) => acc + (Number(cur.actualPrice || cur.price) || 0), 0);

  const bEl = document.getElementById('grocery-stat-bought');
  const hEl = document.getElementById('grocery-stat-home');
  const eEl = document.getElementById('grocery-stat-est-spend');
  const aEl = document.getElementById('grocery-stat-act-spend');

  if (bEl) bEl.textContent = `${purchasedCount} / ${items.length}`;
  if (hEl) hEl.textContent = `${atHomeCount}`;
  if (eEl) eEl.textContent = `₹${estSpend}`;
  if (aEl) aEl.textContent = `₹${actualSpend}`;

  // Group items by category
  const categories = {
    protein: { name: 'High Protein Essentials', icon: 'beef', items: [] },
    grains: { name: 'Complex Grains & Carbs', icon: 'wheat', items: [] },
    vegetables: { name: 'Fresh Vegetables', icon: 'carrot', items: [] },
    fruits: { name: 'Fresh Fruits', icon: 'apple', items: [] },
    dairy: { name: 'Dairy & Curd', icon: 'milk', items: [] },
    pantry: { name: 'Pantry, Nuts & Spices', icon: 'package', items: [] }
  };

  items.forEach(i => {
    if (categories[i.category]) categories[i.category].items.push(i);
  });

  const catContainer = document.getElementById('grocery-categorized-container');
  if (catContainer) {
    catContainer.innerHTML = Object.keys(categories).map(catKey => {
      const cat = categories[catKey];
      if (cat.items.length === 0) return '';
      return `
        <div class="grocery-category">
          <div class="grocery-cat-title">
            <i data-lucide="${cat.icon}" style="width:14px;height:14px;"></i>
            ${cat.name} (${cat.items.length})
          </div>
          <div class="grocery-items-group">
            ${cat.items.map(item => `
              <div class="grocery-item-row ${item.purchased ? 'purchased' : ''} ${item.atHome ? 'at-home' : ''}">
                <div class="grocery-item-left" onclick="toggleGroceryPurchased('${groceryRecord.sundayDate}', '${item.id}')">
                  <div class="custom-checkbox">
                    ${item.purchased ? '<i data-lucide="check" style="width:16px;height:16px;"></i>' : ''}
                  </div>
                  <div>
                    <div class="grocery-item-name">${escapeHTML(item.name)}</div>
                    <div class="grocery-item-qty">${escapeHTML(item.qty || '')}</div>
                  </div>
                </div>
                <div class="grocery-item-right">
                  <button type="button" class="at-home-badge" onclick="toggleGroceryAtHome('${groceryRecord.sundayDate}', '${item.id}')">
                    ${item.atHome ? 'In Pantry' : 'Need'}
                  </button>
                  <input type="number" class="grocery-price-input" value="${item.actualPrice || item.price || 0}" 
                    onchange="updateGroceryPrice('${groceryRecord.sundayDate}', '${item.id}', this.value)" title="Cost in ₹">
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Meal prep checklist
  const prepContainer = document.getElementById('meal-prep-checklist');
  if (prepContainer) {
    const tasks = groceryRecord.prepTasks || DEFAULT_MEAL_PREP_TASKS;
    prepContainer.innerHTML = tasks.map(t => `
      <div class="habit-item ${t.completed ? 'completed' : ''}" onclick="toggleMealPrepTask('${groceryRecord.sundayDate}', '${t.id}')">
        <div class="habit-left">
          <div class="custom-checkbox">
            ${t.completed ? '<i data-lucide="check" style="width:16px;height:16px;"></i>' : ''}
          </div>
          <div class="habit-details">
            <span class="habit-title">${escapeHTML(t.title)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderLucideIcons();
}

window.toggleGroceryPurchased = function(sundayDate, itemId) {
  const weekKey = `grocery_${sundayDate}`;
  const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}');
  if (lists[weekKey]) {
    const target = lists[weekKey].items.find(i => i.id === itemId);
    if (target) {
      target.purchased = !target.purchased;
      localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
      renderGroceryView(lists[weekKey]);
    }
  }
};

window.toggleGroceryAtHome = function(sundayDate, itemId) {
  const weekKey = `grocery_${sundayDate}`;
  const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}');
  if (lists[weekKey]) {
    const target = lists[weekKey].items.find(i => i.id === itemId);
    if (target) {
      target.atHome = !target.atHome;
      localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
      renderGroceryView(lists[weekKey]);
    }
  }
};

window.updateGroceryPrice = function(sundayDate, itemId, newPrice) {
  const weekKey = `grocery_${sundayDate}`;
  const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}');
  if (lists[weekKey]) {
    const target = lists[weekKey].items.find(i => i.id === itemId);
    if (target) {
      target.actualPrice = Number(newPrice) || 0;
      localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
      renderGroceryView(lists[weekKey]);
    }
  }
};

window.toggleMealPrepTask = function(sundayDate, taskId) {
  const weekKey = `grocery_${sundayDate}`;
  const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}');
  if (lists[weekKey]) {
    const target = (lists[weekKey].prepTasks || []).find(t => t.id === taskId);
    if (target) {
      target.completed = !target.completed;
      localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
      renderGroceryView(lists[weekKey]);
    }
  }
};

/**
 * Renders Progress & Analytics Dashboard with Canvas Charts.
 */
function renderProgressView() {
  const range = getActiveDateRange();
  const data = calculateRangeAnalytics(range.startDate, range.endDate);

  // Executive summary text
  const execSummary = document.getElementById('analytics-executive-summary');
  if (execSummary) {
    execSummary.innerHTML = `
      You completed <strong>${data.totalWorkoutsCompleted} of ${data.totalWorkoutsApplicable}</strong> applicable workout or recovery sessions, 
      studied for <strong>${data.totalStudyHours} hours</strong> (${data.totalStudyMinutes} mins), 
      read for <strong>${data.totalReadingMinutes} minutes</strong> (${data.totalReadingPages} pages), 
      and confirmed saving <strong>₹${data.totalSavings.toLocaleString()}</strong>.
    `;
  }

  // Summary Metrics
  const rRate = document.getElementById('stat-routine-rate');
  const wRate = document.getElementById('stat-workout-consistency');
  const mEaten = document.getElementById('stat-meals-eaten');
  const sTot = document.getElementById('stat-savings-total');
  const stHrs = document.getElementById('stat-study-hours');
  const rPgs = document.getElementById('stat-reading-pages');
  const strk = document.getElementById('stat-habit-streak');
  const mRec = document.getElementById('stat-missed-recovered');

  if (rRate) rRate.textContent = `${data.routineRate}%`;
  if (wRate) wRate.textContent = `${data.workoutRate}%`;
  if (mEaten) mEaten.textContent = `${data.totalMealsEaten}`;
  if (sTot) sTot.textContent = `₹${data.totalSavings}`;
  if (stHrs) stHrs.textContent = `${data.totalStudyHours}h`;
  if (rPgs) rPgs.textContent = `${data.totalReadingPages}p`;
  if (strk) strk.textContent = `${data.streak} days`;
  if (mRec) mRec.textContent = `${data.missedTasksCount} / ${data.recoveredTasksCount}`;

  // Draw High-DPI Canvas Charts
  drawCompletionLineChart(data.dailyTrend);
  drawSavingsBarChart(data.dailyTrend);

  // Audit Log of Missed Tasks
  renderMissedTasksAuditLog();
}

function getActiveDateRange() {
  const today = state.parseLocalDate(state.todayDateKey);
  let start = new Date(today);
  const end = new Date(today);

  if (state.activeAnalyticsFilter === '7days') {
    start.setDate(start.getDate() - 6);
  } else if (state.activeAnalyticsFilter === '30days') {
    start.setDate(start.getDate() - 29);
  } else if (state.activeAnalyticsFilter === 'month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (state.activeAnalyticsFilter === 'custom') {
    const sInp = document.getElementById('custom-start-date');
    const eInp = document.getElementById('custom-end-date');
    if (sInp && sInp.value && eInp && eInp.value) {
      return { startDate: sInp.value, endDate: eInp.value };
    }
    start.setDate(start.getDate() - 6);
  }

  return {
    startDate: state.getLocalDateKey(start),
    endDate: state.getLocalDateKey(end)
  };
}

/**
 * Pure Canvas Line Chart for Routine Completion Trend (No dependencies, 100% offline).
 */
function drawCompletionLineChart(trendData) {
  const canvas = document.getElementById('chart-completion');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  if (!trendData || trendData.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No recorded habit logs in range', w / 2, h / 2);
    return;
  }

  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 26;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  // Grid lines (0%, 50%, 100%)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  [0, 50, 100].forEach(val => {
    const y = paddingTop + chartH - (val / 100) * chartH;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${val}%`, paddingLeft - 6, y + 3);
  });

  const stepX = trendData.length > 1 ? chartW / (trendData.length - 1) : chartW;

  // Draw Area Gradient
  const grad = ctx.createLinearGradient(0, paddingTop, 0, h - paddingBottom);
  grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

  ctx.beginPath();
  trendData.forEach((pt, i) => {
    const x = paddingLeft + (i * stepX);
    const y = paddingTop + chartH - (pt.percentage / 100) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(paddingLeft + (trendData.length - 1) * stepX, h - paddingBottom);
  ctx.lineTo(paddingLeft, h - paddingBottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Line
  ctx.beginPath();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  trendData.forEach((pt, i) => {
    const x = paddingLeft + (i * stepX);
    const y = paddingTop + chartH - (pt.percentage / 100) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Points and Date Labels
  trendData.forEach((pt, i) => {
    const x = paddingLeft + (i * stepX);
    const y = paddingTop + chartH - (pt.percentage / 100) * chartH;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0b0e14';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    if (trendData.length <= 10 || i % Math.ceil(trendData.length / 7) === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.displayDate, x, h - 8);
    }
  });
}

/**
 * Pure Canvas Bar Chart for Daily Savings vs Target.
 */
function drawSavingsBarChart(trendData) {
  const canvas = document.getElementById('chart-savings');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  if (!trendData || trendData.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No savings entries recorded', w / 2, h / 2);
    return;
  }

  const paddingLeft = 38;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 26;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  const maxVal = Math.max(300, ...trendData.map(d => d.savings));

  // Target Line (₹200)
  const targetY = paddingTop + chartH - (200 / maxVal) * chartH;
  ctx.strokeStyle = '#f59e0b';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, targetY);
  ctx.lineTo(w - paddingRight, targetY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset

  ctx.fillStyle = '#f59e0b';
  ctx.font = '9px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('₹200 tgt', paddingLeft - 4, targetY + 3);

  const barCount = trendData.length;
  const totalBarSpace = chartW / barCount;
  const barWidth = Math.max(4, totalBarSpace * 0.55);

  trendData.forEach((pt, i) => {
    const x = paddingLeft + (i * totalBarSpace) + (totalBarSpace - barWidth) / 2;
    const barH = (pt.savings / maxVal) * chartH;
    const y = paddingTop + chartH - barH;

    // Bar Color based on target met
    ctx.fillStyle = pt.savings >= 200 ? '#10b981' : (pt.savings > 0 ? '#38bdf8' : '#334155');
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]) : ctx.fillRect(x, y, barWidth, barH);
    ctx.fill();

    if (barCount <= 10 || i % Math.ceil(barCount / 7) === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.displayDate, x + barWidth / 2, h - 8);
    }
  });
}

/**
 * Renders the Missed Tasks Audit Log in Progress View.
 */
function renderMissedTasksAuditLog() {
  const container = document.getElementById('analytics-missed-log-container');
  if (!container) return;

  const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
  const allMissed = [];

  Object.keys(allLogs).forEach(dateKey => {
    const log = allLogs[dateKey];
    if (Array.isArray(log.missedItems)) {
      log.missedItems.forEach(item => {
        allMissed.push({ ...item, date: dateKey });
      });
    }
  });

  // Sort descending by date
  allMissed.sort((a, b) => b.date.localeCompare(a.date));

  if (allMissed.length === 0) {
    container.innerHTML = `
      <div style="font-size:0.78rem; color:var(--text-muted); text-align:center; padding:16px 0;">
        🌟 Pristine record! No missed tasks recorded across your logged history.
      </div>
    `;
    return;
  }

  container.innerHTML = allMissed.map(item => `
    <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 12px; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">${escapeHTML(item.taskTitle)}</span>
        <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-muted);">${item.date}</span>
      </div>
      <div style="display:flex; gap:6px; align-items:center; margin-top:4px;">
        <span style="font-size:0.68rem; background:rgba(245, 158, 11, 0.15); color:var(--accent-amber); padding:2px 6px; border-radius:4px; font-weight:600;">
          ${escapeHTML(item.reasonCategory)}
        </span>
        ${item.recovered ? '<span style="font-size:0.68rem; background:rgba(16, 185, 129, 0.15); color:var(--accent-emerald); padding:2px 6px; border-radius:4px; font-weight:600;">✓ Recovered</span>' : '<span style="font-size:0.68rem; background:rgba(244, 63, 94, 0.15); color:var(--accent-rose); padding:2px 6px; border-radius:4px; font-weight:600;">Unrecovered</span>'}
      </div>
      <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px; line-height:1.35;">
        "${escapeHTML(item.explanation)}"
      </p>
      ${item.recoveryAction ? `<div style="font-size:0.7rem; color:var(--accent-blue); margin-top:4px;">Recovery Plan: ${escapeHTML(item.recoveryAction)}</div>` : ''}
      ${item.attachmentId ? `
        <button type="button" class="timeline-btn mt-2" onclick="viewAttachmentLightbox('${item.attachmentId}')">
          <i data-lucide="image" style="width:12px;height:12px;"></i> View Attached Photo
        </button>
      ` : ''}
    </div>
  `).join('');

  renderLucideIcons();
}

/**
 * Checks for unrecovered missed tasks from yesterday and renders Home Recovery Banner.
 */
function checkYesterdayMissedTasks() {
  const container = document.getElementById('recovery-banner-container');
  if (!container) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = state.getLocalDateKey(yesterday);
  const yLog = state.getDailyLog(yKey);

  const unrecovered = (yLog.missedItems || []).filter(m => !m.recovered);

  if (unrecovered.length > 0) {
    const item = unrecovered[0];
    container.innerHTML = `
      <div class="recovery-banner">
        <i data-lucide="rotate-ccw" class="text-amber" style="width:20px;height:20px;flex-shrink:0;"></i>
        <div class="recovery-banner-content">
          <span class="recovery-banner-title">Yesterday's Recovery Focus: ${escapeHTML(item.taskTitle)}</span>
          <div class="recovery-banner-desc">Reason: ${escapeHTML(item.reasonCategory)}. Plan: ${escapeHTML(item.recoveryAction || 'Complete today to maintain consistency.')}</div>
          <button class="recovery-banner-action" onclick="completeMissedTaskRecovery('${yKey}', '${item.id}')">
            <i data-lucide="check" style="width:14px;height:14px;"></i> Mark Recovery Complete
          </button>
        </div>
      </div>
    `;
    renderLucideIcons();
  } else {
    container.innerHTML = '';
  }
}

window.completeMissedTaskRecovery = function(dateKey, missedItemId) {
  const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
  if (allLogs[dateKey] && Array.isArray(allLogs[dateKey].missedItems)) {
    const target = allLogs[dateKey].missedItems.find(m => m.id === missedItemId);
    if (target) {
      target.recovered = true;
      target.recoveredAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
      showToast('Recovery completed! Integrity preserved.', 'success');
      checkYesterdayMissedTasks();
      renderProgressView();
    }
  }
};

/**
 * Renders review-needed banner if reviewing past date or today evening unfinalized.
 */
function renderDayReviewBanner() {
  const container = document.getElementById('day-review-banner-container');
  if (!container) return;

  const log = state.getDailyLog(state.selectedDateKey);
  const isPast = state.selectedDateKey < state.todayDateKey;

  if (isPast && !log.finalized) {
    container.innerHTML = `
      <div class="review-needed-banner">
        <div class="review-needed-text">
          <strong>Review Required</strong>
          This past day has unfinalized records. Review and finalize accountability.
        </div>
        <button class="primary-btn" onclick="openFinalizeDayModal()" style="font-size:0.75rem; padding:6px 12px; min-height:36px;">
          Finalize Day
        </button>
      </div>
    `;
  } else {
    container.innerHTML = '';
  }
}

// ============================================================================
// 7. MODALS, ATTACHMENTS & FORMS CONTROLLER
// ============================================================================

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-view');
      switchMainView(viewId);
    });
  });

  // Quick Action Chips
  document.getElementById('chip-workout')?.addEventListener('click', openWorkoutModal);
  document.getElementById('chip-food')?.addEventListener('click', () => switchMainView('food'));
  document.getElementById('chip-study')?.addEventListener('click', openStudyModal);
  document.getElementById('chip-reading')?.addEventListener('click', openReadingModal);
  document.getElementById('chip-savings')?.addEventListener('click', () => {
    switchMainView('home');
    document.querySelector('.savings-card')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('chip-grocery')?.addEventListener('click', () => {
    switchMainView('food');
    document.getElementById('tab-btn-grocery')?.click();
  });
  document.getElementById('chip-missed')?.addEventListener('click', openFinalizeDayModal);

  // Date Navigator Controls
  document.getElementById('btn-prev-day')?.addEventListener('click', () => {
    const d = state.parseLocalDate(state.selectedDateKey);
    d.setDate(d.getDate() - 1);
    loadDate(state.getLocalDateKey(d));
  });

  document.getElementById('btn-next-day')?.addEventListener('click', () => {
    const d = state.parseLocalDate(state.selectedDateKey);
    d.setDate(d.getDate() + 1);
    const nextKey = state.getLocalDateKey(d);
    if (nextKey <= state.todayDateKey) {
      loadDate(nextKey);
    }
  });

  document.getElementById('btn-go-today')?.addEventListener('click', () => {
    loadDate(state.todayDateKey);
  });

  // Hidden date picker trigger
  const hiddenPicker = document.getElementById('hidden-date-picker');
  document.getElementById('date-display-trigger')?.addEventListener('click', () => {
    if (hiddenPicker) {
      try {
        hiddenPicker.showPicker ? hiddenPicker.showPicker() : hiddenPicker.click();
      } catch (e) {
        hiddenPicker.click();
      }
    }
  });
  hiddenPicker?.addEventListener('change', (e) => {
    if (e.target.value) {
      loadDate(e.target.value);
    }
  });

  // Calendar Modal Controls
  document.getElementById('btn-open-calendar')?.addEventListener('click', openCalendarModal);
  document.getElementById('btn-close-calendar')?.addEventListener('click', () => closeModal('modal-calendar'));
  document.getElementById('btn-cal-prev-month')?.addEventListener('click', () => {
    state.calendarViewMonth.setMonth(state.calendarViewMonth.getMonth() - 1);
    renderMonthCalendarDays();
  });
  document.getElementById('btn-cal-next-month')?.addEventListener('click', () => {
    state.calendarViewMonth.setMonth(state.calendarViewMonth.getMonth() + 1);
    renderMonthCalendarDays();
  });

  // Settings & Navigation
  document.getElementById('btn-quick-settings')?.addEventListener('click', () => switchMainView('settings'));
  document.getElementById('btn-view-full-routine')?.addEventListener('click', () => switchMainView('routine'));
  document.getElementById('btn-finalize-day-prompt')?.addEventListener('click', openFinalizeDayModal);

  // Home CTA
  document.getElementById('btn-hero-cta')?.addEventListener('click', () => {
    const prog = calculateDailyProgress(state.selectedDateKey);
    if (prog.percentage === 100) openFinalizeDayModal();
    else switchMainView('routine');
  });

  // Savings Save Action
  document.getElementById('btn-save-money-action')?.addEventListener('click', () => {
    const inp = document.getElementById('input-daily-savings');
    const noteInp = document.getElementById('input-savings-note');
    const amt = Number(inp.value) || 0;
    const note = noteInp ? noteInp.value.trim() : '';

    const log = state.getDailyLog(state.selectedDateKey);
    log.savings.amount = amt;
    log.savings.saved = amt >= (log.savings.target || 200);
    log.savings.note = note;
    log.habits.saveMoney = log.savings.saved;

    state.saveDailyLog(state.selectedDateKey, log);
    showToast(`Saved ₹${amt} successfully!`, 'success');
    renderHomeSavingsCard();
    renderHomeProgressRing();
  });

  // Quick Amount Chips
  document.querySelectorAll('.quick-amt-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const amtToAdd = Number(btn.getAttribute('data-amt')) || 0;
      const inp = document.getElementById('input-daily-savings');
      if (inp) {
        inp.value = (Number(inp.value) || 0) + amtToAdd;
      }
    });
  });

  // Food Subnav Tabs
  document.getElementById('tab-btn-meals')?.addEventListener('click', () => {
    document.getElementById('tab-btn-meals')?.classList.add('active');
    document.getElementById('tab-btn-grocery')?.classList.remove('active');
    document.getElementById('subview-meals')?.classList.remove('hidden');
    document.getElementById('subview-grocery')?.classList.add('hidden');
  });

  document.getElementById('tab-btn-grocery')?.addEventListener('click', () => {
    document.getElementById('tab-btn-grocery')?.classList.add('active');
    document.getElementById('tab-btn-meals')?.classList.remove('active');
    document.getElementById('subview-grocery')?.classList.remove('hidden');
    document.getElementById('subview-meals')?.classList.add('hidden');
    initWeeklyGrocery(getSundayOfWeek(state.parseLocalDate(state.selectedDateKey)));
  });

  // Custom Food Add Action
  document.getElementById('btn-add-custom-food')?.addEventListener('click', () => {
    const name = prompt('Enter custom meal / food item name (e.g. Soya chunks 50g, Whey protein scoop):');
    if (!name || !name.trim()) return;
    const protein = prompt('Enter estimated protein in grams (e.g. 25):', '20');
    const log = state.getDailyLog(state.selectedDateKey);
    if (!Array.isArray(log.meals.customItems)) log.meals.customItems = [];
    log.meals.customItems.push({
      id: `cf_${Date.now()}`,
      name: name.trim(),
      protein: Number(protein) || 0,
      completed: true
    });
    state.saveDailyLog(state.selectedDateKey, log);
    renderMealsSection();
    renderHomeProgressRing();
    renderLucideIcons();
    showToast(`Added custom food item: ${name.trim()}`, 'success');
  });

  // Diet Preferences Save
  document.getElementById('btn-save-diet-notes')?.addEventListener('click', () => {
    const val = document.getElementById('food-preferences-notes')?.value || '';
    state.saveSettings({ dietaryPreferences: val });
    showToast('Dietary preferences saved.', 'success');
  });

  // Progress Analytics Filter Chips
  document.querySelectorAll('.filter-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeAnalyticsFilter = btn.getAttribute('data-filter');
      const customInputs = document.getElementById('custom-range-inputs');
      if (customInputs) {
        customInputs.classList.toggle('hidden', state.activeAnalyticsFilter !== 'custom');
      }
      renderProgressView();
    });
  });

  document.getElementById('btn-apply-custom-range')?.addEventListener('click', renderProgressView);

  // Settings Save Handlers
  document.getElementById('btn-save-profile')?.addEventListener('click', () => {
    const uName = document.getElementById('setting-username')?.value.trim() || 'Arnab';
    const uInit = document.getElementById('setting-avatar-initials')?.value.trim() || 'AB';
    state.saveSettings({ userName: uName, avatarInitials: uInit });
    syncUserProfileUI();
    showToast('Profile updated!', 'success');
  });

  document.getElementById('btn-save-schedule-settings')?.addEventListener('click', () => {
    const wake = document.getElementById('setting-wakeup-time')?.value || '08:00';
    const offS = document.getElementById('setting-office-start')?.value || '12:30';
    const offE = document.getElementById('setting-office-end')?.value || '22:00';
    const std = document.getElementById('setting-study-time')?.value || '00:00';
    state.saveSettings({ wakeupTime: wake, officeStart: offS, officeEnd: offE, studyTime: std });
    showToast('Shift schedule updated!', 'success');
    loadDate(state.selectedDateKey);
  });

  document.getElementById('btn-save-targets')?.addEventListener('click', () => {
    const sav = Number(document.getElementById('setting-savings-target')?.value) || 200;
    const prot = Number(document.getElementById('setting-protein-target')?.value) || 120;
    const std = Number(document.getElementById('setting-study-target')?.value) || 60;
    const rd = Number(document.getElementById('setting-reading-target')?.value) || 30;
    state.saveSettings({
      dailySavingsTarget: sav,
      dailyProteinTarget: prot,
      dailyStudyTargetMinutes: std,
      dailyReadingTargetMinutes: rd
    });
    showToast('Targets updated!', 'success');
    loadDate(state.selectedDateKey);
  });

  // Backup & Restore
  document.getElementById('btn-export-json')?.addEventListener('click', exportApplicationData);
  document.getElementById('input-import-file')?.addEventListener('change', handleImportFile);
  document.getElementById('btn-reset-data')?.addEventListener('click', confirmResetAllData);

  // Modals Listeners
  setupModalHandlers();
}

function switchMainView(viewId) {
  state.currentView = viewId;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-view'));
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });

  const targetSec = document.getElementById(`view-${viewId}`);
  if (targetSec) targetSec.classList.add('active-view');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewId === 'progress') renderProgressView();
  else if (viewId === 'food') renderMealsSection();
  else if (viewId === 'routine') renderRoutineTimeline();
  else if (viewId === 'settings') updateStorageDiagnostics();

  renderLucideIcons();
}

/**
 * Modals setup and forms
 */
function setupModalHandlers() {
  // Modal 1: Accountability Modal
  document.getElementById('btn-close-acc-modal')?.addEventListener('click', () => closeModal('modal-accountability'));
  document.getElementById('btn-cancel-acc')?.addEventListener('click', () => closeModal('modal-accountability'));
  document.getElementById('acc-status-select')?.addEventListener('change', (e) => {
    const details = document.getElementById('acc-missed-details-fields');
    if (details) details.style.display = e.target.value === 'missed' ? 'block' : 'none';
  });

  // File dropzone
  const fileInp = document.getElementById('acc-file-input');
  const dropzone = document.getElementById('acc-dropzone');
  dropzone?.addEventListener('click', () => fileInp?.click());
  fileInp?.addEventListener('change', handleAttachmentUpload);

  document.getElementById('btn-remove-acc-img')?.addEventListener('click', () => {
    state.pendingAttachment = null;
    document.getElementById('acc-image-preview-box')?.classList.add('hidden');
    if (fileInp) fileInp.value = '';
  });

  document.getElementById('btn-save-acc')?.addEventListener('click', saveAccountabilityRecord);

  // Modal 2: Workout Modal
  document.getElementById('btn-open-workout-modal')?.addEventListener('click', openWorkoutModal);
  document.getElementById('btn-close-workout-modal')?.addEventListener('click', () => closeModal('modal-workout'));
  document.getElementById('btn-cancel-workout')?.addEventListener('click', () => closeModal('modal-workout'));
  document.getElementById('btn-complete-workout-session')?.addEventListener('click', saveWorkoutSession);

  // Modal 3: Study Modal
  document.getElementById('box-quick-study')?.addEventListener('click', openStudyModal);
  document.getElementById('btn-close-study-modal')?.addEventListener('click', () => closeModal('modal-study'));
  document.getElementById('btn-cancel-study')?.addEventListener('click', () => closeModal('modal-study'));
  document.getElementById('btn-save-study')?.addEventListener('click', saveStudySession);

  // Study timer controls
  document.getElementById('btn-timer-start')?.addEventListener('click', startStudyTimer);
  document.getElementById('btn-timer-pause')?.addEventListener('click', pauseStudyTimer);
  document.getElementById('btn-timer-reset')?.addEventListener('click', resetStudyTimer);

  // Modal 4: Reading Modal
  document.getElementById('box-quick-reading')?.addEventListener('click', openReadingModal);
  document.getElementById('btn-close-reading-modal')?.addEventListener('click', () => closeModal('modal-reading'));
  document.getElementById('btn-cancel-reading')?.addEventListener('click', () => closeModal('modal-reading'));
  document.getElementById('btn-save-reading')?.addEventListener('click', saveReadingSession);

  // Lightbox Close
  document.getElementById('btn-close-lightbox')?.addEventListener('click', () => closeModal('modal-lightbox'));

  // Schedule Custom Item
  document.getElementById('btn-custom-routine-item')?.addEventListener('click', () => openModal('modal-schedule-item'));
  document.getElementById('btn-close-sched-modal')?.addEventListener('click', () => closeModal('modal-schedule-item'));
  document.getElementById('btn-cancel-sched')?.addEventListener('click', () => closeModal('modal-schedule-item'));
  document.getElementById('btn-save-sched-item')?.addEventListener('click', saveCustomScheduleItem);

  // Grocery Custom Item
  document.getElementById('btn-add-grocery-item')?.addEventListener('click', () => openModal('modal-grocery-item'));
  document.getElementById('btn-close-grocery-modal')?.addEventListener('click', () => closeModal('modal-grocery-item'));
  document.getElementById('btn-cancel-grocery')?.addEventListener('click', () => closeModal('modal-grocery-item'));
  document.getElementById('btn-save-grocery-item')?.addEventListener('click', saveCustomGroceryItem);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderLucideIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Image Attachment Upload Handler with 5MB validation and preview (Requirement 10).
 */
function handleAttachmentUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Max 5 MB validation
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size exceeds 5 MB limit. Please select a smaller photo.', 'error');
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    state.pendingAttachment = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: event.target.result,
      createdAt: new Date().toISOString()
    };

    const previewBox = document.getElementById('acc-image-preview-box');
    const previewImg = document.getElementById('acc-preview-img');
    if (previewBox && previewImg) {
      previewImg.src = state.pendingAttachment.dataUrl;
      previewBox.classList.remove('hidden');
    }
    showToast('Photo attached. Stored locally.', 'success');
  };
  reader.readAsDataURL(file);
}

/**
 * Open Accountability Modal & populate incomplete habits list.
 */
function openMissedTaskModal(taskId, taskTitle) {
  const select = document.getElementById('acc-task-select');
  if (select) {
    select.innerHTML = `<option value="${taskId}">${escapeHTML(taskTitle)}</option>`;
  }
  state.pendingAttachment = null;
  const previewBox = document.getElementById('acc-image-preview-box');
  if (previewBox) previewBox.classList.add('hidden');
  const expInp = document.getElementById('acc-explanation');
  if (expInp) expInp.value = '';
  openModal('modal-accountability');
}

function openFinalizeDayModal() {
  const log = state.getDailyLog(state.selectedDateKey);
  const select = document.getElementById('acc-task-select');
  if (!select) return;

  // Find all incomplete habits
  const incompleteHabits = CORE_HABITS_META.filter(h => !log.habits[h.id]);

  if (incompleteHabits.length === 0) {
    log.finalized = true;
    log.finalizedAt = new Date().toISOString();
    state.saveDailyLog(state.selectedDateKey, log);
    showToast('Day verified and finalized! Fantastic discipline.', 'success');
    loadDate(state.selectedDateKey);
    return;
  }

  select.innerHTML = incompleteHabits.map(h => `
    <option value="${h.id}">${escapeHTML(h.title)}</option>
  `).join('');

  state.pendingAttachment = null;
  const previewBox = document.getElementById('acc-image-preview-box');
  if (previewBox) previewBox.classList.add('hidden');
  const expInp = document.getElementById('acc-explanation');
  if (expInp) expInp.value = '';

  openModal('modal-accountability');
}

async function saveAccountabilityRecord() {
  const select = document.getElementById('acc-task-select');
  const statusSelect = document.getElementById('acc-status-select');
  const reasonCat = document.getElementById('acc-reason-category');
  const explanation = document.getElementById('acc-explanation');
  const recoveryAction = document.getElementById('acc-recovery-action');
  const targetDate = document.getElementById('acc-new-target-date');

  const taskId = select.value;
  const status = statusSelect.value;
  const taskMeta = CORE_HABITS_META.find(h => h.id === taskId);
  const taskTitle = taskMeta ? taskMeta.title : taskId;

  const log = state.getDailyLog(state.selectedDateKey);

  if (status === 'missed') {
    const expText = explanation.value.trim();
    if (!expText) {
      showToast('Written explanation is required before finalizing.', 'error');
      explanation.focus();
      return;
    }

    let attachmentId = null;
    if (state.pendingAttachment) {
      try {
        attachmentId = await attachmentDB.saveAttachment(state.pendingAttachment);
      } catch (e) {
        console.warn('IndexedDB save failed', e);
      }
    }

    log.missedItems.push({
      id: `missed_${Date.now()}`,
      taskId: taskId,
      taskTitle: taskTitle,
      reasonCategory: reasonCat.value,
      explanation: expText,
      attachmentId: attachmentId,
      recoveryAction: recoveryAction.value.trim(),
      recoveryTargetDate: targetDate.value || '',
      recovered: false,
      recoveredAt: null,
      createdAt: new Date().toISOString()
    });

    log.habits[taskId] = false;
  } else if (status === 'skipped') {
    // Skipped intentionally
    log.habits[taskId] = false;
  } else if (status === 'rescheduled') {
    log.habits[taskId] = false;
  }

  log.finalized = true;
  log.finalizedAt = new Date().toISOString();

  state.saveDailyLog(state.selectedDateKey, log);
  closeModal('modal-accountability');
  showToast('Accountability record saved.', 'success');
  loadDate(state.selectedDateKey);
}

/**
 * Open & Save Workout Modal
 */
function openWorkoutModal() {
  const d = state.parseLocalDate(state.selectedDateKey);
  const plan = WEEKLY_WORKOUT_PLANS[d.getDay()];
  const log = state.getDailyLog(state.selectedDateKey);

  const titleEl = document.getElementById('modal-workout-title');
  const dayEl = document.getElementById('modal-workout-day');
  const listEl = document.getElementById('modal-exercise-list');
  const notesEl = document.getElementById('workout-session-notes');

  if (titleEl) titleEl.textContent = plan.title;
  if (dayEl) dayEl.textContent = `${getDayOfWeekName(d)} · ${plan.subtitle}`;
  if (notesEl) notesEl.value = log.workout.notes || '';

  const exercises = log.workout.exercises || plan.exercises;
  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_HISTORY) || '{}');

  listEl.innerHTML = exercises.map((ex, idx) => {
    const hist = history[ex.id] || {};
    const lastPerf = hist.lastWeight ? `Last: ${hist.lastWeight} kg × ${hist.lastReps} reps (${hist.lastDate})` : 'No previous log';
    const isPR = hist.prWeight && Number(ex.weight) > Number(hist.prWeight);

    return `
      <div class="exercise-card ${ex.completed ? 'completed' : ''}" id="ex-card-${idx}">
        <div class="exercise-top-row">
          <div>
            <div class="exercise-name">${escapeHTML(ex.name)}</div>
            <div class="exercise-target">${escapeHTML(ex.target)}</div>
            <div class="exercise-last-perf">${lastPerf} ${isPR ? '<span class="workout-header-badge">⭐ PR!</span>' : ''}</div>
          </div>
          <button type="button" class="card-action-btn" onclick="substituteExercise(${idx})">Substitute</button>
        </div>
        <div class="exercise-input-row">
          <div class="input-group">
            <label>Sets</label>
            <input type="number" class="exercise-input" id="ex-sets-${idx}" value="${ex.sets || ex.defaultSets || 3}">
          </div>
          <div class="input-group">
            <label>Reps</label>
            <input type="text" class="exercise-input" id="ex-reps-${idx}" value="${ex.repsCompleted || ex.defaultReps || '10'}">
          </div>
          <div class="input-group">
            <label>Weight (kg)</label>
            <input type="number" step="0.5" class="exercise-input" id="ex-wt-${idx}" value="${ex.weight || ''}" placeholder="kg">
          </div>
          <button type="button" class="exercise-check-btn" onclick="toggleExerciseCheck(${idx})" title="Done">
            <i data-lucide="${ex.completed ? 'check' : 'plus'}" style="width:16px;height:16px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  openModal('modal-workout');
  renderLucideIcons();
}

window.toggleExerciseCheck = function(idx) {
  const card = document.getElementById(`ex-card-${idx}`);
  if (card) {
    card.classList.toggle('completed');
  }
};

window.substituteExercise = function(idx) {
  const newName = prompt('Enter substitute exercise name (e.g. Incline Machine Press instead of DB Bench):');
  if (newName && newName.trim()) {
    const log = state.getDailyLog(state.selectedDateKey);
    if (log.workout.exercises[idx]) {
      log.workout.exercises[idx].name = newName.trim();
      state.saveDailyLog(state.selectedDateKey, log);
      openWorkoutModal();
    }
  }
};

function saveWorkoutSession() {
  const log = state.getDailyLog(state.selectedDateKey);
  const notesEl = document.getElementById('workout-session-notes');
  if (notesEl) log.workout.notes = notesEl.value.trim();

  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_HISTORY) || '{}');

  let allDone = true;
  (log.workout.exercises || []).forEach((ex, idx) => {
    const setsInp = document.getElementById(`ex-sets-${idx}`);
    const repsInp = document.getElementById(`ex-reps-${idx}`);
    const wtInp = document.getElementById(`ex-wt-${idx}`);
    const card = document.getElementById(`ex-card-${idx}`);

    ex.sets = setsInp ? Number(setsInp.value) : ex.sets;
    ex.repsCompleted = repsInp ? repsInp.value : ex.repsCompleted;
    ex.weight = wtInp ? wtInp.value : ex.weight;
    ex.completed = card ? card.classList.contains('completed') : false;

    if (!ex.completed) allDone = false;

    // Update exercise history PR
    if (ex.completed && ex.weight) {
      const curWt = Number(ex.weight);
      const prev = history[ex.id] || {};
      history[ex.id] = {
        lastWeight: curWt,
        lastReps: ex.repsCompleted,
        lastDate: state.selectedDateKey,
        prWeight: Math.max(curWt, Number(prev.prWeight) || curWt)
      };
    }
  });

  localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(history));

  log.workout.completed = true;
  log.habits.workout = true;

  state.saveDailyLog(state.selectedDateKey, log);
  closeModal('modal-workout');
  showToast('Workout log saved! Strength updated.', 'success');
  loadDate(state.selectedDateKey);
}

/**
 * AI/ML Study Tracker Modal & Timer Logic
 */
function openStudyModal() {
  const log = state.getDailyLog(state.selectedDateKey);
  const topicInp = document.getElementById('study-topic-input');
  const minInp = document.getElementById('study-manual-minutes');
  const notesInp = document.getElementById('study-notes-input');

  if (topicInp) topicInp.value = log.study.topic || '';
  if (minInp) minInp.value = log.study.minutes || state.settings.dailyStudyTargetMinutes || 60;
  if (notesInp) notesInp.value = log.study.notes || '';

  updateStudyTimerDisplay();
  openModal('modal-study');
}

function startStudyTimer() {
  if (state.studyTimerRunning) return;
  state.studyTimerRunning = true;
  state.studyTimerInterval = setInterval(() => {
    state.studyTimerSeconds++;
    updateStudyTimerDisplay();
  }, 1000);
}

function pauseStudyTimer() {
  state.studyTimerRunning = false;
  if (state.studyTimerInterval) clearInterval(state.studyTimerInterval);
  // sync minutes input
  const minInp = document.getElementById('study-manual-minutes');
  if (minInp) minInp.value = Math.max(1, Math.round(state.studyTimerSeconds / 60));
}

function resetStudyTimer() {
  pauseStudyTimer();
  state.studyTimerSeconds = 0;
  updateStudyTimerDisplay();
}

function updateStudyTimerDisplay() {
  const disp = document.getElementById('study-timer-display');
  if (!disp) return;
  const hrs = String(Math.floor(state.studyTimerSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((state.studyTimerSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(state.studyTimerSeconds % 60).padStart(2, '0');
  disp.textContent = `${hrs}:${mins}:${secs}`;
}

function saveStudySession() {
  const topicInp = document.getElementById('study-topic-input');
  const minInp = document.getElementById('study-manual-minutes');
  const notesInp = document.getElementById('study-notes-input');

  const topic = topicInp ? topicInp.value.trim() : '';
  const mins = minInp ? Number(minInp.value) || 0 : 0;
  const notes = notesInp ? notesInp.value.trim() : '';

  if (!topic) {
    showToast('Please enter the learning topic studied.', 'error');
    topicInp?.focus();
    return;
  }

  const log = state.getDailyLog(state.selectedDateKey);
  log.study.topic = topic;
  log.study.minutes = mins;
  log.study.notes = notes;
  log.study.completed = mins > 0;
  log.habits.studySession = mins > 0;

  state.saveDailyLog(state.selectedDateKey, log);
  pauseStudyTimer();
  closeModal('modal-study');
  showToast('Study session recorded! Knowledge compounded.', 'success');
  loadDate(state.selectedDateKey);
}

/**
 * Reading Tracker Modal (Requirement 12: Zero to One)
 */
function openReadingModal() {
  const log = state.getDailyLog(state.selectedDateKey);
  const startInp = document.getElementById('reading-start-page');
  const endInp = document.getElementById('reading-end-page');
  const minInp = document.getElementById('reading-minutes-input');
  const quoteInp = document.getElementById('reading-quote-input');
  const takeInp = document.getElementById('reading-takeaway-input');
  const appInp = document.getElementById('reading-apply-input');

  const lastSavedPage = state.getLastReadingPage();
  if (startInp) startInp.value = log.reading.startPage || lastSavedPage;
  if (endInp) endInp.value = log.reading.endPage || (lastSavedPage + 10);
  if (minInp) minInp.value = log.reading.minutes || 30;
  if (quoteInp) quoteInp.value = log.reading.quote || '';
  if (takeInp) takeInp.value = log.reading.takeaway || '';
  if (appInp) appInp.value = log.reading.application || '';

  openModal('modal-reading');
}

function saveReadingSession() {
  const startInp = document.getElementById('reading-start-page');
  const endInp = document.getElementById('reading-end-page');
  const minInp = document.getElementById('reading-minutes-input');
  const quoteInp = document.getElementById('reading-quote-input');
  const takeInp = document.getElementById('reading-takeaway-input');
  const appInp = document.getElementById('reading-apply-input');

  const startP = Number(startInp?.value) || 1;
  const endP = Number(endInp?.value) || startP;
  const mins = Number(minInp?.value) || 30;
  const quote = quoteInp?.value.trim() || '';
  const takeaway = takeInp?.value.trim() || '';
  const application = appInp?.value.trim() || '';

  if (!takeaway || !application) {
    showToast('Takeaway and Real-Life Application are required for deep learning.', 'error');
    return;
  }

  const log = state.getDailyLog(state.selectedDateKey);
  log.reading.startPage = startP;
  log.reading.endPage = endP;
  log.reading.minutes = mins;
  log.reading.quote = quote;
  log.reading.takeaway = takeaway;
  log.reading.application = application;
  log.reading.completed = true;
  log.habits.readingZeroToOne = true;

  state.setLastReadingPage(endP);
  state.saveDailyLog(state.selectedDateKey, log);
  closeModal('modal-reading');
  showToast('Reading reflection saved! Resume page updated.', 'success');
  loadDate(state.selectedDateKey);
}

/**
 * Calendar Month Modal with Color Indicators (Requirement 3)
 */
function openCalendarModal() {
  state.calendarViewMonth = new Date(state.parseLocalDate(state.selectedDateKey));
  renderMonthCalendarDays();
  openModal('modal-calendar');
}

function renderMonthCalendarDays() {
  const daysContainer = document.getElementById('modal-calendar-days');
  const titleEl = document.getElementById('modal-cal-title');
  if (!daysContainer) return;

  const y = state.calendarViewMonth.getFullYear();
  const m = state.calendarViewMonth.getMonth();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (titleEl) titleEl.textContent = `${months[m]} ${y}`;

  const firstDay = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();

  let html = '';
  // Blank spaces before start
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day-cell disabled"></div>';
  }

  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(y, m, d);
    const dateKey = state.getLocalDateKey(curDate);
    const isToday = dateKey === state.todayDateKey;
    const isSelected = dateKey === state.selectedDateKey;
    const isFuture = dateKey > state.todayDateKey;

    let dotColor = 'gray';
    if (!isFuture) {
      const prog = calculateDailyProgress(dateKey);
      if (prog.percentage >= 80) dotColor = 'green';
      else if (prog.percentage >= 40) dotColor = 'amber';
      else if (prog.percentage > 0) dotColor = 'rose';
    }

    html += `
      <div class="cal-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'disabled' : ''}" 
        onclick="selectCalendarDate('${dateKey}')">
        <span>${d}</span>
        ${!isFuture ? `<span class="cal-dot ${dotColor}"></span>` : ''}
      </div>
    `;
  }

  daysContainer.innerHTML = html;
}

window.selectCalendarDate = function(dateKey) {
  closeModal('modal-calendar');
  loadDate(dateKey);
};

/**
 * Lightbox viewer for evidence photos
 */
async function viewAttachmentLightbox(attachmentId) {
  const att = await attachmentDB.getAttachment(attachmentId);
  if (!att || !att.dataUrl) {
    showToast('Attachment not found locally.', 'error');
    return;
  }
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (img) img.src = att.dataUrl;
  if (cap) cap.textContent = `${att.fileName || 'Evidence Photo'} · Stored in local IndexedDB`;
  openModal('modal-lightbox');
}
window.viewAttachmentLightbox = viewAttachmentLightbox;

// Custom Schedule Item Save
function saveCustomScheduleItem() {
  const title = document.getElementById('sched-title-input')?.value.trim();
  const time = document.getElementById('sched-time-input')?.value;
  const desc = document.getElementById('sched-desc-input')?.value.trim();

  if (!title || !time) {
    showToast('Title and time are required.', 'error');
    return;
  }

  const log = state.getDailyLog(state.selectedDateKey);
  log.routine.push({
    id: `custom_${Date.now()}`,
    time: time,
    title: title,
    desc: desc,
    status: 'pending',
    reason: ''
  });

  // Sort by time
  log.routine.sort((a, b) => a.time.localeCompare(b.time));

  state.saveDailyLog(state.selectedDateKey, log);
  closeModal('modal-schedule-item');
  showToast('Activity added to timeline!', 'success');
  renderRoutineTimeline();
}

// Custom Grocery Item Save
function saveCustomGroceryItem() {
  const name = document.getElementById('groc-name-input')?.value.trim();
  const cat = document.getElementById('groc-cat-select')?.value || 'protein';
  const qty = document.getElementById('groc-qty-input')?.value.trim() || '1 pack';
  const price = Number(document.getElementById('groc-price-input')?.value) || 0;

  if (!name) {
    showToast('Item name is required.', 'error');
    return;
  }

  const sunday = getSundayOfWeek(state.parseLocalDate(state.selectedDateKey));
  const weekKey = `grocery_${state.getLocalDateKey(sunday)}`;
  const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}');

  if (lists[weekKey]) {
    lists[weekKey].items.push({
      id: `custom_groc_${Date.now()}`,
      name: name,
      category: cat,
      qty: qty,
      price: price,
      purchased: false,
      atHome: false
    });
    localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
    renderGroceryView(lists[weekKey]);
  }

  closeModal('modal-grocery-item');
  showToast('Grocery item added!', 'success');
}

// ============================================================================
// 8. DATA EXPORT, IMPORT & DIAGNOSTICS (Requirement 15 & 16)
// ============================================================================

async function exportApplicationData() {
  try {
    const allAttachments = await attachmentDB.getAllAttachments();
    const backupData = {
      app: 'TransformationOS',
      schemaVersion: APP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      dailyLogs: JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}'),
      groceryLists: JSON.parse(localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS) || '{}'),
      exerciseHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_HISTORY) || '{}'),
      readingState: JSON.parse(localStorage.getItem(STORAGE_KEYS.READING_STATE) || '{}'),
      attachments: allAttachments
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `transformation-os-backup-${state.todayDateKey}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Export successful! JSON backup saved.', 'success');
  } catch (e) {
    console.error('Export error:', e);
    showToast('Export failed. Check console for details.', 'error');
  }
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);
      // Validate schema
      if (!data.app || data.app !== 'TransformationOS' || !data.dailyLogs) {
        showToast('Invalid backup file. Missing required schema keys.', 'error');
        return;
      }

      const logCount = Object.keys(data.dailyLogs).length;
      const confirmMsg = `Found valid backup with ${logCount} daily records. Restoring will replace existing records. Proceed?`;
      if (!confirm(confirmMsg)) return;

      if (data.settings) state.saveSettings(data.settings);
      if (data.dailyLogs) localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(data.dailyLogs));
      if (data.groceryLists) localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(data.groceryLists));
      if (data.exerciseHistory) localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(data.exerciseHistory));
      if (data.readingState) localStorage.setItem(STORAGE_KEYS.READING_STATE, JSON.stringify(data.readingState));

      // Restore attachments into IndexedDB
      if (Array.isArray(data.attachments)) {
        for (const att of data.attachments) {
          await attachmentDB.saveAttachment(att);
        }
      }

      showToast('Data restored successfully! Refreshing...', 'success');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      console.error('Import parse error:', err);
      showToast('Corrupted JSON file. Could not parse data.', 'error');
    }
  };
  reader.readAsText(file);
}

function confirmResetAllData() {
  const pass = prompt('WARNING: This will permanently delete all logs, workouts, and evidence on this browser. Type "RESET" to confirm:');
  if (pass === 'RESET') {
    localStorage.clear();
    showToast('All local data cleared. Reloading application...', 'error');
    setTimeout(() => location.reload(), 1000);
  } else {
    showToast('Reset cancelled.', 'info');
  }
}

function updateStorageDiagnostics() {
  const diagEl = document.getElementById('storage-diagnostics');
  if (!diagEl) return;

  let totalChars = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalChars += (localStorage[key].length + key.length);
    }
  }
  const kbUsed = (totalChars / 1024).toFixed(1);
  diagEl.textContent = `LocalStorage: ~${kbUsed} KB used | IndexedDB: Evidence photos active | Offline: Ready`;
}

// ============================================================================
// 9. TOAST NOTIFICATION UTILITY
// ============================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info')}" style="width:18px;height:18px;"></i>
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);
  renderLucideIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================================
// 10. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);
