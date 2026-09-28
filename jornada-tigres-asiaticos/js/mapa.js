/* Mapa interativo da Ásia (SVG). O desenho dos países está em js/mapa-geo.js
   (fronteiras simplificadas, desenhadas à mão para este jogo). */
(function () {
  var G = window.MAPA_GEO, D = window.DADOS;
  var M = G.meta;

  function merc(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI; }
  function proj(lon, lat) { return [(lon - M.lon0) * M.K, (M.ytop - merc(lat)) * M.K]; }

  // posição dos rótulos (lon, lat) e tamanho
  var ROT = {
    CHN: [104, 33.5, 22], MNG: [106, 44.4, 12], RUS: [135.0, 45.0, 10], KAZ: [74.5, 44.8, 10], KGZ: [75.6, 41.5, 8],
    // Uzbequistão e Afeganistão ficam sem rótulo: só uma faixa estreita deles cabe no mapa (o nome aparece ao passar o mouse)
    TJK: [71.2, 38.7, 8], PAK: [70.2, 30.2, 9], IND: [78.8, 21.5, 20],
    NPL: [84.1, 28.25, 8], BTN: [90.4, 27.5, 6.5], BGD: [90.2, 23.8, 9], MMR: [95.9, 21.9, 11], THA: [101.5, 15.6, 11],
    LAO: [102.9, 19.6, 9], KHM: [104.9, 12.8, 9], VNM: [105.3, 21.2, 9], MYS: [102.3, 4.4, 10, 'end'],
    IDN: [114.2, -1.3, 14], PHL: [124.1, 12.9, 11], BRN: [114.7, 4.8, 6], TLS: [126.4, -9.6, 7], PNG: [144.4, -5.9, 7.2],
    KOR: [127.9, 36.6, 10], PRK: [127.0, 40.3, 9], JPN: [138.9, 37.3, 12, 'start', 0.8], TWN: [121.8, 23.6, 10, 'start', 0.9],
    LKA: [80.8, 7.6, 8], HKG: [114.4, 21.4, 9, 'start', 0.6], SGP: [104.4, 0.6, 9, 'start', 0.6]
  };
  var QUEBRA = { PNG: ['Papua-', 'Nova Guiné'], PRK: ['Coreia', 'do Norte'], KOR: ['Coreia', 'do Sul'] }; // rótulos em duas linhas
  var PEQUENOS = { SGP: [103.82, 1.35], HKG: [114.17, 22.32] };
  var PRESETS = {
    asia: [67, 147, -11, 46],
    leste: [99, 147, 16, 46],
    sudeste: [90, 132, -11, 24],
    sul: [67, 101, 4, 37],
    tigres: [98, 142, -3, 44]
  };
  function boxDe(p) {
    var a = proj(p[0], p[3]), b = proj(p[1], p[2]);
    return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] };
  }
  function grupoDe(cod) {
    for (var k in D.grupos) if (D.grupos[k].paises.indexOf(cod) >= 0) return k;
    return null;
  }

  var contador = 0;

  /* opts: { modo: 'explorar' | 'missao' | 'destaque', destaque: [], rotulos: true/false,
             grupos: true (colorir grupos), zoom: true, foco: 'asia', aoClicar(cod) } */
  function criar(el, opts) {
    opts = opts || {};
    var id = 'mp' + (++contador);
    var modo = opts.modo || 'explorar';
    var mostrarGrupos = opts.grupos !== false;
    var camadas = { tigres: true, novos: true, novissimos: true, protagonistas: !!opts.protagonistas };
    var W = M.W, H = M.H;

    var defs = '<defs>' +
      '<linearGradient id="' + id + 'mar" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#27B6EA"/><stop offset="1" stop-color="#1A63B6"/></linearGradient>' +
      '<pattern id="' + id + 'onda" width="42" height="22" patternUnits="userSpaceOnUse"><path d="M2 12 q9 -7 18 0 t18 0" fill="none" stroke="#FFFFFF" stroke-opacity="0.13" stroke-width="1.6" stroke-linecap="round"/></pattern>' +
      '<filter id="' + id + 'sombra" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#0B2B63" flood-opacity="0.45"/></filter>' +
      '<filter id="' + id + 'brilho" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>';

    var s = '<rect x="-400" y="-400" width="' + (W + 800) + '" height="' + (H + 800) + '" fill="url(#' + id + 'mar)"/>' +
      '<rect x="-400" y="-400" width="' + (W + 800) + '" height="' + (H + 800) + '" fill="url(#' + id + 'onda)"/>';
    // linhas de referência
    s += '<g class="mp-ref"><line x1="-400" x2="' + (W + 400) + '" y1="' + M.tropico + '" y2="' + M.tropico + '"/><line x1="-400" x2="' + (W + 400) + '" y1="' + M.equador + '" y2="' + M.equador + '"/>' +
      '<text x="' + (W - 8) + '" y="' + (M.tropico - 6) + '" text-anchor="end">TRÓPICO DE CÂNCER</text><text x="' + (W - 8) + '" y="' + (M.equador - 6) + '" text-anchor="end">EQUADOR</text></g>';
    // mares
    var mares = [[87, -7, 'OCEANO ÍNDICO', 19], [134, 19.5, 'OCEANO PACÍFICO', 19], [114, 12.8, 'Mar da China', 13], [114, 10.9, 'Meridional', 13], [88.5, 15, 'Baía de Bengala', 13], [126, 29.6, 'Mar da China', 11.5], [126, 28.2, 'Oriental', 11.5]];
    s += '<g class="mp-mares">' + mares.map(function (m) { var p = proj(m[0], m[1]); return '<text x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" font-size="' + m[3] + '" text-anchor="middle">' + m[2] + '</text>'; }).join('') + '</g>';
    // países
    s += '<g class="mp-paises" filter="url(#' + id + 'sombra)">';
    Object.keys(G.paises).forEach(function (cod) {
      s += '<path class="mp-pais" data-cod="' + cod + '" d="' + G.paises[cod].d + '"/>';
    });
    s += '</g>';
    // marcadores de territórios pequenos
    s += '<g class="mp-pontos">';
    Object.keys(PEQUENOS).forEach(function (cod) {
      var p = proj(PEQUENOS[cod][0], PEQUENOS[cod][1]);
      s += '<g class="mp-ponto" data-cod="' + cod + '" transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')"><circle class="mp-ponto-alvo" r="15"/><circle class="mp-ponto-onda" r="9"/><circle class="mp-ponto-miolo" r="6.5"/></g>';
    });
    s += '</g>';
    // rótulos
    s += '<g class="mp-rotulos">';
    Object.keys(ROT).forEach(function (cod) {
      var r = ROT[cod], p = proj(r[0], r[1]);
      var nome = D.nomes[cod] || cod, grande = r[2] >= 14, fs = Math.max(10.5, r[2] * 1.45);
      var conteudo = QUEBRA[cod] ? QUEBRA[cod].map(function (l, i) { return '<tspan x="' + p[0].toFixed(1) + '" dy="' + (i ? '1.1em' : '0') + '">' + l + '</tspan>'; }).join('') : (grande ? nome.toUpperCase() : nome);
      s += '<text class="mp-rot' + (grande ? ' grande' : '') + '" data-cod="' + cod + '" x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" font-size="' + fs.toFixed(1) + '" text-anchor="' + (r[3] || 'middle') + '">' + conteudo + '</text>';
    });
    s += '</g>';
    // rosa dos ventos e escala
    var esc500 = 500 / 111.32 * M.K; // 500 km no Equador
    s += '<g class="mp-bussola" transform="translate(48 ' + (H - 92) + ')"><circle r="24" fill="#FFFFFF" fill-opacity="0.9"/><path d="M0 -20 L6 0 L0 20 L-6 0Z" fill="#1C1840" fill-opacity="0.25"/><path d="M0 -20 L6 0 L-6 0Z" fill="#FF3D8B"/><text y="-28" text-anchor="middle">N</text></g>' +
      '<g class="mp-escala" transform="translate(22 ' + (H - 26) + ')"><rect x="-8" y="-20" width="' + (esc500 + 70) + '" height="30" rx="6" fill="#FFFFFF" fill-opacity="0.85"/><rect x="0" y="-6" width="' + (esc500 / 2).toFixed(1) + '" height="6" fill="#1C1840"/><rect x="' + (esc500 / 2).toFixed(1) + '" y="-6" width="' + (esc500 / 2).toFixed(1) + '" height="6" fill="#FFFFFF" stroke="#1C1840" stroke-width="1"/><text x="0" y="-9">0</text><text x="' + esc500.toFixed(1) + '" y="-9" text-anchor="middle">500 km</text><text x="' + (esc500 + 8).toFixed(1) + '" y="2" font-size="8">no Equador</text></g>';

    el.innerHTML = '<div class="mapa" data-modo="' + modo + '"><svg class="mapa-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa do Leste, Sudeste e Sul da Ásia">' + defs + '<g class="mp-mundo">' + s + '</g></svg>' +
      // os botões ficam numa faixa abaixo do desenho, para nunca cobrir países ou rótulos
      (opts.zoom !== false ? '<div class="mapa-barra"><span class="mapa-ajuda">Arraste para mover o mapa</span><div class="mapa-zoom"><button type="button" class="btn-zoom" data-z="mais" aria-label="Aproximar">' + window.Arte.icone('mais') + '</button><button type="button" class="btn-zoom" data-z="menos" aria-label="Afastar">' + window.Arte.icone('menos') + '</button><button type="button" class="btn-zoom" data-z="todo" aria-label="Ver o mapa inteiro">' + window.Arte.icone('tela_cheia') + '</button></div></div>' : '') +
      '<div class="mapa-dica" hidden></div></div>';

    var raiz = el.querySelector('.mapa'), svg = raiz.querySelector('svg'), dica = raiz.querySelector('.mapa-dica');
    var paises = {}, pontos = {}, rotulos = {};
    svg.querySelectorAll('.mp-pais').forEach(function (p) { paises[p.getAttribute('data-cod')] = p; });
    svg.querySelectorAll('.mp-ponto').forEach(function (p) { pontos[p.getAttribute('data-cod')] = p; });
    svg.querySelectorAll('.mp-rot').forEach(function (t) { rotulos[t.getAttribute('data-cod')] = t; });

    function pintar() {
      Object.keys(paises).forEach(function (cod) {
        var g = grupoDe(cod), p = paises[cod];
        var cls = 'mp-pais';
        if (mostrarGrupos && g && camadas[g]) cls += ' gr-' + g;
        if (camadas.protagonistas && (cod === 'JPN' || cod === 'CHN')) cls += ' gr-protagonista';
        if (opts.destaque && opts.destaque.indexOf(cod) >= 0) cls += ' destaque gr-' + (opts.grupoDestaque || grupoDe(cod) || 'tigres');
        p.setAttribute('class', cls + (p.classList.contains('selecionado') ? ' selecionado' : ''));
      });
      Object.keys(pontos).forEach(function (cod) {
        var g = grupoDe(cod), on = (mostrarGrupos && g && camadas[g]) || (opts.destaque && opts.destaque.indexOf(cod) >= 0);
        pontos[cod].setAttribute('class', 'mp-ponto' + (on ? ' gr-' + g : '') + (opts.destaque && opts.destaque.indexOf(cod) >= 0 ? ' destaque' : ''));
      });
      var mostrarRot = opts.rotulos !== false;
      Object.keys(rotulos).forEach(function (cod) {
        var t = rotulos[cod];
        t.style.display = (mostrarRot || t.classList.contains('revelado')) ? '' : 'none';
        t.classList.toggle('forte', !!(grupoDe(cod) || cod === 'JPN' || cod === 'CHN'));
      });
    }
    pintar();

    // ---------------- zoom e arrasto
    var vb = { x: 0, y: 0, w: W, h: H };
    function aplicar(anim) {
      var minW = 110;
      vb.w = Math.max(minW, Math.min(W, vb.w));
      vb.h = vb.w * H / W;
      vb.x = Math.max(-40, Math.min(W - vb.w + 40, vb.x));
      vb.y = Math.max(-40, Math.min(H - vb.h + 40, vb.y));
      if (anim) svg.classList.add('suave'); else svg.classList.remove('suave');
      svg.setAttribute('viewBox', vb.x.toFixed(1) + ' ' + vb.y.toFixed(1) + ' ' + vb.w.toFixed(1) + ' ' + vb.h.toFixed(1));
      raiz.style.setProperty('--zoom', (W / vb.w).toFixed(2));
    }
    function focar(alvo, anim) {
      var b;
      if (typeof alvo === 'string' && PRESETS[alvo]) b = boxDe(PRESETS[alvo]);
      else if (typeof alvo === 'string' && paises[alvo]) {
        var bb = paises[alvo].getBBox(), pad = Math.max(bb.width, bb.height) * 0.9 + 30;
        b = { x: bb.x - pad, y: bb.y - pad, w: bb.width + 2 * pad, h: bb.height + 2 * pad };
      } else b = { x: 0, y: 0, w: W, h: H };
      var escala = Math.max(b.w / W, b.h / H);
      vb.w = W * escala; vb.h = H * escala;
      vb.x = b.x + b.w / 2 - vb.w / 2; vb.y = b.y + b.h / 2 - vb.h / 2;
      aplicar(anim !== false);
    }
    function zoomEm(fator, cx, cy) {
      var nw = Math.max(110, Math.min(W, vb.w * fator));
      var f = nw / vb.w;
      vb.x = cx - (cx - vb.x) * f; vb.y = cy - (cy - vb.y) * f; vb.w = nw;
      aplicar(false);
    }
    function ptSvg(ev) {
      var r = svg.getBoundingClientRect();
      return { x: vb.x + (ev.clientX - r.left) / r.width * vb.w, y: vb.y + (ev.clientY - r.top) / r.height * vb.h };
    }
    if (opts.foco) focar(opts.foco, false);

    var arrastou = false;
    if (opts.zoom !== false) {
      raiz.querySelectorAll('.btn-zoom').forEach(function (b) {
        b.addEventListener('click', function () {
          var z = b.getAttribute('data-z');
          if (z === 'todo') focar(null, true);
          else { var cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2; zoomEm(z === 'mais' ? 0.7 : 1.4, cx, cy); }
          if (window.Sons) window.Sons.tocar('clique');
        });
      });
      svg.addEventListener('wheel', function (ev) {
        ev.preventDefault();
        var p = ptSvg(ev);
        zoomEm(ev.deltaY > 0 ? 1.15 : 0.87, p.x, p.y);
      }, { passive: false });
      var toques = {}, inicio = null, distIni = 0, vbIni = null;
      svg.addEventListener('pointerdown', function (ev) {
        toques[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
        var ids = Object.keys(toques);
        arrastou = false;
        if (ids.length === 1) { inicio = { x: ev.clientX, y: ev.clientY }; vbIni = { x: vb.x, y: vb.y, w: vb.w }; }
        if (ids.length === 2) { var a = toques[ids[0]], b = toques[ids[1]]; distIni = Math.hypot(a.x - b.x, a.y - b.y); vbIni = { x: vb.x, y: vb.y, w: vb.w }; }
      });
      svg.addEventListener('pointermove', function (ev) {
        if (!toques[ev.pointerId]) return;
        toques[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
        var ids = Object.keys(toques), r = svg.getBoundingClientRect();
        if (ids.length === 1 && inicio) {
          var dx = ev.clientX - inicio.x, dy = ev.clientY - inicio.y;
          if (Math.abs(dx) + Math.abs(dy) > 6) arrastou = true;
          if (arrastou) {
            vb.x = vbIni.x - dx / r.width * vb.w; vb.y = vbIni.y - dy / r.height * vb.h;
            aplicar(false);
            try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura */ }
          }
        } else if (ids.length === 2) {
          var a = toques[ids[0]], b = toques[ids[1]], dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (distIni > 0) {
            arrastou = true;
            var cx = vb.x + ((a.x + b.x) / 2 - r.left) / r.width * vb.w, cy = vb.y + ((a.y + b.y) / 2 - r.top) / r.height * vb.h;
            var alvoW = vbIni.w * distIni / dist;
            zoomEm(alvoW / vb.w, cx, cy);
          }
        }
      });
      function fim(ev) { delete toques[ev.pointerId]; if (!Object.keys(toques).length) inicio = null; }
      svg.addEventListener('pointerup', fim);
      svg.addEventListener('pointercancel', fim);
    }

    // ---------------- passar o mouse e clicar
    var selecionado = null;
    function codDoEvento(ev) {
      var t = ev.target.closest ? ev.target.closest('[data-cod]') : null;
      return t ? t.getAttribute('data-cod') : null;
    }
    svg.addEventListener('pointermove', function (ev) {
      var cod = codDoEvento(ev);
      Object.keys(paises).forEach(function (c) { paises[c].classList.toggle('sobre', c === cod); });
      if (cod && modo === 'explorar' && ev.pointerType !== 'touch') {
        var r = raiz.getBoundingClientRect();
        dica.hidden = false;
        dica.textContent = D.nomes[cod] || cod;
        dica.style.left = (ev.clientX - r.left + 14) + 'px';
        dica.style.top = (ev.clientY - r.top + 12) + 'px';
      } else dica.hidden = true;
    });
    svg.addEventListener('pointerleave', function () { dica.hidden = true; Object.keys(paises).forEach(function (c) { paises[c].classList.remove('sobre'); }); });
    svg.addEventListener('click', function (ev) {
      if (arrastou) { arrastou = false; return; }
      var cod = codDoEvento(ev);
      if (!cod || !opts.aoClicar) return;
      if (modo === 'explorar') selecionar(cod);
      opts.aoClicar(cod, ev);
    });

    function selecionar(cod) {
      if (selecionado && paises[selecionado]) paises[selecionado].classList.remove('selecionado');
      if (selecionado && pontos[selecionado]) pontos[selecionado].classList.remove('selecionado');
      selecionado = cod;
      if (paises[cod]) { paises[cod].classList.add('selecionado'); paises[cod].parentNode.appendChild(paises[cod]); }
      if (pontos[cod]) pontos[cod].classList.add('selecionado');
    }
    function marcar(cod, tipo) { // tipo: 'certo' | 'errado' | 'alvo'
      var p = paises[cod];
      if (p) { p.classList.add('mp-' + tipo); p.parentNode.appendChild(p); }
      if (pontos[cod]) pontos[cod].classList.add('mp-' + tipo);
    }
    function revelar(cod) {
      var t = rotulos[cod];
      if (t) { t.classList.add('revelado'); t.style.display = ''; }
    }
    function travar() { raiz.classList.add('travado'); }

    return {
      el: raiz,
      focar: focar,
      selecionar: selecionar,
      marcar: marcar,
      revelar: revelar,
      travar: travar,
      camada: function (nome, on) { camadas[nome] = on; pintar(); },
      camadas: camadas,
      centro: function (cod) {
        if (PEQUENOS[cod]) return proj(PEQUENOS[cod][0], PEQUENOS[cod][1]);
        var c = G.paises[cod] && G.paises[cod].c;
        return c;
      },
      paraTela: function (x, y) {
        var r = svg.getBoundingClientRect();
        return { x: r.left + (x - vb.x) / vb.w * r.width, y: r.top + (y - vb.y) / vb.h * r.height };
      }
    };
  }

  window.Mapa = { criar: criar, proj: proj, grupoDe: grupoDe };
})();
