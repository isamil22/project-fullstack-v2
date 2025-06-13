// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HelloPage from './pages/HelloPage'; // Import the new page
import Footer from './components/Footer'; // 1. Import the Footer

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Routes>

                    <Route path="/hello" element={<HelloPage />} /> {/* Add the new route */}

                </Routes>
            </main>
            <Footer /> {/* 2. Add the Footer */}

        </BrowserRouter>
    );
}

export default App;

