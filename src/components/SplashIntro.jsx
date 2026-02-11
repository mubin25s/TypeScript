import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashIntro.css';

const SplashIntro = ({ onComplete }) => {
    const [isOpening, setIsOpening] = useState(false);

    useEffect(() => {
        // Step 1: Wait a bit, then wobble
        const timer = setTimeout(() => {
            setIsOpening(true);
        }, 1500);

        // Step 2: Complete the intro
        const finalTimer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(finalTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="splash-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className={`pokeball-intro ${isOpening ? 'open' : 'wobble'}`}>
                <div className="pokeball-top"></div>
                <div className="pokeball-bottom"></div>
                <div className="pokeball-center">
                    <div className="pokeball-center-inner"></div>
                </div>
            </div>

            <AnimatePresence>
                {isOpening && (
                    <motion.div
                        className="flash-light"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 10, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SplashIntro;
