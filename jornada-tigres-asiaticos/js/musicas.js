/* =====================================================================
   JORNADA DOS TIGRES ASIÁTICOS — as 30 músicas de fundo
   ---------------------------------------------------------------------
   Três opções originais para cada parte do jogo. Todas foram compostas
   para este jogo, inspiradas em estilos musicais do Leste e do Sudeste
   da Ásia, e são tocadas pelo motor de js/musica.js.

   Como ler uma melodia: cada nota é "grau:duração".
   • O grau é a posição na escala de 5 notas (0 = tônica, 5 = tônica uma
     oitava acima, -1 = uma nota abaixo da tônica). A duração é em tempos.
   • Ornamentos depois do grau: ~ trêmulo ou vibrato, < deslize de baixo,
     ^ nota de graça, * glissando de cítara, ! acento. "r" é pausa.
   • As raízes (RA, RB...) dizem sobre qual nota o acompanhamento se apoia
     em cada compasso.
   ===================================================================== */
(function () {
  'use strict';

  /* ================================================== TELA INICIAL */
  var lanternas = {
    id: 'lanternas', nome: 'Lanternas no Porto', desc: 'Guzheng (cítara chinesa) com ondas do mar ao fundo',
    bpm: 70, ganho: 1.24, nivelAmb: 0.7, escala: 'gong', tonica: 62, ambiente: ['ondas'],
    compor: function (M) {
      var A = M.linha('2*:1 3:1 4:2 | 3:1 2:.5 1:.5 2:2 | 0:1 1:1 2:1 4:1 | 3~:4 | 2:1 3:1 4:2 | 5:1 4:.5 3:.5 4:2 | 3:1 2:1 1:1 2:1 | 0~:4');
      var B = M.linha('5*:1.5 6:.5 7:2 | 6:1 5:1 4~:2 | 5:1 4:.5 3:.5 2:1 3:1 | 4~:4 | 4:1 5:1 6:2 | 5:1 4:1 3~:2 | 2:1 3:.5 2:.5 1:1 2:1 | 0~:4');
      var RA = [0, 0, 4, 3, 0, 4, 3, 0], RB = [0, 4, 0, 4, 3, 3, 3, 0], RC = [0, 4, 3, 0];
      var forma = [['A', 8], ['B', 8], ['A', 8], ['coda', 4]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : RC[s.i];
        if (s.nome === 'A') M.frase('guzheng', A, s.i, t, { vel: 0.6 });
        if (s.nome === 'B') M.frase('guzheng', B, s.i, t, { vel: 0.64 });
        M.acomp('guzheng2', t, r, 'quartas', 0.4);
        if (s.nome === 'B' || s.idx === 2) M.pad('sho', t, M.acorde(r, -5), M.compasso * 1.02, s.nome === 'B' ? 0.55 : 0.35);
        if (s.nome === 'coda' && s.i === 0) M.metal('sino', 10, t, 0.4);
      };
    }
  };
  var bambu = {
    id: 'bambu', nome: 'Jardim de Bambu', desc: 'Shakuhachi (flauta de bambu japonesa) e koto, com água corrente',
    bpm: 60, ganho: 1.0, escala: 'zhi', tonica: 62, ambiente: ['agua', 'shishi'],
    compor: function (M) {
      var A = M.linha('0:2 1<:1 2:1 | 3~:3 r:1 | 4:1 3:1 2:1 1:1 | 2~:3 r:1 | 3:2 4^:1 5:1 | 4~:3 r:1 | 3:1 2:1 1:1 -1:1 | 0~:3 r:1');
      var B = M.linha('5:2 6:1 7:1 | 6~:3 r:1 | 5:1 4:1 5:1 3:1 | 4~:3 r:1 | 3:1 4:1 5:2 | 4:1 3:1 2:2 | 1:1 2:1 1:1 -1:1 | 0~:3 r:1');
      var RA = [0, 3, 2, 2, 3, 2, 1, 0], RB = [0, 1, 2, 2, 3, 2, 1, 0];
      var forma = [['A', 8], ['B', 8], ['koto', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = (s.nome === 'B' ? RB : RA)[s.i];
        if (s.nome === 'A') M.frase('shakuhachi', A, s.i, t, { vel: 0.72 });
        if (s.nome === 'B') M.frase('shakuhachi', B, s.i, t, { vel: 0.75 });
        if (s.nome === 'koto') M.frase('koto2', A, s.i, t, { vel: 0.5, oitava: 1, dobra: { cents: 60, em: 0.35, volta: 0.9 } });
        M.acomp('koto', t, r, 'harpa', s.nome === 'koto' ? 0.3 : 0.36);
      };
    }
  };
  var brisa = {
    id: 'brisa', nome: 'Brisa do Leste', desc: 'Erhu (violino chinês de duas cordas) e yangqin, com sinos',
    bpm: 76, ganho: 0.84, escala: 'yu', tonica: 69,
    compor: function (M) {
      var A = M.linha('0:1.5 1:.5 2:1 3:1 | 4~:2 3:1 2:1 | 3:1 2:.5 1:.5 0:1 -1:1 | 0~:4 | 2:1.5 3:.5 4:1 5:1 | 6~:2 5:1 4:1 | 3:1 4:.5 3:.5 2:1 1:1 | 2~:4');
      var B = M.linha('5:1 4:1 3:2 | 4:1 3:.5 2:.5 1:2 | 2:1 1:1 0:1 -1:1 | -2~:2 -1:2 | 0:1.5 1:.5 2:1 3:1 | 2:1 1:.5 0:.5 -1:2 | 0:1 1:1 -1:1 -2:1 | 0~:4');
      var RA = [0, 1, 0, 0, 2, 1, 1, 2], RB = [0, 1, 4, 1, 0, 4, 0, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8], ['A', 8], ['B', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'B' ? RB[s.i] : s.nome === 'A' ? RA[s.i] : 0;
        if (s.nome === 'A') M.frase('erhu', A, s.i, t, { vel: 0.7 });
        if (s.nome === 'B') M.frase('erhu', B, s.i, t, { vel: 0.72 });
        M.acomp('yangqin', t, r - 5, 'oitavas', 0.3);
        if (s.i === 0) M.metal('celesta', 10 + (s.idx % 2) * 2, t, 0.45);
        if (s.nome === 'B') { M.pad('cordas', t, M.acorde(r, -10), M.compasso * 1.02, 0.5); M.grade('bloco', t, '..o...o.', 0.3); }
      };
    }
  };

  /* ================================================== JORNADA (trilha) */
  var rumo = {
    id: 'rumo', nome: 'Rumo ao Oriente', desc: 'Dizi (flauta chinesa) e guzheng em ritmo de viagem',
    bpm: 88, ganho: 1.05, escala: 'gong', tonica: 67,
    compor: function (M) {
      var A = M.linha('3:.5 4:.5 5:1 4:.5 3:.5 2:1 | 3:1 5:1 4:2 | 2:.5 3:.5 4:1 3:.5 2:.5 1:1 | 2~:3 r:1 | 3:.5 4:.5 5:1 6:.5 5:.5 4:1 | 5:1 7:1 6:2 | 5:.5 4:.5 3:1 2:.5 1:.5 2:1 | 0~:3 r:1');
      var B = M.linha('7:1 6:.5 5:.5 6:2 | 5:1 4:.5 3:.5 4:2 | 3:1 4:1 5:1 3:1 | 2~:4 | 2:.5 3:.5 4:1 5:1 7:1 | 6:1 5:1 4:2 | 3:.5 2:.5 1:1 2:.5 3:.5 1:1 | 0~:4');
      var RA = [0, 4, 3, 0, 0, 4, 3, 0], RB = [4, 0, 3, 0, 4, 1, 3, 0], RP = [0, 4, 3, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8], ['A', 8], ['ponte', 4]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : RP[s.i % 4];
        if (s.nome === 'A') M.frase('dizi', A, s.i, t, { vel: 0.66 });
        if (s.nome === 'B') M.frase('dizi', B, s.i, t, { vel: 0.7 });
        M.acomp('guzheng2', t, r - 5, 'oitavas', 0.34);
        M.grade('bloco', t, 'x...x...', 0.26);
        M.grade('tung', t, 'o.......', 0.4);
        if (s.nome === 'B') { M.grade('chocalho', t, '.o.o.o.o', 0.5); M.pad('cordas', t, M.acorde(r, -5), M.compasso * 1.02, 0.4); }
      };
    }
  };
  var ilhas = {
    id: 'ilhas', nome: 'Ilhas do Sol', desc: 'Sanshin de Okinawa, castanholas sanba e a alegre escala de Ryukyu',
    bpm: 92, ganho: 1.14, escala: 'ryukyu', tonica: 60, swing: 0.1,
    compor: function (M) {
      var A = M.linha('0:.5 1:.5 2:.5 3:.5 4:1 3:1 | 2:.5 1:.5 2:1 1:1 0:1 | 1:.5 2:.5 3:1 5:1 4:1 | 3~:3 r:1 | 0:.5 1:.5 2:.5 3:.5 4:1 5:1 | 6:.5 5:.5 4:1 3:1 2:1 | 1:.5 2:.5 3:.5 2:.5 1:1 -1:1 | 0~:3 r:1');
      var B = M.linha('5:1 4:.5 3:.5 2:1 1:1 | 2:.5 3:.5 2:.5 1:.5 0:2 | -1:.5 0:.5 1:.5 2:.5 3:1 2:1 | 1~:3 r:1 | 5:1 6:.5 5:.5 4:1 3:1 | 2:.5 3:.5 4:.5 3:.5 2:2 | 1:.5 2:.5 1:.5 0:.5 -1:1 1:1 | 0~:3 r:1');
      var RA = [0, 2, 3, 3, 0, 3, 3, 0], RB = [0, 2, 3, 0, 0, 3, 3, 0];
      var forma = [['A', 8], ['B', 8], ['A', 8], ['ponte', 2]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : 0;
        if (s.nome === 'A') { M.frase('sanshin', A, s.i, t, { vel: 0.62 }); if (s.idx === 2) M.frase('fue', A, s.i, t, { vel: 0.38, oitava: 1 }); }
        if (s.nome === 'B') M.frase('sanshin', B, s.i, t, { vel: 0.62 });
        M.acomp('sanshin2', t, r, 'kachashi', 0.34);
        M.grade('sanba', t, '..x...x.', 0.5);
        M.grade('taiko', t, 'x.......', 0.3);
      };
    }
  };
  var estrelas = {
    id: 'estrelas', nome: 'Mapa das Estrelas', desc: 'Celesta e shō (órgão de boca japonês), calmo como um céu estrelado',
    bpm: 64, ganho: 1.24, escala: 'gong', tonica: 64,
    compor: function (M) {
      var L = M.gerar({ compassos: 8, ritmos: [[2, 2], [3, 1], [1, 1, 2], [4]], cad: [[4]], min: 3, max: 10, inicio: 5, fins: [5, 10], meio: 8, orn: 0 });
      var R = [0, 4, 3, 1, 0, 4, 1, 3];
      return function (c, t) {
        var k = c % 16, r = R[k % 8], q = M.quinta(r - 5);
        M.arpejo('celesta', t, [r - 5, q, r, M.quinta(r), r + 5, M.quinta(r), r, q], 0.5, 0.3);
        M.pad('sho', t, M.acorde(r, -5), M.compasso * 1.02, 0.4);
        if (k >= 8) M.frase('celesta2', L, k - 8, t, { vel: 0.42 });
      };
    }
  };

  /* ================================================== FASE 1 — A Ásia agrária */
  var arrozal = {
    id: 'arrozal', nome: 'Chuva no Arrozal', desc: 'Shakuhachi e koto na escala in, com chuva fina e sapos',
    bpm: 58, ganho: 0.97, escala: 'in', tonica: 64, ambiente: ['chuva', 'sapos'],
    compor: function (M) {
      var A = M.linha('0:2 2:1 3:1 | 4~:3 3:1 | 2:1 3:1 2:1 1:1 | 0~:3 r:1 | 2:2 3:1 4:1 | 5~:3 4:1 | 3:1 4:1 3:1 2:1 | 2~:3 r:1');
      var B = M.linha('5:2 4:1 5:1 | 6~:3 5:1 | 4:1 3:1 4:1 2:1 | 3~:3 r:1 | 2:1 3:1 4:2 | 3:1 2:1 1:2 | 1:1.5 2:.5 1:1 -2:1 | 0~:3 r:1');
      var RA = [0, 2, 2, 0, 2, 1, 2, 2], RB = [1, 1, 2, 0, 2, 2, 0, 0];
      var forma = [['A', 8], ['B', 8], ['koto', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = (s.nome === 'B' ? RB : RA)[s.i];
        if (s.nome === 'A') M.frase('shakuhachi', A, s.i, t, { vel: 0.72 });
        if (s.nome === 'B') M.frase('shakuhachi', B, s.i, t, { vel: 0.75 });
        if (s.nome === 'koto') M.frase('koto2', A, s.i, t, { vel: 0.5, dobra: { cents: 60, em: 0.4, volta: 1.2 } });
        M.acomp('koto', t, r, 'harpa', 0.34);
      };
    }
  };
  var colheita = {
    id: 'colheita', nome: 'Canção da Colheita', desc: 'Dizi e guzheng numa canção de trabalho no campo, com blocos de madeira',
    bpm: 84, ganho: 1.08, escala: 'zhi', tonica: 67,
    compor: function (M) {
      var A = M.linha('3:1 3:.5 4:.5 5:1 4:1 | 3:.5 2:.5 1:1 2:2 | 3:1 4:1 3:.5 2:.5 1:1 | 0~:3 r:1 | 5:1 5:.5 6:.5 7:1 6:1 | 5:.5 4:.5 3:1 4:2 | 3:.5 4:.5 3:.5 2:.5 1:1 2:1 | 0~:3 r:1');
      var B = M.linha('2:1 3:1 4:1 5:1 | 4:.5 3:.5 2:1 1:2 | 2:1 1:.5 0:.5 -1:1 0:1 | 1~:3 r:1 | 2:1 3:1 4:1 5:1 | 6:.5 5:.5 4:1 3:2 | 4:.5 3:.5 2:1 1:1 2:1 | 0~:3 r:1');
      var RA = [0, 2, 3, 0, 2, 0, 3, 0], RB = [2, 1, 0, 1, 2, 3, 2, 0];
      var forma = [['A', 8], ['B', 8], ['A', 8], ['ponte', 2]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : 0;
        if (s.nome === 'A') M.frase('dizi', A, s.i, t, { vel: 0.64 });
        if (s.nome === 'B') M.frase('dizi', B, s.i, t, { vel: 0.66 });
        M.acomp('guzheng2', t, r - 5, 'oitavas', 0.32);
        M.grade('bloco', t, 'x...x...', 0.25);
        M.grade('mokugyo', t, '..o...o.', 0.3);
        if (s.i % 2 === 0) M.grade('tung', t, 'x.......', 0.35);
      };
    }
  };
  var entardecer = {
    id: 'entardecer', nome: 'Entardecer no Campo', desc: 'Sapos, grilos e vento ao anoitecer, com uma flauta distante e tigelas cantantes',
    bpm: 60, ganho: 1.22, nivelAmb: 0.85, escala: 'gong', tonica: 62, ambiente: ['vento', 'grilos', 'sapos'],
    mix: { dizi: [0.1, 0.55, 0.08, 0.9] },
    compor: function (M) {
      var L1 = M.gerar({ compassos: 8, ritmos: [[2, 2], [3, 1], [4], [1, 1, 2]], cad: [[4]], min: 0, max: 7, inicio: 2, fins: [0, 5], orn: 0.8 });
      var L2 = M.gerar({ compassos: 8, ritmos: [[2, 2], [3, 1], [4], [2, 1, 1]], cad: [[4]], min: 2, max: 9, inicio: 5, fins: [5], orn: 0.8 });
      var R = [0, 0, 4, 4, 3, 3, 0, 0];
      return function (c, t) {
        var k = c % 32, r = R[Math.floor(k / 4) % 8];
        if (k < 8) M.frase('dizi', L1, k, t, { vel: 0.42 });
        else if (k >= 16 && k < 24) M.frase('dizi', L2, k - 16, t, { vel: 0.42 });
        if (k % 8 === 0) M.metal('tigela', r - 5, t, 0.6);
        if (k % 4 === 0) M.pad('sho', t, M.acorde(r, -5), M.compasso * 4, 0.28);
      };
    }
  };

  /* ================================================== FASE 2 — O salto dos Tigres */
  var seul = {
    id: 'seul', nome: 'Cordas de Seul', desc: 'Gayageum (cítara coreana) e daegeum (flauta coreana) em ritmo balançado, com janggu',
    bpm: 58, ganho: 0.99, escala: 'zhi', tonica: 63,
    compor: function (M) {
      var A = M.linha('3:1 4:2/3 3:1/3 2:1 1:1 | 2~:2 r:1 1:2/3 2:1/3 | 3:1 2:2/3 1:1/3 0:1 -1:1 | 0~:3 r:1 | 3:1 4:2/3 5:1/3 4:1 3:1 | 2~:2 3:2/3 2:1/3 1:1 | 2:1 1:2/3 0:1/3 -1:1 -2:1 | -1~:3 r:1');
      var B = M.linha('5:1 6:2/3 5:1/3 4:1 3:1 | 4~:2 5:2/3 4:1/3 3:1 | 2:1 3:2/3 2:1/3 1:1 0:1 | 1~:3 r:1 | 3:1 2:2/3 1:1/3 0:1 1:1 | 2~:2 1:2/3 0:1/3 -1:1 | 0:1 -1:2/3 -2:1/3 -1:1 1:1 | 0~:3 r:1');
      var RA = [0, 2, 3, 0, 0, 1, 3, 1], RB = [0, 2, 1, 1, 3, 1, 3, 0];
      var forma = [['A', 8], ['B', 8], ['gaya', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = (s.nome === 'B' ? RB : RA)[s.i];
        if (s.nome === 'A') M.frase('daegeum', A, s.i, t, { vel: 0.66 });
        if (s.nome === 'B') M.frase('daegeum', B, s.i, t, { vel: 0.7 });
        if (s.nome === 'gaya') M.frase('gayageum2', A, s.i, t, { vel: 0.62 });
        M.acomp('gayageum', t, r, 'rolado', 0.3);
        M.grade('kung', t, 'x....xx.....', 0.5, 1 / 3);
        M.grade('deok', t, 'x..x.....x.o', 0.35, 1 / 3);
      };
    }
  };
  var fabricas = {
    id: 'fabricas', nome: 'Fábricas ao Amanhecer', desc: 'Pipa (alaúde chinês) e erhu, com um pulso leve de blocos de madeira',
    bpm: 96, ganho: 0.99, escala: 'gong', tonica: 65,
    compor: function (M) {
      var A = M.linha('0:1 2:1 3:2 | 4:1 3:.5 2:.5 3:2 | 5:1 4:1 3:1 2:1 | 1~:4 | 0:1 2:1 3:2 | 4:1 5:.5 6:.5 5:2 | 4:1 3:1 2:1 1:1 | 0~:4');
      var B = M.linha('5:1.5 6:.5 5:1 4:1 | 3~:2 4:1 3:1 | 2:1.5 3:.5 2:1 1:1 | 0~:2 -1:2 | 0:1 1:1 2:1 3:1 | 4:1.5 5:.5 4:1 3:1 | 2:1 1:1 2:1 3:.5 2:.5 | 0~:4');
      var RA = [0, 4, 0, 1, 0, 4, 3, 0], RB = [4, 3, 0, 4, 0, 4, 3, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8], ['A', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : 0;
        if (s.nome === 'A') M.frase('erhu', A, s.i, t, { vel: 0.68 });
        if (s.nome === 'B') M.frase('erhu', B, s.i, t, { vel: 0.7 });
        M.acomp('pipa', t, r - 5, 'pulso', 0.28);
        M.grade('bloco', t, 'x.o.x.o.', 0.22);
        if (s.nome === 'B') M.pad('cordas', t, M.acorde(r, -10), M.compasso * 1.02, 0.45);
      };
    }
  };
  var tigre = {
    id: 'tigre', nome: 'Tigre Veloz', desc: 'Koto em ritmo acelerado, fue (flauta japonesa) e taiko suave',
    bpm: 100, ganho: 0.99, escala: 'zhi', tonica: 62,
    compor: function (M) {
      var ritmos = [[0.5, 0.5, 1, 1, 1], [1, 0.5, 0.5, 2], [0.5, 0.5, 0.5, 0.5, 2], [1, 1, 1, 1], [1.5, 0.5, 1, 1]];
      var A = M.gerar({ compassos: 8, ritmos: ritmos, cad: [[2, 2], [4]], min: 0, max: 8, inicio: 3, fins: [0, 5], orn: 0.4 });
      var B = M.gerar({ compassos: 8, ritmos: ritmos, cad: [[2, 2], [4]], min: 2, max: 9, inicio: 5, fins: [5], orn: 0.4 });
      var R = [0, 0, 3, 3, 2, 2, 1, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8], ['A', 8], ['ponte', 2]];
      return function (c, t) {
        var s = M.secao(c, forma), r = R[s.i % 8];
        if (s.nome === 'A') M.frase('fue', A, s.i, t, { vel: 0.6 });
        if (s.nome === 'B') M.frase('fue', B, s.i, t, { vel: 0.62 });
        M.acomp('koto', t, r - 5, 'oitavas', 0.34);
        M.grade('taiko', t, 'x....x..', 0.45);
        M.grade('ka', t, '..x...x.', 0.5);
      };
    }
  };

  /* ================================================== FASE 3 — Chips, portos e o mundo */
  var jade = {
    id: 'jade', nome: 'Circuito de Jade', desc: 'Sinos e piano elétrico com eco, baixo suave e chocalho: o Oriente eletrônico',
    bpm: 88, ganho: 1.12, escala: 'gong', tonica: 60, swing: 0.06,
    compor: function (M) {
      var L = M.gerar({ compassos: 8, ritmos: [[1.5, 0.5, 2], [1, 1, 2], [0.5, 1, 0.5, 2], [2, 1, 1]], cad: [[4], [2, 2]], min: 2, max: 9, inicio: 5, fins: [5], orn: 0 });
      var R = [0, 4, 1, 3];
      return function (c, t) {
        var k = c % 16, r = R[Math.floor(k / 2) % 4], q = M.quinta(r);
        var acd = [r - 5, M.quinta(r - 5), r, r + 2];
        M.ep(acd, t, 1.5, 0.34); M.ep(acd, M.em(t, 2.5), 1, 0.26);
        M.baixo(r - 10, t, 1.5, 0.42); M.baixo(M.quinta(r - 10), M.em(t, 2.5), 1, 0.34);
        if (k < 8) M.arpejo('celesta', t, [r + 5, q + 5, r + 10, q + 5, r + 5, q + 5, r + 10, q + 10], 0.5, 0.22);
        else M.frase('celesta2', L, k - 8, t, { vel: 0.4 });
        M.grade('taiko', t, 'x....x..', 0.35);
        M.grade('bloco', t, '..o...o.', 0.2);
        M.grade('chocalho', t, '.o.o.o.o', 0.45);
      };
    }
  };
  var hongkong = {
    id: 'hongkong', nome: 'Luzes de Hong Kong', desc: 'Yangqin (saltério chinês) e erhu, com o mar do porto à noite',
    bpm: 72, ganho: 0.99, nivelAmb: 0.7, escala: 'yu', tonica: 64, ambiente: ['ondas'],
    compor: function (M) {
      var A = M.linha('0:1.5 1:.5 2:1 3:1 | 4~:2 3:1 2:1 | 3:1 2:1 1:1 0:1 | -1~:4 | 0:1.5 1:.5 2:1 4:1 | 5~:2 4:1 3:1 | 2:1 3:.5 2:.5 1:1 -1:1 | 0~:4');
      var B = M.linha('3:1 4:1 5:2 | 6:1 5:1 4~:2 | 3:1 4:.5 3:.5 2:1 1:1 | 2~:4 | 5:1 4:1 3:2 | 4:1 3:.5 2:.5 1:2 | 2:1 1:1 0:1 -1:1 | 0~:4');
      var RA = [0, 1, 0, 4, 2, 0, 4, 0], RB = [0, 1, 1, 2, 0, 4, 2, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8], ['A', 8], ['coda', 2]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : 0;
        if (s.nome === 'A') M.frase('erhu', A, s.i, t, { vel: 0.68 });
        if (s.nome === 'B') M.frase('erhu', B, s.i, t, { vel: 0.7 });
        M.tremolo('yangqin', r - 5, t, M.beat * 1.8, 0.3);
        M.tremolo('yangqin', M.quinta(r - 5), t + 0.02, M.beat * 1.8, 0.24);
        M.arpejo('yangqin', M.em(t, 2), [r - 5, M.quinta(r - 5), r, M.quinta(r - 5)], 0.5, 0.26);
        M.pad('cordas', t, M.acorde(r, -10), M.compasso * 1.02, 0.35);
      };
    }
  };
  var nanometro = {
    id: 'nanometro', nome: 'Nanômetro', desc: 'Dois sinos repetem desenhos de tamanhos diferentes e se encaixam como engrenagens',
    bpm: 76, ganho: 1.07, escala: 'gong', tonica: 61,
    compor: function (M) {
      var P1 = [5, 7, 8, 10, 8], P2 = [0, 3, 4, 3, 5, 2];
      return function (c, t) {
        for (var k = 0; k < 8; k++) {
          var n = c * 8 + k;
          M.toca('celesta', P1[n % 5], M.em(t, k * 0.5), 0.5, 0.3);
          M.toca('gender', P2[n % 6], M.em(t, k * 0.5), 0.5, 0.26);
        }
        var r = [0, 4, 3, 1][Math.floor(c / 4) % 4];
        if (c % 4 === 0) M.pad('sho', t, M.acorde(r, -5), M.compasso * 4, 0.35);
        M.baixo(r - 5, t, 4, 0.25);
        if (c % 8 === 7) M.metal('sino', 12, M.em(t, 3), 0.4);
      };
    }
  };

  /* ================================================== FASE 4 — Os Novos Tigres */
  var gamelao = {
    id: 'gamelao', nome: 'Gamelão de Java', desc: 'Gamelão javanês: saron, bonang, gongos e a flauta suling, na escala slendro',
    bpm: 66, ganho: 1.17, escala: 'slendro', tonica: 60,
    compor: function (M) {
      // balungan (melodia-base): 8 grupos de 4 notas; o gongo marca o fim do ciclo
      var BAL = [1, 0, 1, -1, 1, 0, -1, -2, -1, 0, 1, 2, 3, 2, 1, 0, 2, 3, 2, 1, -1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, -1];
      return function (c, t) {
        var ciclo = Math.floor(c / 8), g8 = c % 8, base = g8 * 4, i;
        for (i = 0; i < 4; i++) {
          var nota = BAL[base + i], tb = M.em(t, i);
          M.metal('saron', nota, tb, 0.5);
          M.metal('demung', nota - 5, tb, 0.3);
          M.metal('peking', nota + 5, tb, 0.2); M.metal('peking', nota + 5, M.em(t, i + 0.5), 0.15);
        }
        if (ciclo % 3 !== 0) { // bonang: pares de notas em colcheias
          for (i = 0; i < 4; i += 2) {
            var a = BAL[base + i] + 5, b = BAL[base + i + 1] + 5;
            M.metal('bonang', a, M.em(t, i), 0.2); M.metal('bonang', b, M.em(t, i + 0.5), 0.18);
            M.metal('bonang', a, M.em(t, i + 1), 0.2); M.metal('bonang', b, M.em(t, i + 1.5), 0.18);
          }
        }
        var seleh = BAL[base + 3];
        M.metal('kenong', seleh, M.em(t, 3), 0.4);
        if (g8 % 2 === 1) M.metal('kempul', seleh - 5, M.em(t, 1), 0.35);
        M.perc('kethuk', M.em(t, 1), 0.4);
        if (g8 === 0) M.metal('gong', -10, t, 0.6);
        M.grade('dhe', t, 'x.......', 0.35); M.grade('tung', t, '...o....', 0.3); M.grade('tak', t, '.....o..', 0.25);
        if (ciclo % 3 === 2) M.toca('suling', seleh + 5, M.em(t, 1.5), 2.2, 0.45, { trem: true, gra: g8 % 2 === 0 });
      };
    }
  };
  var chaophraya = {
    id: 'chaophraya', nome: 'Rio Chao Phraya', desc: 'Ranat ek (xilofone tailandês), khim e címbalos ching, na escala tailandesa',
    bpm: 90, ganho: 0.98, escala: 'tailandesa', tonica: 62, ambiente: ['agua'],
    compor: function (M) {
      var rit = [[0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1], [1, 0.5, 0.5, 1, 1], [0.5, 0.5, 1, 0.5, 0.5, 1], [0.5, 0.5, 0.5, 0.5, 2]];
      var A = M.gerar({ compassos: 8, ritmos: rit, cad: [[1, 1, 2], [2, 2]], min: 0, max: 8, inicio: 3, fins: [0, 5], orn: 0.9 });
      var B = M.gerar({ compassos: 8, ritmos: rit, cad: [[1, 1, 2], [4]], min: 2, max: 9, inicio: 5, fins: [5], orn: 0.9 });
      var R = [0, 0, 3, 3, 1, 1, 0, 0];
      var forma = [['A', 8], ['B', 8], ['A', 8], ['khim', 4]];
      return function (c, t) {
        var s = M.secao(c, forma), r = R[s.i % 8];
        if (s.nome !== 'khim') { var L = s.nome === 'A' ? A : B; M.frase('ranat', L, s.i, t, { vel: 0.55 }); M.frase('ranat2', L, s.i, t, { vel: 0.33, oitava: 1 }); }
        M.acomp('khim', t, r, s.nome === 'khim' ? 'harpa' : 'baixo', 0.3);
        M.perc('ching', M.em(t, 1), 0.5); M.perc('chap', M.em(t, 3), 0.6);
        M.grade('dhe', t, 'x.......', 0.3); M.grade('tak', t, '.....o..', 0.25);
      };
    }
  };
  var kulintang = {
    id: 'kulintang', nome: 'Kulintang das Ilhas', desc: 'Kulintang (gongos em fila) das Filipinas, com agung e o tambor dabakan',
    bpm: 100, ganho: 1.17, escala: 'kulintang', tonica: 67,
    compor: function (M) {
      var rit = [[0.5, 0.5, 1, 0.5, 0.5, 1], [0.5, 1, 0.5, 1, 1], [1, 0.5, 0.5, 0.5, 0.5, 1], [0.5, 0.5, 0.5, 0.5, 1, 1]];
      var A = M.gerar({ compassos: 8, ritmos: rit, cad: [[1, 1, 2]], min: 0, max: 7, inicio: 2, fins: [0, 5], orn: 0.3 });
      var B = M.gerar({ compassos: 8, ritmos: rit, cad: [[1, 1, 2]], min: 1, max: 8, inicio: 4, fins: [0, 5], orn: 0.3 });
      var forma = [['A', 8], ['B', 8]];
      return function (c, t) {
        var s = M.secao(c, forma);
        M.frase('kulintang', s.nome === 'A' ? A : B, s.i, t, { vel: 0.55 });
        M.metal('agung', -5, t, 0.5); M.metal('agung', -5, M.em(t, 1.5), 0.3);
        M.metal('agung2', -2, M.em(t, 1), 0.35); M.metal('agung2', -2, M.em(t, 3), 0.35);
        M.grade('babandir', t, 'xoxoxoxo', 0.35);
        M.grade('dabakan', t, 'x.xo.x.o', 0.4);
      };
    }
  };

  /* ================================================== FASE 5 — Desafios do século XXI */
  var energia = {
    id: 'energia', nome: 'Energia Limpa', desc: 'Piano elétrico, erhu e cordas num tema de esperança',
    bpm: 76, ganho: 0.96, escala: 'gong', tonica: 63,
    compor: function (M) {
      var A = M.linha('0:1 1:1 2:1 3:1 | 4~:3 3:1 | 2:1 3:1 5:1 4:1 | 3~:4 | 2:1 3:1 4:1 5:1 | 6~:3 5:1 | 4:1 3:1 2:1 1:1 | 2~:4');
      var B = M.linha('5:1.5 4:.5 5:1 6:1 | 7~:3 6:1 | 5:1 4:1 3:1 4:1 | 5~:4 | 4:1 3:1 2:1 3:1 | 4:1.5 3:.5 2:2 | 1:1 2:1 3:1 1:1 | 0~:4');
      var RA = [0, 4, 0, 3, 4, 1, 3, 0], RB = [0, 4, 3, 0, 4, 1, 3, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8], ['A', 8], ['B', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = s.nome === 'A' ? RA[s.i] : s.nome === 'B' ? RB[s.i] : 0;
        if (s.nome === 'A') M.frase('erhu', A, s.i, t, { vel: 0.66 });
        if (s.nome === 'B') M.frase('erhu', B, s.i, t, { vel: 0.7 });
        M.ep([r - 5, M.quinta(r - 5), r, r + 2], t, 2, 0.3);
        M.arpejo('ep', M.em(t, 2), [r, M.quinta(r), r + 5, M.quinta(r)], 0.5, 0.2);
        M.baixo(r - 10, t, 3.5, 0.36);
        if (s.nome === 'B') M.pad('cordas', t, M.acorde(r, -5), M.compasso * 1.02, 0.5);
        if (s.i === 0) M.metal('celesta', 10, t, 0.35);
      };
    }
  };
  var horizonte = {
    id: 'horizonte', nome: 'Horizonte Verde', desc: 'Vento, pássaros, tigelas cantantes e o shō: uma paisagem sonora serena',
    bpm: 56, ganho: 1.66, nivelAmb: 0.6, escala: 'gong', tonica: 62, ambiente: ['vento', 'passaros'],
    mix: { dizi: [0.1, 0.5, 0.08, 0.9] },
    compor: function (M) {
      var L = M.gerar({ compassos: 8, ritmos: [[2, 2], [3, 1], [4], [2, 1, 1]], cad: [[4]], min: 2, max: 9, inicio: 5, fins: [5], orn: 0.8 });
      var R = [0, 4, 1, 3];
      return function (c, t) {
        var k = c % 24, r = R[Math.floor(c / 3) % 4];
        if (c % 3 === 0) M.pad('sho', t, M.acorde(r, -5).concat([r + 2]), M.compasso * 3, 0.38);
        if (c % 6 === 0) M.metal('tigela', r - 5, t, 0.55);
        if (c % 6 === 3) M.metal('tigela', M.quinta(r) - 5, M.em(t, 1), 0.4);
        if (k >= 12 && k < 20) M.frase('dizi', L, k - 12, t, { vel: 0.4 });
      };
    }
  };
  var cidade = {
    id: 'cidade', nome: 'Cidade Inteligente', desc: 'Koto em arpejos, sinos com eco e batida leve: a Ásia do futuro',
    bpm: 84, ganho: 1.54, escala: 'ryukyu', tonica: 62, swing: 0.05,
    compor: function (M) {
      var L = M.gerar({ compassos: 8, ritmos: [[1, 1, 2], [1.5, 0.5, 2], [0.5, 0.5, 1, 2], [2, 2]], cad: [[4]], min: 3, max: 10, inicio: 5, fins: [5, 10], orn: 0 });
      var R = [0, 2, 0, 1];
      return function (c, t) {
        var k = c % 16, r = R[Math.floor(k / 2) % 4];
        M.arpejo('koto', t, [r - 5, M.quinta(r - 5), r, M.quinta(r), r + 5, M.quinta(r), r, M.quinta(r - 5)], 0.5, 0.28);
        M.baixo(r - 10, t, 1.5, 0.4); M.baixo(r - 10, M.em(t, 2.5), 1, 0.32);
        if (k >= 4 && k < 12) M.frase('celesta', L, k - 4, t, { vel: 0.38 });
        M.grade('taiko', t, 'x....x..', 0.3);
        M.grade('bloco', t, '..o...o.', 0.18);
        M.grade('chocalho', t, '.o.o.o.o', 0.4);
      };
    }
  };

  /* ================================================== RELÂMPAGO */
  var seda = {
    id: 'seda', nome: 'Relâmpago de Seda', desc: 'Guzheng em disparada, dizi e taiko: energia para 90 segundos',
    bpm: 120, ganho: 1.04, escala: 'gong', tonica: 67,
    compor: function (M) {
      var rit = [[0.5, 0.5, 1, 0.5, 0.5, 1], [1, 1, 2], [0.5, 0.5, 0.5, 0.5, 1, 1], [2, 1, 1], [1, 0.5, 0.5, 1, 1]];
      var A = M.gerar({ compassos: 8, ritmos: rit, cad: [[2, 2], [1, 1, 2]], min: 0, max: 8, inicio: 3, fins: [0, 5], orn: 0.2 });
      var B = M.gerar({ compassos: 8, ritmos: rit, cad: [[2, 2], [4]], min: 2, max: 9, inicio: 5, fins: [5], orn: 0.2 });
      var R = [0, 0, 4, 4, 3, 3, 1, 0];
      var forma = [['intro', 2], ['A', 8], ['B', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = R[s.i % 8];
        if (s.nome === 'A') M.frase('dizi', A, s.i, t, { vel: 0.62 });
        if (s.nome === 'B') M.frase('dizi', B, s.i, t, { vel: 0.64 });
        M.acomp('guzheng2', t, r - 5, 'corrida', 0.3);
        M.grade('taiko', t, 'x...x...', 0.45);
        M.grade('ka', t, '..x...x.', 0.45);
        if (s.nome === 'B') M.grade('chocalho', t, 'oooooooo', 0.35);
      };
    }
  };
  var mercado = {
    id: 'mercado', nome: 'Corrida no Mercado', desc: 'Pipa em trêmulo, blocos de madeira e tambores leves, em ritmo de mercado',
    bpm: 132, ganho: 1.02, escala: 'zhi', tonica: 69,
    compor: function (M) {
      var rit = [[0.5, 0.5, 1, 1, 1], [1, 0.5, 0.5, 1, 1], [0.5, 0.5, 0.5, 0.5, 2], [2, 1, 1]];
      var A = M.gerar({ compassos: 8, ritmos: rit, cad: [[2, 2], [4]], min: -2, max: 6, inicio: 0, fins: [0, 5], orn: 0.8 });
      var R = [0, 2, 3, 0, 2, 1, 3, 0];
      return function (c, t) {
        var k = c % 8, r = R[k];
        M.frase('pipa', A, k, t, { vel: 0.6 });
        M.acomp('guzheng2', t, r - 5, 'oitavas', 0.3);
        M.grade('bloco', t, 'x.xx.x.x', 0.28);
        M.grade('buk', t, 'x...x...', 0.35);
        if (Math.floor(c / 8) % 2 === 1) M.grade('pratos', t, '..x...x.', 0.3);
      };
    }
  };
  var kotekan = {
    id: 'kotekan', nome: 'Chuva de Verão', desc: 'Gamelão de Bali em ritmo rápido: as notas de dois instrumentos se encaixam',
    bpm: 116, ganho: 0.98, escala: 'slendro', tonica: 64,
    compor: function (M) {
      var POKOK = [0, 1, 2, 1, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2];
      var FIG = [0, 1, 0, -1, 0, 1, 2, 1];
      return function (c, t) {
        var base = (c % 4) * 4;
        for (var b = 0; b < 4; b++) {
          var n = POKOK[base + b] + 5;
          for (var s16 = 0; s16 < 4; s16++) M.metal(s16 % 2 === 0 ? 'gangsa' : 'gangsa2', n + FIG[(b * 4 + s16) % 8], M.em(t, b + s16 * 0.25), 0.35);
          if (b % 2 === 0) M.metal('jegogan', POKOK[base + b] - 5, M.em(t, b), 0.35);
        }
        if (c % 4 === 0) M.metal('gong', -10, t, 0.4);
        M.grade('tak', t, 'x.o.x.o.', 0.3);
        M.grade('chap', t, '.x.x.x.x', 0.25);
      };
    }
  };

  /* ================================================== DUELO */
  var duelo = {
    id: 'duelo', nome: 'Duelo de Cordas', desc: 'Koto (à esquerda) e guzheng (à direita) respondem um ao outro, com taiko',
    bpm: 104, ganho: 1.2, escala: 'gong', tonica: 62,
    mix: { koto: [-0.55, 0.28, 0.05, 1], guzheng: [0.55, 0.3, 0.05, 1], guzheng2: [-0.3, 0.26, 0, 0.8], koto2: [0.3, 0.26, 0, 0.8] },
    compor: function (M) {
      var rit = [[0.5, 0.5, 1, 1, 1], [1, 0.5, 0.5, 2], [0.5, 0.5, 0.5, 0.5, 1, 1], [1, 1, 2]];
      var P = M.gerar({ compassos: 8, ritmos: rit, cad: [[2, 2], [1, 1, 2]], min: 0, max: 8, inicio: 3, fins: [0, 5], orn: 0.3 });
      var R = [0, 0, 4, 4, 3, 3, 1, 0];
      return function (c, t) {
        var k = c % 8, par = Math.floor(k / 2) % 2 === 0, r = R[k];
        M.frase(par ? 'koto' : 'guzheng', P, k, t, { vel: 0.6 });
        M.acomp(par ? 'guzheng2' : 'koto2', t, r - 5, 'baixo', 0.35);
        M.grade('taiko', t, 'x...x...', 0.45);
        M.grade('ka', t, '..x...xx', 0.35);
      };
    }
  };
  var festival = {
    id: 'festival', nome: 'Festival das Lanternas', desc: 'Dizi, guzheng, tambor e pequenos pratos, como numa festa de rua',
    bpm: 112, ganho: 1.06, escala: 'gong', tonica: 64,
    compor: function (M) {
      var A = M.linha('3:.5 4:.5 5:1 5:.5 4:.5 3:1 | 2:.5 3:.5 4:1 3:2 | 3:.5 4:.5 5:.5 6:.5 5:1 4:1 | 3~:3 r:1 | 5:.5 6:.5 7:1 6:.5 5:.5 4:1 | 3:.5 4:.5 5:1 4:2 | 3:.5 2:.5 1:.5 2:.5 3:1 1:1 | 0~:3 r:1');
      var B = M.gerar({ compassos: 8, ritmos: [[0.5, 0.5, 1, 1, 1], [1, 1, 2], [0.5, 0.5, 0.5, 0.5, 2]], cad: [[4], [2, 2]], min: 2, max: 9, inicio: 5, fins: [0, 5], orn: 0.4 });
      var RA = [0, 4, 0, 3, 0, 4, 3, 0], RB = [0, 0, 4, 4, 3, 3, 1, 0];
      var forma = [['A', 8], ['B', 8]];
      return function (c, t) {
        var s = M.secao(c, forma), r = (s.nome === 'A' ? RA : RB)[s.i];
        M.frase('dizi', s.nome === 'A' ? A : B, s.i, t, { vel: 0.64 });
        M.acomp('guzheng2', t, r - 5, 'oitavas', 0.3);
        M.grade('buk', t, 'x..x..x.', 0.35);
        M.grade('pratos', t, '..x...x.', 0.28);
        M.grade('bloco', t, 'o.o.o.o.', 0.15);
      };
    }
  };
  var tambores = {
    id: 'tambores', nome: 'Tambores de Seul', desc: 'Janggu e buk (tambores coreanos) em diálogo, com daegeum e o gongo jing',
    bpm: 84, ganho: 1.07, escala: 'zhi', tonica: 62,
    compor: function (M) {
      var L = M.gerar({ compassos: 8, ritmos: [[2, 1, 1], [3, 1], [1, 1, 2], [4]], cad: [[4]], min: -1, max: 7, inicio: 3, fins: [0, 5], orn: 0.9 });
      var R = [0, 0, 3, 3, 2, 2, 1, 0];
      return function (c, t) {
        var k = c % 8, r = R[k];
        if (k === 0) M.metal('jing', -5, t, 0.5);
        M.grade('kung', t, 'x..x..x.....', 0.45, 1 / 3);
        M.grade('deok', t, 'x....xx..x.x', 0.35, 1 / 3);
        if (k % 2 === 1) M.grade('buk', t, 'x.....x..x..', 0.4, 1 / 3);
        if (Math.floor(c / 8) % 2 === 1 || k >= 4) M.frase('daegeum', L, k, t, { vel: 0.62 });
        M.acomp('gayageum', t, r, 'rolado', 0.25);
      };
    }
  };

  /* ================================================== EXPLORAR */
  var zen = {
    id: 'zen', nome: 'Jardim Zen', desc: 'Fonte de bambu (shishi-odoshi), sino de vento (fūrin), koto e shakuhachi',
    bpm: 56, ganho: 1.4, nivelAmb: 0.75, escala: 'in', tonica: 69, ambiente: ['agua', 'shishi', 'furin'],
    compor: function (M) {
      var K = M.gerar({ compassos: 8, ritmos: [[1, 1, 2], [2, 2], [1.5, 0.5, 2], [3, 1]], cad: [[4]], min: -3, max: 5, inicio: 0, fins: [0], orn: 0.5 });
      var S = M.gerar({ compassos: 8, ritmos: [[2, 2], [3, 1], [4]], cad: [[4]], min: -3, max: 4, inicio: 0, fins: [0], orn: 0.8 });
      return function (c, t) {
        var k = c % 32;
        if (k < 8) M.frase('koto', K, k, t, { vel: 0.5, dobra: { cents: 60, em: 0.35, volta: 1 } });
        else if (k >= 12 && k < 20) M.frase('shakuhachi', S, k - 12, t, { vel: 0.62 });
        else if (k >= 24) M.frase('koto', K, k - 24, t, { vel: 0.42, oitava: 1 });
        if (k % 4 === 0) M.toca('koto2', -5, t, 4, 0.3);
      };
    }
  };
  var templo = {
    id: 'templo', nome: 'Templo na Névoa', desc: 'Sinos de templo, tigelas cantantes e o shō, envoltos em névoa',
    bpm: 50, ganho: 1.55, nivelAmb: 0.65, escala: 'yu', tonica: 57, ambiente: ['vento'],
    compor: function (M) {
      var R = [0, 2, 1, 4];
      return function (c, t) {
        var r = R[Math.floor(c / 4) % 4];
        if (c % 4 === 0) { M.metal('templo', r - 5, t, 0.6); M.pad('sho', t, M.acorde(r, 0).concat([r + 1]), M.compasso * 4, 0.4); }
        if (c % 8 === 2) M.metal('tigela', r, M.em(t, 1), 0.5);
        if (c % 8 === 6) M.metal('tigela', M.quinta(r), M.em(t, 2), 0.4);
        if (c % 16 === 10) M.arpejo('celesta', t, [r + 10, M.quinta(r) + 10, r + 15], 1, 0.25);
      };
    }
  };
  var flutuante = {
    id: 'flutuante', nome: 'Mercado Flutuante', desc: 'Khim (saltério tailandês), água e gongos suaves, como num mercado sobre o rio',
    bpm: 80, ganho: 1.43, nivelAmb: 0.75, escala: 'tailandesa', tonica: 64, ambiente: ['agua'],
    compor: function (M) {
      var L = M.gerar({ compassos: 8, ritmos: [[1, 0.5, 0.5, 2], [0.5, 0.5, 1, 2], [1, 1, 1, 1], [2, 1, 1]], cad: [[4], [2, 2]], min: 0, max: 8, inicio: 3, fins: [0, 5], orn: 0.8 });
      var R = [0, 0, 3, 3, 1, 1, 0, 0];
      return function (c, t) {
        var k = c % 16, r = R[k % 8];
        if (k < 8) M.frase('khim', L, k, t, { vel: 0.5 }); else M.frase('kulintang', L, k - 8, t, { vel: 0.35 });
        M.acomp('khim2', t, r - 5, 'baixo', 0.3);
        if (k % 2 === 0) M.perc('ching', M.em(t, 3), 0.4);
        M.metal('bonang', r - 5, t, 0.3);
      };
    }
  };

  window.MUSICAS = {
    inicio: [lanternas, bambu, brisa],
    jornada: [rumo, ilhas, estrelas],
    fase1: [arrozal, colheita, entardecer],
    fase2: [seul, fabricas, tigre],
    fase3: [jade, hongkong, nanometro],
    fase4: [gamelao, chaophraya, kulintang],
    fase5: [energia, horizonte, cidade],
    relampago: [seda, mercado, kotekan],
    duelo: [duelo, festival, tambores],
    explorar: [zen, templo, flutuante]
  };
})();
