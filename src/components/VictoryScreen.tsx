import { useEffect, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import type { Player } from '../types/game';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    maxLife: number;
    size: number;
}

const VictoryScreen = () => {
    const { players, calculatePlayerTotal, resetGame } = useGame();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Sort players by score
    const rankedPlayers = useMemo(() => {
        return [...players].sort((a, b) => calculatePlayerTotal(b) - calculatePlayerTotal(a));
    }, [players, calculatePlayerTotal]);
    const winner = rankedPlayers[0];
    const second = rankedPlayers[1];
    const third = rankedPlayers[2];
    const rest = rankedPlayers.slice(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let particles: Particle[] = [];
        const colors = [
            'hsl(42, 85%, 55%)', 'hsl(270, 75%, 60%)', 'hsl(0, 80%, 60%)',
            'hsl(120, 70%, 50%)', 'hsl(200, 80%, 55%)', 'hsl(45, 100%, 70%)',
            'hsl(320, 80%, 60%)'
        ];

        const createExplosion = (x: number, y: number) => {
            const particleCount = 60 + Math.random() * 40;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
                const speed = 2 + Math.random() * 5;
                const maxLife = 40 + Math.random() * 40;

                particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: maxLife,
                    maxLife,
                    size: 1 + Math.random() * 3
                });
            }
        };

        let lastSpawnTime = 0;
        const spawnInterval = 320;
        let animationId: number;
        const animate = (currentTime: number) => {
            // Clear background for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Spawn new fireworks
            if (currentTime - lastSpawnTime > spawnInterval) {
                const x = Math.random() * canvas.width;
                const y = canvas.height * (0.2 + Math.random() * 0.3);
                createExplosion(x, y);
                lastSpawnTime = currentTime;
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.07; // Gravity
                p.vx *= 0.98; // Air resistance
                p.life--;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha = p.life / p.maxLife;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fill();

                // Small Glowing Effect
                ctx.globalAlpha = alpha * 0.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    // Podium item component
    const PodiumPlace = ({ player, place, color, height }: { player: Player, place: number, color: string, height: string }) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5,
            transform: place === 1 ? 'scale(1.1)' : 'scale(1)'
        }}>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.5rem',
                textShadow: `0 0 10px ${color}`
            }}>
                {player.name}
            </div>
            <div style={{
                width: '100px',
                height: height,
                background: `linear-gradient(to bottom, ${color}cc, ${color}44)`,
                borderTop: `4px solid ${color}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '1rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: `0 0 16px ${color}66`,
                borderRadius: '8px 8px 0 0'
            }}>
                {place}
            </div>
            <div style={{
                marginTop: '0.5rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: color
            }}>
                {calculatePlayerTotal(player)} Pkt
            </div>
        </div>
    );

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
            {/* Fireworks Canvas */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.85)' }} />

            <div className="glass-panel" style={{ position: 'relative', zIndex: 1, padding: '1rem', textAlign: 'center', width: '90%', maxWidth: '600px', animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {/* Trophy Icon */}
                <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px hsla(42, 85%, 55%, 0.6))' }}>🏆</div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Siegerehrung
                </h1>

                {/* Podium */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
                    {second && <PodiumPlace player={second} place={2} color="#C0C0C0" height="125px" />}
                    {winner && <PodiumPlace player={winner} place={1} color="#FFD700" height="220px" />}
                    {third && <PodiumPlace player={third} place={3} color="#CD7F32" height="90px" />}
                </div>

                {/* Others List */}
                {rest.length > 0 && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', width: '100%' }}>
                        <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Weitere Platzierungen</h3>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {rest.map((player, index) => (
                                <div key={player.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem 1.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--text-muted)', width: '20px' }}>{index + 4}.</span>
                                        <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                                    </div>
                                    <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{calculatePlayerTotal(player)} Pkt</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Game Button */}
                <button onClick={resetGame} className="btn-primary pulse" style={{ marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: 'var(--radius-md)' }}>
                    🎲 Neues Spiel
                </button>
            </div>
        </div>
    );
};

export default VictoryScreen;
