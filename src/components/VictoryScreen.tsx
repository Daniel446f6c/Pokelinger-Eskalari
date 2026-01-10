import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

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
    const { getWinner, resetGame } = useGame();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const winner = getWinner();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles: Particle[] = [];
        const colors = [
            'hsl(42, 85%, 55%)',   // Gold
            'hsl(270, 75%, 60%)',  // Purple
            'hsl(0, 80%, 60%)',    // Red
            'hsl(120, 70%, 50%)',  // Green
            'hsl(200, 80%, 55%)',  // Blue
            'hsl(45, 100%, 70%)',  // Yellow
            'hsl(320, 80%, 60%)',  // Pink
        ];

        // Create explosion at position
        const createExplosion = (x: number, y: number) => {
            const particleCount = 80 + Math.random() * 40;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
                const speed = 2 + Math.random() * 6;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const maxLife = 60 + Math.random() * 40;

                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color,
                    life: maxLife,
                    maxLife,
                    size: 2 + Math.random() * 3
                });
            }
        };

        // Launch fireworks periodically
        const launchFirework = () => {
            const x = Math.random() * canvas.width;
            const y = canvas.height * (0.2 + Math.random() * 0.4);
            createExplosion(x, y);
        };

        // Initial burst
        for (let i = 0; i < 5; i++) {
            setTimeout(() => launchFirework(), i * 200);
        }

        // Continuous fireworks
        const launchInterval = setInterval(launchFirework, 800);

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.08; // Gravity
                p.vx *= 0.99; // Air resistance
                p.life--;

                const alpha = p.life / p.maxLife;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fill();

                // Trail
                ctx.globalAlpha = alpha * 0.3;
                ctx.beginPath();
                ctx.arc(p.x - p.vx, p.y - p.vy, p.size * 0.5 * alpha, 0, Math.PI * 2);
                ctx.fill();

                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            clearInterval(launchInterval);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const handleNewGame = () => {
        resetGame();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Fireworks Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)'
                }}
            />

            {/* Victory Content */}
            <div className="glass-panel" style={{
                position: 'relative',
                zIndex: 1,
                padding: '3rem',
                textAlign: 'center',
                maxWidth: '500px',
                animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {/* Trophy Icon */}
                <div style={{
                    fontSize: '5rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 20px hsla(42, 85%, 55%, 0.6))'
                }}>
                    🏆
                </div>

                {/* Winner Announcement */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    color: 'var(--text-muted)'
                }}>
                    Gewinner
                </h1>

                <div style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 40px hsla(42, 85%, 55%, 0.3)'
                }}>
                    {winner?.player.name || 'Unbekannt'}
                </div>

                <div style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    marginBottom: '2rem'
                }}>
                    mit <span style={{
                        color: 'var(--gold)',
                        fontWeight: 700,
                        fontSize: '1.8rem'
                    }}>{winner?.total || 0}</span> Punkten
                </div>

                {/* New Game Button */}
                <button
                    onClick={handleNewGame}
                    className="btn-primary pulse"
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        borderRadius: 'var(--radius-md)'
                    }}
                >
                    🎲 Neues Spiel
                </button>
            </div>
        </div>
    );
};

export default VictoryScreen;
