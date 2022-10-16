import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';

import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Perfiles from './pages/Perfiles';
import Error404 from './components/Error404';

export const DashboardRouts = () => {
 
    return (
        <div className="wrapper">
            <Header />
            <Menu />
            <HashRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="perfiles" element={<Perfiles />} />
                <Route path="/*" element={<Error404 />} />
            </Routes>

            </HashRouter>
            <Footer />
        </div>
    )    
}