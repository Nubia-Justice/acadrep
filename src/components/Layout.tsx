import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { School, Users, BookOpen, FileText, Settings, Home } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/school', label: 'School Setup', icon: School },
        { path: '/classes', label: 'Classes', icon: BookOpen },
        { path: '/pupils', label: 'Pupils', icon: Users },
        { path: '/marks', label: 'Marks Entry', icon: FileText },
        { path: '/reports', label: 'Reports', icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <BookOpen className="w-8 h-8" />
                        AcadReport
                    </h1>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
                    AcadReport v1.0 <br /> Offline-First App
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
