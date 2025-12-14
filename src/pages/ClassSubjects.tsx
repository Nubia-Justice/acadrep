import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ClassSubject } from '../db/db';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

const DEFAULT_SUBJECTS = [
    'Mathematics', 'English Language', 'French', 'General Knowledge', 'Science', 'History', 'Geography', 'ICT', 'Arts & Crafts', 'Physical Education'
];

const ClassSubjects: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const id = parseInt(classId || '0');

    const cls = useLiveQuery(() => db.classes.get(id), [id]);
    const subjects = useLiveQuery(() => db.classSubjects.where('classId').equals(id).toArray(), [id]);

    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectCoeff, setNewSubjectCoeff] = useState(1);

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;

        try {
            await db.classSubjects.add({
                classId: id,
                name: newSubjectName.trim(),
                coefficient: newSubjectCoeff
            });
            setNewSubjectName('');
            setNewSubjectCoeff(1);
        } catch (error) {
            console.error('Failed to add subject:', error);
        }
    };

    const handleDeleteSubject = async (subjectId: number) => {
        if (window.confirm('Delete this subject? Marks entered for this subject will be lost.')) {
            try {
                await db.classSubjects.delete(subjectId);
                // TODO: Delete associated marks
            } catch (error) {
                console.error('Failed to delete subject:', error);
            }
        }
    };

    const handleUpdateCoefficient = async (subject: ClassSubject, newCoeff: number) => {
        if (subject.id) {
            await db.classSubjects.update(subject.id, { coefficient: newCoeff });
        }
    };

    if (!cls) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/classes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Subjects</h2>
                    <p className="text-gray-500">For {cls.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Subject */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Subject</h3>
                        <form onSubmit={handleAddSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                                <input
                                    type="text"
                                    list="defaultSubjects"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Mathematics"
                                    required
                                />
                                <datalist id="defaultSubjects">
                                    {DEFAULT_SUBJECTS.map(s => <option key={s} value={s} />)}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={newSubjectCoeff}
                                    onChange={(e) => setNewSubjectCoeff(parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Subject
                            </button>
                        </form>
                    </div>
                </div>

                {/* Subject List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Coefficient</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {subjects?.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <input
                                                type="number"
                                                min="1"
                                                value={subject.coefficient}
                                                onChange={(e) => handleUpdateCoefficient(subject, parseInt(e.target.value) || 1)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <button
                                                onClick={() => subject.id && handleDeleteSubject(subject.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                                title="Delete Subject"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {subjects?.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No subjects added yet. Add subjects from the panel on the left.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassSubjects;
