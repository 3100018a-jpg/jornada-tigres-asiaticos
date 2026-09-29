/* Dados dos gráficos, fichas dos países e fontes.
   Todos os números foram conferidos nas fontes citadas (acesso em set. 2026). */

window.DADOS = {
  grupos: {
    tigres: { nome: 'Tigres Asiáticos', curto: 'Tigres', cor: '#F26B21', paises: ['KOR', 'TWN', 'HKG', 'SGP'] },
    novos: { nome: 'Novos Tigres', curto: 'Novos Tigres', cor: '#8250E0', paises: ['MYS', 'THA', 'IDN', 'PHL', 'VNM'] }
  },

  nomes: {
    KOR: 'Coreia do Sul', PRK: 'Coreia do Norte', TWN: 'Taiwan', HKG: 'Hong Kong', SGP: 'Singapura',
    MYS: 'Malásia', THA: 'Tailândia', IDN: 'Indonésia', PHL: 'Filipinas', VNM: 'Vietnã', IND: 'Índia',
    BGD: 'Bangladesh', JPN: 'Japão', CHN: 'China', MNG: 'Mongólia', RUS: 'Rússia', MMR: 'Mianmar',
    LAO: 'Laos', KHM: 'Camboja', BRN: 'Brunei', TLS: 'Timor-Leste', PNG: 'Papua-Nova Guiné',
    LKA: 'Sri Lanka', NPL: 'Nepal', BTN: 'Butão', PAK: 'Paquistão', AFG: 'Afeganistão',
    KAZ: 'Cazaquistão', KGZ: 'Quirguistão', TJK: 'Tajiquistão', UZB: 'Uzbequistão', BRA: 'Brasil'
  },

  /* Ficha de cada país no modo Explorar */
  paises: {
    KOR: {
      grupo: 'tigres', capital: 'Seul', tipo: 'País',
      produz: ['Chips de memória', 'Celulares', 'Automóveis', 'Navios', 'Baterias'],
      fato: 'O crescimento acelerado a partir dos anos 1960 ficou conhecido como "Milagre do Rio Han". Hoje o país investe cerca de 5% do PIB em pesquisa, a 2ª maior proporção do mundo (2024).'
    },
    TWN: {
      grupo: 'tigres', capital: 'Taipé', tipo: 'Ilha com governo próprio',
      produz: ['Chips', 'Computadores', 'Eletrônicos', 'Máquinas'],
      fato: 'Um estudo de 2021 mostrou que 92% da capacidade mundial de fabricar os chips mais avançados estava em Taiwan. A ilha tem governo próprio, mas a China a reivindica como parte do seu território.'
    },
    HKG: {
      grupo: 'tigres', capital: '—', tipo: 'Região Administrativa Especial da China',
      produz: ['Serviços financeiros', 'Comércio', 'Logística', 'Turismo'],
      fato: 'Foi colônia britânica até 1997. Nos anos 1960 e 1970 exportava muitas roupas e brinquedos; hoje é um dos maiores centros financeiros do mundo. Seu porto movimentou 13,7 milhões de TEU em 2024.'
    },
    SGP: {
      grupo: 'tigres', capital: 'Singapura', tipo: 'Cidade-Estado (independente desde 1965)',
      produz: ['Serviços financeiros', 'Logística e porto', 'Eletrônicos', 'Refino de petróleo'],
      fato: 'Também chamada de Cingapura. Tem cerca de 744 km², menos da metade da cidade de São Paulo, e o 2º maior porto de contêineres do mundo (41,1 milhões de TEU em 2024).'
    },
    MYS: {
      grupo: 'novos', capital: 'Kuala Lumpur', tipo: 'País',
      produz: ['Semicondutores', 'Eletrônicos', 'Óleo de palma', 'Petróleo e gás'],
      fato: 'Em 1972, a Intel abriu em Penang sua primeira fábrica fora dos EUA. As Torres Petronas, em Kuala Lumpur, foram os prédios mais altos do mundo entre 1998 e 2004.'
    },
    THA: {
      grupo: 'novos', capital: 'Bangcoc', tipo: 'País',
      produz: ['Automóveis', 'Discos rígidos', 'Eletrônicos', 'Arroz'],
      fato: 'É chamada de "Detroit da Ásia" pela produção de automóveis. A crise asiática de 1997 começou aqui, com a forte desvalorização da moeda tailandesa, o baht.'
    },
    IDN: {
      grupo: 'novos', capital: 'Jacarta', tipo: 'País (arquipélago)',
      produz: ['Óleo de palma', 'Têxteis e calçados', 'Carvão', 'Níquel'],
      fato: 'Maior país-arquipélago do mundo, com mais de 17 mil ilhas e cerca de 284 milhões de habitantes (2025). Está construindo uma nova capital, Nusantara, na ilha de Bornéu.'
    },
    PHL: {
      grupo: 'novos', capital: 'Manila', tipo: 'País (arquipélago)',
      produz: ['Eletrônicos', 'Centrais de atendimento', 'Frutas tropicais'],
      fato: 'Arquipélago com mais de 7 mil ilhas. Eletrônicos estão entre seus principais produtos de exportação, e o país é um dos maiores polos de centrais de atendimento do mundo.'
    },
    VNM: {
      grupo: 'novos', capital: 'Hanói', tipo: 'País',
      produz: ['Celulares', 'Roupas e calçados', 'Café', 'Arroz'],
      fato: 'Quase metade dos celulares da Samsung é fabricada no Vietnã. O país também é o 2º maior produtor de café do mundo, atrás do Brasil. As reformas econômicas de 1986 abriram o país às empresas estrangeiras.'
    },
    IND: {
      grupo: null, capital: 'Nova Délhi', tipo: 'País',
      produz: ['Tecnologia da informação', 'Remédios', 'Automóveis', 'Têxteis'],
      fato: 'País mais populoso do mundo. A cidade de Bengaluru é chamada de "Vale do Silício indiano" pela quantidade de empresas de tecnologia.'
    },
    BGD: {
      grupo: null, capital: 'Daca', tipo: 'País',
      produz: ['Roupas', 'Tecidos', 'Juta'],
      fato: 'Está entre os maiores exportadores de roupas do mundo. A indústria de confecção emprega milhões de pessoas, muitas delas mulheres.'
    },
    JPN: {
      grupo: null, papel: 'Pioneiro e investidor', capital: 'Tóquio', tipo: 'País (arquipélago)',
      produz: ['Automóveis', 'Máquinas', 'Robôs', 'Eletrônicos'],
      fato: 'Primeiro país asiático a se industrializar, ainda no fim do século XIX. Investiu nos Tigres e é o "ganso que voa na frente" na revoada dos gansos.'
    },
    CHN: {
      grupo: null, papel: 'A "fábrica do mundo"', capital: 'Pequim', tipo: 'País',
      produz: ['Quase tudo: de roupas a carros elétricos', 'Painéis solares', 'Eletrônicos'],
      fato: 'Em 2023, fazia cerca de 28% de toda a produção industrial do planeta, mais do que os três países seguintes somados. Faz fronteira com 14 países.'
    },
    PRK: { grupo: null, capital: 'Pyongyang', tipo: 'País', fato: 'A Península Coreana foi dividida em 1945. A Coreia do Norte seguiu o modelo socialista e tem uma economia fechada ao comércio mundial.' },
    BRN: { grupo: null, capital: 'Bandar Seri Begawan', tipo: 'País', fato: 'Pequeno país no norte de Bornéu, rico em petróleo e gás natural.' },
    TLS: { grupo: null, capital: 'Díli', tipo: 'País', fato: 'Um dos países mais jovens do mundo, independente desde 2002. Assim como o Brasil, tem o português como língua oficial.' },
    LKA: { grupo: null, capital: 'Colombo', tipo: 'País (ilha)', fato: 'Grande produtor de chá: o famoso "chá do Ceilão" leva o antigo nome da ilha.' },
    PNG: { grupo: null, capital: 'Port Moresby', tipo: 'País', fato: 'Ocupa a metade leste da ilha de Nova Guiné. A metade oeste pertence à Indonésia.' },
    MMR: { grupo: null, capital: 'Naypyidaw', tipo: 'País' },
    LAO: { grupo: null, capital: 'Vientiane', tipo: 'País', fato: 'Único país do Sudeste Asiático sem saída para o mar.' },
    KHM: { grupo: null, capital: 'Phnom Penh', tipo: 'País' },
    MNG: { grupo: null, capital: 'Ulan Bator', tipo: 'País' },
    RUS: { grupo: null, capital: 'Moscou', tipo: 'País' },
    NPL: { grupo: null, capital: 'Katmandu', tipo: 'País', fato: 'Abriga o Monte Everest, o ponto mais alto do planeta, na fronteira com a China.' },
    BTN: { grupo: null, capital: 'Thimphu', tipo: 'País' },
    PAK: { grupo: null, capital: 'Islamabad', tipo: 'País' },
    AFG: { grupo: null, capital: 'Cabul', tipo: 'País' },
    KAZ: { grupo: null, capital: 'Astana', tipo: 'País' },
    KGZ: { grupo: null, capital: 'Bishkek', tipo: 'País' },
    TJK: { grupo: null, capital: 'Duchambé', tipo: 'País' },
    UZB: { grupo: null, capital: 'Tashkent', tipo: 'País' }
  },

  /* Renda por pessoa (PIB per capita), dólares internacionais de 2011:
     valores corrigidos pela inflação e pelas diferenças de custo de vida. */
  maddison: {
    fonte: 'Maddison Project Database 2023 (Bolt e van Zanden), via Our World in Data',
    unidade: 'dólares internacionais de 2011',
    anos: [1960, 2022],
    valores: {
      KOR: [1548, 41321], TWN: [2157, 53143], SGP: [3464, 80320],
      MYS: [2439, 26629], THA: [1718, 16421], IDN: [1613, 12802], PHL: [2353, 8371],
      VNM: [1274, 8050], IND: [1200, 7766], BGD: [869, 4926],
      CHN: [1057, 19238], JPN: [6354, 38269], BRA: [3398, 14640]
    }
  },

  urbanizacaoCoreia: {
    fonte: 'Banco Mundial, com dados da ONU',
    anos: [{ ano: 1960, urbana: 27.7 }, { ano: 2024, urbana: 81.5 }]
  },

  portos2024: {
    fonte: 'Lloyd’s List, ranking de 2024 (via Wikipédia)',
    unidade: 'milhões de TEU',
    lista: [
      { nome: 'Singapura', pais: 'SGP', grupo: 'tigres', valor: 41.1 },
      { nome: 'Busan (Coreia do Sul)', pais: 'KOR', grupo: 'tigres', valor: 24.4 },
      { nome: 'Port Klang (Malásia)', pais: 'MYS', grupo: 'novos', valor: 14.6 },
      { nome: 'Hong Kong', pais: 'HKG', grupo: 'tigres', valor: 13.7 },
      { nome: 'Tanjung Pelepas (Malásia)', pais: 'MYS', grupo: 'novos', valor: 12.3 },
      { nome: 'Laem Chabang (Tailândia)', pais: 'THA', grupo: 'novos', valor: 9.6 },
      { nome: 'Kaohsiung (Taiwan)', pais: 'TWN', grupo: 'tigres', valor: 9.2 },
      { nome: 'Santos (Brasil)', pais: 'BRA', grupo: 'brasil', valor: 5.5 }
    ]
  },

  chips: {
    fonte: 'Semiconductor Industry Association (SIA) e BCG, 2021',
    descricao: 'Capacidade mundial de fabricar os chips mais avançados (menos de 10 nanômetros)',
    partes: [{ nome: 'Taiwan', grupo: 'tigres', valor: 92 }, { nome: 'Coreia do Sul', grupo: 'tigres', valor: 8 }]
  },

  china: {
    fonte: 'CSIS ChinaPower, com dados da ONU',
    ano: 2023,
    valor: 28
  },

  indonesia: {
    fonte: 'FMI, World Economic Outlook',
    unidade: 'dólares de cada ano',
    serie: [
      [1990, 771], [1991, 848], [1992, 908], [1993, 1013], [1994, 1116], [1995, 1254],
      [1996, 1394], [1997, 1308], [1998, 572], [1999, 830], [2000, 870], [2001, 834],
      [2002, 1003], [2003, 1186], [2004, 1280], [2005, 1404]
    ]
  },

  fontes: [
    { t: 'Material Digital SEDUC-SP — Geografia, 9º ano, 4º bimestre, Aula 6: Industrialização na Ásia (2026)', u: '' },
    { t: 'Maddison Project Database 2023 (Bolt e van Zanden), via Our World in Data — renda por pessoa 1960 e 2022', u: 'https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database' },
    { t: 'Banco Mundial — população urbana da Coreia do Sul (1960: 27,7%; 2024: 81,5%)', u: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=KR' },
    { t: 'Lloyd’s List / Wikipédia — portos de contêineres mais movimentados (2024)', u: 'https://en.wikipedia.org/wiki/List_of_busiest_container_ports' },
    { t: 'SIA e BCG (2021) — Strengthening the Global Semiconductor Supply Chain', u: 'https://www.semiconductors.org/strengthening-the-global-semiconductor-supply-chain-in-an-uncertain-era/' },
    { t: 'CSIS ChinaPower — participação da China na produção industrial (2023)', u: 'https://chinapower.csis.org/tracker/china-manufacturing/' },
    { t: 'FMI — World Economic Outlook (renda por pessoa da Indonésia em dólares)', u: 'https://www.imf.org/external/datamapper/NGDPDPC@WEO' },
    { t: 'The Korea Herald — perucas entre as principais exportações da Coreia nos anos 1960 e 1970', u: 'https://www.koreaherald.com/article/483611' },
    { t: 'Intel — Penang, primeira fábrica da Intel fora dos EUA (1972)', u: 'https://www.intel.com/content/www/us/en/history/virtual-vault/articles/intel-penang.html' },
    { t: 'Export Processing Zone Administration (Taiwan) — Kaohsiung, 1966', u: 'https://www.epza.gov.tw/english/page.aspx?pageid=ce7b2de9e958965c' },
    { t: 'Wikipédia — Samsung (fundação em 1938), Hyundai Pony (1975), Geografia de Singapura, Crise financeira asiática de 1997, Enchentes na Tailândia em 2011', u: 'https://en.wikipedia.org/wiki/Samsung' },
    { t: 'Asia Business Daily — gasto em P&D da Coreia do Sul (5,13% do PIB em 2024)', u: 'https://view.asiae.co.kr/en/article/2025122616300596203' },
    { t: 'Seasia — quase metade dos celulares da Samsung é feita no Vietnã (2026)', u: 'https://seasia.co/2026/07/05/roughly-half-of-samsung-phones-are-made-in-viet-nam-heres-why' }
  ]
};
