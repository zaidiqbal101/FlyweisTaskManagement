// resources/js/Layouts/AppLayout.jsx
import React from "react";
import Sidebar from "@/Components/Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Section */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;


// import React from 'react';
// import Sidebar from '../Components/Sidebar';

// export default function AppLayout({ children }) {
//   const sidebarItems = {
//     Projects: [
//       { name: 'Project A', checked: true },
//       { name: 'Project B', checked: false },
//     ],
//     'VISUAL EXPLORATIONS': [
//       { name: 'Wireframing', checked: true },
//       { name: 'Visual Explorations', checked: true },
//       { name: 'Finalizing', checked: true },
//       { name: 'Sketching', checked: true },
//       { name: 'Report', checked: false },
//     ],
//     'DESIGN PRESENTATION': [
//       { name: 'Wireframing', checked: true },
//       { name: 'Visual Explorations', checked: true },
//       { name: 'Finalizing', checked: true },
//       { name: 'Sketching', checked: true },
//       { name: 'Report', checked: false },
//     ]
//   };

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar sidebarItems={sidebarItems} />
//       <div className="flex-1 bg-gray-100 p-6">
//         {children} {/* Page content will be injected here */}
//       </div>
//     </div>
//   );
// }
