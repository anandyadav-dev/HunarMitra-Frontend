import React from 'react';
import { motion } from 'framer-motion';

const Team = () => {
    // Placeholder team data - User can replace these with real images later
    const teamMembers = [
        {
            name: "Anand Yadav",
            role: "Founder & CEO",
            image: "/assets/founder.png"
        },
        {
            name: "Priya Singh",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            name: "Amit Patel",
            role: "Lead Developer",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },

    ];

    return (
        <section className="section" style={{ background: 'var(--color-bg-primary)', position: 'relative', zIndex: 10 }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                    style={{ marginBottom: '4rem' }}
                >
                    <h2 className="text-display" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
                        Meet Our <span className="text-gradient-orange">Team</span>
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                        The passionate minds behind HunarMitra.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2.5rem',
                }}>
                    {teamMembers.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="team-card"
                            style={{ height: '400px' }} // Fixed height for uniformity
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                            />
                            <div className="team-info">
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{member.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
