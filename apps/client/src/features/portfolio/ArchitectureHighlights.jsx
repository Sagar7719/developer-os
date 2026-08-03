import React from 'react';
import {
    FiLayers,
    FiShield,
    FiTerminal,
    FiCode,
} from 'react-icons/fi';

const items = [
    {
        icon: FiLayers,
        title: '5-Tier Server Pattern',
        subtitle: 'Route → DB Layer',
        color: 'text-purple-400',
    },
    {
        icon: FiShield,
        title: 'Identity Platform',
        subtitle: 'Dual JWT & SHA-256',
        color: 'text-cyan-400',
    },
    {
        icon: FiTerminal,
        title: 'pnpm Monorepo',
        subtitle: 'React 19 + Express',
        color: 'text-purple-400',
    },
    {
        icon: FiCode,
        title: 'Enterprise Specs',
        subtitle: 'DOC-000 Compliant',
        color: 'text-cyan-400',
    },
];

export function ArchitectureHighlights() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="group bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-5 transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${item.color}`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>

                            <h3 className="mt-5 text-white font-semibold">
                                {item.title}
                            </h3>

                            <p className="text-slate-400 text-sm mt-1 font-mono">
                                {item.subtitle}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default ArchitectureHighlights;