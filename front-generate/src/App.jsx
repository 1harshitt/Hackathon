import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ModelGenerator from './components/ModelGenerator'
import Documentation from './components/Documentation'

function App() {
    return (
        <Router>
            <div className="app-container d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<ModelGenerator />} />
                        <Route path="/docs" element={<Documentation />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
