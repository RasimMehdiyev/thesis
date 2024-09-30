import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import './css/auth.css'
import './css/sidebar.css'
import './css/home.css'
import './css/overview.css'
import './css/digital_biomarkers.css'
import './css/machine_learning.css'
import './css/demographic_summary.css'
import './css/navbar.css'
import './css/models.css'
import './css/dropdown_table.css'
import './css/diverging_chart.css'
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <BrowserRouter>
        <App / >
    </BrowserRouter>
);