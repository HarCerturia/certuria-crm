const PT_RANGES: readonly [number, number, number][] = [
    [0.1, 5.99, 1.5],
    [6, 10.99, 2],
    [11, 15.99, 2.5],
    [16, 25.99, 3],
    [26, 45.99, 4],
    [46, 65.99, 5],
    [66, 85.99, 6],
    [86, 125.99, 7],
    [126, 175.99, 8],
    [176, 275.99, 9],
    [276, 425.99, 10],
    [426, 625.99, 11],
    [626, 875.99, 12],
    [876, 1175.99, 13],
    [1176, 1550.99, 14],
    [1551, 2025.99, 15],
    [2026, 2675.99, 16],
    [2676, 3450.99, 17],
    [3451, 4350.99, 18],
    [4351, 5450.99, 19],
    [5451, 6800.99, 20],
    [6801, 8500.99, 21],
    [8501, 10700.99, 22],
] as const;

export const usePtCalc = (ma: number): number | null => {
    if (!ma || ma <= 0) {
        if (ma !== 0) console.warn('keine MA übergeben');
        return null;
    }

    // Binary search - much faster than linear search
    let left = 0;
    let right = PT_RANGES.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const range = PT_RANGES[mid];

        if (!range) break; // Safety check (shouldn't happen)

        const [min, max, pt] = range;

        if (ma >= min && ma <= max) {
            return pt;
        } else if (ma < min) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return null;
};
