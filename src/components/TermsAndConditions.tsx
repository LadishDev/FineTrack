import React from 'react';

const TermsAndConditions: React.FC = () => (
    <div
        style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '2rem',
            background: '#fff',
            color: '#111',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            lineHeight: 1.7,
        }}
    >
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#111' }}>Terms and Conditions</h1>
        <p style={{ color: '#444', marginBottom: '2rem', fontSize: '1rem' }}>Last updated: September 2025</p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>1. Acceptance of Terms</h2>
        <p>
            By accessing or using FineTrack, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>2. Use of Service</h2>
        <p>
            You agree to use FineTrack only for lawful purposes and in accordance with these Terms. You are responsible for your use of the service and any content you provide.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>3. Intellectual Property</h2>
        <p>
            FineTrack is open-source and licensed under the MIT License. Unless otherwise stated, the source code in this repository and most accompanying assets are made available under that license, which permits reproduction, distribution, modification, and private use provided the license notice is retained. See the <a href="https://github.com/LadishDev/FineTrack/blob/main/LICENSE" style={{ color: '#0078d4' }}>LICENSE</a> file for full license text and conditions.
        </p> <br></br>
        <p>
            The FineTrack name, logo, and branding may be subject to separate trademark rights and are not automatically licensed under the MIT License. If you plan to use the FineTrack name or logos in public materials or redistribute them as part of a product, please contact the maintainers to obtain permission.
        </p>
        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>4. Termination</h2>
        <p>
            We reserve the right to terminate or suspend your access to FineTrack at any time, without notice, for conduct that we believe violates these Terms.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>5. Disclaimer</h2>
        <p>
            FineTrack is provided "as is" and without warranties of any kind. We do not guarantee that the service will be error-free or uninterrupted.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>6. Limitation of Liability</h2>
        <p>
            In no event shall FineTrack or its affiliates be liable for any damages arising from your use of the service.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>7. Changes to Terms</h2>
        <p>
            We may update these Terms and Conditions from time to time. Changes will be posted on this page with an updated effective date.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', color: '#222' }}>8. Contact Us</h2>
        <p>
            If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:support@finetrack.com" style={{ color: '#0078d4' }}>support@finetrack.com</a>.
        </p>
    </div>
);

export default TermsAndConditions;