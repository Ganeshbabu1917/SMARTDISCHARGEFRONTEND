import React from 'react';
import { patientService } from '../services/api';
import './ExportButtons.css';

const ExportButtons = ({ patientId, summary }) => {
    const handleExportPDF = () => {
        window.open(patientService.exportPDF(patientId), '_blank');
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(summary, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `discharge-summary-${patientId}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="export-buttons">
            <button onClick={handleExportPDF} className="btn-export pdf">
                <span className="btn-icon">📄</span>
                Export PDF
            </button>
            <button onClick={handleExportJSON} className="btn-export json">
                <span className="btn-icon">📊</span>
                Export JSON
            </button>
            <button onClick={handlePrint} className="btn-export print">
                <span className="btn-icon">🖨️</span>
                Print
            </button>
        </div>
    );
};

export default ExportButtons;