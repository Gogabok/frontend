/**
 * Custom filters.
 */
export const filters = {
        /**
         * Appends '0' before digits (0-9).
         *
         * @param val       Number to be modified.
         */
    doubleFormat(val: number): string {
        let value: string = val.toString();
        if (value.length < 2) value = '0' + value;
        return value;
    },
};

export default filters;
