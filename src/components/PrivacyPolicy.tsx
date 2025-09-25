import React from 'react';

const PrivacyPolicy: React.FC = () => (
    <div
        style={{
            padding: '2rem',
            maxWidth: 800,
            margin: '0 auto',
            color: '#111',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '1.05rem',
            lineHeight: 1.7,
        }}
    >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#111' }}>Privacy Policy</h1>
        <p>
            <strong>Effective Date:</strong> September 2025
        </p><br></br>
        <p>
            Thank you for using FineTrack. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Information We Collect</h2>
        <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
            <li>
                <strong>Personal Information:</strong> We may collect information such as your name, email address, and other details you provide when creating an account or using our services.
            </li>
            <li>
                <strong>Usage Data:</strong> We collect information about how you use the app, including features accessed, time spent, and device information.
            </li>
        </ul>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>How We Use Your Information</h2>
        <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
            <li>To provide and maintain our services</li>
            <li>To improve and personalize your experience</li>
            <li>To communicate with you about updates or support</li>
            <li>To comply with legal obligations</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Information Sharing</h2>
        <p>
            We do not sell or rent your personal information. We may share information with third-party service providers who assist us in operating the app, subject to confidentiality agreements.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Data Security</h2>
        <p>
            We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Your Choices</h2>
        <p>
            You may update or delete your information by contacting us. You may also opt out of certain communications.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Children's Privacy</h2>
        <p>
            Our app is not intended for children under 13. We do not knowingly collect personal information from children.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '2rem', color: '#222' }}>Contact Us</h2>
        <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="https://github.com/LadishDev/FineTrack/issues" style={{ color: '#0078d4' }}>Github</a>.
        </p>
    </div>
);

export default PrivacyPolicy;