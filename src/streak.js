// src/streak.js

/**
 * Compute the current workout streak in days, based on a "local day" defined by tzOffsetMinutes.
 *
 * tzOffsetMinutes:
 * - Rome winter: +60
 * - Rome summer: +120

 * @param {string[]} workoutISOTimestamps
 * @param {Date} now
 * @param {number} tzOffsetMinutes - minutes offset from UTC for the user's local time
 * @returns {number}
 */
export function currentStreakDays(workoutISOTimestamps, now = new Date(), tzOffsetMinutes = 0) {
    if (!Array.isArray(workoutISOTimestamps) || workoutISOTimestamps.length === 0) return 0;

    // Convert a UTC Date to a YYYY-MM-DD key in the user's local timezone
    const toLocalDayKey = (d) => {
        const local = new Date(d.getTime() + tzOffsetMinutes * 60_000);
        return local.toISOString().slice(0, 10);
    };

    // Normalize workouts to day keys
    const dayKeys = workoutISOTimestamps
        .map((ts) => new Date(ts))
        .filter((d) => !Number.isNaN(d.getTime()))
        .map(toLocalDayKey);

    const uniqueDays = Array.from(new Set(dayKeys)).sort(); // ascending
    const daySet = new Set(uniqueDays);

    let cursorKey = toLocalDayKey(now);

    // Helper: subtract 1 day from a YYYY-MM-DD key (naive UTC)
    const prevDayKey = (key) => {
        const d = new Date(key + "T00:00:00.000Z");
        d.setUTCDate(d.getUTCDate() - 1);
        return d.toISOString().slice(0, 10);
    };

    // Count consecutive days present (allow starting from yesterday if today missing)
    let streak = 0;
    for (let i = 0; i < 366; i++) {
        if (daySet.has(cursorKey)) {
            streak += 1;
            cursorKey = prevDayKey(cursorKey);
        } else {
            if (i === 0) {
                cursorKey = prevDayKey(cursorKey);
                continue;
            }
            break;
        }
    }

    return streak;
}