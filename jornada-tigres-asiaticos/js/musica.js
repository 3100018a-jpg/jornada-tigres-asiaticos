/* =====================================================================
   JORNADA DOS TIGRES ASIÁTICOS — motor das músicas de fundo
   ---------------------------------------------------------------------
   As músicas são originais e tocadas "ao vivo" pelo navegador, com a
   Web Audio API. Nenhum arquivo de áudio é baixado.
   Instrumentos sintetizados aqui:
     • cordas pinçadas (guzheng, koto, gayageum, pipa, yangqin, sanshin,
       khim) — algoritmo de Karplus-Strong;
     • flautas de bambu (dizi, shakuhachi, daegeum, suling, fue) e erhu —
       osciladores com vibrato, deslizes e ruído de sopro ou de arco;
     • metais (sinos, gamelão, kulintang, ranat, gongos) — parciais somadas;
     • shō e cordas (acordes longos), piano elétrico, baixo suave,
       percussão leve e sons da natureza.
   As composições (30 faixas) ficam em js/musicas.js.
   ===================================================================== */
(function () {
  'use strict';

  var ctx = null;          // AudioContext (compartilhado com os efeitos de sons.js)
  var mix = null;          // soma das faixas e da reverberação
  var duck = null;         // abaixa a música enquanto toca um efeito
  var volume = null;       // volume escolhido e liga/desliga
  var revEntrada = null;   // entrada da reverberação compartilhada
  var ruidoBranco = null, ruidoRosa = null;
  var cacheCordas = {}, cacheAmb = {}, geracao = 0;

  /* ------------------------------------------------------------ utilidades */
  function semente(txt) { var h = 2166136261; for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function aleatorio(s) {
    var a = s >>> 0;
    return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  function acaso(a, b) { return a + Math.random() * (b - a); }

  // escalas de 5 notas (em cents a partir da tônica)
  var ESCALAS = {
    gong: [0, 200, 400, 700, 900],        // pentatônica chinesa (modo gong)
    zhi: [0, 200, 500, 700, 900],         // modo zhi; pyeongjo coreano; escala yo japonesa
    yu: [0, 300, 500, 700, 1000],         // pentatônica menor (modo yu)
    in: [0, 100, 500, 700, 800],          // escala in (miyako-bushi), do Japão
    ryukyu: [0, 400, 500, 700, 1100],     // escala de Okinawa
    slendro: [0, 231, 474, 717, 955],     // gamelão de Java e Bali
    tailandesa: [0, 171, 343, 686, 857],  // notas da escala tailandesa de 7 tons iguais
    kulintang: [0, 180, 380, 690, 880]    // afinação pentatônica de gongos das Filipinas
  };
  function centsGrau(esc, g) { var n = esc.length, o = Math.floor(g / n), i = g - o * n; return o * 1200 + esc[i]; }
  function grauHz(esc, tonica, g) { return hz(tonica) * Math.pow(2, centsGrau(esc, g) / 1200); }

  function ganho(v) { var g = ctx.createGain(); g.gain.value = v; return g; }
  function filtro(tipo, f, q) { var b = ctx.createBiquadFilter(); b.type = tipo; b.frequency.value = f; if (q != null) b.Q.value = q; return b; }
  function panner(p) { if (!ctx.createStereoPanner) return ganho(1); var s = ctx.createStereoPanner(); s.pan.value = Math.max(-1, Math.min(1, p || 0)); return s; }
  function osc(tipo, f) { var o = ctx.createOscillator(); o.type = tipo; o.frequency.value = f; return o; }

  // filtro biquad (receitas de R. Bristow-Johnson) para calcular amostras em JavaScript
  function biquad(tipo, f, q, sr) {
    var w = 2 * Math.PI * f / sr, cs = Math.cos(w), al = Math.sin(w) / (2 * q), b0, b1, b2, a0, a1, a2;
    if (tipo === 'lowpass') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; }
    else if (tipo === 'highpass') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; }
    else { b0 = al; b1 = 0; b2 = -al; }
    a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
    b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    return function (x) { var y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
  }

  /* --------------------------------------------------- ruídos e reverberação */
  function criarRuidos() {
    var sr = ctx.sampleRate, n = Math.floor(sr * 4), m = Math.floor(sr * 0.05), i;
    ruidoBranco = ctx.createBuffer(1, n, sr);
    var d = ruidoBranco.getChannelData(0);
    for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    ruidoRosa = ctx.createBuffer(1, n, sr);
    var p = ruidoRosa.getChannelData(0), extra = new Float32Array(m);
    var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (i = 0; i < n + m; i++) {
      var w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
      var v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      if (i < n) p[i] = v; else extra[i - n] = v;
    }
    for (i = 0; i < m; i++) { var x = i / m; p[i] = p[i] * x + extra[i] * (1 - x); } // emenda sem estalo
  }
  function criarReverb() {
    var sr = ctx.sampleRate, n = Math.floor(sr * 3.2), pre = Math.floor(sr * 0.02);
    var buf = ctx.createBuffer(2, n, sr);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), lp = 0;
      for (var i = pre; i < n; i++) {
        var t = (i - pre) / sr, a = 0.08 + 0.55 * Math.exp(-t / 0.9); // o som escurece com o tempo
        lp += a * ((Math.random() * 2 - 1) - lp);
        d[i] = lp * Math.exp(-t / 0.48);
      }
      var refl = [0.013, 0.021, 0.029, 0.041, 0.053, 0.067];
      for (var k = 0; k < refl.length; k++) { var j = pre + Math.floor(refl[k] * sr * (1 + ch * 0.09)); if (j < n) d[j] += (0.3 - k * 0.035) * (k % 2 ? -1 : 1); }
    }
    return buf;
  }
  function montarGrafo(destino, comVolume, semCompressor) {
    criarRuidos();
    mix = ganho(1);
    var hp = filtro('highpass', 40, 0.7);
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 2.2; comp.attack.value = 0.01; comp.release.value = 0.5;
    duck = ganho(1);
    volume = ganho(comVolume ? 0 : 1);
    var lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -6; lim.knee.value = 2; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.15;
    mix.connect(hp);
    if (semCompressor) hp.connect(duck); else { hp.connect(comp); comp.connect(lim); lim.connect(duck); }
    duck.connect(volume); volume.connect(destino);
    revEntrada = ganho(1);
    var conv = ctx.createConvolver(); conv.buffer = criarReverb();
    var revSaida = ganho(0.85);
    revEntrada.connect(conv); conv.connect(revSaida); revSaida.connect(mix);
  }
  function montar() {
    if (mix) return true;
    var S = window.Sons;
    if (!S || !S.iniciar || !S.iniciar() || !S.contexto) return false;
    ctx = S.contexto();
    if (!ctx) return false;
    try { montarGrafo(S.destino(), true); } catch (e) { mix = null; return false; }
    return true;
  }

  /* ------------------------------------------- cordas pinçadas (Karplus-Strong) */
  var CORDAS = {
    guzheng: { t60: 3.4, brilho: 0.6, pos: 0.13, dur: 3.0, lp: [1500, 6200], vol: 1 },
    koto: { t60: 2.3, brilho: 0.68, pos: 0.1, dur: 2.3, lp: [1700, 6800], vol: 1 },
    gayageum: { t60: 2.1, brilho: 0.42, pos: 0.2, dur: 2.2, lp: [1100, 4000], vol: 1.15 },
    pipa: { t60: 1.15, brilho: 0.62, pos: 0.08, dur: 1.2, lp: [2000, 7600], vol: 0.9 },
    yangqin: { t60: 2.6, brilho: 0.66, pos: 0.22, dur: 2.5, lp: [1900, 7200], vol: 0.85, par: 1.6, martelo: true },
    sanshin: { t60: 0.95, brilho: 0.65, pos: 0.07, dur: 1.0, lp: [2300, 7800], vol: 0.95 },
    khim: { t60: 2.3, brilho: 0.5, pos: 0.2, dur: 2.2, lp: [1400, 4800], vol: 0.9, par: 2.4, martelo: true }
  };
  function ks(y, f, sr, t60, p, rnd) {
    var P = sr / f, L = P - 0.5, Li = Math.floor(L), fr = L - Li;
    var dec = Math.pow(0.001, 1 / (t60 * f)), n = y.length, m = Math.min(n, Li + 2), i;
    var exc = new Float32Array(m), lp = 0, a = 0.12 + 0.85 * p.brilho;
    if (p.martelo) {
      var w = Math.max(2, Math.floor(P * 0.1));
      for (i = 0; i < m; i++) exc[i] = (i < w ? Math.sin(Math.PI * i / w) : 0) * 0.9 + (rnd() * 2 - 1) * 0.2;
    } else for (i = 0; i < m; i++) { lp += a * ((rnd() * 2 - 1) - lp); exc[i] = lp; }
    var kk = Math.max(1, Math.floor(p.pos * P)); // ponto onde a corda é tocada
    for (i = m - 1; i >= kk; i--) exc[i] -= exc[i - kk];
    var media = 0; for (i = 0; i < m; i++) media += exc[i]; media /= m;
    for (i = 0; i < m; i++) y[i] = exc[i] - media;
    for (i = m; i < n; i++) {
      var j = i - Li;
      var d0 = y[j] * (1 - fr) + y[j - 1] * fr, d1 = y[j - 1] * (1 - fr) + y[j - 2] * fr;
      y[i] = dec * 0.5 * (d0 + d1);
    }
  }
  function bufferCorda(tipo, f, variante) {
    var chave = tipo + '|' + f.toFixed(2) + '|' + variante, c = cacheCordas[chave];
    if (c) { c.uso = geracao; return c.buf; }
    var p = CORDAS[tipo], sr = ctx.sampleRate;
    var t60 = p.t60 * Math.pow(220 / f, 0.35);
    var dur = Math.min(4, Math.max(0.6, p.dur * Math.pow(220 / f, 0.25)));
    var n = Math.floor(sr * dur), buf = ctx.createBuffer(1, n, sr), y = buf.getChannelData(0), i;
    var rnd = aleatorio(semente(chave));
    ks(y, f, sr, t60, p, rnd);
    if (p.par) { // duas cordas por nota, levemente desafinadas (coro natural do saltério)
      var y2 = new Float32Array(n);
      ks(y2, f * Math.pow(2, p.par / 1200), sr, t60, p, rnd);
      for (i = 0; i < n; i++) y[i] = 0.5 * (y[i] + y2[i]);
    }
    var pico = 0; for (i = 0; i < n; i++) { var a = Math.abs(y[i]); if (a > pico) pico = a; }
    var k = pico > 0 ? 0.8 / pico : 1, fade = Math.floor(n * 0.08);
    for (i = 0; i < n; i++) { y[i] *= k; if (i > n - fade) y[i] *= (n - i) / fade; }
    cacheCordas[chave] = { buf: buf, uso: geracao };
    return buf;
  }
  function limparCache() {
    Object.keys(cacheCordas).forEach(function (k) { if (cacheCordas[k].uso < geracao - 1) delete cacheCordas[k]; });
  }
  function corda(dest, tipo, f, t, vel, o) {
    o = o || {};
    t = Math.max(t, ctx.currentTime);
    var p = CORDAS[tipo], b = bufferCorda(tipo, f, (Math.random() * 2) | 0);
    var src = ctx.createBufferSource(); src.buffer = b;
    var g = ganho(vel * 0.5 * p.vol * (o.vol || 1));
    src.connect(g); g.connect(dest);
    var r = src.playbackRate, fim = t + b.duration;
    if (o.de) { r.setValueAtTime(o.de, t); r.linearRampToValueAtTime(1, t + (o.deDur || 0.11)); }
    if (o.dobra) { // pressiona a corda depois de tocar (oshide) e solta
      var alto = Math.pow(2, o.dobra.cents / 1200), t1 = t + o.dobra.em;
      r.setValueAtTime(1, t1); r.linearRampToValueAtTime(alto, t1 + 0.16);
      if (o.dobra.volta && o.dobra.volta > o.dobra.em + 0.2) { r.setValueAtTime(alto, t + o.dobra.volta); r.linearRampToValueAtTime(1, t + o.dobra.volta + 0.2); }
    }
    if (o.vibrato) {
      var ini = o.vibrato.ini || 0.25, lfo = osc('sine', o.vibrato.hz || 5), lg = ganho(0);
      lg.gain.setValueAtTime(0, t); lg.gain.setValueAtTime(0, t + ini);
      lg.gain.linearRampToValueAtTime(o.vibrato.prof || 0.012, t + ini + 0.4);
      lfo.connect(lg); lg.connect(r); lfo.start(t); lfo.stop(fim);
    }
    if (o.abafar) {
      var ta = t + o.abafar;
      g.gain.setValueAtTime(g.gain.value, ta); g.gain.exponentialRampToValueAtTime(0.0001, ta + 0.1);
      fim = Math.min(fim, ta + 0.12);
    }
    src.start(t); src.stop(fim + 0.02);
  }

  /* ------------------------------------------------------- flautas e erhu */
  var SOPROS = {
    dizi: { h: [[1, 1, 'sine'], [2, 0.18, 'sine'], [3, 0.05, 'sine']], sopro: 0.05, vib: [5.6, 13], at: 0.05, lp: 7, vol: 0.85 },
    shakuhachi: { h: [[1, 1, 'sine'], [1, 0.25, 'triangle'], [2, 0.04, 'sine']], sopro: 0.11, vib: [4.6, 9], at: 0.12, lp: 4, vol: 1, meri: true },
    daegeum: { h: [[1, 1, 'sine'], [2, 0.24, 'sine'], [3, 0.07, 'sine'], [1, 0.1, 'triangle']], sopro: 0.06, vib: [4.1, 28], at: 0.09, lp: 6, vol: 0.85 },
    suling: { h: [[1, 1, 'sine'], [2, 0.07, 'sine']], sopro: 0.06, vib: [6.2, 10], at: 0.06, lp: 6, vol: 0.9 },
    fue: { h: [[1, 1, 'sine'], [2, 0.12, 'sine'], [3, 0.03, 'sine']], sopro: 0.05, vib: [6, 11], at: 0.03, lp: 8, vol: 0.8 }
  };
  function sopro(dest, tipo, f, t, dur, vel, o) {
    o = o || {};
    t = Math.max(t, ctx.currentTime);
    var p = SOPROS[tipo], solta = o.solta || 0.22, fim = t + dur + solta;
    var saida = ganho(0.0001), lp = filtro('lowpass', Math.min(9000, f * p.lp), 0.3);
    lp.connect(saida); saida.connect(dest);
    var vib = osc('sine', p.vib[0] * acaso(0.93, 1.07)), vg = ganho(0), vi = t + Math.min(0.35, dur * 0.45);
    vg.gain.setValueAtTime(0, t); vg.gain.setValueAtTime(0, vi);
    vg.gain.linearRampToValueAtTime(p.vib[1] * (o.vib == null ? 1 : o.vib), vi + Math.min(0.6, Math.max(0.1, dur * 0.5)));
    vib.connect(vg);
    var de = o.de || f * (o.reto ? 1 : 0.982), tau = o.de ? 0.05 : 0.025;
    for (var k = 0; k < p.h.length; k++) {
      var h = p.h[k], ok = osc(h[2], de * h[0]);
      ok.frequency.setValueAtTime(de * h[0], t);
      ok.frequency.setTargetAtTime(f * h[0], t + 0.004, tau);
      if (p.meri && dur > 1.2) ok.frequency.setTargetAtTime(f * h[0] * 0.978, t + dur * 0.78, 0.18); // "meri": a nota cai no fim
      vg.connect(ok.detune);
      var hg = ganho(h[1]); ok.connect(hg); hg.connect(lp);
      ok.start(t); ok.stop(fim + 0.05);
    }
    vib.start(t); vib.stop(fim + 0.05);
    // sopro: ruído que acompanha a nota (mais forte no ataque)
    var nz = ctx.createBufferSource(); nz.buffer = ruidoBranco; nz.loop = true;
    var bp = filtro('bandpass', Math.min(6500, f * 2.3), 0.8), ng = ganho(0.0001), nv = p.sopro * vel * (o.vol || 1);
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.linearRampToValueAtTime(nv * (o.de ? 0.5 : 1.6), t + 0.035);
    ng.gain.setTargetAtTime(nv * 0.5, t + 0.05, 0.08);
    ng.gain.setTargetAtTime(0.0001, t + dur, solta / 3);
    nz.connect(bp); bp.connect(ng); ng.connect(dest);
    nz.start(t, Math.random() * 3); nz.stop(fim + 0.05);
    var pico = vel * 0.3 * p.vol * (o.vol || 1), at = p.at * (o.de ? 0.5 : 1);
    saida.gain.setValueAtTime(0.0001, t);
    saida.gain.exponentialRampToValueAtTime(pico, t + at);
    saida.gain.setTargetAtTime(pico * 0.8, t + at, Math.max(0.2, dur * 0.6));
    saida.gain.setTargetAtTime(0.0001, t + Math.max(dur, at + 0.01), solta / 3);
  }
  function erhu(dest, f, t, dur, vel, o) {
    o = o || {};
    t = Math.max(t, ctx.currentTime);
    var solta = o.solta || 0.28, fim = t + dur + solta;
    var saida = ganho(0.0001);
    var lp = filtro('lowpass', o.suave ? 1900 : 2500, 0.6), pk = filtro('peaking', 950, 1.3), pk2 = filtro('peaking', 2700, 1.5), hp = filtro('highpass', 170, 0.7);
    pk.gain.value = 5; pk2.gain.value = 2.5;
    lp.connect(pk); pk.connect(pk2); pk2.connect(hp); hp.connect(saida); saida.connect(dest);
    var de = o.de || f * 0.965, tau = o.de ? 0.07 : 0.03;
    var vib = osc('sine', acaso(5, 5.8)), vg = ganho(0), vi = t + Math.min(0.3, dur * 0.4);
    vg.gain.setValueAtTime(0, t); vg.gain.setValueAtTime(0, vi);
    vg.gain.linearRampToValueAtTime((o.vib == null ? 1 : o.vib) * 20, vi + 0.4);
    vib.connect(vg);
    [['sawtooth', 1, 0.55], ['triangle', 1, 0.5], ['sawtooth', 1.003, 0.25]].forEach(function (s) {
      var ok = osc(s[0], de * s[1]);
      ok.frequency.setValueAtTime(de * s[1], t); ok.frequency.setTargetAtTime(f * s[1], t + 0.004, tau);
      vg.connect(ok.detune);
      var g = ganho(s[2]); ok.connect(g); g.connect(lp);
      ok.start(t); ok.stop(fim + 0.05);
    });
    vib.start(t); vib.stop(fim + 0.05);
    var nz = ctx.createBufferSource(); nz.buffer = ruidoBranco; nz.loop = true; // o arco
    var bp = filtro('bandpass', 2800, 0.7), ng = ganho(0.0001);
    ng.gain.setValueAtTime(0.0001, t); ng.gain.linearRampToValueAtTime(0.012 * vel, t + 0.06);
    ng.gain.setTargetAtTime(0.005 * vel, t + 0.1, 0.1); ng.gain.setTargetAtTime(0.0001, t + dur, 0.08);
    nz.connect(bp); bp.connect(ng); ng.connect(dest);
    nz.start(t, Math.random() * 3); nz.stop(fim + 0.05);
    var pico = vel * 0.13 * (o.vol || 1), at = o.de ? 0.06 : 0.14;
    saida.gain.setValueAtTime(0.0001, t);
    saida.gain.exponentialRampToValueAtTime(pico * 0.85, t + at);
    saida.gain.linearRampToValueAtTime(pico, t + Math.max(at + 0.05, dur * 0.55));
    saida.gain.setTargetAtTime(0.0001, t + Math.max(dur, at + 0.06), solta / 3);
  }

  /* ----------------------------------------- metais: sinos, gamelão, gongos */
  // p: [razão da frequência, ganho, t60 em segundos, desvio em Hz (batimento)]
  var METAIS = {
    celesta: { p: [[1, 1, 1.5], [2, 0.05, 0.7], [4.07, 0.07, 0.22]], vol: 0.22, clique: 5200 },
    sino: { p: [[1, 1, 2.2], [2.76, 0.22, 0.9], [5.4, 0.08, 0.4]], vol: 0.18, clique: 4200 },
    templo: { p: [[0.5, 0.6, 7], [1, 1, 6, 0.5], [1.19, 0.4, 4], [1.5, 0.28, 3.4], [2, 0.3, 3], [2.66, 0.12, 2]], vol: 0.15, at: 0.004 },
    saron: { p: [[1, 0.6, 2.6], [1, 0.5, 2.6, 3.2], [2.76, 0.15, 0.7], [5.4, 0.05, 0.22]], vol: 0.2, clique: 2800 },
    gender: { p: [[1, 0.6, 4.2], [1, 0.5, 4.2, 2.3], [2.72, 0.06, 1.1]], vol: 0.2, at: 0.006 },
    gangsa: { p: [[1, 0.6, 1.6], [1, 0.55, 1.6, 6], [2.76, 0.18, 0.5], [5.4, 0.06, 0.18]], vol: 0.16, clique: 3600 },
    jegogan: { p: [[1, 0.6, 3], [1, 0.5, 3, 1.8], [2.72, 0.06, 0.8]], vol: 0.24, at: 0.008 },
    bonang: { p: [[1, 1, 1.4], [1.51, 0.14, 0.55], [2.02, 0.06, 0.3]], vol: 0.18, clique: 2400, queda: 0.004 },
    kenong: { p: [[1, 1, 3], [1, 0.4, 3, 1.1], [2.01, 0.12, 1.3]], vol: 0.18, at: 0.008, queda: 0.003 },
    kempul: { p: [[1, 1, 4.2], [1, 0.5, 4.2, 0.9], [2.02, 0.28, 2], [2.98, 0.1, 1.3]], vol: 0.2, at: 0.015, queda: 0.006 },
    gong: { p: [[1, 1, 8], [1, 0.6, 8, 0.7], [1.47, 0.3, 5], [2.04, 0.2, 3.6], [2.82, 0.1, 2.6]], vol: 0.32, at: 0.03, queda: 0.012 },
    jing: { p: [[1, 1, 5.5], [1, 0.6, 5.5, 0.8], [1.52, 0.25, 2.8], [2.1, 0.2, 2]], vol: 0.2, at: 0.04, queda: 0.01 },
    ranat: { p: [[1, 1, 0.5], [3.93, 0.22, 0.09]], vol: 0.26, clique: 3400 },
    kulintang: { p: [[1, 1, 1.2], [1, 0.3, 1.2, 1.6], [1.52, 0.16, 0.42], [2.36, 0.05, 0.2]], vol: 0.2, clique: 2600, queda: 0.006 },
    agung: { p: [[1, 1, 3], [2.08, 0.26, 1.1], [3.1, 0.07, 0.5]], vol: 0.28, at: 0.012, queda: 0.01 },
    furin: { p: [[1, 1, 2.2], [2.76, 0.26, 0.9], [5.2, 0.1, 0.4]], vol: 0.06, clique: 7500 },
    tigela: { p: [[1, 1, 11], [1, 0.7, 11, 0.6], [2.71, 0.4, 7], [2.71, 0.25, 7, 1.1], [5.12, 0.1, 3.5]], vol: 0.1, at: 0.02 },
    ching: { p: [[1, 1, 1.2], [1.48, 0.7, 0.9], [2.31, 0.45, 0.6], [3.2, 0.2, 0.35]], vol: 0.045, clique: 6000 },
    babandir: { p: [[1, 1, 0.28], [1.61, 0.4, 0.16], [2.3, 0.2, 0.1]], vol: 0.1, clique: 4000 }
  };
  // cada batida é calculada uma vez por nota (parciais somadas) e guardada: tocar custa quase nada
  function bufferMetal(tipo, f) {
    var chave = 'm|' + tipo + '|' + f.toFixed(2), c = cacheCordas[chave];
    if (c) { c.uso = geracao; return c.buf; }
    var p = METAIS[tipo], sr = ctx.sampleRate, at = p.at || 0.002, dur = 0, k, i;
    for (k = 0; k < p.p.length; k++) dur = Math.max(dur, at + p.p[k][2] * 1.05);
    dur = Math.min(dur, 9);
    var n = Math.floor(sr * dur), buf = ctx.createBuffer(1, n, sr), y = buf.getChannelData(0);
    for (k = 0; k < p.p.length; k++) {
      var q = p.p[k], fq = f * q[0] + (q[3] || 0);
      if (fq > sr * 0.45) continue;
      var tau = q[2] / 6.9, ph = Math.random() * 6.283, fim2 = Math.min(n, Math.floor(sr * (at + q[2] * 1.05)));
      for (i = 0; i < fim2; i++) {
        var t = i / sr, env = t < at ? q[1] * t / at : q[1] * Math.exp(-(t - at) / tau);
        var fi = p.queda ? fq * (1 - p.queda * (1 - Math.exp(-Math.max(0, t - 0.02) / 0.8))) : fq;
        ph += 6.283185307 * fi / sr;
        y[i] += Math.sin(ph) * env;
      }
    }
    if (p.clique) { // batida da baqueta: ruído curto filtrado
      var bq = biquad('bandpass', p.clique, 1.2, sr), L = Math.floor(sr * 0.05);
      for (i = 0; i < L && i < n; i++) y[i] += bq((Math.random() * 2 - 1)) * 0.35 * Math.exp(-i / (sr * 0.006));
    }
    var fade = Math.min(n, Math.floor(sr * 0.05));
    for (i = n - fade; i < n; i++) y[i] *= (n - i) / fade;
    cacheCordas[chave] = { buf: buf, uso: geracao };
    return buf;
  }
  function metal(dest, tipo, f, t, vel, o) {
    o = o || {};
    t = Math.max(t, ctx.currentTime);
    var p = METAIS[tipo], b = bufferMetal(tipo, f), src = ctx.createBufferSource(), g = ganho(vel * p.vol * (o.vol || 1));
    src.buffer = b; src.connect(g); g.connect(dest);
    var fim = t + b.duration;
    if (o.curto) { g.gain.setValueAtTime(g.gain.value, t + 0.15); g.gain.setTargetAtTime(0, t + 0.15, 0.08); fim = Math.min(fim, t + 0.8); }
    src.start(t); src.stop(fim + 0.02);
  }

  /* ----------------------------------------------- piano elétrico, pads, baixo */
  function ep(dest, f, t, vel, o) {
    o = o || {};
    t = Math.max(t, ctx.currentTime);
    var dur = Math.min(3, 2.4 * Math.pow(261 / f, 0.3)), fim = t + dur;
    var car = osc('sine', f), mod = osc('sine', f), mg = ganho(0), amp = ganho(0);
    mg.gain.setValueAtTime(f * 1.5 * vel, t); mg.gain.setTargetAtTime(f * 0.22, t + 0.002, 0.25);
    mod.connect(mg); mg.connect(car.frequency);
    var h = osc('sine', f * 2), hg = ganho(0);
    hg.gain.setValueAtTime(0, t); hg.gain.linearRampToValueAtTime(0.12, t + 0.003); hg.gain.setTargetAtTime(0, t + 0.003, 0.15);
    h.connect(hg); hg.connect(amp);
    amp.gain.setValueAtTime(0, t); amp.gain.linearRampToValueAtTime(vel * 0.2 * (o.vol || 1), t + 0.004);
    amp.gain.setTargetAtTime(0, t + 0.004, dur / 5);
    car.connect(amp); amp.connect(dest);
    if (o.abafar && o.abafar < dur) { amp.gain.setTargetAtTime(0, t + o.abafar, 0.08); fim = Math.min(fim, t + o.abafar + 0.5); }
    [car, mod, h].forEach(function (x) { x.start(t); x.stop(fim + 0.05); });
  }
  function pad(dest, tipo, fs, t, dur, vel, o) {
    o = o || {};
    t = Math.max(t, ctx.currentTime);
    var sho = tipo === 'sho', at = o.ataque || (sho ? 1.2 : 1.5), solta = o.solta || 2, fim = t + Math.max(dur, at) + solta;
    var lp = filtro('lowpass', sho ? 3000 : 1300, 0.4), saida = ganho(0), trem = ganho(1);
    lp.connect(saida); saida.connect(trem); trem.connect(dest);
    var pico = vel * (sho ? 0.075 : 0.06) * (o.vol || 1) / Math.sqrt(fs.length);
    saida.gain.setValueAtTime(0, t); saida.gain.linearRampToValueAtTime(pico, t + at);
    if (dur > at) saida.gain.setValueAtTime(pico, t + dur);
    saida.gain.setTargetAtTime(0, t + Math.max(dur, at), solta / 4);
    var partes = sho ? [['sine', 1, 1], ['triangle', 1, 0.3], ['sine', 2, 0.1], ['sine', 3, 0.035]] : [['sawtooth', 1, 0.5, 7], ['sawtooth', 1, 0.5, -7], ['triangle', 0.5, 0.3]];
    fs.forEach(function (f) {
      partes.forEach(function (q) {
        var ok = osc(q[0], f * q[1]); if (q[3]) ok.detune.value = q[3];
        var g = ganho(q[2]); ok.connect(g); g.connect(lp);
        ok.start(t); ok.stop(fim + 0.1);
      });
    });
    if (sho) { // o shō "respira": o som cresce e diminui devagar
      var lfo = osc('sine', acaso(0.1, 0.18)), lg = ganho(0.15);
      lfo.connect(lg); lg.connect(trem.gain); lfo.start(t); lfo.stop(fim + 0.1);
    }
  }
  function baixo(dest, f, t, dur, vel) {
    t = Math.max(t, ctx.currentTime);
    var ok = osc('sine', f), ok2 = osc('triangle', f), g2 = ganho(0.25), lp = filtro('lowpass', 420, 0.5), a = ganho(0), fim = t + dur + 0.3;
    ok.connect(lp); ok2.connect(g2); g2.connect(lp); lp.connect(a); a.connect(dest);
    var pico = vel * 0.35;
    a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(pico, t + 0.02);
    a.gain.setTargetAtTime(pico * 0.55, t + 0.02, 0.25); a.gain.setTargetAtTime(0, t + dur, 0.07);
    [ok, ok2].forEach(function (x) { x.start(t); x.stop(fim); });
  }

  /* ------------------------------------------------------- percussão suave */
  function tomP(dest, t, f0, f1, tq, tau, pico, tipo) {
    t = Math.max(t, ctx.currentTime);
    var ok = osc(tipo || 'sine', f0), g = ganho(0);
    ok.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) ok.frequency.exponentialRampToValueAtTime(f1, t + tq);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pico, t + 0.002); g.gain.setTargetAtTime(0, t + 0.002, tau);
    ok.connect(g); g.connect(dest); ok.start(t); ok.stop(t + 0.01 + tau * 7);
  }
  function ruidoP(dest, t, tipo, f, q, tau, pico, ataque) {
    t = Math.max(t, ctx.currentTime);
    var nz = ctx.createBufferSource(); nz.buffer = ruidoBranco;
    var fl = filtro(tipo, f, q), g = ganho(0), at = ataque || 0.001;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pico, t + at); g.gain.setTargetAtTime(0, t + at, tau);
    nz.connect(fl); fl.connect(g); g.connect(dest); nz.start(t, Math.random() * 3); nz.stop(t + at + tau * 7 + 0.01);
  }
  // cada instrumento: lista de partes [tipo, ...]. 'tom' = [f0, f1, tempo da queda, tau, pico, onda, atraso];
  // 'ruido' = [filtro, freq, Q, tau, pico, ataque, atraso]
  var PERC = {
    taiko: [['tom', 118, 64, 0.2, 0.2, 0.6], ['ruido', 'lowpass', 700, 0.7, 0.035, 0.25]],
    ka: [['tom', 1900, 1750, 0.02, 0.012, 0.1], ['ruido', 'bandpass', 3500, 1.5, 0.008, 0.07]],
    bloco: [['tom', 1060, 990, 0.04, 0.022, 0.24], ['tom', 2650, 2650, 0, 0.008, 0.06, 'tri'], ['ruido', 'bandpass', 3000, 2, 0.004, 0.1]],
    mokugyo: [['tom', 520, 505, 0.05, 0.04, 0.3], ['tom', 1320, 1320, 0, 0.015, 0.07], ['ruido', 'lowpass', 2000, 0.7, 0.005, 0.08]],
    kung: [['tom', 145, 104, 0.12, 0.1, 0.42], ['ruido', 'lowpass', 500, 0.7, 0.02, 0.1]],
    deok: [['ruido', 'bandpass', 2200, 1.2, 0.02, 0.3], ['tom', 430, 400, 0.03, 0.022, 0.12]],
    buk: [['tom', 104, 72, 0.15, 0.13, 0.52], ['ruido', 'lowpass', 800, 0.7, 0.025, 0.15]],
    dhe: [['tom', 100, 84, 0.1, 0.1, 0.42], ['ruido', 'lowpass', 600, 0.7, 0.02, 0.1]],
    tak: [['ruido', 'bandpass', 3200, 2, 0.012, 0.26], ['tom', 660, 620, 0.02, 0.012, 0.08]],
    tung: [['tom', 225, 205, 0.06, 0.06, 0.3]],
    dabakan: [['tom', 178, 150, 0.08, 0.07, 0.33], ['ruido', 'bandpass', 1600, 1, 0.01, 0.1]],
    kethuk: [['tom', 340, 330, 0.05, 0.05, 0.22], ['ruido', 'bandpass', 1400, 1.5, 0.006, 0.06]],
    chocalho: [['ruido', 'highpass', 5500, 0.7, 0.028, 0.07, 0.012]],
    sanba: [0, 0.028, 0.056].reduce(function (a, d, k) { return a.concat([['tom', 2250, 2200, 0.01, 0.006, 0.1 - k * 0.02, 'sin', d], ['ruido', 'bandpass', 3100, 2, 0.004, 0.06, 0.001, d]]); }, []),
    chap: [['ruido', 'bandpass', 5000, 1, 0.02, 0.12]],
    pratos: [['ruido', 'bandpass', 6500, 0.6, 0.08, 0.06]]
  };
  function bufferPerc(tipo, variante) {
    var chave = 'p|' + tipo + '|' + variante, c = cacheAmb[chave];
    if (c) return c;
    var partes = PERC[tipo], sr = ctx.sampleRate, dur = 0, k, i;
    partes.forEach(function (q) { var tau = q[0] === 'tom' ? q[4] : q[4], atraso = (q[0] === 'tom' ? q[7] : q[7]) || 0; dur = Math.max(dur, atraso + tau * 7 + 0.01); });
    var n = Math.floor(sr * dur), buf = ctx.createBuffer(1, n, sr), y = buf.getChannelData(0);
    var jit = 1 + (variante - 1) * 0.025; // pequenas diferenças entre as batidas
    for (k = 0; k < partes.length; k++) {
      var q = partes[k];
      if (q[0] === 'tom') {
        var f0 = q[1] * jit, f1 = q[2] * jit, tq = q[3], tau = q[4], pico = q[5], tri = q[6] === 'tri', ini = Math.floor(sr * (q[7] || 0)), ph = 0;
        for (i = ini; i < n; i++) {
          var t = (i - ini) / sr, env = t < 0.002 ? pico * t / 0.002 : pico * Math.exp(-(t - 0.002) / tau);
          if (env < 1e-5 && t > 0.01) break;
          var f = tq > 0 && f1 !== f0 ? f0 * Math.pow(f1 / f0, Math.min(1, t / tq)) : f0;
          ph += 6.283185307 * f / sr;
          y[i] += (tri ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph)) * env;
        }
      } else {
        var bq = biquad(q[1], q[2] * jit, q[3], sr), tau2 = q[4], pico2 = q[5], at = q[6] || 0.001, ini2 = Math.floor(sr * (q[7] || 0));
        for (i = ini2; i < n; i++) {
          var t2 = (i - ini2) / sr, env2 = t2 < at ? pico2 * t2 / at : pico2 * Math.exp(-(t2 - at) / tau2);
          y[i] += bq(Math.random() * 2 - 1) * env2;
        }
      }
    }
    cacheAmb[chave] = buf;
    return buf;
  }
  function tocarPerc(dest, tipo, t, vel) {
    t = Math.max(t, ctx.currentTime);
    var b = bufferPerc(tipo, (Math.random() * 3) | 0), src = ctx.createBufferSource(), g = ganho(vel * (CAL[tipo] || 1));
    src.buffer = b; src.connect(g); g.connect(dest); src.start(t);
  }
  var FREQ_PERC = { ching: 3300, babandir: 980 };

  /* ------------------------------------------------------- sons da natureza */
  function bufferAmb(nome, gerar) { if (!cacheAmb[nome]) cacheAmb[nome] = gerar(); return cacheAmb[nome]; }
  function laco(buf, dest, nivel, filtroLp) {
    var s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    var g = ganho(nivel);
    if (filtroLp) { var lp = filtro('lowpass', filtroLp, 0.4); s.connect(lp); lp.connect(g); } else s.connect(g);
    g.connect(dest);
    return s;
  }
  function coaxar(dest, t, f, pulsos, pan, v) { // sapo
    var pn = panner(pan); pn.connect(dest);
    var rate = acaso(17, 24);
    for (var k = 0; k < pulsos; k++) {
      var tk = t + k / rate, ok = osc('triangle', f), g = ganho(0), lp = filtro('lowpass', f * 3, 0.8);
      ok.frequency.setValueAtTime(f * 1.04, tk); ok.frequency.exponentialRampToValueAtTime(f * 0.94, tk + 0.03);
      g.gain.setValueAtTime(0, tk); g.gain.linearRampToValueAtTime(0.05 * v, tk + 0.004); g.gain.setTargetAtTime(0, tk + 0.006, 0.01);
      ok.connect(lp); lp.connect(g); g.connect(pn); ok.start(tk); ok.stop(tk + 0.08);
    }
  }
  function bambuFonte(dest, t) { // shishi-odoshi: a água enche o bambu, que bate na pedra
    ruidoP(dest, t - 0.7, 'bandpass', 1800, 1.5, 0.2, 0.02, 0.45);
    tomP(dest, t, 330, 300, 0.05, 0.05, 0.35);
    tomP(dest, t, 820, 800, 0.02, 0.02, 0.12);
    ruidoP(dest, t, 'bandpass', 1300, 2, 0.01, 0.12);
    tomP(dest, t + 0.32, 340, 310, 0.05, 0.04, 0.14);
  }
  var AMBIENTES = {
    ondas: function (F, dest) {
      var fontes = [];
      [[-0.6, 9.5, 460], [0.6, 12.7, 620]].forEach(function (c) {
        var s = ctx.createBufferSource(); s.buffer = ruidoRosa; s.loop = true;
        var lp = filtro('lowpass', c[2], 0.3), g = ganho(0.18), pn = panner(c[0]);
        var lfo = osc('sine', 1 / c[1]), lf = ganho(c[2] * 0.5), lg = ganho(0.15);
        lfo.connect(lf); lf.connect(lp.frequency); lfo.connect(lg); lg.connect(g.gain);
        s.connect(lp); lp.connect(g); g.connect(pn); pn.connect(dest);
        fontes.push(s, lfo);
      });
      return { fontes: fontes };
    },
    vento: function (F, dest) {
      var fontes = [], partes = [];
      [[-0.4, 380], [0.45, 620]].forEach(function (c) {
        var s = ctx.createBufferSource(); s.buffer = ruidoRosa; s.loop = true;
        var bp = filtro('bandpass', c[1], 1.6), g = ganho(0.4), pn = panner(c[0]);
        s.connect(bp); bp.connect(g); g.connect(pn); pn.connect(dest);
        fontes.push(s); partes.push([bp, g]);
      });
      return {
        fontes: fontes,
        compasso: function (t, dur) { partes.forEach(function (x) { x[0].frequency.setTargetAtTime(acaso(260, 900), t, dur * 0.6); x[1].gain.setTargetAtTime(acaso(0.16, 0.65), t, dur * 0.5); }); }
      };
    },
    chuva: function (F, dest) {
      var buf = bufferAmb('chuva', function () {
        var sr = ctx.sampleRate, n = sr * 6, b = ctx.createBuffer(2, n, sr);
        for (var ch = 0; ch < 2; ch++) {
          var d = b.getChannelData(ch), lp = 0, lp2 = 0, i, k;
          for (i = 0; i < n; i++) { var w = Math.random() * 2 - 1; lp += 0.45 * (w - lp); lp2 += 0.02 * (lp - lp2); d[i] = (lp - lp2) * 0.12; }
          for (k = 0; k < 330; k++) { // pingos miúdos
            var p0 = Math.floor(Math.random() * n), a = Math.pow(Math.random(), 3) * 0.45 + 0.02, len = Math.floor(sr * acaso(0.002, 0.006));
            for (i = 0; i < len; i++) d[(p0 + i) % n] += (Math.random() * 2 - 1) * a * Math.exp(-i / (len * 0.3));
          }
          for (k = 0; k < 8; k++) { // gotas maiores
            var q0 = Math.floor(Math.random() * n), fq = acaso(1400, 3200), L2 = Math.floor(sr * 0.05);
            for (i = 0; i < L2; i++) { var tt = i / sr; d[(q0 + i) % n] += Math.sin(2 * Math.PI * fq * (1 + 2 * tt) * tt) * 0.12 * Math.exp(-tt / 0.012); }
          }
        }
        return b;
      });
      return { fontes: [laco(buf, dest, 0.6, 5200)] };
    },
    agua: function (F, dest) {
      var buf = bufferAmb('agua', function () {
        var sr = ctx.sampleRate, n = sr * 7, b = ctx.createBuffer(2, n, sr);
        for (var ch = 0; ch < 2; ch++) {
          var d = b.getChannelData(ch), a = 0, c = 0, i;
          for (i = 0; i < n; i++) { var w = Math.random() * 2 - 1; a += 0.22 * (w - a); c += 0.03 * (a - c); d[i] = (a - c) * 0.1; }
          for (var k = 0; k < 77; k++) { // bolhas
            var p0 = Math.floor(Math.random() * n), f0 = acaso(450, 2100), L = Math.floor(sr * acaso(0.018, 0.05)), amp = acaso(0.04, 0.16), ph = 0;
            for (i = 0; i < L; i++) { var x = i / L; ph += 2 * Math.PI * f0 * (1 + 0.8 * x) / sr; d[(p0 + i) % n] += Math.sin(ph) * amp * Math.min(1, x * 12) * Math.exp(-x * 4); }
          }
        }
        return b;
      });
      return { fontes: [laco(buf, dest, 1.0, 4500)] };
    },
    grilos: function (F, dest) {
      var buf = bufferAmb('grilos', function () {
        var sr = ctx.sampleRate, n = sr * 5, b = ctx.createBuffer(2, n, sr);
        [[0, 4700, 0.625, 4, 0.18], [1, 4250, 1.25, 3, 0.15], [0, 5150, 2.5, 5, 0.07], [1, 5150, 2.5, 5, 0.07]].forEach(function (gq, idx) {
          var d = b.getChannelData(gq[0]), per = gq[2], off = (idx * 0.37) % per;
          for (var tc = off; tc < 5; tc += per) {
            for (var p = 0; p < gq[3]; p++) {
              var s0 = Math.floor((tc + p * 0.024) * sr), L = Math.floor(0.013 * sr);
              for (var i = 0; i < L; i++) d[(s0 + i) % n] += Math.sin(2 * Math.PI * gq[1] * i / sr) * Math.sin(Math.PI * i / L) * gq[4];
            }
          }
        });
        return b;
      });
      return { fontes: [laco(buf, dest, 0.5)] };
    },
    sapos: function (F, dest) {
      return { compasso: function (t, dur) {
        var n = Math.floor(dur / 2.8 + Math.random());
        for (var k = 0; k < n; k++) coaxar(dest, t + Math.random() * dur, acaso(260, 420), Math.floor(acaso(4, 9)), acaso(-0.8, 0.8), acaso(0.4, 1));
      } };
    },
    passaros: function (F, dest) {
      return { compasso: function (t, dur) {
        if (Math.random() > Math.min(0.8, dur / 7)) return;
        var t0 = t + Math.random() * dur * 0.7, notas = Math.floor(acaso(3, 7)), f0 = acaso(2600, 4200), pn = panner(acaso(-0.8, 0.8));
        pn.connect(dest);
        for (var k = 0; k < notas; k++) {
          var tk = t0 + k * acaso(0.07, 0.13), d = acaso(0.04, 0.08), ok = osc('sine', f0), g = ganho(0);
          ok.frequency.setValueAtTime(f0 * acaso(0.95, 1.05), tk); ok.frequency.exponentialRampToValueAtTime(f0 * acaso(0.85, 1.35), tk + d);
          g.gain.setValueAtTime(0, tk); g.gain.linearRampToValueAtTime(0.02, tk + 0.01); g.gain.linearRampToValueAtTime(0, tk + d);
          ok.connect(g); g.connect(pn); ok.start(tk); ok.stop(tk + d + 0.02);
        }
      } };
    },
    furin: function (F, dest) { // sino de vento japonês, afinado na escala da música
      return { compasso: function (t, dur) {
        if (Math.random() > Math.min(0.7, dur / 9)) return;
        var t0 = t + Math.random() * dur, n = Math.random() < 0.3 ? 2 : 1;
        for (var k = 0; k < n; k++) metal(dest, 'furin', F.M.nota(15 + Math.floor(Math.random() * 4)), t0 + k * acaso(0.15, 0.4), acaso(0.5, 1));
      } };
    },
    shishi: function (F, dest) {
      var prox = null;
      return { compasso: function (t, dur) {
        if (prox === null) prox = t + acaso(6, 12);
        while (prox < t + dur) { bambuFonte(dest, prox); prox += acaso(16, 26); }
      } };
    }
  };

  /* --------------------------------------------------------------- mixagem */
  var FAMILIA = {
    guzheng: 'corda', koto: 'corda', gayageum: 'corda', pipa: 'corda', yangqin: 'corda', sanshin: 'corda', khim: 'corda',
    dizi: 'sopro', shakuhachi: 'sopro', daegeum: 'sopro', suling: 'sopro', fue: 'sopro',
    erhu: 'erhu', ep: 'ep', sho: 'pad', cordas: 'pad', baixo: 'baixo'
  };
  Object.keys(METAIS).forEach(function (k) { FAMILIA[k] = 'metal'; });
  var APELIDO = { demung: 'saron', peking: 'saron' };
  var TREMOLO = { guzheng: 13, pipa: 16, yangqin: 14, khim: 12 };
  var ROLO = { ranat: 11, kulintang: 10 };
  // pan, reverberação, eco, volume
  var PADRAO_MIX = {
    guzheng: [0.12, 0.3, 0.05, 1], guzheng2: [-0.22, 0.26, 0, 0.8], koto: [-0.15, 0.28, 0.05, 1], koto2: [0.2, 0.26, 0.03, 0.85],
    gayageum: [-0.15, 0.3, 0.03, 0.9], gayageum2: [0.1, 0.3, 0.05, 1], pipa: [0.15, 0.22, 0, 0.9], yangqin: [-0.2, 0.28, 0.04, 0.9],
    sanshin: [0.1, 0.22, 0, 1], sanshin2: [-0.25, 0.2, 0, 0.75], khim: [-0.1, 0.3, 0.05, 0.95], khim2: [0.25, 0.28, 0, 0.8],
    dizi: [0.05, 0.3, 0.06, 1], shakuhachi: [0, 0.36, 0.05, 1], daegeum: [0, 0.34, 0.05, 1], suling: [0.15, 0.36, 0.06, 1], fue: [0.1, 0.3, 0.05, 0.9],
    erhu: [0.05, 0.3, 0.04, 1], ep: [-0.1, 0.25, 0.08, 1], celesta: [0.2, 0.34, 0.2, 1], celesta2: [-0.15, 0.34, 0.2, 1],
    sino: [0.15, 0.35, 0.15, 1], templo: [0, 0.5, 0, 1], tigela: [0, 0.45, 0, 1],
    saron: [0, 0.3, 0, 1], demung: [-0.25, 0.3, 0, 0.9], peking: [0.3, 0.3, 0, 0.75], bonang: [0.2, 0.3, 0, 0.9], gender: [-0.2, 0.34, 0.05, 1],
    kenong: [0.1, 0.35, 0, 1], kempul: [-0.1, 0.4, 0, 1], gong: [0, 0.4, 0, 1], gangsa: [-0.4, 0.28, 0, 1], gangsa2: [0.4, 0.28, 0, 1], jegogan: [0, 0.34, 0, 1],
    ranat: [0.1, 0.26, 0, 1], ranat2: [0.25, 0.26, 0, 0.8], kulintang: [0, 0.28, 0.04, 1], agung: [-0.2, 0.3, 0, 1], agung2: [0.2, 0.3, 0, 0.9], jing: [0, 0.45, 0, 1],
    sho: [0, 0.4, 0, 1], cordas: [0, 0.35, 0, 0.9], baixo: [0, 0.05, 0, 1],
    perc: [0, 0.15, 0, 1], taiko: [0, 0.18, 0, 1], amb: [0, 0.1, 0, 0.5]
  };
  // calibração de volume de cada instrumento (medida com uma frase de teste, para todos soarem equilibrados)
  var CAL = { guzheng: 2.57, koto: 2.75, gayageum: 2.26, pipa: 4.12, yangqin: 3.16, sanshin: 3.27, khim: 3.24, dizi: 0.81, shakuhachi: 0.59, daegeum: 0.8, suling: 0.79, fue: 1.01, erhu: 1.53, celesta: 1.76, ep: 1.62, sino: 1.84, saron: 2.11, gender: 1.58, gangsa: 2.6, bonang: 2.57, ranat: 2.43, kulintang: 1.62, jegogan: 2.02, kenong: 1.57, kempul: 1.58, gong: 0.78, jing: 1.35, agung: 1.26, templo: 1.6, tigela: 1.29, sho: 1.58, cordas: 6.03, baixo: 0.92, furin: 2.02, taiko: 1.27, buk: 1.88, kung: 1.74, dhe: 2.6, dabakan: 2.02, tung: 2.09, bloco: 2.4, mokugyo: 1.64, ka: 6.61, tak: 7.0, deok: 3.89, kethuk: 2.04, ching: 2.79, babandir: 4.47, chocalho: 4.9, chap: 6.24, pratos: 5.19, sanba: 3.8 };
  var soloBus = null; // só nos testes: ouvir um instrumento de cada vez
  function tipoDe(nome) { var b = nome.replace(/\d+$/, ''); return APELIDO[b] || b; }

  /* ------------------------------------------------------- linhas de melodia */
  function frac(s) { if (s.indexOf('/') >= 0) { var p = s.split('/'); return +p[0] / +p[1]; } return +s; }
  function agrupar(notas, tempos) {
    var total = 0; notas.forEach(function (n) { total = Math.max(total, n.b + n.d); });
    var nc = Math.max(1, Math.round(total / tempos)), por = [];
    for (var i = 0; i < nc; i++) por.push([]);
    notas.forEach(function (n) { var c = Math.min(nc - 1, Math.floor((n.b + 1e-6) / tempos)); n.bc = n.b - c * tempos; por[c].push(n); });
    return { notas: notas, porCompasso: por, compassos: nc, total: total };
  }
  // notação: "grau[ornamentos]:duração" separados por espaço; "|" só organiza os compassos.
  // ornamentos: ~ trêmulo/vibrato, < desliza de baixo, ^ nota de graça, * glissando, ! acento; "r" = pausa.
  function parseLinha(txt, tempos) {
    var notas = [], b = 0, dur = 1;
    txt.split(/\s+/).forEach(function (tok) {
      if (!tok || tok === '|') return;
      var m = tok.match(/^(-?\d+|r)([~<\^*!]*)(?::([\d.\/]+))?$/);
      if (!m) throw new Error('Nota inválida na música: ' + tok);
      if (m[3]) dur = frac(m[3]);
      if (m[1] !== 'r') notas.push({ b: b, d: dur, g: +m[1], orn: { trem: m[2].indexOf('~') >= 0, des: m[2].indexOf('<') >= 0, gra: m[2].indexOf('^') >= 0, gli: m[2].indexOf('*') >= 0, ac: m[2].indexOf('!') >= 0 } });
      b += dur;
    });
    return agrupar(notas, tempos);
  }
  // melodia gerada: frases de 4 compassos, contorno em arco, fim na tônica
  function gerarLinha(o, rnd, tempos) {
    var comp = o.compassos || 8;
    var ritmos = o.ritmos || [[2, 1, 1], [1, 1, 2], [1.5, 0.5, 2], [1, 1, 1, 1], [3, 1], [2, 2]];
    var cad = o.cad || [[4], [2, 2]];
    var min = o.min == null ? -2 : o.min, max = o.max == null ? 8 : o.max, pOrn = o.orn == null ? 0.6 : o.orn;
    var pega = function (a) { return a[Math.floor(rnd() * a.length)]; };
    var perto = function (alvo, cur) { var best = alvo, dist = 1e9; for (var k = -3; k <= 3; k++) { var g = alvo + k * 5; if (g < min - 1 || g > max + 1) continue; if (Math.abs(g - cur) < dist) { dist = Math.abs(g - cur); best = g; } } return best; };
    var barras = [], cur = o.inicio == null ? 2 : o.inicio, primeira = null, frases = Math.ceil(comp / 4);
    for (var fz = 0; fz < frases; fz++) {
      var nb = Math.min(4, comp - fz * 4), ultimaFrase = fz === frases - 1;
      var fim = ultimaFrase ? pega(o.fins || [0, 5]) : (o.meio == null ? 3 : o.meio);
      var ini = cur, pico = Math.min(max, ini + 2 + Math.floor(rnd() * 3));
      var copiar = primeira && fz % 2 === 1 && rnd() < 0.8;
      var celulas = [], cont = 0, cb, k;
      for (cb = 0; cb < nb; cb++) { celulas.push(cb === nb - 1 ? pega(cad) : pega(ritmos)); cont += celulas[cb].length; }
      var idx = 0, desta = [];
      for (cb = 0; cb < nb; cb++) {
        var barra = [];
        if (copiar && cb < 2 && primeira[cb]) {
          barra = primeira[cb].map(function (n) { return { bc: n.bc, d: n.d, g: n.g, orn: n.orn }; });
          if (barra.length) cur = barra[barra.length - 1].g;
          idx += celulas[cb].length; desta.push(barra); continue;
        }
        var cel = celulas[cb], bb = 0;
        for (k = 0; k < cel.length; k++, idx++) {
          var x = idx / Math.max(1, cont - 1), passo = 0, g;
          if (cb === nb - 1 && k === cel.length - 1) g = perto(fim, cur);
          else {
            var alvo = ini + (pico - ini) * Math.sin(Math.PI * Math.min(1, x * 1.1)), dif = alvo - cur;
            passo = dif > 0.5 ? 1 : dif < -0.5 ? -1 : (rnd() < 0.5 ? 1 : -1);
            var r = rnd();
            if (r < 0.18) passo *= 2; else if (r < 0.26) passo = 0; else if (r < 0.34) passo = -passo;
            g = Math.max(min, Math.min(max, cur + passo));
            if (g === cur && barra.length && barra[barra.length - 1].g === g) g = cur + (cur < max ? 1 : -1);
          }
          barra.push({ bc: bb, d: cel[k], g: g, orn: { trem: cel[k] >= 2 && rnd() < pOrn, des: Math.abs(passo) >= 2 && rnd() < 0.4, gra: cel[k] >= 1 && rnd() < 0.08, gli: false, ac: false } });
          bb += cel[k]; cur = g;
        }
        desta.push(barra);
      }
      if (!primeira) primeira = desta;
      barras = barras.concat(desta);
    }
    var notas = [];
    barras.forEach(function (barra, i) { barra.forEach(function (n) { notas.push({ b: i * tempos + n.bc, d: n.d, g: n.g, orn: n.orn }); }); });
    var L = agrupar(notas, tempos);
    while (L.porCompasso.length < comp) L.porCompasso.push([]);
    L.compassos = comp;
    return L;
  }

  /* ------------------------------------------ padrões de acompanhamento */
  var ESTILOS = {
    quartas: [[0, 'r-5', 1], [1, 'q-5', 0.75], [2, 'r', 0.8], [3, 'q-5', 0.7]],
    oitavas: [[0, 'r-5', 1], [0.5, 'q-5', 0.7], [1, 'r', 0.8], [1.5, 'q-5', 0.7], [2, 'r-5', 0.9], [2.5, 'q-5', 0.7], [3, 'r', 0.8], [3.5, 'q-5', 0.7]],
    harpa: [[0, 'r-5', 1], [0.5, 'q-5', 0.75], [1, 'r', 0.8], [1.5, 'q', 0.7], [2.5, 'q-5', 0.6]],
    baixo: [[0, 'r-5', 1], [2, 'q-5', 0.75]],
    pulso: [[0, 'r', 1], [0.5, 'r', 0.6], [1, 'q', 0.8], [1.5, 'r', 0.6], [2, 'r', 0.9], [2.5, 'r', 0.6], [3, 'q', 0.8], [3.5, 'r', 0.6]],
    kachashi: [[0, 'r-5', 1], [0.5, 'D', 0.6], [1, 'q-5', 0.8], [1.5, 'D', 0.55], [2, 'r-5', 0.9], [2.5, 'D', 0.6], [3, 'q-5', 0.8], [3.5, 'D', 0.55]],
    rolado: [[0, 'r-5', 1], [1 / 3, 'q-5', 0.7], [2 / 3, 'r', 0.75], [1, 'r-5', 0.8], [4 / 3, 'q-5', 0.65], [5 / 3, 'r', 0.7], [2, 'r-5', 0.9], [7 / 3, 'q-5', 0.7], [8 / 3, 'r', 0.75], [3, 'r-5', 0.8], [10 / 3, 'q-5', 0.65], [11 / 3, 'r', 0.7]],
    corrida: (function () { var a = []; for (var b = 0; b < 4; b++) a.push([b, 'r-5', b === 0 ? 1 : 0.8], [b + 0.25, 'q-5', 0.6], [b + 0.5, 'r', 0.7], [b + 0.75, 'q-5', 0.6]); return a; })()
  };

  /* ------------------------------------------ a faixa (uma música tocando) */
  function Faixa(def, destino) {
    var F = this;
    this.def = def;
    this.beat = 60 / def.bpm; this.tempos = def.tempos || 4; this.dur = this.beat * this.tempos;
    this.saida = ganho(0); this.saida.connect(destino || mix);
    this.rev = ganho(def.rev == null ? 1 : def.rev); this.rev.connect(revEntrada);
    this.ecoEntrada = ganho(1); this.montarEco();
    this.buses = {}; this.leg = {}; this.c = 0; this.parado = false;
    this.rnd = aleatorio(semente(def.id));
    this.M = criarM(this);
    this.compor = def.compor(this.M);
    this.amb = (def.ambiente || []).map(function (nome) { return AMBIENTES[nome](F, F.bus('amb')); });
  }
  Faixa.prototype.montarEco = function () { // eco estéreo (pingue-pongue)
    var tempo = Math.min(1.9, this.beat * (this.def.eco || 0.75));
    var dl = ctx.createDelay(2), dr = ctx.createDelay(2);
    dl.delayTime.value = tempo; dr.delayTime.value = tempo;
    var fb1 = ganho(0.32), fb2 = ganho(0.32), lp1 = filtro('lowpass', 2600, 0.5), lp2 = filtro('lowpass', 2600, 0.5);
    var mg = ctx.createChannelMerger(2), sai = ganho(0.8);
    this.ecoEntrada.connect(dl);
    dl.connect(lp1); lp1.connect(fb1); fb1.connect(dr);
    dr.connect(lp2); lp2.connect(fb2); fb2.connect(dl);
    lp1.connect(mg, 0, 0); lp2.connect(mg, 0, 1);
    mg.connect(sai); sai.connect(this.saida);
    this.ecoNos = [dl, dr, fb1, fb2, lp1, lp2, mg, sai];
  };
  Faixa.prototype.bus = function (nome) {
    var b = this.buses[nome]; if (b) return b;
    var tipo = tipoDe(nome), cfg = (this.def.mix && this.def.mix[nome]) || PADRAO_MIX[nome] || PADRAO_MIX[tipo] || [0, 0.28, 0, 1];
    var nivel = nome === 'amb' ? (this.def.nivelAmb || 1) : 1;
    var g = ganho(cfg[3] * nivel * (PERC[tipo] ? 1 : (CAL[tipo] || 1)) * (soloBus && soloBus !== nome ? 0 : 1)), pn = panner(cfg[0]);
    if (CORDAS[tipo]) { var lp = filtro('lowpass', CORDAS[tipo].lp[1] * 0.55, 0.5); g.connect(lp); lp.connect(pn); } else g.connect(pn);
    pn.connect(this.saida);
    if (cfg[1] > 0) { var sr = ganho(cfg[1]); pn.connect(sr); sr.connect(this.rev); }
    if (cfg[2] > 0) { var se = ganho(cfg[2]); pn.connect(se); se.connect(this.ecoEntrada); }
    this.buses[nome] = g;
    return g;
  };
  Faixa.prototype.iniciar = function (t) {
    this.proxT = t + 0.05;
    var alvo = this.def.ganho || 1;
    this.saida.gain.setValueAtTime(0.0001, Math.max(0, ctx.currentTime));
    this.saida.gain.setValueAtTime(0.0001, t);
    this.saida.gain.exponentialRampToValueAtTime(alvo, t + 2.2);
    this.amb.forEach(function (a) { (a.fontes || []).forEach(function (s) { if (s.buffer) s.start(t, Math.random() * 3); else s.start(t); }); });
  };
  Faixa.prototype.encerrar = function (dur) {
    if (this.parado) return;
    this.parado = true;
    var agora = ctx.currentTime, g = this.saida.gain;
    g.cancelScheduledValues(agora); g.setValueAtTime(Math.max(0.0001, g.value), agora); g.exponentialRampToValueAtTime(0.0001, agora + dur);
    this.amb.forEach(function (a) { (a.fontes || []).forEach(function (s) { try { s.stop(agora + dur + 0.2); } catch (e) { /* já parou */ } }); });
    var F = this;
    setTimeout(function () { F.desmontar(); }, (dur + 6) * 1000);
  };
  Faixa.prototype.desmontar = function () {
    try { this.saida.disconnect(); this.rev.disconnect(); this.ecoNos.forEach(function (n) { n.disconnect(); }); } catch (e) { /* nada */ }
  };
  Faixa.prototype.compasso = function () {
    var t = this.proxT, c = this.c;
    this.c++; this.proxT += this.dur;
    this.compor(c, t);
    for (var i = 0; i < this.amb.length; i++) if (this.amb[i].compasso) this.amb[i].compasso(t, this.dur, c);
  };

  /* --------------------------------- M: ferramentas usadas pelas composições */
  function criarM(F) {
    var d = F.def, esc = ESCALAS[d.escala], N = esc.length, ton = d.tonica, rnd = F.rnd, beat = F.beat;
    var M = {
      beat: beat, compasso: F.dur, tempos: F.tempos, rnd: rnd,
      nota: function (g) { return grauHz(esc, ton, g); },
      quinta: function (g) { // grau que soa uma quinta acima (ou uma terça, se a escala não tiver quinta)
        var c0 = centsGrau(esc, g), k, dc;
        for (k = 1; k <= N + 1; k++) { dc = centsGrau(esc, g + k) - c0; if (Math.abs(dc - 700) <= 40) return g + k; }
        for (k = 1; k <= N; k++) { dc = centsGrau(esc, g + k) - c0; if (dc >= 280 && dc <= 420) return g + k; }
        return g + N;
      },
      acorde: function (r, desl) { var b = r + (desl || 0); return [b, M.quinta(b), b + N]; },
      linha: function (txt) { return parseLinha(txt, F.tempos); },
      gerar: function (o) { return gerarLinha(o || {}, o && o.semente ? aleatorio(o.semente) : rnd, F.tempos); },
      secao: function (c, forma) {
        var tot = 0, i; for (i = 0; i < forma.length; i++) tot += forma[i][1];
        var k = c % tot, volta = Math.floor(c / tot);
        for (i = 0; i < forma.length; i++) { if (k < forma[i][1]) return { nome: forma[i][0], i: k, idx: i, volta: volta }; k -= forma[i][1]; }
        return { nome: forma[0][0], i: 0, idx: 0, volta: volta };
      },
      em: function (t, b) { var fr = b - Math.floor(b); if (d.swing && Math.abs(fr - 0.5) < 0.01) b += d.swing; return t + b * beat; },
      j: function () { return (Math.random() - 0.5) * 0.012; },
      toca: function (inst, g, t, dur, vel, orn, o) { tocarNota(F, M, inst, g, t, dur * beat, vel, orn, o); },
      frase: function (inst, L, i, t, o) {
        o = o || {};
        var notas = L.porCompasso[((i % L.compassos) + L.compassos) % L.compassos] || [], desl = (o.oitava || 0) * N;
        for (var k = 0; k < notas.length; k++) {
          var n = notas[k], tt = M.em(t, n.bc) + M.j(), vel = (o.vel || 0.7) * (n.orn.ac ? 1.15 : 1) * acaso(0.9, 1.05);
          tocarNota(F, M, inst, n.g + desl, tt, n.d * beat * (o.legato || 1), vel, n.orn, o);
        }
      },
      acomp: function (inst, t, r, estilo, vel, o) {
        var pad = ESTILOS[estilo] || ESTILOS.quartas;
        for (var k = 0; k < pad.length; k++) {
          var p = pad[k], esp = p[1], tt = M.em(t, p[0]) + M.j(), v = vel * p[2] * acaso(0.9, 1.05);
          var g = esp === 'r' ? r : esp === 'r-5' ? r - N : esp === 'q' ? M.quinta(r) : esp === 'q-5' ? M.quinta(r - N) : null;
          if (esp === 'D') { tocarNota(F, M, inst, r, tt, beat * 0.5, v * 0.8, null, o); tocarNota(F, M, inst, M.quinta(r), tt + 0.012, beat * 0.5, v * 0.7, null, o); }
          else tocarNota(F, M, inst, g, tt, beat, v, null, o);
        }
      },
      arpejo: function (inst, t, graus, passo, vel, o) {
        for (var k = 0; k < graus.length; k++) if (graus[k] != null) tocarNota(F, M, inst, graus[k], M.em(t, k * passo) + M.j(), passo * beat, vel * (k === 0 ? 1 : 0.85) * acaso(0.9, 1.05), null, o);
      },
      glissando: function (inst, t, g0, g1, dur, vel, antes) {
        var tipo = tipoDe(inst), b = F.bus(inst), passos = Math.abs(g1 - g0), dir = g1 > g0 ? 1 : -1, t0 = antes ? t - dur : t;
        for (var k = 0; k < passos; k++) { var x = k / passos; corda(b, tipo, M.nota(g0 + dir * k), t0 + dur * Math.sin(x * Math.PI / 2), vel * (0.35 + 0.55 * x), { abafar: 0.35 }); }
      },
      tremolo: function (inst, g, t, dur, vel) {
        var tipo = tipoDe(inst), b = F.bus(inst), f = M.nota(g), hzT = TREMOLO[tipo] || 12, n = Math.max(2, Math.floor(dur * hzT * 0.9));
        for (var k = 0; k < n; k++) {
          var v = vel * (k === 0 ? 0.95 : 0.5 + 0.1 * Math.sin(k * 1.3)) * (1 - 0.3 * k / n);
          corda(b, tipo, f, t + k / hzT + (Math.random() - 0.5) * 0.006, v, k === n - 1 ? {} : { abafar: 1.5 / hzT });
        }
      },
      metal: function (inst, g, t, vel, o) { metal(F.bus(inst), tipoDe(inst), M.nota(g), t, vel, o); },
      pad: function (inst, t, graus, dur, vel, o) { pad(F.bus(inst), tipoDe(inst), graus.map(M.nota), t, dur, vel, o); },
      ep: function (graus, t, dur, vel) { for (var k = 0; k < graus.length; k++) ep(F.bus('ep'), M.nota(graus[k]), t + k * 0.012 + M.j() * 0.3, vel * acaso(0.9, 1.05), { abafar: dur * beat }); },
      baixo: function (g, t, dur, vel) { baixo(F.bus('baixo'), M.nota(g), t, dur * beat, vel); },
      perc: function (tipo, t, vel, bus) {
        var b = F.bus(bus || (tipo === 'taiko' || tipo === 'ka' ? 'taiko' : 'perc'));
        if (METAIS[tipo]) metal(b, tipo, FREQ_PERC[tipo] || 1000, t, vel * (CAL[tipo] || 1)); else if (PERC[tipo]) tocarPerc(b, tipo, t, vel);
      },
      grade: function (tipo, t, padrao, vel, passo, bus) {
        passo = passo || 0.5;
        for (var k = 0; k < padrao.length; k++) {
          var ch = padrao.charAt(k); if (ch === '.' || ch === ' ') continue;
          var v = ch === 'X' ? 1 : ch === 'x' ? 0.75 : ch === 'o' ? 0.45 : 0.3;
          M.perc(tipo, M.em(t, k * passo) + M.j() * 0.5, vel * v, bus);
        }
      }
    };
    function tocarNota(F2, M2, inst, g, tt, dur, vel, orn, o) {
      orn = orn || {}; o = o || {};
      var tipo = tipoDe(inst), fam = FAMILIA[tipo], b = F.bus(inst), f = M.nota(g);
      if (fam === 'corda') {
        if (orn.gli) M.glissando(inst, tt, g - N, g, Math.min(0.42, beat * 0.8), vel * 0.55, true);
        if (orn.gra) corda(b, tipo, M.nota(g + 1), tt - 0.075, vel * 0.5, { abafar: 0.07 });
        var op = {};
        if (orn.des) op.de = Math.pow(2, -(centsGrau(esc, g) - centsGrau(esc, g - 1)) / 1200);
        if (orn.trem && dur >= beat * 1.4 && TREMOLO[tipo]) { M.tremolo(inst, g, tt, dur, vel); return; }
        if (orn.trem) op.vibrato = { hz: tipo === 'gayageum' ? 4.5 : 5.2, prof: tipo === 'gayageum' ? 0.02 : 0.011, ini: 0.22 };
        if (o.dobra && dur >= beat) op.dobra = o.dobra;
        corda(b, tipo, f, tt, vel, op);
      } else if (fam === 'sopro' || fam === 'erhu') {
        var lg = F.leg[inst], op2 = { vib: orn.trem ? 1.4 : 1, vol: o.vol };
        if (lg && Math.abs(lg.fim - tt) < 0.06 && !orn.gra) op2.de = lg.f;
        if (orn.des && !op2.de) op2.de = M.nota(g - 1);
        if (orn.gra) {
          var fg = M.nota(g + 1);
          if (fam === 'sopro') sopro(b, tipo, fg, tt - 0.09, 0.08, vel * 0.7, { reto: true }); else erhu(b, fg, tt - 0.09, 0.08, vel * 0.7, {});
          op2.de = fg;
        }
        if (fam === 'sopro') sopro(b, tipo, f, tt, dur * 0.97, vel, op2); else erhu(b, f, tt, dur * 0.97, vel, op2);
        F.leg[inst] = { fim: tt + dur, f: f };
      } else if (fam === 'metal') {
        if (orn.trem && dur >= beat * 1.4 && ROLO[tipo]) {
          var hzR = ROLO[tipo], n = Math.floor(dur * hzR * 0.9);
          for (var k = 0; k < n; k++) metal(b, tipo, f, tt + k / hzR, vel * (k === 0 ? 1 : 0.55 - 0.15 * k / n));
        } else metal(b, tipo, f, tt, vel, o);
      } else if (fam === 'ep') ep(b, f, tt, vel, { abafar: dur });
      else if (fam === 'pad') pad(b, tipo, [f], tt, dur, vel);
      else if (fam === 'baixo') baixo(b, f, tt, dur, vel);
    }
    return M;
  }

  /* ------------------------------------------------------------- o tocador */
  var estado = { ligada: true, volume: 0.5, escolhas: {}, contexto: 'inicio', pronto: false };
  var atual = null, timer = null, ouvintes = [];
  function curva(v) { return Math.pow(Math.max(0, Math.min(1, v)), 1.6) * 1.1; }
  function faixasDe(id) { return (window.MUSICAS && window.MUSICAS[id]) || []; }
  function escolhida(id) { var L = faixasDe(id), i = estado.escolhas[id] || 0; return L[i] || L[0] || null; }
  function avisar() { ouvintes.forEach(function (fn) { try { fn(Musica.estado()); } catch (e) { /* nada */ } }); }
  function tick() {
    if (!atual || !ctx || ctx.state !== 'running') return;
    var agora = ctx.currentTime;
    if (atual.proxT < agora - 0.25) atual.proxT = agora + 0.05; // a aba ficou parada
    var n = 0;
    while (atual.proxT < agora + 1.5 && n++ < 3) {
      try { atual.compasso(); } catch (e) { if (window.console) console.warn('Música:', e); }
    }
  }
  function atualizar() {
    if (!estado.pronto || !ctx) { avisar(); return; }
    var def = estado.ligada ? escolhida(estado.contexto) : null;
    if (atual && def && atual.def === def && !atual.parado) { avisar(); return; }
    var havia = !!atual;
    if (atual) { atual.encerrar(1.4); atual = null; }
    if (def) {
      geracao++; limparCache();
      try {
        atual = new Faixa(def);
        atual.iniciar(ctx.currentTime + (havia ? 0.7 : 0.08));
      } catch (e) { atual = null; if (window.console) console.warn('Música:', e); }
      if (!timer) timer = setInterval(tick, 180);
      tick();
    }
    avisar();
  }

  var Musica = {
    // chamado no primeiro toque ou clique (o navegador só libera som depois disso)
    iniciarAudio: function () {
      if (!montar()) return false;
      estado.pronto = true;
      volume.gain.setTargetAtTime(estado.ligada ? curva(estado.volume) : 0, ctx.currentTime, 0.3);
      atualizar();
      return true;
    },
    configurar: function (o) {
      if (o.ligada != null) estado.ligada = !!o.ligada;
      if (o.volume != null) estado.volume = +o.volume;
      if (o.escolhas) estado.escolhas = Object.assign({}, o.escolhas);
    },
    contexto: function (id) { if (!faixasDe(id).length || estado.contexto === id) { avisar(); return; } estado.contexto = id; atualizar(); },
    ligar: function (on) {
      estado.ligada = !!on;
      if (volume) volume.gain.setTargetAtTime(on ? curva(estado.volume) : 0, ctx.currentTime, 0.25);
      atualizar();
    },
    volume: function (v) { estado.volume = v; if (volume && estado.ligada) volume.gain.setTargetAtTime(curva(v), ctx.currentTime, 0.08); },
    escolher: function (id, i) { estado.escolhas[id] = i; if (id === estado.contexto) atualizar(); else avisar(); },
    opcoes: function (id) { return faixasDe(id).map(function (f) { return { id: f.id, nome: f.nome, desc: f.desc }; }); },
    escolhida: function (id) { return estado.escolhas[id] || 0; },
    estado: function () { return { ligada: estado.ligada, volume: estado.volume, contexto: estado.contexto, tocando: atual && !atual.parado ? atual.def.id : null, pronto: estado.pronto }; },
    abaixar: function (quanto, dur) {
      if (!duck || !ctx) return;
      var n = ctx.currentTime;
      duck.gain.cancelScheduledValues(n); duck.gain.setTargetAtTime(quanto || 0.45, n, 0.04); duck.gain.setTargetAtTime(1, n + (dur || 1.1), 0.5);
    },
    aoMudar: function (fn) { ouvintes.push(fn); },
    // grava alguns segundos de uma faixa sem tocar (usado nos testes)
    renderizar: function (id, seg, taxa, op) {
      op = op || {};
      var def = null;
      Object.keys(window.MUSICAS || {}).forEach(function (k) { window.MUSICAS[k].forEach(function (f) { if (f.id === id) def = f; }); });
      if (!def) return Promise.reject(new Error('Faixa não encontrada: ' + id));
      var OC = window.OfflineAudioContext || window.webkitOfflineAudioContext, sr = taxa || 44100;
      var off = new OC(2, Math.floor(sr * seg), sr);
      var guardado = { ctx: ctx, mix: mix, duck: duck, volume: volume, rev: revEntrada, rb: ruidoBranco, rr: ruidoRosa, cc: cacheCordas, ca: cacheAmb };
      var promessa;
      try {
        ctx = off; cacheCordas = {}; cacheAmb = {};
        montarGrafo(off.destination, false, op.semCompressor);
        var def2 = def;
        if (op.soAmbiente) def2 = Object.assign({}, def, { compor: function () { return function () {}; } });
        if (op.semAmbiente) def2 = Object.assign({}, def, { ambiente: [] });
        soloBus = op.solo || null;
        var F = new Faixa(def2);
        F.iniciar(0.02);
        while (F.proxT < seg) F.compasso();
        var nomes = Object.keys(F.buses);
        promessa = off.startRendering().then(function (b) { b.buses = nomes; return b; });
      } finally {
        soloBus = null;
        ctx = guardado.ctx; mix = guardado.mix; duck = guardado.duck; volume = guardado.volume; revEntrada = guardado.rev;
        ruidoBranco = guardado.rb; ruidoRosa = guardado.rr; cacheCordas = guardado.cc; cacheAmb = guardado.ca;
      }
      return promessa;
    },
    _escalas: ESCALAS,
    _cal: CAL
  };
  window.Musica = Musica;
})();
