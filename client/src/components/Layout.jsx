import React, { useState } from "react";
import { Avatar, Badge, message, Tooltip, Switch } from "antd";
import { adminMenu, userMenu } from "../data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import '../styles/LayoutStyle.css'

const Layout = ({ children }) => {
  const { user } = useSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doc-appointments",
      icon: "fa-solid fa-calendar-check",
    },
    {
      name: "Patients",
      path: "/patients",
      icon: "fa-solid fa-user-group",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user-doctor",
    },
  ];
  
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate('/login');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-theme');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <i className="fa-solid fa-stethoscope logo-icon pulse-animation"></i>
            <h1 className="logo-text">MediConnect</h1>
          </Link>
          <button className="collapse-btn" onClick={toggleSidebar}>
            <i className={`fa-solid ${sidebarCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
          </button>
        </div>
        
        <div className="user-profile">
          <div className="profile-background"></div>
          <Avatar 
            className="user-avatar"
            size={70}
            src={user?.profilePic}
          >
            {!user?.profilePic && user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <div className="user-info">
            <h3>{user?.username}</h3>
            <span className="user-role">
              {user?.isAdmin ? 'Administrator' : user?.isDoctor ? 'Doctor' : 'Patient'}
            </span>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          <div className="menu-category">Main Menu</div>
          {SidebarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link 
                key={index} 
                to={menu.path} 
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <div className="menu-icon">
                  <i className={menu.icon}></i>
                </div>
                <span className="menu-text">{menu.name}</span>
                {isActive && <div className="active-indicator"></div>}
              </Link>
            );
          })}
          
          <div className="menu-category">Settings</div>
          <div className="menu-item theme-toggle">
            <div className="menu-icon">
              <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'}`}></i>
            </div>
            <span className="menu-text">Dark Mode</span>
            <Switch 
              checked={darkMode} 
              onChange={toggleTheme} 
              size="small" 
              className="theme-switch"
            />
          </div>
          
          <button onClick={handleLogout} className="menu-item logout-btn">
            <div className="menu-icon">
              <i className="fa-solid fa-right-from-bracket"></i>
            </div>
            <span className="menu-text">Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <span>v2.0.1</span>
        </div>
      </div>
      
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="search-container">
              <i className="fa-solid fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search patients, appointments..." 
                className="search-input"
              />
            </div>
          </div>
          
          <div className="header-actions">
            <div className="quick-actions">
              <Tooltip title="Create Appointment">
                <button className="action-button primary">
                  <i className="fa-solid fa-plus"></i>
                  <span>New Appointment</span>
                </button>
              </Tooltip>
            </div>

            <Tooltip title="Notifications">
              <Badge 
                count={user?.notification?.length || 0} 
                onClick={() => navigate('/notification')} 
                className="notification-badge"
              >
                <button className="icon-button">
                  <i className="fa-solid fa-bell"></i>
                </button>
              </Badge>
            </Tooltip>
            
            <Tooltip title="User Settings">
              <button 
                className="icon-button" 
                onClick={() => navigate('/profile')}
              >
                <i className="fa-solid fa-gear"></i>
              </button>
            </Tooltip>

            <div className="user-dropdown" onClick={() => navigate('/profile')}>
              <Avatar 
                size={36}
                src={user?.profilePic}
                className="header-avatar"
              >
                {!user?.profilePic && user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <span className="user-name">{user?.username}</span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </header>
        
        <main className="content-area">
          <div className="page-header">
            <div>
              <h2>{getCurrentPageTitle(location.pathname, SidebarMenu)}</h2>
              <p className="breadcrumb">
                <i className="fa-solid fa-home"></i> Home 
                {location.pathname !== "/" && ` / ${getCurrentPageTitle(location.pathname, SidebarMenu)}`}
              </p>
            </div>
            
            {location.pathname === "/doc-appointments" && (
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                  <div className="stat-info">
                    <span>Today</span>
                    <h3>8</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="stat-info">
                    <span>Upcoming</span>
                    <h3>24</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to get current page title
const getCurrentPageTitle = (pathname, menu) => {
  const currentMenu = menu.find(item => item.path === pathname);
  return currentMenu?.name || "Dashboard";
};

export default Layout;