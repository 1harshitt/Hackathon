import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-light py-4 mt-5">
            <Container className="text-center">
                <p className="mb-0">
                    Backend Generator &copy; {new Date().getFullYear()} - Generate production-ready backend code in seconds
                </p>
                <p className="text-muted small mb-0">
                    Powered by Express, Sequelize, and React
                </p>
            </Container>
        </footer>
    );
};

export default Footer; 