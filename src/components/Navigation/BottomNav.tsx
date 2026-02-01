import { NavLink } from 'react-router-dom';

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-xs mt-1">Ports</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs mt-1">Map</span>
        </NavLink>
      </div>
    </nav>
  );
}
