/**
 * Period that used in timeline component. Contains start and end dates of the
 * period and the nested periods.
 */
export default class TimelinePeriod {

    /**
     * Local start time of period in RFC3339 format.
     */
    public from: string;

    /**
     * Local end time of period in RFC3339 format.
     */
    public to: string;

    /**
     * Nested periods (optional).
     */
    public items?: TimelinePeriod[];
}
