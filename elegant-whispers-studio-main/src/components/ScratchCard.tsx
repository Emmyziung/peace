import { useEffect, useRef, useState } from "react";

export function ScratchCard({ image, hint = "scratch to reveal" }: { image: string; hint?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // paint the "foil" cover
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, "#e9c67a");
    grad.addColorStop(0.35, "#f5e0a8");
    grad.addColorStop(0.55, "#c98fa3");
    grad.addColorStop(1, "#b98446");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // shimmer speckles
    for (let n = 0; n < 220; n++) {
      ctx.fillStyle = `hsla(${40 + Math.random() * 20}, 80%, ${70 + Math.random() * 20}%, ${Math.random() * 0.35})`;
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // hint text
    ctx.fillStyle = "rgba(43,34,37,.55)";
    ctx.font = "italic 20px 'Cormorant Garamond', serif";
    ctx.textAlign = "center";
    ctx.fillText("♡  " + hint + "  ♡", rect.width / 2, rect.height / 2);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 40;
  }, [hint]);

  const pt = (e: PointerEvent | React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e as PointerEvent).clientX - r.left, y: (e as PointerEvent).clientY - r.top };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    const { x, y } = pt(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const { x, y } = pt(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    // check how much is cleared
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 32) if (data[i] === 0) clear++;
    if (clear / (data.length / 32) > 0.45) setRevealed(true);
  };

  useEffect(() => {
    if (!revealed) return;
    const c = canvasRef.current;
    if (!c) return;
    c.style.transition = "opacity 700ms ease";
    c.style.opacity = "0";
  }, [revealed]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-card shadow-[var(--shadow-soft)]"
    >
      <img
        src={image}
        alt="a little surprise for you"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        className="absolute inset-0 h-full w-full touch-none cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
