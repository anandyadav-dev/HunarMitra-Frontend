import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const Globe3D = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const globeEl = useRef();
    const [arcsData, setArcsData] = useState([]);
    const [ringsData, setRingsData] = useState([]);

    // Generate random connections to simulate activity
    useEffect(() => {
        // Sample coordinates for major cities/regions in India and surrounding
        const locations = [
            { name: "Delhi", lat: 28.6139, lng: 77.2090 },
            { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
            { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
            { name: "Chennai", lat: 13.0827, lng: 80.2707 },
            { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
            { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
            { name: "Lucknow", lat: 26.8467, lng: 80.9461 },
            { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
            { name: "Patna", lat: 25.5941, lng: 85.1376 },
            { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
        ];

        const N_ARCS = 30;
        const arcs = Array.from({ length: N_ARCS }).map(() => {
            const startNode = locations[Math.floor(Math.random() * locations.length)];
            let endNode = locations[Math.floor(Math.random() * locations.length)];
            while (startNode === endNode) {
                endNode = locations[Math.floor(Math.random() * locations.length)];
            }
            return {
                startLat: startNode.lat,
                startLng: startNode.lng,
                endLat: endNode.lat,
                endLng: endNode.lng,
                color: [['#FF6B2C', '#FFFFFF'][Math.round(Math.random())], ['#2ECC71', '#3498DB'][Math.round(Math.random())]]
            };
        });

        setArcsData(arcs);
        setRingsData(locations.map(loc => ({
            lat: loc.lat,
            lng: loc.lng,
            maxR: Math.random() * 2 + 1,
            propagationSpeed: Math.random() * 2 + 1,
            repeatPeriod: Math.random() * 2000 + 1000
        })));

        // Auto-rotate and initial zoom
        if (globeEl.current) {
            // Disable auto-rotate to keep focus on India
            globeEl.current.controls().autoRotate = false;
            globeEl.current.controls().enableZoom = false;
            // High altitude start, then animate to India
            globeEl.current.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 1.5 });
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="globe-container"
            style={{
                height: '700px',
                position: 'relative',
                // Matching dark theme backgrounds: #1F2329 to #0F1115
                background: 'radial-gradient(circle at center, #1F2329 0%, #0F1115 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                top: '10%',
                zIndex: 10,
                textAlign: 'center',
                padding: '0 1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    marginBottom: '0.5rem',
                    letterSpacing: '-1px'
                }}>
                    {t.globeTitlePre} <span style={{ color: '#FF6B2C' }}>{t.globeTitleHighlight}</span> {t.globeTitlePost}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    {t.globeSubtitle}
                </p>
            </div>

            <Globe
                ref={globeEl}
                height={700}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                atmosphereColor={'#FF6B2C'} // Orange atmosphere for brand alignment
                atmosphereAltitude={0.15}
                arcsData={arcsData}
                arcColor={() => ['#FF6B2C', '#1E8449'][Math.round(Math.random())]} // Brand Orange & Green
                arcDashLength={0.4}
                arcDashGap={2}
                arcDashAnimateTime={() => Math.random() * 4000 + 1500}
                // arcStroke={0.5}
                ringsData={ringsData}
                ringColor={() => (t) => `rgba(255,107,44,${1 - t})`} // Brand Orange
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
                labelsData={[
                    { lat: 20.5937, lng: 78.9629, label: "INDIA", size: 2.5, color: '#FF6B2C' }
                ]}
                labelLat={d => d.lat}
                labelLng={d => d.lng}
                labelText={d => d.label}
                labelSize={d => d.size}
                labelDotRadius={0.5}
                labelColor={d => d.color}
                labelResolution={2}
            />

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '150px',
                background: 'linear-gradient(to top, #0F1115, transparent)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '150px',
                background: 'linear-gradient(to bottom, #0F1115, transparent)',
                pointerEvents: 'none'
            }} />
        </motion.div>
    );
};

export default Globe3D;
