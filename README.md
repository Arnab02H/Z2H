# Transformation OS — Personal Transformation Dashboard

A premium, mobile-first personal transformation web application and operating system built strictly using **HTML5, CSS3, and vanilla JavaScript**.

Designed specifically for ambitious working professionals working demanding hours (e.g., **12:30 PM to 10:00 PM, Monday to Friday**) who want to systematically master fitness, nutrition, grooming, AI/ML engineering skills, reading habits (*Zero to One*), financial discipline (₹200/day savings), and sleep recovery.

---

## 1. How to Launch the Application

The application is completely self-contained with **zero build steps, zero node dependencies, and no external backend required**.

### Option A: Direct Browser Launch
1. Navigate to the project directory:
   ```bash
   cd "c:\Users\Arnab Bera\Desktop\Z2H"
   ```
2. Double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Mozilla Firefox, or Brave).
3. The application will initialize local stores automatically and load today's real-time schedule.

### Option B: VS Code Live Server
1. Open the folder in **Visual Studio Code**.
2. Install the **Live Server** extension (`ritwickdey.liveserver`) if not already installed.
3. Right-click `index.html` and choose **"Open with Live Server"** (or click "Go Live" on the bottom status bar).
4. The dashboard will launch at `http://127.0.0.1:5500/index.html`.

### Mobile Phone Testing & Emulation
- **Desktop Chrome / Edge DevTools**: Press `F12` or `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac). Click the **Device Toolbar icon** (`Ctrl + Shift + M`) and select a mobile viewport such as **iPhone 14 Pro**, **Pixel 7**, or custom **390 × 844 px**.
- **Real Mobile Device**: If running via Live Server on your local Wi-Fi, open your computer's local IP (e.g., `http://192.168.1.X:5500/index.html`) on your smartphone's mobile browser. Add to home screen as a Progressive Web App (PWA) / standalone web clip.

---

## 2. Core Architecture & Technical Design

```
Z2H/
├── index.html       # Semantic HTML5 mobile structure & modals
├── styles.css       # Mobile-first CSS3 design system (charcoal/emerald/blue)
├── app.js           # Vanilla JS core state, business logic, calculations, & DB
└── README.md        # Documentation, operational guide & QA scenarios
```

- **Framework-Free**: Pure HTML5, modern CSS3 variables and animations, and ES6+ JavaScript.
- **Strictly Mobile-First**: Layout engineered for 320–430 px viewports with touch targets ≥ 44 × 44 px, safe-area inset padding for iOS home indicator/notches, and smooth touch gestures.
- **Single-Device Local Persistence**: All user records are stored strictly in client-side storage with zero tracking or telemetry.
- **Offline Resilience**: Features native Canvas charts and built-in SVG icon fallbacks. If the network is disconnected or CDNs are blocked, all charts and icons continue functioning without failure.

---

## 3. How Daily Records Are Stored

The application uses a **versioned dual-storage architecture**:

### A. LocalStorage: Structured Metadata & Daily Records
Keyed records stored in `window.localStorage`:
- `transformation_os_settings`: User profile, shifts timings (12:30–22:00), habit targets (₹200 savings, 120g protein, 60m study, 30m reading).
- `transformation_os_daily_logs`: Dictionary of daily logs indexed by local date string `YYYY-MM-DD` (e.g., `"2026-10-21"`).
- `transformation_os_grocery_lists`: Weekly shopping records and meal prep tasks indexed by `grocery_YYYY-MM-DD` (Sunday date).
- `transformation_os_exercise_history`: PR (Personal Record) weights and reps logged per exercise ID.
- `transformation_os_reading_state`: Continuous bookmarking state (`lastPage`) for *Zero to One*.

