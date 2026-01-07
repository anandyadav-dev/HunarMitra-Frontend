import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Team from '../components/Team';
import Globe3D from '../components/Globe3D';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <HowItWorks />
            <Features />
            {/* <Team /> */}
            <Globe3D />
        </motion.div>
    );
};

export default Home;
