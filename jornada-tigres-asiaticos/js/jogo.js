/* =====================================================================
   JORNADA DOS TIGRES ASIÁTICOS — motor do jogo
   Modos: Jornada (5 fases), Relâmpago (90 s), Explorar e Duelo.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.Arte, QUESTOES = window.QUESTOES, FASES = window.FASES, D = window.DADOS;
  var MUS = window.Musica, E = window.Embaralhar, SOM = window.Sons, ILUS = window.ILUSTRACOES, GRAF = window.GRAFICOS, GU = window.GraficosUtil;
  var app = document.getElementById('app');
  var barraMeio = document.getElementById('barra-meio');
  var placar = document.getElementById('placar');
  var vivo = document.getElementById('aviso-vivo');
  var NF = new Intl.NumberFormat('pt-BR');
  var reduzMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ic(n, c) { return A.icone(n, c); }
  function som(n) { SOM.tocar(n); }

  /* ------------------------------------------------ progresso salvo */
  var CHAVE = 'jornada-tigres-asiaticos-v1';
  function lerSalvo() { try { return JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; } catch (e) { return {}; } }
  var salvo = Object.assign({ nome: '', fases: {}, recorde: 0, insignias: [], efeitos: true, musica2: true, volMusica: 0.5, faixas: {} }, lerSalvo());
  function gravar() { try { localStorage.setItem(CHAVE, JSON.stringify(salvo)); } catch (e) { /* armazenamento indisponível */ } }

  var partida = null;
  var limpar = [];
  function limparTudo() { limpar.forEach(function (f) { try { f(); } catch (e) { /* nada */ } }); limpar = []; }

  /* ------------------------------------------------ utilidades visuais */
  function anunciar(msg) { vivo.textContent = ''; setTimeout(function () { vivo.textContent = msg; }, 30); }

  function flutuar(txt, x, y) {
    var el = document.createElement('div');
    el.className = 'flutua';
    el.textContent = txt;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 1300);
  }

  var cv = document.getElementById('confete'), cx = cv.getContext('2d'), parts = [], animConf = null;
  var CORES_CONF = ['#FF8A1F', '#FF3D8B', '#FFD23F', '#19C3E6', '#8250E0', '#16C47F', '#FFFFFF'];
  function confete(x, y, n, forca) {
    if (reduzMov) return;
    var dpr = window.devicePixelRatio || 1;
    if (cv.width !== innerWidth * dpr) { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    forca = forca || 1;
    for (var i = 0; i < (n || 80); i++) {
      parts.push({
        x: x * dpr, y: y * dpr, vx: (Math.random() - 0.5) * 16 * forca * dpr, vy: (-Math.random() * 14 - 5) * forca * dpr,
        r: (4 + Math.random() * 5) * dpr, cor: CORES_CONF[i % CORES_CONF.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
        forma: i % 3, vida: 0
      });
    }
    if (!animConf) animConf = requestAnimationFrame(passoConf);
  }
  function passoConf() {
    var dpr = window.devicePixelRatio || 1;
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(function (p) { return p.vida < 260 && p.y < cv.height + 40; });
    parts.forEach(function (p) {
      p.vida++; p.vy += 0.42 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.cor;
      if (p.forma === 0) cx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
      else if (p.forma === 1) { cx.beginPath(); cx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2); cx.fill(); }
      else { cx.beginPath(); cx.moveTo(0, -p.r); cx.lineTo(p.r, p.r); cx.lineTo(-p.r, p.r); cx.closePath(); cx.fill(); }
      cx.restore();
    });
    animConf = parts.length ? requestAnimationFrame(passoConf) : null;
    if (!parts.length) cx.clearRect(0, 0, cv.width, cv.height);
  }
  function centro(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

  function estrelasHTML(n, grandes) {
    var s = '<div class="estrelas' + (grandes ? ' grandes' : '') + '" role="img" aria-label="' + n + ' de 3 estrelas">';
    for (var i = 0; i < 3; i++) s += ic('estrela', i < n ? 'on' : '');
    return s + '</div>';
  }
  function iconeMarca() {
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="11" cy="10" r="6" fill="#FF9A3C"/><circle cx="29" cy="10" r="6" fill="#FF9A3C"/><circle cx="11" cy="10" r="3" fill="#FFF4E4"/><circle cx="29" cy="10" r="3" fill="#FFF4E4"/><circle cx="20" cy="22" r="15" fill="#FF9A3C"/><path d="M20 8v6M14 10q2 3 1 6M26 10q-2 3-1 6M6 20q4 1 6 3M34 20q-4 1-6 3" stroke="#3B1F14" stroke-width="2.2" stroke-linecap="round" fill="none"/><ellipse cx="20" cy="28" rx="9" ry="6.5" fill="#FFF4E4"/><circle cx="14.5" cy="21" r="2.4" fill="#241611"/><circle cx="25.5" cy="21" r="2.4" fill="#241611"/><path d="M17.5 25.5q2.5-2 5 0-1 2.5-2.5 2.5t-2.5-2.5z" fill="#FF6F91"/><path d="M8 11q2-9 12-9t12 9z" fill="#FFD23F"/></svg>';
  }

  /* ------------------------------------------------ troca de telas */
  function mostrar(html, depois, opts) {
    opts = opts || {};
    limparTudo();
    app.innerHTML = html;
    window.scrollTo(0, 0);
    if (!opts.semSom) som('whoosh');
    if (depois) depois();
    var foco = $('[data-foco]', app) || $('h1, h2', app);
    if (foco) { if (!foco.hasAttribute('tabindex')) foco.setAttribute('tabindex', '-1'); try { foco.focus({ preventScroll: true }); } catch (e) { foco.focus(); } }
  }
  function ligarNavegacao(raiz) {
    $$('[data-ir]', raiz || app).forEach(function (b) {
      b.addEventListener('click', function () { som('clique'); ir(b.getAttribute('data-ir'), b.getAttribute('data-arg')); });
    });
  }
  function ir(destino, arg) {
    switch (destino) {
      case 'inicio': partida = null; telaInicio(); break;
      case 'trilha': partida = null; telaTrilha(); break;
      case 'intro': telaIntro(+arg); break;
      case 'fase': iniciarFase(+arg); break;
      case 'relampago': telaRelampagoInicio(); break;
      case 'explorar': partida = null; telaExplorar(arg || 'mapa'); break;
      case 'duelo': partida = null; telaDueloConfig(); break;
      case 'professor': partida = null; telaProfessor(); break;
      case 'como': abrirComoJogar(); break;
      case 'certificado': telaCertificado(); break;
    }
  }

  /* ------------------------------------------------ barra superior */
  function hud(o) {
    o = o || {};
    if (!o.fase && !o.titulo) { barraMeio.innerHTML = ''; placar.hidden = true; return; }
    var s = '<span class="chip-fase"><span class="ponto" style="background:' + (o.cor || '#FFD23F') + '"></span><span class="nome-fase">' + esc(o.titulo) + '</span></span>';
    if (o.navio) {
      s += '<div class="navio-prog" aria-label="Progresso: questão ' + (o.navio.atual + 1) + ' de ' + o.navio.total + '"><div class="casco">';
      for (var i = 0; i < o.navio.total; i++) {
        var r = o.navio.res[i];
        s += '<span class="slot' + (r === true ? ' certo' : r === false ? ' errado' : '') + (i === o.navio.atual && r === undefined ? ' atual' : '') + '" style="--c:' + A.CORES_CONT[i % A.CORES_CONT.length] + '"></span>';
      }
      s += '</div><span class="ponte"></span></div>';
    }
    if (o.sequencia >= 2) s += '<span class="sequencia' + (o.sequencia >= 3 ? ' quente' : '') + '" title="Acertos seguidos">' + ic('fogo') + '×' + o.sequencia + '</span>';
    barraMeio.innerHTML = s;
    if (o.pontos !== undefined) { placar.hidden = false; placar.innerHTML = ic('conteiner') + '<span>' + NF.format(o.pontos) + '</span><span class="sr"> pontos</span>'; }
    else placar.hidden = true;
  }

  /* ================================================ TELA INICIAL */
  function totalEstrelas() { var t = 0; for (var k in salvo.fases) t += salvo.fases[k].estrelas || 0; return t; }
  function fasesConcluidas() { return FASES.filter(function (f) { return salvo.fases[f.n] && salvo.fases[f.n].feita; }).length; }

  function telaInicio() {
    trilha('inicio');
    hud();
    var html = '<section class="tela tela-inicio">' +
      '<div class="capa"><div class="capa-arte">' + ILUS.capa() + '</div>' +
      '<div class="capa-texto"><span class="rotulo-caps">Geografia · 9º ano · Industrialização na Ásia</span>' +
      '<h1 class="titulo-jogo" data-foco>Jornada dos <span class="quebra">Tigres Asiáticos</span></h1></div>' +
      '<div class="capa-kai">' + A.kai('ola') + '</div></div>' +
      '<div class="inicio-grade">' +
      '<div class="painel-jogador">' +
      '<div class="balao">Oi! Eu sou o Kai, o tigre operário. Vou guiar você dos arrozais de 1950 até a era dos chips!</div>' +
      '<label for="nome-jogador">Seu nome (vai aparecer no certificado)</label>' +
      '<input id="nome-jogador" class="campo" maxlength="40" autocomplete="off" placeholder="Digite seu nome" value="' + esc(salvo.nome) + '">' +
      '<div class="resumo-progresso"><span class="item">Fases concluídas: <strong>' + fasesConcluidas() + '/5</strong></span><span class="item">Estrelas: <strong>' + totalEstrelas() + '/15</strong></span><span class="item">Recorde no Relâmpago: <strong>' + NF.format(salvo.recorde || 0) + '</strong></span></div>' +
      '<div class="linha-botoes"><button type="button" class="btn fantasma pequeno" data-ir="como">' + ic('ajuda') + 'Como jogar</button><button type="button" class="btn fantasma pequeno" data-ir="professor">' + ic('livro') + 'Para o professor</button></div>' +
      '</div>' +
      '<div class="modos">' +
      botaoModo('trilha', '', 'navio', 'Jornada', '5 fases, da Ásia agrária aos desafios de hoje', 'TGRU 196 0') +
      botaoModo('relampago', 'magenta', 'raio', 'Relâmpago', '90 segundos para acertar o máximo que puder', 'RLMP 090 5') +
      botaoModo('explorar', 'ciano', 'mapa', 'Explorar', 'Mapa interativo, gráficos, curiosidades e linha do tempo', 'MAPA 024 7') +
      botaoModo('duelo', 'violeta', 'equipes', 'Duelo', 'Dois times disputam na tela da sala', 'DUEL 202 6') +
      '</div></div></section>';
    mostrar(html, function () {
      ligarNavegacao();
      var campo = $('#nome-jogador');
      campo.addEventListener('input', function () { salvo.nome = campo.value.trim(); gravar(); });
    }, { semSom: true });
  }
  function botaoModo(dest, cor, icone, nome, desc, cod) {
    return '<button type="button" class="conteiner-btn ' + cor + '" data-ir="' + dest + '"><span class="codigo" aria-hidden="true">' + cod + '</span><span class="ico">' + ic(icone) + '</span><span class="nome">' + nome + '</span><span class="desc">' + desc + '</span></button>';
  }

  /* ================================================ TRILHA DA JORNADA */
  function telaTrilha() {
    trilha('jornada');
    hud({ titulo: 'Jornada', cor: '#FF8A1F' });
    var s = '<section class="tela"><span class="rotulo-caps">Modo Jornada</span><h1 class="titulo-tela" data-foco>A rota dos Tigres</h1>' +
      '<p class="sub-tela">Cada porto é uma fase da história. Complete as cinco em ordem, como na aula, ou escolha a que quiser revisar. Acerte pelo menos 70% para ganhar a insígnia da fase.</p>' +
      '<div class="trilha">';
    FASES.forEach(function (f) {
      var reg = salvo.fases[f.n] || {};
      s += '<button type="button" class="porto" data-ir="intro" data-arg="' + f.n + '" style="--cor:' + f.cor + '">' +
        '<span class="num">' + f.n + '</span><span class="periodo">' + f.periodo + '</span><span class="nome">' + f.titulo + '</span>' +
        '<span class="miniatura">' + ILUS[f.ilustracao]() + '</span>' + estrelasHTML(reg.estrelas || 0) +
        '<span class="recorde">' + (reg.feita ? 'Melhor: ' + NF.format(reg.pontos || 0) + ' pontos' : 'Ainda não jogada') + '</span></button>';
    });
    s += '</div><div class="faixa-final"><div><span class="rotulo-caps">Insígnias</span><div class="insignias">';
    FASES.forEach(function (f) {
      var tem = salvo.insignias.indexOf(f.n) >= 0;
      s += '<span class="insignia' + (tem ? '' : ' bloq') + '"><span class="medalha">' + ic(tem ? 'estrela' : 'x') + '</span>' + f.insignia.nome + '</span>';
    });
    var pronto = fasesConcluidas() === 5;
    s += '</div></div><div class="linha-botoes"><button type="button" class="btn amarelo" data-ir="certificado"' + (pronto ? '' : ' disabled') + '>' + ic('certificado') + (pronto ? 'Ver meu certificado' : 'Certificado: faltam ' + (5 - fasesConcluidas()) + ' fase(s)') + '</button>' +
      '<button type="button" class="btn fantasma" data-ir="inicio">' + ic('casa') + 'Início</button></div></div></section>';
    mostrar(s, function () { ligarNavegacao(); });
  }

  /* ================================================ INTRODUÇÃO DA FASE */
  function telaIntro(n) {
    trilha('fase' + n);
    var f = FASES[n - 1];
    hud({ titulo: 'Fase ' + n + ' · ' + f.titulo, cor: f.cor });
    var s = '<section class="tela"><span class="rotulo-caps">Fase ' + n + ' de 5 · ' + f.periodo + '</span><h1 class="titulo-tela" data-foco>' + f.titulo + '</h1>' +
      '<div class="intro-grade"><div class="cartao cartao-ilus">' + ILUS[f.ilustracao]() + '</div>' +
      '<div class="cartao intro-texto" style="--cor:' + f.cor + '"><h2>Resumo rápido</h2><ul class="lista-pontos">' +
      f.resumo.map(function (r, i) { return '<li><span class="marcador">' + (i + 1) + '</span><span>' + r + '</span></li>'; }).join('') +
      '</ul><div class="fala-kai">' + A.kai(n === 5 ? 'pensando' : 'ola') + '<div class="balao">' + f.fala + '</div></div>' +
      '<div class="linha-botoes"><button type="button" class="btn grande laranja" data-ir="fase" data-arg="' + n + '">' + ic('play') + 'Começar a fase</button>' +
      '<button type="button" class="btn fantasma" data-ir="trilha">' + ic('voltar') + 'Trilha</button></div></div></div></section>';
    mostrar(s, function () { ligarNavegacao(); });
  }

  /* ================================================ MONTAGEM DAS PARTIDAS */
  function montarFase(n) {
    var daFase = QUESTOES.filter(function (q) { return q.fase === n; });
    var mc = daFase.filter(function (q) { return q.tipo === 'multipla'; });
    var mapas = E.embaralhar(daFase.filter(function (q) { return q.tipo === 'mapa'; })).slice(0, 2);
    var ess = mc.filter(function (q) { return q.essencial; });
    var outras = E.embaralhar(mc.filter(function (q) { return !q.essencial; }));
    var escolhidas = E.embaralhar(ess.concat(outras.slice(0, Math.max(0, 6 - ess.length))));
    // a questão de "trajetória" (resumo) fica por último
    var fim = escolhidas.filter(function (q) { return q.id === 'f5q10'; });
    escolhidas = escolhidas.filter(function (q) { return q.id !== 'f5q10'; });
    if (mapas[0]) escolhidas.splice(Math.min(2, escolhidas.length), 0, mapas[0]);
    if (mapas[1]) escolhidas.splice(Math.min(6, escolhidas.length), 0, mapas[1]);
    return escolhidas.concat(fim);
  }
  function novaPartida(modo, lista, extra) {
    partida = Object.assign({
      modo: modo, lista: lista, i: 0, pontos: 0, acertos: 0, sequencia: 0, maxSeq: 0, res: [], erros: [],
      sorteador: E.novoSorteador(), atual: null
    }, extra || {});
  }
  function iniciarFase(n) {
    trilha('fase' + n);
    novaPartida('jornada', montarFase(n), { fase: n });
    som('rugido');
    telaQuestao();
  }

  /* ================================================ TELA DE QUESTÃO */
  function visualHTML(q) {
    if (q.tipo === 'mapa') return '<div class="visual visual-mapa" id="mapa-q"></div>';
    var v = q.visual || {}, corpo = '';
    if (v.tipo === 'ilustracao' && ILUS[v.nome]) corpo = '<div class="visual-ilus" role="img" aria-label="' + esc(q.legenda || '') + '">' + ILUS[v.nome]() + '</div>';
    else if (v.tipo === 'grafico' && GRAF[v.nome]) corpo = '<div class="visual-graf">' + GRAF[v.nome]() + '</div>';
    else if (v.tipo === 'mapa') corpo = '<div class="visual-mapa" id="mapa-q" role="img" aria-label="' + esc(q.legenda || '') + '"></div>';
    var leg = v.tipo === 'grafico' ? '' : (q.legenda ? '<p class="legenda-visual">' + esc(q.legenda) + '</p>' : '');
    return '<div class="visual">' + corpo + leg + '</div>';
  }

  function hudPartida() {
    var p = partida, q = p.lista[p.i];
    if (p.modo === 'jornada') {
      var f = FASES[p.fase - 1];
      hud({ titulo: 'Fase ' + p.fase + ' · ' + f.titulo, cor: f.cor, pontos: p.pontos, sequencia: p.sequencia, navio: { total: p.lista.length, atual: p.i, res: p.res } });
    } else if (p.modo === 'relampago') {
      hud({ titulo: 'Relâmpago', cor: '#FF3D8B', pontos: p.pontos, sequencia: p.sequencia });
    } else if (p.modo === 'duelo') {
      hud({ titulo: 'Duelo', cor: '#8250E0', navio: { total: p.lista.length, atual: p.i, res: p.res } });
    }
    return q;
  }

  function telaQuestao() {
    var p = partida, q = hudPartida();
    p.atual = { q: q, inicio: performance.now(), dica: false, respondida: false, alts: null };
    var total = p.lista.length;
    var topo = '';
    if (p.modo === 'relampago') topo = '<div class="cabeca-questao"><span class="contador-q">QUESTÃO ' + (p.i + 1) + '</span><span class="tempo-num" id="tempo-num">' + Math.ceil(p.restante / 1000) + ' s</span></div><div class="cronometro" id="crono"><span style="transform:scaleX(' + (p.restante / p.duracao) + ')"></span></div>';
    else if (p.modo === 'duelo') topo = placarDuelo() + (p.tempoQ ? '<div class="cronometro" id="crono"><span></span></div>' : '');
    else topo = '<div class="cabeca-questao"><span class="contador-q">QUESTÃO ' + (p.i + 1) + ' DE ' + total + '</span>' + (q.tipo === 'mapa' ? '<span class="chip-fase">' + ic('alvo') + ' Missão no mapa</span>' : '') + '</div>';

    var lado = '<div class="questao-lado">' + topo;
    if (q.tipo === 'mapa') {
      lado += '<div class="missao-instrucao"><span class="alvo-ic">' + ic('alvo') + '</span><h2 class="enunciado" data-foco>' + esc(q.enunciado) + '</h2></div>' +
        '<p class="sub-tela" style="margin:0">Use os botões de zoom ou a roda do mouse para aproximar. Um clique vale como resposta.</p>';
    } else {
      lado += '<h2 class="enunciado" data-foco>' + esc(q.enunciado) + '</h2><div class="alternativas" id="alts" role="group" aria-label="Alternativas"></div>';
    }
    lado += '<div class="acoes-questao">' + (p.modo === 'relampago' ? '' : '<button type="button" class="btn-dica" id="btn-dica">' + ic('lampada') + 'Dica</button>') +
      '<button type="button" class="btn fantasma pequeno" id="btn-sair">' + ic('casa') + 'Sair</button></div><div id="dica-box"></div><div id="retorno"></div></div>';

    var html = '<section class="tela"><div class="questao-grade">' + visualHTML(q) + lado + '</div></section>';
    mostrar(html, function () {
      // alternativas
      if (q.tipo !== 'mapa') {
        var alts = E.montarAlternativas(q, p.sorteador);
        p.atual.alts = alts;
        var box = $('#alts');
        box.innerHTML = alts.map(function (a, i) {
          return '<button type="button" class="alt" data-i="' + i + '"><span class="letra" aria-hidden="true">' + 'ABCD'[i] + '</span><span class="txt"><span class="sr">Alternativa ' + 'ABCD'[i] + ': </span>' + esc(a.texto) + '</span><span class="marca-res" aria-hidden="true"></span></button>';
        }).join('');
        $$('.alt', box).forEach(function (b) { b.addEventListener('click', function () { responder(+b.getAttribute('data-i')); }); });
      }
      // mapa
      if (q.tipo === 'mapa') {
        p.atual.mapa = window.Mapa.criar($('#mapa-q'), {
          modo: 'missao', rotulos: false, grupos: false, zoom: true, foco: q.foco || 'asia',
          aoClicar: function (cod, ev) { responderMapa(cod, ev); }
        });
      } else if (q.visual && q.visual.tipo === 'mapa') {
        p.atual.mapa = window.Mapa.criar($('#mapa-q'), {
          modo: 'destaque', destaque: q.visual.destaque, grupoDestaque: q.visual.grupo === 'novos' ? 'novos' : 'tigres',
          rotulos: false, grupos: false, zoom: false, foco: q.visual.foco || 'asia'
        });
      }
      var bd = $('#btn-dica');
      if (bd) bd.addEventListener('click', function () { mostrarDica(); });
      $('#btn-sair').addEventListener('click', function () { som('clique'); sairPartida(); });
      if (p.modo === 'relampago') iniciarRelogioRelampago();
      if (p.modo === 'duelo' && p.tempoQ) iniciarRelogioDuelo();
    }, { semSom: p.i > 0 && p.modo === 'relampago' });
  }

  function sairPartida() {
    var modo = partida && partida.modo;
    partida = null;
    if (modo === 'jornada') telaTrilha(); else telaInicio();
  }

  function mostrarDica() {
    var p = partida;
    if (!p || !p.atual || p.atual.respondida || p.atual.dica) return;
    p.atual.dica = true;
    som('dica');
    var b = $('#btn-dica');
    if (b) b.disabled = true;
    $('#dica-box').innerHTML = '<div class="caixa-dica">' + ic('lampada') + '<span>' + esc(p.atual.q.dica) + (p.modo === 'jornada' ? ' <em>(a dica vale metade dos pontos)</em>' : '') + '</span></div>';
  }

  function calcularPontos() {
    var p = partida, seg = (performance.now() - p.atual.inicio) / 1000;
    if (p.modo === 'relampago') {
      var mult = Math.min(3, 1 + 0.5 * Math.floor(p.sequencia / 3));
      return Math.round(100 * mult);
    }
    if (p.modo === 'duelo') {
      var bonusD = p.tempoQ ? Math.max(0, Math.round(50 * (1 - seg / (p.tempoQ / 1000)))) : 0;
      return 100 + bonusD - (p.atual.dica ? 50 : 0);
    }
    var bonus = Math.max(0, Math.round(50 - seg * 2.5));
    var m = p.sequencia >= 5 ? 2 : p.sequencia >= 3 ? 1.5 : 1;
    var total = (100 + bonus) * m;
    if (p.atual.dica) total /= 2;
    return Math.round(total);
  }

  function registrar(acertou, origemEl) {
    var p = partida, q = p.atual.q;
    p.atual.respondida = true;
    var ganho = 0;
    if (acertou) {
      p.sequencia++;
      p.maxSeq = Math.max(p.maxSeq, p.sequencia);
      p.acertos++;
      ganho = calcularPontos();
      if (p.modo === 'duelo') { p.times[p.vez].pontos += ganho; p.times[p.vez].acertos++; }
      else p.pontos += ganho;
    } else {
      p.sequencia = 0;
      p.erros.push(q);
    }
    p.res[p.i] = acertou;
    if (p.modo === 'duelo') { var bx = $('#placar-duelo-box'); if (bx) bx.innerHTML = placarDueloInner(); }
    // efeitos
    if (acertou) {
      som('correto');
      if (p.sequencia === 3 || p.sequencia === 5 || p.sequencia === 8) setTimeout(function () { som('combo'); }, 300);
      else setTimeout(function () { som('moeda'); }, 260);
      var c = origemEl ? centro(origemEl) : { x: innerWidth / 2, y: innerHeight / 2 };
      confete(c.x, c.y, p.sequencia >= 3 ? 110 : 60, p.sequencia >= 3 ? 1.2 : 0.9);
      flutuar('+' + ganho, c.x, c.y - 20);
    } else som('errado');
    hudPartida();
    return ganho;
  }

  function responder(i) {
    var p = partida;
    if (!p || !p.atual || p.atual.respondida) return;
    var alts = p.atual.alts, escolhida = alts[i], acertou = escolhida.correta;
    var botoes = $$('.alt');
    botoes.forEach(function (b, k) {
      b.disabled = true;
      if (alts[k].correta) { b.classList.add('certa'); $('.marca-res', b).innerHTML = ic('check'); }
      else if (k === i) { b.classList.add('errada'); $('.marca-res', b).innerHTML = ic('x'); }
      else b.classList.add('apagada');
    });
    var ganho = registrar(acertou, botoes[i]);
    pararRelogios();
    if (p.modo === 'relampago') {
      anunciar(acertou ? 'Certo!' : 'Errado. A resposta era: ' + p.atual.q.correta);
      setTimeout(proximaRelampago, acertou ? 750 : 1700);
      return;
    }
    mostrarRetorno(acertou, ganho, alts.filter(function (a) { return a.correta; })[0].texto);
  }

  function responderMapa(cod, ev) {
    var p = partida;
    if (!p || !p.atual || p.atual.respondida) return;
    var q = p.atual.q, mapa = p.atual.mapa, acertou = cod === q.alvo;
    mapa.travar();
    if (acertou) { mapa.marcar(cod, 'certo'); }
    else { mapa.marcar(cod, 'errado'); mapa.marcar(q.alvo, 'alvo'); mapa.revelar(cod); }
    mapa.revelar(q.alvo);
    var alvoTela = null;
    var c = mapa.centro(q.alvo);
    if (c) { var pt = mapa.paraTela(c[0], c[1]); alvoTela = { getBoundingClientRect: function () { return { left: pt.x, top: pt.y, width: 0, height: 0 }; } }; }
    var ganho = registrar(acertou, acertou && ev ? { getBoundingClientRect: function () { return { left: ev.clientX, top: ev.clientY, width: 0, height: 0 }; } } : alvoTela);
    pararRelogios();
    var nome = D.nomes[q.alvo];
    if (p.modo === 'relampago') {
      anunciar(acertou ? 'Certo!' : 'Errado. ' + nome + ' está destacado em verde.');
      setTimeout(proximaRelampago, acertou ? 900 : 1900);
      return;
    }
    mostrarRetorno(acertou, ganho, nome, acertou ? null : D.nomes[cod]);
  }

  var FRASES_CERTO = ['Mandou bem!', 'Rugido de campeão!', 'Isso aí!', 'Na mosca!', 'Excelente!', 'Arrasou!'];
  var FRASES_ERRO = ['Quase!', 'Não foi dessa vez.', 'Opa, vamos revisar.', 'Faz parte aprender!'];
  function mostrarRetorno(acertou, ganho, textoCerto, clicado) {
    var p = partida, q = p.atual.q;
    var ultima = p.i >= p.lista.length - 1;
    var titulo = acertou ? FRASES_CERTO[E.rand(FRASES_CERTO.length)] : FRASES_ERRO[E.rand(FRASES_ERRO.length)];
    var s = '<div class="retorno" style="--c:' + (acertou ? 'var(--verde)' : 'var(--vermelho)') + '" role="status">' + A.kai(acertou ? 'feliz' : 'ops') +
      '<h3>' + ic(acertou ? 'check' : 'x') + titulo + (acertou && ganho ? ' <span class="pontos-ganhos">+' + ganho + ' pontos</span>' : '') + '</h3>' +
      (acertou ? '' : '<p><strong>Resposta certa:</strong> ' + esc(textoCerto) + (clicado ? ' <span style="color:var(--tinta-2)">(você clicou em ' + esc(clicado) + ')</span>' : '') + '</p>') +
      '<p>' + esc(q.explicacao) + '</p>' +
      (q.curiosidade ? '<div class="voce-sabia">' + ic('lampada') + '<div><strong>Você sabia?</strong>' + esc(q.curiosidade) + '</div></div>' : '') +
      '<div class="linha-botoes"><button type="button" class="btn ' + (acertou ? 'verde' : 'amarelo') + '" id="btn-proxima">' + (ultima ? ic('trofeu') + 'Ver resultado' : 'Próxima ' + ic('seta')) + '</button></div></div>';
    var box = $('#retorno');
    box.innerHTML = s;
    anunciar((acertou ? 'Resposta certa! ' + (ganho ? '+' + ganho + ' pontos. ' : '') : 'Resposta errada. A certa é: ' + textoCerto + '. ') + q.explicacao);
    var btn = $('#btn-proxima');
    btn.addEventListener('click', function () { som('clique'); proxima(); });
    setTimeout(function () {
      try { btn.focus({ preventScroll: true }); } catch (e) { btn.focus(); }
      var r = box.getBoundingClientRect();
      if (r.bottom > innerHeight || r.top < 0) box.scrollIntoView({ behavior: reduzMov ? 'auto' : 'smooth', block: 'nearest' });
    }, 350);
    var bd = $('#btn-dica');
    if (bd) bd.disabled = true;
  }

  function proxima() {
    var p = partida;
    if (!p) return;
    if (p.modo === 'duelo') { p.vez = 1 - p.vez; }
    p.i++;
    if (p.i >= p.lista.length) {
      if (p.modo === 'jornada') telaResultado();
      else if (p.modo === 'duelo') telaDueloFim();
      return;
    }
    telaQuestao();
  }

  /* ================================================ RESULTADO DA FASE */
  function telaResultado() {
    var p = partida, f = FASES[p.fase - 1], tot = p.lista.length, taxa = p.acertos / tot;
    var estrelas = taxa >= 0.9 ? 3 : taxa >= 0.7 ? 2 : taxa >= 0.5 ? 1 : 0;
    var reg = salvo.fases[p.fase] || {};
    var novoRecorde = !reg.feita || p.pontos > (reg.pontos || 0);
    salvo.fases[p.fase] = { feita: true, estrelas: Math.max(reg.estrelas || 0, estrelas), pontos: Math.max(reg.pontos || 0, p.pontos) };
    var ganhouInsignia = estrelas >= 2 && salvo.insignias.indexOf(p.fase) < 0;
    if (ganhouInsignia) salvo.insignias.push(p.fase);
    gravar();
    hud({ titulo: 'Fase ' + p.fase + ' concluída', cor: f.cor, pontos: p.pontos });

    var msg = estrelas === 3 ? 'Incrível! Você domina esta fase.' : estrelas === 2 ? 'Muito bom! Você ganhou a insígnia.' : estrelas === 1 ? 'Bom começo! Revise os erros e tente de novo.' : 'Vamos revisar juntos e tentar outra vez?';
    // navio com contêineres
    var navio = '<svg class="navio-grande" viewBox="-120 -80 250 120" aria-hidden="true"><path d="M-110 0 L110 0 L96 26 L-100 26Z" fill="#23305B"/><rect x="-110" y="0" width="220" height="5" fill="#E94F4F"/><rect x="70" y="-34" width="30" height="34" fill="#F4F6FB"/><rect x="74" y="-30" width="22" height="6" fill="#8FD3FF"/><rect x="82" y="-46" width="8" height="12" fill="#E94F4F"/>';
    for (var i = 0; i < p.acertos; i++) {
      var col = i % 8, lin = Math.floor(i / 8);
      navio += '<g class="ct" style="animation-delay:' + (0.15 * i) + 's">' + A.conteiner(-100 + col * 21, -13 - lin * 13, 20, 12, A.CORES_CONT[i % A.CORES_CONT.length]) + '</g>';
    }
    navio += '</svg>';
    var revisao = p.erros.length ? '<div class="cartao resultado-cartao"><h2 style="margin:0">Para revisar</h2><div class="lista-revisao">' + p.erros.map(function (q) {
      return '<div class="item-revisao"><span class="p">' + esc(q.enunciado) + '</span><span class="r">' + ic('check') + ' ' + esc(q.tipo === 'mapa' ? D.nomes[q.alvo] : q.correta) + '</span><span class="e">' + esc(q.explicacao) + '</span></div>';
    }).join('') + '</div></div>' : '';

    var s = '<section class="tela"><span class="rotulo-caps">Fase ' + p.fase + ' · ' + f.titulo + '</span><h1 class="titulo-tela" data-foco>' + (estrelas >= 2 ? 'Navio carregado!' : 'Fim da fase') + '</h1>' +
      '<div class="resultado"><div class="cartao resultado-cartao">' + estrelasHTML(estrelas, true) + '<p style="margin:0;font-size:1.15rem;font-weight:700">' + msg + '</p>' +
      '<div class="numeros"><div class="numero"><div class="v">' + p.acertos + '/' + tot + '</div><div class="r">acertos</div></div><div class="numero"><div class="v">' + NF.format(p.pontos) + '</div><div class="r">pontos' + (novoRecorde ? ' · recorde!' : '') + '</div></div><div class="numero"><div class="v">×' + p.maxSeq + '</div><div class="r">maior sequência</div></div></div>' +
      (ganhouInsignia ? '<div class="insignia"><span class="medalha">' + ic('estrela') + '</span>Nova insígnia: ' + f.insignia.nome + '</div>' : '') +
      '<div class="linha-botoes">' + (p.fase < 5 ? '<button type="button" class="btn laranja" data-ir="intro" data-arg="' + (p.fase + 1) + '">Próxima fase ' + ic('seta') + '</button>' : (fasesConcluidas() === 5 ? '<button type="button" class="btn amarelo" data-ir="certificado">' + ic('certificado') + 'Ver certificado</button>' : '')) +
      '<button type="button" class="btn ciano" data-ir="fase" data-arg="' + p.fase + '">' + ic('repetir') + 'Jogar de novo</button><button type="button" class="btn fantasma" data-ir="trilha">Trilha</button></div></div>' +
      '<div class="cena-partida" aria-hidden="true">' + navio + A.kai(estrelas >= 1 ? 'feliz' : 'pensando') + '</div></div>' + revisao + '</section>';
    mostrar(s, function () {
      ligarNavegacao();
      som('vitoria');
      if (estrelas >= 1) setTimeout(function () { confete(innerWidth / 2, innerHeight * 0.35, 160, 1.3); }, 300);
      if (ganhouInsignia) setTimeout(function () { som('insignia'); }, 1300);
      var t = setTimeout(function () { som('navio'); }, 1500);
      limpar.push(function () { clearTimeout(t); });
    }, { semSom: true });
  }

  /* ================================================ CERTIFICADO */
  function telaCertificado() {
    trilha('jornada');
    hud({ titulo: 'Certificado', cor: '#FFD23F' });
    var total = 0; FASES.forEach(function (f) { total += (salvo.fases[f.n] && salvo.fases[f.n].pontos) || 0; });
    var data = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    var podeImprimir = window.self === window.top;
    var nome = salvo.nome || 'Estudante';
    var s = '<section class="tela"><div class="certificado">' + '<div class="selo">' + A.kai('feliz') + '</div>' +
      '<span class="rotulo-caps" style="color:var(--laranja-esc)">Jornada dos Tigres Asiáticos · Geografia · 9º ano</span>' +
      '<h2 data-foco>Certificado de Especialista em Tigres Asiáticos</h2><p class="texto-cert">Certificamos que</p>' +
      '<div class="nome-cert">' + esc(nome) + '</div>' +
      '<p class="texto-cert">completou as cinco fases da jornada pela industrialização da Ásia: dos arrozais de 1950 aos Tigres, dos chips aos Novos Tigres e aos desafios do século XXI.</p>' +
      estrelasHTML(Math.round(totalEstrelas() / 5), true) +
      '<div class="rodape-cert"><span><strong>' + NF.format(total) + '</strong> pontos</span><span><strong>' + totalEstrelas() + '</strong>/15 estrelas</span><span><strong>' + salvo.insignias.length + '</strong>/5 insígnias</span><span>' + data + '</span></div></div>' +
      '<div class="linha-botoes nao-imprimir" style="margin-top:18px;justify-content:center">' + (podeImprimir ? '<button type="button" class="btn amarelo" id="btn-imprimir">' + ic('imprimir') + 'Imprimir ou salvar em PDF</button>' : '<p class="sub-tela" style="margin:0">Dica: tire um print da tela para guardar o seu certificado.</p>') +
      (salvo.nome ? '' : '<button type="button" class="btn fantasma" data-ir="inicio">Colocar meu nome</button>') +
      '<button type="button" class="btn fantasma" data-ir="trilha">Trilha</button></div></section>';
    mostrar(s, function () {
      ligarNavegacao();
      som('insignia');
      confete(innerWidth / 2, innerHeight * 0.3, 180, 1.4);
      var bi = $('#btn-imprimir');
      if (bi) bi.addEventListener('click', function () { window.print(); });
    });
  }

  /* ================================================ RELÂMPAGO */
  var relogio = null;
  function pararRelogios() { if (relogio) { clearInterval(relogio); relogio = null; } }
  limpar.push(pararRelogios);

  function telaRelampagoInicio() {
    trilha('relampago');
    hud({ titulo: 'Relâmpago', cor: '#FF3D8B' });
    var s = '<section class="tela"><span class="rotulo-caps">Modo Relâmpago</span><h1 class="titulo-tela" data-foco>90 segundos. Quantas você acerta?</h1>' +
      '<div class="intro-grade"><div class="cartao cartao-ilus">' + ILUS.tigreSalto() + '</div><div class="cartao intro-texto"><h2>Como funciona</h2><ul class="lista-pontos" style="--cor:var(--magenta)">' +
      '<li><span class="marcador">1</span><span>Questões de todas as fases aparecem sem parar, inclusive missões no mapa.</span></li>' +
      '<li><span class="marcador">2</span><span>Cada acerto vale 100 pontos. A cada 3 acertos seguidos, o multiplicador sobe (até ×3).</span></li>' +
      '<li><span class="marcador">3</span><span>Errou? A sequência zera, mas o relógio não para. No fim, você vê a revisão dos erros.</span></li></ul>' +
      '<p style="margin:0"><strong>Seu recorde:</strong> ' + NF.format(salvo.recorde || 0) + ' pontos</p>' +
      '<div class="linha-botoes"><button type="button" class="btn grande" id="btn-ja">' + ic('raio') + 'Valendo!</button><button type="button" class="btn fantasma" data-ir="inicio">Início</button></div></div></div></section>';
    mostrar(s, function () {
      ligarNavegacao();
      $('#btn-ja').addEventListener('click', function () { som('clique'); contagem(iniciarRelampago); });
    });
  }
  function contagem(fim) {
    var el = document.createElement('div');
    el.className = 'modal-fundo';
    el.innerHTML = '<div class="titulo-jogo" style="font-size:clamp(4rem,20vw,10rem)" aria-live="assertive">3</div>';
    document.body.appendChild(el);
    var n = 3, t = el.firstChild;
    som('tique');
    var iv = setInterval(function () {
      n--;
      if (n > 0) { t.textContent = n; som('tique'); }
      else if (n === 0) { t.textContent = 'JÁ!'; som('rugido'); }
      else { clearInterval(iv); el.remove(); fim(); }
    }, 750);
  }
  function poolRelampago() {
    var mc = QUESTOES.filter(function (q) { return q.tipo === 'multipla'; });
    var mp = QUESTOES.filter(function (q) { return q.tipo === 'mapa'; });
    var lista = E.embaralhar(mc.slice());
    var mapas = E.embaralhar(mp.slice()), vistos = {};
    mapas = mapas.filter(function (q) { if (vistos[q.alvo]) return false; vistos[q.alvo] = 1; return true; });
    // intercala uma missão de mapa a cada 4 questões
    var out = [];
    lista.forEach(function (q, i) { out.push(q); if (i % 4 === 3 && mapas.length) out.push(mapas.shift()); });
    return out;
  }
  function iniciarRelampago() {
    novaPartida('relampago', poolRelampago(), { duracao: 90000, restante: 90000 });
    partida.fimEm = performance.now() + partida.duracao;
    telaQuestao();
  }
  function iniciarRelogioRelampago() {
    pararRelogios();
    var ultimoSeg = null;
    relogio = setInterval(function () {
      var p = partida;
      if (!p || p.modo !== 'relampago') { pararRelogios(); return; }
      p.restante = Math.max(0, p.fimEm - performance.now());
      var barra = $('#crono span'), num = $('#tempo-num'), seg = Math.ceil(p.restante / 1000);
      if (barra) barra.style.transform = 'scaleX(' + (p.restante / p.duracao) + ')';
      if (num) num.textContent = seg + ' s';
      var cr = $('#crono');
      if (cr) cr.classList.toggle('urgente', seg <= 10);
      if (seg <= 5 && seg !== ultimoSeg && seg > 0) som('tique');
      ultimoSeg = seg;
      if (p.restante <= 0) { pararRelogios(); som('tempo'); fimRelampago(); }
    }, 100);
    limpar.push(pararRelogios);
  }
  function proximaRelampago() {
    var p = partida;
    if (!p || p.modo !== 'relampago') return;
    if (performance.now() >= p.fimEm) { fimRelampago(); return; }
    p.i++;
    if (p.i >= p.lista.length) { p.lista = p.lista.concat(poolRelampago()); }
    telaQuestao();
  }
  function fimRelampago() {
    var p = partida;
    if (!p || p.modo !== 'relampago' || p.acabou) return;
    p.acabou = true;
    pararRelogios();
    var respondidas = p.res.filter(function (r) { return r !== undefined; }).length;
    var recorde = p.pontos > (salvo.recorde || 0);
    if (recorde) { salvo.recorde = p.pontos; gravar(); }
    hud({ titulo: 'Relâmpago', cor: '#FF3D8B', pontos: p.pontos });
    var revisao = p.erros.length ? '<div class="cartao resultado-cartao"><h2 style="margin:0">Revise o que você errou</h2><div class="lista-revisao">' + p.erros.map(function (q) {
      return '<div class="item-revisao"><span class="p">' + esc(q.enunciado) + '</span><span class="r">' + ic('check') + ' ' + esc(q.tipo === 'mapa' ? D.nomes[q.alvo] : q.correta) + '</span><span class="e">' + esc(q.explicacao) + '</span></div>';
    }).join('') + '</div></div>' : '';
    var s = '<section class="tela"><span class="rotulo-caps">Tempo esgotado!</span><h1 class="titulo-tela" data-foco>' + (recorde ? 'Novo recorde!' : 'Fim do Relâmpago') + '</h1>' +
      '<div class="resultado"><div class="cartao resultado-cartao"><div class="numeros"><div class="numero"><div class="v">' + NF.format(p.pontos) + '</div><div class="r">pontos</div></div><div class="numero"><div class="v">' + p.acertos + '/' + respondidas + '</div><div class="r">acertos</div></div><div class="numero"><div class="v">×' + p.maxSeq + '</div><div class="r">maior sequência</div></div></div>' +
      '<p style="margin:0"><strong>Recorde:</strong> ' + NF.format(salvo.recorde) + ' pontos</p>' +
      '<div class="linha-botoes"><button type="button" class="btn" id="btn-de-novo">' + ic('repetir') + 'Jogar de novo</button><button type="button" class="btn fantasma" data-ir="inicio">Início</button></div></div>' +
      '<div class="cartao cartao-ilus">' + ILUS.tigreSalto() + '</div></div>' + revisao + '</section>';
    mostrar(s, function () {
      ligarNavegacao();
      som(recorde ? 'vitoria' : 'navio');
      if (recorde) confete(innerWidth / 2, innerHeight * 0.3, 180, 1.3);
      $('#btn-de-novo').addEventListener('click', function () { som('clique'); contagem(iniciarRelampago); });
    }, { semSom: true });
  }

  /* ================================================ DUELO */
  var dueloCfg = { t1: 'Time Tigre', t2: 'Time Dragão', rodadas: 5, tempo: 30 };
  function telaDueloConfig() {
    trilha('duelo');
    hud({ titulo: 'Duelo', cor: '#8250E0' });
    var s = '<section class="tela"><span class="rotulo-caps">Modo Duelo</span><h1 class="titulo-tela" data-foco>Dois times, uma tela</h1>' +
      '<p class="sub-tela">Projete o jogo na sala e divida a turma em dois times. Os times respondem em turnos alternados; cada acerto vale 100 pontos, com bônus por rapidez.</p>' +
      '<div class="cartao config-duelo"><div class="dois"><label>Nome do time 1<input class="campo" id="t1" maxlength="24" value="' + esc(dueloCfg.t1) + '"></label><label>Nome do time 2<input class="campo" id="t2" maxlength="24" value="' + esc(dueloCfg.t2) + '"></label></div>' +
      '<div><strong>Questões para cada time</strong><div class="opcoes" data-grupo="rodadas">' + [3, 5, 8].map(function (n) { return '<button type="button" class="opcao" data-v="' + n + '" aria-pressed="' + (dueloCfg.rodadas === n) + '">' + n + '</button>'; }).join('') + '</div></div>' +
      '<div><strong>Tempo por questão</strong><div class="opcoes" data-grupo="tempo">' + [[20, '20 s'], [30, '30 s'], [0, 'Sem limite']].map(function (o) { return '<button type="button" class="opcao" data-v="' + o[0] + '" aria-pressed="' + (dueloCfg.tempo === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="linha-botoes"><button type="button" class="btn violeta grande" id="btn-duelo">' + ic('equipes') + 'Começar o duelo</button><button type="button" class="btn claro" data-ir="inicio">Início</button></div></div></section>';
    mostrar(s, function () {
      ligarNavegacao();
      $$('.opcoes').forEach(function (g) {
        $$('.opcao', g).forEach(function (b) {
          b.addEventListener('click', function () {
            som('selecionar');
            $$('.opcao', g).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            b.setAttribute('aria-pressed', 'true');
            dueloCfg[g.getAttribute('data-grupo')] = +b.getAttribute('data-v');
          });
        });
      });
      $('#btn-duelo').addEventListener('click', function () {
        dueloCfg.t1 = $('#t1').value.trim() || 'Time 1';
        dueloCfg.t2 = $('#t2').value.trim() || 'Time 2';
        var pool = poolRelampago().slice(0, dueloCfg.rodadas * 2);
        novaPartida('duelo', pool, { vez: 0, tempoQ: dueloCfg.tempo * 1000, times: [{ nome: dueloCfg.t1, pontos: 0, acertos: 0 }, { nome: dueloCfg.t2, pontos: 0, acertos: 0 }] });
        som('rugido');
        telaQuestao();
      });
    });
  }
  function placarDuelo() { return '<div id="placar-duelo-box">' + placarDueloInner() + '</div>'; }
  function placarDueloInner() {
    var p = partida;
    return '<div class="placar-duelo" aria-live="polite"><div class="time t1' + (p.vez === 0 ? ' vez' : '') + '"><span class="n">' + esc(p.times[0].nome) + '</span><span class="p">' + NF.format(p.times[0].pontos) + '</span></div><span class="vs">VS</span>' +
      '<div class="time t2' + (p.vez === 1 ? ' vez' : '') + '"><span class="n">' + esc(p.times[1].nome) + '</span><span class="p">' + NF.format(p.times[1].pontos) + '</span></div></div>' +
      '<div class="cabeca-questao"><span class="contador-q">VEZ DE: ' + esc(p.times[p.vez].nome).toUpperCase() + ' · ' + (p.i + 1) + '/' + p.lista.length + '</span></div>';
  }
  function iniciarRelogioDuelo() {
    pararRelogios();
    var p = partida, ini = performance.now(), ult = null;
    relogio = setInterval(function () {
      if (!partida || partida !== p || p.atual.respondida) { pararRelogios(); return; }
      var rest = Math.max(0, p.tempoQ - (performance.now() - ini)), seg = Math.ceil(rest / 1000);
      var b = $('#crono span');
      if (b) b.style.transform = 'scaleX(' + (rest / p.tempoQ) + ')';
      var cr = $('#crono');
      if (cr) cr.classList.toggle('urgente', seg <= 5);
      if (seg <= 5 && seg !== ult && seg > 0) som('tique');
      ult = seg;
      if (rest <= 0) {
        pararRelogios(); som('tempo');
        var q = p.atual.q;
        if (q.tipo === 'mapa') { p.atual.mapa.travar(); p.atual.mapa.marcar(q.alvo, 'alvo'); p.atual.mapa.revelar(q.alvo); }
        else $$('.alt').forEach(function (bt, k) { bt.disabled = true; if (p.atual.alts[k].correta) bt.classList.add('certa'); else bt.classList.add('apagada'); });
        registrar(false, null);
        mostrarRetorno(false, 0, q.tipo === 'mapa' ? D.nomes[q.alvo] : q.correta);
        var h = $('#retorno h3');
        if (h) h.innerHTML = ic('relogio') + 'Tempo esgotado!';
      }
    }, 100);
    limpar.push(pararRelogios);
  }
  function telaDueloFim() {
    var p = partida, a = p.times[0], b = p.times[1];
    var empate = a.pontos === b.pontos, venc = a.pontos > b.pontos ? a : b;
    hud({ titulo: 'Duelo', cor: '#8250E0' });
    var s = '<section class="tela"><span class="rotulo-caps">Fim do duelo</span><h1 class="titulo-tela" data-foco>' + (empate ? 'Empate!' : esc(venc.nome) + ' venceu!') + '</h1>' +
      '<div class="placar-duelo"><div class="time t1' + (!empate && venc === a ? ' vez' : '') + '"><span class="n">' + esc(a.nome) + '</span><span class="p">' + NF.format(a.pontos) + '</span><span>' + a.acertos + ' acerto(s)</span></div><span class="vs">VS</span>' +
      '<div class="time t2' + (!empate && venc === b ? ' vez' : '') + '"><span class="n">' + esc(b.nome) + '</span><span class="p">' + NF.format(b.pontos) + '</span><span>' + b.acertos + ' acerto(s)</span></div></div>' +
      '<div class="resultado"><div class="cartao cartao-ilus">' + ILUS.tigreSalto() + '</div><div class="cartao resultado-cartao"><p style="margin:0;font-weight:700">' + (empate ? 'Os dois times mostraram que entendem de Tigres Asiáticos!' : 'Parabéns ao ' + esc(venc.nome) + '! Que tal uma revanche?') + '</p>' +
      '<div class="linha-botoes"><button type="button" class="btn violeta" data-ir="duelo">' + ic('repetir') + 'Revanche</button><button type="button" class="btn fantasma" data-ir="inicio">Início</button></div></div></div></section>';
    mostrar(s, function () { ligarNavegacao(); som('vitoria'); confete(innerWidth / 2, innerHeight * 0.3, 200, 1.4); }, { semSom: true });
  }

  /* ================================================ EXPLORAR */
  function telaExplorar(aba) {
    trilha('explorar');
    partida = null;
    hud({ titulo: 'Explorar', cor: '#19C3E6' });
    var abas = [['mapa', 'mapa', 'Mapa'], ['graficos', 'grafico', 'Gráficos'], ['curiosidades', 'lampada', 'Curiosidades'], ['tempo', 'relogio', 'Linha do tempo']];
    var s = '<section class="tela"><span class="rotulo-caps">Modo Explorar</span><h1 class="titulo-tela" data-foco>Explore a Ásia industrial</h1>' +
      '<div class="abas" role="tablist">' + abas.map(function (a) { return '<button type="button" class="aba" role="tab" data-aba="' + a[0] + '" aria-selected="' + (aba === a[0]) + '">' + ic(a[1]) + a[2] + '</button>'; }).join('') + '</div>' +
      '<div id="conteudo-aba"></div><div class="linha-botoes" style="margin-top:20px"><button type="button" class="btn fantasma" data-ir="inicio">' + ic('casa') + 'Início</button></div></section>';
    mostrar(s, function () {
      ligarNavegacao();
      $$('.aba').forEach(function (b) {
        b.addEventListener('click', function () {
          som('virar');
          $$('.aba').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
          b.setAttribute('aria-selected', 'true');
          abrirAba(b.getAttribute('data-aba'));
        });
      });
      abrirAba(aba);
    });
  }
  function abrirAba(aba) {
    var box = $('#conteudo-aba');
    if (aba === 'mapa') {
      box.innerHTML = '<div class="explorar-grade"><div><div class="camadas" role="group" aria-label="Camadas do mapa">' +
        [['tigres', 'Tigres', '#F26B21', true], ['novos', 'Novos Tigres', '#8250E0', true], ['protagonistas', 'Japão e China', '#FFD9A0', false]].map(function (c) {
          return '<button type="button" class="camada" data-camada="' + c[0] + '" aria-pressed="' + c[3] + '" style="--c:' + c[2] + '"><span class="bola"></span>' + c[1] + '</button>';
        }).join('') + '</div><div class="visual" id="mapa-explorar"></div></div><div class="cartao" id="ficha">' + fichaVazia() + '</div></div>';
      var mapa = window.Mapa.criar($('#mapa-explorar'), {
        modo: 'explorar', rotulos: true, grupos: true, zoom: true, foco: 'asia',
        aoClicar: function (cod) { som('pop'); $('#ficha').innerHTML = ficha(cod); ligarFicha(); }
      });
      $$('.camada').forEach(function (b) {
        b.addEventListener('click', function () {
          var on = b.getAttribute('aria-pressed') !== 'true';
          b.setAttribute('aria-pressed', String(on));
          mapa.camada(b.getAttribute('data-camada'), on);
          som('selecionar');
        });
      });
      window.__mapaExplorar = mapa;
    } else if (aba === 'graficos') {
      box.innerHTML = '<p class="sub-tela">Passe o mouse (ou toque) sobre barras e pontos para ver os valores. Cada gráfico tem a tabela com os dados.</p><div class="galeria">' +
        ['brasilCoreia', 'multiplicador', 'renda2022', 'urbanizacaoCoreia', 'portos', 'chips', 'china28', 'criseIndonesia'].map(function (g) { return '<div class="cartao">' + GRAF[g]() + '</div>'; }).join('') + '</div>';
    } else if (aba === 'curiosidades') {
      var vistos = {}, cards = [];
      QUESTOES.forEach(function (q) {
        var txt = q.curiosidade;
        if (!txt || vistos[txt]) return;
        vistos[txt] = 1;
        var nome = q.visual && q.visual.tipo === 'ilustracao' ? q.visual.nome : null;
        cards.push({ txt: txt, ilus: nome, fase: q.fase });
      });
      box.innerHTML = '<div class="curios">' + cards.map(function (c) {
        var f = FASES[c.fase - 1];
        return '<article class="cartao curio">' + (c.ilus && ILUS[c.ilus] ? '<div class="mini">' + ILUS[c.ilus]() + '</div>' : '<div class="mini" style="background:' + (f ? f.cor : '#8250E0') + ';height:10px"></div>') +
          '<div class="txt"><strong>' + (f ? 'Fase ' + f.n + ' · ' + f.titulo : 'Curiosidade') + '</strong><p>' + esc(c.txt) + '</p></div></article>';
      }).join('') + '</div>';
    } else if (aba === 'tempo') {
      var ev = [
        ['1945', 'Fim da Segunda Guerra Mundial. O Japão perde suas colônias, Coreia e Taiwan, e a Península Coreana é dividida.', '#5DBB46'],
        ['1950–1953', 'Guerra da Coreia. A divisão entre Coreia do Norte (socialista) e Coreia do Sul (capitalista) é mantida.', '#5DBB46'],
        ['1965', 'Singapura se torna um país independente.', '#FF8A1F'],
        ['1966', 'Taiwan cria em Kaohsiung sua primeira zona de processamento de exportação.', '#FF8A1F'],
        ['1968', 'Nasce a siderúrgica POSCO, na Coreia do Sul, e a Hyundai começa a montar carros da Ford.', '#FF8A1F'],
        ['1972', 'A Intel abre em Penang, na Malásia, sua primeira fábrica fora dos EUA.', '#FF8A1F'],
        ['1975', 'A Hyundai lança o Pony, o primeiro carro sul-coreano produzido em massa.', '#FF8A1F'],
        ['1987', 'É criada em Taiwan a TSMC, que se tornaria a maior fabricante de chips sob encomenda do mundo.', '#19C3E6'],
        ['1988', 'Seul, capital da Coreia do Sul, sedia os Jogos Olímpicos e mostra ao mundo o "Milagre do Rio Han".', '#19C3E6'],
        ['1997', 'A crise financeira asiática começa na Tailândia e se espalha pela região. Hong Kong deixa de ser colônia britânica e passa à China.', '#9B5DE5'],
        ['1998', 'Ficam prontas as Torres Petronas, em Kuala Lumpur (Malásia), os prédios mais altos do mundo até 2004.', '#9B5DE5'],
        ['2009', 'A Samsung abre sua primeira fábrica de celulares no Vietnã.', '#9B5DE5'],
        ['2011', 'Enchentes na Tailândia inundam fábricas de discos rígidos e fazem os preços quase dobrarem no mundo.', '#FF3D8B'],
        ['2021', 'Estudo mostra que 92% da capacidade de fabricar os chips mais avançados está em Taiwan.', '#FF3D8B'],
        ['2023', 'A China responde por cerca de 28% da produção industrial do planeta.', '#FF3D8B'],
        ['2024', 'O porto de Singapura movimenta 41,1 milhões de TEU, e a Coreia do Sul investe 5,13% do PIB em pesquisa.', '#FF3D8B']
      ];
      box.innerHTML = '<ol class="linha-tempo">' + ev.map(function (e) { return '<li style="--c:' + e[2] + '"><span class="ano">' + e[0] + '</span><span>' + e[1] + '</span></li>'; }).join('') + '</ol>';
    }
  }
  function fichaVazia() {
    return '<div class="ficha-vazia"><h2 style="margin:0;font-size:1.25rem">Clique em um país</h2><p style="margin:0">A ficha mostra capital, principais produtos, uma curiosidade e a renda por pessoa em 1960 e 2022.</p>' +
      '<ul class="legenda-mapa"><li style="--c:#F26B21"><span class="bola"></span>Tigres Asiáticos: Coreia do Sul, Taiwan, Hong Kong e Singapura</li><li style="--c:#8250E0"><span class="bola"></span>Novos Tigres: Malásia, Tailândia, Indonésia, Filipinas e Vietnã</li></ul>' +
      '<p class="aviso-mapa">Mapa ilustrativo, com fronteiras simplificadas. Hong Kong e Singapura aparecem como pontos por serem muito pequenos.</p></div>';
  }
  function ficha(cod) {
    var info = D.paises[cod] || {}, nome = D.nomes[cod] || cod, g = info.grupo, grupo = g ? D.grupos[g] : null;
    var selo = grupo ? '<span class="selo-grupo" style="--c:' + grupo.cor + '">' + grupo.nome.replace(' (mapa da aula)', '') + '</span>' : (info.papel ? '<span class="selo-grupo" style="--c:#1C1840">' + info.papel + '</span>' : '');
    return '<div class="ficha">' + '<div class="ficha-cab">' + A.bandeira(cod, { nome: nome }) + '<h3>' + nome + '</h3>' + selo + '</div>' +
      '<dl><dt>Tipo</dt><dd>' + (info.tipo || 'País') + '</dd>' + (info.capital && info.capital !== '—' ? '<dt>Capital</dt><dd>' + info.capital + '</dd>' : '') + '</dl>' +
      (info.produz ? '<div><div class="mini-titulo">Destaques da economia</div><div class="produz">' + info.produz.map(function (p) { return '<span>' + p + '</span>'; }).join('') + '</div></div>' : '') +
      (info.fato ? '<p class="fato">' + info.fato + '</p>' : '<p class="fato" style="color:var(--tinta-2)">Este país não faz parte dos grupos estudados nesta aula.</p>') +
      GU.miniRenda(cod) + '</div>';
  }
  function ligarFicha() { /* fichas são estáticas; reservado para futuras interações */ }

  /* ================================================ PROFESSOR */
  function telaProfessor() {
    trilha('inicio');
    hud({ titulo: 'Para o professor', cor: '#FFD23F' });
    var nq = QUESTOES.filter(function (q) { return q.tipo === 'multipla'; }).length, nm = QUESTOES.length - nq;
    var s = '<section class="tela prof"><div><span class="rotulo-caps">Guia rápido</span><h1 class="titulo-tela" data-foco>Para o professor</h1>' +
      '<p class="sub-tela">Jogo de revisão para a Aula 6 do 4º bimestre de Geografia do 9º ano (Material Digital SEDUC-SP): "Industrialização na Ásia: a trajetória dos Tigres e dos Novos Tigres Asiáticos".</p></div>' +
      '<div class="cartao"><h3>Habilidades trabalhadas</h3><p class="hab"><strong>EF09GE10</strong> Analisar os impactos do processo de industrialização na produção e circulação de produtos e culturas na Europa, na Ásia e na Oceania.</p>' +
      '<p class="hab"><strong>EF09GE11</strong> Relacionar as mudanças técnicas e científicas decorrentes do processo de industrialização com as transformações no trabalho e analisar e discutir as potencialidades e fragilidades desse processo em diferentes regiões do mundo, em especial no Brasil.</p>' +
      '<ul><li>Reconhecer o papel dos Tigres Asiáticos como polos industriais da Ásia.</li><li>Explicar o crescimento dos Novos Tigres Asiáticos e sua inserção na economia global.</li></ul></div>' +
      '<div class="cartao"><h3>Como usar em sala</h3><ul>' +
      '<li><strong>Jornada</strong> (cerca de 5 minutos por fase): as 5 fases seguem a ordem da aula. Cada fase sorteia 8 questões (6 de múltipla escolha e 2 missões no mapa); questões centrais sempre aparecem.</li>' +
      '<li><strong>Relâmpago</strong> (90 segundos): bom para aquecimento ou fechamento, individual ou em duplas.</li>' +
      '<li><strong>Duelo</strong>: projete na lousa e divida a turma em dois times que respondem em turnos.</li>' +
      '<li><strong>Explorar</strong>: mapa interativo, gráficos com tabelas, curiosidades e linha do tempo para apoiar a explicação.</li>' +
      '<li>Depois de cada resposta aparece uma explicação e, muitas vezes, uma curiosidade. Vale pausar e discutir com a turma.</li></ul></div>' +
      '<div class="cartao"><h3>Músicas</h3><p>Cada parte do jogo tem 3 músicas originais, compostas para o jogo com instrumentos do Leste e do Sudeste da Ásia. Para trocar, ajustar o volume ou desligar, use o botão de música no alto da tela.</p><ul class="lista-musicas">' +
        Object.keys(window.MUSICAS || {}).map(function (k) { return '<li><strong>' + esc(nomeTrilha(k)) + ':</strong> ' + window.MUSICAS[k].map(function (f) { return esc(f.nome); }).join(' · ') + '</li>'; }).join('') + '</ul></div>' +
      '<div class="cartao"><h3>Sobre as questões</h3><ul><li>O banco tem ' + nq + ' questões de múltipla escolha e ' + nm + ' missões no mapa, todas com imagem, gráfico ou mapa.</li>' +
      '<li>Cada questão tem uma única alternativa correta. A posição da correta é sorteada a cada vez, com equilíbrio entre A, B, C e D.</li>' +
      '<li>As distratoras foram escritas com tamanho parecido com o da correta, para que o tamanho não denuncie a resposta.</li>' +
      '<li>Para editar ou criar questões, abra o arquivo <code>js/questoes.js</code>. Para conferir o banco, rode <code>node ferramentas/checar-questoes.js</code>.</li>' +
      '<li>O mapa é ilustrativo, com fronteiras simplificadas desenhadas para o jogo. Não serve para medir distâncias ou áreas.</li></ul></div>' +
      '<div class="cartao"><h3>Fontes dos dados</h3><ul class="fontes">' + D.fontes.map(function (f) { return '<li>' + esc(f.t) + (f.u ? ' — <a href="' + esc(f.u) + '" target="_blank" rel="noopener">' + esc(f.u) + '</a>' : '') + '</li>'; }).join('') + '</ul></div>' +
      '<div class="cartao"><h3>Progresso salvo</h3><p>O progresso fica guardado apenas neste navegador. Em computadores compartilhados, apague antes de trocar de estudante.</p><div id="apagar-box"><button type="button" class="btn claro pequeno" id="btn-apagar">Apagar progresso deste navegador</button></div></div>' +
      '<div class="cartao"><h3>Créditos</h3><p>Ilustrações, mapa, mascote, gráficos, efeitos sonoros e as 30 músicas foram criados especialmente para este jogo, em código (SVG e Web Audio). Fontes tipográficas: Bungee, Lexend e IBM Plex Mono (Google Fonts, licença SIL Open Font License).</p></div>' +
      '<div class="linha-botoes"><button type="button" class="btn fantasma" data-ir="inicio">' + ic('casa') + 'Início</button></div></section>';
    mostrar(s, function () {
      ligarNavegacao();
      $('#btn-apagar').addEventListener('click', function () {
        $('#apagar-box').innerHTML = '<div class="confirmar">Tem certeza? Isso apaga fases, estrelas, insígnias e recorde. <button type="button" class="btn pequeno" id="sim-apagar">Sim, apagar</button><button type="button" class="btn claro pequeno" id="nao-apagar">Cancelar</button></div>';
        $('#sim-apagar').addEventListener('click', function () {
          salvo.fases = {}; salvo.insignias = []; salvo.recorde = 0; salvo.nome = ''; gravar();
          $('#apagar-box').innerHTML = '<p style="margin:0;font-weight:700;color:var(--verde-esc)">Progresso apagado.</p>';
        });
        $('#nao-apagar').addEventListener('click', function () { telaProfessor(); });
      });
    });
  }

  /* ================================================ COMO JOGAR (janela) */
  function abrirComoJogar() {
    var el = document.createElement('div');
    el.className = 'modal-fundo';
    el.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="como-t"><h2 id="como-t">Como jogar</h2><ol>' +
      '<li><strong>Leia a questão e observe a imagem, o gráfico ou o mapa.</strong> Eles trazem pistas!</li>' +
      '<li><strong>Escolha uma alternativa</strong> clicando nela ou apertando as teclas 1, 2, 3, 4 (ou A, B, C, D).</li>' +
      '<li><strong>Missões no mapa:</strong> clique no país pedido. Use o zoom para achar os pequenos, como Singapura e Hong Kong.</li>' +
      '<li><strong>Pontos:</strong> 100 por acerto, bônus por rapidez e multiplicador para acertos seguidos. A dica custa metade dos pontos.</li>' +
      '<li><strong>Estrelas:</strong> 50% de acertos = 1 estrela, 70% = 2 estrelas e insígnia, 90% = 3 estrelas.</li>' +
      '<li>Termine as 5 fases da Jornada para ganhar o <strong>certificado</strong>.</li>' +
      '<li><strong>Música:</strong> o botão de música, no alto, mostra 3 músicas para cada parte do jogo e o volume.</li></ol>' +
      '<div class="linha-botoes"><button type="button" class="btn laranja" id="fechar-como">Entendi!</button></div></div>';
    document.body.appendChild(el);
    var fechar = function () { el.remove(); document.removeEventListener('keydown', esc_); };
    var esc_ = function (e) { if (e.key === 'Escape') fechar(); };
    document.addEventListener('keydown', esc_);
    el.addEventListener('click', function (e) { if (e.target === el) fechar(); });
    var b = $('#fechar-como', el);
    b.addEventListener('click', function () { som('clique'); fechar(); });
    b.focus();
  }

  /* ================================================ TECLADO */
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if ($('.modal-fundo')) return;
    var p = partida;
    if (!p || !p.atual) return;
    if (!p.atual.respondida && p.atual.alts) {
      var k = e.key.toLowerCase(), idx = '1234'.indexOf(k);
      if (idx < 0) idx = 'abcd'.indexOf(k);
      if (idx >= 0 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); responder(idx); }
    } else if (p.atual.respondida && e.key === 'Enter') {
      var b = $('#btn-proxima');
      if (b && document.activeElement !== b) { e.preventDefault(); b.click(); }
    }
  });

  /* ================================================ DICA DOS GRÁFICOS */
  var dicaG = document.getElementById('dica-grafico');
  function posDica(x, y) {
    var w = dicaG.offsetWidth, h = dicaG.offsetHeight;
    dicaG.style.left = Math.min(innerWidth - w - 8, Math.max(8, x + 14)) + 'px';
    dicaG.style.top = Math.max(8, y - h - 12) + 'px';
  }
  document.addEventListener('pointerover', function (e) {
    var m = e.target.closest && e.target.closest('.marca[data-tip]');
    if (!m) return;
    dicaG.textContent = m.getAttribute('data-tip');
    dicaG.hidden = false;
    posDica(e.clientX, e.clientY);
  });
  document.addEventListener('pointermove', function (e) {
    if (dicaG.hidden) return;
    var m = e.target.closest && e.target.closest('.marca[data-tip]');
    if (m) posDica(e.clientX, e.clientY); else dicaG.hidden = true;
  });
  document.addEventListener('focusin', function (e) {
    var m = e.target.closest && e.target.closest('.marca[data-tip]');
    if (!m) { dicaG.hidden = true; return; }
    dicaG.textContent = m.getAttribute('data-tip');
    dicaG.hidden = false;
    var r = m.getBoundingClientRect();
    posDica(r.left + r.width / 2, r.top);
  });
  document.addEventListener('scroll', function () { dicaG.hidden = true; }, true);

  /* ================================================ SOM: botões da barra */
  var bEf = document.getElementById('btn-efeitos'), bMu = document.getElementById('btn-musica');
  function pintarSom() {
    bEf.setAttribute('aria-pressed', String(salvo.efeitos));
    bEf.innerHTML = ic(salvo.efeitos ? 'som' : 'mudo');
    bEf.title = salvo.efeitos ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros';
    bMu.removeAttribute('aria-pressed');
    bMu.setAttribute('aria-haspopup', 'dialog');
    bMu.setAttribute('aria-expanded', String(!!painel));
    bMu.setAttribute('aria-label', 'Música: ' + (salvo.musica2 ? 'ligada' : 'desligada') + '. Abrir opções de música');
    bMu.classList.toggle('desligada', !salvo.musica2);
    bMu.innerHTML = ic(salvo.musica2 ? 'musica' : 'semMusica');
    bMu.title = 'Música';
  }
  bEf.addEventListener('click', function () {
    salvo.efeitos = !salvo.efeitos; gravar();
    SOM.ligarEfeitos(salvo.efeitos); SOM.cfg.efeitos = salvo.efeitos;
    pintarSom(); som('clique');
  });

  /* ================================================ MÚSICA: trilha de cada tela e painel */
  var NOMES_TRILHA = { inicio: 'Tela inicial', jornada: 'Jornada (trilha das fases)', relampago: 'Relâmpago', duelo: 'Duelo', explorar: 'Explorar' };
  function nomeTrilha(id) {
    var m = /^fase(\d)$/.exec(id);
    if (m) { var f = FASES[+m[1] - 1]; return 'Fase ' + m[1] + ' · ' + (f ? f.titulo : ''); }
    return NOMES_TRILHA[id] || id;
  }
  function trilha(id) { if (MUS) MUS.contexto(id); pintarPainel(); }
  var painel = null;
  function abrirPainel() {
    if (painel) { fecharPainel(true); return; }
    painel = document.createElement('div');
    painel.className = 'painel-musica';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-label', 'Música');
    document.body.appendChild(painel);
    pintarPainel();
    pintarSom();
    setTimeout(function () { document.addEventListener('pointerdown', foraDoPainel, true); }, 0);
    document.addEventListener('keydown', escPainel, true);
    var foco = painel.querySelector('.pm-op[aria-checked="true"]') || painel.querySelector('button');
    if (foco) foco.focus();
  }
  function fecharPainel(devolverFoco) {
    if (!painel) return;
    painel.remove(); painel = null;
    document.removeEventListener('pointerdown', foraDoPainel, true);
    document.removeEventListener('keydown', escPainel, true);
    pintarSom();
    if (devolverFoco) bMu.focus();
  }
  function foraDoPainel(e) { if (painel && !painel.contains(e.target) && !bMu.contains(e.target)) fecharPainel(false); }
  function escPainel(e) { if (e.key === 'Escape') { e.stopPropagation(); fecharPainel(true); } }
  function pintarPainel() {
    if (!painel || !MUS) return;
    var st = MUS.estado(), id = st.contexto, ops = MUS.opcoes(id), escolha = MUS.escolhida(id);
    var focado = document.activeElement && painel.contains(document.activeElement) ? document.activeElement.getAttribute('data-foco-pm') : null;
    painel.innerHTML =
      '<div class="pm-topo"><strong>' + ic('musica') + 'Música</strong><button type="button" class="pm-fechar" data-foco-pm="fechar" aria-label="Fechar">' + ic('x') + '</button></div>' +
      '<div class="pm-linha"><span id="pm-rotulo">Música ' + (st.ligada ? 'ligada' : 'desligada') + '</span><button type="button" class="pm-chave" data-foco-pm="chave" role="switch" aria-checked="' + st.ligada + '" aria-labelledby="pm-rotulo"><span></span></button></div>' +
      '<label class="pm-vol"><span>Volume</span><input type="range" min="0" max="100" step="5" value="' + Math.round(st.volume * 100) + '" data-foco-pm="vol"></label>' +
      '<div class="pm-onde">Músicas desta parte do jogo:<strong>' + esc(nomeTrilha(id)) + '</strong></div>' +
      '<div class="pm-opcoes" role="radiogroup" aria-label="Escolha a música">' + ops.map(function (o, i) {
        var sel = i === escolha;
        return '<button type="button" class="pm-op" role="radio" aria-checked="' + sel + '" data-i="' + i + '" data-foco-pm="op' + i + '"><span class="pm-num">' + (i + 1) + '</span><span class="pm-txt"><b>' + esc(o.nome) + '</b><small>' + esc(o.desc) + '</small></span>' +
          (sel && st.ligada ? '<span class="pm-eq' + (st.tocando ? ' tocando' : '') + '" aria-hidden="true"><i></i><i></i><i></i></span>' : '<span class="pm-eq vazio" aria-hidden="true"></span>') + '</button>';
      }).join('') + '</div>' +
      '<p class="pm-nota">Cada parte do jogo tem 3 músicas próprias, todas originais e compostas para o jogo. A escolha fica salva neste navegador.</p>';
    $('.pm-fechar', painel).addEventListener('click', function () { fecharPainel(true); });
    $('.pm-chave', painel).addEventListener('click', function () {
      salvo.musica2 = !salvo.musica2; gravar();
      MUS.iniciarAudio(); MUS.ligar(salvo.musica2);
      pintarSom(); pintarPainel();
    });
    var vol = $('.pm-vol input', painel);
    vol.addEventListener('input', function () { MUS.iniciarAudio(); MUS.volume(vol.value / 100); });
    vol.addEventListener('change', function () { salvo.volMusica = vol.value / 100; gravar(); });
    $$('.pm-op', painel).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        salvo.faixas[id] = i;
        if (!salvo.musica2) { salvo.musica2 = true; MUS.ligar(true); }
        gravar();
        MUS.iniciarAudio(); MUS.escolher(id, i);
        pintarSom(); pintarPainel();
      });
    });
    $('.pm-opcoes', painel).addEventListener('keydown', function (e) { // setas trocam a opção, como num grupo de rádio
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var bs = $$('.pm-op', painel), atualI = bs.indexOf(document.activeElement), prox = bs[(atualI + d + bs.length) % bs.length];
      if (prox) prox.click();
    });
    if (focado) { var alvo = painel.querySelector('[data-foco-pm="' + focado + '"]'); if (alvo) alvo.focus(); }
    else if (document.activeElement === document.body) { var sel2 = painel.querySelector('.pm-op[aria-checked="true"]'); if (sel2) sel2.focus(); }
  }
  bMu.addEventListener('click', function () { som('clique'); abrirPainel(); });
  if (MUS) MUS.aoMudar(function () { if (painel) { var eq = painel.querySelector('.pm-op[aria-checked="true"] .pm-eq'); if (eq) eq.classList.toggle('tocando', !!MUS.estado().tocando); } });
  document.getElementById('btn-marca').addEventListener('click', function () { som('clique'); ir('inicio'); });
  document.getElementById('btn-marca').innerHTML = iconeMarca() + '<span>Jornada dos Tigres</span>';
  var primeiroToque = function () {
    SOM.iniciar();
    if (MUS) MUS.iniciarAudio();
    document.removeEventListener('pointerdown', primeiroToque, true);
    document.removeEventListener('keydown', primeiroToque, true);
  };
  document.addEventListener('pointerdown', primeiroToque, true);
  document.addEventListener('keydown', primeiroToque, true);

  /* ================================================ INÍCIO */
  function iniciar(dados) {
    if (dados && dados.salvo) Object.assign(salvo, dados.salvo);
    SOM.cfg.efeitos = salvo.efeitos;
    if (MUS) MUS.configurar({ ligada: salvo.musica2, volume: salvo.volMusica, escolhas: salvo.faixas || {} });
    pintarSom();
    telaInicio();
  }
  var hot = window.claude && window.claude.hot;
  try { if (hot && hot.snapshot) hot.snapshot(function () { return { salvo: salvo }; }); } catch (e) { /* opcional */ }
  if (hot && hot.ready) hot.ready(iniciar); else iniciar(hot && hot.data ? hot.data : {});

  window.Jogo = { ir: ir, estado: function () { return { salvo: salvo, partida: partida }; } };
})();
