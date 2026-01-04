/**
 * Confetti bem leve em canvas (sem libs).
 */
(function(){
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let W=0,H=0,parts=[],running=false,t0=0;

  function resize(){
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
  }
  window.addEventListener("resize", resize);
  resize();

  function spawn(){
    parts = [];
    const n = 120;
    for(let i=0;i<n;i++){
      parts.push({
        x: Math.random()*W,
        y: -Math.random()*H*0.2,
        vx: (Math.random()-0.5)*2.2*devicePixelRatio,
        vy: (2+Math.random()*4)*devicePixelRatio,
        r: (2+Math.random()*4)*devicePixelRatio,
        a: Math.random()*Math.PI*2,
        va: (Math.random()-0.5)*0.25
      });
    }
  }

  function draw(t){
    if(!running) return;
    if(!t0) t0=t;
    const dt = (t - t0);
    ctx.clearRect(0,0,W,H);

    for(const p of parts){
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;

      // cores suaves: verde/azul/rosa alternando
      const k = (p.x + p.y) % 3;
      ctx.fillStyle = k<1 ? "rgba(31,111,91,.85)" : (k<2 ? "rgba(90,160,220,.85)" : "rgba(210,70,120,.75)");
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r*1.2, p.r, p.a, 0, Math.PI*2);
      ctx.fill();
    }

    // Para em ~1.2s ou quando tudo sair da tela
    if(dt > 1200 || parts.every(p=>p.y > H + 40*devicePixelRatio)){
      running=false;
      ctx.clearRect(0,0,W,H);
      return;
    }
    requestAnimationFrame(draw);
  }

  window.confettiBoom = function(){
    spawn();
    running=true;
    t0=0;
    requestAnimationFrame(draw);
  }
})();
