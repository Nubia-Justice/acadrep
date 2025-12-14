import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Mark } from '../db/db';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const MarksEntry: React.FC = () => {
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
    const [marks, setMarks] = useState<Record<number, number>>({}); // pupilId -> score
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const classes = useLiveQuery(() => db.classes.orderBy('level').toArray());
    const subjects = useLiveQuery(
        () => selectedClassId ? db.classSubjects.where('classId').equals(selectedClassId).toArray() : [],
        [selectedClassId]
    );
    const pupils = useLiveQuery(
        () => selectedClassId ? db.pupils.where('classId').equals(selectedClassId).toArray() : [],
        [selectedClassId]
    );

    // Load existing marks when subject changes
    useEffect(() => {
        const loadMarks = async () => {
            if (selectedClassId && selectedSubjectId) {
                const existingMarks = await db.marks
                    .where('subjectId')
                    .equals(selectedSubjectId)
                    .toArray();

                const marksMap: Record<number, number> = {};
                existingMarks.forEach(m => {
                    marksMap[m.pupilId] = m.score;
                });
                setMarks(marksMap);
            } else {
                setMarks({});
            }
        };
        loadMarks();
    }, [selectedClassId, selectedSubjectId]);

    const handleMarkChange = (pupilId: number, value: string) => {
        const numValue = parseFloat(value);
        if (value === '' || (numValue >= 0 && numValue <= 20)) {
            setMarks(prev => ({
                ...prev,
                [pupilId]: value === '' ? -1 : numValue // Use -1 or undefined for empty
            }));
            setSaveStatus('idle');
        }
    };

    const handleSave = async () => {
        if (!selectedClassId || !selectedSubjectId) return;

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            const marksToSave: Mark[] = [];

            // Prepare batch operations
            for (const pupil of pupils || []) {
                const score = marks[pupil.id!];
                if (score !== undefined && score !== -1) {
                    // Check if mark exists to update or add
                    const existingMark = await db.marks
                        .where({ pupilId: pupil.id!, subjectId: selectedSubjectId })
                        .first();

                    if (existingMark) {
                        await db.marks.update(existingMark.id!, { score });
                    } else {
                        await db.marks.add({
                            pupilId: pupil.id!,
                            subjectId: selectedSubjectId,
                            score,
                            term: 'Term 1' // TODO: Get from school settings
                        });
                    }
                }
            }
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to save marks:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Marks Entry</h2>
                    <p className="text-gray-500">Enter marks for a specific class and subject.</p>
                </div>
                <div className="flex items-center gap-2">
                    {saveStatus === 'success' && (
                        <span className="text-green-600 flex items-center gap-1 text-sm font-medium animate-fade-in">
                            <CheckCircle className="w-4 h-4" /> Saved
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-600 flex items-center gap-1 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" /> Error
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!selectedClassId || !selectedSubjectId || isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Marks'}
                    </button>
                </div>
            </div>

            {/* Selectors */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => {
                            setSelectedClassId(parseInt(e.target.value));
                            setSelectedSubjectId(0);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="0">-- Select Class --</option>
                        {classes?.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(parseInt(e.target.value))}
                        disabled={!selectedClassId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        <option value="0">-- Select Subject --</option>
                        {subjects?.map(s => (
                            <option key={s.id} value={s.id}>{s.name} (Coeff: {s.coefficient})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Marks Grid */}
            {selectedClassId && selectedSubjectId ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No.</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pupil Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Score (/20)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pupils?.map((pupil, index) => (
                                <tr key={pupil.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pupil.name}</td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            step="0.5"
                                            value={marks[pupil.id!] !== undefined && marks[pupil.id!] !== -1 ? marks[pupil.id!] : ''}
                                            onChange={(e) => handleMarkChange(pupil.id!, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="-"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {pupils?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        No pupils found in this class. Add pupils first.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">Please select a class and subject to start entering marks.</p>
                </div>
            )}
        </div>
    );
};

export default MarksEntry;
