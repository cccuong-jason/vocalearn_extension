import React from 'react';
import '../styles/NavigationBar.css';

interface NavigationItem {
  id: string;
  icon: string;
  label: string;
}

interface NavigationBarProps {
  items: NavigationItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  items, 
  activeItem, 
  onItemClick 
}) => {
  return (
    <nav className="nav-bar">
      {items.map(item => (
        <div
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => onItemClick(item.id)}
        >
          <div className="nav-icon">
            <i className={item.icon}></i>
          </div>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default NavigationBar;
