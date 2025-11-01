// resources/js/Components/Sidebar.jsx   (or wherever your Sidebar lives)

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

const Sidebar = () => {
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

  // -------------------------------------------------
  // 1. Decide which cards are allowed for the role
  // -------------------------------------------------
  const isTester = user?.role === 'Tester';
//auto 
  // Helper to render a single card (keeps JSX DRY)
  const Card = ({ href, gradientFrom, gradientTo, icon: Icon, title, subtitle }) => (
    <Link href={href}>
      <div
        className={`group bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-4 cursor-pointer hover:from-${gradientFrom
          .split('-')[1]
          .replace('500', '600')} hover:to-${gradientTo
          .split('-')[1]
          .replace('500', '700')} transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-white/20 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-white block">{title}</span>
            <span className="text-xs text-white/80">{subtitle}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-72 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 text-white flex flex-col shadow-2xl relative overflow-hidden">
      {/* … background decorations … */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 rounded-full opacity-10 blur-3xl -ml-24 -mb-24"></div>

      <div className="relative z-10 flex flex-col h-screen overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
        {/* Browser circles */}
        <div className="flex gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg"></div>
        </div>

        {/* Header – user info */}
        <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-4xl p-4 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
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
                <p className="text-xs text-blue-100 font-medium">{user?.email || 'guest@example.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-white/80 hover:text-red-400 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

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

        {/* Today button – always visible */}
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

        {/* -------------------------------------------------
            2. MENU CARDS – filtered by role
            ------------------------------------------------- */}
        <div className="flex flex-col gap-3 pb-6">
          {/* Manager */}
          {!isTester && (
            <Card
              href="/manager"
              gradientFrom="from-orange-400"
              gradientTo="to-orange-600"
              icon={Menu}
              title="Manager"
              subtitle="Task Management"
            />
          )}

          {/* Client */}
          {!isTester && (
            <Card
              href="/client"
              gradientFrom="from-blue-400"
              gradientTo="to-blue-600"
              icon={UserCircle}
              title="Clients"
              subtitle="Client Portal"
            />
          )}

          {/* Developer */}
          {!isTester && (
            <Card
              href="/developer"
              gradientFrom="from-gray-700"
              gradientTo="to-gray-900"
              icon={Code}
              title="Developer"
              subtitle="Development Team"
            />
          )}

          {/* Tester – always visible for Testers, hidden for others */}
          <Card
            href="/tester"
            gradientFrom="from-purple-500"
            gradientTo="to-purple-700"
            icon={TestTube}
            title="Tester"
            subtitle="Quality Assurance"
          />

          {/* Chat – hide for Testers */}
          {/* {!isTester && (
            <Card
              href="/chat"
              gradientFrom="from-pink-500"
              gradientTo="to-pink-700"
              icon={MessageSquare}
              title="Chat"
              subtitle="Team Communication"
            />
          )} */}

          {/* To-Do – always visible (Tester & others) */}
          <Card
            href="/todo"
            gradientFrom="from-green-500"
            gradientTo="to-emerald-700"
            icon={ListChecks}
            title="To-Do"
            subtitle="Your Daily Tasks"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;