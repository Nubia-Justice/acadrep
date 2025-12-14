import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const school = useLiveQuery(() => db.school.toCollection().first());
    const classCount = useLiveQuery(() => db.classes.count());
    const pupilCount = useLiveQuery(() => db.pupils.count());

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome to AcadReport</h1>
                <p className="text-blue-100 text-lg">
                    {school ? `${school.name} • ${school.academicYear}` : 'Set up your school details to get started.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Classes</p>
                        <p className="text-2xl font-bold text-gray-900">{classCount || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Pupils</p>
                        <p className="text-2xl font-bold text-gray-900">{pupilCount || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Current Term</p>
                        <p className="text-2xl font-bold text-gray-900">{school?.term || '-'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/school" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-blue-600 font-medium transition-colors">
                            Configure School Details
                        </Link>
                        <Link to="/classes" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-blue-600 font-medium transition-colors">
                            Manage Classes & Subjects
                        </Link>
                        <Link to="/marks" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-blue-600 font-medium transition-colors">
                            Enter Marks
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Storage Status:</span>
                            <span className="text-green-600 font-medium">Active (IndexedDB)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Offline Mode:</span>
                            <span className="text-green-600 font-medium">Ready</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Version:</span>
                            <span>1.0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
