import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, Volume2, Square, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const FAQItem = ({ question, answer, isOpen, onClick, onSpeak, isSpeaking }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            className="glass-card"
            style={{
                marginBottom: '1.5rem',
                overflow: 'hidden',
                borderColor: isOpen ? 'var(--color-orange)' : 'rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.02)',
                boxShadow: isOpen ? '0 10px 30px -10px rgba(255, 107, 44, 0.15)' : 'none'
            }}
            initial={false}
        >
            <div
                style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={onClick}
            >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <div style={{
                        minWidth: '32px', height: '32px', borderRadius: '50%',
                        background: isOpen ? 'linear-gradient(135deg, #FF6B2C, #FF8F60)' : 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease'
                    }}>
                        <HelpCircle size={18} color={isOpen ? 'white' : 'var(--color-text-secondary)'} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: isOpen ? 'white' : 'var(--color-text-primary)', transition: 'color 0.3s' }}>{question}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSpeak();
                        }}
                        style={{
                            background: isSpeaking ? 'var(--color-orange-light)' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSpeaking ? 'white' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            transition: 'all 0.2s hover'
                        }}
                        title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                    >
                        {isSpeaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={18} />}
                    </button>
                    {isOpen ? <ChevronUp color="var(--color-orange)" /> : <ChevronDown color="var(--color-text-secondary)" />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div style={{
                            padding: '0 2rem 2rem 4.5rem', // Aligned with text start
                            color: 'var(--color-text-secondary)',
                            lineHeight: '1.7',
                            fontSize: '1.05rem',
                            borderTop: '1px solid rgba(255,255,255,0.03)',
                            marginTop: '-0.5rem',
                            paddingTop: '1.5rem'
                        }}>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQ = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const [openIndex, setOpenIndex] = useState(0);
    const [speakingIndex, setSpeakingIndex] = useState(-1);

    const faqs = [
        { q: t.faq_q1, a: t.faq_a1 },
        { q: t.faq_q2, a: t.faq_a2 },
        { q: t.faq_q3, a: t.faq_a3 },
        { q: t.faq_q4, a: t.faq_a4 },
    ];

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    const handleSpeak = (text, index) => {
        if (speakingIndex === index) {
            window.speechSynthesis.cancel();
            setSpeakingIndex(-1);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        utterance.onend = () => {
            setSpeakingIndex(-1);
        };

        window.speechSynthesis.speak(utterance);
        setSpeakingIndex(index);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '8rem',
            paddingBottom: '4rem',
            background: 'radial-gradient(circle at top left, rgba(255, 107, 44, 0.05), transparent 40%), radial-gradient(circle at bottom right, rgba(30, 132, 73, 0.05), transparent 40%)'
        }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(255, 107, 44, 0.1)', color: '#FF6B2C',
                        padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem',
                        fontWeight: '600', marginBottom: '1.5rem',
                        border: '1px solid rgba(255, 107, 44, 0.2)'
                    }}>
                        <Sparkles size={16} />
                        <span>Support Center</span>
                    </div>

                    <h1 className="text-display" style={{ marginBottom: '1rem', fontSize: '3.5rem' }}>
                        {t.faqTitle}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        {t.faqSubtitle}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.q}
                            answer={faq.a}
                            isOpen={openIndex === index}
                            onClick={() => handleClick(index)}
                            onSpeak={() => handleSpeak(`${faq.q}. ${faq.a}`, index)}
                            isSpeaking={speakingIndex === index}
                        />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ textAlign: 'center', marginTop: '6rem', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem', fontSize: '1.5rem' }}>Still need help?</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                        Our team is just a message away. Reach out to us for personalized support.
                    </p>
                    <a href="/contact" className="btn btn-primary-orange btn-shine">
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
