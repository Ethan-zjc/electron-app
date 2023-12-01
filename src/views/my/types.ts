export interface ListType {
    id?: number;
    url?: string;
    title?: string;
    subtitle?: string;
    labelImage?: string;
    bottom?: string;
    remindText?: string;
    action: {
        type: number;
        target_id: number;
    };
}

export interface ControlType {
    name: string;
    type: string;
}
