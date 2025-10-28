import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Menu,
  LayoutDashboard,
  UserCircle,
  Code,
  TestTube,
  MessageSquare,
  ListChecks,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ sidebarItems }) => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route('logout'));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manager':
        return 'bg-orange-500';
      case 'Client':
        return 'bg-blue-500';
      case 'Developer':
        return 'bg-green-500';
      case 'Tester':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-72 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 text-white flex flex-col shadow-2xl relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 rounded-full opacity-10 blur-3xl -ml-24 -mb-24"></div>

      {/* Scrollable content */}
      <div className="relative z-10 flex flex-col h-screen overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
        {/* Browser Circles */}
        <div className="flex gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg"></div>
        </div>

        {/* Header with user info */}
        <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 ">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Flyweis Logo"
                  className="w-12 h-12 rounded-full border-2 border-white/40 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-sm font-bold">{user?.name || 'Guest User'}</h2>
                <p className="text-xs text-blue-100 font-medium">
                  {user?.email || 'guest@example.com'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white/80 hover:text-red-400 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Role Badge */}
          {user?.role && (
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                user.role
              )} bg-opacity-80 mt-2`}
            >
              {user.role}
            </span>
          )}
        </div>

        {/* Today Button */}
        <Link href="/" className="mb-6">
          <button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-green-500 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </button>
        </Link>

        {/* App Links */}
        <div className="flex flex-col gap-3 pb-6">
          <Link href="/manager">
            <div className="group bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 cursor-pointer hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Menu className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-white block">Manager</span>
                  <span className="text-xs text-white/80">Task Management</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/client">
            <div className="group bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCircle className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-white block">Clients</span>
                  <span className="text-xs text-white/80">Client Portal</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/developer">
            <div className="group bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-4 cursor-pointer hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-white block">Developer</span>
                  <span className="text-xs text-white/80">Development Team</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/tester">
            <div className="group bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-4 cursor-pointer hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TestTube className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-white block">Tester</span>
                  <span className="text-xs text-white/80">Quality Assurance</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/chat">
            <div className="group bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-4 cursor-pointer hover:from-pink-600 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-white block">Chat</span>
                  <span className="text-xs text-white/80">Team Communication</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/todo">
            <div className="group bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-4 cursor-pointer hover:from-green-600 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ListChecks className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-white block">To-Do</span>
                  <span className="text-xs text-white/80">Your Daily Tasks</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
