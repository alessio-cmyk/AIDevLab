import { expect, it } from "vitest";
import { currentStreakDays } from "../src/streak.js";

it("returns a streak of 2 for workouts on two consecutive days", () => {
    // User in Rome (UTC+2)
    const workouts = [
        "2026-02-10T21:00:00.000Z", // Feb 10, 11:00 PM local
        "2026-02-10T22:30:00.000Z"  // Feb 11, 12:30 AM local
    ];

    const now = new Date("2026-02-11T10:00:00.000Z"); // Feb 11, noon local
    expect(currentStreakDays(workouts, now, 120)).toBe(2);
});
