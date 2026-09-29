/* Gráficos do jogo (SVG próprio, com dica ao passar o mouse, foco pelo
   teclado e tabela de dados). Para usar numa questão:
   visual: { tipo: 'grafico', nome: 'portos' } */
(function () {
  var D = window.DADOS;
  var COR = {
    tigres: '#F26B21', novos: '#8250E0',
    brasil: '#4A4760', outros: '#B9B5CC', serie: '#2A78D6', trilho: '#DCE8F8',
    campo: '#3FA535', cidade: '#3E6DE0', taiwan: '#F26B21', coreia: '#3E6DE0',
    texto: '#1C1840', texto2: '#5A5675', grade: '#ECE8F4', sup: '#FFFFFF'
  };
  var NF = new Intl.NumberFormat('pt-BR');
  var NF1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  function mil(v) { return NF1.format(v / 1000).replace(',0', '') + ' mil'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function t(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" class="gt ' + (o.cls || '') + '" text-anchor="' + (o.a || 'start') + '"' + (o.w ? ' font-weight="' + o.w + '"' : '') + (o.size ? ' font-size="' + o.size + '"' : '') + (o.fill ? ' fill="' + o.fill + '"' : '') + '>' + s + '</text>';
  }
  // barra horizontal: base quadrada à esquerda, ponta arredondada (4px)
  function barraH(x, y, w, h, cor, tip, extra) {
    var r = Math.min(4, w / 2), d;
    if (w <= 0.5) d = '';
    else d = 'M' + x + ' ' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + 'V' + (y + h - r) + 'Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - r) + ' ' + (y + h) + 'H' + x + 'Z';
    return '<g class="marca" tabindex="0" data-tip="' + esc(tip) + '"' + (extra || '') + '><rect x="' + x + '" y="' + (y - 4) + '" width="' + Math.max(w + 40, 60) + '" height="' + (h + 8) + '" fill="transparent"/><path d="' + d + '" fill="' + cor + '" class="barra-anim" style="transform-origin:' + x + 'px 0"/></g>';
  }
  function legenda(itens) {
    return '<ul class="g-legenda">' + itens.map(function (i) {
      return '<li><span class="g-chave' + (i.linha ? ' linha' : '') + '" style="background:' + i.cor + '"></span>' + esc(i.nome) + '</li>';
    }).join('') + '</ul>';
  }
  function tabela(cab, linhas) {
    return '<details class="g-tabela"><summary>Ver dados em tabela</summary><div class="g-tab-rolagem"><table><thead><tr>' + cab.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      linhas.map(function (l) { return '<tr>' + l.map(function (c, i) { return i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></details>';
  }
  function figura(o) {
    return '<figure class="grafico" data-grafico="' + o.id + '">' +
      '<div class="g-cab"><h4 class="g-titulo">' + o.titulo + '</h4>' + (o.sub ? '<p class="g-sub">' + o.sub + '</p>' : '') + '</div>' +
      (o.leg || '') +
      '<div class="g-area"><svg viewBox="0 0 ' + o.w + ' ' + o.h + '" role="img" aria-label="' + esc(o.aria || o.titulo) + '" class="g-svg">' + o.svg + '</svg></div>' +
      '<figcaption class="g-fonte">Fonte: ' + esc(o.fonte) + '</figcaption>' + (o.tab || '') + '</figure>';
  }
  function nomeGrupo(g) { return g === 'tigres' ? 'Tigre Asiático' : g === 'novos' ? 'Novo Tigre' : g === 'brasil' ? 'Brasil' : 'Outros países'; }
  function grupoDe(cod) {
    if (cod === 'BRA') return 'brasil';
    for (var k in D.grupos) if (D.grupos[k].paises.indexOf(cod) >= 0) return k;
    return 'outros';
  }
  function legGrupos(extra) {
    var l = [{ nome: 'Tigres', cor: COR.tigres }, { nome: 'Novos Tigres', cor: COR.novos }];
    return legenda(l.concat(extra || []));
  }
  function gradeX(x0, x1, y0, y1, max, passo, fmt) {
    var s = '';
    for (var v = 0; v <= max + 1e-9; v += passo) {
      var x = x0 + (x1 - x0) * v / max;
      s += '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + y1 + '" class="g-grade"/>' + t(x, y1 + 16, fmt(v), { a: 'middle', cls: 'g-eixo' });
    }
    return s;
  }

  var G = {};

  /* 1. Coreia do Sul: campo x cidade */
  G.urbanizacaoCoreia = function () {
    var d = D.urbanizacaoCoreia, W = 560, x0 = 70, x1 = 540, s = '';
    d.anos.forEach(function (a, i) {
      var y = 36 + i * 78, cid = a.urbana, cam = Math.round((100 - a.urbana) * 10) / 10;
      var wc = (x1 - x0) * cid / 100, wm = (x1 - x0) * cam / 100;
      s += t(x0 - 12, y + 30, a.ano, { a: 'end', cls: 'g-rotulo', w: 700, size: 16 });
      s += '<g class="marca" tabindex="0" data-tip="' + a.ano + ' — cidades: ' + NF1.format(cid) + '%"><rect x="' + x0 + '" y="' + y + '" width="' + (wc - 1) + '" height="46" fill="' + COR.cidade + '" rx="0"/></g>';
      s += '<g class="marca" tabindex="0" data-tip="' + a.ano + ' — campo: ' + NF1.format(cam) + '%"><rect x="' + (x0 + wc + 1) + '" y="' + y + '" width="' + (wm - 1) + '" height="46" fill="' + COR.campo + '"/></g>';
      var rc = 'Cidades ' + NF1.format(cid) + '%', rm = 'Campo ' + NF1.format(cam) + '%';
      if (wc > rc.length * 8.4 + 20) s += t(x0 + 10, y + 29, rc, { cls: 'g-dentro', w: 700 });
      else s += t(x0, y - 7, rc, { cls: 'g-rotulo', w: 700 });
      if (wm > rm.length * 8.4 + 20) s += t(x1 - 10, y + 29, rm, { cls: 'g-dentro', w: 700, a: 'end' });
      else s += t(x1, y - 7, rm, { cls: 'g-rotulo', w: 700, a: 'end' });
    });
    s += '<line x1="' + x0 + '" y1="24" x2="' + x0 + '" y2="178" class="g-base"/>';
    return figura({
      id: 'urbanizacaoCoreia', w: W, h: 190, svg: s,
      titulo: 'Coreia do Sul: onde a população vivia',
      sub: 'Porcentagem da população em cidades e no campo',
      leg: legenda([{ nome: 'Cidades', cor: COR.cidade }, { nome: 'Campo', cor: COR.campo }]),
      fonte: d.fonte,
      tab: tabela(['Ano', 'Cidades (%)', 'Campo (%)'], d.anos.map(function (a) { return [a.ano, NF1.format(a.urbana), NF1.format(100 - a.urbana)]; }))
    });
  };

  /* 2. Quantas vezes a renda por pessoa aumentou (1960 → 2022) */
  G.multiplicador = function () {
    var v = D.maddison.valores, lista = [];
    for (var c in v) lista.push({ cod: c, nome: D.nomes[c], x: v[c][1] / v[c][0], g: grupoDe(c) });
    lista.sort(function (a, b) { return b.x - a.x; });
    var W = 560, x0 = 118, x1 = 500, bh = 15, gap = 7, y0 = 12, max = 30, s = '';
    var H = y0 + lista.length * (bh + gap) + 30;
    s += gradeX(x0, x1, 4, H - 26, max, 5, function (k) { return k === 0 ? '0' : '×' + k; });
    lista.forEach(function (it, i) {
      var y = y0 + i * (bh + gap), w = (x1 - x0) * it.x / max;
      var cor = it.g === 'outros' ? COR.outros : COR[it.g];
      s += t(x0 - 8, y + bh - 3, it.nome, { a: 'end', cls: 'g-rotulo' + (it.g === 'brasil' ? ' forte' : '') });
      s += barraH(x0, y, w, bh, cor, it.nome + ': renda ' + NF1.format(it.x) + ' vezes maior (' + nomeGrupo(it.g) + ')', ' style="animation-delay:' + (i * 40) + 'ms"');
      s += t(x0 + w + 6, y + bh - 3, '×' + NF1.format(it.x), { cls: 'g-valor' });
    });
    s += '<line x1="' + x0 + '" y1="4" x2="' + x0 + '" y2="' + (H - 26) + '" class="g-base"/>';
    return figura({
      id: 'multiplicador', w: W, h: H, svg: s,
      titulo: 'Quantas vezes a renda por pessoa aumentou',
      sub: 'De 1960 a 2022, com valores corrigidos pela inflação e pelo custo de vida',
      leg: legGrupos([{ nome: 'Brasil', cor: COR.brasil }, { nome: 'Outros', cor: COR.outros }]),
      fonte: D.maddison.fonte,
      tab: tabela(['País', 'Renda 1960 (US$ de 2011)', 'Renda 2022 (US$ de 2011)', 'Aumento'], lista.map(function (it) { return [it.nome, NF.format(v[it.cod][0]), NF.format(v[it.cod][1]), '×' + NF1.format(it.x)]; }))
    });
  };

  /* 3. Chips mais avançados */
  G.chips = function () {
    var d = D.chips, W = 560, x0 = 20, x1 = 540, y = 58, h = 50, s = '';
    var wT = (x1 - x0) * 0.92, wK = (x1 - x0) * 0.08;
    s += '<g class="marca" tabindex="0" data-tip="Taiwan: 92%"><rect x="' + x0 + '" y="' + y + '" width="' + (wT - 1) + '" height="' + h + '" fill="' + COR.taiwan + '"/></g>';
    s += '<g class="marca" tabindex="0" data-tip="Coreia do Sul: 8%"><rect x="' + (x0 + wT + 1) + '" y="' + y + '" width="' + (wK - 1) + '" height="' + h + '" fill="' + COR.coreia + '"/></g>';
    s += t(x0 + 14, y + 32, 'Taiwan · 92%', { cls: 'g-dentro', w: 700, size: 18 });
    s += '<line x1="' + (x0 + wT + wK / 2) + '" y1="' + (y + h + 4) + '" x2="' + (x0 + wT + wK / 2) + '" y2="' + (y + h + 22) + '" class="g-guia"/>';
    s += t(x1, y + h + 38, 'Coreia do Sul · 8%', { a: 'end', cls: 'g-rotulo', w: 700 });
    s += t(x0, 34, '0%', { cls: 'g-eixo' }) + t(x1, 34, '100%', { cls: 'g-eixo', a: 'end' });
    s += t(x0, y + h + 38, 'Resto do mundo: 0%', { cls: 'g-rotulo' });
    return figura({
      id: 'chips', w: W, h: 160, svg: s,
      titulo: 'Onde estava a fábrica dos chips mais avançados',
      sub: d.descricao + ' — dados de 2019, publicados em 2021',
      leg: legenda([{ nome: 'Taiwan', cor: COR.taiwan }, { nome: 'Coreia do Sul', cor: COR.coreia }]),
      fonte: d.fonte,
      tab: tabela(['Lugar', 'Parte da capacidade (%)'], [['Taiwan', '92'], ['Coreia do Sul', '8'], ['Resto do mundo', '0']])
    });
  };

  /* 4. Portos de contêineres (2024) */
  G.portos = function () {
    var d = D.portos2024, W = 560, x0 = 178, x1 = 500, bh = 18, gap = 9, y0 = 10, max = 45, s = '';
    var H = y0 + d.lista.length * (bh + gap) + 28;
    s += gradeX(x0, x1, 4, H - 24, max, 15, function (k) { return NF.format(k); });
    d.lista.forEach(function (p, i) {
      var y = y0 + i * (bh + gap), w = (x1 - x0) * p.valor / max, cor = COR[p.grupo];
      s += t(x0 - 8, y + bh - 4, p.nome, { a: 'end', cls: 'g-rotulo' + (p.grupo === 'brasil' ? ' forte' : '') });
      s += barraH(x0, y, w, bh, cor, p.nome + ': ' + NF1.format(p.valor) + ' milhões de TEU', ' style="animation-delay:' + (i * 50) + 'ms"');
      s += t(x0 + w + 6, y + bh - 4, NF1.format(p.valor), { cls: 'g-valor' });
    });
    s += '<line x1="' + x0 + '" y1="4" x2="' + x0 + '" y2="' + (H - 24) + '" class="g-base"/>';
    return figura({
      id: 'portos', w: W, h: H, svg: s,
      titulo: 'Contêineres movimentados em 2024',
      sub: 'Em milhões de TEU (1 TEU = um contêiner de 20 pés)',
      leg: legenda([{ nome: 'Tigres', cor: COR.tigres }, { nome: 'Novos Tigres', cor: COR.novos }, { nome: 'Brasil', cor: COR.brasil }]),
      fonte: d.fonte,
      tab: tabela(['Porto', 'Milhões de TEU (2024)'], d.lista.map(function (p) { return [p.nome, NF1.format(p.valor)]; }))
    });
  };

  /* 5. Brasil x Coreia do Sul (1960 e 2022) */
  G.brasilCoreia = function () {
    var v = D.maddison.valores, W = 560, H = 280, xa = 214, xb = 424, y0 = 24, y1 = 240, max = 45000, s = '';
    function Y(val) { return y1 - (y1 - y0) * val / max; }
    for (var k = 0; k <= max; k += 15000) s += '<line x1="60" y1="' + Y(k) + '" x2="520" y2="' + Y(k) + '" class="g-grade"/>' + t(52, Y(k) + 4, k === 0 ? '0' : mil(k), { a: 'end', cls: 'g-eixo' });
    s += t(xa, y1 + 26, '1960', { a: 'middle', cls: 'g-rotulo', w: 700, size: 15 }) + t(xb, y1 + 26, '2022', { a: 'middle', cls: 'g-rotulo', w: 700, size: 15 });
    var series = [
      { cod: 'BRA', nome: 'Brasil', cor: COR.brasil },
      { cod: 'KOR', nome: 'Coreia do Sul', cor: COR.tigres }
    ];
    series.forEach(function (se) {
      var a = v[se.cod][0], b = v[se.cod][1];
      s += '<path d="M' + xa + ' ' + Y(a) + ' L' + xb + ' ' + Y(b) + '" stroke="' + se.cor + '" stroke-width="3" fill="none" stroke-linecap="round" class="linha-anim"/>';
      [[xa, a, 1960], [xb, b, 2022]].forEach(function (p) {
        s += '<g class="marca" tabindex="0" data-tip="' + se.nome + ', ' + p[2] + ': ' + NF.format(p[1]) + ' dólares por pessoa"><circle cx="' + p[0] + '" cy="' + Y(p[1]) + '" r="16" fill="transparent"/><circle cx="' + p[0] + '" cy="' + Y(p[1]) + '" r="6" fill="' + se.cor + '" stroke="#FFFFFF" stroke-width="2.5"/></g>';
      });
    });
    // rótulos diretos
    s += t(xa - 14, Y(v.BRA[0]) - 8, 'Brasil ' + mil(v.BRA[0]), { a: 'end', cls: 'g-rotulo', w: 700 });
    s += t(xa - 14, Y(v.KOR[0]) + 12, 'Coreia ' + mil(v.KOR[0]), { a: 'end', cls: 'g-rotulo', w: 700 });
    s += t(xb + 14, Y(v.KOR[1]) + 5, 'Coreia ' + mil(v.KOR[1]), { cls: 'g-rotulo', w: 700 });
    s += t(xb + 14, Y(v.BRA[1]) + 5, 'Brasil ' + mil(v.BRA[1]), { cls: 'g-rotulo', w: 700 });
    return figura({
      id: 'brasilCoreia', w: W, h: H, svg: s,
      titulo: 'Brasil x Coreia do Sul: renda por pessoa',
      sub: 'Em dólares de 2011, corrigidos pela inflação e pelo custo de vida',
      leg: legenda([{ nome: 'Coreia do Sul', cor: COR.tigres, linha: true }, { nome: 'Brasil', cor: COR.brasil, linha: true }]),
      fonte: D.maddison.fonte,
      tab: tabela(['País', '1960', '2022'], [['Brasil', NF.format(v.BRA[0]), NF.format(v.BRA[1])], ['Coreia do Sul', NF.format(v.KOR[0]), NF.format(v.KOR[1])]])
    });
  };

  /* 6. Renda por pessoa em 2022 */
  G.renda2022 = function () {
    var v = D.maddison.valores, cods = ['SGP', 'TWN', 'KOR', 'MYS', 'THA', 'BRA', 'IDN', 'PHL', 'VNM'];
    var lista = cods.map(function (c) { return { cod: c, nome: D.nomes[c], val: v[c][1], g: grupoDe(c) }; }).sort(function (a, b) { return b.val - a.val; });
    var W = 560, x0 = 118, x1 = 490, bh = 18, gap = 9, y0 = 10, max = 90000, s = '';
    var H = y0 + lista.length * (bh + gap) + 28;
    s += gradeX(x0, x1, 4, H - 24, max, 30000, function (k) { return k === 0 ? '0' : mil(k); });
    lista.forEach(function (it, i) {
      var y = y0 + i * (bh + gap), w = (x1 - x0) * it.val / max;
      s += t(x0 - 8, y + bh - 4, it.nome, { a: 'end', cls: 'g-rotulo' + (it.g === 'brasil' ? ' forte' : '') });
      s += barraH(x0, y, w, bh, COR[it.g], it.nome + ': ' + NF.format(it.val) + ' dólares por pessoa (' + nomeGrupo(it.g) + ')', ' style="animation-delay:' + (i * 50) + 'ms"');
      s += t(x0 + w + 6, y + bh - 4, mil(it.val), { cls: 'g-valor' });
    });
    s += '<line x1="' + x0 + '" y1="4" x2="' + x0 + '" y2="' + (H - 24) + '" class="g-base"/>';
    return figura({
      id: 'renda2022', w: W, h: H, svg: s,
      titulo: 'Renda por pessoa em 2022',
      sub: 'Em dólares de 2011, corrigidos pela inflação e pelo custo de vida',
      leg: legGrupos([{ nome: 'Brasil', cor: COR.brasil }]),
      fonte: D.maddison.fonte,
      tab: tabela(['País', 'Grupo', 'Renda por pessoa em 2022'], lista.map(function (it) { return [it.nome, nomeGrupo(it.g), NF.format(it.val)]; }))
    });
  };

  /* 7. China: 28% da produção industrial */
  G.china28 = function () {
    var d = D.china, W = 560, x0 = 20, x1 = 540, y = 70, h = 34, w = (x1 - x0) * d.valor / 100, s = '';
    s += '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="' + h + '" fill="' + COR.trilho + '" rx="4"/>';
    s += '<g class="marca" tabindex="0" data-tip="China: ' + d.valor + '% da produção industrial mundial (' + d.ano + ')"><path d="M' + x0 + ' ' + y + ' H' + (x0 + w - 4) + ' Q' + (x0 + w) + ' ' + y + ' ' + (x0 + w) + ' ' + (y + 4) + ' V' + (y + h - 4) + ' Q' + (x0 + w) + ' ' + (y + h) + ' ' + (x0 + w - 4) + ' ' + (y + h) + ' H' + x0 + 'Z" fill="' + COR.serie + '" class="barra-anim" style="transform-origin:' + x0 + 'px 0"/></g>';
    [0, 25, 50, 75, 100].forEach(function (p) { var x = x0 + (x1 - x0) * p / 100; s += '<line x1="' + x + '" y1="' + (y + h + 4) + '" x2="' + x + '" y2="' + (y + h + 10) + '" class="g-base"/>' + t(x, y + h + 26, p + '%', { a: p === 0 ? 'start' : p === 100 ? 'end' : 'middle', cls: 'g-eixo' }); });
    s += '<line x1="' + (x0 + (x1 - x0) * 0.25) + '" y1="' + (y - 8) + '" x2="' + (x0 + (x1 - x0) * 0.25) + '" y2="' + (y + h) + '" class="g-guia"/>' + t(x0 + (x1 - x0) * 0.25 + 6, y - 12, 'um quarto (25%)', { cls: 'g-eixo' });
    s += t(x0, 40, 'China · 28%', { cls: 'g-rotulo', w: 700, size: 22 }) + t(x1, 40, 'Resto do mundo · 72%', { cls: 'g-rotulo', a: 'end', size: 14 });
    return figura({
      id: 'china28', w: W, h: 150, svg: s,
      titulo: 'A "fábrica do mundo"',
      sub: 'Parte do valor da produção industrial mundial feita na China em ' + d.ano,
      fonte: d.fonte,
      tab: tabela(['Lugar', '% da produção industrial mundial (' + d.ano + ')'], [['China', '28'], ['Resto do mundo', '72']])
    });
  };

  /* 8. Indonésia: a crise de 1997-1998 */
  G.criseIndonesia = function () {
    var d = D.indonesia.serie, W = 560, H = 270, x0 = 64, x1 = 536, y0 = 20, y1 = 226, max = 1500, s = '';
    function X(a) { return x0 + (x1 - x0) * (a - 1990) / 15; }
    function Y(v) { return y1 - (y1 - y0) * v / max; }
    for (var k = 0; k <= max; k += 500) s += '<line x1="' + x0 + '" y1="' + Y(k) + '" x2="' + x1 + '" y2="' + Y(k) + '" class="g-grade"/>' + t(x0 - 8, Y(k) + 4, NF.format(k), { a: 'end', cls: 'g-eixo' });
    [1990, 1995, 2000, 2005].forEach(function (a) { s += t(X(a), y1 + 20, a, { a: 'middle', cls: 'g-eixo' }); });
    s += '<rect x="' + (X(1997) - 4) + '" y="' + y0 + '" width="' + (X(1998) - X(1997) + 8) + '" height="' + (y1 - y0) + '" fill="#FFD23F" opacity="0.18"/>';
    var dl = d.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join(' ');
    s += '<path d="' + dl + ' L' + X(2005) + ' ' + y1 + ' L' + X(1990) + ' ' + y1 + 'Z" fill="' + COR.serie + '" opacity="0.1"/>';
    s += '<path d="' + dl + '" stroke="' + COR.serie + '" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round" class="linha-anim"/>';
    d.forEach(function (p) {
      var destaque = p[0] === 1997 || p[0] === 1998;
      s += '<g class="marca" tabindex="0" data-tip="' + p[0] + ': ' + NF.format(p[1]) + ' dólares por pessoa"><circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="13" fill="transparent"/>' +
        (destaque ? '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="5.5" fill="' + COR.serie + '" stroke="#FFFFFF" stroke-width="2.5"/>' : '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="3" fill="' + COR.serie + '" opacity="0.6"/>') + '</g>';
    });
    s += t(X(1997) - 8, Y(1308) - 12, '1997: 1.308', { a: 'end', cls: 'g-rotulo', w: 700 });
    s += t(X(1998) + 10, Y(572) + 20, '1998: 572', { cls: 'g-rotulo', w: 700 });
    s += t((X(1997) + X(1998)) / 2, y1 - 8, 'crise', { a: 'middle', cls: 'g-eixo', w: 700 });
    return figura({
      id: 'criseIndonesia', w: W, h: H, svg: s,
      titulo: 'Indonésia: renda por pessoa em dólares',
      sub: 'Valores em dólares de cada ano; a faixa amarela marca a crise asiática',
      fonte: D.indonesia.fonte,
      tab: tabela(['Ano', 'Dólares por pessoa'], d.map(function (p) { return [p[0], NF.format(p[1])]; }))
    });
  };

  /* Mini gráfico para a ficha do país (1960 → 2022) */
  function miniRenda(cod) {
    var v = D.maddison.valores[cod];
    if (!v) return '';
    var g = grupoDe(cod), cor = g === 'outros' ? '#7B7894' : COR[g], bra = D.maddison.valores.BRA;
    var max = Math.max(v[1], bra[1]) * 1.12, W = 300, x0 = 58, x1 = 258, s = '';
    function barra(y, val, c, rot) {
      var w = (x1 - x0) * val / max;
      return t(x0 - 6, y + 11, rot, { a: 'end', cls: 'g-eixo' }) + barraH(x0, y, w, 14, c, rot + ': ' + NF.format(val) + ' dólares') + t(x0 + w + 5, y + 11, mil(val), { cls: 'g-valor' });
    }
    s += barra(6, v[0], '#C9C5DA', '1960') + barra(26, v[1], cor, '2022');
    if (cod !== 'BRA') s += '<line x1="' + (x0 + (x1 - x0) * bra[1] / max) + '" y1="2" x2="' + (x0 + (x1 - x0) * bra[1] / max) + '" y2="46" class="g-guia"/>' + t(x0 + (x1 - x0) * bra[1] / max + 3, 58, 'Brasil 2022', { cls: 'g-eixo' });
    return '<div class="mini-renda"><p class="mini-titulo">Renda por pessoa (dólares de 2011)</p><svg viewBox="0 0 ' + W + ' 64" class="g-svg" role="img" aria-label="Renda por pessoa: ' + NF.format(v[0]) + ' em 1960 e ' + NF.format(v[1]) + ' em 2022">' + s + '</svg><p class="g-fonte">Fonte: ' + esc(D.maddison.fonte) + '</p></div>';
  }

  window.GRAFICOS = G;
  window.GraficosUtil = { miniRenda: miniRenda, COR: COR, grupoDe: grupoDe, mil: mil };
})();
