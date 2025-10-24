import React from 'react';
// import Sidebar from '../components/Sidebar';
// import Dashboard from '../components/Dashboard';
import AppLayout from '../Layouts/AppLayout';
import Dashboard from '@/Components/Dashboard';

export default function CalendarDashboard() {
  const sidebarItems = {
    'VISUAL EXPLORATIONS': [
      { name: 'Wireframing', checked: true },
      { name: 'Visual Explorations', checked: true },
      { name: 'Finalizing', checked: true },
      { name: 'Sketching', checked: true },
      { name: 'Report', checked: false }
    ],
    'DESIGN PRESENTATION': [
      { name: 'Wireframing', checked: true },
      { name: 'Visual Explorations', checked: true },
      { name: 'Finalizing', checked: true },
      { name: 'Sketching', checked: true },
      { name: 'Report', checked: false }
    ]
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = [
    { date: 30, month: 'prev', events: 0 },
    { date: 31, month: 'prev', events: 0 },
    { date: 1, month: 'current', events: 3 },
    { date: 2, month: 'current', events: 1 },
    { date: 3, month: 'current', events: 1 },
    { date: 4, month: 'current', events: 1 },
    { date: 5, month: 'current', events: 0 },
    { date: 6, month: 'current', events: 2 },
    { date: 7, month: 'current', events: 1 },
    { date: 8, month: 'current', events: 0 },
    { date: 9, month: 'current', events: 1 },
    { date: 10, month: 'current', events: 2 },
    { date: 11, month: 'current', events: 0 },
    { date: 12, month: 'current', events: 0 },
    { date: 13, month: 'current', events: 2 },
    { date: 14, month: 'current', events: 0 },
    { date: 15, month: 'current', events: 0 },
    { date: 16, month: 'current', events: 3 },
    { date: 17, month: 'current', events: 2 },
    { date: 18, month: 'current', events: 0 },
    { date: 19, month: 'current', events: 0 },
    { date: 20, month: 'current', events: 0 },
    { date: 21, month: 'current', events: 0 },
    { date: 22, month: 'current', events: 1 },
    { date: 23, month: 'current', events: 0 },
    { date: 24, month: 'current', events: 0 },
    { date: 25, month: 'current', events: 0 },
    { date: 26, month: 'current', events: 0 },
  ];

  return (
     <AppLayout>
    <div className="flex h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6">
      <div className="flex w-full bg-white rounded-2xl shadow-2xl overflow-hidden">        
        <Dashboard weekDays={weekDays} calendarDays={calendarDays} />
      </div>
    </div>
    </AppLayout>
  );
}
