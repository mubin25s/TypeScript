import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container-flex">
            <div className="pokeball-loader-wrapper">
                <div className="loader-background-glow"></div>
                <div className="pokeball-loader"></div>
            </div>
            <p className="loading-text">LOADING POKÉDEX...</p>
        </div>
    );
};

export default Loader;
