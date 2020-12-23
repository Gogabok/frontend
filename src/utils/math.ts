/**
 * Returns `value` clamped between `minValue` and `maxValue`.
 *
 * @param value     Value to be clamped.
 * @param minValue  Min possible value.
 * @param maxValue  Max possible value.
 */
export function clamp(
    value: number,
    minValue: number,
    maxValue: number,
): number {
    return value < minValue
        ? minValue
        : value > maxValue
            ? maxValue
            : value;
}
