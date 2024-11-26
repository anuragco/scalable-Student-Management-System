import React, { useState , useEffect} from 'react';
import { 
  Lock, 
  Shield, 
  Bell, 
  User, 
  Database, 
  Key, 
  QrCode, 
  Smartphone,
  Moon,
  Sun,
  Settings as SettingsIcon
} from 'lucide-react';
import '../Css/Setting.css';
import Sidebar from '../Components/Sidebar';
const Settings = () => {
  const [activeSection, setActiveSection] = useState('security');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: true
  });
  

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? savedMode === 'true' : false;
  });
  

  useEffect(() => {
    console.log('Dark mode state:', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  

  const toggleDarkMode = () => {
    console.log('Toggle function triggered');
    setDarkMode((prevMode) => !prevMode);
  };
  
  


  const renderSecuritySettings = () => (
    <div className="settings-content">
      <Sidebar/>
      <h2>Security Settings</h2>
      
      <div className="setting-group">
        <div className="setting-item">
          <Lock size={24} />
          <span>Two-Factor Authentication</span>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />
            <span className="slider"></span>
          </div>
        </div>

        {twoFactorEnabled && (
          <div className="two-factor-options">
            <div className="auth-method">
              <QrCode size={24} />
              <span>Google Authenticator</span>
              <button>Link App</button>
            </div>
            <div className="auth-method">
              <Smartphone size={24} />
              <span>SMS Authentication</span>
              <button>Configure</button>
            </div>
          </div>
        )}
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <Key size={24} />
          <span>Password Reset</span>
          <button>Change Password</button>
        </div>
      </div>
    </div>
  );
  const renderNotificationSettings = () => (
    <div className="settings-content">
        <Sidebar/>
      <h2>Notification Preferences</h2>
      
      <div className="setting-group">
        <div className="setting-item">
          <Bell size={24} />
          <span>Email Notifications</span>
          <div className="toggle-switch">
            <input 
              type="checkbox"
              checked={notificationPreferences.email}
              onChange={() => setNotificationPreferences(prev => ({
                ...prev, 
                email: !prev.email
              }))}
            />
            <span className="slider"></span>
          </div>
        </div>

        <div className="setting-item">
          <Smartphone size={24} />
          <span>SMS Notifications</span>
          <div className="toggle-switch">
            <input 
              type="checkbox"
              checked={notificationPreferences.sms}
              onChange={() => setNotificationPreferences(prev => ({
                ...prev, 
                sms: !prev.sms
              }))}
            />
            <span className="slider"></span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-content">
        <Sidebar/>
      <h2>Appearance</h2>
      
      <div className="setting-group">
        <div className="setting-item">
          {darkMode ? <Moon size={24} /> : <Sun size={24} />}
          <span>Dark Mode</span>
          <div className="toggle-switch">
            <input 
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      default: return renderSecuritySettings();
    }
  };

  return (
    <div className={`settings-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="settings-container">
        <div className="settings-sidebar">
          <div 
            className={`settings-nav-item ${activeSection === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSection('security')}
          >
            <Shield size={20} />
            <span>Security</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <Bell size={20} />
            <span>Notifications</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveSection('appearance')}
          >
            <SettingsIcon size={20} />
            <span>Appearance</span>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;