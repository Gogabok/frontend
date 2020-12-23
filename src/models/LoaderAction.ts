type LoaderActionType = 'resolve' | 'reject';

export interface LoaderAction {
    type: LoaderActionType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: () => any;
    label: string;
}
