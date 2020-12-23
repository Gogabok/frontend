export interface Searchable {
    contains: (data: any) => boolean; // eslint-disable-line
    is: (data: any) => boolean; // eslint-disable-line
}

export interface ToString {
    toString: (data?: any) => string; // eslint-disable-line
}

export interface Identifiable {
    id: () => string;
}
