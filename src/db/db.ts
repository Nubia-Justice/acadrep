import Dexie, { Table } from 'dexie';

export interface School {
    id?: number;
    name: string;
    academicYear: string;
    term: string;
    logo?: string; // Base64 string
}

export interface ClassEntity {
    id?: number;
    name: string;
    level: number; // e.g., 1 for Class 1
}

export interface ClassSubject {
    id?: number;
    classId: number;
    name: string;
    coefficient: number;
}

export interface Pupil {
    id?: number;
    classId: number;
    name: string;
    admissionNumber: string;
    sex: 'Male' | 'Female';
    dob?: string;
}

export interface Mark {
    id?: number;
    pupilId: number;
    subjectId: number; // References ClassSubject.id
    score: number;
    term: string;
}

export class AcadReportDB extends Dexie {
    school!: Table<School>;
    classes!: Table<ClassEntity>;
    classSubjects!: Table<ClassSubject>;
    pupils!: Table<Pupil>;
    marks!: Table<Mark>;

    constructor() {
        super('AcadReportDB');
        this.version(1).stores({
            school: '++id', // Singleton, but we'll use ID 1
            classes: '++id, name, level',
            classSubjects: '++id, classId, name',
            pupils: '++id, classId, name, admissionNumber',
            marks: '++id, pupilId, subjectId, [pupilId+subjectId]', // Compound index for uniqueness check if needed
        });
    }
}

export const db = new AcadReportDB();
