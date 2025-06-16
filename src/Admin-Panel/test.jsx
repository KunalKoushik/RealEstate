import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart3,
    Settings,
    Bell,
    Search,
    TrendingUp,
    UserCheck,
    MessageCircle,
    Flag
} from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const stats = [
        { title: 'Total Users', value: '24.5K', trend: '+12%', icon: <UserCheck className="w-6 h-6" /> },
        { title: 'Active Posts', value: '145.8K', trend: '+8%', icon: <MessageCircle className="w-6 h-6" /> },
        { title: 'Reports', value: '89', trend: '-2%', icon: <Flag className="w-6 h-6" /> },
        { title: 'Engagement', value: '87%', trend: '+5%', icon: <TrendingUp className="w-6 h-6" /> },
    ];

    const recentUsers = [
        { id: 1, name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'active' },
        { id: 2, name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'active' },
        { id: 3, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'inactive' },
    ];

    const recentPosts = [
        { id: 1, author: 'Sarah Johnson', content: 'Just launched our new product!', likes: 245, comments: 23, reports: 0 },
        { id: 2, author: 'Michael Chen', content: 'Check out this amazing sunset 🌅', likes: 1024, comments: 89, reports: 2 },
        { id: 3, author: 'Emma Wilson', content: 'Great meeting with the team today', likes: 432, comments: 45, reports: 1 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
                </div>
               
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative">
                                <Bell className="w-6 h-6 text-gray-600" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32"
                                alt="Admin"
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-8">
                   

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        {/* Recent Users */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500 capitalize">{user.status}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Posts */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
                            <div className="space-y-4">
                                {recentPosts.map((post) => (
                                    <div key={post.id} className="border-b border-gray-100 pb-4 last:border-0">
                                        <p className="font-medium">{post.author}</p>
                                        <p className="text-gray-600 mt-1">{post.content}</p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <span>{post.likes} likes</span>
                                            <span>{post.comments} comments</span>
                                            {post.reports > 0 && (
                                                <span className="text-red-500">{post.reports} reports</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;