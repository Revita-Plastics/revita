import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { AdminPanel } from './components/AdminPanel';

import { LanguageProvider } from './context/LanguageContext';

import { ProductDetail } from './components/ProductDetail';
import { Mission } from './components/Mission'; // Ensure this is imported

import { ThemeProvider } from './context/ThemeContext';
import { ContentProvider } from './context/ContentContext';

function App() {
  return (
    <ThemeProvider>
    <ContentProvider>
    <LanguageProvider>
        <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Home />} />
        </Routes>
        </Router>
    </LanguageProvider>
    </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
