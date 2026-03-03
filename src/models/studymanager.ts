import dayjs from 'dayjs';

export type Subject = {
	id: string;
	name: string;
};

export type StudyLog = {
	id: string;
	subjectId: string;
	date: string;
	duration: number;
	content: string;
};

export type MonthlyGoal = {
	subjectId: string;
	targetMinutes: number;
};

const KEYS = {
	SUBJECTS: 'subjects',
	LOGS: 'logs',
	GOALS: 'goals',
};

export const studyService = {
	getSubjects: (): Subject[] => JSON.parse(localStorage.getItem(KEYS.SUBJECTS) || '[]'),
	saveSubjects: (data: Subject[]) => localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(data)),
	getLogs: (): StudyLog[] => JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]'),
	saveLogs: (data: StudyLog[]) => localStorage.setItem(KEYS.LOGS, JSON.stringify(data)),
	getGoals: (): MonthlyGoal[] => JSON.parse(localStorage.getItem(KEYS.GOALS) || '[]'),
	saveGoals: (data: MonthlyGoal[]) => localStorage.setItem(KEYS.GOALS, JSON.stringify(data)),
};
