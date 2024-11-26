import React, { useState } from 'react';
import { 
  BarChart3, Users, BookOpen, Calendar, 
  CreditCard, Settings, LogOut, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: BarChart3, 
      label: 'Dashboard', 
      path: '/dashboard',
      active: true 
    },
    { 
      icon: Users, 
      label: 'Students', 
      path: '/student' 
    },
    { 
      icon: BookOpen, 
      label: 'Library', 
      path: '/lib' 
    },
    { 
      icon: Calendar, 
      label: 'Attendance', 
      path: '/attendence' 
    },
    { 
      icon: CreditCard, 
      label: 'Fees', 
      path: '/fee' 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings' 
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="toggle-btn" 
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <nav className="menu">
        {menuItems.map((item, index) => (
          <a 
            key={index} 
            href="#" 
            className={`menu-item ${item.active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}

        <a 
          href="#" 
          className="menu-item logout" 
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;