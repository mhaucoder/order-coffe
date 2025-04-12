export type Member = {
    _id?: string;
    name: string;
    username?: string;
    email?: string;
};

export type CreateMember = {
    name: string;
    username?: string;
    email?: string;
};