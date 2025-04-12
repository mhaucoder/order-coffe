export type Customer = {
    _id?: string;
    name: string;
    username?: string;
    email?: string;
};

export type CreateCustomer = {
    name: string;
    username?: string;
    email?: string;
};