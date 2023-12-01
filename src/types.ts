export interface UserDataType {
    id: number;
    nickname: string;
}

export interface RequestHeaderType {
    ['content-type']?: string;
    ['Package-Id']?: string;
    ['User-Agent-Mini']?: string;
    ['Mini-Id']?: string;
    ['Cookie']?: string;
}

export interface TabBarType {
    id: number;
    title: string;
    type: string;
}
