import React, { useState, useEffect } from 'react';
import { fetchAllPokemon, fetchPokemonDetails } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import { Search, ArrowUp } from 'lucide-react';

const Home = () => {
    // Persistent state keys
    const SAVE_LIMIT_KEY = 'pokedex_limit';
    const SAVE_SCROLL_KEY = 'pokedex_scroll_y';
    const SAVE_SEARCH_KEY = 'pokedex_search';

    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedList, setDisplayedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize from sessionStorage to maintain state across detail-view navigation
    const [limit, setLimit] = useState(() => {
        const saved = sessionStorage.getItem(SAVE_LIMIT_KEY);
        return saved ? parseInt(saved, 10) : 20;
    });

    const [inputBuffer, setInputBuffer] = useState(() => {
        return sessionStorage.getItem(SAVE_SEARCH_KEY) || '';
    });

    const [searchTerm, setSearchTerm] = useState(inputBuffer);
    const [showScroll, setShowScroll] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // 1. Initial Fetch of ALL names
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const data = await fetchAllPokemon();
                setAllPokemon(data);
            } catch (err) {
                console.error("Failed to load pokemon list", err);
                setError("Failed to connect to the PokéAPI.");
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    // 2. Scroll Listener & Position Saving
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            setShowScroll(currentScroll > 400);
            // Throttle saving scroll position
            sessionStorage.setItem(SAVE_SCROLL_KEY, currentScroll.toString());
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Debounce Search & Save State
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputBuffer);
            sessionStorage.setItem(SAVE_SEARCH_KEY, inputBuffer);
            // Don't reset limit if we're just restoring the page
            if (!isInitialLoad) {
                setLimit(20);
                sessionStorage.setItem(SAVE_LIMIT_KEY, "20");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputBuffer]);

    // 4. Update Display List & Restore Scroll
    useEffect(() => {
        if (allPokemon.length === 0) return;

        const updateDisplay = async () => {
            setLoading(true);
            const filtered = allPokemon.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const slice = filtered.slice(0, limit);

            try {
                const details = await Promise.all(
                    slice.map(p => fetchPokemonDetails(p.name))
                );
                setDisplayedList(details);

                // If this is the first render with data, restore scroll position
                if (isInitialLoad) {
                    // Use a slightly longer delay to ensure all cards have finished mounting/rendering
                    setTimeout(() => {
                        const savedScroll = sessionStorage.getItem(SAVE_SCROLL_KEY);
                        if (savedScroll) {
                            window.scrollTo(0, parseInt(savedScroll, 10));
                        }
                        setIsInitialLoad(false);
                    }, 50);
                }
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
        const newLimit = limit + 20;
        setLimit(newLimit);
        sessionStorage.setItem(SAVE_LIMIT_KEY, newLimit.toString());
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
        <div className="home-container">
            <header className="header">
                <h1 className="title">Pokédex</h1>
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
                            initial={isInitialLoad ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
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
                    <button className="load-more-btn" onClick={scrollTop}>Back to Top</button>
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
        </div>
    );
};

export default Home;