#### Daily Log Schema
```javascript
{
  date: "YYYY-MM-DD",
  finalized: false,
  finalizedAt: null,
  habits: {
    wakeUp: false,
    morningSkincare: false,
    waterHydration: false,
    preWorkoutSnack: false,
    workout: false,
    postWorkoutBreakfast: false,
    lunchSnackDinner: false,
    nightSkincare: false,
    studySession: false,
    readingZeroToOne: false,
    saveMoney: false,
    bedtimeSleep: false
  },
  workout: {
    completed: false,
    type: "Upper Body A",
    isRestDay: false,
    exercises: [ { id, name, target, sets, repsCompleted, weight, notes, completed } ],
    notes: ""
  },
  meals: {
    preWorkout: false,
    breakfast: false,
    lunch: false,
    snack: false,
    dinner: false,
    customItems: [],
    waterGlasses: 0,
    notes: ""
  },
  study: {
    completed: false,
    topic: "",
    minutes: 0,
    notes: ""
  },
  reading: {
    completed: false,
    startPage: 1,
    endPage: 15,
    minutes: 30,
    quote: "",
    takeaway: "",
    application: "",
    notes: ""
  },
  savings: {
    target: 200,
    amount: 0,
    saved: false,
    note: ""
  },
  routine: [ ... ],
  missedItems: [ ... ],
  reflection: ""
}
```

### B. IndexedDB: Evidence & Photo Attachments
- **Database Name**: `TransformationOS_EvidenceDB`
- **Object Store**: `attachments`
- **Record**: `{ id, date, taskId, fileName, fileType, fileSize, dataUrl, createdAt }`
- **Why IndexedDB?**: Browser LocalStorage has a strict quota of ~5 MB total. High-resolution screenshots or gym camera evidence quickly exceed this threshold. IndexedDB safely stores images up to hundreds of megabytes without degrading LocalStorage performance.

---

## 4. How to Attach Images to Missed Tasks

When a habit cannot be completed due to office demands, fatigue, or travel:
1. Tap the `···` button next to any habit on the **Home** checklist, or tap the **"Review"** chip / **"Finalize Day"** button.
2. Set status to **"Missed (Require Explanation)"**.
3. Select a reason category (e.g., *Office workload*, *Poor sleep or fatigue*, *Travel or commute*).
4. Enter the required **Written Explanation** (answering what happened, why it happened, and what you will adjust tomorrow).
5. Tap the **Evidence / Photo Attachment Dropzone**:
   - On a smartphone, this triggers the **native camera** or **photo gallery**.
   - On a desktop, this opens the system file picker.
   - Supports JPG, PNG, and WebP up to **5 MB**.
6. The app validates file size, renders an immediate **image preview**, and stores the image in **IndexedDB**.
7. Tap **"Finalize Record"**.
8. You can view full-screen evidence photos anytime by tapping **"View Attached Photo"** in the Progress screen's Missed Tasks Audit Log.

---

## 5. How Dates and Weekly Records Are Calculated

### Native Browser Date APIs & Local Date Keys
- All record keys are generated via `getLocalDateKey(date)` using the device's local date components:
  ```javascript
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
  ```
- **Timezone Safety**: This prevents the common off-by-one UTC shift bug where calling `toISOString()` near midnight (such as working until 10:00 PM and studying at 12:00 AM) would mistakenly assign your records to tomorrow.

### Date Navigation Rules
- **Past Days**: You can navigate freely backward in time using `<` or the calendar picker to view historical records or complete pending reviews.
- **Future Dates**: Forward navigation `>` is strictly disabled once you reach today. Future dates cannot be finalized or falsely marked completed in advance.

### Calculation Rules & Performance Integrity
- **Rest Days**: Wednesday (*Active Recovery*) and Sunday (*Recovery & Meal Prep*) are flagged with `isRestDay: true`. Scheduled rest days **never penalize** your workout consistency percentage.
- **Streaks**: Calculated strictly from completed dates with ≥ 60% routine completion. Future dates are excluded.
- **Weekly Executive Summary**: Built dynamically by summing actual records in the selected range:
  $$\text{Completion Rate} = \frac{\sum \text{Completed Tasks}}{\sum \text{Applicable Tasks}} \times 100$$
