export interface Validator {
    validate: (value: string) => boolean | Promise<boolean>;
    errorMessage: string;
    value: string;
    fieldName: string;
    id: string;
    dependsOn?: string[];
}
