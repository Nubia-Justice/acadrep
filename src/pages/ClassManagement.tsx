import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ClassEntity } from '../db/db';
import { Plus, Edit2, Trash2, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassManagement: React.FC = () => {
    const classes = useLiveQuery(() => db.classes.orderBy('level').toArray());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassEntity | null>(null);
    const [formData, setFormData] = useState<ClassEntity>({ name: '', level: 1 });

    const openModal = (cls?: ClassEntity) => {
        if (cls) {
            setEditingClass(cls);
            setFormData(cls);
        } else {
            setEditingClass(null);
            setFormData({ name: '', level: classes ? classes.length + 1 : 1 });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClass(null);
        setFormData({ name: '', level: 1 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingClass?.id) {
                await db.classes.update(editingClass.id, formData);
            } else {
                await db.classes.add(formData);
            }
            closeModal();
        } catch (error) {
            console.error('Failed to save class:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this class? All pupils and marks in this class will also be deleted.')) {
            try {
                await db.classes.delete(id);
                // TODO: Cascade delete pupils and marks
            } catch (error) {
                console.error('Failed to delete class:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
                    <p className="text-gray-500">Manage your school classes and their subjects.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add New Class
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes?.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                                <span className="text-sm text-gray-500">Level {cls.level}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(cls)}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Edit Class"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => cls.id && handleDelete(cls.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete Class"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            <Link
                                to={`/classes/${cls.id}/subjects`}
                                className="flex items-center justify-between px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                            >
                                Manage Subjects
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                            <Link
                                to={`/pupils?classId=${cls.id}`}
                                className="flex items-center justify-between px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                            >
                                View Pupils
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                        </div>
                    </div>
                ))}

                {classes?.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">No classes found. Get started by adding a class.</p>
                        <button
                            onClick={() => openModal()}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Add Your First Class
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingClass ? 'Edit Class' : 'Add New Class'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                <input
                                    type="text"
                                    id="className"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="e.g. Class 1"
                                />
                            </div>
                            <div>
                                <label htmlFor="classLevel" className="block text-sm font-medium text-gray-700 mb-1">Level (Order)</label>
                                <input
                                    type="number"
                                    id="classLevel"
                                    required
                                    min="1"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Used for sorting classes (1 = Lowest).</p>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    {editingClass ? 'Save Changes' : 'Create Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
