import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import RegistrationHighlight from '../components/RegistrationHighlight';
import Team from '../components/Team';

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
            <RegistrationHighlight />
            <Team />
        </motion.div>
    );
};

export default Home;
