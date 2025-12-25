export interface Task {
    _id: string;
    description: string;
    completed: boolean;
    createBy: string;
    title?: string;
    dueDate?: string | null;
}

