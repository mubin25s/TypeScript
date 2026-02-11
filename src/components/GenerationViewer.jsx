import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractSpeciesNames, fetchPokemonDetails, fetchSpeciesStats } from '../services/api';
import { Info, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from './Loader';
import './GenerationViewer.css';

const GenerationViewer = ({ initialPokemon, speciesData, evolutionChain }) => {
    const [family, setFamily] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFamily = async () => {
            if (!initialPokemon) return;
            setLoading(true);
            try {
                if (!evolutionChain) {
                    setFamily([{ ...initialPokemon, speciesDetails: speciesData }]);
                } else {
                    const names = extractSpeciesNames(evolutionChain.chain);
                    const details = await Promise.all(
                        names.map(async (name) => {
                            try {
                                const poke = await fetchPokemonDetails(name);
                                const species = await fetchSpeciesStats(poke.species.name);
                                return { ...poke, speciesDetails: species };
                            } catch (e) { return null; }
                        })
                    );
                    const validDetails = details.filter(d => d !== null);
                    if (validDetails.length > 0) {
                        setFamily(validDetails);
                        const idx = validDetails.findIndex(p => p.name === initialPokemon.name);
                        setCurrentIndex(idx !== -1 ? idx : 0);
                    } else {
                        setFamily([{ ...initialPokemon, speciesDetails: speciesData }]);
                    }
                }
            } catch (err) {
                setFamily([{ ...initialPokemon, speciesDetails: speciesData }]);
            } finally {
                setLoading(false);
            }
        };
        fetchFamily();
    }, [initialPokemon, speciesData, evolutionChain]);

    const currentPokemon = family[currentIndex] || family[0] || initialPokemon;

    const typeColor = useMemo(() => {
        if (!currentPokemon?.types?.[0]) return '#3b82f6';
        return `var(--type-${currentPokemon.types[0].type.name})`;
    }, [currentPokemon]);

    if (loading) return <div className="gen-loader"><Loader /></div>;

    const {
        name = 'Unknown',
        types = [],
        stats = [],
        speciesDetails = {}
    } = currentPokemon;

    const description = speciesDetails?.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text?.replace(/\f/g, ' ') || 'No description available.';
    const generation = speciesDetails?.generation?.name?.replace('generation-', 'GEN ')?.toUpperCase() || 'UNKNOWN';

    const getStyles = (index) => {
        const offset = index - currentIndex;
        if (offset === 0) return { x: 0, y: 0, z: 0, rotateY: 0, opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' };

        const dir = offset > 0 ? 1 : -1;
        const absOffset = Math.abs(offset);

        // Multi-member family support
        return {
            x: dir * (300 + (absOffset - 1) * 100),
            y: 0,
            z: -400 * absOffset,
            rotateY: dir * -35,
            opacity: Math.max(0, 0.4 / absOffset),
            scale: 0.6,
            filter: `brightness(0.5) blur(${absOffset * 2}px)`,
        };
    };

    const onDragEnd = (e, { offset }) => {
        if (offset.x < -50 && currentIndex < family.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (offset.x > 50 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="gen-viewer-container" style={{ '--type-color': typeColor, '--type-glow': typeColor }}>
            {/* Background HUD names */}
            <div className="background-name">{name}</div>

            <div className="hud-line hud-line-h" style={{ top: '20%' }} />
            <div className="hud-line hud-line-h" style={{ top: '80%' }} />
            <div className="gen-tag">{generation}</div>

            <div className="carousel-area">
                {currentIndex > 0 && (
                    <button className="nav-arrow nav-left" onClick={() => setCurrentIndex(prev => prev - 1)}>
                        <ChevronLeft size={32} />
                    </button>
                )}

                <div className="carousel-images-container">
                    <AnimatePresence initial={false} mode="popLayout">
                        {family.map((member, index) => {
                            const isCurrent = index === currentIndex;
                            const memberImage = member?.sprites?.other?.['official-artwork']?.front_default || member?.sprites?.front_default;

                            return (
                                <motion.div
                                    key={member?.name}
                                    className={`carousel-card ${isCurrent ? 'active' : ''}`}
                                    animate={getStyles(index)}
                                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                    drag={isCurrent ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={onDragEnd}
                                    onClick={() => isCurrent ? null : setCurrentIndex(index)}
                                    style={{ cursor: isCurrent ? 'grab' : 'pointer' }}
                                >
                                    <img src={memberImage} alt={member?.name} className="carousel-image" />
                                    {isCurrent && (
                                        <motion.div
                                            className="hero-info"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <h2 className="hero-name">{member?.name}</h2>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {currentIndex < family.length - 1 && (
                    <button className="nav-arrow nav-right" onClick={() => setCurrentIndex(prev => prev + 1)}>
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            <div className="stats-hud">
                <div className="hud-panel">
                    <div className="panel-title"><Info size={14} /> POKÉMON DATA</div>
                    <div className="type-pills">
                        {types.map(t => (
                            <span key={t.type.name} className="type-pill" style={{ borderLeft: `4px solid var(--type-${t.type.name})` }}>{t.type.name}</span>
                        ))}
                    </div>
                    <p className="description-box">{description}</p>
                    <div className="evolution-nav">
                        {family.map((member, idx) => (
                            <div key={member?.name} className={`evol-thumb ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)}>
                                <img src={member?.sprites?.front_default} alt={member?.name} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hud-panel">
                    <div className="panel-title"><BarChart3 size={14} /> BASE STATS</div>
                    <div className="stats-grid-simple">
                        {stats.map(s => (
                            <div key={s.stat.name} className="simple-stat-row">
                                <span className="stat-label-simple">{s.stat.name.toUpperCase()}</span>
                                <div className="stat-bar-bg">
                                    <div className="stat-bar-fill" style={{ width: `${(s.base_stat / 160) * 100}%`, background: typeColor }}></div>
                                </div>
                                <span className="stat-value-simple">{s.base_stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerationViewer;
