import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractSpeciesNames, fetchPokemonDetails, fetchSpeciesStats } from '../services/api';
import { Ruler, Weight, Zap, Shield, Heart, Sword, ArrowLeft, ArrowRight } from 'lucide-react';
import Loader from './Loader';
import './GenerationViewer.css';

const GenerationViewer = ({ initialPokemon, speciesData, evolutionChain }) => {
    const [family, setFamily] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Fetch full family details on mount
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

                // Find index of initial pokemon to start with
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

    if (loading) return <div className="gen-loader"><Loader /></div>;
    if (family.length === 0) return null;

    const currentPokemon = family[currentIndex];

    // Derived data
    const { id, name, types, stats, height, weight, sprites, speciesDetails } = currentPokemon;
    const image = sprites?.other['official-artwork']?.front_default || sprites.front_default;
    const description = speciesDetails?.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ');
    const generation = speciesDetails?.generation?.name.replace('generation-', 'Gen ').toUpperCase();

    // Helper for stats icons
    const getStatIcon = (statName) => {
        switch (statName) {
            case 'hp': return <Heart size={16} />;
            case 'attack': return <Sword size={16} />;
            case 'defense': return <Shield size={16} />;
            case 'special-attack': return <Zap size={16} />;
            case 'special-defense': return <Shield size={16} color="gold" />;
            case 'speed': return <Zap size={16} color="cyan" />;
            default: return null;
        }
    };

    const nextForm = () => {
        if (currentIndex < family.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const prevForm = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const onDragEnd = (e, { offset, velocity }) => {
        const swipe = offset.x;

        if (swipe < -50) {
            nextForm();
        } else if (swipe > 50) {
            prevForm();
        }
    };

    const getStyles = (index) => {
        if (index === currentIndex) {
            return {
                x: 0,
                scale: 1.2,
                opacity: 1,
                zIndex: 10,
                filter: 'blur(0px) brightness(1)'
            };
        } else if (index === currentIndex - 1) {
            return {
                x: -180,
                scale: 0.6,
                opacity: 0.6,
                zIndex: 5,
                filter: 'blur(2px) brightness(0.5)'
            };
        } else if (index === currentIndex + 1) {
            return {
                x: 180,
                scale: 0.6,
                opacity: 0.6,
                zIndex: 5,
                filter: 'blur(2px) brightness(0.5)'
            };
        } else if (index < currentIndex - 1) {
            return {
                x: -300,
                scale: 0.4,
                opacity: 0,
                zIndex: 1,
                filter: 'blur(5px) brightness(0.5)'
            };
        } else {
            return {
                x: 300,
                scale: 0.4,
                opacity: 0,
                zIndex: 1,
                filter: 'blur(5px) brightness(0.5)'
            };
        }
    };

    return (
        <div className={`gen-viewer-container type-bg-${types[0].type.name}`}>

            <div className="carousel-area">
                <div className="carousel-images-container">
                    {family.map((member, index) => {
                        const isCurrent = index === currentIndex;
                        const memberImage = member.sprites?.other['official-artwork']?.front_default || member.sprites.front_default;

                        return (
                            <motion.div
                                key={member.name}
                                className="carousel-card"
                                animate={getStyles(index)}
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag={isCurrent ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={onDragEnd}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img src={memberImage} alt={member.name} className="carousel-image" />
                                {isCurrent && (
                                    <motion.div
                                        className="carousel-info-overlay"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h2 className="carousel-name">{member.name}</h2>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPokemon.name}
                    className="stats-container-panel"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="panel-header">
                        {generation && <span className="gen-badge">{generation}</span>}
                    </div>

                    <div className="display-types">
                        {types.map((t) => (
                            <span key={t.type.name} className={`type-badge type-${t.type.name}`}>
                                {t.type.name}
                            </span>
                        ))}
                    </div>

                    <p className="panel-description">{description}</p>

                    <div className="display-stats">
                        <div className="physical-stats-row">
                            <div className="p-stat">
                                <Ruler size={20} /> <span>{height / 10} m</span>
                            </div>
                            <div className="p-stat">
                                <Weight size={20} /> <span>{weight / 10} kg</span>
                            </div>
                        </div>

                        <div className="base-stats-grid">
                            {stats.map((s) => (
                                <div key={s.stat.name} className="mini-stat">
                                    <div className="mini-stat-label">
                                        {getStatIcon(s.stat.name)}
                                        <span>{s.stat.name.substr(0, 3)}</span>
                                    </div>
                                    <div className="mini-bar">
                                        <motion.div
                                            className="mini-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(s.base_stat, 100)}%` }}
                                            style={{ background: s.base_stat > 50 ? 'var(--accent)' : '#ff4d4d' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default GenerationViewer;
