/**
 * Purely decorative, feature-flagged spectacle. None of this is necessary.
 * All of it is glorious.
 */

/** A canvas "Matrix rain" of birthdates cascading behind the card. */
export function startMatrixRain(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const glyphs = "0123456789.".split("");
  let columns = 0;
  let drops: number[] = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / 16);
    drops = new Array(columns).fill(1);
  };
  resize();
  window.addEventListener("resize", resize);

  let raf = 0;
  let last = 0;
  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    if (t - last < 55) return;
    last = t;
    ctx.fillStyle = "rgba(102, 126, 234, 0.10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "16px monospace";
    for (let i = 0; i < drops.length; i++) {
      const text = glyphs[Math.floor(Math.random() * glyphs.length)] ?? "0";
      ctx.fillText(text, i * 16, (drops[i] ?? 0) * 16);
      if ((drops[i] ?? 0) * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] = (drops[i] ?? 0) + 1;
    }
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

/** A modest confetti burst to celebrate the successful subtraction. */
export function burstConfetti(): void {
  const colors = ["#667eea", "#764ba2", "#f6c453", "#ffffff", "#e94f6a"];
  const count = 90;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 8;
    Object.assign(piece.style, {
      position: "fixed",
      left: `${50 + (Math.random() - 0.5) * 20}vw`,
      top: "45vh",
      width: `${size}px`,
      height: `${size * 0.4}px`,
      background: colors[i % colors.length] ?? "#fff",
      opacity: "1",
      pointerEvents: "none",
      zIndex: "9999",
      transform: `rotate(${Math.random() * 360}deg)`
    } as CSSStyleDeclaration);
    document.body.appendChild(piece);
    const dx = (Math.random() - 0.5) * 600;
    const dy = 300 + Math.random() * 400;
    piece.animate(
      [
        { transform: piece.style.transform, opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720}deg)`,
          opacity: 0
        }
      ],
      { duration: 1400 + Math.random() * 800, easing: "cubic-bezier(.2,.6,.2,1)" }
    ).onfinish = () => piece.remove();
  }
}
