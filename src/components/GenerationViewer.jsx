import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractSpeciesNames, fetchPokemonDetails, fetchSpeciesStats } from '../services/api';
import { Ruler, Weight, Info, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from './Loader';
import './GenerationViewer.css';

const GenerationViewer = ({ initialPokemon, speciesData, evolutionChain }) => {
    const [family, setFamily] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFamily = async () => {
            if (!evolutionChain) return;
            setLoading(true);
            try {
                const names = extractSpeciesNames(evolutionChain.chain);
                const details = await Promise.all(
                    names.map(async (name) => {
                        const poke = await fetchPokemonDetails(name);
                        const species = await fetchSpeciesStats(poke.species.name);
                        return { ...poke, speciesDetails: species };
                    })
                );
                setFamily(details);
                const idx = details.findIndex(p => p.name === initialPokemon.name);
                setCurrentIndex(idx !== -1 ? idx : 0);
            } catch (err) {
                console.error("Failed to load family", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFamily();
    }, [evolutionChain, initialPokemon.name]);

    const currentPokemon = family[currentIndex];

    // Type-based styles
    const typeColor = useMemo(() => {
        if (!currentPokemon) return '#3b82f6';
        return `var(--type-${currentPokemon.types[0].type.name})`;
    }, [currentPokemon]);

    if (loading) return <div className="gen-loader"><Loader /></div>;
    if (family.length === 0) return null;

    const { name, types, stats, height, weight, sprites, speciesDetails } = currentPokemon;
    const description = speciesDetails?.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ');
    const generation = speciesDetails?.generation?.name.replace('generation-', 'GEN ').toUpperCase();

    const nextForm = () => {
        if (currentIndex < family.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const prevForm = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const getStyles = (index) => {
        const offset = index - currentIndex;
        if (offset === 0) {
            return {
                x: 0,
                y: 0,
                z: 0,
                rotateY: 0,
                opacity: 1,
                scale: 1,
                filter: 'brightness(1) blur(0px)',
            };
        }

        const dir = offset > 0 ? 1 : -1;
        const absOffset = Math.abs(offset);

        return {
            x: dir * (300 + absOffset * 50),
            y: 0,
            z: -500 * absOffset,
            rotateY: dir * -45,
            opacity: Math.max(0, 0.7 - absOffset * 0.3),
            scale: 0.5,
            filter: `brightness(0.3) blur(${absOffset * 4}px)`,
        };
    };

    const StatCircle = ({ label, value, max = 255 }) => {
        const radius = 34;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / max) * circumference;

        return (
            <div className="stat-circle-item">
                <div className="circle-container">
                    <svg className="circle-svg" width="80" height="80">
                        <circle className="circle-bg" cx="40" cy="40" r={radius} />
                        <motion.circle
                            className="circle-fill"
                            cx="40" cy="40" r={radius}
                            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ strokeDasharray: circumference }}
                        />
                    </svg>
                    <span className="stat-value">{value}</span>
                </div>
                <span className="stat-label">{label}</span>
            </div>
        );
    };

    // 4. Two-finger Swipe (Trackpad / Wheel) Support
    useEffect(() => {
        let lastTime = 0;
        const threshold = 50; // Threshold for swipe distance
        const cooldown = 500; // Cooldown between swipes

        const handleWheel = (e) => {
            const now = Date.now();
            if (now - lastTime < cooldown) return;

            if (Math.abs(e.deltaX) > threshold) {
                if (e.deltaX > 0) {
                    nextForm();
                } else {
                    prevForm();
                }
                lastTime = now;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [currentIndex, family.length]);

    const onDragEnd = (e, { offset, velocity }) => {
        const swipe = offset.x;
        if (swipe < -50) {
            nextForm();
        } else if (swipe > 50) {
            prevForm();
        }
    };

    // 5. Two-finger Touch Swipe (Mobile) Support
    useEffect(() => {
        let touchStartX = 0;
        let touchStartPoints = 0;

        const handleTouchStart = (e) => {
            touchStartPoints = e.touches.length;
            if (touchStartPoints === 2) {
                touchStartX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            }
        };

        const handleTouchEnd = (e) => {
            if (touchStartPoints === 2) {
                // Get end position from changedTouches or just current touches
                const touchEndX = (e.changedTouches[0].clientX + (e.changedTouches[1]?.clientX || e.changedTouches[0].clientX)) / 2;
                const diff = touchEndX - touchStartX;
                const threshold = 100;

                if (Math.abs(diff) > threshold) {
                    if (diff < 0) nextForm();
                    else prevForm();
                }
            }
            touchStartPoints = 0;
        };

        const container = document.querySelector('.gen-viewer-container');
        if (container) {
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [currentIndex, family.length]);

    return (
        <div className="gen-viewer-container" style={{ '--type-color': typeColor, '--type-glow': `${typeColor}80` }}>
            {/* HUD Elements */}
            <div className="hud-line hud-line-h" style={{ top: '20%' }} />
            <div className="hud-line hud-line-h" style={{ top: '80%' }} />
            <div className="hud-line hud-line-v" style={{ left: '15%' }} />
            <div className="hud-line hud-line-v" style={{ left: '85%' }} />

            <div className="gen-tag">{generation}</div>

            <div className="carousel-area">
                {currentIndex > 0 && (
                    <button className="nav-arrow nav-left" onClick={prevForm}>
                        <ChevronLeft size={32} />
                    </button>
                )}

                <div className="carousel-images-container">
                    {family.map((member, index) => {
                        const isCurrent = index === currentIndex;
                        const memberImage = member.sprites?.other['official-artwork']?.front_default || member.sprites.front_default;

                        return (
                            <motion.div
                                key={member.name}
                                className={`carousel-card ${isCurrent ? 'active' : ''}`}
                                animate={getStyles(index)}
                                initial={false}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                drag={isCurrent ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={onDragEnd}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img src={memberImage} alt={member.name} className="carousel-image" />
                                {isCurrent && (
                                    <motion.div className="hero-info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                        <h2 className="hero-name">{member.name}</h2>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {currentIndex < family.length - 1 && (
                    <button className="nav-arrow nav-right" onClick={nextForm}>
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            <div className="stats-hud">
                {/* Information Panel */}
                <motion.div
                    className="hud-panel"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="panel-title"><Info size={14} /> POKÉMON DATA</div>
                    <div className="type-pills">
                        {types.map(t => (
                            <span key={t.type.name} className="type-pill" style={{ borderLeft: `4px solid var(--type-${t.type.name})` }}>
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                    <p className="description-box">{description}</p>

                    <div className="evolution-nav">
                        {family.map((member, idx) => (
                            <div
                                key={member.name}
                                className={`evol-thumb ${idx === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                            >
                                <img src={member.sprites.front_default} alt={member.name} />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                        <div className="p-stat-mini">
                            <span className="stat-label">HEIGHT</span>
                            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>{height / 10}m</div>
                        </div>
                        <div className="p-stat-mini">
                            <span className="stat-label">WEIGHT</span>
                            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>{weight / 10}kg</div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Panel */}
                <motion.div
                    className="hud-panel"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="panel-title"><BarChart3 size={14} /> BASE STATS</div>
                    <div className="stats-grid">
                        {stats.map(s => (
                            <StatCircle
                                key={s.stat.name}
                                label={s.stat.name.replace('special-', 'S-').toUpperCase()}
                                value={s.base_stat}
                                max={160} // Max base stat is usually around 160 for non-legendaries/megas
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GenerationViewer;
