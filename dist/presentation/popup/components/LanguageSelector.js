import React from 'react';
import '../styles/LanguageSelector.css';
const LanguageSelector = ({ sourceLanguage, targetLanguage, onSwapLanguages }) => {
    return (React.createElement("div", { className: "language-bar" },
        React.createElement("button", { className: "language-btn source" },
            React.createElement("img", { src: `/assets/flags/${sourceLanguage.flag}`, alt: `${sourceLanguage.name} flag`, className: "flag" }),
            React.createElement("span", { className: "lang-name" }, sourceLanguage.name)),
        React.createElement("button", { className: "swap-btn", onClick: onSwapLanguages },
            React.createElement("i", { className: "fas fa-exchange-alt" })),
        React.createElement("button", { className: "language-btn target" },
            React.createElement("img", { src: `/assets/flags/${targetLanguage.flag}`, alt: `${targetLanguage.name} flag`, className: "flag" }),
            React.createElement("span", { className: "lang-name" }, targetLanguage.name))));
};
export default LanguageSelector;
