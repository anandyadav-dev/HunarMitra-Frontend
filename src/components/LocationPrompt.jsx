import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

const LocationPrompt = () => {
    const { permissionGranted, error, requestLocation, loading } = useLocationContext();

    // Do not show if permission is already granted or if loading
    if (permissionGranted || (loading && !error)) return null;

    // Do not show if error is explicitly "denied" (to avoid nagging), 
    // BUT user asked for a screen to allow location, so we might want to show it initially 
    // until they interact.
    // Let's hide if there's a specific "User denied" error to respect privacy, 
    // but show if it's just "prompt" state (which we handle via initial null state).

    // Simplification: Show if permission NOT granted.
    // If error exists, we can show a "Retry" or "Manual" message

    return (
        <AnimatePresence>
            {!permissionGranted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="location-prompt-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="location-card glass-card"
                        style={{
                            background: 'var(--color-bg-primary)',
                            padding: '2rem',
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, var(--color-orange-light) 0%, var(--color-orange) 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto',
                            boxShadow: 'var(--shadow-glow-orange)'
                        }}>
                            <Navigation size={40} color="white" fill="white" />
                        </div>

                        <h3 className="text-display" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                            Enable Location
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                            To provide the best experience and auto-fill your city for registration, please allow location access.
                        </p>

                        <button
                            onClick={requestLocation}
                            className="btn btn-primary-orange btn-shine"
                            style={{ width: '100%' }}
                        >
                            <MapPin size={20} />
                            Allow Location Access
                        </button>

                        {error && (
                            <p style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.9rem' }}>
                                {error === 'User denied Geolocation'
                                    ? "Permission denied. Please enable it in your browser settings."
                                    : "Could not fetch location. Please try again."
                                }
                            </p>
                        )}

                        {/* Option to dismiss if strictly needed, but user requirement implied a blocking/prominent screen */}
                        {/* <button 
                            onClick={dismiss} 
                            style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                            Continue without location
                        </button> */}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LocationPrompt;
