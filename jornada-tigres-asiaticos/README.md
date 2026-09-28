# Jornada dos Tigres Asiáticos

Jogo educativo de **Geografia para o 9º ano do Ensino Fundamental** sobre a
industrialização da Ásia: a trajetória dos **Tigres** e dos **Novos Tigres Asiáticos**.

Foi feito para revisar a Aula 6 do 4º bimestre do Material Digital SEDUC-SP
(“Industrialização na Ásia: a trajetória dos Tigres e dos Novos Tigres Asiáticos”)
e trabalha as habilidades **EF09GE10** e **EF09GE11** da BNCC.

- 67 questões: 53 de múltipla escolha e 14 missões no mapa, **todas com imagem, gráfico ou mapa**
- Mapa interativo da Ásia com zoom, camadas e ficha de cada país
- 8 gráficos com dados reais, legenda, dica ao passar o mouse e tabela
- Curiosidades depois das respostas, linha do tempo de 1945 a 2024
- Mascote (Kai), animações, confete, sons e música, tudo criado em código
- Funciona no computador, no celular e projetado na lousa, sem login e sem anúncios

---

## Modos de jogo

| Modo | Como funciona | Bom para |
|---|---|---|
| **Jornada** | 5 fases na ordem da aula (Ásia agrária → salto dos Tigres → chips e portos → Novos Tigres → desafios e futuro). Cada fase sorteia 8 questões: 6 de múltipla escolha e 2 missões no mapa. Estrelas, insígnias e certificado no final. | Estudo individual ou em duplas |
| **Relâmpago** | 90 segundos para acertar o máximo possível. Acertos seguidos aumentam o multiplicador. Guarda o recorde. | Aquecimento ou fechamento da aula |
| **Duelo** | Dois times respondem em turnos (3, 5 ou 8 questões por time; 20 s, 30 s ou sem limite). | Turma inteira, com o jogo projetado |
| **Explorar** | Mapa interativo, gráficos, curiosidades e linha do tempo, sem pontuação. | Apoio à explicação do professor |

Há também a tela **Para o professor**, com as habilidades da BNCC, sugestões de uso,
fontes dos dados e um botão para apagar o progresso salvo no navegador.

**Teclado:** teclas 1–4 ou A–D escolhem a alternativa; Enter avança para a próxima questão.

---

## Como jogar sem publicar nada

1. Descompacte o arquivo `.zip`.
2. Abra a pasta e dê dois cliques em **`index.html`**.

O jogo abre no navegador (Chrome, Edge, Firefox ou Safari) e funciona até sem internet.
Sem internet, as fontes decorativas são trocadas pelas fontes do sistema, e o resto funciona igual.

---

## Como publicar no GitHub Pages (passo a passo)

Assim o jogo ganha um endereço na internet para compartilhar com a turma.
É gratuito para repositórios públicos.

