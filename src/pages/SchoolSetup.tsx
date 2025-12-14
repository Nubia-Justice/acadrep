import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, School } from '../db/db';
import { Save, Upload } from 'lucide-react';

const SchoolSetup: React.FC = () => {
    const existingSchool = useLiveQuery(() => db.school.toCollection().first());
    const [formData, setFormData] = useState<School>({
        name: '',
        academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        term: 'Term 1',
        logo: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (existingSchool) {
            setFormData(existingSchool);
        }
    }, [existingSchool]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        try {
            if (existingSchool?.id) {
                await db.school.update(existingSchool.id, formData);
            } else {
                await db.school.add(formData);
            }
            setMessage({ type: 'success', text: 'School settings saved successfully!' });
        } catch (error) {
            console.error('Failed to save school settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">School Configuration</h2>
                <p className="text-sm text-gray-500 mt-1">Set up your school details for report cards.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Government Primary School Buea"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                            <input
                                type="text"
                                id="academicYear"
                                name="academicYear"
                                required
                                value={formData.academicYear}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. 2024-2025"
                            />
                        </div>

                        <div>
                            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">Current Term</label>
                            <select
                                id="term"
                                name="term"
                                value={formData.term}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="Term 1">Term 1</option>
                                <option value="Term 2">Term 2</option>
                                <option value="Term 3">Term 3</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Logo (Optional)</label>
                        <div className="mt-1 flex items-center gap-4">
                            <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                                {formData.logo ? (
                                    <img src={formData.logo} alt="School Logo" className="h-full w-full object-contain" />
                                ) : (
                                    <Upload className="w-8 h-8 text-gray-400" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>Click to upload or drag and drop.</p>
                                <p>Recommended: PNG or JPG, max 1MB.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SchoolSetup;
