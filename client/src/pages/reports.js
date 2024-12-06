import React, { useState } from 'react';
import Transaction from './transaction';
import Inventory from './inventory';
import Supplier from './supplier';
import Sales from './sales';
import '../css/damage.css';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('Transaction'); // Default to Transaction tab

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Transaction':
                return <Transaction />;
            case 'Inventory':
                return <Inventory />;
            case 'Supplier':
                return <Supplier />;
            case 'Sales':
                return <Sales />;
            default:
                return null;
        }
    };

    return (
        <div className="reports-container">
            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === 'Transaction' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Transaction')}
                >
                    Transaction
                </button>
                <button
                    className={`tab-btn ${activeTab === 'Inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Inventory')}
                >
                    Inventory
                </button>
                <button
                    className={`tab-btn ${activeTab === 'Supplier' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Supplier')}
                >
                    Supplier
                </button>
                <button
                    className={`tab-btn ${activeTab === 'Sales' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Sales')}
                >
                    Sales
                </button>
            </div>

            <div className="tab-content">{renderActiveTab()}</div>
        </div>
    );
};

export default Reports;
