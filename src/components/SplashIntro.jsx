import React, { useEffect, useState } from 'react';
import './SplashIntro.css';

const SplashIntro = ({ onComplete }) => {
    const [isOpening, setIsOpening] = useState(false);

    useEffect(() => {
        // Step 1: Start opening after 1.5s
        const timer = setTimeout(() => {
            setIsOpening(true);
        }, 1500);

        // Step 2: Call completion after 3s
        const finalTimer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(finalTimer);
        };
    }, [onComplete]);

    return (
        <div className="splash-overlay">
            <div className={`pokeball-intro ${isOpening ? 'open' : 'wobble'}`}>
                <div className="pokeball-top"></div>
                <div className="pokeball-bottom"></div>
                <div className="pokeball-center">
                    <div className="pokeball-center-inner"></div>
                </div>
            </div>

            {isOpening && <div className="flash-light-static"></div>}
        </div>
    );
};

export default SplashIntro;
