export interface FindBannerType {
    image: string;
    id: number;
    action: {
        type?: number;
        action_type: number;
        target_id: number;
        target_web_url: string;
        parent_target_id: number;
    };
}

export interface FindNavType {
    title: string;
    image: string;
    id: number;
    action: {
        type?: number;
        action_type: number;
        target_id: number;
        target_web_url: string;
        parent_target_id: number;
    };
}

export interface FindTopicType {
    id: number;
    image: string;
    bottom?: string;
    title: string;
    subtitle: string;
    icon?: string;
    action: {
        type?: number;
        action_type: number;
        target_id: number;
        target_web_url: string;
        parent_target_id: number;
    };
}

export interface FindListType {
    id?: number;
    title?: string;
    module_type?: number;
    module_id?: number;
    uuid?: string;
    banner_list?: any;
}

export interface FindRankNavType {
    id: number;
    title: string;
}

export interface FindClassType {
    id: number;
    title: string;
    filterIds: string;
    list: Array<FindTopicType>;
    firstBg: string;
}
