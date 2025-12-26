export interface Task {
    _id: string;
    description: string;
    completed: boolean;
    createBy: string;
    title?: string;
    dueDate?: string | null;
    owner?: TaskOwner;
}

export interface TaskOwner {
    _id: string;
    username: string;
    email: string;
}

