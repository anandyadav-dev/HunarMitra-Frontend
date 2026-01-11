import React, { useEffect, useState } from 'react';

const Preloader = ({ onFinish }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onFinish, 500); // Slight delay before unmounting
                    return 100;
                }
                return prev + 5; // Simulating loading
            });
        }, 50); // Adjust speed here

        return () => clearInterval(interval);
    }, [onFinish]);

    return (
        <div className="preloader">
            <div className="preloader-content">
                <div className="logo-container">
                    <div className="logo-box">HM</div>
                    <span className="logo-text">
                        Hunar<span style={{ color: 'var(--color-green)' }}>Mitra</span>
                    </span>
                </div>
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="loading-text">{progress}%</div>
            </div>
        </div>
    );
};

export default Preloader;
