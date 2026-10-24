import React, { useEffect, useRef, useState } from 'react';
import { ChemicalElement } from '../types';
import { Play, Pause, RotateCw } from 'lucide-react';

interface Props {
  element: ChemicalElement;
  primaryColor?: string;
}

export const BohrAtomVisualizer: React.FC<Props> = ({ element, primaryColor = '#38bdf8' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const animFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const shells = element.shells && element.shells.length > 0 ? element.shells : [1];
    const numShells = shells.length;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) - 24;
      const nucleusRadius = Math.max(12, Math.min(22, 10 + Math.sqrt(element.z) * 1.5));

      // Draw glowing background ambient aura
      const auraGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, maxRadius + 10);
      auraGrad.addColorStop(0, `${primaryColor}25`);
      auraGrad.addColorStop(0.6, `${primaryColor}08`);
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius + 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbit Shells
      shells.forEach((electronCount, shellIdx) => {
        // Radius for this shell
        const shellRadius = nucleusRadius + 18 + (shellIdx + 1) * ((maxRadius - nucleusRadius - 18) / (numShells + 0.3));

        // Shell orbit line
        ctx.beginPath();
        ctx.arc(cx, cy, shellRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label shell letter (K, L, M, N, O, P, Q)
        const shellLetters = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '10px var(--font-mono, monospace)';
        ctx.textAlign = 'left';
        ctx.fillText(shellLetters[shellIdx] || `S${shellIdx + 1}`, cx + shellRadius - 12, cy - 4);

        // Draw electrons in this shell
        // Orbit speed: inner shells faster
        const shellSpeedMultiplier = (numShells - shellIdx * 0.4) * 0.6;
        const currentShellAngle = angleRef.current * shellSpeedMultiplier * (shellIdx % 2 === 0 ? 1 : -1);

        for (let e = 0; e < electronCount; e++) {
          const electronAngle = currentShellAngle + (e * (2 * Math.PI / electronCount));
          const ex = cx + Math.cos(electronAngle) * shellRadius;
          const ey = cy + Math.sin(electronAngle) * shellRadius;

          // Electron glow
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor;
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner spark
          ctx.beginPath();
          ctx.arc(ex, ey, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      });

      // Draw Nucleus (Protons + Neutrons Cluster)
      ctx.beginPath();
      ctx.arc(cx, cy, nucleusRadius, 0, Math.PI * 2);
      const nucGrad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, nucleusRadius);
      nucGrad.addColorStop(0, '#f87171');
      nucGrad.addColorStop(0.5, '#ef4444');
      nucGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = nucGrad;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Nucleus Symbol / Atomic Number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px var(--font-heading, sans-serif)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${element.z}p`, cx, cy);

      if (isPlaying) {
        angleRef.current += 0.015 * speed;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [element, isPlaying, speed, primaryColor]);

  const shellLetters = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-200">
      <div className="w-full flex items-center justify-between px-2 mb-2 text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5 font-mono text-cyan-400">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          BOHR QUANTUM MODEL
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title={isPlaying ? 'Pause orbit' : 'Resume orbit'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setSpeed(s => (s >= 2 ? 0.5 : s + 0.5))}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
            title="Toggle orbit speed"
          >
            {speed}x
          </button>
        </div>
      </div>

      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-full h-full rounded-xl"
        />
      </div>

      {/* Electron Shell Breakdown */}
      <div className="w-full mt-2 pt-2 border-t border-slate-800/80">
        <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
          <span>Electron Configuration ({element.shells?.reduce((a, b) => a + b, 0) || element.z}e⁻):</span>
          <span className="font-mono text-cyan-400 font-semibold">{element.shells?.join(' · ')}</span>
        </div>
        <div className="flex gap-1 justify-center flex-wrap">
          {element.shells?.map((count, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
            >
              {shellLetters[idx] || `S${idx + 1}`}: <strong className="text-cyan-400">{count}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
