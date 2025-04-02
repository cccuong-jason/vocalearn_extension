import React from 'react';
import '../styles/NavigationBar.css';
const NavigationBar = ({ items, activeItem, onItemClick }) => {
    return (React.createElement("nav", { className: "nav-bar" }, items.map(item => (React.createElement("div", { key: item.id, className: `nav-item ${activeItem === item.id ? 'active' : ''}`, onClick: () => onItemClick(item.id) },
        React.createElement("div", { className: "nav-icon" },
            React.createElement("i", { className: item.icon })),
        React.createElement("span", { className: "nav-label" }, item.label))))));
};
export default NavigationBar;
