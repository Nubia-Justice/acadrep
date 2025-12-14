import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Pupil, ClassEntity } from '../db/db';
import { Plus, Edit2, Trash2, X, Search, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const PupilManagement: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedClassId = parseInt(searchParams.get('classId') || '0');

    const classes = useLiveQuery(() => db.classes.orderBy('level').toArray());
    const pupils = useLiveQuery(
        () => {
            let collection = db.pupils.toCollection();
            if (selectedClassId) {
                collection = db.pupils.where('classId').equals(selectedClassId);
            }
            return collection.toArray();
        },
        [selectedClassId]
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPupil, setEditingPupil] = useState<Pupil | null>(null);
    const [formData, setFormData] = useState<Pupil>({
        name: '',
        classId: selectedClassId || 0,
        admissionNumber: '',
        sex: 'Male',
        dob: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPupils = pupils?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (pupil?: Pupil) => {
        if (pupil) {
            setEditingPupil(pupil);
            setFormData(pupil);
        } else {
            setEditingPupil(null);
            setFormData({
                name: '',
                classId: selectedClassId || (classes?.[0]?.id || 0),
                admissionNumber: '',
                sex: 'Male',
                dob: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPupil(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPupil?.id) {
                await db.pupils.update(editingPupil.id, formData);
            } else {
                await db.pupils.add(formData);
            }
            closeModal();
        } catch (error) {
            console.error('Failed to save pupil:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this pupil? All marks for this pupil will be lost.')) {
            try {
                await db.pupils.delete(id);
                // TODO: Cascade delete marks
            } catch (error) {
                console.error('Failed to delete pupil:', error);
            }
        }
    };

    const handleClassFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newClassId = e.target.value;
        setSearchParams(newClassId ? { classId: newClassId } : {});
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Pupil Management</h2>
                    <p className="text-gray-500">Manage student records and class assignments.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    disabled={!classes?.length}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    Add New Pupil
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or admission number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="w-full md:w-64">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={selectedClassId}
                            onChange={handleClassFilterChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                        >
                            <option value="0">All Classes</option>
                            {classes?.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Pupil List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPupils?.map((pupil) => (
                                <tr key={pupil.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{pupil.admissionNumber}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pupil.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{pupil.sex}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {classes?.find(c => c.id === pupil.classId)?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(pupil)}
                                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => pupil.id && handleDelete(pupil.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPupils?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No pupils found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingPupil ? 'Edit Pupil' : 'Add New Pupil'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission No</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.admissionNumber}
                                        onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                                    <select
                                        value={formData.sex}
                                        onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'Male' | 'Female' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                <select
                                    required
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="" disabled>Select Class</option>
                                    {classes?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
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
                                    {editingPupil ? 'Save Changes' : 'Add Pupil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PupilManagement;
