/* Sorteio das alternativas.
   A posição da alternativa correta é sorteada com um "saco" de posições
   (A, B, C, D embaralhadas): em cada bloco de 4 questões a correta cai uma
   vez em cada letra, em ordem aleatória. Assim a resposta nunca segue um
   padrão previsível e as letras ficam equilibradas. As distratoras também
   são embaralhadas a cada exibição. */
(function () {
  function rand(n) {
    var c = typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues ? window.crypto : null;
    if (c) {
      var lim = Math.floor(4294967296 / n) * n, buf = new Uint32Array(1);
      do { c.getRandomValues(buf); } while (buf[0] >= lim);
      return buf[0] % n;
    }
    return Math.floor(Math.random() * n);
  }

  function embaralhar(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = rand(i + 1), t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function novoSorteador() {
    var saco = [];
    return {
      proxima: function () {
        if (!saco.length) saco = embaralhar([0, 1, 2, 3]);
        return saco.pop();
      }
    };
  }

  function montarAlternativas(q, sorteador) {
    var pos = sorteador ? sorteador.proxima() : rand(4);
    var erradas = embaralhar(q.erradas.slice(0, 3));
    var alts = [], k = 0;
    for (var i = 0; i < 4; i++) {
      alts.push(i === pos ? { texto: q.correta, correta: true } : { texto: erradas[k++], correta: false });
    }
    return alts;
  }

  window.Embaralhar = { rand: rand, embaralhar: embaralhar, novoSorteador: novoSorteador, montarAlternativas: montarAlternativas };
})();
