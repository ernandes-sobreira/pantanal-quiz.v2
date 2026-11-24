(function(){
  const $ = (id)=>document.getElementById(id);

  const screens = {
    home: $("screenHome"),
    quiz: $("screenQuiz"),
    levelUp: $("screenLevelUp"),
    final: $("screenFinal"),
  };

  const state = {
    level: 1,
    idx: 0,
    score: 0,
    right: 0,
    wrong: 0,
    name: "",
    questions: [],
    answered: false,
    levelRight: 0,
  };

  const QUESTIONS_PER_LEVEL = 8;
  const META = 6; // acertos mínimos para passar de nível
  const MAX_LEVEL = 5;

  function show(screen){
    Object.values(screens).forEach(s=>s.classList.add("hidden"));
    screens[screen].classList.remove("hidden");
  }

  function loadProgress(){
    try{
      const saved = JSON.parse(localStorage.getItem("pq_progress")||"null");
      if(!saved) return false;
      if(typeof saved.level !== "number") return false;
      state.level = Math.min(MAX_LEVEL, Math.max(1, saved.level));
      state.score = saved.score||0;
      state.right = saved.right||0;
      state.wrong = saved.wrong||0;
      state.name = saved.name||"";
      return true;
    }catch(e){ return false; }
  }

  function saveProgress(){
    localStorage.setItem("pq_progress", JSON.stringify({
      level: state.level,
      score: state.score,
      right: state.right,
      wrong: state.wrong,
      name: state.name
    }));
  }

  function resetProgress(){
    localStorage.removeItem("pq_progress");
    state.level = 1; state.idx = 0; state.score = 0; state.right = 0; state.wrong = 0;
  }

  function getLevelQuestions(level){
    const bank = window.QUESTION_BANK || {};
    const list = bank[level] || [];
    // garante tamanho mínimo (repete se necessário)
    const shuffle = (a)=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
    // sorteia sem repetir e embaralha a ordem das alternativas
    return shuffle(list.slice()).slice(0, QUESTIONS_PER_LEVEL).map(q=>{
      const order = shuffle(q.options.map((_,i)=>i));
      return { q: q.q, explain: q.explain, options: order.map(i=>q.options[i]), answer: order.indexOf(q.answer) };
    });
  }

  function updateStatus(){
    $("pillLevel").textContent = `Nível ${state.level}`;
    $("pillProgress").textContent = `${state.idx+1}/${QUESTIONS_PER_LEVEL} · ✅ ${state.levelRight}/${META}`;
    $("pillScore").textContent = `⭐ ${state.score}`;
  }

  function renderQuestion(){
    state.answered = false;
    $("explainBox").classList.add("hidden");
    $("qTitle").textContent = `Pergunta ${state.idx+1}`;
    $("qText").textContent = state.questions[state.idx].q;

    const opts = $("options");
    opts.innerHTML = "";

    const q = state.questions[state.idx];
    q.options.forEach((txt, i)=>{
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.innerHTML = `${String.fromCharCode(65+i)}. ${txt}`;
      btn.addEventListener("click", ()=>choose(i, btn));
      opts.appendChild(btn);
    });

    updateStatus();
  }

  function choose(choice, btnEl){
    if(state.answered) return;
    state.answered = true;

    const q = state.questions[state.idx];
    const buttons = Array.from(document.querySelectorAll(".opt"));
    buttons.forEach(b=>b.disabled = true);

    const correct = q.answer === choice;
    if(correct){
      btnEl.classList.add("correct");
      state.score += 2 + (state.level-1); // cresce com nível
      state.right += 1;
      state.levelRight += 1;
      $("explainTitle").textContent = "Boa! ✅";
    }else{
      btnEl.classList.add("wrong");
      const correctBtn = buttons[q.answer];
      if(correctBtn) correctBtn.classList.add("correct");
      state.score = Math.max(0, state.score - 2); // erro custa pontos
      state.wrong += 1;
      $("explainTitle").textContent = "Quase! 😅";
    }
    $("explainText").textContent = q.explain || "Resposta registrada.";
    $("explainBox").classList.remove("hidden");
    saveProgress();
  }

  function next(){
    if(state.idx < QUESTIONS_PER_LEVEL-1){
      state.idx += 1;
      renderQuestion();
      return;
    }
    // fim do nível
    if(state.levelRight < META){
      showRetry();
    }else if(state.level < MAX_LEVEL){
      showLevelUp();
    }else{
      showFinal();
    }
  }

  function showLevelUp(){
    show("levelUp");
    const pct = Math.round((state.level/MAX_LEVEL)*100);
    $("progressFill").style.width = `${pct}%`;

    const badge = ["🏅","🏆","🧭","🌿","🌈"][state.level-1] || "🏆";
    $("bigBadge").textContent = badge;

    $("levelUpTitle").textContent = `Nível ${state.level} completo!`;
    $("levelUpText").textContent =
      `Você concluiu o nível ${state.level}. Respira, toma água (de preferência tratada 😄) e vamos para o próximo!`;

    saveProgress();
  }

  function showRetry(){
    state.retry = true;
    show("levelUp");
    $("bigBadge").textContent = "🔁";
    $("levelUpTitle").textContent = `Faltou pouco no nível ${state.level}`;
    $("levelUpText").textContent = `Você acertou ${state.levelRight} de ${QUESTIONS_PER_LEVEL}. Para avançar é preciso acertar pelo menos ${META}. Leia as explicações e tente de novo.`;
    $("btnNextLevel").textContent = "Repetir nível";
    saveProgress();
  }

  function goNextLevel(){
    if(state.retry){ state.retry = false; $("btnNextLevel").textContent = "Avançar de fase"; startLevel(state.level); return; }
    state.level += 1;
    state.levelRight = 0;
    state.idx = 0;
    state.questions = getLevelQuestions(state.level);
    saveProgress();
    show("quiz");
    renderQuestion();
  }

  function showFinal(){
    show("final");
    const name = state.name?.trim() || "Guardião(a)";
    $("finalTitle").textContent = `Parabéns, ${name}!`;
    $("finalText").textContent =
      "Você passou pelos 5 níveis e aprendeu (ou reforçou!) sobre o Pantanal e seus serviços ecossistêmicos.";

    $("finalScore").textContent = String(state.score);
    $("finalRight").textContent = String(state.right);
    $("finalWrong").textContent = String(state.wrong);

    const msg =
`🌿 Pantanal Quiz — resultado
Nome: ${name}
⭐ Pontos: ${state.score}
✅ Acertos: ${state.right}
❌ Erros: ${state.wrong}

Eu sou guardião(a) do Pantanal! 🐆💧
(Serviços ecossistêmicos = água, alimento, biodiversidade, clima e cultura.)`;

    $("shareText").value = msg;
    saveProgress();
  }

  // UI wiring
  $("btnStart").addEventListener("click", ()=>{
    state.name = $("playerName").value.trim();
    resetProgress();
    saveProgress();
    startLevel(1);
  });

  $("btnContinue").addEventListener("click", ()=>{
    const ok = loadProgress();
    if(!ok){ alert("Ainda não há progresso salvo. Clique em Começar 🙂"); return; }
    $("playerName").value = state.name||"";
    startLevel(state.level);
  });

  function startLevel(level){
    state.level = level;
    state.idx = 0;
    state.levelRight = 0;
    state.name = $("playerName").value.trim() || state.name || "";
    state.questions = getLevelQuestions(level);
    saveProgress();
    show("quiz");
    renderQuestion();
  }

  $("btnBack").addEventListener("click", ()=>{
    saveProgress();
    show("home");
    $("btnContinue").style.display = "inline-flex";
  });

  $("btnNext").addEventListener("click", next);
  $("btnNextLevel").addEventListener("click", goNextLevel);
  $("btnHome").addEventListener("click", ()=>{ show("home"); });
  $("btnRestart").addEventListener("click", ()=>{
    resetProgress();
    $("playerName").value = state.name || "";
    show("home");
  });

  $("btnCopy").addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText($("shareText").value);
      $("btnCopy").textContent = "Copiado ✅";
      setTimeout(()=>$("btnCopy").textContent="Copiar", 900);
    }catch(e){
      // fallback
      $("shareText").select();
      document.execCommand("copy");
      $("btnCopy").textContent = "Copiado ✅";
      setTimeout(()=>$("btnCopy").textContent="Copiar", 900);
    }
  });

  // help modal
  const helpModal = $("helpModal");
  $("btnHelp").addEventListener("click", ()=>helpModal.classList.remove("hidden"));
  $("btnCloseHelp").addEventListener("click", ()=>helpModal.classList.add("hidden"));
  helpModal.addEventListener("click", (e)=>{
    if(e.target === helpModal) helpModal.classList.add("hidden");
  });

  // initial state
  const hasProgress = loadProgress();
  $("btnContinue").style.display = hasProgress ? "inline-flex" : "none";
  $("playerName").value = state.name || "";
  show("home");

  // Confete desativado nesta versão de teste para evitar travamento.
  // O efeito original permanece no arquivo confetti.js, sem sobrescrita recursiva.
})();
