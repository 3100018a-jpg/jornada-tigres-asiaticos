/* Sons do jogo, sintetizados na hora com a Web Audio API (sem arquivos). */
(function () {
  var ctx = null, mestre = null, efeitos = null, ruidoBuf = null;
  var cfg = { efeitos: true };

  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      mestre = ctx.createGain(); mestre.gain.value = 0.9;
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      mestre.connect(comp); comp.connect(ctx.destination);
      efeitos = ctx.createGain(); efeitos.gain.value = cfg.efeitos ? 0.55 : 0; efeitos.connect(mestre);
      ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      var d = ruidoBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    } catch (e) { ctx = null; return false; }
  }

  function tom(freq, t0, dur, o) {
    o = o || {};
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.tipo || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.ate) osc.frequency.exponentialRampToValueAtTime(o.ate, t0 + dur);
    if (o.vibrato) {
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = o.vibrato; lg.gain.value = o.prof || 6;
      lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t0); lfo.stop(t0 + dur + 0.05);
    }
    var vol = o.vol === undefined ? 0.3 : o.vol, at = o.ataque || 0.008;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + at);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    var destino = o.destino || efeitos;
    if (o.filtro) {
      var f = ctx.createBiquadFilter(); f.type = o.filtro.tipo || 'lowpass'; f.frequency.value = o.filtro.freq; f.Q.value = o.filtro.q || 0.8;
      osc.connect(g); g.connect(f); f.connect(destino);
    } else { osc.connect(g); g.connect(destino); }
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function ruido(t0, dur, o) {
    o = o || {};
    var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = ruidoBuf;
    f.type = o.tipo || 'bandpass'; f.frequency.setValueAtTime(o.de || 800, t0);
    if (o.ate) f.frequency.exponentialRampToValueAtTime(o.ate, t0 + dur);
    f.Q.value = o.q || 1;
    var vol = o.vol || 0.25;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + (o.ataque || 0.02));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(o.destino || efeitos);
    src.start(t0); src.stop(t0 + dur + 0.05);
  }
  var N = function (n) { return 440 * Math.pow(2, (n - 69) / 12); }; // nota MIDI → Hz

  var SONS = {
    clique: function (t) { tom(N(84), t, 0.06, { tipo: 'square', vol: 0.08, filtro: { freq: 3000 } }); },
    selecionar: function (t) { tom(N(79), t, 0.05, { tipo: 'triangle', vol: 0.14 }); tom(N(86), t + 0.04, 0.07, { tipo: 'triangle', vol: 0.12 }); },
    correto: function (t) {
      [72, 76, 79, 84].forEach(function (n, i) { tom(N(n), t + i * 0.075, 0.28, { tipo: 'triangle', vol: 0.22 }); tom(N(n + 12), t + i * 0.075, 0.2, { tipo: 'sine', vol: 0.06 }); });
      for (var k = 0; k < 5; k++) tom(N(96 + (k % 3) * 3), t + 0.32 + k * 0.045, 0.1, { tipo: 'sine', vol: 0.05 });
    },
    errado: function (t) {
      tom(N(52), t, 0.22, { tipo: 'sawtooth', vol: 0.16, ate: N(47), filtro: { freq: 900 } });
      tom(N(47), t + 0.2, 0.34, { tipo: 'sawtooth', vol: 0.16, ate: N(40), filtro: { freq: 700 } });
    },
    moeda: function (t) { tom(N(83), t, 0.08, { tipo: 'square', vol: 0.09, filtro: { freq: 4000 } }); tom(N(88), t + 0.07, 0.22, { tipo: 'square', vol: 0.09, filtro: { freq: 4000 } }); },
    combo: function (t) {
      tom(N(67), t, 0.45, { tipo: 'sawtooth', vol: 0.08, ate: N(91), filtro: { freq: 2600 } });
      [84, 88, 91, 96].forEach(function (n, i) { tom(N(n), t + 0.3 + i * 0.06, 0.25, { tipo: 'triangle', vol: 0.12 }); });
    },
    dica: function (t) { [93, 91, 88, 86, 84, 81].forEach(function (n, i) { tom(N(n), t + i * 0.05, 0.3, { tipo: 'sine', vol: 0.09 }); }); },
    tique: function (t) { tom(1200, t, 0.04, { tipo: 'sine', vol: 0.12 }); ruido(t, 0.03, { de: 3000, q: 4, vol: 0.05 }); },
    tempo: function (t) { tom(150, t, 0.5, { tipo: 'square', vol: 0.12, filtro: { freq: 800 } }); tom(142, t, 0.5, { tipo: 'square', vol: 0.1, filtro: { freq: 800 } }); },
    whoosh: function (t) { ruido(t, 0.35, { tipo: 'bandpass', de: 400, ate: 2600, q: 0.9, vol: 0.12, ataque: 0.08 }); },
    rugido: function (t) {
      ruido(t, 1.1, { tipo: 'bandpass', de: 380, ate: 140, q: 1.4, vol: 0.32, ataque: 0.1 });
      tom(95, t, 1.05, { tipo: 'sawtooth', vol: 0.18, ate: 62, vibrato: 23, prof: 14, filtro: { freq: 520 }, ataque: 0.09 });
      tom(142, t + 0.05, 0.9, { tipo: 'sawtooth', vol: 0.08, ate: 90, vibrato: 29, prof: 10, filtro: { freq: 700 }, ataque: 0.1 });
    },
    vitoria: function (t) {
      var mel = [[67, 0], [72, 0.14], [76, 0.28], [79, 0.42], [76, 0.62], [79, 0.76], [84, 0.9]];
      mel.forEach(function (m, i) { tom(N(m[0]), t + m[1], i === mel.length - 1 ? 0.9 : 0.2, { tipo: 'triangle', vol: 0.2 }); });
      [48, 55, 60].forEach(function (n) { tom(N(n), t + 0.9, 0.9, { tipo: 'sine', vol: 0.12 }); });
      for (var k = 0; k < 8; k++) tom(N(96 + (k % 4) * 2), t + 1.0 + k * 0.05, 0.12, { tipo: 'sine', vol: 0.04 });
    },
    navio: function (t) {
      tom(110, t, 1.3, { tipo: 'sawtooth', vol: 0.16, vibrato: 5, prof: 1.5, filtro: { freq: 600 }, ataque: 0.12 });
      tom(165, t, 1.3, { tipo: 'sawtooth', vol: 0.1, vibrato: 5, prof: 2, filtro: { freq: 700 }, ataque: 0.12 });
    },
    conteiner: function (t) { tom(90, t, 0.25, { tipo: 'sine', vol: 0.3, ate: 50 }); ruido(t, 0.08, { de: 1800, q: 1, vol: 0.12 }); },
    insignia: function (t) { [76, 79, 83, 88, 91, 95].forEach(function (n, i) { tom(N(n), t + i * 0.06, 0.4, { tipo: 'triangle', vol: 0.12 }); tom(N(n + 7), t + i * 0.06, 0.3, { tipo: 'sine', vol: 0.05 }); }); },
    pop: function (t) { tom(N(79), t, 0.09, { tipo: 'sine', vol: 0.2, ate: N(91) }); },
    virar: function (t) { ruido(t, 0.12, { de: 1500, ate: 3500, q: 2, vol: 0.07 }); }
  };

  // efeitos marcantes abaixam a música por um instante, para serem bem ouvidos
  var FORTES = { correto: 1.1, errado: 1.1, combo: 1.3, vitoria: 2.2, insignia: 1.6, rugido: 1.4, tempo: 1.2, navio: 1.6 };
  function tocar(nome) {
    if (!cfg.efeitos) return;
    if (!iniciar()) return;
    var f = SONS[nome];
    if (f) try { f(ctx.currentTime + 0.01); } catch (e) { /* ignora */ }
    if (FORTES[nome] && window.Musica) window.Musica.abaixar(0.4, FORTES[nome]);
  }

  // a música de fundo fica em js/musica.js e usa este mesmo contexto de áudio
  function contexto() { return ctx; }
  function destino() { return mestre; }

  // pausa todo o som quando a aba fica escondida e retoma ao voltar
  var pausadoPorAba = false;
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) { if (ctx.state === 'running') { ctx.suspend(); pausadoPorAba = true; } }
    else if (pausadoPorAba) { ctx.resume(); pausadoPorAba = false; }
  });

  function ligarEfeitos(on) {
    cfg.efeitos = on;
    if (efeitos && ctx) efeitos.gain.setTargetAtTime(on ? 0.55 : 0, ctx.currentTime, 0.05);
  }

  window.Sons = { iniciar: iniciar, tocar: tocar, ligarEfeitos: ligarEfeitos, contexto: contexto, destino: destino, cfg: cfg };
})();
