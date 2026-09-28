/* Ilustrações das questões e das fases (SVG desenhado no próprio jogo).
   Cada função devolve um <svg> pronto. Para usar em uma questão:
   visual: { tipo: 'ilustracao', nome: 'arrozal' } */
(function () {
  var A = window.Arte;
  var P = A.PELES;

  function brotos(y0, amp, cor) {
    var s = '';
    for (var x = 8; x < 480; x += 17) {
      var y = y0 - amp * Math.sin(x / 76);
      s += A.path('M' + x + ' ' + y + ' l-3 -8 M' + x + ' ' + y + ' l0 -10 M' + x + ' ' + y + ' l3 -8', 'none', { stroke: cor || '#2F7D32', 'stroke-width': 1.7, 'stroke-linecap': 'round' });
    }
    return s;
  }
  function chao(y, cor) { return A.rect(0, y, 480, 300 - y, cor); }
  function titulo(x, y, t, cor, fundo) { return A.etiqueta(x, y, t, fundo || '#1C1840', { cor: cor || '#FFFFFF', size: 12 }); }

  var I = {};

  /* ------------------------------------------------------------ FASE 1 */
  I.arrozal = function () {
    var d = [], s = A.ceu(d, '#9FDBFF', '#FFF4D6');
    s += A.sol(404, 62, 26, '#FFD23F', '#FFE9A0');
    s += A.nuvem(52, 52, 1) + A.nuvem(236, 36, 0.8);
    s += A.montanhas(168, '#9AD0B4', [[0, 40], [60, 88], [130, 52], [205, 98], [275, 58], [345, 104], [420, 62], [480, 84]]);
    s += A.montanhas(186, '#72B98F', [[0, 34], [90, 74], [170, 42], [262, 80], [352, 38], [480, 70]]);
    var cores = ['#9AD86F', '#83CC5D', '#6CBF4F', '#56B044', '#44A03C'];
    for (var i = 0; i < 5; i++) {
      var y = 176 + i * 25;
      s += A.path('M0 ' + (y + 8) + ' Q120 ' + (y - 12) + ' 240 ' + (y + 4) + ' T480 ' + (y - 4) + ' L480 300 L0 300Z', cores[i]);
      s += A.path('M0 ' + (y + 8) + ' Q120 ' + (y - 12) + ' 240 ' + (y + 4) + ' T480 ' + (y - 4), 'none', { stroke: '#C9F0FF', 'stroke-width': 3, opacity: 0.75 });
      s += brotos(y + 22, 4, '#2E7A31');
    }
    s += A.pessoa(300, 262, 1.3, { chapeu: 'conico', roupa: '#E94F4F', calca: '#3A3F5C', inclina: 26, bracoE: 70, bracoD: 44, pele: P[1] });
    s += A.pessoa(146, 236, 1, { chapeu: 'conico', roupa: '#3E6DE0', calca: '#2B2D42', inclina: 18, bracoE: 55, bracoD: 30, pele: P[0] });
    s += A.tr(360, 262, 1, A.path('M-14 0 L-10 -18 L10 -18 L14 0Z', '#C99A4B') + A.path('M-10 -12 H10 M-12 -6 H12', 'none', { stroke: '#9C7430', 'stroke-width': 1.5 }) + A.path('M-6 -18 l-2 -8 M0 -18 v-9 M6 -18 l2 -8', 'none', { stroke: '#3B963A', 'stroke-width': 2, 'stroke-linecap': 'round' }));
    s += A.path('M70 80 q5 -5 10 0 q5 -5 10 0 M100 96 q4 -4 8 0 q4 -4 8 0', 'none', { stroke: '#4A5578', 'stroke-width': 2, 'stroke-linecap': 'round', class: 'an-voo' });
    return A.svg(s, d.join(''));
  };

  I.aldeia = function () {
    var d = [], s = A.ceu(d, '#FFE3B8', '#FFF7E6');
    s += A.sol(90, 70, 22, '#FFB547', '#FFD591');
    s += A.montanhas(150, '#C7B7A3', [[0, 30], [80, 70], [160, 40], [250, 82], [340, 46], [420, 76], [480, 50]]);
    s += A.casaTelhado(300, 150, 1.25, '#F4E1C1', '#5A4035') + A.casaTelhado(372, 146, 1, '#F1DDBB', '#6B4A3A') + A.cabana(430, 152, 1);
    s += A.arvore(250, 152, 1.2, '#3FA35B') + A.arvore(460, 150, 1, '#2F8F4E');
    s += chao(150, '#8FC7B8');
    s += A.rect(0, 150, 480, 150, '#7FC2D9', { opacity: 0.55 });
    for (var i = 0; i < 6; i++) s += A.path('M' + (20 + i * 80) + ' ' + (190 + (i % 2) * 40) + ' q16 -6 32 0', 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.5, 'stroke-linecap': 'round' });
    s += brotos(290, 3, '#2E7A31');
    // búfalo
    var buf = A.ell(0, 0, 46, 24, '#5E6B82') + A.ell(-8, -6, 30, 12, '#6F7C94') + A.rect(-34, 12, 10, 26, '#56627A', { rx: 4 }) + A.rect(-12, 14, 10, 24, '#56627A', { rx: 4 }) + A.rect(14, 14, 10, 24, '#56627A', { rx: 4 }) + A.rect(30, 12, 10, 26, '#56627A', { rx: 4 }) +
      A.ell(-50, -6, 16, 14, '#5E6B82') + A.path('M-60 -16 Q-80 -30 -66 -40 Q-70 -28 -56 -22Z M-44 -18 Q-26 -34 -38 -44 Q-36 -30 -50 -22Z', '#E9E1D2') + A.circ(-54, -8, 2, '#1C1840') + A.path('M44 -6 q14 6 10 26', 'none', { stroke: '#5E6B82', 'stroke-width': 4, 'stroke-linecap': 'round' });
    s += A.tr(170, 228, 1, buf, { class: 'an-balanca' });
    s += A.path('M218 222 L300 232 L312 256', 'none', { stroke: '#8A5A3B', 'stroke-width': 5, 'stroke-linecap': 'round' });
    s += A.pessoa(330, 262, 1.25, { chapeu: 'conico', roupa: '#2E9E6B', calca: '#3A3F5C', inclina: 10, bracoE: 60, bracoD: 50, pele: P[2] });
    s += A.rect(0, 262, 480, 38, '#7FC2D9', { opacity: 0.35 });
    return A.svg(s, d.join(''));
  };

  I.navioColonial = function () {
    var d = [], s = A.ceu(d, '#FFD9A8', '#FFF1DC');
    s += A.nuvem(330, 48, 0.9, '#FFFFFF') + A.nuvem(60, 70, 0.7, '#FFFFFF');
    s += A.mar(d, 190, '#4FB3E8', '#2A7FC2');
    // navio a vela
    var nav = A.path('M-90 0 L90 0 L70 34 L-78 34Z', '#6B3E26') + A.rect(-90, 0, 180, 6, '#8A5A3B') + A.path('M-78 20 H70', 'none', { stroke: '#4A2A18', 'stroke-width': 2 }) +
      A.rect(-44, -120, 5, 120, '#5B3A29') + A.rect(6, -140, 5, 140, '#5B3A29') + A.rect(54, -100, 5, 100, '#5B3A29') +
      A.path('M-40 -112 Q-10 -90 -40 -30 Z M-39 -112 Q-78 -80 -39 -30Z', '#FFF4DE') + A.path('M9 -132 Q46 -100 9 -40 Z M10 -132 Q-26 -96 10 -40Z', '#FFF8EA') + A.path('M57 -92 Q84 -70 57 -26Z', '#FFF4DE') +
      A.path('M11 -140 l18 6 -18 6Z', '#E94F4F');
    s += A.tr(150, 196, 1, nav, { class: 'an-balanca' });
    // cais
    s += A.rect(270, 196, 210, 16, '#8A5A3B') + A.rect(280, 212, 8, 50, '#6B4A3A') + A.rect(360, 212, 8, 50, '#6B4A3A') + A.rect(440, 212, 8, 50, '#6B4A3A');
    s += A.saca(300, 196, 1.1, 'ARROZ', '#EFDDB5') + A.saca(334, 196, 1.1, 'CHÁ', '#D8E8B8') + A.saca(318, 170, 1.1, 'SEDA', '#F6D2E0');
    s += A.caixa(360, 168, 40, 28, '#C98E4F', 'ESPECIARIAS', 6) + A.caixa(410, 172, 44, 24, '#8C96A8', 'MINÉRIOS', 7);
    s += A.pessoa(460, 196, 0.95, { chapeu: 'conico', roupa: '#C9A15B', calca: '#5B4A3A', bracoE: -140, bracoD: 140, pele: P[2] });
    s += A.saca(460, 132, 0.8, '', '#EFDDB5');
    s += A.seta(40, 150, 90, 150, '#1C1840', 3) + A.placa(52, 132, 'EUROPA', { size: 9 });
    return A.svg(s, d.join(''));
  };

  I.trocaDesigual = function () {
    var d = [], s = A.ceu(d, '#FFF3E0', '#FFE7F0');
    // balança
    s += A.rect(236, 70, 8, 170, '#5B4A6B') + A.path('M200 250 H280 L260 236 H220Z', '#5B4A6B');
    var brac = A.rect(-150, -4, 300, 8, '#7A5E91', { rx: 4 }) + A.circ(0, 0, 9, '#FFD23F') +
      A.line(-140, 0, -175, 70, '#7A5E91', 2) + A.line(-140, 0, -105, 70, '#7A5E91', 2) + A.path('M-190 70 H-90 Q-100 92 -140 92 Q-180 92 -190 70Z', '#C7B6E0') +
      A.line(140, 0, 105, 70, '#7A5E91', 2) + A.line(140, 0, 175, 70, '#7A5E91', 2) + A.path('M90 70 H190 Q180 92 140 92 Q100 92 90 70Z', '#C7B6E0') +
      A.saca(-170, 70, 0.8, 'ARROZ', '#EFDDB5') + A.saca(-146, 70, 0.8, 'CHÁ', '#D8E8B8') + A.saca(-122, 70, 0.8, 'SEDA', '#F6D2E0') + A.saca(-158, 48, 0.8, '', '#EFDDB5') + A.saca(-134, 48, 0.8, '', '#D8E8B8') + A.saca(-110, 70, 0.8, '', '#E8D2A6') +
      A.engrenagem(128, 52, 12, '#6B7A99', 'an-gira-lento') + A.rr(146, 42, 26, 26, 4, '#3E6DE0') + A.rect(150, 46, 18, 12, '#8FD3FF');
    s += A.tr(240, 78, 1, '<g transform="rotate(-9)">' + brac + '</g>');
    s += A.etiqueta(96, 206, 'Vende barato: matérias-primas', '#12A277', { size: 11 });
    s += A.etiqueta(376, 206, 'Compra caro: industrializados', '#E94F4F', { size: 11 });
    s += A.txt(96, 236, 'COLÔNIA', 16, '#1C1840', { 'font-family': 'Bungee, "Arial Black", sans-serif', 'font-weight': 400 });
    s += A.txt(376, 236, 'METRÓPOLE', 16, '#1C1840', { 'font-family': 'Bungee, "Arial Black", sans-serif', 'font-weight': 400 });
    s += A.moeda(70, 262, 9) + A.moeda(350, 262, 9) + A.moeda(372, 262, 9) + A.moeda(394, 262, 9) + A.moeda(416, 262, 9);
    return A.svg(s, d.join(''));
  };

  I.terras = function () {
    var d = [], s = A.ceu(d, '#CFEFFF', '#F2FBFF');
    s += A.rect(20, 40, 440, 240, '#8FCB6A', { rx: 10 });
    // grande propriedade
    s += A.rect(30, 50, 300, 220, '#E7C75A', { rx: 6 });
    for (var i = 0; i < 12; i++) s += A.line(40, 62 + i * 17, 320, 62 + i * 17, '#CFAE3F', 3, { opacity: 0.8 });
    s += A.rect(30, 50, 300, 220, 'none', { rx: 6, stroke: '#8A5A3B', 'stroke-width': 4, 'stroke-dasharray': '10 6' });
    s += A.tr(180, 170, 1.4, A.rect(-30, -26, 60, 26, '#FFFFFF') + A.poly('-36,-24 0,-48 36,-24', '#C94F4F') + A.rect(-8, -16, 16, 16, '#8A5A3B') + A.rect(-24, -20, 10, 8, '#8FD3FF') + A.rect(14, -20, 10, 8, '#8FD3FF'));
    s += A.pessoa(250, 150, 1.1, { roupa: '#FFD23F', calca: '#5B4A3A', pele: P[0], chapeu: null, bracoE: 30, bracoD: -30 });
    s += A.etiqueta(180, 238, 'Poucos donos: muita terra', '#1C1840', { size: 12 });
    // lotes pequenos
    var cores = ['#6FBF4A', '#83CC5D', '#5DB84C', '#9AD86F'];
    for (var r = 0; r < 5; r++) for (var c = 0; c < 3; c++) {
      var x = 342 + c * 38, y = 52 + r * 40;
      s += A.rect(x, y, 34, 36, cores[(r + c) % 4], { rx: 3 });
      s += A.pessoa(x + 17, y + 32, 0.42, { chapeu: 'conico', roupa: ['#E94F4F', '#3E6DE0', '#12A277'][(r * 3 + c) % 3], pele: P[(r + c) % 4] });
    }
    s += A.etiqueta(398, 268, 'Muitos camponeses', '#1C1840', { size: 11 });
    return A.svg(s, d.join(''));
  };

  I.feira = function () {
    var d = [], s = A.ceu(d, '#FFE3B8', '#FFF6E8');
    s += chao(230, '#D9B98C');
    s += A.rect(80, 70, 320, 20, '#E94F4F') + A.path('M80 90 q20 16 40 0 q20 16 40 0 q20 16 40 0 q20 16 40 0 q20 16 40 0 q20 16 40 0 q20 16 40 0 q20 16 40 0', '#E94F4F');
    for (var i = 0; i < 8; i++) s += A.path('M' + (80 + i * 40) + ' 90 q20 16 40 0', 'none', { stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.6 });
    s += A.rect(96, 90, 8, 150, '#8A5A3B') + A.rect(376, 90, 8, 150, '#8A5A3B');
    s += A.rect(100, 180, 280, 60, '#B8844F') + A.rect(100, 180, 280, 8, '#8A5A3B');
    s += A.saca(140, 182, 1.2, 'ARROZ', '#EFDDB5') + A.saca(180, 182, 1.2, 'ARROZ', '#EFDDB5') + A.saca(160, 152, 1.2, 'ARROZ', '#EFDDB5');
    s += A.tr(262, 182, 1, A.path('M-26 0 L-20 -30 H20 L26 0Z', '#C99A4B') + A.ell(0, -30, 22, 8, '#4E9E3E') + A.circ(-8, -34, 6, '#5DB84C') + A.circ(6, -35, 7, '#4AA743') + A.txt(0, -10, 'CHÁ', 9, '#5B3A1A'));
    s += A.saca(330, 182, 1.2, 'ARROZ', '#EFDDB5');
    s += A.placa(240, 52, 'ARROZ • CHÁ', { size: 13, fundo: '#FFF8E6' });
    s += A.pessoa(240, 176, 1.1, { chapeu: 'conico', roupa: '#3E6DE0', pele: P[1], bracoE: 20, bracoD: -60 });
    s += A.pessoa(52, 262, 1.2, { roupa: '#12A277', pele: P[0], cabeloLongo: true, bracoE: 10, bracoD: -10 });
    s += A.pessoa(430, 262, 1.15, { chapeu: 'conico', roupa: '#8250E0', pele: P[2], espelho: true });
    return A.svg(s, d.join(''));
  };

  /* ------------------------------------------------------------ FASE 2 */
  I.tigreSalto = function () {
    var d = [], s = A.ceu(d, '#2A1466', '#FF3D8B');
    s += A.estrelas(40, 11, 480, 170);
    var cores = ['#FF8A1F', '#FF8A1F', '#FFB400', '#FFD23F', '#FFD23F'];
    for (var i = 0; i < 5; i++) s += A.rect(70 + i * 72, 260 - (i + 1) * 36, 50, (i + 1) * 36, cores[i], { rx: 6, opacity: 0.92, class: 'an-cresce', style: 'animation-delay:' + (i * 0.12) + 's' });
    s += A.seta(40, 236, 250, 60, '#FFFFFF', 6);
    for (var k = 0; k < 4; k++) s += A.line(250 + k * 10, 150 + k * 16, 290 + k * 10, 150 + k * 16, '#FFFFFF', 4, { opacity: 0.45 });
    s += A.rect(0, 260, 480, 40, '#1C1840');
    var kai = A.kai('feliz').replace('<svg', '<svg x="292" y="52" width="170" height="189"');
    s += '<g class="an-salto">' + kai + '</g>';
    return A.svg(s, d.join(''));
  };

  I.guerraFria = function () {
    var d = [], s = A.ceu(d, '#EAF2FF', '#FFF0F3');
    s += A.path('M240 20 V280', 'none', { stroke: '#1C1840', 'stroke-width': 3, 'stroke-dasharray': '8 8', opacity: 0.4 });
    s += A.rect(20, 30, 190, 90, '#3E6DE0', { rx: 14 }) + A.bandeiraG('USA', 36, 46, 48) + A.txt(145, 72, 'EUA', 22, '#FFFFFF', { 'font-family': 'Bungee, "Arial Black", sans-serif', 'font-weight': 400 }) + A.txt(115, 104, 'Bloco capitalista', 13, '#FFFFFF');
    s += A.rect(270, 30, 190, 90, '#E94F4F', { rx: 14 }) + A.estrela5(308, 68, 18, '#FFD23F') + A.txt(395, 72, 'URSS', 22, '#FFFFFF', { 'font-family': 'Bungee, "Arial Black", sans-serif', 'font-weight': 400 }) + A.txt(365, 104, 'Bloco socialista', 13, '#FFFFFF');
    var cods = ['KOR', 'TWN', 'HKG', 'SGP'];
    for (var i = 0; i < 4; i++) {
      var x = 34 + i * 44;
      s += A.seta(115, 126, x + 18, 196, '#3E6DE0', 3);
      s += A.fabrica(x, 262, 0.26, '#FFFFFF', { telhado: '#F26B21', fumaca: false }) + A.bandeiraG(cods[i], x + 6, 228, 24);
    }
    s += A.etiqueta(116, 286, 'Apoio aos Tigres', '#F26B21', { size: 11 });
    s += A.tr(360, 206, 1, A.rect(-60, -40, 120, 70, '#FFFFFF', { rx: 10, opacity: 0.8 }) + A.txt(0, -14, 'China · Coreia do Norte', 10, '#1C1840') + A.txt(0, 4, 'Vietnã do Norte', 10, '#1C1840') + A.txt(0, 22, 'regimes socialistas', 10, '#E94F4F'));
    return A.svg(s, d.join(''));
  };

  I.japaoInveste = function () {
    var d = [], s = A.ceu(d, '#FFF5F7', '#E6F4FF');
    s += A.circ(90, 140, 66, '#FFFFFF') + A.circ(90, 140, 66, 'none', { stroke: '#BC002D', 'stroke-width': 3, opacity: 0.25 }) + A.circ(90, 140, 30, '#BC002D', { class: 'an-pulsa', style: 'transform-origin:90px 140px' });
    s += A.txt(90, 232, 'JAPÃO', 18, '#1C1840', { 'font-family': 'Bungee, "Arial Black", sans-serif', 'font-weight': 400 });
    var itens = [['Capital', '#FFB400'], ['Tecnologia', '#19C3E6'], ['Peças', '#8250E0']];
    for (var i = 0; i < 3; i++) s += A.seta(160, 96 + i * 44, 280, 96 + i * 44, itens[i][1], 5, { cls: 'an-flui' }) + A.etiqueta(220, 84 + i * 44, itens[i][0], itens[i][1], { size: 10, cor: '#1C1840' });
    var cods = ['KOR', 'TWN', 'HKG', 'SGP'];
    for (var k = 0; k < 4; k++) {
      var x = 300 + (k % 2) * 86, y = 118 + Math.floor(k / 2) * 92;
      s += A.fabrica(x, y, 0.42, '#FFFFFF', { telhado: '#F26B21', fumaca: k % 2 === 0 }) + A.bandeiraG(cods[k], x + 4, y + 6, 26);
    }
    s += A.moeda(210, 250, 12, '¥') + A.moeda(240, 262, 10, '¥') + A.moeda(186, 266, 9, '¥');
    return A.svg(s, d.join(''));
  };

  I.exportacao = function () {
    var d = [], s = A.ceu(d, '#FF9E7A', '#FFE3B8');
    s += A.sol(380, 150, 30, '#FFE066', '#FFF1A8');
    s += A.mar(d, 170, '#2E9BD6', '#1B5E9C');
    s += A.navio(260, 190, 1, { camadas: 3, seed: 9, cls: 'an-navega' });
    s += A.barquinho(110, 230, 1, '#FF3D8B');
    s += A.rect(0, 150, 90, 150, '#5B6C8F') + A.guindaste(20, 150, 0.7, '#FFB400');
    s += A.tr(420, 110, 1, A.rect(-2, 0, 4, 60, '#5B3A29') + A.placa(0, 8, '→ EUA', { size: 9 }) + A.placa(0, 26, '→ JAPÃO', { size: 9 }) + A.placa(0, 44, '→ EUROPA', { size: 9 }));
    return A.svg(s, d.join(''));
  };

  I.escola = function () {
    var d = [], s = A.ceu(d, '#FFF6E0', '#FFEFD0');
    s += A.rect(0, 0, 480, 200, '#FDEBC8') + chao(200, '#D9A566');
    s += A.rect(90, 28, 300, 110, '#2F5D50', { rx: 6 }) + A.rect(84, 22, 312, 122, 'none', { rx: 8, stroke: '#8A5A3B', 'stroke-width': 8 });
    s += A.txt(170, 70, 'E = m·c²', 16, '#FFFFFF', { 'font-family': '"Comic Sans MS", Lexend, sans-serif', 'font-weight': 400 }) + A.txt(170, 100, '2x + 3 = 11', 14, '#FFFFFF', { 'font-family': '"Comic Sans MS", Lexend, sans-serif', 'font-weight': 400 });
    s += A.tr(310, 80, 1, A.circ(0, 0, 30, '#FFFFFF', { opacity: 0.15 }) + A.path('M-18 -8 q10 -12 22 -4 q8 10 -6 18 q-10 4 -16 -14Z', '#FFFFFF', { opacity: 0.6 }));
    s += A.pessoa(420, 200, 1.45, { roupa: '#8250E0', calca: '#2B2D42', cabeloLongo: true, pele: P[1], bracoE: 20, bracoD: -120, oculos: true });
    for (var i = 0; i < 3; i++) {
      var x = 90 + i * 110;
      s += A.pessoa(x, 268, 1.05, { roupa: ['#FFFFFF', '#FFFFFF', '#FFFFFF'][i], calca: '#1F3A6E', pele: P[i], cabeloLongo: i === 1, bracoE: 30, bracoD: -30 });
      s += A.rect(x - 34, 236, 68, 10, '#B8844F') + A.rect(x - 30, 246, 6, 30, '#8A5A3B') + A.rect(x + 24, 246, 6, 30, '#8A5A3B') + A.rect(x - 18, 228, 26, 8, ['#E94F4F', '#3E6DE0', '#12A277'][i]);
    }
    s += A.tr(430, 250, 1, A.path('M-26 0 L0 -12 L26 0 L0 12Z', '#1C1840') + A.rect(-14, 2, 28, 12, '#1C1840') + A.line(20, 2, 20, 18, '#FFD23F', 2) + A.circ(20, 19, 3, '#FFD23F'));
    return A.svg(s, d.join(''));
  };

  I.jointVenture = function () {
    var d = [], s = A.ceu(d, '#E8F7FF', '#F6F0FF');
    s += chao(250, '#C9D6EA');
    s += A.predio(30, 250, 110, 170, '#F26B21', { gx: 12, gy: 14, janelaW: 7, janelaH: 8, acesa: 0.7, luz: '#FFF2C6' }) + A.placa(85, 64, 'EMPRESA LOCAL', { size: 9 });
    s += A.predio(340, 250, 110, 190, '#3E6DE0', { gx: 12, gy: 14, janelaW: 7, janelaH: 8, acesa: 0.7, luz: '#DDF4FF', antena: true }) + A.placa(395, 44, 'EMPRESA ESTRANGEIRA', { size: 9 });
    // aperto de mão
    s += A.tr(240, 170, 1.2, A.path('M-70 0 H-20 L0 -8 L10 4 L-10 16 H-70Z', '#F26B21') + A.path('M70 0 H20 L0 -8 L-12 6 L6 18 H70Z', '#3E6DE0') +
      A.ell(-4, 6, 18, 12, '#F1C9A5') + A.path('M-14 0 q8 6 16 0 M-12 8 q8 6 16 0', 'none', { stroke: '#C98E62', 'stroke-width': 2 }));
    s += A.lampada(240, 86, 1.1) + A.engrenagem(196, 110, 12, '#8250E0') + A.engrenagem(286, 108, 10, '#12A277');
    s += A.etiqueta(240, 230, 'JOINT VENTURE', '#1C1840', { size: 13 });
    return A.svg(s, d.join(''));
  };

  I.fabricaLeve = function () {
    var d = [], s = A.ceu(d, '#FFE6C7', '#FFF7EC');
    s += chao(236, '#C8C2B8');
    s += A.fabrica(40, 236, 1.2, '#F4EAD9', { telhado: '#B8554A', chamine: '#8A5A3B', corFumaca: '#CFC8BE', placa: '1965' });
    // esteira
    s += A.rect(220, 206, 200, 10, '#44506B') + A.circ(230, 216, 6, '#2B2D42') + A.circ(410, 216, 6, '#2B2D42');
    s += A.g(A.caixa(236, 180, 36, 26, '#D9A566', 'ROUPAS', 6.5) + A.caixa(282, 180, 40, 26, '#E8B86B', 'CALÇADOS', 6.5) + A.caixa(332, 180, 46, 26, '#F2C57C', 'BRINQUEDOS', 6.5), { class: 'an-esteira' });
    // caminhão
    s += A.tr(430, 256, 0.9, A.rect(-40, -44, 60, 36, '#E94F4F') + A.rect(20, -34, 26, 26, '#C94F4F') + A.rect(26, -30, 14, 10, '#8FD3FF') + A.circ(-24, -6, 8, '#1C1840') + A.circ(30, -6, 8, '#1C1840') + A.txt(-10, -22, 'EXPORT', 9, '#FFFFFF'));
    s += A.tr(430, 170, 1, A.rect(-18, -18, 36, 24, '#FFFFFF', { rx: 4 }) + A.circ(-8, -8, 4, '#FF3D8B') + A.rect(0, -12, 12, 8, '#19C3E6') + A.circ(6, 0, 3, '#FFD23F'), { class: 'an-flutua' });
    return A.svg(s, d.join(''));
  };

  /* ------------------------------------------------------------ FASE 3 */
  I.chip = function () {
    var d = [], s = A.ceu(d, '#101B3D', '#1E2D5E');
    for (var i = 0; i < 14; i++) {
      var y = 20 + i * 20;
      s += A.path('M0 ' + y + ' H' + (60 + (i * 37) % 120) + ' l20 20 H' + (180 + (i * 53) % 90), 'none', { stroke: '#12A277', 'stroke-width': 2, opacity: 0.35 });
      s += A.path('M480 ' + (y + 6) + ' H' + (420 - (i * 41) % 110) + ' l-20 -20 H' + (300 - (i * 29) % 70), 'none', { stroke: '#19C3E6', 'stroke-width': 2, opacity: 0.3 });
    }
    s += A.circ(360, 90, 70, 'none', { stroke: '#8FA8FF', 'stroke-width': 1, opacity: 0.4 }) + A.circ(360, 90, 64, '#28356A', { opacity: 0.6 });
    for (var a = 0; a < 6; a++) for (var b = 0; b < 6; b++) { var xx = 322 + a * 13, yy = 52 + b * 13; if (Math.hypot(xx + 5 - 360, yy + 5 - 90) < 58) s += A.rect(xx, yy, 11, 11, '#6C7DD6', { opacity: 0.55 }); }
    s += A.chipIcone(200, 160, 1.7, '#232B4A');
    s += A.circ(200, 160, 90, '#19C3E6', { opacity: 0.08, class: 'an-pulsa', style: 'transform-origin:200px 160px' });
    s += A.etiqueta(370, 250, 'menos de 10 nm', '#19C3E6', { size: 12, cor: '#101B3D' });
    return A.svg(s, d.join(''));
  };

  I.porto = function () {
    var d = [], s = A.ceu(d, '#1B1452', '#FF7A59');
    s += A.estrelas(26, 5, 480, 90);
    s += A.predio(250, 190, 26, 90, '#2A2466', { acesa: 0.6 }) + A.predio(280, 190, 34, 120, '#342C7A', { acesa: 0.6, antena: true }) + A.predio(318, 190, 22, 70, '#2A2466') + A.predio(344, 190, 30, 104, '#3B3290') + A.predio(378, 190, 24, 80, '#2A2466') + A.predio(406, 190, 36, 136, '#342C7A', { antena: true }) + A.predio(446, 190, 34, 96, '#2A2466');
    s += A.mar(d, 190, '#2E6FB8', '#173E7A');
    s += A.rect(0, 176, 250, 24, '#5B6C8F');
    s += A.pilhaConteineres(20, 176, 5, 3, 22, 12, 21) + A.pilhaConteineres(150, 176, 3, 2, 22, 12, 4);
    s += A.guindaste(40, 176, 0.9, '#FFB400') + A.guindaste(150, 176, 0.9, '#FF3D8B');
    s += A.navio(300, 212, 0.95, { camadas: 3, seed: 14 });
    return A.svg(s, d.join(''));
  };

  I.zee = function () {
    var d = [], s = A.ceu(d, '#DDF6FF', '#FFF7E0');
    s += chao(236, '#BFE3A8');
    s += A.fabrica(210, 236, 0.75, '#FFFFFF', { telhado: '#19C3E6' }) + A.fabrica(330, 236, 0.6, '#FFFFFF', { telhado: '#8250E0', fumaca: false }) + A.guindaste(420, 236, 0.6, '#FFB400');
    // portal
    s += A.rect(40, 90, 12, 150, '#1C1840') + A.rect(178, 90, 12, 150, '#1C1840') + A.rect(30, 70, 170, 34, '#FF3D8B', { rx: 6 }) + A.txt(115, 86, 'ZONA ECONÔMICA', 11, '#FFFFFF') + A.txt(115, 99, 'ESPECIAL', 11, '#FFFFFF');
    s += A.etiqueta(275, 112, 'Impostos menores', '#12A277', { size: 11 }) + A.etiqueta(390, 140, 'Porto moderno', '#3E6DE0', { size: 11 });
    s += A.pessoa(100, 262, 1.2, { roupa: '#2B2D42', calca: '#2B2D42', maleta: true, pele: P[3], bracoE: 10, bracoD: -10 });
    s += A.moeda(150, 256, 11) + A.moeda(160, 240, 9) + A.seta(20, 256, 70, 256, '#F26B21', 4) + A.placa(40, 238, 'IED', { size: 10, fundo: '#FFD23F' });
    s += A.tr(80, 40, 0.9, A.path('M-30 0 L30 -6 L40 0 L30 6Z', '#FFFFFF') + A.path('M0 -2 L-12 -18 L-4 -18 L10 -2Z M0 2 L-12 16 L-4 16 L10 2Z', '#DDE3EE'), { class: 'an-voa' });
    return A.svg(s, d.join(''));
  };

  I.celularGlobal = function () {
    var d = [], s = A.ceu(d, '#F3EEFF', '#E3F7FF');
    s += A.rr(190, 40, 100, 200, 16, '#1C1840') + A.rr(198, 54, 84, 164, 6, '#19C3E6') + A.rect(198, 54, 84, 164, '#FFFFFF', { opacity: 0.18 }) + A.circ(240, 228, 5, '#3A3F5C');
    s += A.path('M210 80 h40 M210 94 h60 M210 108 h30', 'none', { stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 });
    var itens = [
      { t: 'Chip', p: 'TWN', n: 'Taiwan', x: 76, y: 70 },
      { t: 'Tela', p: 'KOR', n: 'Coreia do Sul', x: 404, y: 70 },
      { t: 'Montagem', p: 'VNM', n: 'Vietnã', x: 76, y: 206 },
      { t: 'Projeto', p: 'USA', n: 'EUA', x: 404, y: 206 }
    ];
    itens.forEach(function (it) {
      s += A.line(it.x, it.y, 240, 140, '#8250E0', 2, { 'stroke-dasharray': '5 6', opacity: 0.6 });
      s += A.rr(it.x - 62, it.y - 30, 124, 60, 12, '#FFFFFF') + A.bandeiraG(it.p, it.x - 52, it.y - 18, 30) + A.txt(it.x + 18, it.y - 6, it.t, 13, '#1C1840') + A.txt(it.x + 18, it.y + 12, it.n, 10, '#5A5675', { 'font-weight': 500 });
    });
    s += A.etiqueta(240, 272, 'Cadeia global de valor', '#8250E0', { size: 12 });
    return A.svg(s, d.join(''));
  };

  I.skyline = function () {
    var d = [], s = A.ceu(d, '#0F0B33', '#3A1C71');
    s += A.estrelas(40, 17, 480, 120) + A.lua(410, 50, 16, '#170F42');
    var r = A.rnd(33);
    for (var i = 0; i < 14; i++) {
      var w = 22 + r() * 22, h = 70 + r() * 130, x = i * 34 - 4;
      s += A.predio(x, 230, w, h, ['#2A2466', '#342C7A', '#3B3290', '#2D2A6E'][i % 4], { acesa: 0.55, luz: ['#FFE08A', '#8FF3FF', '#FFB3D1'][i % 3], antena: i % 4 === 1 });
    }
    s += A.tr(240, 230, 1, A.rect(-50, -70, 100, 70, '#E6E0FF') + A.poly('-58,-70 0,-100 58,-70', '#C9BEFF') + A.rect(-40, -60, 10, 50, '#FFFFFF') + A.rect(-15, -60, 10, 50, '#FFFFFF') + A.rect(10, -60, 10, 50, '#FFFFFF') + A.rect(35, -60, 10, 50, '#FFFFFF') + A.moeda(0, -84, 10));
    s += A.mar(d, 230, '#2A2A7A', '#16144A');
    s += A.barquinho(360, 256, 1.2, '#FF3D8B');
    s += A.path('M20 250 h440', 'none', { stroke: '#FFE08A', 'stroke-width': 1, opacity: 0.25 });
    return A.svg(s, d.join(''));
  };

  I.ied = function () {
    var d = [], s = A.ceu(d, '#E3F4FF', '#FFF6E6');
    s += chao(240, '#C8D6B8');
    s += A.globo(80, 110, 50);
    s += A.setaCurva(120, 80, 220, 20, 290, 120, '#F26B21', 5, 'an-flui');
    s += A.pessoa(130, 250, 1.3, { roupa: '#2B2D42', calca: '#2B2D42', maleta: true, pele: P[3], espelho: true });
    // fábrica em construção
    s += A.rect(250, 150, 170, 90, '#FFFFFF') + A.path('M250 150 L250 128 L285 150 L285 128 L320 150 L320 128 L355 150 L355 128 L390 150 L390 128 L420 150Z', '#3E6DE0');
    for (var i = 0; i < 5; i++) s += A.line(250 + i * 42, 150, 250 + i * 42, 240, '#C9A15B', 3);
    s += A.line(250, 195, 420, 195, '#C9A15B', 3) + A.guindaste(430, 240, 0.7, '#FFB400');
    s += A.moeda(210, 214, 12) + A.moeda(226, 232, 10) + A.moeda(196, 234, 9);
    s += A.etiqueta(335, 270, 'Nova fábrica', '#F26B21', { size: 11 });
    return A.svg(s, d.join(''));
  };

  /* ------------------------------------------------------------ FASE 4 */
  I.multinacional = function () {
    var d = [], s = A.ceu(d, '#F1ECFF', '#E6FFF6');
    s += A.rect(0, 150, 200, 150, '#FFE2CF') + A.rect(280, 150, 200, 150, '#DDF6E8');
    s += A.txt(100, 176, 'Japão e Tigres', 13, '#1C1840') + A.txt(380, 176, 'Novos Tigres', 13, '#1C1840');
    // pilhas de moedas (custo)
    for (var i = 0; i < 7; i++) s += A.ell(70, 270 - i * 9, 20, 6, i % 2 ? '#FFC93C' : '#FFB400');
    for (var j = 0; j < 2; j++) s += A.ell(350, 270 - j * 9, 20, 6, j % 2 ? '#FFC93C' : '#FFB400');
    s += A.txt(130, 250, 'custo alto', 12, '#E94F4F') + A.txt(420, 262, 'custo menor', 12, '#12A277');
    // caminhão levando fábrica
    s += A.g(A.tr(200, 132, 0.95, A.rect(-90, -8, 150, 14, '#44506B') + A.circ(-70, 10, 10, '#1C1840') + A.circ(30, 10, 10, '#1C1840') + A.rect(60, -40, 40, 46, '#F26B21') + A.rect(70, -34, 20, 14, '#8FD3FF') +
      A.fabrica(-86, -8, 0.8, '#FFFFFF', { telhado: '#8250E0', fumaca: false })), { class: 'an-viagem' });
    s += A.seta(150, 40, 330, 40, '#8250E0', 5);
    s += A.placa(240, 24, 'MUDANÇA DE FÁBRICAS', { size: 10, fundo: '#FFD23F' });
    return A.svg(s, d.join(''));
  };

  I.texteis = function () {
    var d = [], s = A.ceu(d, '#EAF6FF', '#F8FBFF');
    s += A.rect(0, 0, 480, 40, '#DDE7F3');
    for (var i = 0; i < 6; i++) s += A.rr(20 + i * 80, 10, 60, 8, 4, '#FFFFFF', { opacity: 0.95 });
    s += chao(210, '#B9C6D8');
    for (var r = 0; r < 2; r++) {
      for (var c = 0; c < 4; c++) {
        var x = 60 + c * 110 + r * 30, y = 150 + r * 70, sc = 0.8 + r * 0.2;
        s += A.tr(x, y, sc, A.rect(-40, 0, 80, 10, '#7A5CC0') + A.rect(-34, 10, 6, 28, '#5B4A8A') + A.rect(28, 10, 6, 28, '#5B4A8A') +
          A.path('M-18 0 V-22 H14 V-14 H-6 V0Z', '#E9EEF6') + A.rect(8, -14, 4, 12, '#AAB6CC') + A.circ(20, -8, 6, '#F2D6A8') + A.rect(-30, -6, 24, 6, '#FFB3C7'));
        s += A.pessoa(x - 2, y + 44 * sc, 0.95 * sc, { chapeu: 'touca', roupa: '#7FD8F5', calca: '#2B2D42', pele: P[(r + c) % 4], bracoE: -40, bracoD: 40, cabeloLongo: (r + c) % 2 === 0 });
      }
    }
    s += A.tr(440, 110, 1, A.path('M-12 0 L-8 -30 H8 L12 0Z', '#F5B86B') + A.path('M-12 -14 H12', 'none', { stroke: '#E0994A', 'stroke-width': 2 }));
    return A.svg(s, d.join(''));
  };

  I.gansos = function () {
    var d = [], s = A.ceu(d, '#FFB36B', '#FFE7F2');
    s += A.sol(90, 230, 40, '#FFE066', '#FFF1A8');
    s += A.colinas(262, '#E98AA8', 10, 0) + A.colinas(276, '#D66F96', 8, 40);
    function ganso(x, y, sc, cor) {
      return A.tr(x, y, sc, A.ell(0, 0, 22, 9, cor) + A.path('M16 -4 Q30 -16 36 -12 Q30 -6 22 -2Z', cor) + A.poly('36,-12 44,-10 36,-8', '#F2A900') + A.circ(33, -12, 1.4, '#1C1840') +
        A.path('M-6 -4 Q-20 -30 4 -26 Q2 -14 6 -4Z', '#FFFFFF', { opacity: 0.85, class: 'an-asa' }) + A.path('M-22 0 L-32 -6 L-30 4Z', cor));
    }
    var itens = [['Japão', '#FF3D8B', 360, 70, 1.25], ['Tigres', '#F26B21', 280, 110, 1.1], ['Novos Tigres', '#8250E0', 200, 150, 1.0], ['Novíssimos', '#12A277', 120, 190, 0.92]];
    itens.forEach(function (it, i) {
      s += A.g(ganso(it[2], it[3], it[4], '#FFFFFF') + A.etiqueta(it[2] + 6, it[3] + 26 * it[4], it[0], it[1], { size: 11 }), { class: 'an-flutua', style: 'animation-delay:' + (i * 0.3) + 's' });
    });
    s += A.g(ganso(330, 150, 0.7, '#FFFFFF') + ganso(250, 196, 0.65, '#FFFFFF'), { opacity: 0.6 });
    s += A.txt(410, 32, 'voa na frente →', 12, '#1C1840');
    return A.svg(s, d.join(''));
  };

  I.palmeira = function () {
    var d = [], s = A.ceu(d, '#BDEBFF', '#F2FFF4');
    s += A.colinas(200, '#7FCB73', 12, 0);
    for (var i = 0; i < 6; i++) s += A.palmeira(30 + i * 52, 250 - (i % 2) * 14, 0.95 + (i % 3) * 0.1, true);
    s += chao(250, '#6DB65E');
    s += A.tr(390, 250, 1, A.rect(-60, -70, 90, 70, '#FFFFFF') + A.rect(-60, -80, 90, 12, '#12A277') + A.circ(50, -40, 32, '#F2A93B') + A.rect(18, -40, 64, 40, '#F2A93B') + A.txt(50, -26, 'ÓLEO', 11, '#FFFFFF') + A.txt(50, -12, 'DE PALMA', 9, '#FFFFFF') + A.rect(-40, -56, 16, 14, '#8FD3FF') + A.rect(-14, -56, 16, 14, '#8FD3FF') + A.rect(-30, -26, 20, 26, '#44506B'));
    s += A.tr(300, 276, 0.8, A.rect(-40, -34, 50, 26, '#E94F4F') + A.rect(10, -26, 22, 18, '#C94F4F') + A.circ(-24, -6, 8, '#1C1840') + A.circ(20, -6, 8, '#1C1840') + A.circ(-30, -40, 7, '#E8541E') + A.circ(-16, -42, 7, '#F27A1A') + A.circ(-2, -40, 7, '#D9401B'), { class: 'an-viagem-curta' });
    return A.svg(s, d.join(''));
  };

  I.divisaoRegional = function () {
    var d = [], s = A.ceu(d, '#F4F0FF', '#EAFBFF');
    s += A.rect(20, 190, 440, 16, '#44506B', { rx: 8 });
    for (var i = 0; i < 12; i++) s += A.circ(34 + i * 38, 198, 5, '#2B2D42');
    var st = [
      { x: 70, t: 'Japão', sub: 'tecnologia e capital', c: '#FF3D8B', ic: A.lampada(0, -30, 0.9) },
      { x: 190, t: 'Tigres', sub: 'peças e chips', c: '#F26B21', ic: A.chipIcone(0, -30, 0.55) },
      { x: 310, t: 'Novos Tigres', sub: 'montagem', c: '#8250E0', ic: A.tr(0, -30, 1, A.rr(-24, -18, 48, 34, 4, '#1C1840') + A.rect(-20, -14, 40, 26, '#19C3E6') + A.rect(-6, 16, 12, 6, '#1C1840')) },
      { x: 420, t: 'Mundo', sub: 'consumo', c: '#12A277', ic: A.globo(0, -30, 24) }
    ];
    st.forEach(function (e, i) {
      s += A.rr(e.x - 52, 70, 104, 110, 14, '#FFFFFF') + A.rect(e.x - 52, 70, 104, 8, e.c, { rx: 4 }) + A.tr(e.x, 142, 1, e.ic) + A.txt(e.x, 230, e.t, 13, '#1C1840') + A.txt(e.x, 248, e.sub, 10, '#5A5675', { 'font-weight': 500 });
      if (i < 3) s += A.seta(e.x + 56, 125, st[i + 1].x - 56, 125, '#1C1840', 3);
    });
    s += A.g(A.caixa(90, 170, 20, 20, '#D9A566') + A.caixa(230, 170, 20, 20, '#D9A566') + A.caixa(350, 170, 20, 20, '#D9A566'), { class: 'an-esteira' });
    return A.svg(s, d.join(''));
  };

  /* ------------------------------------------------------------ FASE 5 */
  I.fabricaMundo = function () {
    var d = [], s = A.ceu(d, '#FFE0E0', '#FFF4E4');
    s += chao(240, '#D6CFC4');
    s += A.fabrica(20, 240, 1.35, '#FFFFFF', { telhado: '#EE1C25', chamine: '#9C1C22' }) + A.bandeiraG('CHN', 40, 140, 40);
    s += A.rect(222, 206, 150, 10, '#44506B');
    var cx = '';
    for (var i = 0; i < 4; i++) cx += A.caixa(228 + i * 36, 180, 30, 26, '#D9A566', 'FÁBRICA', 5.5);
    s += A.g(cx, { class: 'an-esteira' });
    s += A.globo(410, 120, 52);
    for (var k = 0; k < 5; k++) { var a = -Math.PI / 2 + (k - 2) * 0.55; s += A.seta(410 + Math.cos(a) * 60, 120 + Math.sin(a) * 60, 410 + Math.cos(a) * 92, 120 + Math.sin(a) * 92, '#EE1C25', 3); }
    s += A.etiqueta(410, 268, 'para o mundo todo', '#EE1C25', { size: 11 });
    return A.svg(s, d.join(''));
  };

  I.industria40 = function () {
    var d = [], s = A.ceu(d, '#0E1A3D', '#1D3470');
    s += chao(236, '#22305E');
    for (var i = 0; i < 10; i++) s += A.circ(40 + i * 44, 40 + (i % 3) * 20, 3, '#19C3E6', { class: 'an-pisca', style: 'animation-delay:' + i * 0.3 + 's' });
    s += A.path('M40 40 L84 60 L128 80 L172 40 L216 60 L260 80 L304 40 L348 60 L392 80 L436 40', 'none', { stroke: '#19C3E6', 'stroke-width': 1.2, opacity: 0.4 });
    // braço robótico
    s += A.tr(130, 236, 1, A.rect(-30, -14, 60, 14, '#FFB400') + A.circ(0, -18, 12, '#FF8A1F') +
      '<g class="an-robo">' + A.rect(-6, -90, 12, 74, '#FFB400', { rx: 5 }) + A.circ(0, -92, 10, '#FF8A1F') + '<g transform="rotate(50 0 -92)">' + A.rect(-5, -150, 10, 60, '#FFB400', { rx: 5 }) + A.path('M-10 -152 h20 l-4 -10 h-12Z', '#44506B') + '</g></g>');
    // tela com gráfico / IA
    s += A.rr(250, 90, 170, 110, 10, '#101B3D') + A.rr(258, 98, 154, 94, 6, '#19223F');
    s += A.path('M268 176 L300 150 L330 162 L362 124 L400 110', 'none', { stroke: '#FF3D8B', 'stroke-width': 3, 'stroke-linecap': 'round', class: 'an-desenha' });
    s += A.txt(335, 116, 'P&D', 14, '#FFD23F');
    s += A.pessoa(440, 262, 1.2, { jaleco: true, calca: '#2B2D42', pele: P[1], oculos: true, bracoE: 10, bracoD: -70, espelho: true });
    s += A.rr(404, 214, 16, 20, 3, '#19C3E6');
    return A.svg(s, d.join(''));
  };

  I.desigualdade = function () {
    var d = [], s = A.ceu(d, '#CFE3F0', '#F2F6F9');
    s += A.predio(230, 170, 50, 150, '#5A7FA8', { acesa: 0.3, luz: '#DDF4FF' }) + A.predio(290, 170, 60, 120, '#7C9CC0', { acesa: 0.3, luz: '#DDF4FF' }) + A.predio(360, 170, 46, 160, '#4E6F96', { acesa: 0.3, luz: '#DDF4FF', antena: true }) + A.predio(414, 170, 60, 110, '#6A8DB5', { acesa: 0.3, luz: '#DDF4FF' });
    s += A.arvore(210, 170, 1, '#3FA35B');
    for (var i = 0; i < 6; i++) {
      var x = 20 + i * 40, y = 214 + (i % 2) * 8;
      s += A.tr(x, y, 0.9, A.rect(-16, -18, 32, 18, ['#C9B79C', '#B8A58A', '#D4C4A8'][i % 3]) + A.path('M-20 -16 L0 -30 L20 -16Z', ['#8A6A55', '#A47B5C', '#6E5A4E'][i % 3]) + A.rect(-4, -12, 8, 12, '#5B4A3A'));
    }
    s += A.rect(0, 212, 480, 88, '#8AA79C', { opacity: 0.85 });
    for (var k = 0; k < 8; k++) s += A.path('M' + (10 + k * 60) + ' ' + (236 + (k % 3) * 18) + ' q14 -5 28 0', 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.5, 'stroke-linecap': 'round', class: 'an-onda' });
    s += A.barquinho(160, 250, 1, '#E94F4F');
    s += A.etiqueta(360, 272, 'riqueza e pobreza lado a lado', '#1C1840', { size: 11 });
    return A.svg(s, d.join(''));
  };

  I.energiaLimpa = function () {
    var d = [], s = A.ceu(d, '#BDEBFF', '#FFF7D6');
    s += A.rect(0, 0, 170, 300, '#9AA3B0', { opacity: 0.45 });
    s += A.sol(400, 60, 26, '#FFD23F', '#FFE9A0');
    s += A.colinas(230, '#8ED081', 8, 0);
    s += A.fabrica(10, 236, 0.85, '#E3E6EC', { telhado: '#5B6C8F', corFumaca: '#6B7385' });
    s += A.seta(160, 150, 230, 150, '#12A277', 6) + A.placa(196, 130, 'TRANSIÇÃO', { size: 9, fundo: '#FFFFFF' });
    function turbina(x, y, sc) {
      return A.tr(x, y, sc, A.path('M-3 0 L-1.5 -110 L1.5 -110 L3 0Z', '#FFFFFF') + '<g transform="translate(0 -110)"><g class="an-gira">' +
        A.path('M0 0 L-4 -54 Q0 -60 4 -54Z', '#FFFFFF') + A.path('M0 0 L-4 -54 Q0 -60 4 -54Z', '#FFFFFF', { transform: 'rotate(120)' }) + A.path('M0 0 L-4 -54 Q0 -60 4 -54Z', '#FFFFFF', { transform: 'rotate(240)' }) + A.circ(0, 0, 5, '#DDE3EE') + '</g></g>');
    }
    s += turbina(330, 236, 1) + turbina(420, 240, 0.8);
    for (var i = 0; i < 3; i++) s += A.tr(260 + i * 56, 262, 1, A.poly('-24,0 24,0 30,-22 -18,-22', '#23305B') + A.path('M-20 -7 H26 M-18 -14 H28 M-8 0 L-3 -22 M8 0 L13 -22', 'none', { stroke: '#5C7CD6', 'stroke-width': 1.5 }) + A.rect(-2, 0, 4, 10, '#8C96A8'));
    s += chao(270, '#6DB65E');
    return A.svg(s, d.join(''));
  };

  I.baterias = function () {
    var d = [], s = A.ceu(d, '#E9FFF6', '#E6F0FF');
    s += chao(236, '#C4D0E0');
    s += A.rect(30, 110, 200, 126, '#FFFFFF') + A.rect(30, 100, 200, 14, '#12A277') + A.txt(130, 94, 'FÁBRICA DE BATERIAS', 11, '#1C1840');
    s += A.tr(130, 176, 1, A.rr(-40, -44, 80, 88, 10, '#1C1840') + A.rect(-14, -52, 28, 10, '#1C1840') + A.rect(-30, -34, 60, 70, '#1E2A4A') + '<g class="an-carga">' + A.rect(-30, 0, 60, 36, '#2BD576') + '</g>' + A.raio(0, 0, 1.4, '#FFD23F'));
    // carro elétrico
    s += A.tr(360, 236, 1, A.path('M-70 -10 Q-66 -34 -40 -38 L-20 -58 Q20 -64 40 -40 Q66 -36 70 -12 L70 -4 H-70Z', '#3E6DE0') + A.path('M-30 -40 L-16 -54 Q10 -58 26 -40Z', '#8FD3FF') + A.circ(-40, -4, 13, '#1C1840') + A.circ(-40, -4, 5, '#AAB6CC') + A.circ(42, -4, 13, '#1C1840') + A.circ(42, -4, 5, '#AAB6CC'));
    s += A.rect(440, 150, 22, 86, '#44506B', { rx: 4 }) + A.rect(444, 158, 14, 12, '#2BD576') + A.path('M440 200 Q420 206 424 214 Q430 220 426 222', 'none', { stroke: '#1C1840', 'stroke-width': 4 });
    s += A.raio(451, 186, 0.7, '#FFD23F');
    return A.svg(s, d.join(''));
  };

  I.riscoExterno = function () {
    var d = [], s = A.ceu(d, '#EEF1FF', '#FFF2F2');
    s += A.globo(240, 150, 100, { mar: '#58B9F0', terra: '#7FD18B' });
    s += A.path('M180 120 Q100 40 40 90', 'none', { stroke: '#F26B21', 'stroke-width': 4, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round', class: 'an-flui' });
    s += A.path('M300 130 Q400 40 450 100', 'none', { stroke: '#F26B21', 'stroke-width': 4, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round', class: 'an-flui' });
    s += A.path('M250 220 Q280 290 400 262', 'none', { stroke: '#F26B21', 'stroke-width': 4, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round', class: 'an-flui' });
    s += A.tr(58, 70, 1, A.rr(-44, -24, 88, 48, 10, '#FFFFFF') + A.path('M-30 -6 L-14 -2 L0 -14 L14 8 L30 14', 'none', { stroke: '#E94F4F', 'stroke-width': 3, 'stroke-linecap': 'round' }) + A.txt(0, 18, 'crise', 10, '#1C1840'));
    s += A.tr(420, 72, 1, A.rr(-48, -26, 96, 52, 10, '#FFFFFF') + A.txt(-26, 2, 'R$', 13, '#12A277') + A.txt(24, 2, 'US$', 13, '#3E6DE0') + A.seta(-10, -6, 6, -6, '#1C1840', 1.6) + A.seta(6, 2, -10, 2, '#1C1840', 1.6) + A.txt(0, 19, 'câmbio', 10, '#1C1840'));
    s += A.tr(410, 250, 1, A.rr(-44, -24, 88, 48, 10, '#FFFFFF') + A.raio(0, -4, 0.8, '#E94F4F') + A.txt(0, 18, 'conflitos', 10, '#1C1840'));
    s += A.alerta(240, 60, 1);
    return A.svg(s, d.join(''));
  };

  I.qualificacao = function () {
    var d = [], s = A.ceu(d, '#FFF1E6', '#EAF4FF');
    s += A.fabrica(270, 236, 0.9, '#FFFFFF', { telhado: '#19C3E6', fumaca: false });
    s += chao(236, '#D2DCEA');
    s += A.pessoa(160, 270, 1.8, { chapeu: 'capacete', roupa: '#F26B21', calca: '#2B2D42', pele: P[1], cabeloLongo: true, bracoE: -30, bracoD: 30 });
    s += A.rr(136, 180, 48, 34, 5, '#1C1840') + A.rr(140, 184, 40, 26, 3, '#19C3E6');
    var ic = [A.engrenagem(80, 90, 16, '#8250E0'), A.lampada(250, 70, 0.9), A.tr(90, 170, 1, A.path('M-18 0 L0 -9 L18 0 L0 9Z', '#1C1840') + A.rect(-10, 2, 20, 8, '#1C1840')), A.txt(230, 150, '</>', 22, '#12A277', { 'font-family': '"Courier New", monospace' })];
    ic.forEach(function (x, i) { s += A.g(x, { class: 'an-flutua', style: 'animation-delay:' + i * 0.4 + 's' }); });
    s += A.etiqueta(360, 272, 'aprender sempre', '#8250E0', { size: 12 });
    return A.svg(s, d.join(''));
  };

  I.trajetoria = function () {
    var d = [], s = A.ceu(d, '#F6F2FF', '#FFF6EC');
    var p = [
      { x: 80, ano: 'até 1950', t: 'Economia agrária', c: '#5DBB46' },
      { x: 240, ano: '1960–1970', t: 'Indústria exportadora', c: '#FF8A1F' },
      { x: 400, ano: '1980 em diante', t: 'Alta tecnologia', c: '#19C3E6' }
    ];
    p.forEach(function (e, i) {
      s += A.rr(e.x - 70, 40, 140, 150, 14, '#FFFFFF') + A.rect(e.x - 70, 40, 140, 10, e.c, { rx: 5 });
      if (i < 2) s += A.seta(e.x + 74, 115, p[i + 1].x - 74, 115, '#1C1840', 4);
      s += A.txt(e.x, 222, e.t, 12, '#1C1840') + A.etiqueta(e.x, 250, e.ano, e.c, { size: 11 });
    });
    s += A.tr(80, 150, 1, A.path('M-50 10 Q0 -10 50 10 L50 30 L-50 30Z', '#7CC85E') + A.pessoa(0, 18, 0.8, { chapeu: 'conico', roupa: '#E94F4F', inclina: 20, bracoE: 60, pele: P[1] }));
    s += A.fabrica(185, 170, 0.65, '#F4F6FB', { telhado: '#FF8A1F' });
    s += A.chipIcone(400, 112, 0.8);
    return A.svg(s, d.join(''));
  };

  /* ------------------------------------------------------------ EXTRAS */
  I.dragao = function () {
    var d = [], s = A.ceu(d, '#FFE1E1', '#FFF5DC');
    s += A.nuvem(60, 80, 1.2, '#FFFFFF') + A.nuvem(340, 230, 1.1, '#FFFFFF');
    s += A.path('M60 200 Q120 120 180 180 T300 170 T420 120', 'none', { stroke: '#E0302F', 'stroke-width': 30, 'stroke-linecap': 'round', class: 'an-ondula' });
    s += A.path('M60 200 Q120 120 180 180 T300 170 T420 120', 'none', { stroke: '#FFD23F', 'stroke-width': 8, 'stroke-dasharray': '4 16', 'stroke-linecap': 'round' });
    s += A.tr(420, 110, 1, A.ell(0, 0, 34, 26, '#E0302F') + A.path('M10 -20 Q30 -44 40 -36 M-6 -22 Q0 -50 12 -46', 'none', { stroke: '#FFD23F', 'stroke-width': 5, 'stroke-linecap': 'round' }) + A.circ(10, -6, 5, '#FFFFFF') + A.circ(11, -6, 2.5, '#1C1840') + A.path('M26 6 q20 -2 26 10 M26 10 q14 14 4 26', 'none', { stroke: '#FFD23F', 'stroke-width': 3, 'stroke-linecap': 'round' }) + A.path('M-10 14 L22 14 L14 22Z', '#FFFFFF'));
    for (var i = 0; i < 4; i++) s += A.path('M' + (100 + i * 80) + ' ' + (168 - (i % 2) * 14) + ' l10 -18 l10 18Z', '#FFD23F');
    s += A.etiqueta(240, 44, 'Quatro Pequenos Dragões', '#E0302F', { size: 14 });
    return A.svg(s, d.join(''));
  };

  I.lojinha = function () {
    var d = [], s = A.ceu(d, '#FFE9C7', '#E3F2FF');
    s += chao(250, '#CDBBA0');
    s += A.tr(120, 250, 1, A.rect(-80, -90, 160, 90, '#F4E1C1') + A.path('M-90 -88 L90 -88 L80 -110 L-80 -110Z', '#8A5A3B') + A.rect(-60, -70, 120, 40, '#FFFFFF', { opacity: 0.6 }) +
      A.path('M-50 -66 v14 M-30 -66 v16 M-10 -66 v12', 'none', { stroke: '#8A6A40', 'stroke-width': 2 }) + A.ell(-50, -48, 6, 3, '#9FB3C8') + A.ell(-30, -46, 7, 3, '#9FB3C8') + A.ell(-10, -50, 6, 3, '#9FB3C8') +
      A.rect(20, -60, 30, 22, '#F7E2A8') + A.path('M22 -56 q6 4 12 0 t12 0 M22 -48 q6 4 12 0 t12 0', 'none', { stroke: '#C9A15B', 'stroke-width': 1.5 }) + A.rect(-12, -28, 24, 28, '#6B4A3A') + A.placa(0, -98, '1938', { size: 10 }));
    s += A.seta(210, 180, 280, 180, '#1C1840', 5);
    s += A.predio(300, 250, 110, 220, '#3E6DE0', { gx: 12, gy: 13, janelaW: 8, janelaH: 7, acesa: 0.8, luz: '#DDF4FF', antena: true });
    s += A.chipIcone(355, 90, 0.5) + A.placa(355, 272, 'HOJE', { size: 10 });
    return A.svg(s, d.join(''));
  };

  I.perucas = function () {
    var d = [], s = A.ceu(d, '#FFF0F5', '#F3ECFF');
    s += A.rect(0, 210, 480, 90, '#B8844F') + A.rect(0, 210, 480, 10, '#8A5A3B');
    var cab = [['#2A1B12', 0], ['#6B3A1E', 1], ['#1C1840', 2], ['#B8864B', 0]];
    cab.forEach(function (c, i) {
      var x = 80 + i * 106;
      s += A.rect(x - 4, 150, 8, 60, '#9AA4B8') + A.rect(x - 22, 204, 44, 8, '#9AA4B8', { rx: 3 }) + A.ell(x, 120, 26, 32, '#F2D5BD');
      if (c[1] === 0) s += A.path('M' + (x - 30) + ' 150 Q' + (x - 34) + ' 84 ' + x + ' 82 Q' + (x + 34) + ' 84 ' + (x + 30) + ' 150 Q' + (x + 20) + ' 110 ' + x + ' 104 Q' + (x - 20) + ' 110 ' + (x - 30) + ' 150Z', c[0]);
      if (c[1] === 1) s += A.path('M' + (x - 28) + ' 124 Q' + (x - 30) + ' 84 ' + x + ' 84 Q' + (x + 30) + ' 84 ' + (x + 28) + ' 124 Q' + x + ' 100 ' + (x - 28) + ' 124Z', c[0]) + A.circ(x, 82, 12, c[0]);
      if (c[1] === 2) { for (var k = 0; k < 9; k++) s += A.circ(x - 24 + (k % 5) * 12, 92 + Math.floor(k / 5) * 12 - Math.abs(k % 5 - 2) * 3, 9, c[0]); }
    });
    s += A.caixa(380, 236, 80, 44, '#D9A566', 'EXPORTAÇÃO', 8) + A.placa(420, 226, '1970', { size: 9 });
    return A.svg(s, d.join(''));
  };

  I.petronas = function () {
    var d = [], s = A.ceu(d, '#1B1452', '#FF8A5C');
    s += A.estrelas(24, 8, 480, 110);
    function torre(x) {
      var t = '';
      for (var i = 0; i < 6; i++) { var w = 44 - i * 5, h = 34 - i * 1; t += A.rect(x - w / 2, 250 - 40 - i * 32 - h, w, h + 2, i % 2 ? '#C9D2E3' : '#AEB9D1'); }
      t += A.rect(x - 22, 210, 44, 40, '#AEB9D1') + A.rect(x - 2, 20, 4, 30, '#C9D2E3') + A.circ(x, 18, 2.5, '#FF3D8B', { class: 'an-pisca' });
      for (var j = 0; j < 12; j++) t += A.line(x - 12, 60 + j * 15, x + 12, 60 + j * 15, '#FFE08A', 1.5, { opacity: 0.7 });
      return t;
    }
    s += A.predio(40, 250, 40, 110, '#342C7A', { acesa: 0.5 }) + A.predio(390, 250, 50, 130, '#342C7A', { acesa: 0.5 }) + A.predio(440, 250, 40, 90, '#2A2466', { acesa: 0.5 });
    s += torre(200) + torre(280) + A.rect(200, 142, 80, 8, '#C9D2E3') + A.path('M204 150 L240 168 L276 150', 'none', { stroke: '#C9D2E3', 'stroke-width': 3 });
    s += chao(250, '#1C1840');
    s += A.txt(240, 280, '452 m', 16, '#FFD23F');
    return A.svg(s, d.join(''));
  };

  I.aterro = function () {
    var d = [], s = A.ceu(d, '#5CC3F0', '#2A8FD6');
    for (var i = 0; i < 6; i++) s += A.path('M' + (20 + i * 80) + ' ' + (40 + (i % 3) * 90) + ' q14 -5 28 0', 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.35, class: 'an-onda' });
    s += A.path('M80 150 Q90 90 170 84 Q250 70 320 96 Q390 110 380 160 Q370 210 290 218 Q200 228 130 212 Q70 198 80 150Z', '#F2D9A8');
    s += A.path('M110 150 Q120 110 180 104 Q240 94 300 112 Q350 124 346 158 Q340 196 280 200 Q210 208 150 196 Q104 186 110 150Z', '#7CC85E');
    s += A.path('M80 150 Q90 90 170 84 Q250 70 320 96 Q390 110 380 160 Q370 210 290 218 Q200 228 130 212 Q70 198 80 150Z', 'none', { stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-dasharray': '6 6' });
    s += A.path('M380 160 Q420 170 430 210 Q400 240 340 230 Q370 210 380 160Z', '#F7E6C0', { class: 'an-pulsa', style: 'transform-origin:400px 200px' });
    s += A.tr(430, 262, 0.7, A.path('M-40 0 L40 0 L30 16 L-30 16Z', '#E94F4F') + A.rect(-10, -16, 20, 16, '#FFFFFF'));
    s += A.path('M406 246 Q396 220 410 206', 'none', { stroke: '#F2D9A8', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.9 });
    s += A.etiqueta(230, 150, 'área original', '#1C1840', { size: 11 }) + A.etiqueta(300, 262, 'terreno novo', '#F26B21', { size: 11 });
    s += A.predio(210, 146, 10, 30, '#3E6DE0', { acesa: 0 }) + A.predio(224, 146, 12, 44, '#8250E0', { acesa: 0 }) + A.predio(240, 146, 10, 36, '#12A277', { acesa: 0 });
    return A.svg(s, d.join(''));
  };

  I.enchente = function () {
    var d = [], s = A.ceu(d, '#8C9AB5', '#C9D2E3');
    s += A.nuvem(60, 50, 1.3, '#6B7A99', 'an-nuvem') + A.nuvem(300, 40, 1.5, '#6B7A99', 'an-nuvem');
    for (var i = 0; i < 30; i++) s += A.line(20 + (i * 53) % 460, 70 + (i * 37) % 80, 14 + (i * 53) % 460, 84 + (i * 37) % 80, '#E6F3FF', 1.5, { opacity: 0.7, class: 'an-chuva', style: 'animation-delay:' + (i % 7) * 0.12 + 's' });
    s += A.fabrica(60, 240, 1.1, '#E9EEF6', { telhado: '#5B6C8F', fumaca: false });
    s += A.rect(0, 200, 480, 100, '#7E8F6E', { opacity: 0.85 });
    for (var k = 0; k < 7; k++) s += A.path('M' + (20 + k * 66) + ' ' + (216 + (k % 3) * 22) + ' q14 -5 28 0', 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.5, class: 'an-onda' });
    function hd(x, y, r) { return A.tr(x, y, 1, '<g transform="rotate(' + r + ')">' + A.rr(-22, -30, 44, 60, 5, '#C9D2E3') + A.circ(0, -6, 16, '#9AA4B8') + A.circ(0, -6, 4, '#6B7385') + A.line(0, -6, 14, 18, '#6B7385', 2) + '</g>', { class: 'an-flutua' }); }
    s += hd(330, 230, -12) + hd(410, 244, 10);
    s += A.etiqueta(370, 180, 'discos rígidos', '#1C1840', { size: 11 });
    return A.svg(s, d.join(''));
  };

  I.rioHan = function () {
    var d = [], s = A.ceu(d, '#FFB38A', '#FFE4D0');
    s += A.montanhas(150, '#B99AAE', [[0, 40], [70, 80], [150, 50], [230, 90], [310, 60], [390, 86], [480, 50]]);
    var r = A.rnd(71);
    for (var i = 0; i < 16; i++) { var w = 16 + r() * 16, h = 30 + r() * 80; s += A.predio(i * 30 + 2, 170, w, h, ['#5B4A8A', '#6E5AA0', '#4E3F7A'][i % 3], { acesa: 0.4, gx: 7, gy: 9, janelaW: 3, janelaH: 4 }); }
    s += A.path('M0 190 Q240 170 480 196 L480 250 Q240 226 0 244Z', '#5BA7E0');
    s += A.path('M40 200 Q100 188 160 200 M300 206 Q360 196 420 212', 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.4 });
    s += A.rect(0, 170, 480, 20, '#8FCB6A') + A.rect(0, 244, 480, 56, '#8FCB6A');
    for (var b = 0; b < 3; b++) { var x0 = 70 + b * 150; s += A.path('M' + x0 + ' 178 L' + (x0 + 30) + ' 250', 'none', { stroke: '#E9EEF6', 'stroke-width': 7 }); for (var k = 0; k < 4; k++) s += A.line(x0 + 4 + k * 7, 190 + k * 16, x0 + 4 + k * 7, 182 + k * 16, '#E9EEF6', 2); }
    s += A.placa(240, 280, 'SEUL', { size: 11 });
    return A.svg(s, d.join(''));
  };

  I.dende = function () {
    var d = [], s = A.ceu(d, '#FFF1D6', '#FFE2C4');
    s += A.rect(0, 230, 480, 70, '#C8925A');
    var cacho = '';
    for (var i = 0; i < 26; i++) { var a = i * 0.9, rr = 10 + (i % 5) * 7; cacho += A.circ(Math.cos(a) * rr, Math.sin(a) * rr * 0.8, 9, ['#E8541E', '#F27A1A', '#D9401B', '#B83218'][i % 4]); }
    s += A.tr(140, 170, 1.3, cacho);
    s += A.tr(330, 230, 1, A.rr(-36, -130, 72, 130, 14, '#F2A93B', { opacity: 0.95 }) + A.rect(-14, -156, 28, 30, '#F7C66B') + A.rect(-16, -166, 32, 12, '#E94F4F') + A.rr(-28, -90, 56, 46, 6, '#FFFFFF') + A.txt(0, -70, 'AZEITE', 10, '#B83218') + A.txt(0, -56, 'DE DENDÊ', 9, '#B83218') + A.rect(-26, -128, 12, 90, '#FFFFFF', { opacity: 0.25 }));
    return A.svg(s, d.join(''));
  };

  I.conteiner = function () {
    var d = [], s = A.ceu(d, '#E6F6FF', '#F4F0FF');
    s += chao(250, '#C9D2E3');
    s += A.tr(0, 0, 1, A.conteiner(60, 120, 160, 70, '#F26B21') + A.rect(206, 124, 3, 62, '#FFFFFF', { opacity: 0.5 }));
    s += A.path('M60 206 H220', 'none', { stroke: '#1C1840', 'stroke-width': 2 }) + A.path('M60 200 v12 M220 200 v12', 'none', { stroke: '#1C1840', 'stroke-width': 2 }) + A.txt(140, 226, '≈ 6 m', 13, '#1C1840');
    s += A.etiqueta(140, 98, '1 TEU (20 pés)', '#F26B21', { size: 12 });
    s += A.conteiner(260, 150, 180, 40, '#19C3E6') + A.conteiner(260, 110, 180, 40, '#8250E0');
    s += A.etiqueta(350, 90, '40 pés = 2 TEU', '#8250E0', { size: 12 });
    s += A.path('M260 206 H440', 'none', { stroke: '#1C1840', 'stroke-width': 2 }) + A.txt(350, 226, '≈ 12 m cada', 13, '#1C1840');
    return A.svg(s, d.join(''));
  };

  I.hongKong = function () {
    var d = [], s = A.ceu(d, '#12103A', '#4B2A8A');
    s += A.estrelas(30, 91, 480, 100);
    s += A.montanhas(150, '#241C57', [[0, 50], [80, 90], [170, 60], [260, 100], [360, 70], [480, 90]]);
    var r = A.rnd(55);
    for (var i = 0; i < 18; i++) { var w = 14 + r() * 16, h = 40 + r() * 110; s += A.predio(i * 27, 190, w, h, ['#3B2F8F', '#4A3AA7', '#2D2470'][i % 3], { acesa: 0.6, luz: ['#FFE08A', '#8FF3FF', '#FFB3D1', '#B3FFB8'][i % 4], gx: 7, gy: 9, janelaW: 3, janelaH: 4 }); }
    s += A.mar(d, 190, '#2A2A7A', '#14123F');
    s += A.tr(330, 236, 1.1, A.path('M-40 0 L40 0 L30 14 L-32 14Z', '#6B3E26') + A.path('M-6 0 L-6 -60 Q18 -40 22 -8Z', '#E94F4F') + A.path('M-10 0 L-10 -44 Q-30 -30 -30 -6Z', '#E94F4F') + A.path('M-6 -50 H14 M-6 -36 H18 M-6 -22 H20', 'none', { stroke: '#8A2B3B', 'stroke-width': 1.5 }), { class: 'an-balanca' });
    return A.svg(s, d.join(''));
  };

  I.cafe = function () {
    var d = [], s = A.ceu(d, '#FFF4E6', '#F6E9DA');
    s += A.rect(0, 232, 480, 68, '#B8844F');
    s += A.tr(150, 150, 1.2, A.path('M-60 60 Q-20 -40 70 -70', 'none', { stroke: '#6B4A2A', 'stroke-width': 6, 'stroke-linecap': 'round' }) +
      A.path('M-30 20 q-30 -10 -34 -40 q30 4 34 40Z M0 -12 q-10 -34 14 -50 q16 30 -14 50Z M30 -40 q30 -20 50 0 q-26 18 -50 0Z', '#3F9E57') +
      A.circ(-14, 30, 7, '#D6362B') + A.circ(-2, 34, 7, '#B82B23') + A.circ(18, -6, 7, '#D6362B') + A.circ(28, -2, 7, '#E94F4F') + A.circ(48, -38, 6, '#B82B23'));
    s += A.tr(340, 232, 1, A.path('M-48 -70 H48 L40 0 H-40Z', '#FFFFFF') + A.path('M48 -56 q24 4 18 26 q-4 14 -22 12', 'none', { stroke: '#FFFFFF', 'stroke-width': 8 }) + A.ell(0, -70, 48, 8, '#6B3A1E') +
      A.g(A.path('M-14 -86 q-8 -12 0 -24 q8 -12 0 -24 M10 -86 q-8 -12 0 -24 q8 -12 0 -24', 'none', { stroke: '#C9B7A8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }), { class: 'an-fumaca-lenta' }));
    for (var i = 0; i < 7; i++) s += A.tr(40 + i * 26, 262 + (i % 2) * 8, 1, A.ell(0, 0, 9, 6, '#6B3A1E') + A.path('M-6 0 q6 -3 12 0', 'none', { stroke: '#3B1F10', 'stroke-width': 1.5 }));
    return A.svg(s, d.join(''));
  };

  /* ------------------------------------------------------------ tela inicial */
  I.capa = function () {
    var d = [], s = A.ceu(d, '#150F3F', '#FF4F7B', 960, 440);
    // lua dentro da área que aparece tanto no recorte largo (computador) quanto no estreito (celular);
    // a cor do recorte da lua acompanha o céu (degradê) + o halo naquela altura
    s += A.estrelas(60, 3, 960, 200) + A.lua(690, 112, 22, '#66395E');
    s += A.montanhas(250, '#3A1F70', [[0, 60], [120, 110], [240, 70], [380, 130], [520, 80], [660, 124], [800, 76], [960, 110]], 960, 440);
    var r = A.rnd(19), b = '';
    for (var i = 0; i < 30; i++) { var w = 18 + r() * 26, h = 50 + r() * 150; b += A.predio(300 + i * 22, 300, w, h, ['#2A1B6E', '#35248A', '#40299C', '#2D1F79'][i % 4], { acesa: 0.55, luz: ['#FFE08A', '#8FF3FF', '#FFB3D1'][i % 3], antena: i % 5 === 2, gx: 8, gy: 10, janelaW: 4, janelaH: 5 }); }
    s += b;
    s += A.rect(0, 296, 960, 10, '#1C1840');
    s += A.pilhaConteineres(20, 300, 7, 3, 24, 13, 77) + A.guindaste(40, 300, 1.1, '#FFB400') + A.guindaste(190, 300, 1.1, '#FF3D8B');
    s += A.mar(d, 300, '#2B2A86', '#120F45', 960, 440);
    s += A.navio(560, 330, 1.35, { camadas: 3, seed: 5, cls: 'an-navega' });
    return A.svg(s, d.join(''), '0 0 960 440', 'capa-svg').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
  };

  window.ILUSTRACOES = I;
})();
