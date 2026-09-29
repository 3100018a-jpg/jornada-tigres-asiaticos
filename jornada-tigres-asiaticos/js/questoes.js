/* =====================================================================
   JORNADA DOS TIGRES ASIÁTICOS — banco de fases e questões
   ---------------------------------------------------------------------
   COMO EDITAR (professor/a):
   • Cada questão de múltipla escolha tem UMA alternativa correta
     ("correta") e três distratoras ("erradas"). O jogo embaralha a
     ordem a cada vez que a questão aparece — você não precisa se
     preocupar com a posição da correta.
   • Mantenha as alternativas com tamanho parecido (o arquivo
     ferramentas/checar-questoes.js confere isso automaticamente).
   • "visual" diz qual imagem aparece na questão:
       { tipo: 'ilustracao', nome: 'arrozal' }   → ver js/ilustracoes.js
       { tipo: 'grafico',    nome: 'portos' }     → ver js/graficos.js
       { tipo: 'mapa', destaque: ['KOR', ...] }   → países em destaque
   • Questões do tipo 'mapa' pedem que o estudante clique no país
     indicado em "alvo" (código de 3 letras, ex.: 'KOR').
   • "essencial: true" garante que a questão sempre entra na fase.
   ===================================================================== */

window.FASES = [
  {
    n: 1,
    id: 'agraria',
    titulo: 'A Ásia agrária',
    periodo: 'Até 1950',
    cor: '#5DBB46',
    ilustracao: 'arrozal',
    resumo: [
      'A economia era agrária e de subsistência, quase sem indústrias.',
      'A maioria da população vivia no campo, com pouca tecnologia e baixa produtividade.',
      'A região exportava produtos primários: arroz, chá, seda, especiarias e minérios.',
      'Potências coloniais (Reino Unido, França e Japão) dominavam a região, e poucas pessoas eram donas de muitas terras.'
    ],
    fala: 'Olá! Eu sou o Kai. Vamos voltar a 1950: quase todo mundo por aqui vive de plantar arroz. Será que isso vai mudar?',
    insignia: { nome: 'Guardião do Arrozal', icone: 'arroz' }
  },
  {
    n: 2,
    id: 'salto',
    titulo: 'O salto dos Tigres',
    periodo: 'Anos 1960 e 1970',
    cor: '#FF8A1F',
    ilustracao: 'tigreSalto',
    resumo: [
      'Nos anos 1960, durante a Guerra Fria, com apoio dos EUA e investimentos do Japão, quatro economias aceleraram a industrialização.',
      'São os Tigres Asiáticos: Coreia do Sul, Singapura, Taiwan e Hong Kong.',
      '"Tigre" lembra a agressividade e a rapidez do crescimento econômico.',
      'Bases do crescimento: exportação, mão de obra disciplinada e qualificada, investimentos do Estado em infraestrutura, tecnologia e educação, e parcerias com empresas estrangeiras (joint ventures).'
    ],
    fala: 'Hora de acelerar! Fábricas, portos e escolas começam a transformar quatro economias asiáticas.',
    insignia: { nome: 'Tigre Veloz', icone: 'tigre' }
  },
  {
    n: 3,
    id: 'tecnologia',
    titulo: 'Chips, portos e o mundo',
    periodo: 'Anos 1980 e 1990',
    cor: '#19C3E6',
    ilustracao: 'porto',
    resumo: [
      'Os Tigres avançaram para a alta tecnologia: semicondutores (chips), eletrônicos, automóveis, máquinas e equipamentos.',
      'Tornaram-se elos centrais das cadeias globais de valor, com forte presença no comércio internacional.',
      'Zonas Econômicas Especiais (ZEEs) e portos modernos atraíram Investimentos Estrangeiros Diretos (IED).',
      'Singapura virou um grande centro financeiro e logístico, com bancos internacionais e um dos maiores portos do mundo.'
    ],
    fala: 'Olha esses contêineres! Os Tigres agora fabricam chips e carros e vendem para o planeta inteiro.',
    insignia: { nome: 'Mestre dos Chips', icone: 'chip' }
  },
  {
    n: 4,
    id: 'novos',
    titulo: 'Os Novos Tigres',
    periodo: 'Anos 1990',
    cor: '#9B5DE5',
    ilustracao: 'gansos',
    resumo: [
      'Os custos de produção subiram no Japão e nos "velhos" Tigres. As multinacionais buscaram mão de obra mais barata e incentivos fiscais.',
      'Surgem os Novos Tigres: Malásia, Tailândia, Indonésia, Filipinas e Vietnã.',
      'Características: industrialização tardia e acelerada, com multinacionais; mão de obra abundante e barata; manufaturados (têxteis, eletrônicos, autopeças) e agroindústria.',
      'Eles se integraram à divisão regional do trabalho, complementando o Japão e os velhos Tigres.'
    ],
    fala: 'A industrialização está se espalhando pelo Sudeste Asiático. Conheça a nova geração de Tigres!',
    insignia: { nome: 'Explorador dos Novos Tigres', icone: 'bussola' }
  },
  {
    n: 5,
    id: 'desafios',
    titulo: 'Desafios do século XXI',
    periodo: 'De 2000 até hoje',
    cor: '#FF3D8B',
    ilustracao: 'energiaLimpa',
    resumo: [
      'A China virou a "fábrica do mundo" e aumentou a concorrência por investimentos e mercados.',
      'Inovação contínua (Pesquisa e Desenvolvimento, automação, Indústria 4.0) é condição para continuar relevante.',
      'Depender do mercado externo expõe esses países a crises financeiras, variações cambiais e tensões geopolíticas.',
      'Desafios internos: qualificação profissional permanente, desigualdades sociais e questões ambientais, como poluição e transição energética.'
    ],
    fala: 'Chegamos ao presente! Crescer foi incrível, mas agora os desafios são outros. Vamos encará-los?',
    insignia: { nome: 'Visionário do Futuro', icone: 'foguete' }
  }
];

