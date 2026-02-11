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

it("returns 0 for empty array", () => {
    expect(currentStreakDays([])).toBe(0);
});

it("returns 0 for non-array input", () => {
    expect(currentStreakDays(null)).toBe(0);
});

it("ignores invalid timestamps", () => {
    const now = new Date("2026-02-11T10:00:00.000Z");
    expect(currentStreakDays(["not-a-date"], now)).toBe(0);
});

it("stops counting at a gap in the streak", () => {
    const workouts = [
        "2026-02-08T12:00:00.000Z", // Feb 8 — gap on Feb 9
        "2026-02-10T12:00:00.000Z", // Feb 10
        "2026-02-11T12:00:00.000Z", // Feb 11
    ];
    const now = new Date("2026-02-11T18:00:00.000Z");
    expect(currentStreakDays(workouts, now)).toBe(2);
});

it("counts today when a workout already exists", () => {
    const workouts = [
        "2026-02-10T12:00:00.000Z",
        "2026-02-11T08:00:00.000Z", // worked out today
    ];
    const now = new Date("2026-02-11T18:00:00.000Z");
    expect(currentStreakDays(workouts, now)).toBe(2);
});
