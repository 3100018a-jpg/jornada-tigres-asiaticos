/* Peças de desenho em SVG usadas pelas ilustrações, pelo mascote Kai,
   pelas bandeiras e pelos ícones. Tudo é desenhado aqui mesmo: o jogo
   funciona sem internet e sem imagens externas. */
(function () {
  var uid = 0;
  function U(p) { return (p || 'g') + (++uid); }

  // ------------------------------------------------------------ primitivas
  function at(o) {
    if (!o) return '';
    var s = '';
    for (var k in o) if (o[k] !== undefined && o[k] !== null && o[k] !== false) s += ' ' + k + '="' + o[k] + '"';
    return s;
  }
  function rect(x, y, w, h, f, o) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" fill="' + f + '"' + at(o) + '/>'; }
  function rr(x, y, w, h, r, f, o) { o = o || {}; o.rx = r; return rect(x, y, w, h, f, o); }
  function circ(x, y, r, f, o) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + f + '"' + at(o) + '/>'; }
  function ell(x, y, rx, ry, f, o) { return '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" fill="' + f + '"' + at(o) + '/>'; }
  function path(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + at(o) + '/>'; }
  function line(x1, y1, x2, y2, c, w, o) { o = o || {}; o['stroke-linecap'] = o['stroke-linecap'] || 'round'; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + c + '" stroke-width="' + w + '"' + at(o) + '/>'; }
  function poly(pts, f, o) { return '<polygon points="' + pts + '" fill="' + f + '"' + at(o) + '/>'; }
  function txt(x, y, s, size, f, o) {
    o = o || {};
    if (!o['font-family']) o['font-family'] = 'Lexend, "Segoe UI", Arial, sans-serif';
    if (!o['font-weight']) o['font-weight'] = 700;
    if (!o['text-anchor']) o['text-anchor'] = 'middle';
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + size + '" fill="' + f + '"' + at(o) + '>' + s + '</text>';
  }
  function g(inner, o) { return '<g' + at(o) + '>' + inner + '</g>'; }
  function tr(x, y, s, inner, extra) { return '<g transform="translate(' + r1(x) + ' ' + r1(y) + ')' + (s && s !== 1 ? ' scale(' + s + ')' : '') + '"' + at(extra) + '>' + inner + '</g>'; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function lg(id, stops, x2, y2) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 === undefined ? 0 : x2) + '" y2="' + (y2 === undefined ? 1 : y2) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] !== undefined ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') + '</linearGradient>';
  }
  function rg(id, stops) {
    return '<radialGradient id="' + id + '">' + stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] !== undefined ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') + '</radialGradient>';
  }
  function svg(inner, defs, vb, cls) {
    return '<svg viewBox="' + (vb || '0 0 480 300') + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"' + (cls ? ' class="' + cls + '"' : '') + '>' +
      (defs ? '<defs>' + defs + '</defs>' : '') + inner + '</svg>';
  }
  // pseudoaleatório determinístico (janelas acesas etc.)
  function rnd(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }

  // ------------------------------------------------------------ cenário
  function ceu(defs, c1, c2, w, h) {
    var id = U('ceu');
    defs.push(lg(id, [[0, c1], [1, c2]]));
    return rect(0, 0, w || 480, h || 300, 'url(#' + id + ')');
  }
  function sol(x, y, r, cor, brilho) {
    return g(circ(x, y, r * 1.9, brilho || cor, { opacity: 0.18 }) + circ(x, y, r * 1.4, brilho || cor, { opacity: 0.25 }) + circ(x, y, r, cor), { class: 'an-pulsa', style: 'transform-origin:' + x + 'px ' + y + 'px' });
  }
  function lua(x, y, r, fundo) { return circ(x, y, r * 2, '#FFF6D6', { opacity: 0.12 }) + circ(x, y, r, '#FFF3C4') + circ(x + r * 0.5, y - r * 0.25, r * 0.85, fundo || '#1E1552'); }
  function nuvem(x, y, s, cor, cls) {
    cor = cor || '#FFFFFF';
    return tr(x, y, s, circ(0, 0, 14, cor) + circ(16, -6, 18, cor) + circ(34, 0, 13, cor) + rr(-12, 0, 58, 13, 6.5, cor), { class: cls || 'an-nuvem' });
  }
  function estrelas(n, seed, w, h, cor) {
    var r = rnd(seed), s = '';
    for (var i = 0; i < n; i++) s += circ(r() * w, r() * h, r() * 1.3 + 0.4, cor || '#FFFFFF', { opacity: (0.4 + r() * 0.6).toFixed(2), class: i % 3 === 0 ? 'an-pisca' : null, style: 'animation-delay:' + (r() * 3).toFixed(2) + 's' });
    return s;
  }
  function montanhas(y, cor, pontos, w, h) { // pontos: [[x,alt],...]
    var W = w || 480, H = h || 300, d = 'M0 ' + y;
    pontos.forEach(function (p) { d += ' L' + p[0] + ' ' + (y - p[1]); });
    d += ' L' + W + ' ' + y + ' L' + W + ' ' + H + ' L0 ' + H + 'Z';
    return path(d, cor);
  }
  function colinas(y, cor, amp, fase) {
    var d = 'M0 ' + y;
    for (var x = 0; x <= 480; x += 40) d += ' Q' + (x + 20) + ' ' + (y - amp * Math.sin((x + fase) / 60)) + ' ' + (x + 40) + ' ' + y;
    return path(d + ' L480 300 L0 300Z', cor);
  }
  function mar(defs, y, c1, c2, w, h) {
    var id = U('mar'), W = w || 480, H = h || 300;
    defs.push(lg(id, [[0, c1], [1, c2]]));
    var s = rect(0, y, W, H - y, 'url(#' + id + ')');
    var linhas = Math.max(3, Math.floor((H - y) / 13));
    for (var i = 0; i < linhas; i++) {
      var yy = y + 10 + i * 12, x0 = (i * 53) % 80, d = '';
      for (var x = x0; x < W; x += 165) d += 'M' + x + ' ' + (yy + ((x / 165) % 2 ? 3 : 0)) + ' q12 -5 24 0 t24 0 ';
      s += g(path(d, 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.35, 'stroke-linecap': 'round' }), { class: 'an-onda', style: 'animation-delay:' + (i * 0.4) + 's' });
    }
    return s;
  }
  function arvore(x, y, s, cor) {
    cor = cor || '#3FA35B';
    return tr(x, y, s, rect(-3, -18, 6, 18, '#8A5A3B') + circ(0, -28, 14, cor) + circ(-9, -22, 10, cor) + circ(9, -22, 10, cor) + circ(-4, -33, 7, '#FFFFFF', { opacity: 0.12 }));
  }
  function palmeira(x, y, s, frutos) {
    var f = '';
    var folhas = [[-38, -6], [-26, -24], [0, -32], [26, -24], [38, -6], [-16, 4], [16, 4]];
    folhas.forEach(function (p) { f += path('M0 -60 Q' + (p[0] * 0.5) + ' ' + (-72 + p[1] * 0.3) + ' ' + p[0] + ' ' + (-60 + p[1] + 22), 'none', { stroke: '#2E9E55', 'stroke-width': 7, 'stroke-linecap': 'round' }); });
    var fr = frutos ? circ(-6, -54, 6, '#E8541E') + circ(5, -53, 6, '#F27A1A') + circ(0, -48, 6, '#D9401B') : '';
    return tr(x, y, s, path('M-4 0 Q-2 -30 -2 -60 L2 -60 Q3 -30 4 0Z', '#8B5E3C') + f + fr);
  }

  // ------------------------------------------------------------ construções
  function predio(x, base, w, h, cor, o) {
    o = o || {};
    var r = rnd(Math.round(x * 13 + h * 7 + w)), s = rect(x, base - h, w, h, cor);
    s += rect(x + w * 0.72, base - h, w * 0.28, h, '#000000', { opacity: 0.12 });
    var jw = o.janelaW || 5, jh = o.janelaH || 6, gx = o.gx || 9, gy = o.gy || 11, acesa = o.acesa === undefined ? 0.55 : o.acesa;
    for (var yy = base - h + 8; yy < base - 10; yy += gy) {
      for (var xx = x + 5; xx < x + w - jw - 3; xx += gx) {
        var on = r() < acesa;
        s += rect(xx, yy, jw, jh, on ? (o.luz || '#FFE08A') : (o.apagada || '#000000'), { opacity: on ? 0.95 : 0.18 });
      }
    }
    if (o.antena) s += line(x + w / 2, base - h, x + w / 2, base - h - 14, cor, 2) + circ(x + w / 2, base - h - 15, 2.2, '#FF3D8B', { class: 'an-pisca' });
    if (o.topo) s += poly((x) + ',' + (base - h) + ' ' + (x + w / 2) + ',' + (base - h - o.topo) + ' ' + (x + w) + ',' + (base - h), cor);
    return s;
  }
  function casaTelhado(x, y, s, parede, telhado) {
    return tr(x, y, s, rect(-20, -22, 40, 22, parede || '#F4E1C1') + path('M-28 -20 Q0 -44 28 -20 Q20 -26 0 -34 Q-20 -26 -28 -20Z', telhado || '#6B4A3A') + rect(-5, -14, 10, 14, '#7A4E32') + rect(-16, -16, 7, 6, '#9CD3F5') + rect(9, -16, 7, 6, '#9CD3F5'));
  }
  function cabana(x, y, s) {
    return tr(x, y, s, rect(-18, -18, 36, 18, '#D9B27C') + poly('-24,-16 0,-40 24,-16', '#C99A4B') + path('M-24 -16 L0 -40 L24 -16', 'none', { stroke: '#A77A33', 'stroke-width': 2 }) + rect(-5, -12, 10, 12, '#7A5230') + rect(-20, 0, 40, 3, '#8A6A40'));
  }
  function fabrica(x, base, s, cor, o) {
    o = o || {};
    cor = cor || '#E9EEF6';
    var tel = o.telhado || '#5B6C8F';
    var inner = rect(0, -60, 150, 60, cor) +
      path('M0 -60 L0 -80 L30 -60 L30 -80 L60 -60 L60 -80 L90 -60 L90 -80 L120 -60 L120 -80 L150 -60Z', tel) +
      rect(112, -120, 16, 70, o.chamine || '#C94F4F') + rect(112, -110, 16, 5, '#FFFFFF', { opacity: 0.6 }) + rect(112, -96, 16, 5, '#FFFFFF', { opacity: 0.6 }) +
      rect(12, -44, 22, 16, '#8FD3FF') + rect(44, -44, 22, 16, '#8FD3FF') + rect(76, -44, 22, 16, '#8FD3FF') + rect(56, -24, 30, 24, '#44506B');
    if (o.fumaca !== false) inner += g(circ(120, -130, 9, o.corFumaca || '#D6DBE6', { class: 'an-fumaca' }) + circ(126, -140, 11, o.corFumaca || '#D6DBE6', { class: 'an-fumaca', style: 'animation-delay:1s' }) + circ(116, -148, 8, o.corFumaca || '#D6DBE6', { class: 'an-fumaca', style: 'animation-delay:2s' }));
    if (o.placa) inner += rr(4, -58, 50, 12, 3, '#FFFFFF') + txt(29, -49, o.placa, 8, '#1C1840');
    return tr(x, base, s, inner);
  }
  function guindaste(x, base, s, cor) {
    cor = cor || '#FFB400';
    var inner = rect(0, -120, 6, 120, cor) + rect(40, -120, 6, 120, cor) + rect(0, -122, 110, 8, cor) + rect(-30, -122, 30, 8, cor) +
      line(3, -60, 43, -60, cor, 4) + line(3, -100, 43, -60, cor, 3) + line(43, -100, 3, -60, cor, 3) +
      rect(-26, -118, 16, 16, '#5B6C8F') + rect(18, -130, 12, 10, '#E9EEF6') +
      g(rect(78, -114, 14, 8, '#44506B') + line(85, -106, 85, -70, '#44506B', 1.5) + rr(77, -70, 16, 10, 1.5, '#FF3D8B'), { class: 'an-guincho' });
    return tr(x, base, s, inner);
  }
  function conteiner(x, y, w, h, cor) {
    var s = rect(x, y, w, h, cor), n = Math.floor(w / 5);
    for (var i = 1; i < n; i++) s += line(x + i * (w / n), y + 2, x + i * (w / n), y + h - 2, '#000000', 1, { opacity: 0.15 });
    s += rect(x, y, w, 2, '#FFFFFF', { opacity: 0.25 }) + rect(x, y + h - 2, w, 2, '#000000', { opacity: 0.2 });
    return s;
  }
  var CORES_CONT = ['#F26B21', '#19C3E6', '#FF3D8B', '#FFB400', '#8250E0', '#12A277', '#E94F4F', '#3E6DE0'];
  function pilhaConteineres(x, y, cols, rows, w, h, seed) {
    var r = rnd(seed || 7), s = '';
    for (var c = 0; c < cols; c++) for (var l = 0; l < rows; l++) s += conteiner(x + c * (w + 2), y - (l + 1) * (h + 1), w, h, CORES_CONT[Math.floor(r() * CORES_CONT.length)]);
    return s;
  }
  function navio(x, y, s, o) {
    o = o || {};
    var casco = o.casco || '#23305B';
    var inner = path('M-110 0 L110 0 L96 26 L-100 26Z', casco) + rect(-110, 0, 220, 5, '#E94F4F') +
      rect(70, -34, 30, 34, '#F4F6FB') + rect(74, -30, 22, 6, '#8FD3FF') + rect(82, -46, 8, 12, '#E94F4F');
    if (o.conteineres !== false) inner += pilhaConteineres(-100, 0, 8, o.camadas || 2, 20, 12, o.seed || 3);
    return tr(x, y, s, inner, { class: o.cls || null });
  }
  function barquinho(x, y, s, cor) {
    return tr(x, y, s, path('M-18 0 L18 0 L12 9 L-12 9Z', cor || '#E94F4F') + rect(-4, -12, 8, 12, '#FFFFFF'));
  }

  // ------------------------------------------------------------ pessoas
  var PELES = ['#F1C9A5', '#E3AE84', '#C98E62', '#F5D2B5'];
  function pessoa(x, y, s, o) {
    o = o || {};
    var pele = o.pele || PELES[0], roupa = o.jaleco ? '#FFFFFF' : (o.roupa || '#3E6DE0'), calca = o.calca || '#2B2D42', cabelo = o.cabelo || '#241611';
    var inner = '';
    // pernas
    inner += rr(-7, -22, 6, 22, 3, calca) + rr(1, -22, 6, 22, 3, calca);
    // corpo
    inner += rr(-10, -46, 20, 27, 8, roupa);
    // braços
    var bE = o.bracoE === undefined ? 20 : o.bracoE, bD = o.bracoD === undefined ? -20 : o.bracoD;
    inner += '<g transform="rotate(' + bE + ' -8 -42)">' + rr(-12, -43, 6, 20, 3, roupa) + circ(-9, -22, 3.4, pele) + '</g>';
    inner += '<g transform="rotate(' + bD + ' 8 -42)">' + rr(6, -43, 6, 20, 3, roupa) + circ(9, -22, 3.4, pele) + '</g>';
    // cabeça
    inner += rr(-2.5, -50, 5, 5, 2, pele) + circ(0, -57, 9, pele);
    if (o.cabeloLongo) inner += path('M-9 -57 Q-10 -40 -6 -44 L-6 -58Z M9 -57 Q10 -40 6 -44 L6 -58Z', cabelo);
    inner += path('M-9.5 -57 Q-9 -68 0 -67 Q9 -68 9.5 -57 Q5 -62 0 -61 Q-6 -62 -9.5 -57Z', cabelo);
    inner += circ(-3, -57, 1.1, '#241611') + circ(3, -57, 1.1, '#241611') + path('M-2.5 -53 Q0 -51 2.5 -53', 'none', { stroke: '#8A4B2D', 'stroke-width': 1, 'stroke-linecap': 'round' });
    if (o.chapeu === 'conico') inner += path('M-17 -60 L0 -76 L17 -60 Q0 -56 -17 -60Z', '#E8C27A') + path('M-17 -60 Q0 -56 17 -60', 'none', { stroke: '#B8904A', 'stroke-width': 1.2 });
    if (o.chapeu === 'capacete') inner += path('M-10.5 -60 Q-10 -70 0 -70 Q10 -70 10.5 -60Z', '#FFD23F') + rect(-12, -61, 24, 3, '#F2B200');
    if (o.chapeu === 'touca') inner += path('M-10.5 -59 Q-10 -70 0 -70 Q10 -70 10.5 -59Z', '#7FD8F5');
    if (o.oculos) inner += rr(-6, -59, 5, 3.5, 1, '#1C1840', { opacity: 0.8 }) + rr(1, -59, 5, 3.5, 1, '#1C1840', { opacity: 0.8 });
    if (o.jaleco) inner += rect(-0.8, -45, 1.6, 24, '#C9D2E3');
    if (o.maleta) inner += rr(10, -26, 14, 10, 2, '#5B3A29') + rect(14, -28, 6, 2, '#5B3A29');
    var t = 'translate(' + r1(x) + ' ' + r1(y) + ') scale(' + (o.espelho ? -s : s) + ' ' + s + ')' + (o.inclina ? ' rotate(' + o.inclina + ')' : '');
    return '<g transform="' + t + '"' + (o.cls ? ' class="' + o.cls + '"' : '') + '>' + inner + '</g>';
  }

  // ------------------------------------------------------------ objetos
  function moeda(x, y, r, simbolo) {
    return g(circ(x, y, r, '#FFC93C') + circ(x, y, r * 0.78, '#FFB400') + txt(x, y + r * 0.38, simbolo || '$', r * 1.05, '#8A5A00'));
  }
  function engrenagem(x, y, r, cor, cls) {
    var d = '', dentes = 8;
    for (var i = 0; i < dentes; i++) {
      var a = (i / dentes) * Math.PI * 2;
      d += rect(-r * 0.18, -r * 1.25, r * 0.36, r * 0.5, cor, { transform: 'rotate(' + (a * 180 / Math.PI) + ')' });
    }
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="' + (cls || 'an-gira') + '">' + d + circ(0, 0, r, cor) + circ(0, 0, r * 0.38, '#FFFFFF') + '</g></g>';
  }
  function lampada(x, y, s) {
    return tr(x, y, s, circ(0, 0, 26, '#FFE66D', { opacity: 0.35, class: 'an-pulsa' }) + circ(0, 0, 16, '#FFE66D') + rr(-7, 14, 14, 10, 2, '#9AA4B8') + line(-6, 18, 6, 18, '#6B7385', 1.5) + path('M-5 4 L0 -4 L5 4', 'none', { stroke: '#F2A900', 'stroke-width': 2 }));
  }
  function seta(x1, y1, x2, y2, cor, w, o) {
    var id = 'seta' + cor.replace('#', '');
    var ang = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(ang), s = Math.sin(ang), L = (w || 4) * 3.2;
    var ponta = poly(r1(x2) + ',' + r1(y2) + ' ' + r1(x2 - L * c + L * 0.55 * s) + ',' + r1(y2 - L * s - L * 0.55 * c) + ' ' + r1(x2 - L * c - L * 0.55 * s) + ',' + r1(y2 - L * s + L * 0.55 * c), cor);
    return g(line(x1, y1, x2 - L * 0.8 * c, y2 - L * 0.8 * s, cor, w || 4, o) + ponta, { class: (o && o.cls) || null });
  }
  function setaCurva(x1, y1, cx, cy, x2, y2, cor, w, cls) {
    var ang = Math.atan2(y2 - cy, x2 - cx), c = Math.cos(ang), s = Math.sin(ang), L = (w || 4) * 3.2;
    return g(path('M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + (x2 - L * 0.7 * c) + ' ' + (y2 - L * 0.7 * s), 'none', { stroke: cor, 'stroke-width': w || 4, 'stroke-linecap': 'round' }) +
      poly(r1(x2) + ',' + r1(y2) + ' ' + r1(x2 - L * c + L * 0.55 * s) + ',' + r1(y2 - L * s - L * 0.55 * c) + ' ' + r1(x2 - L * c - L * 0.55 * s) + ',' + r1(y2 - L * s + L * 0.55 * c), cor), { class: cls || null });
  }
  function etiqueta(x, y, texto, cor, o) {
    o = o || {};
    var size = o.size || 11, w = o.w || Math.max(34, texto.length * size * 0.62 + 16), h = size + 10;
    return g(rr(x - w / 2, y - h / 2, w, h, h / 2, cor, { opacity: o.opacity || 1 }) + txt(x, y + size * 0.36, texto, size, o.cor || '#FFFFFF'));
  }
  function placa(x, y, texto, o) {
    o = o || {};
    var size = o.size || 10, w = o.w || texto.length * size * 0.62 + 14, h = size + 9;
    return g(rr(x - w / 2, y - h / 2, w, h, 3, o.fundo || '#FFFFFF') + txt(x, y + size * 0.36, texto, size, o.cor || '#1C1840'));
  }
  function saca(x, y, s, rotulo, cor) {
    return tr(x, y, s, path('M-14 0 Q-17 -22 -10 -30 L10 -30 Q17 -22 14 0Z', cor || '#E8D2A6') + path('M-10 -30 Q0 -36 10 -30', 'none', { stroke: '#B99A63', 'stroke-width': 2 }) + (rotulo ? txt(0, -11, rotulo, 7.5, '#6B4A2A') : ''));
  }
  function caixa(x, y, w, h, cor, rotulo, size) {
    return g(rect(x, y, w, h, cor || '#D9A566') + rect(x, y, w, 4, '#000000', { opacity: 0.08 }) + line(x + w / 2, y, x + w / 2, y + h * 0.35, '#FFFFFF', 3, { opacity: 0.5 }) + (rotulo ? txt(x + w / 2, y + h * 0.72, rotulo, size || 8, '#5B3A1A') : ''));
  }
  function globo(x, y, r, o) {
    o = o || {};
    var id = U('gl');
    return g('<clipPath id="' + id + '"><circle cx="' + x + '" cy="' + y + '" r="' + r + '"/></clipPath>' +
      circ(x, y, r, o.mar || '#3FA9F5') +
      '<g clip-path="url(#' + id + ')">' +
      path('M' + (x - r * 0.9) + ' ' + (y - r * 0.4) + ' q' + (r * 0.3) + ' ' + (-r * 0.4) + ' ' + (r * 0.7) + ' ' + (-r * 0.2) + ' q' + (r * 0.2) + ' ' + (r * 0.3) + ' ' + (-r * 0.1) + ' ' + (r * 0.6) + ' q' + (-r * 0.4) + ' ' + (r * 0.3) + ' ' + (-r * 0.6) + ' ' + (-r * 0.4) + 'Z', o.terra || '#5FCB6E') +
      path('M' + (x + r * 0.1) + ' ' + (y - r * 0.8) + ' q' + (r * 0.5) + ' ' + (-r * 0.1) + ' ' + (r * 0.8) + ' ' + (r * 0.3) + ' q' + (-r * 0.1) + ' ' + (r * 0.5) + ' ' + (-r * 0.3) + ' ' + (r * 0.7) + ' q' + (-r * 0.3) + ' ' + (r * 0.2) + ' ' + (-r * 0.4) + ' ' + (r * 0.8) + ' q' + (-r * 0.3) + ' ' + (-r * 0.4) + ' ' + (-r * 0.1) + ' ' + (-r * 1.0) + ' q' + (-r * 0.2) + ' ' + (-r * 0.3) + ' 0 ' + (-r * 0.8) + 'Z', o.terra || '#5FCB6E') +
      '</g>' + circ(x, y, r, 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.35 }) + ell(x - r * 0.35, y - r * 0.4, r * 0.25, r * 0.12, '#FFFFFF', { opacity: 0.25 }));
  }
  function chipIcone(x, y, s, cor) {
    var p = '';
    for (var i = 0; i < 5; i++) {
      var o = -24 + i * 12;
      p += rect(o - 2, -40, 4, 10, '#C9D2E3') + rect(o - 2, 30, 4, 10, '#C9D2E3') + rect(-40, o - 2, 10, 4, '#C9D2E3') + rect(30, o - 2, 10, 4, '#C9D2E3');
    }
    return tr(x, y, s, p + rr(-32, -32, 64, 64, 8, cor || '#232B4A') + rr(-20, -20, 40, 40, 4, '#3A4775') + path('M-12 -8 H4 V8 H12 M-12 4 H-2 V12 M0 -14 V-4 H10', 'none', { stroke: '#19C3E6', 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'an-circuito' }));
  }
  function raio(x, y, s, cor) { return tr(x, y, s, poly('4,-18 -8,2 0,2 -4,18 8,-2 0,-2', cor || '#FFD23F')); }
  function alerta(x, y, s) { return tr(x, y, s, poly('0,-16 16,12 -16,12', '#FFD23F') + rect(-1.8, -6, 3.6, 10, '#1C1840') + circ(0, 8, 2, '#1C1840'), { class: 'an-pulsa', style: 'transform-origin:' + x + 'px ' + y + 'px' }); }

  // ------------------------------------------------------------ mascote Kai
  /* Kai é um tigre original deste jogo: capacete amarelo de fábrica
     (indústria) e crachá azul. Poses: ola, feliz, pensando, ops, neutro. */
  function kai(pose, o) {
    o = o || {};
    pose = pose || 'neutro';
    var LAR = '#FF9A3C', LAR2 = '#F07A1F', LIS = '#3B1F14', BR = '#FFF4E4';
    var s = '';
    // cauda
    s += '<g class="kai-cauda">' + path('M138 176 Q176 170 178 138 Q179 120 168 112', 'none', { stroke: LAR, 'stroke-width': 13, 'stroke-linecap': 'round' }) +
      path('M172 150 l10 -3 M176 132 l10 1', 'none', { stroke: LIS, 'stroke-width': 4, 'stroke-linecap': 'round' }) + circ(168, 112, 7.5, LIS) + '</g>';
    // pernas
    s += rr(70, 176, 24, 34, 12, LAR) + rr(106, 176, 24, 34, 12, LAR) + ell(82, 208, 15, 8, BR) + ell(118, 208, 15, 8, BR);
    // corpo
    s += ell(100, 160, 44, 40, LAR) + ell(100, 168, 27, 29, BR);
    s += path('M58 150 q10 4 14 -4 M56 166 q10 4 14 -3 M142 150 q-10 4 -14 -4 M144 166 q-10 4 -14 -3', 'none', { stroke: LIS, 'stroke-width': 4, 'stroke-linecap': 'round' });
    // crachá
    s += line(86, 128, 100, 150, '#19C3E6', 3) + line(114, 128, 100, 150, '#19C3E6', 3) + rr(88, 148, 24, 17, 3, '#19C3E6') + rr(91, 151, 18, 11, 2, '#FFFFFF') + txt(100, 159.5, 'KAI', 7.5, '#1C1840', { 'font-family': 'Bungee, "Arial Black", sans-serif', 'font-weight': 400 });
    // braços por pose
    function braco(x, y, ang, mao) {
      return '<g transform="rotate(' + ang + ' ' + x + ' ' + y + ')">' + rr(x - 9, y - 4, 18, 40, 9, LAR) + circ(x, y + 38, 10, mao || BR) + '</g>';
    }
    var bracos = '';
    if (pose === 'ola') bracos = braco(62, 136, 28) + '<g class="kai-aceno">' + braco(140, 134, -150) + '</g>';
    else if (pose === 'feliz') bracos = braco(62, 132, 150) + braco(138, 132, -150);
    else if (pose === 'pensando') bracos = braco(62, 136, 25) + braco(134, 138, -140);
    else if (pose === 'ops') bracos = braco(64, 138, 10) + braco(136, 138, -10);
    else bracos = braco(62, 136, 22) + braco(138, 136, -22);
    s += bracos;
    // cabeça
    s += '<g class="kai-cabeca">';
    s += circ(52, 42, 17, LAR) + circ(52, 42, 9, BR) + circ(148, 42, 17, LAR) + circ(148, 42, 9, BR);
    s += ell(100, 82, 60, 54, LAR);
    s += path('M44 96 Q40 118 62 124 Q56 112 60 102Z M156 96 Q160 118 138 124 Q144 112 140 102Z', BR);
    s += path('M100 36 v14 M88 40 q4 8 2 16 M112 40 q-4 8 -2 16 M44 72 q12 2 18 10 M42 88 q12 0 18 6 M156 72 q-12 2 -18 10 M158 88 q-12 0 -18 6', 'none', { stroke: LIS, 'stroke-width': 5, 'stroke-linecap': 'round' });
    s += ell(100, 104, 30, 21, BR);
    // olhos
    var olhos = '';
    if (pose === 'feliz') olhos = path('M68 80 q10 -12 20 0 M112 80 q10 -12 20 0', 'none', { stroke: LIS, 'stroke-width': 5, 'stroke-linecap': 'round' });
    else {
      var py = pose === 'pensando' ? -4 : 0, px = pose === 'pensando' ? 3 : 0;
      olhos = '<g class="kai-olhos">' + ell(78, 80, 11, 13, '#FFFFFF') + ell(122, 80, 11, 13, '#FFFFFF') +
        circ(79 + px, 82 + py, 6.5, '#241611') + circ(123 + px, 82 + py, 6.5, '#241611') + circ(81 + px, 79 + py, 2.2, '#FFFFFF') + circ(125 + px, 79 + py, 2.2, '#FFFFFF') + '</g>';
    }
    s += olhos;
    // sobrancelhas
    if (pose === 'ops') s += path('M66 64 l20 6 M134 64 l-20 6', 'none', { stroke: LIS, 'stroke-width': 4, 'stroke-linecap': 'round' });
    else if (pose === 'pensando') s += path('M66 62 q10 -6 20 0 M114 60 q10 -4 20 2', 'none', { stroke: LIS, 'stroke-width': 4, 'stroke-linecap': 'round' });
    // focinho
    s += path('M92 96 Q100 90 108 96 Q106 104 100 106 Q94 104 92 96Z', '#FF6F91');
    var boca;
    if (pose === 'feliz') boca = path('M84 108 Q100 132 116 108 Q100 116 84 108Z', '#8A2B3B') + path('M92 118 Q100 124 108 118 Q100 128 92 118Z', '#FF8FA8');
    else if (pose === 'ops') boca = path('M88 118 q6 -6 12 0 q6 6 12 0', 'none', { stroke: '#5B2A1A', 'stroke-width': 3.5, 'stroke-linecap': 'round' });
    else if (pose === 'pensando') boca = path('M94 116 q6 2 12 -1', 'none', { stroke: '#5B2A1A', 'stroke-width': 3.5, 'stroke-linecap': 'round' });
    else boca = path('M100 106 v6 M86 112 q7 8 14 0 q7 8 14 0', 'none', { stroke: '#5B2A1A', 'stroke-width': 3.5, 'stroke-linecap': 'round' });
    s += boca;
    s += circ(72, 108, 1.8, LIS) + circ(66, 112, 1.8, LIS) + circ(128, 108, 1.8, LIS) + circ(134, 112, 1.8, LIS);
    if (pose === 'ops') s += path('M150 60 q6 10 0 14 q-6 -4 0 -14Z', '#8FD3FF');
    // capacete
    s += path('M52 48 Q56 8 100 6 Q144 8 148 48Z', '#FFD23F') + path('M60 44 Q64 16 100 14', 'none', { stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.45, 'stroke-linecap': 'round' }) +
      rr(40, 44, 120, 10, 5, '#F2B200') + rr(92, 6, 16, 40, 6, '#F2B200') + circ(100, 26, 5, '#FF3D8B');
    s += '</g>';
    var cls = 'kai kai-' + pose + (o.cls ? ' ' + o.cls : '');
    return '<svg class="' + cls + '" viewBox="0 0 200 222" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g class="kai-corpo">' + s + '</g></svg>';
  }

  // ------------------------------------------------------------ bandeiras (3:2)
  function estrela5(cx, cy, r, cor, rot) {
    var p = [], a0 = -Math.PI / 2 + (rot || 0);
    for (var i = 0; i < 10; i++) {
      var rr_ = i % 2 === 0 ? r : r * 0.382, a = a0 + i * Math.PI / 5;
      p.push(r1(cx + rr_ * Math.cos(a)) + ',' + r1(cy + rr_ * Math.sin(a)));
    }
    return poly(p.join(' '), cor);
  }
  function estrelaN(cx, cy, r, ri, n, cor) {
    var p = [];
    for (var i = 0; i < n * 2; i++) {
      var rr_ = i % 2 === 0 ? r : ri, a = -Math.PI / 2 + i * Math.PI / n;
      p.push(Math.round((cx + rr_ * Math.cos(a)) * 100) / 100 + ',' + Math.round((cy + rr_ * Math.sin(a)) * 100) / 100);
    }
    return poly(p.join(' '), cor);
  }
  var BANDEIRAS = {
    KOR: function () {
      var t = '<g transform="rotate(33.7 15 10)">' + circ(15, 10, 5, '#0047A0') + path('M10 10 A5 5 0 0 1 20 10 A2.5 2.5 0 0 1 15 10 A2.5 2.5 0 0 0 10 10Z', '#CD2E3A') + '</g>';
      var tri = function (x, y, ang) { return '<g transform="rotate(' + ang + ' ' + x + ' ' + y + ')">' + rect(x - 2.5, y - 2.2, 5, 1, '#000') + rect(x - 2.5, y - 0.5, 5, 1, '#000') + rect(x - 2.5, y + 1.2, 5, 1, '#000') + '</g>'; };
      return rect(0, 0, 30, 20, '#FFFFFF') + t + tri(6.2, 4.4, -56.3) + tri(23.8, 15.6, -56.3) + tri(23.8, 4.4, 56.3) + tri(6.2, 15.6, 56.3);
    },
    TWN: function () {
      return rect(0, 0, 30, 20, '#FE0000') + rect(0, 0, 15, 10, '#000095') + estrelaN(7.5, 5, 3.8, 2.1, 12, '#FFFFFF') + circ(7.5, 5, 2.05, '#000095') + circ(7.5, 5, 1.75, '#FFFFFF');
    },
    HKG: function () {
      var p = '';
      for (var i = 0; i < 5; i++) p += '<g transform="rotate(' + (i * 72) + ' 15 10)">' + path('M15 10 Q12.2 6.2 15 3.6 Q17.8 5.6 15 10Z', '#FFFFFF') + estrela5(15, 6.2, 0.7, '#DE2910') + '</g>';
      return rect(0, 0, 30, 20, '#DE2910') + p;
    },
    SGP: function () {
      var st = '';
      for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; st += estrela5(9.2 + 2.2 * Math.cos(a), 5.2 + 2.2 * Math.sin(a), 0.75, '#FFFFFF'); }
      return rect(0, 0, 30, 10, '#EF3340') + rect(0, 10, 30, 10, '#FFFFFF') + circ(5.5, 5, 3.4, '#FFFFFF') + circ(6.9, 5, 3.2, '#EF3340') + st;
    },
    MYS: function () {
      var s = '';
      for (var i = 0; i < 14; i++) s += rect(0, i * 20 / 14, 30, 20 / 14 + 0.05, i % 2 ? '#FFFFFF' : '#CC0001');
      return s + rect(0, 0, 15, 20 * 8 / 14, '#010066') + circ(5.8, 5.7, 3.6, '#FFCC00') + circ(6.9, 5.7, 3.1, '#010066') + estrelaN(10.6, 5.7, 2.6, 1.1, 14, '#FFCC00');
    },
    THA: function () { return rect(0, 0, 30, 20, '#A51931') + rect(0, 3.33, 30, 13.34, '#F4F5F8') + rect(0, 6.67, 30, 6.66, '#2D2A4A'); },
    IDN: function () { return rect(0, 0, 30, 10, '#FF0000') + rect(0, 10, 30, 10, '#FFFFFF'); },
    PHL: function () {
      var raios = '';
      for (var i = 0; i < 8; i++) raios += '<g transform="rotate(' + (i * 45) + ' 6 10)">' + poly('6,5.2 5.3,7.4 6.7,7.4', '#FCD116') + '</g>';
      return rect(0, 0, 30, 10, '#0038A8') + rect(0, 10, 30, 10, '#CE1126') + poly('0,0 17.3,10 0,20', '#FFFFFF') + raios + circ(6, 10, 1.9, '#FCD116') +
        estrela5(1.8, 2.6, 0.9, '#FCD116') + estrela5(1.8, 17.4, 0.9, '#FCD116') + estrela5(14.6, 10, 0.9, '#FCD116');
    },
    VNM: function () { return rect(0, 0, 30, 20, '#DA251D') + estrela5(15, 10.4, 6, '#FFFF00'); },
    IND: function () {
      var r = '';
      for (var i = 0; i < 24; i++) r += line(15, 10, 15 + 2.7 * Math.cos(i * Math.PI / 12), 10 + 2.7 * Math.sin(i * Math.PI / 12), '#000080', 0.25);
      return rect(0, 0, 30, 6.67, '#FF9933') + rect(0, 6.67, 30, 6.66, '#FFFFFF') + rect(0, 13.33, 30, 6.67, '#138808') + circ(15, 10, 2.9, 'none', { stroke: '#000080', 'stroke-width': 0.5 }) + r + circ(15, 10, 0.6, '#000080');
    },
    BGD: function () { return rect(0, 0, 30, 20, '#006A4E') + circ(13.5, 10, 6, '#F42A41'); },
    JPN: function () { return rect(0, 0, 30, 20, '#FFFFFF') + circ(15, 10, 6, '#BC002D'); },
    CHN: function () {
      return rect(0, 0, 30, 20, '#EE1C25') + estrela5(5, 5, 3, '#FFFF00') + estrela5(10, 2, 1, '#FFFF00', 0.9) + estrela5(12, 4, 1, '#FFFF00', 0.4) + estrela5(12, 7, 1, '#FFFF00', 0) + estrela5(10, 9, 1, '#FFFF00', 0.3);
    },
    BRA: function () {
      return rect(0, 0, 30, 20, '#009C3B') + poly('15,1.7 28.3,10 15,18.3 1.7,10', '#FFDF00') + circ(15, 10, 5.25, '#002776') +
        path('M9.9 9.1 Q15 7.4 20.1 10.9', 'none', { stroke: '#FFFFFF', 'stroke-width': 0.9 }) + circ(13, 12, 0.35, '#FFFFFF') + circ(16.5, 12.6, 0.35, '#FFFFFF') + circ(15.2, 13.8, 0.3, '#FFFFFF') + circ(17.8, 11.6, 0.3, '#FFFFFF');
    },
    USA: function () {
      var s = '';
      for (var i = 0; i < 13; i++) s += rect(0, i * 20 / 13, 30, 20 / 13 + 0.05, i % 2 ? '#FFFFFF' : '#B22234');
      s += rect(0, 0, 12, 20 * 7 / 13, '#3C3B6E');
      for (var y = 0; y < 5; y++) for (var x = 0; x < 6; x++) s += circ(1 + x * 2, 1.1 + y * 2.1, 0.35, '#FFFFFF');
      return s;
    }
  };
  function bandeira(cod, o) {
    o = o || {};
    var f = BANDEIRAS[cod];
    if (!f) return '';
    var id = U('bd');
    return '<svg class="bandeira' + (o.cls ? ' ' + o.cls : '') + '" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bandeira: ' + (o.nome || cod) + '">' +
      '<clipPath id="' + id + '"><rect width="30" height="20" rx="2"/></clipPath><g clip-path="url(#' + id + ')">' + f() + '</g>' +
      '<rect x="0.25" y="0.25" width="29.5" height="19.5" rx="2" fill="none" stroke="#1C1840" stroke-opacity="0.18" stroke-width="0.5"/></svg>';
  }
  function bandeiraG(cod, x, y, w) { // bandeira embutida em outro SVG
    var f = BANDEIRAS[cod];
    if (!f) return '';
    var s = w / 30;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + rect(-0.6, -0.6, 31.2, 21.2, '#FFFFFF', { rx: 2 }) + f() + '</g>';
  }

  // ------------------------------------------------------------ ícones (24x24, traço)
  var IC = {
    casa: '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    som: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    mudo: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/>',
    musica: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    semMusica: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M3 3l18 18"/>',
    estrela: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    trofeu: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 20h8"/>',
    relogio: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    lampada: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.7 1 2.5h6c0-.8.2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    mapa: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    voltar: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    fogo: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
    raio: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    equipes: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 20c0-2.5 1.2-4.5 3-5 2.2 0 4 2 4 5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    livro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    repetir: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    menos: '<path d="M5 12h14"/>',
    alvo: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    camadas: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    conteiner: '<rect x="3" y="7" width="18" height="11" rx="1"/><path d="M7 7v11M11 7v11M15 7v11M19 7v11"/>',
    navio: '<path d="M3 15h18l-2 5H5z"/><path d="M6 15V9h6v6M12 11h6v4M9 9V5"/>',
    certificado: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M7 8h10M7 11h6"/><circle cx="16" cy="17" r="3"/><path d="m14.5 19.5-.5 3 2-1 2 1-.5-3"/>',
    tela: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    imprimir: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="1"/><path d="M7 14h10v7H7z"/>',
    tabela: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M3 15h18M10 4v16"/>',
    ajuda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.8-2.5 2-2.5 4M12 17v.5"/>',
    pausa: '<path d="M8 5v14M16 5v14"/>',
    tela_cheia: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  function icone(nome, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (IC[nome] || '') + '</svg>';
  }

  window.Arte = {
    U: U, rect: rect, rr: rr, circ: circ, ell: ell, path: path, line: line, poly: poly, txt: txt, g: g, tr: tr, lg: lg, rg: rg, svg: svg, rnd: rnd,
    ceu: ceu, sol: sol, lua: lua, nuvem: nuvem, estrelas: estrelas, montanhas: montanhas, colinas: colinas, mar: mar, arvore: arvore, palmeira: palmeira,
    predio: predio, casaTelhado: casaTelhado, cabana: cabana, fabrica: fabrica, guindaste: guindaste, conteiner: conteiner, pilhaConteineres: pilhaConteineres,
    navio: navio, barquinho: barquinho, pessoa: pessoa, PELES: PELES, CORES_CONT: CORES_CONT,
    moeda: moeda, engrenagem: engrenagem, lampada: lampada, seta: seta, setaCurva: setaCurva, etiqueta: etiqueta, placa: placa, saca: saca, caixa: caixa,
    globo: globo, chipIcone: chipIcone, raio: raio, alerta: alerta, estrela5: estrela5,
    kai: kai, bandeira: bandeira, bandeiraG: bandeiraG, icone: icone
  };
})();
