/**
 * Indicates whether the given string is not empty.
 *
 * @param value                         Text value what should be checked.
 */
export const isFilled = (value: string): boolean => !!value.trim().length;

/**
 * Indicates whether all the provided data items are equal.
 *
 * @param data                          Data items to be compared.
 */
export const areSame = <T>(...data: T[]): boolean => data.every(
    item => item === data[0],
);
