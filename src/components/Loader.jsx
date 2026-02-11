import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px'
        }}>
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid var(--text-secondary)',
                    borderTop: '5px solid var(--accent)',
                    borderRadius: '50%'
                }}
            />
        </div>
    );
};

export default Loader;
