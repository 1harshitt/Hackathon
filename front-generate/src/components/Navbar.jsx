import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBook } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">
                    <FontAwesomeIcon icon={faCode} className="me-2" />
                    Backend Generator
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Generator</Nav.Link>
                        <Nav.Link as={Link} to="/docs">Documentation</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar; 