export type UserRole = 'user' | 'admin';

export interface User {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    blocked?: boolean;
}

