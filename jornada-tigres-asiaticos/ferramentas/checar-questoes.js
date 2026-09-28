#!/usr/bin/env node
/* Confere o banco de questões:  node ferramentas/checar-questoes.js
   - cada múltipla escolha tem 1 correta + 3 distratoras diferentes
   - distratoras com tamanho parecido com o da correta
   - imagens, gráficos e países citados existem
   - simula o sorteio das alternativas e mostra a distribuição A/B/C/D */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..');
const ctx = { window: {}, document: undefined, console };
vm.createContext(ctx);
for (const f of ['js/mapa-geo.js', 'js/dados.js', 'js/questoes.js', 'js/embaralhar.js', 'js/ilustracoes-base.js', 'js/ilustracoes.js', 'js/graficos.js']) {
  const p = path.join(raiz, f);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
}
const W = ctx.window;
const Q = W.QUESTOES || [];
const ilus = W.ILUSTRACOES ? Object.keys(W.ILUSTRACOES) : null;
const grafs = W.GRAFICOS ? Object.keys(W.GRAFICOS) : null;
const paises = W.MAPA_GEO ? Object.keys(W.MAPA_GEO.paises) : null;

let erros = 0, avisos = 0;
const erro = (m) => { erros++; console.log('  ERRO  ' + m); };
const aviso = (m) => { avisos++; console.log('  aviso ' + m); };

const ids = new Set();
let maisLonga = 0, mc = 0;
const razoes = [];
for (const q of Q) {
  if (ids.has(q.id)) erro(`${q.id}: id repetido`);
  ids.add(q.id);
  if (!q.enunciado) erro(`${q.id}: sem enunciado`);
  if (!q.explicacao) erro(`${q.id}: sem explicação`);
  if (!q.dica) aviso(`${q.id}: sem dica`);
  if (q.tipo === 'multipla') {
    mc++;
    const alts = [q.correta, ...(q.erradas || [])];
    if (!q.correta || (q.erradas || []).length !== 3) erro(`${q.id}: precisa de 1 correta e 3 erradas`);
    if (new Set(alts.map((a) => a.trim().toLowerCase())).size !== alts.length) erro(`${q.id}: alternativas repetidas`);
    const lc = q.correta.length;
    for (const e of q.erradas) {
      const r = e.length / lc;
      razoes.push(r);
      const curta = lc <= 14;
      const ok = curta ? Math.abs(e.length - lc) <= 6 : r >= 0.78 && r <= 1.25;
      if (!ok) aviso(`${q.id}: tamanho destoa (${e.length} x ${lc} letras): "${e}"`);
    }
    if (lc > Math.max(...q.erradas.map((e) => e.length))) maisLonga++;
    if (!q.visual) erro(`${q.id}: sem imagem/gráfico/mapa`);
    else if (q.visual.tipo === 'ilustracao' && ilus && !ilus.includes(q.visual.nome)) erro(`${q.id}: ilustração "${q.visual.nome}" não existe`);
    else if (q.visual.tipo === 'grafico' && grafs && !grafs.includes(q.visual.nome)) erro(`${q.id}: gráfico "${q.visual.nome}" não existe`);
    else if (q.visual.tipo === 'mapa' && paises) for (const c of q.visual.destaque || []) if (!paises.includes(c)) erro(`${q.id}: país ${c} não existe no mapa`);
    if (!q.legenda) aviso(`${q.id}: sem legenda (texto alternativo) para a imagem`);
  } else if (q.tipo === 'mapa') {
    if (paises && !paises.includes(q.alvo)) erro(`${q.id}: alvo ${q.alvo} não existe no mapa`);
  } else erro(`${q.id}: tipo desconhecido ${q.tipo}`);
}

console.log(`\nQuestões: ${Q.length} (${mc} de múltipla escolha, ${Q.length - mc} de mapa)`);
console.log(`Correta é a MAIS LONGA em ${maisLonga} de ${mc} questões (${Math.round((100 * maisLonga) / mc)}%)`);
razoes.sort((a, b) => a - b);
console.log(`Razão tamanho distratora/correta: mín ${razoes[0].toFixed(2)} · mediana ${razoes[razoes.length >> 1].toFixed(2)} · máx ${razoes[razoes.length - 1].toFixed(2)}`);

for (const f of W.FASES || []) {
  const daFase = Q.filter((q) => q.fase === f.n);
  console.log(`Fase ${f.n} (${f.titulo}): ${daFase.filter((q) => q.tipo === 'multipla').length} múltipla + ${daFase.filter((q) => q.tipo === 'mapa').length} mapa`);
}

if (W.Embaralhar) {
  const cont = [0, 0, 0, 0];
  const sorteador = W.Embaralhar.novoSorteador();
  const N = 40000;
  for (let i = 0; i < N; i++) {
    const q = Q.filter((x) => x.tipo === 'multipla')[i % mc];
    const alts = W.Embaralhar.montarAlternativas(q, sorteador);
    cont[alts.findIndex((a) => a.correta)]++;
  }
  console.log('Posição da correta em ' + N + ' sorteios: ' + cont.map((c, i) => 'ABCD'[i] + ' ' + ((100 * c) / N).toFixed(1) + '%').join(' · '));
}

console.log(`\n${erros} erro(s), ${avisos} aviso(s)`);
process.exit(erros ? 1 : 0);