- **Savings Completion Rate**: Number of days with actual savings $\ge \text{₹200}$ divided by eligible tracked days $\times 100$.

---

## 6. How to Export and Restore Backups

To ensure data permanence across browser resets or device migrations:

### Exporting Backup
1. Navigate to the **Settings** tab.
2. Under **Data Backup & Restore**, tap **"Export All Application Data (JSON)"**.
3. The app compiles all settings, daily logs, grocery lists, exercise history, and IndexedDB photo attachments into a single structured JSON file:
   `transformation-os-backup-YYYY-MM-DD.json`.
4. The file downloads directly to your device storage.

### Restoring Backup
1. In the **Settings** tab, tap **"Restore from JSON Backup"**.
2. Select your previously exported `.json` file.
3. The app validates the file schema (`app: "TransformationOS"` and `schemaVersion`).
4. A confirmation prompt displays the number of daily records found and asks for approval before replacing local records.
5. All records and IndexedDB evidence photos are restored, and the application reloads seamlessly.

---

## 7. Deep-Dive Screen Guide

### 1. Home Dashboard
- **Top Bar**: Live clock, time-of-day greeting, and date navigation.
- **Dynamic Recovery Banner**: If yesterday had an unrecovered missed task, a priority banner appears with yesterday's reason, proposed recovery action, and a 1-tap **"Mark Recovery Complete"** button.
- **Daily Progress Ring**: Animated SVG circular progress ring showing current completion percentage, completed vs total applicable tasks, and contextual motivational messaging.
- **4-Pillar Glance Grid**: Gym status, Protein consumed vs 120g target, AI/ML study minutes, and ₹ Saved today.
- **Today's Priorities**: The next 3 scheduled items based on your daily schedule.
- **Core 12 Habit Checklist**: Interactive checkboxes with instant progress ring recalculation.
- **Quick Action Cards**: Dedicated modules for Gym Workout, Daily ₹200 Savings, and Study/Reading snapshots.

### 2. Daily Routine & Schedule
- **Sleep Warning Algorithm**: Analyzes your configured study time and 8:00 AM wake-up time. If late-night studying and reading after 12:00 AM leaves less than 7 hours of sleep, an active alert prompts you to shift study sessions earlier.
- **Vertical Timeline**: 13 structured milestones spanning 8:00 AM wake-up, pre-workout, gym, breakfast, grooming, commute, 12:30–10:00 PM office work, meals, and evening study/reading.
- **Actions**: Mark complete, skip with a mandatory reason, or reschedule. Custom schedule items can be added with custom times.

### 3. Food, Nutrition & Sunday Grocery
- **Today's Meals**: Full Monday–Sunday meal plans pre-configured with pre-workout, breakfast, office lunch, 5:30 PM snack, and dinner.
- **Macronutrient Estimates**: Daily protein progress bar tracking toward your 120g target (with clear disclaimer that numbers are estimates).
- **Water Hydration Tracker**: 8 interactive glasses (250 ml each = 2.0 L) with quick-tap increment controls.
- **Custom Food Items**: Add custom snacks, protein shakes, or meals on the fly.
- **Sunday Grocery & Meal Prep**:
  - Automatically generates the weekly grocery checklist grouped into Protein, Grains, Vegetables, Fruits, Dairy, and Pantry.
  - "In Pantry / Need" toggles prevent buying duplicate supplies.
  - Estimated cost vs actual spend calculator.
  - 6-step Sunday meal prep checklist (chicken portioning, egg boiling, batch cooking, vegetable washing, snack packing, office lunch prep).

