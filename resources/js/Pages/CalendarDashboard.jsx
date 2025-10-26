// resources/js/Pages/CalendarDashboard.jsx
import React from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Dashboard from '@/Components/Dashboard';

export default function CalendarDashboard() {
  const { tasks = [] } = usePage().props;

  // Handle navigation to /todo
  const handleNavigate = (url) => {
    router.visit(url, { preserveState: true });
  };

  return (
    <AppLayout>
      <div className="flex h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6">
        <div className="flex w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <Dashboard tasks={tasks} onNavigate={handleNavigate} />
        </div>
      </div>
    </AppLayout>
  );
}