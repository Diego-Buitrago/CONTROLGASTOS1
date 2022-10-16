import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/authContext';
import PrivateRoute from './components/PrivateRout';
import PublicRoute from './components/PublicRout';

import { DashboardRouts } from './DashboardRouts';
import Login from './pages/Login';

//export const App = () => {
export default () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login'
             element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          <Route path='/*' 
            element={                         
              <PrivateRoute>
                <DashboardRouts />
              </PrivateRoute>    
            } 
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}