### 4. Progress & Analytics
- **Date Filters**: *Last 7 Days*, *Last 30 Days*, *This Month*, and *Custom Date Range*.
- **Executive Summary Statement**: Dynamically generated sentence summarizing verified workouts, study hours, reading minutes, and savings.
- **Pure Canvas Charts (100% Offline)**:
  - Routine Completion Trend line chart with smooth gradients and data points.
  - Daily Savings bar chart with ₹200 target dashed line indicator.
- **Missed Tasks Audit Log**: Transparent historical log of all missed habits, recorded reasons, recovery action status, and photo attachments.

### 5. Settings & Customization
- **Profile**: Customize name and avatar initials.
- **Shift & Timings**: Set wake-up, office shift start (12:30 PM), office shift end (10:00 PM), and study times.
- **Targets**: Configure daily savings (₹200), protein target (120g), study minutes (60m), and reading minutes (30m).
- **Data Management**: JSON Export, JSON Import, Reset All Data with safety confirmation, and storage diagnostics.

---

## 8. Quality Assurance & Testing Verification

The application has been verified against all 17 QA scenarios:

| Scenario | Expected Behavior | Status |
|---|---|---|
| **1. Current Date** | Displays real-time device local date dynamically without hardcoding. | Pass |
| **2. Persistence** | Check habit, refresh page, habit remains checked and progress ring updates. | Pass |
| **3. Date Navigation** | Navigating to yesterday loads isolated records for that date. | Pass |
| **4. Future Date Protection** | Next button is disabled for tomorrow; future dates cannot be finalized. | Pass |
| **5. Review Prompt** | Past incomplete days display a "Review Required" prompt. | Pass |
| **6. Accountability Record** | Missed task modal validates required written explanation and stores image. | Pass |
| **7. Refresh Persistence** | Refreshing keeps missed task reports and IndexedDB images intact. | Pass |
| **8. Recovery Preservation** | Completing recovery updates task without erasing original missed history. | Pass |
| **9. Savings Idempotency** | Editing savings amount recalculates correctly without double-counting. | Pass |
| **10. Savings Calculations** | Weekly (₹1,400) and Monthly (₹200 × days in month) calculate accurately. | Pass |
| **11. Sunday Grocery** | Automatically generates weekly shopping list with pantry check. | Pass |
| **12. Rest Day Consistency** | Wednesday/Sunday recovery sessions do not lower gym consistency rate. | Pass |
| **13. Backup Export/Import** | JSON backup downloads and restores cleanly to another browser state. | Pass |
| **14. Invalid File Guard** | Importing malformed or corrupted JSON rejects with an error toast. | Pass |
| **15. Mobile UI & Touch** | 320–430 px viewport, zero horizontal overflow, touch targets ≥ 44 px. | Pass |
| **16. Notification Safety** | Browser notification absence or permission denial never breaks UI logic. | Pass |
| **17. Storage Diagnostics** | Displays active LocalStorage usage and IndexedDB status gracefully. | Pass |

---

## 9. Browser Limitations & Privacy Considerations

1. **100% Client-Side Privacy**:
   - No external analytics, trackers, or cloud servers are used.
   - Evidence photos, personal notes, and financial savings numbers never leave your local device.
2. **Browser Cache & Data Clearing**:
   - If you manually click "Clear Browsing Data / Cache and Cookies" in your browser settings, LocalStorage and IndexedDB may be purged.
   - **Recommendation**: Use the built-in **"Export All Application Data (JSON)"** feature every Sunday during your weekly review to keep a permanent backup on your disk or cloud drive.
3. **Private Browsing / Incognito Mode**:
   - In Incognito mode, browsers delete LocalStorage and IndexedDB as soon as the window is closed. Always use standard browser mode for persistent daily tracking.
4. **Single-Device Design**:
   - Because this app uses local browser APIs, records do not automatically synchronize across different devices over the internet. Use the JSON export/import workflow to move your data between devices.

---

*Transformation OS — Engineered for discipline, integrity, and relentless daily progress.*