window.QUESTOES = [
  /* ============================ FASE 1 ============================ */
  {
    id: 'f1q1', fase: 1, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'arrozal' },
    legenda: 'Plantação de arroz em terraços, cena comum na Ásia Oriental antes da industrialização (ilustração).',
    enunciado: 'Até meados do século XX, como era a economia da maior parte da Ásia Oriental?',
    correta: 'Agrária e de subsistência, com poucas indústrias',
    erradas: [
      'Industrial, com muitas fábricas de alta tecnologia',
      'Baseada em bancos, serviços e turismo internacional',
      'Urbana, com a maioria da população nas metrópoles'
    ],
    dica: 'Pense no que a maioria das pessoas fazia para sobreviver: plantar ou fabricar?',
    explicacao: 'Até cerca de 1950, a maior parte da população plantava para o próprio sustento (subsistência). Havia pouquíssimas indústrias e a tecnologia era limitada.',
    curiosidade: 'O arroz é cultivado na Ásia há milhares de anos. Os terraços nas encostas seguram a água e o solo das plantações.'
  },
  {
    id: 'f1q2', fase: 1, tipo: 'multipla', essencial: true,
    visual: { tipo: 'grafico', nome: 'urbanizacaoCoreia' },
    legenda: 'Parte da população da Coreia do Sul que vivia em cidades e no campo, em 1960 e em 2024.',
    enunciado: 'Observe o gráfico. Em 1960, onde vivia a maior parte da população da Coreia do Sul?',
    correta: 'No campo, trabalhando principalmente na agricultura',
    erradas: [
      'Nas cidades, trabalhando em fábricas de eletrônicos',
      'No litoral, trabalhando em grandes portos modernos',
      'Em cidades médias, ocupada em escritórios e bancos'
    ],
    dica: 'Compare as duas partes da barra de 1960: qual delas é maior?',
    explicacao: 'Em 1960, só cerca de 28% dos sul-coreanos viviam em cidades; os outros 72% viviam no campo. Em 2024, mais de 80% viviam em áreas urbanas.',
    curiosidade: 'Em poucas décadas, milhões de sul-coreanos trocaram o campo pelas cidades para trabalhar nas novas fábricas.'
  },
  {
    id: 'f1q3', fase: 1, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'navioColonial' },
    legenda: 'Sacas de arroz, chá, seda e especiarias sendo embarcadas para a Europa (ilustração).',
    enunciado: 'No período pré-industrial, quais produtos a Ásia Oriental exportava principalmente?',
    correta: 'Arroz, chá, seda, especiarias e minérios',
    erradas: [
      'Automóveis, navios, aço e máquinas pesadas',
      'Celulares, computadores, chips e televisores',
      'Softwares, filmes e serviços bancários'
    ],
    dica: 'Antes das fábricas, a região vendia produtos da terra e das minas.',
    explicacao: 'Sem indústrias, a região vendia produtos primários, que vêm da agricultura, do extrativismo e da mineração: arroz, chá, seda, especiarias e minérios.',
    curiosidade: 'A seda foi produzida primeiro na China, há milhares de anos. Os caminhos que levavam esse tecido até a Europa ficaram conhecidos como Rota da Seda.'
  },
  {
    id: 'f1q4', fase: 1, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'trocaDesigual' },
    legenda: 'Matérias-primas baratas saem da colônia; produtos industrializados caros entram (ilustração).',
    enunciado: 'Antes de 1950, a Ásia Oriental participava do comércio mundial de forma subordinada. Por quê?',
    correta: 'Sofria forte influência de potências coloniais',
    erradas: [
      'Liderava a venda mundial de máquinas e de navios',
      'Controlava os bancos mais ricos da Europa',
      'Proibia qualquer comércio com outros países'
    ],
    dica: 'Lembre-se de países como Reino Unido, França e Japão.',
    explicacao: 'A região era dominada ou influenciada por potências coloniais, como Reino Unido, França e Japão. Vendia produtos primários baratos e comprava produtos industrializados: uma posição subordinada.',
    curiosidade: 'Hong Kong foi colônia britânica até 1997. Singapura também foi colônia do Reino Unido e só se tornou um país independente em 1965.'
  },
  {
    id: 'f1q5', fase: 1, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'terras' },
    legenda: 'Uma grande propriedade ao lado de muitos lotes pequenos (ilustração).',
    enunciado: 'Na Ásia pré-industrial, poucas pessoas eram donas de grande parte das terras. Isso gerava...',
    correta: 'profundas desigualdades sociais no campo',
    erradas: [
      'grande oferta de empregos nas novas fábricas',
      'rápido crescimento das cidades litorâneas',
      'exportação de tecnologia moderna para a Europa'
    ],
    dica: 'Se poucos têm muita terra, como fica a vida de quem tem pouca ou nenhuma?',
    explicacao: 'A concentração de terras deixava muitos camponeses pobres e sem terra própria, enquanto poucos proprietários ficavam com a maior parte da riqueza.',
    curiosidade: 'Depois de 1945, Coreia do Sul e Taiwan fizeram reformas agrárias e dividiram terras entre camponeses. Muitos estudiosos consideram isso uma das bases do crescimento posterior.'
  },
  {
    id: 'f1q6', fase: 1, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'aldeia' },
    legenda: 'Camponês preparando a terra com a ajuda de um búfalo-d’água (ilustração).',
    enunciado: 'Qual característica descreve a produção no campo asiático antes de 1950?',
    correta: 'Pouca tecnologia e baixa produtividade',
    erradas: [
      'Muitos robôs e colheita automatizada',
      'Uso intenso de tratores e satélites',
      'Irrigação controlada por computadores'
    ],
    dica: 'Observe a imagem: quem puxa o arado?',
    explicacao: 'O trabalho era feito à mão ou com animais, usando ferramentas simples. Por isso, a produtividade (quanto cada trabalhador produz) era baixa.',
    curiosidade: 'Em algumas áreas rurais da Ásia, búfalos-d’água ainda ajudam a preparar os campos de arroz alagados.'
  },
  {
    id: 'f1q7', fase: 1, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'feira' },
    legenda: 'Barraca de mercado com poucos tipos de produto, quase todos agrícolas (ilustração).',
    enunciado: 'Por que se diz que a economia da Ásia pré-industrial era pouco diversificada?',
    correta: 'Dependia de poucos produtos, quase todos agrícolas',
    erradas: [
      'Produzia muitos tipos diferentes de máquinas e de veículos',
      'Tinha grandes indústrias de todos os setores da economia',
      'Vendia sobretudo serviços de tecnologia avançada'
    ],
    dica: '"Diversificada" quer dizer variada. Havia variedade de produtos?',
    explicacao: 'Uma economia pouco diversificada depende de poucos produtos. Na Ásia pré-industrial, quase tudo vinha da agricultura e da mineração.',
    curiosidade: 'Quando um país depende de poucos produtos, uma queda no preço de um deles pode prejudicar toda a economia.'
  },
  {
    id: 'f1m1', fase: 1, tipo: 'mapa', alvo: 'KOR',
    enunciado: 'Clique na Coreia do Sul, que nos anos 1950 ainda era um país agrário e pobre.',
    dica: 'Ela ocupa o sul de uma península entre a China e o Japão.',
    explicacao: 'A Coreia do Sul ocupa a parte sul da Península Coreana. Nos anos 1950, depois da Guerra da Coreia (1950–1953), era um país pobre e agrário.',
    curiosidade: 'Seul, a capital, fica a apenas cerca de 50 km da fronteira com a Coreia do Norte.'
  },
  {
    id: 'f1m2', fase: 1, tipo: 'mapa', alvo: 'JPN',
    enunciado: 'Clique no Japão, a potência asiática que dominou a Coreia e Taiwan até 1945.',
    dica: 'É um arquipélago a leste da Península Coreana.',
    explicacao: 'O Japão foi o primeiro país asiático a se industrializar. Ele controlou Taiwan (1895–1945) e a Coreia (1910–1945) como colônias.',
    curiosidade: 'O Japão começou a se industrializar ainda no fim do século XIX, na chamada Era Meiji.'
  },

  /* ============================ FASE 2 ============================ */
  {
    id: 'f2q1', fase: 2, tipo: 'multipla', essencial: true,
    visual: { tipo: 'mapa', destaque: ['KOR', 'TWN', 'HKG', 'SGP'], grupo: 'tigres' },
    legenda: 'Mapa com quatro economias destacadas em laranja.',
    enunciado: 'Os territórios destacados no mapa formam o grupo dos Tigres Asiáticos. Quais são eles?',
    correta: 'Coreia do Sul, Singapura, Taiwan e Hong Kong',
    erradas: [
      'Malásia, Tailândia, Indonésia e Filipinas',
      'Japão, China, Mongólia e Coreia do Norte',
      'Índia, Vietnã, Bangladesh e Sri Lanka'
    ],
    dica: 'Uma fica numa península, uma é ilha e duas são cidades.',
    explicacao: 'Os Tigres Asiáticos são Coreia do Sul, Singapura, Taiwan e Hong Kong. Malásia, Tailândia, Indonésia, Filipinas e Vietnã formam o grupo dos Novos Tigres.',
    curiosidade: 'Em chinês, esse grupo é chamado de "Quatro Pequenos Dragões".'
  },
  {
    id: 'f2q2', fase: 2, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'tigreSalto' },
    legenda: 'Um tigre saltando sobre uma seta de crescimento (ilustração).',
    enunciado: 'Por que essas economias ganharam o apelido de "Tigres"?',
    correta: 'Pela agressividade e rapidez do crescimento econômico',
    erradas: [
      'Pela grande quantidade de tigres em suas florestas',
      'Pelo desenho de um tigre em todas as suas bandeiras',
      'Pela exportação de tigres para zoológicos de toda a Europa'
    ],
    dica: 'Pense em como um tigre ataca: devagar ou com força e velocidade?',
    explicacao: 'O apelido compara o crescimento econômico desses países ao ataque de um tigre: forte, agressivo e muito rápido.',
    curiosidade: 'Durante décadas, essas economias cresceram, em muitos anos, mais de 7% ao ano. Nesse ritmo, a economia dobra de tamanho em cerca de 10 anos.'
  },
  {
    id: 'f2q3', fase: 2, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'guerraFria' },
    legenda: 'Os dois blocos da Guerra Fria e o apoio dos EUA aos Tigres (ilustração).',
    enunciado: 'Durante a Guerra Fria, os EUA apoiaram a industrialização dos Tigres. Qual era o principal objetivo?',
    correta: 'Fortalecer aliados capitalistas perto do bloco socialista',
    erradas: [
      'Transformar a região na maior produtora de petróleo do mundo',
      'Impedir que a região vendesse seus produtos ao Japão',
      'Substituir toda a agricultura pela mineração de ouro'
    ],
    dica: 'Na Guerra Fria, EUA e União Soviética disputavam influência no mundo.',
    explicacao: 'Os EUA queriam conter a expansão do socialismo na Ásia (China, Coreia do Norte, Vietnã). Ajudar a economia de aliados capitalistas era uma forma de fortalecê-los.',
    curiosidade: 'A Península Coreana foi dividida após 1945. A Guerra da Coreia (1950–1953) terminou com a divisão mantida: um país socialista ao norte e um capitalista ao sul.'
  },
  {
    id: 'f2q4', fase: 2, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'japaoInveste' },
    legenda: 'Investimentos e tecnologia do Japão chegando aos Tigres (ilustração).',
    enunciado: 'Uma característica do crescimento econômico dos Tigres Asiáticos foi...',
    correta: 'a influência do Japão na industrialização dos países',
    erradas: [
      'o desenvolvimento industrial isolado do mercado externo',
      'a proibição total da entrada de empresas estrangeiras',
      'o abandono da educação para priorizar só a agricultura'
    ],
    dica: 'Qual vizinho já industrializado investiu na região?',
    explicacao: 'O Japão, primeiro país industrializado da Ásia, investiu nos Tigres, transferiu tecnologia e comprou seus produtos. A industrialização dos Tigres foi voltada ao mercado externo, e não isolada dele.',
    curiosidade: 'A siderúrgica sul-coreana POSCO, fundada em 1968, foi construída com recursos e apoio técnico vindos do Japão.'
  },
  {
    id: 'f2q5', fase: 2, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'exportacao' },
    legenda: 'Navio carregado de contêineres deixando o porto (ilustração).',
    enunciado: 'A industrialização dos Tigres foi voltada principalmente para...',
    correta: 'a exportação de produtos para outros países',
    erradas: [
      'o consumo interno, sem vender para o exterior',
      'a produção de alimentos apenas para a subsistência',
      'a extração de petróleo e de gás natural em alto-mar'
    ],
    dica: 'Observe o navio na imagem: para onde vão os contêineres?',
    explicacao: 'Os Tigres produziam para vender ao exterior, principalmente para os EUA, o Japão e a Europa. Esse modelo é chamado de industrialização voltada para a exportação.',
    curiosidade: 'Nos anos 1960 e 1970, perucas estavam entre os produtos mais exportados pela Coreia do Sul, ao lado de tecidos, calçados e compensado de madeira.'
  },
  {
    id: 'f2q6', fase: 2, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'escola' },
    legenda: 'Sala de aula com estudantes e professora (ilustração).',
    enunciado: 'Que investimento do Estado foi fundamental para qualificar a mão de obra dos Tigres?',
    correta: 'Educação, formando trabalhadores mais preparados',
    erradas: [
      'Turismo, atraindo muitos visitantes de outros países',
      'Agricultura tradicional, sem o uso de nenhuma máquina',
      'Exército, ampliando muito o número de soldados'
    ],
    dica: 'Para trabalhar com máquinas e tecnologia, o que as pessoas precisam?',
    explicacao: 'Os governos investiram muito em escolas e universidades. A mão de obra ficou disciplinada e cada vez mais qualificada para trabalhar em indústrias modernas.',
    curiosidade: 'Hoje a Coreia do Sul investe cerca de 5% do PIB em pesquisa e desenvolvimento, a 2ª maior proporção do mundo (dado de 2024).'
  },
  {
    id: 'f2q7', fase: 2, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'jointVenture' },
    legenda: 'Duas empresas se unindo em uma parceria (ilustração).',
    enunciado: 'Os Tigres se abriram ao capital estrangeiro com joint ventures. O que é uma joint venture?',
    correta: 'Parceria entre empresas para realizar um negócio específico',
    erradas: [
      'Imposto cobrado sobre produtos vindos de outros países',
      'Acordo que proíbe a entrada de empresas estrangeiras',
      'Empréstimo do governo para os pequenos agricultores do campo'
    ],
    dica: 'Na imagem, duas empresas dão as mãos.',
    explicacao: 'Joint venture é uma parceria entre duas ou mais empresas que se unem para um negócio específico. Nos Tigres, essas parcerias trouxeram capital e transferência de tecnologia.',
    curiosidade: 'Em 1968, a sul-coreana Hyundai começou a montar carros da Ford sob licença. Em 1975, lançou o Pony, o primeiro carro sul-coreano produzido em massa.'
  },
  {
    id: 'f2q8', fase: 2, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'fabricaLeve' },
    legenda: 'Fábrica de roupas e brinquedos dos anos 1960 (ilustração).',
    enunciado: 'Nas primeiras fases da industrialização, os Tigres produziam principalmente...',
    correta: 'roupas, calçados, brinquedos e outros bens simples',
    erradas: [
      'aviões, satélites e foguetes para viagens espaciais',
      'chips de última geração para inteligência artificial',
      'remédios avançados e vacinas de alta tecnologia'
    ],
    dica: 'No começo, as fábricas usavam muita mão de obra e pouca tecnologia.',
    explicacao: 'No início, os Tigres fabricavam bens simples, que exigiam muitos trabalhadores e pouca tecnologia, como roupas, calçados e brinquedos. Só depois avançaram para a alta tecnologia.',
    curiosidade: 'Nos anos 1960 e 1970, as etiquetas "Made in Hong Kong" e "Made in Taiwan" eram comuns em brinquedos e roupas vendidos no mundo todo.'
  },
  {
    id: 'f2q9', fase: 2, tipo: 'multipla', essencial: true,
    visual: { tipo: 'grafico', nome: 'multiplicador' },
    legenda: 'Quantas vezes a renda por pessoa aumentou entre 1960 e 2022, em cada país.',
    enunciado: 'Observe o gráfico. O que ele mostra sobre a renda por pessoa dos Tigres entre 1960 e 2022?',
    correta: 'Cresceu mais de 20 vezes, bem mais que a do Brasil',
    erradas: [
      'Cresceu bem menos que a do Brasil em todo o período',
      'Ficou praticamente igual à do Brasil durante esses anos',
      'Diminuiu por causa do fim das fábricas nesses países'
    ],
    dica: 'Compare o comprimento das barras laranja com a barra do Brasil.',
    explicacao: 'Entre 1960 e 2022, a renda por pessoa da Coreia do Sul ficou cerca de 27 vezes maior; a de Taiwan, 25 vezes; a de Singapura, 23 vezes. A do Brasil aumentou cerca de 4 vezes.',
    curiosidade: 'Os valores do gráfico descontam a inflação e as diferenças de custo de vida entre os países, para que a comparação seja justa.'
  },
  {
    id: 'f2m1', fase: 2, tipo: 'mapa', alvo: 'TWN',
    enunciado: 'Clique em Taiwan, a ilha que se tornou um dos Tigres Asiáticos.',
    dica: 'É uma ilha em frente ao litoral sudeste da China.',
    explicacao: 'Taiwan é uma ilha a leste da China, no Oceano Pacífico. A partir dos anos 1960, industrializou-se rapidamente com foco em exportações.',
    curiosidade: 'Taiwan tem governo próprio, mas a China reivindica a ilha como parte do seu território.'
  },
  {
    id: 'f2m2', fase: 2, tipo: 'mapa', alvo: 'SGP',
    enunciado: 'Clique em Singapura, a cidade-Estado na ponta da Península Malaia.',
    dica: 'Procure o ponto na extremidade sul da península, perto da linha do Equador.',
    explicacao: 'Singapura (ou Cingapura) é uma pequena ilha no extremo sul da Península Malaia, a cerca de 140 km ao norte da linha do Equador.',
    curiosidade: 'Por estar entre os oceanos Índico e Pacífico, Singapura controla uma das rotas marítimas mais movimentadas do planeta: o Estreito de Malaca.'
  },
  {
    id: 'f2m3', fase: 2, tipo: 'mapa', alvo: 'HKG',
    enunciado: 'Clique em Hong Kong, antiga colônia britânica no sul da China.',
    dica: 'Fica no litoral sul da China, perto da foz do Rio das Pérolas.',
    explicacao: 'Hong Kong fica no litoral sul da China. Foi colônia britânica até 1997, quando passou a ser uma Região Administrativa Especial da China.',
    curiosidade: 'Hong Kong é um dos maiores centros financeiros do mundo e tem um dos portos mais movimentados da Ásia.'
  },

  /* ============================ FASE 3 ============================ */
  {
    id: 'f3q1', fase: 3, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'chip' },
    legenda: 'Um chip (semicondutor) sobre uma placa de circuitos (ilustração).',
    enunciado: 'Nas décadas de 1980 e 1990, os Tigres Asiáticos passaram a produzir...',
    correta: 'semicondutores, eletrônicos, automóveis e máquinas',
    erradas: [
      'café, açúcar, algodão e muitos outros produtos agrícolas',
      'carvão, ferro, cobre e outros minérios sem processar',
      'apenas roupas simples, brinquedos e artesanato local'
    ],
    dica: 'É a fase da alta tecnologia.',
    explicacao: 'Os Tigres avançaram para produtos de alta tecnologia e de maior valor: semicondutores (chips), equipamentos eletrônicos, automóveis, máquinas e equipamentos.',
    curiosidade: 'A taiwanesa TSMC, criada em 1987 com apoio do governo, tornou-se a maior fabricante de chips sob encomenda do mundo.'
  },
  {
    id: 'f3q2', fase: 3, tipo: 'multipla',
    visual: { tipo: 'grafico', nome: 'chips' },
    legenda: 'Onde ficava a capacidade de fabricar os chips mais avançados do mundo.',
    enunciado: 'Segundo o gráfico, onde estava toda a capacidade de fabricar os chips mais avançados do mundo?',
    correta: 'Em Taiwan e na Coreia do Sul, dois Tigres Asiáticos',
    erradas: [
      'Nos Estados Unidos e no Canadá, na América do Norte',
      'Na Alemanha e na França, dois países da União Europeia',
      'No Brasil e na Argentina, dois países sul-americanos'
    ],
    dica: 'Leia os rótulos das duas partes da barra.',
    explicacao: 'Segundo um estudo de 2021 da associação da indústria de semicondutores dos EUA (SIA) com a consultoria BCG, 92% dessa capacidade estava em Taiwan e 8% na Coreia do Sul.',
    curiosidade: 'Um nanômetro é um milionésimo de milímetro. Os chips modernos têm bilhões de transistores em uma área do tamanho de uma unha.'
  },
  {
    id: 'f3q3', fase: 3, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'zee' },
    legenda: 'Entrada de uma Zona Econômica Especial, com fábricas e investidores estrangeiros (ilustração).',
    enunciado: 'Os Tigres criaram Zonas Econômicas Especiais (ZEEs) e modernizaram seus portos para...',
    correta: 'atrair investimentos estrangeiros diretos (IED)',
    erradas: [
      'impedir a entrada de navios vindos de outros países',
      'proteger áreas agrícolas contra as cidades',
      'abrigar bases militares durante as guerras'
    ],
    dica: 'Pense em quem traz dinheiro para construir fábricas.',
    explicacao: 'Com impostos menores, boa infraestrutura e portos eficientes, as ZEEs atraíram empresas estrangeiras que construíram fábricas: os Investimentos Estrangeiros Diretos (IED).',
    curiosidade: 'Em 1966, Taiwan criou em Kaohsiung sua primeira zona de processamento de exportação, um dos primeiros modelos desse tipo na Ásia.'
  },
  {
    id: 'f3q4', fase: 3, tipo: 'multipla',
    visual: { tipo: 'grafico', nome: 'portos' },
    legenda: 'Contêineres movimentados em 2024 por grandes portos dos Tigres, dos Novos Tigres e do Brasil.',
    enunciado: 'Observe o gráfico. Qual porto de um Tigre Asiático movimentou mais contêineres em 2024?',
    correta: 'Singapura',
    erradas: ['Busan', 'Hong Kong', 'Kaohsiung'],
    dica: 'Procure a barra mais comprida.',
    explicacao: 'O porto de Singapura movimentou cerca de 41 milhões de TEU em 2024: é o 2º maior porto de contêineres do mundo, atrás apenas de Xangai, na China. Busan, na Coreia do Sul, ficou em 7º lugar.',
    curiosidade: 'TEU é a medida de um contêiner de 20 pés (cerca de 6 metros). O porto de Santos, o maior do Brasil, movimentou cerca de 5,5 milhões de TEU em 2024.'
  },
  {
    id: 'f3q5', fase: 3, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'celularGlobal' },
    legenda: 'As peças de um celular vêm de vários países (ilustração).',
    enunciado: 'Um celular pode ter chip de Taiwan, tela da Coreia do Sul e montagem em outro país. Isso mostra que os Tigres fazem parte...',
    correta: 'de cadeias globais de valor, com etapas em vários países',
    erradas: [
      'de economias fechadas, que fabricam tudo sem ajuda',
      'de sistemas coloniais ainda controlados por países europeus',
      'de mercados locais, que vendem apenas aos vizinhos'
    ],
    dica: 'Cada peça vem de um lugar diferente.',
    explicacao: 'Nas cadeias globais de valor, cada etapa da produção (pesquisa, peças, montagem, venda) acontece em um país diferente. Os Tigres tornaram-se elos centrais dessas cadeias.',
    curiosidade: 'Quase metade dos celulares que a sul-coreana Samsung vende no mundo é fabricada no Vietnã.'
  },
  {
    id: 'f3q6', fase: 3, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'skyline' },
    legenda: 'Arranha-céus e bancos de um centro financeiro à noite (ilustração).',
    enunciado: 'Além da indústria, Singapura se destacou no mundo como...',
    correta: 'centro financeiro e logístico, com bancos e porto',
    erradas: [
      'grande produtora de café e de soja para exportação',
      'grande produtora mundial de petróleo e de gás natural',
      'cidade isolada, sem comércio com outros países'
    ],
    dica: 'Pense nos bancos e no porto da cidade.',
    explicacao: 'Singapura depende menos da indústria do que a Coreia do Sul e Taiwan. Ela se tornou um importante centro financeiro, com bancos internacionais, e logístico, com porto e aeroporto.',
    curiosidade: 'Singapura tem cerca de 744 km², menos da metade da área da cidade de São Paulo (1.521 km²). Aterros sobre o mar aumentaram seu território em cerca de 28% desde os anos 1960.'
  },
  {
    id: 'f3q7', fase: 3, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'ied' },
    legenda: 'Empresa estrangeira construindo uma fábrica em outro país (ilustração).',
    enunciado: 'Quando uma empresa estrangeira constrói uma fábrica em outro país, isso é um exemplo de...',
    correta: 'Investimento Estrangeiro Direto (IED)',
    erradas: [
      'Índice de Desenvolvimento Humano (IDH)',
      'Organização Mundial do Comércio (OMC)',
      'Mercado Comum do Sul (Mercosul)'
    ],
    dica: 'A sigla tem a ver com dinheiro que vem de fora para produzir.',
    explicacao: 'IED é quando uma empresa investe diretamente em outro país, abrindo fábricas ou escritórios. O IDH mede a qualidade de vida; a OMC regula o comércio mundial; o Mercosul é um bloco econômico da América do Sul.',
    curiosidade: 'Em 1972, a americana Intel abriu em Penang, na Malásia, sua primeira fábrica fora dos Estados Unidos.'
  },
  {
    id: 'f3q8', fase: 3, tipo: 'multipla', essencial: true,
    visual: { tipo: 'grafico', nome: 'brasilCoreia' },
    legenda: 'Renda por pessoa do Brasil e da Coreia do Sul em 1960 e em 2022.',
    enunciado: 'Observe o gráfico. O que aconteceu com a renda por pessoa da Coreia do Sul em relação à do Brasil?',
    correta: 'Era menor que a do Brasil e ficou bem maior',
    erradas: [
      'Sempre foi maior que a do Brasil no período',
      'Era maior que a do Brasil e ficou bem menor',
      'Continuou praticamente igual à do Brasil'
    ],
    dica: 'Compare os pontos de 1960 e de 2022 de cada país.',
    explicacao: 'Em 1960, a renda média de um brasileiro era mais que o dobro da de um sul-coreano. Em 2022, a de um sul-coreano era quase três vezes a de um brasileiro.',
    curiosidade: 'Esse salto ficou conhecido como "Milagre do Rio Han", o rio que atravessa Seul, a capital sul-coreana.'
  },
  {
    id: 'f3m1', fase: 3, tipo: 'mapa', alvo: 'KOR',
    enunciado: 'Clique na Coreia do Sul, país do porto de Busan e de gigantes da tecnologia.',
    dica: 'Ocupa o sul da Península Coreana.',
    explicacao: 'A Coreia do Sul fica no sul da Península Coreana. Busan, no litoral sudeste, é o maior porto do país.',
    curiosidade: 'Busan foi o 7º porto de contêineres mais movimentado do mundo em 2024.'
  },
  {
    id: 'f3m2', fase: 3, tipo: 'mapa', alvo: 'SGP',
    enunciado: 'Clique em Singapura, que tem o 2º maior porto de contêineres do mundo.',
    dica: 'Fica na ponta sul da Península Malaia.',
    explicacao: 'Singapura fica no extremo sul da Península Malaia, junto ao Estreito de Malaca, por onde passa grande parte do comércio entre a Ásia e o resto do mundo.',
    curiosidade: 'Em 2024, o porto de Singapura movimentou mais de 41 milhões de TEU.'
  },

  /* ============================ FASE 4 ============================ */
  {
    id: 'f4q1', fase: 4, tipo: 'multipla', essencial: true,
    visual: { tipo: 'mapa', destaque: ['MYS', 'THA', 'IDN', 'PHL', 'VNM'], grupo: 'novos' },
    legenda: 'Mapa com cinco países destacados em roxo.',
    enunciado: 'Os países destacados no mapa são os Novos Tigres Asiáticos. Quais são eles?',
    correta: 'Malásia, Tailândia, Indonésia, Filipinas e Vietnã',
    erradas: [
      'Coreia do Sul, Singapura, Taiwan, Hong Kong e Japão',
      'Japão, China, Mongólia e Coreia do Norte',
      'Índia, Paquistão, Nepal, Butão e Bangladesh'
    ],
    dica: 'Todos ficam no Sudeste Asiático, e dois deles são arquipélagos.',
    explicacao: 'Os Novos Tigres são Malásia, Tailândia, Indonésia, Filipinas e Vietnã, todos no Sudeste Asiático. Eles se industrializaram mais tarde que os Tigres, atraindo fábricas de multinacionais.',
    curiosidade: 'Indonésia e Filipinas são arquipélagos: juntas, somam mais de 24 mil ilhas.'
  },
  {
    id: 'f4q2', fase: 4, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'multinacional' },
    legenda: 'Uma fábrica se mudando para um país com custos menores (ilustração).',
    enunciado: 'Por que as multinacionais passaram a investir nos Novos Tigres a partir dos anos 1990?',
    correta: 'Buscavam mão de obra mais barata e incentivos fiscais',
    erradas: [
      'Buscavam pagar salários mais altos aos funcionários',
      'Queriam produzir longe dos portos e das rodovias',
      'Pretendiam ficar perto das maiores reservas de ouro'
    ],
    dica: 'Os custos de produção tinham subido nos "velhos" Tigres e no Japão.',
    explicacao: 'Com o desenvolvimento, salários e custos subiram no Japão e nos Tigres. As multinacionais procuraram países com mão de obra mais barata e impostos menores (incentivos fiscais).',
    curiosidade: 'Esse movimento continua: hoje muitas fábricas também se mudam para o Vietnã, a Índia e Bangladesh.'
  },
  {
    id: 'f4q3', fase: 4, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'texteis' },
    legenda: 'Fábrica têxtil com fileiras de máquinas de costura (ilustração).',
    enunciado: 'A imagem mostra uma fábrica têxtil na Tailândia. Que característica dos Novos Tigres ela representa?',
    correta: 'Especialização em manufaturados, como têxteis',
    erradas: [
      'Produção de petróleo em plataformas marítimas',
      'Economia baseada apenas na pesca artesanal',
      'Pesquisa espacial e lançamento de foguetes'
    ],
    dica: 'Tecidos e roupas são produtos manufaturados.',
    explicacao: 'Os Novos Tigres se especializaram em manufaturados (têxteis, eletrônicos, autopeças) e em agroindústria, com mão de obra abundante e qualificação crescente.',
    curiosidade: 'A Tailândia é chamada de "Detroit da Ásia" por ser um grande polo de fabricação de automóveis. Detroit é a cidade símbolo da indústria de carros nos EUA.'
  },
  {
    id: 'f4q4', fase: 4, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'gansos' },
    legenda: 'Gansos voando em formação: Japão, Tigres, Novos Tigres e outros países (ilustração).',
    enunciado: 'A "revoada dos gansos" é uma imagem usada para explicar a industrialização asiática. O que ela representa?',
    correta: 'A indústria passando de um país a outro, em sequência',
    erradas: [
      'A migração de aves que destruiu as plantações de arroz',
      'A fuga de trabalhadores asiáticos para a América',
      'O fim das fábricas e a volta da agricultura em toda a Ásia'
    ],
    dica: 'Quem voa na frente? E quem vem logo atrás?',
    explicacao: 'O Japão "voa na frente"; depois vêm os Tigres, os Novos Tigres e outros países. As indústrias mais simples passam para quem vem atrás, enquanto os da frente avançam para a alta tecnologia.',
    curiosidade: 'Esse modelo foi proposto pelo economista japonês Kaname Akamatsu, nos anos 1930.'
  },
  {
    id: 'f4q5', fase: 4, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'palmeira' },
    legenda: 'Plantação de palmeiras de dendê e uma usina que extrai o óleo (ilustração).',
    enunciado: 'Além dos manufaturados, em que outra atividade os Novos Tigres se destacam?',
    correta: 'Na agroindústria, como a do óleo de palma',
    erradas: [
      'Na exploração de petróleo no gelado Mar do Norte',
      'No cultivo de trigo em grandes planícies geladas',
      'Na criação de gado nos pampas da Patagônia'
    ],
    dica: 'O óleo de palma vem de uma planta tropical.',
    explicacao: 'Indonésia e Malásia são os maiores produtores mundiais de óleo de palma, usado em alimentos, cosméticos e combustíveis. A agroindústria une agricultura e indústria.',
    curiosidade: 'No Brasil, o óleo dessa palmeira é conhecido como azeite de dendê, muito usado na culinária baiana, como no acarajé.'
  },
  {
    id: 'f4q6', fase: 4, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'divisaoRegional' },
    legenda: 'Cada país faz uma etapa da produção na região (ilustração).',
    enunciado: 'O que significa dizer que os Novos Tigres se integraram à divisão regional do trabalho?',
    correta: 'Complementam a produção do Japão e dos velhos Tigres',
    erradas: [
      'Competem apenas com países da América do Sul',
      'Deixaram de exportar e produzem só para si',
      'Dividiram seus territórios entre grandes empresas europeias'
    ],
    dica: 'Cada país faz uma parte do trabalho na região.',
    explicacao: 'Na divisão regional do trabalho, cada país faz uma etapa: Japão e Tigres fornecem tecnologia, capital e peças; os Novos Tigres montam e fabricam manufaturados.'
  },
  {
    id: 'f4q7', fase: 4, tipo: 'multipla',
    visual: { tipo: 'grafico', nome: 'renda2022' },
    legenda: 'Renda por pessoa em 2022: Tigres, Novos Tigres e Brasil.',
    enunciado: 'Segundo o gráfico, qual Novo Tigre tinha a maior renda por pessoa em 2022?',
    correta: 'Malásia',
    erradas: ['Tailândia', 'Indonésia', 'Filipinas'],
    dica: 'Compare apenas as barras roxas.',
    explicacao: 'Entre os Novos Tigres, a Malásia tinha a maior renda por pessoa em 2022 (cerca de 26,6 mil dólares, em valores ajustados). Ainda assim, ficou bem abaixo de Singapura e Taiwan.'
  },
  {
    id: 'f4q8', fase: 4, tipo: 'multipla',
    visual: { tipo: 'mapa', destaque: ['MYS', 'THA', 'IDN', 'PHL', 'VNM'], grupo: 'novos' },
    legenda: 'Mapa com os cinco Novos Tigres destacados em roxo.',
    enunciado: 'Os países destacados no mapa são os Novos Tigres. Qual deles faz fronteira com a China?',
    correta: 'Vietnã',
    erradas: ['Tailândia', 'Malásia', 'Filipinas'],
    dica: 'Procure o país em forma de "S", no litoral do Mar da China Meridional.',
    explicacao: 'O Vietnã faz fronteira com a China ao norte e ocupa o leste da Península da Indochina. Desde as reformas econômicas de 1986, atraiu fábricas de multinacionais, como as de celulares e de roupas.',
    curiosidade: 'Com seu formato de "S", o Vietnã tem mais de 3 mil quilômetros de litoral.'
  },
  {
    id: 'f4m1', fase: 4, tipo: 'mapa', alvo: 'IDN',
    enunciado: 'Clique na Indonésia, o maior país formado por ilhas do mundo.',
    dica: 'Ela se espalha pela linha do Equador, de Sumatra até a Nova Guiné.',
    explicacao: 'A Indonésia é um arquipélago com mais de 17 mil ilhas, cortado pela linha do Equador. Com cerca de 284 milhões de habitantes (2025), é o 4º país mais populoso do mundo.'
  },
  {
    id: 'f4m2', fase: 4, tipo: 'mapa', alvo: 'THA',
    enunciado: 'Clique na Tailândia, conhecida como a "Detroit da Ásia".',
    dica: 'Fica no centro da Península da Indochina, entre Mianmar e Camboja.',
    explicacao: 'A Tailândia fica no Sudeste Asiático, entre Mianmar, Laos, Camboja e Malásia. É um grande polo de fabricação de automóveis.'
  },
  {
    id: 'f4m3', fase: 4, tipo: 'mapa', alvo: 'MYS',
    enunciado: 'Clique na Malásia, o país das Torres Petronas.',
    dica: 'Uma parte fica na Península Malaia e outra no norte da ilha de Bornéu.',
    explicacao: 'A Malásia tem duas partes: uma na Península Malaia e outra no norte da ilha de Bornéu. A capital é Kuala Lumpur.'
  },
  {
    id: 'f4m4', fase: 4, tipo: 'mapa', alvo: 'PHL',
    enunciado: 'Clique nas Filipinas, arquipélago com mais de 7 mil ilhas.',
    dica: 'Fica a leste do Vietnã, do outro lado do Mar da China Meridional.',
    explicacao: 'As Filipinas são um arquipélago no Oceano Pacífico, a leste do Mar da China Meridional. A capital é Manila, na ilha de Luzon.'
  },
  {
    id: 'f4m5', fase: 4, tipo: 'mapa', alvo: 'VNM',
    enunciado: 'Clique no Vietnã, onde a Samsung fabrica muitos dos seus celulares.',
    dica: 'Tem a forma de um "S" comprido no leste da Península da Indochina.',
    explicacao: 'O Vietnã ocupa o leste da Península da Indochina. Atraiu muitas fábricas de eletrônicos, roupas e calçados.',
    curiosidade: 'O Vietnã é o 2º maior produtor de café do mundo, atrás apenas do Brasil.'
  },

  /* ============================ FASE 5 ============================ */
  {
    id: 'f5q1', fase: 5, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'fabricaMundo' },
    legenda: 'Uma enorme fábrica despachando caixas para o mundo todo (ilustração).',
    enunciado: 'No século XXI, qual país passou a ser chamado de "fábrica do mundo", aumentando a concorrência com os Tigres?',
    correta: 'China',
    erradas: ['Índia', 'Japão', 'Rússia'],
    dica: 'É o maior país do Leste Asiático, vizinho de Hong Kong.',
    explicacao: 'A China tornou-se a "fábrica do mundo": em 2023, fazia cerca de 28% de toda a produção industrial do planeta. Isso aumentou a disputa por investimentos e mercados.'
  },
  {
    id: 'f5q2', fase: 5, tipo: 'multipla',
    visual: { tipo: 'grafico', nome: 'china28' },
    legenda: 'Participação da China no valor da produção industrial mundial em 2023.',
    enunciado: 'Observe o gráfico. Que parte da produção industrial do mundo estava na China em 2023?',
    correta: 'Pouco mais de um quarto de toda a produção',
    erradas: [
      'Menos de um décimo de toda a produção',
      'Exatamente a metade de toda a produção',
      'Quase toda a produção industrial do mundo'
    ],
    dica: '28% é um pouco mais que 25%. Que fração é 25%?',
    explicacao: 'Em 2023, a China respondia por cerca de 28% do valor da produção industrial do mundo, pouco mais de um quarto (25%). É mais do que os três países seguintes somados.'
  },
  {
    id: 'f5q3', fase: 5, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'industria40' },
    legenda: 'Laboratório de pesquisa com robôs e computadores (ilustração).',
    enunciado: 'Para continuar competitivos, os Tigres precisam de inovação contínua. Qual exemplo representa isso?',
    correta: 'Investir em pesquisa (P&D) e em automação',
    erradas: [
      'Voltar ao trabalho manual e a ferramentas simples',
      'Fechar as escolas técnicas e as universidades',
      'Proibir o uso de computadores dentro das fábricas'
    ],
    dica: 'Pense em laboratórios, robôs e Indústria 4.0.',
    explicacao: 'Inovação contínua significa investir em Pesquisa e Desenvolvimento (P&D), automação e Indústria 4.0: fábricas conectadas, robôs e inteligência artificial.'
  },
  {
    id: 'f5q4', fase: 5, tipo: 'multipla', essencial: true,
    visual: { tipo: 'grafico', nome: 'criseIndonesia' },
    legenda: 'Renda por pessoa da Indonésia, em dólares, de 1990 a 2005.',
    enunciado: 'O gráfico mostra a renda por pessoa da Indonésia, em dólares. O que aconteceu em 1998, após a crise asiática de 1997?',
    correta: 'Caiu para menos da metade em apenas um ano',
    erradas: [
      'Aumentou mais que o dobro em apenas um ano',
      'Ficou exatamente igual à do ano anterior',
      'Cresceu devagar, como nos anos anteriores'
    ],
    dica: 'Procure o ponto mais baixo da linha.',
    explicacao: 'A crise começou na Tailândia, em julho de 1997, e se espalhou pela região. A moeda indonésia perdeu muito valor, e a renda por pessoa medida em dólares caiu de cerca de 1.300 (1997) para cerca de 570 (1998).',
    curiosidade: 'Na Tailândia, a crise ficou conhecida como "Crise do Tom Yum Kung", nome de uma sopa típica do país.'
  },
  {
    id: 'f5q5', fase: 5, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'desigualdade' },
    legenda: 'Prédios modernos ao lado de moradias precárias e alagadas (ilustração).',
    enunciado: 'A imagem mostra prédios modernos ao lado de moradias precárias em Jacarta, na Indonésia. Que desafio ela revela?',
    correta: 'A desigualdade social entre ricos e pobres',
    erradas: [
      'A falta total de indústrias e de comércio',
      'O excesso de áreas agrícolas na capital',
      'A proibição de construir prédios altos'
    ],
    dica: 'Compare os dois tipos de moradia.',
    explicacao: 'Mesmo com crescimento econômico, persistem grandes contrastes entre muita riqueza e extrema pobreza. Superar as desigualdades sociais é um desafio interno desses países.',
    curiosidade: 'Jacarta sofre com enchentes e com o afundamento do solo. Por isso, a Indonésia está construindo uma nova capital, Nusantara, na ilha de Bornéu.'
  },
  {
    id: 'f5q6', fase: 5, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'energiaLimpa' },
    legenda: 'Painéis solares e turbinas eólicas ao lado de chaminés de fábrica (ilustração).',
    enunciado: 'Qual ação faz parte da transição energética, um desafio para as indústrias asiáticas?',
    correta: 'Trocar combustíveis fósseis por energia solar e eólica',
    erradas: [
      'Aumentar o uso de carvão mineral em todas as usinas',
      'Derrubar florestas para ampliar a área das grandes fábricas',
      'Proibir o uso de energia elétrica nas indústrias'
    ],
    dica: 'Transição energética é trocar fontes que poluem por fontes limpas.',
    explicacao: 'A transição energética substitui carvão, petróleo e gás (combustíveis fósseis) por fontes renováveis e mais limpas, como a solar e a eólica, reduzindo a poluição.'
  },
  {
    id: 'f5q7', fase: 5, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'baterias' },
    legenda: 'Fábrica de baterias e carro elétrico sendo carregado (ilustração).',
    enunciado: 'A Coreia do Sul investe em fábricas de baterias para carros elétricos. Isso mostra...',
    correta: 'a busca por setores estratégicos e sustentáveis',
    erradas: [
      'o abandono total da indústria em favor da agricultura',
      'a dependência total do petróleo em todos os transportes',
      'a volta à produção de brinquedos e roupas simples'
    ],
    dica: 'Carros elétricos não queimam gasolina nem diesel.',
    explicacao: 'Baterias para carros elétricos são um setor estratégico e ligado à sustentabilidade. Investir nele ajuda o país a manter a relevância global e a enfrentar a transição energética.'
  },
  {
    id: 'f5q8', fase: 5, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'riscoExterno' },
    legenda: 'Rotas de comércio ligando a Ásia ao mundo, com alertas de crise (ilustração).',
    enunciado: 'Por que depender muito do mercado externo é um risco para os Tigres e os Novos Tigres?',
    correta: 'Crises, variações do câmbio e conflitos afetam as vendas',
    erradas: [
      'O comércio exterior é proibido pelas leis de todos esses países',
      'Os países vizinhos não compram produtos asiáticos',
      'Os produtos asiáticos não são aceitos em outros países'
    ],
    dica: 'Se o cliente lá fora compra menos, o que acontece com quem vende?',
    explicacao: 'Como vendem muito para outros países, crises financeiras, variações cambiais (mudanças no valor da moeda) e tensões geopolíticas podem derrubar exportações e empregos.',
    curiosidade: 'Em 2011, enchentes na Tailândia inundaram fábricas de discos rígidos. O país fazia cerca de 25% desses discos no mundo, e os preços quase dobraram.'
  },
  {
    id: 'f5q9', fase: 5, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'qualificacao' },
    legenda: 'Trabalhadora estudando novas tecnologias em um tablet (ilustração).',
    enunciado: 'Diante da Indústria 4.0, que desafio os trabalhadores desses países enfrentam?',
    correta: 'A necessidade de qualificação profissional permanente',
    erradas: [
      'A proibição de estudar depois que se começa a trabalhar',
      'O fim de todas as profissões ligadas à tecnologia moderna',
      'A volta obrigatória ao trabalho na agricultura'
    ],
    dica: 'Com novas máquinas surgindo sempre, o que o trabalhador precisa fazer?',
    explicacao: 'Com a revolução tecnológica, máquinas e programas mudam o tempo todo. Por isso, os trabalhadores precisam estudar e se atualizar sempre: é a qualificação permanente.'
  },
  {
    id: 'f5q10', fase: 5, tipo: 'multipla', essencial: true,
    visual: { tipo: 'ilustracao', nome: 'trajetoria' },
    legenda: 'Linha do tempo: do arrozal à fábrica e da fábrica ao chip (ilustração).',
    enunciado: 'Qual sequência resume a trajetória econômica da Ásia Oriental estudada na aula?',
    correta: 'Economia agrária → indústria exportadora → alta tecnologia',
    erradas: [
      'Alta tecnologia → economia agrária → indústria exportadora',
      'Indústria exportadora → alta tecnologia → economia agrária',
      'Alta tecnologia → indústria exportadora → economia agrária'
    ],
    dica: 'Comece pelo que existia antes de 1950.',
    explicacao: 'Antes de 1950, economia agrária; nos anos 1960 e 1970, indústrias voltadas à exportação; dos anos 1980 em diante, alta tecnologia.'
  },
  {
    id: 'f5m1', fase: 5, tipo: 'mapa', alvo: 'CHN',
    enunciado: 'Clique na China, a "fábrica do mundo".',
    dica: 'É o maior país do Leste Asiático.',
    explicacao: 'A China é o maior país do Leste Asiático e faz fronteira com 14 países. Em 2023, fazia cerca de 28% da produção industrial do mundo.'
  },
  {
    id: 'f5m2', fase: 5, tipo: 'mapa', alvo: 'JPN',
    enunciado: 'Clique no Japão, o "ganso" que voa na frente da revoada.',
    dica: 'É um arquipélago no extremo leste da Ásia.',
    explicacao: 'No modelo da revoada dos gansos, o Japão é o líder: foi o primeiro a se industrializar e depois transferiu indústrias para os vizinhos.'
  },

  /* ================= EXTRAS (Relâmpago e Duelo) ================= */
  {
    id: 'x1', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'dragao' },
    legenda: 'Um dragão chinês estilizado (ilustração).',
    enunciado: 'Em chinês, os Tigres Asiáticos são chamados de "Quatro Pequenos..."',
    correta: 'Dragões',
    erradas: ['Leões', 'Pandas', 'Elefantes'],
    dica: 'É um animal lendário muito importante na cultura chinesa.',
    explicacao: 'Em chinês, o grupo é chamado de "Quatro Pequenos Dragões". O dragão simboliza força e sorte na cultura chinesa.'
  },
  {
    id: 'x2', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'lojinha' },
    legenda: 'Uma pequena loja de 1938 e um arranha-céu de tecnologia (ilustração).',
    enunciado: 'A Samsung, gigante sul-coreana de eletrônicos, começou em 1938 vendendo...',
    correta: 'peixe seco, verduras e macarrão',
    erradas: [
      'celulares, tablets e computadores',
      'carros, motos e peças automotivas',
      'aviões, navios e trens elétricos'
    ],
    dica: 'Em 1938, a Coreia ainda era um país agrário.',
    explicacao: 'A Samsung foi fundada em 1938, em Daegu, como uma pequena empresa comercial que vendia peixe seco, verduras e macarrão. Só décadas depois passou a fabricar eletrônicos.'
  },
  {
    id: 'x3', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'perucas' },
    legenda: 'Perucas expostas em suportes (ilustração).',
    enunciado: 'Qual destes produtos estava entre os mais exportados pela Coreia do Sul nos anos 1960 e 1970?',
    correta: 'Perucas',
    erradas: ['Satélites', 'Robôs', 'Tablets'],
    dica: 'No começo, as fábricas faziam produtos simples, com muita mão de obra.',
    explicacao: 'Perucas, tecidos, calçados e compensado de madeira foram pilares das exportações sul-coreanas nos anos 1960 e 1970. Chips e celulares vieram muito depois.'
  },
  {
    id: 'x4', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'petronas' },
    legenda: 'Duas torres gêmeas muito altas (ilustração).',
    enunciado: 'As Torres Petronas, os prédios mais altos do mundo entre 1998 e 2004, ficam em qual cidade?',
    correta: 'Kuala Lumpur (Malásia)',
    erradas: ['Bangcoc (Tailândia)', 'Manila (Filipinas)', 'Jacarta (Indonésia)'],
    dica: 'O nome da torre vem da empresa estatal de petróleo de um Novo Tigre.',
    explicacao: 'As Torres Petronas, com 452 metros, ficam em Kuala Lumpur, capital da Malásia, e simbolizam o crescimento dos Novos Tigres.'
  },
  {
    id: 'x5', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'aterro' },
    legenda: 'Uma ilha ganhando novas áreas sobre o mar (ilustração).',
    enunciado: 'Singapura aumentou seu território em cerca de 28% desde os anos 1960. Como?',
    correta: 'Com aterros que avançaram sobre o mar',
    erradas: [
      'Comprando terras de países da Europa',
      'Anexando o território da Indonésia',
      'Drenando um grande lago do interior'
    ],
    dica: 'Olhe a areia sendo despejada na imagem.',
    explicacao: 'Singapura usa aterros, com areia e rochas depositadas no mar, para ganhar terreno. Sua área passou de cerca de 582 km² para cerca de 744 km².'
  },
  {
    id: 'x6', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'enchente' },
    legenda: 'Fábrica alagada e discos rígidos de computador (ilustração).',
    enunciado: 'Em 2011, enchentes na Tailândia fizeram subir o preço de computadores no mundo todo. Por quê?',
    correta: 'O país fabricava muitos discos rígidos para computadores',
    erradas: [
      'O país era o único produtor de teclados do planeta',
      'A água destruiu todas as lojas de informática da Ásia inteira',
      'O governo proibiu a venda de computadores no país'
    ],
    dica: 'Pense nas cadeias globais de produção.',
    explicacao: 'A Tailândia fazia cerca de 25% dos discos rígidos do mundo. Com as fábricas inundadas, faltou produto e os preços quase dobraram: as cadeias globais conectam os países.'
  },
  {
    id: 'x7', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'rioHan' },
    legenda: 'Uma cidade moderna cortada por um rio largo (ilustração).',
    enunciado: 'O crescimento acelerado da Coreia do Sul ficou conhecido como...',
    correta: 'Milagre do Rio Han',
    erradas: ['Milagre do Rio Nilo', 'Milagre do Rio Mekong', 'Milagre do Rio Amarelo'],
    dica: 'É o rio que atravessa Seul.',
    explicacao: 'O Rio Han atravessa Seul, a capital da Coreia do Sul. "Milagre do Rio Han" é o nome dado ao crescimento acelerado do país a partir dos anos 1960.'
  },
  {
    id: 'x8', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'dende' },
    legenda: 'Cachos de dendê e uma garrafa de óleo (ilustração).',
    enunciado: 'O óleo de palma, produzido em grande escala na Indonésia e na Malásia, é conhecido no Brasil como...',
    correta: 'azeite de dendê',
    erradas: ['óleo de soja', 'azeite de oliva', 'óleo de coco'],
    dica: 'É usado no acarajé.',
    explicacao: 'O óleo de palma vem do dendezeiro. No Brasil, é chamado de azeite de dendê e aparece em pratos baianos como o acarajé e a moqueca.'
  },
  {
    id: 'x9', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'conteiner' },
    legenda: 'Um contêiner padrão de 20 pés (ilustração).',
    enunciado: 'Qual unidade é usada para medir a movimentação de contêineres nos portos?',
    correta: 'TEU (contêiner de 20 pés)',
    erradas: ['PIB (produto interno bruto)', 'IDH (desenvolvimento humano)', 'km² (quilômetro quadrado)'],
    dica: 'A sigla vem do inglês "Twenty-foot Equivalent Unit".',
    explicacao: 'TEU significa "unidade equivalente a 20 pés": um contêiner de cerca de 6 metros de comprimento. Um contêiner de 40 pés conta como 2 TEU.'
  },
  {
    id: 'x10', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'hongKong' },
    legenda: 'Arranha-céus à beira de uma baía (ilustração).',
    enunciado: 'Até 1997, Hong Kong era uma colônia de qual país?',
    correta: 'Reino Unido',
    erradas: ['Portugal', 'França', 'Holanda'],
    dica: 'O mesmo país que colonizou Singapura.',
    explicacao: 'Hong Kong foi colônia britânica até 1997, quando passou à China como Região Administrativa Especial. Perto dali, Macau foi administrada por Portugal até 1999.'
  },
  {
    id: 'x11', fase: 0, tipo: 'multipla',
    visual: { tipo: 'ilustracao', nome: 'cafe' },
    legenda: 'Grãos e xícara de café (ilustração).',
    enunciado: 'O Vietnã, um dos Novos Tigres, é o 2º maior produtor mundial de qual produto, atrás do Brasil?',
    correta: 'Café',
    erradas: ['Soja', 'Laranja', 'Açúcar'],
    dica: 'É uma bebida muito consumida no Brasil.',
    explicacao: 'O Vietnã é o 2º maior produtor de café do mundo, atrás apenas do Brasil. Além da agricultura, o país atrai fábricas de eletrônicos, roupas e calçados.'
  }
];
