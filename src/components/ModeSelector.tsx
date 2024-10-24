import React from 'react';
import { Mode } from '@/types';

interface ModeSelectorProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    resetSelections: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode, resetSelections }) => {
    return (
        <div className="flex mb-4 mt-4">
            <button
                onClick={() => {
                    setMode('distance');
                    resetSelections();
                }}
                className={`px-4 py-2 rounded mr-4 ${
                    mode === 'distance' ? 'bg-green-700' : 'bg-green-500'
                } text-white`}
            >
                Distance
            </button>
            <button
                onClick={() => {
                    setMode('marker');
                    resetSelections();
                }}
                className={`px-4 py-2 rounded mr-4 ${
                    mode === 'marker' ? 'bg-blue-700' : 'bg-blue-500'
                } text-white`}
            >
                Side Band
            </button>
            <button
                onClick={() => {
                    setMode('harmonic');
                    resetSelections();
                }}
                className={`px-4 py-2 rounded ${
                    mode === 'harmonic' ? 'bg-purple-700' : 'bg-purple-500'
                } text-white`}
            >
                Harmonic
            </button>
        </div>
    );
};

export default ModeSelector;
