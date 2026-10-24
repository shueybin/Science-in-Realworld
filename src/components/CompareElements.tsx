import React, { useState } from 'react';
import { ChemicalElement } from '../types';
import { SORTED_ELEMENTS, CATEGORIES } from '../data/elementsData';
import { Scale, ArrowRightLeft } from 'lucide-react';

export const CompareElements: React.FC = () => {
  const [element1Z, setElement1Z] = useState<number>(3); // Lithium
  const [element2Z, setElement2Z] = useState<number>(11); // Sodium

  const el1 = SORTED_ELEMENTS.find(e => e.z === element1Z) || SORTED_ELEMENTS[2];
  const el2 = SORTED_ELEMENTS.find(e => e.z === element2Z) || SORTED_ELEMENTS[10];

  const cat1 = CATEGORIES[el1.cat];
  const cat2 = CATEGORIES[el2.cat];

  const swapElements = () => {
    const temp = element1Z;
    setElement1Z(element2Z);
    setElement2Z(temp);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-2">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-500" />
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Side-by-Side Element Comparator
            </h2>
          </div>
          <button
            onClick={swapElements}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            title="Swap elements"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Swap
          </button>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Primary Element
            </label>
            <select
              value={element1Z}
              onChange={e => setElement1Z(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {SORTED_ELEMENTS.map(e => (
                <option key={e.z} value={e.z}>
                  {e.z}. {e.n} ({e.s})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Comparison Element
            </label>
            <select
              value={element2Z}
              onChange={e => setElement2Z(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {SORTED_ELEMENTS.map(e => (
                <option key={e.z} value={e.z}>
                  {e.z}. {e.n} ({e.s})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Element 1 Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2"
              style={{ backgroundColor: `${cat1?.color}22` }}
            >
              {el1.i}
            </div>
            <div className="text-xs font-mono text-slate-400">Atomic Number {el1.z}</div>
            <div className="text-4xl font-extrabold font-heading" style={{ color: cat1?.color }}>
              {el1.s}
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{el1.n}</div>
            <span
              className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: `${cat1?.color}18`, color: cat1?.color }}
            >
              {cat1?.label}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-0.5">Real-World Use</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{el1.u}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Weight</span>
                <div className="font-mono font-bold">{el1.weight}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">State</span>
                <div className="font-semibold capitalize">{el1.state}</div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase">Shells (K–Q)</span>
              <div className="font-mono font-bold text-cyan-500">{el1.shells?.join(' · ')}</div>
            </div>
          </div>
        </div>

        {/* Element 2 Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2"
              style={{ backgroundColor: `${cat2?.color}22` }}
            >
              {el2.i}
            </div>
            <div className="text-xs font-mono text-slate-400">Atomic Number {el2.z}</div>
            <div className="text-4xl font-extrabold font-heading" style={{ color: cat2?.color }}>
              {el2.s}
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{el2.n}</div>
            <span
              className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: `${cat2?.color}18`, color: cat2?.color }}
            >
              {cat2?.label}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-0.5">Real-World Use</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{el2.u}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Weight</span>
                <div className="font-mono font-bold">{el2.weight}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">State</span>
                <div className="font-semibold capitalize">{el2.state}</div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase">Shells (K–Q)</span>
              <div className="font-mono font-bold text-cyan-500">{el2.shells?.join(' · ')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
