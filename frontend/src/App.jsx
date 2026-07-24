// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import { useEffect } from "react";
// import api from "./api/api";
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App
