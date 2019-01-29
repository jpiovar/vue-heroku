export type Answer = {
    id: string;
    authorId: string;
    text: string;
};

export interface QuoraItem {
    id: string;
    authorId: string;
    text: string;
    answers: Answer[];
}

export type QuoraStatus = 'initial'|'loading'|'done';

export interface QuoraStore {
    quoraItems: QuoraItem[];
    quoraStatus: QuoraStatus;
}