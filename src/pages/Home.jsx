import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllPokemon, fetchPokemonDetails } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import { Search, ArrowUp } from 'lucide-react';

const Home = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedList, setDisplayedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputBuffer, setInputBuffer] = useState('');
    const [showScroll, setShowScroll] = useState(false);

    // 1. Initial Fetch of ALL names - Only ONCE on mount
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const data = await fetchAllPokemon();
                setAllPokemon(data);
                if (!data || data.length === 0) {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load pokemon list", err);
                setError("Failed to connect to the PokéAPI.");
                setLoading(false);
            }
        };
        loadAll();
    }, []); // Empty dependency array means this only runs once.

    // 2. Scroll Listener - Clean and separate
    useEffect(() => {
        const checkScrollTop = () => {
            if (window.pageYOffset > 400) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, []);

    // 3. Debounce Search Input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputBuffer);
            setLimit(20);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputBuffer]);

    // 4. Update Display List based on filter + limit
    useEffect(() => {
        if (allPokemon.length === 0) return;

        const updateDisplay = async () => {
            setLoading(true);
            setError(null);

            const filtered = allPokemon.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const slice = filtered.slice(0, limit);

            try {
                const details = await Promise.all(
                    slice.map(p => fetchPokemonDetails(p.name))
                );
                setDisplayedList(details);
            } catch (err) {
                console.error("Error fetching details subset", err);
                setError("Error loading Pokémon details.");
            } finally {
                setLoading(false);
            }
        };

        updateDisplay();
    }, [searchTerm, limit, allPokemon]);

    const handleSearch = (e) => {
        setInputBuffer(e.target.value);
    };

    const loadMore = () => {
        setLimit(prev => prev + 20);
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasMore = () => {
        if (allPokemon.length === 0) return false;
        const totalMatches = allPokemon.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return limit < totalMatches;
    };

    return (
        <motion.div
            className="home-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <header className="header">
                <motion.h1
                    className="title"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    Pokédex
                </motion.h1>

                <div className="search-and-filter">
                    <div className="search-bar">
                        <Search size={20} color="#888" />
                        <input
                            type="text"
                            placeholder="Search Pokémon..."
                            value={inputBuffer}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </header>

            {error && <div className="error-message">{error}</div>}

            <div className="pokemon-grid">
                <AnimatePresence mode='popLayout'>
                    {displayedList.map((pokemon, index) => (
                        <motion.div
                            key={pokemon.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                        >
                            <PokemonCard pokemon={pokemon} index={index} />
                        </motion.div>
                    ))}

                    {loading && Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
                </AnimatePresence>
            </div>

            {!loading && hasMore() && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={scrollTop}>
                        Back to Top
                    </button>
                    <button className="load-more-btn" style={{ marginLeft: '1rem' }} onClick={loadMore}>
                        Load More
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showScroll && (
                    <motion.button
                        className="scroll-top-btn"
                        onClick={scrollTop}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowUp />
                    </motion.button>
                )}
            </AnimatePresence>

            {!loading && !error && displayedList.length === 0 && (
                <div className="no-results">No Pokémon found.</div>
            )}
        </motion.div>
    );
};

export default Home;
