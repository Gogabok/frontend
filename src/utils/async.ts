/**
 * Timeout function to manually create delays.
 *
 * @param ms                            Amount of milliseconds to wait for.
 */
export function delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
