it("timezone bug: workouts on different local days but same UTC day", () => {
    const tzOffsetMinutes = 120; // UTC+2

    /**
     * Local:
     * 2026-02-10 00:30 (UTC+2) = 2026-02-09 22:30Z
     * 2026-02-10 23:30 (UTC+2) = 2026-02-10 21:30Z
     *
     * We want two workouts that fall on:
     * Local Feb 10 and Feb 11
     * but BOTH map into same UTC date if offset ignored.
     */

    const workouts = [
        "2026-02-09T23:30:00.000Z", // Feb 10 01:30 local
        "2026-02-10T00:30:00.000Z"  // Feb 10 02:30 local
    ];

    const now = new Date("2026-02-10T23:00:00.000Z");

    // In local time, these may belong to different local-day boundaries
    // depending on offset logic.
    expect(currentStreakDays(workouts, now, tzOffsetMinutes)).toBe(2);
});