1. Entre em [github.com](https://github.com) e faça login (ou crie uma conta gratuita).
2. No canto superior direito, clique em **+** → **New repository**.
3. Em **Repository name**, digite um nome, por exemplo `jornada-tigres-asiaticos`.
   Deixe marcado **Public** e clique em **Create repository**.
4. Na página do repositório vazio, clique no link **uploading an existing file**.
5. No seu computador, abra a pasta descompactada e **selecione tudo o que está dentro dela**
   (`index.html`, `README.md` e as pastas `css`, `js` e `ferramentas`).
   Arraste para a área de envio do GitHub e espere todos os arquivos aparecerem na lista.
6. Clique em **Commit changes**.
7. Vá em **Settings** → no menu da esquerda, **Pages**.
8. Em **Build and deployment** → **Source**, escolha **Deploy from a branch**.
   Em **Branch**, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
9. Espere de 1 a 3 minutos e atualize a página. Vai aparecer o endereço do jogo:

   `https://SEU-USUARIO.github.io/jornada-tigres-asiaticos/`

**Atenção:** o arquivo `index.html` precisa ficar na “raiz” do repositório, e não dentro de
outra pasta. Se você arrastar a pasta inteira em vez do conteúdo dela, o endereço passa a
terminar com o nome da pasta (por exemplo `.../jornada-tigres-asiaticos/jornada-tigres-asiaticos/`).

O arquivo oculto `.nojekyll` é opcional. Se ele não aparecer na hora de arrastar, tudo bem:
o jogo funciona sem ele.

Para atualizar o jogo depois (por exemplo, com questões novas), abra o arquivo no GitHub,
clique no lápis (**Edit**), faça a alteração e clique em **Commit changes**.
Em 1 ou 2 minutos o site é atualizado.

---

## Estrutura dos arquivos

```
index.html                 página do jogo
css/estilo.css             cores, tamanhos, animações e versão para impressão
js/questoes.js             FASES e QUESTÕES  ← o arquivo que o professor edita
js/dados.js                números dos gráficos, fichas dos países e fontes
js/embaralhar.js           sorteio das alternativas
js/ilustracoes-base.js     mascote, bandeiras, ícones e peças das ilustrações
js/ilustracoes.js          as ilustrações das questões (desenhadas em SVG)
js/graficos.js             os gráficos
js/mapa-geo.js             contornos do mapa (arquivo gerado, não editar à mão)
js/mapa.js                 mapa interativo (zoom, camadas, missões)
js/sons.js                 efeitos sonoros e música (Web Audio, sem arquivos de áudio)
js/jogo.js                 telas, regras, pontuação e certificado
ferramentas/checar-questoes.js   confere o banco de questões
ferramentas/gerar_mapa.py        gera js/mapa-geo.js
ferramentas/mapa_geo_src.py      coordenadas simplificadas dos países
```

---

## Como editar ou criar questões

Abra `js/questoes.js`. Cada questão de múltipla escolha segue este modelo:

```js
{
  id: 'f2q20', fase: 2, tipo: 'multipla',
  visual: { tipo: 'ilustracao', nome: 'porto' },
  legenda: 'Porto com guindastes e navios carregados de contêineres.',
  enunciado: 'Por que os portos foram tão importantes para os Tigres Asiáticos?',
  correta: 'Porque escoavam as exportações para o mundo',
  erradas: [
    'Porque recebiam turistas de todos os continentes',
    'Porque guardavam as reservas de ouro do país',
    'Porque serviam só para a pesca de subsistência'
  ],
  dica: 'Pense no modelo de crescimento voltado para as exportações.',
  explicacao: 'Os Tigres cresceram vendendo produtos industrializados para outros países, e quase tudo saía por navio.',
  curiosidade: 'Opcional: um fato curioso que aparece depois da resposta.'
},
```

| Campo | O que é |
|---|---|
| `id` | Código único (não repita um que já existe). |
| `fase` | 1 a 5. Use `0` para questões extras, que aparecem só no Relâmpago e no Duelo. |
| `essencial: true` | Opcional. A questão sempre entra na fase. |
| `visual` | A imagem da questão (veja as opções abaixo). |
| `legenda` | Descrição da imagem, lida por leitores de tela. |
| `correta` | A única alternativa correta. |
| `erradas` | Exatamente 3 alternativas incorretas, com **tamanho parecido** com o da correta. |
| `dica`, `explicacao`, `curiosidade` | Textos de apoio. A curiosidade é opcional. |

**Não é preciso se preocupar com a ordem das alternativas.** O jogo sorteia a posição da
correta toda vez que a questão aparece, de forma equilibrada: a cada 4 questões, a correta
cai uma vez em A, uma em B, uma em C e uma em D, em ordem aleatória. As 3 erradas também
são embaralhadas.

### Opções de `visual`

- **Ilustração:** `{ tipo: 'ilustracao', nome: 'arrozal' }`, com um destes nomes:
  `arrozal`, `aldeia`, `navioColonial`, `trocaDesigual`, `terras`, `feira`, `tigreSalto`,
  `guerraFria`, `japaoInveste`, `exportacao`, `escola`, `jointVenture`, `fabricaLeve`, `chip`,
  `porto`, `zee`, `celularGlobal`, `skyline`, `ied`, `multinacional`, `texteis`, `gansos`,
  `palmeira`, `divisaoRegional`, `fabricaMundo`, `industria40`, `desigualdade`,
  `energiaLimpa`, `baterias`, `riscoExterno`, `qualificacao`, `trajetoria`, `dragao`,
  `lojinha`, `perucas`, `petronas`, `aterro`, `enchente`, `rioHan`, `dende`, `conteiner`,
  `hongKong`, `cafe`.
- **Gráfico:** `{ tipo: 'grafico', nome: 'portos' }`, com um destes nomes:
  `urbanizacaoCoreia`, `multiplicador`, `chips`, `portos`, `brasilCoreia`, `renda2022`,
  `china28`, `criseIndonesia`.
- **Mapa com destaque:** `{ tipo: 'mapa', destaque: ['KOR', 'TWN'] }`, com códigos de país.

### Missões no mapa

```js
{
  id: 'f2m9', fase: 2, tipo: 'mapa', alvo: 'TWN',
  enunciado: 'Clique em Taiwan, a ilha que se tornou um dos Tigres Asiáticos.',
  dica: 'É uma ilha em frente ao litoral sudeste da China.',
  explicacao: 'Taiwan industrializou-se rapidamente a partir dos anos 1960, com foco em exportações.'
},
```

Códigos dos países do mapa:

| Grupo | Códigos |
|---|---|
| Tigres Asiáticos | `KOR` Coreia do Sul · `TWN` Taiwan · `HKG` Hong Kong · `SGP` Singapura |
| Novos Tigres | `MYS` Malásia · `THA` Tailândia · `IDN` Indonésia · `PHL` Filipinas |
| Novíssimos (mapa da aula) | `VNM` Vietnã · `IND` Índia · `BGD` Bangladesh |
| Outros | `JPN` Japão · `CHN` China · `PRK` Coreia do Norte · `MNG` Mongólia · `RUS` Rússia · `KAZ` Cazaquistão · `UZB` Uzbequistão · `KGZ` Quirguistão · `TJK` Tadjiquistão · `AFG` Afeganistão · `PAK` Paquistão · `NPL` Nepal · `BTN` Butão · `LKA` Sri Lanka · `MMR` Mianmar · `LAO` Laos · `KHM` Camboja · `BRN` Brunei · `TLS` Timor-Leste · `PNG` Papua-Nova Guiné |

### Conferir o banco depois de editar

Se você tiver o [Node.js](https://nodejs.org) instalado, rode na pasta do jogo:

```
node ferramentas/checar-questoes.js
```

O programa avisa se falta alguma alternativa, se há alternativas repetidas, se uma
distratora está muito maior ou menor que a correta, se uma ilustração ou país não existe,
e mostra a distribuição da correta entre A, B, C e D em 40 mil sorteios.

---

## Sobre o mapa

O mapa é **ilustrativo**: os contornos foram desenhados à mão para o jogo, com fronteiras
simplificadas, e não servem para medir distâncias ou áreas. Hong Kong e Singapura aparecem
como pontos, porque são pequenos demais para a escala.

Para ajustar os contornos, edite `ferramentas/mapa_geo_src.py` e gere o arquivo de novo:

```
python3 ferramentas/gerar_mapa.py
```

---

## Privacidade

- Não há cadastro, anúncios nem coleta de dados.
- O progresso (fases, estrelas, insígnias e recorde) fica salvo **apenas no navegador** de
  quem joga. Em computadores compartilhados, use o botão “Apagar progresso” na tela
  **Para o professor**.
- A única conexão externa é o carregamento das fontes tipográficas do Google Fonts.

---

## Fontes dos dados

- Material Digital SEDUC-SP: Geografia, 9º ano, 4º bimestre, Aula 6, “Industrialização na Ásia”.
- Maddison Project Database 2023 (Bolt e van Zanden), via Our World in Data: renda por pessoa em 1960 e 2022.
  <https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database>
- Banco Mundial: população urbana da Coreia do Sul.
  <https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=KR>
- Lloyd’s List, via Wikipédia: portos de contêineres mais movimentados (2024).
  <https://en.wikipedia.org/wiki/List_of_busiest_container_ports>
- SIA e BCG (2021): *Strengthening the Global Semiconductor Supply Chain*.
  <https://www.semiconductors.org/strengthening-the-global-semiconductor-supply-chain-in-an-uncertain-era/>
- CSIS ChinaPower: participação da China na produção industrial mundial (2023).
  <https://chinapower.csis.org/tracker/china-manufacturing/>
- FMI, World Economic Outlook: renda por pessoa da Indonésia em dólares.
  <https://www.imf.org/external/datamapper/NGDPDPC@WEO>
- The Korea Herald: perucas entre as principais exportações da Coreia nos anos 1960 e 1970.
  <https://www.koreaherald.com/article/483611>
- Intel: Penang, primeira fábrica da Intel fora dos EUA (1972).
  <https://www.intel.com/content/www/us/en/history/virtual-vault/articles/intel-penang.html>
- Export Processing Zone Administration (Taiwan): zona de processamento de exportações de Kaohsiung (1966).
  <https://www.epza.gov.tw/english/page.aspx?pageid=ce7b2de9e958965c>
- Asia Business Daily: gasto da Coreia do Sul em pesquisa e desenvolvimento (2024).
  <https://view.asiae.co.kr/en/article/2025122616300596203>
- Seasia: parte dos celulares da Samsung fabricada no Vietnã (2026).
  <https://seasia.co/2026/07/05/roughly-half-of-samsung-phones-are-made-in-viet-nam-heres-why>
- Wikipédia: Samsung, Hyundai Pony, Geografia de Singapura, Crise financeira asiática de 1997,
  Enchentes na Tailândia em 2011.

---

## Créditos

- Conteúdo baseado no Material Digital SEDUC-SP (Geografia, 9º ano, 4º bimestre, Aula 6).
- Ilustrações, mascote, bandeiras, mapa, gráficos, sons e música foram criados especialmente
  para este jogo, em código (SVG e Web Audio). Não há imagens nem áudios de terceiros.
- Fontes tipográficas: Bungee, Lexend e IBM Plex Mono (Google Fonts, licença SIL Open Font License).

## Licença

Escolha a licença que preferir antes de compartilhar. Uma sugestão comum para materiais
didáticos é a **CC BY 4.0** (qualquer pessoa pode usar e adaptar, citando a autoria); para o
código, a **MIT** é uma opção simples. No GitHub, clique em **Add file** → **Create new file**,
digite `LICENSE` como nome e use o botão **Choose a license template** ou cole o texto da
licença escolhida.
