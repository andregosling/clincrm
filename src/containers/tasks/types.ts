export enum TaskStatus {
	Pending = 'pending',
	Done = 'done',
}

export type Task = {
	id: string;
	title: string;
	description: string;
	date_created: string;
	date_limit: string;
	status: TaskStatus;
	assigned: string;
	clinicId: string;
};
