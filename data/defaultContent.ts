import { SiteContent } from '../types/content';

export const defaultContent: SiteContent = {
  home: {
    hero: {
      titleTop: 'Uređenje prostora',
      titleMain: 'Feng Shui',
      titleBottom: 'Put ka miru i radosti',
      subtitle: 'Oko 1000 osoba je osetilo promenu u odnosima, napretku i svakodnevnom miru uz pomoć naše Feng Shui konsultacije. Vaš dom je sledeći.',
      primaryButton: { text: 'Zakažite besplatan razgovor', link: '/upitnik' },
      primaryMicrocopy: 'Besplatno. Bez obaveze.',
      secondaryButton: { text: 'Preuzmite besplatni vodič', link: '/vodic' },
      backgroundImage: '/images/hero.jpeg',
    },
    problemSection: {
      badge: 'Prepoznajete li ovo?',
      title: 'Vaš dom bi trebalo da bude vaše utočište. Ali nešto ne štima.',
      painPoints: [
        'Dođete kući nakon napornog dana — a umesto mira, osetite težinu.',
        'Nered se vraća bez obzira koliko čistite. Fokus vam stalno beži.',
        'Osećate da nešto u prostoru „ne štima" — ali ne umete da objasnite šta.',
        'Uspešne ste, radite na sebi — ali dom vas ne podržava. I to se oseća.',
      ],
      anchorAnalogy: 'Feng Shui je za dom ono što je akupunktura za telo — otkriva blokade koje ne vidite i vraća prirodan protok energije.',
      reframe: 'Ne popravljamo dom. Usklađujemo ga sa vama.',
    },
    introduction: {
      badge: 'Vaš vodič',
      title: 'Znam kako se to oseća — Feng Shui je rešenje za to.',
      subtitle: 'Većina žena koje dođu kod mene osećaju isto — uspešne su, rade na sebi, ali nešto u prostoru ih koči. Kao da dom tiho radi protiv njih.',
      bodyParagraph: 'Ja sam Dragana Jović. Kroz 25 godina i preko 1000 projekata razvila sam sopstvenu autorsku metodu koja spaja klasični Feng Shui sa radiestezijom i holističkim dizajnom. Rezultat? Domovi u kojima se jasnoća, protok i harmonija osete od prvog dana.',
      authorityBadges: [
        '25+ godina iskustva',
        '1000+ transformacija',
        'Međunarodni sertifikat',
        'TV nastupi i mediji',
      ],
      buttonText: 'Više o meni',
      buttonLink: '/about',
      image: '/images/dragana-joivc.webp',
    },
    blockquote: {
      quote: 'Postoji moj život pre Feng Shui i posle. Šta se promenilo? Ništa, ali sve je drugačije.',
      attribution: '— Reči jedne klijentkinje koje najbolje opisuju šta Feng Shui zapravo radi',
    },
    video: {
      badge: 'Viđeno u medijima',
      title: 'Feng Shui koji se pojavljuje na televiziji i u štampi',
      description: 'Dragana je prepoznata kao jedan od vodećih Feng Shui stručnjaka u regionu, sa gostovanjima u emisijama i medijskim nastupima koji potvrđuju njen rad.',
      videoUrl: 'https://www.youtube.com/embed/Up9no5v94CE',
      videoTitle: 'Dragana Jović - Gostovanje u emisiji Baya i Joga',
      quoteAuthor: '— Dragana Jović',
      quoteAttribution: 'Gostovanje u emisiji Baya i Joga',
    },
    thePlan: {
      badge: 'Kako funkcioniše',
      title: 'Tri koraka do doma koji vas podržava',
      subtitle: 'Jednostavan, jasan proces — bez komplikacija, bez nagađanja.',
      steps: [
        { title: 'Popunite upitnik', description: 'Ispričajte nam o svom domu, ciljevima i izazovima. Razgovor počinje sa razumevanjem — ne sa prodajom.' },
        { title: 'Dobijate personalizovanu analizu', description: 'Dragana čita energetsku matricu vašeg prostora i kreira plan tačno za vas — sa konkretnim koracima za transformaciju.' },
        { title: 'Osetite promenu', description: 'Primenjujete preporuke, prostor se menja. Uz 3 meseca podrške, jasnoća i protok postaju nova svakodnevica.' },
      ],
      buttonText: 'Započnite proces',
      buttonLink: '/upitnik',
      buttonMicrocopy: 'Besplatno. Bez obaveze.',
    },
    servicesSection: {
      eyebrow: 'Naše usluge',
      title: 'Izaberite svoj put ka ravnoteži',
      subtitle: 'Preko 1000 žena je prošlo kroz naše ruke. Svaka je imala isto pitanje: kako da moj dom radi za mene? Odgovor počinje ovde.',
    },
    services: [
      {
        title: 'Konsultacije za Dom',
        description: 'Feng Shui nije samo o lepoti — radi se o ravnoteži. Ova metoda je zasnovana na drevnoj mudrosti stvaranja harmonije između čoveka i njegovog okruženja. Uključuje personalizovane proračune prostora kako bismo vam pomogli da otključate protok i vitalnost tamo gde živite i radite.',
        buttonText: 'Transformišite svoj prostor',
        linkTo: '/services',
        image: 'https://picsum.photos/seed/home-consultation/600/400',
      },
      {
        title: 'Feng Shui onlajn Škola',
        description: 'Namenjena je onima koji vole sami da uređuju svoj dom. Program škole je osmišljen tako da vas vodi korak po korak kroz lekcije i praktičan rad koji možete odmah da primenite na svom prostoru.',
        buttonText: 'Transformišite svoj prostor',
        linkTo: '/school',
      },
      {
        title: 'Izbor Nekretnina',
        description: 'Izaberite dom ili radni prostor koji je usklađen sa vašom energijom i podržava vašu viziju. Naša ekspertiza vam pomaže da izbegnete ponude koje imaju energetske zamke.',
        buttonText: 'Započnite svoje putovanje',
        linkTo: '/services',
      },
    ],
    schoolSpotlight: {
      badge: 'Feng Shui škola',
      title: 'Naučite da sami čitate energiju svog doma',
      paragraph: 'Četvoromesečni program koji vas vodi korak po korak — od osnova do samostalne prakse. Za žene koje žele da razumeju svoj prostor i preuzmu kontrolu nad energijom u kojoj žive.',
      features: [
        '16 video lekcija — učite sopstvenim tempom',
        'Rad na sopstvenom domu — vaš prostor postaje učionica',
        'Zatvorena grupa za podršku i razmenu iskustava',
        'Zvanični sertifikat po završetku programa',
      ],
      primaryButton: { text: 'Saznajte više o školi', link: '/school' },
      secondaryButton: { text: 'Raspitajte se', link: '/upitnik' },
      videoUrl: '/images/dodela-diploma-2.mp4',
    },
    testimonials: {
      eyebrow: 'Iskustva klijenata',
      title: 'Stvarne energetske promene. Stvarni ljudi.',
      subtitle: 'Ovo nisu priče o nameštaju. Ovo su priče o ženama koje su odlučile da prestanu da nagađaju — i da konačno razumeju šta im prostor govori.',
      items: [
        {
          quote: 'Godinama sam se budio u 3 ujutro bez razloga. Probao sam sve — od čajeva do melatonina. Dragana je predložila jednu promenu u spavaćoj sobi — pomeranje kreveta i uklanjanje ogledala. Prva noć bez buđenja. Sada spavam 7 sati bez prekida, već 4 meseca.',
          author: 'Stefan D.',
          location: 'Beograd',
          service: 'Konsultacije za Dom',
        },
        {
          quote: 'Bila sam skeptična — nisam verovala da raspored nameštaja može nešto da promeni. Ali nakon prvog meseca u školi, primenila sam naučeno na svoj dnevni boravak. Porodica je primetila pre mene: \'Mama, zašto je ovde sad tako lepo?\' Znanje koje sam dobila je neprocenjivo.',
          author: 'Milica L.',
          location: 'Novi Sad',
          service: 'Feng Shui Škola',
        },
        {
          quote: 'Odbili smo tri \'savršene\' nekretnine na osnovu Draganine analize. Četvrta je imala sve — i energiju i funkcionalnost. Useljenje je bilo pre godinu dana. Deca bolje spavaju, mi se manje svađamo, a komšije nam stalno govore da je naš stan \'nekako drugačiji\'.',
          author: 'Ana M.',
          location: 'Beograd',
          service: 'Izbor Nekretnina',
        },
      ],
    },
    freeGuide: {
      badge: 'Besplatni vodič',
      title: 'Otkrijte šta vaš dom govori o vama',
      description: '7 poglavlja, interaktivni test za energiju doma i praktični koraci za harmonizaciju prostora. Vaš prvi korak ka jasnoći, protoku i domu koji vas podržava.',
      chapters: [
        'Zašto vaš dom utiče na vas',
        'Brzi Feng Shui test',
        'Mini mapa prostora',
        'Priprema za harmonizaciju',
        '5 blokada energije',
        'Refleksija',
        'Sledeći korak',
      ],
      buttonText: 'Preuzmite besplatni vodič',
      buttonLink: '/vodic',
    },
    newsletter: {
      title: 'Pridružite se našem newsletter-u',
      subtitle: 'Povremeni saveti o protoku energije, ritualima i usklađenom životu kroz Feng Shui — direktno u vaš inbox.',
      placeholder: 'Vaš email',
      buttonText: 'Prijavite se',
      successMessage: 'Hvala! Uspešno ste se prijavili.',
    },
    webinarSection: {
      enabled: false,
      badge: 'Besplatan vebinar',
      title: 'Prijavite se za besplatan Feng Shui vebinar',
      subtitle: 'Otkrijte kako energija prostora oblikuje vaš svakodnevni život — i prve korake ka harmonizaciji doma.',
      startsAt: '',
      buttonText: 'Prijavi se',
      successMessage: 'Hvala! Vaša prijava je primljena. Detalje šaljemo na email.',
    },
    cta: {
      badge: 'Spremni ste?',
      title: 'Vaš prostor govori. Da li ste spremni da ga čujete?',
      subtitle: 'Tu smo da vam pomognemo da uskladite svoj prostor – i svoj život.',
      closingParagraph: 'Svaki dan koji prođe bez promene je dan u kom vaš dom tiho radi protiv vas — protiv vašeg mira, vašeg fokusa, vaših odnosa. Prva konsultacija je besplatna.',
      primaryButton: { text: 'Zakažite razgovor', link: '/upitnik' },
      secondaryButton: { text: 'Pogledajte školu', link: '/school' },
    },
  },

  about: {
    hero: {
      eyebrow: 'O Dragani',
      title: 'Vaš vodič na putu ka prostoru koji vas podržava',
      subtitle: 'Dragana Jović — 25 godina iskustva, preko 1000 projekata, i jedno uverenje: kada se prostor uskladi sa vama, sve u životu počinje da teče.',
    },
    bio: {
      heading: 'Zašto radim ovo — i šta to znači za vas',
      paragraphs: [
        'Moj put je počeo daleko od Feng Shui — na Tehničko-metalurškom fakultetu u Beogradu. Ali ta osnova u strukturi i nauci dala mi je nešto dragoceno: sposobnost da vidim prostor ne samo kao estetiku, već kao sistem koji utiče na sve oko sebe.',
        'Intenzivne studije na Mastery Academy of Chinese Metaphysics otvorile su mi potpuno novu dimenziju. Shvatila sam da drevna mudrost nije suprotna nauci — već njen dopuna. To me je inspirisalo da kreiram sopstvenu metodologiju, prilagođenu energetskim potrebama našeg regiona i naših domova.',
        'Danas, nakon 25 godina i više od 1000 projekata, moja praksa spaja tradicionalni Feng Shui sa radiestezijom, kristalnom terapijom, svetom geometrijom i holističkim dizajnom. Ali ono što me zaista pokreće nije tehnika — već trenutak kada klijentnica kaže: \'Konačno se osećam kao kod kuće u sopstvenom domu.\'',
      ],
      image: 'https://picsum.photos/seed/dragana-jovic/800/1000',
      credentials: [
        'Tehničko-metalurški fakultet, Beograd — temelj u nauci i strukturi',
        'Mastery Academy of Chinese Metaphysics — međunarodno priznata obuka',
        'Kreator autorske Feng Shui metode — prilagođene našem regionu',
        'TV i medijski nastupi — prepoznata stručnost',
        'Holistička Akademija Maya — kontinuirano usavršavanje',
      ],
      quote: 'Vibracije prostora, misli i hrane duboko oblikuju kvalitet života. Njihova harmonizacija je temelj istinske radosti.',
      email: 'ptplan.rs@gmail.com',
      phone: '+381 63 380 098',
    },
    philosophy: {
      eyebrow: 'Filozofija',
      title: 'Moja filozofija',
      subtitle: 'Verujem da vaš dom nije samo mesto gde živite — on je odraz svega što jeste i svega što možete da postanete',
      description: 'Kada uskladimo prostor sa namerom, nešto se pomeri. Ne samo u domu — nego i u nama. Jasnoća dolazi lakše. Odluke se donose prirodnije. Odnosi se smiruju. To nije magija — to je rezultat života u prostoru koji vas razume.',
      items: [
        {
          number: '01',
          title: 'Personalizacija',
          description: 'Nijedna dva čoveka — niti doma — nisu ista. Slušam vaš prostor i vašu priču da bih oblikovala rešenja koja odražavaju vašu energiju, ciljeve i ritam života.',
        },
        {
          number: '02',
          title: 'Harmonija',
          description: 'Povezujem drevnu kinesku mudrost sa modernom realnošću, spajajući metafizički uvid sa praktičnim dizajnom za bezvremeno, negujuće okruženje.',
        },
        {
          number: '03',
          title: 'Transformacija',
          description: 'Feng Shui nije u vezi sa nameštajem. Radi se o energiji. Koristim prostor kao alat za isceljenje, usklađivanje i lični razvoj — iznutra ka spolja.',
        },
      ],
    },
    timeline: {
      eyebrow: 'Karijera',
      title: 'Kvalifikacije i obuka',
      subtitle: 'Dvadesetogodišnje putovanje od studenta do duhovnog arhitekte',
      entries: [
        {
          year: '2005',
          title: 'BTB Feng Shui master program',
          description: 'Inicijacija u Black Sect Tantric Buddhist Feng Shui pod Grand Masterom Lin Yunom, otvorivši mi oči za duboku vezu između prostora i duhovne energije.',
        },
        {
          year: '2008',
          title: 'Sertifikacija klasičnog Feng Shui',
          description: 'Studije tradicionalnih metoda Compass School sa Masterom Raymond Lo u Hong Kongu, produbljivanje razumevanja drevnih principa i njihove matematičke preciznosti.',
        },
        {
          year: '2012',
          title: 'Napredno čišćenje prostora',
          description: 'Sertifikacija tehnika energetskog čišćenja od strane International Feng Shui Guild, učeći da percipiram i transformišem nevidljive energetske otiske koji oblikuju naše iskustvo.',
        },
        {
          year: '2015',
          title: 'Diploma unutrašnjeg dizajna',
          description: 'Formalna obuka za povezivanje vizualne harmonije sa energetskim protokom, premošćujući jaz između tradicionalne mudrosti i savremenih estetskih senzibiliteta.',
        },
        {
          year: '2018',
          title: 'Objavljena knjiga „Harmonizovano življenje"',
          description: 'Autorka sveobuhvatnog vodiča za modernu primenu Feng Shui u domovima, pretočivši decenije mudrosti u praktična rešenja za svakodnevnu harmoniju.',
        },
        {
          year: '2020',
          title: 'Osnivanje škole',
          description: 'Pokretanje imerzivnog programa obuke zasnovanog na mojoj originalnoj metodologiji, ispunjavajući misiju deljenja ovog transformativnog znanja sa novom generacijom praktičara.',
        },
      ],
    },
    cta: {
      title: 'Vaš sledeći korak počinje sa namerom',
      subtitle: 'Bilo da ste spremni da promenite energiju u svom domu ili da produbite svoju mudrost kroz učenje, tu sam da hodam sa vama — jedan prostor, jedan uvid u isto vreme.',
      primaryButton: { text: 'Pozovite Draganu', link: '/upitnik' },
      secondaryButton: { text: 'Pogledajte školu', link: '/school' },
      primaryMicrocopy: 'Besplatan razgovor, 15 minuta',
    },
  },

  services: {
    hero: {
      eyebrow: 'Naše Usluge',
      title: 'Prostor koji razume vas — i podržava sve što želite da postanete',
      subtitle: 'Svaka usluga je osmišljena da vaš dom postane saveznik — u zdravlju, odnosima, prosperitetu i unutrašnjem miru.',
      tagline: 'Kurirano od Dragane Jović, majstorice Feng Shui i arhitektkinje energije.',
    },
    overview: {
      eyebrow: 'Ponuda',
      title: 'Gde biste prvo želeli da se prebacite?',
      subtitle: 'Svaka naša ponuda osmišljena je da vam pomogne da u svoj život unesete više usklađenosti, jasnoće i mira — snagom prostora.',
      cards: [
        {
          title: 'Usklađivanje energije doma',
          description: 'Učinite da energija vašeg životnog prostora  bude podržavajuća za vaše sadašnje životne ciljeve. Dobićete detaljne instrukcije šta treba da uraditie u prostoru da biste otklonili zastoj u prilivu novca, dobroj komunikaciji, zdravlju ili karijeri.',
          buttonText: 'Uskladite svoj dom',
          linkTo: '/upitnik',
        },
        {
          title: 'Idejni projekat za novogradnju ili adaptaciju',
          description: 'Ako gradite ili renovirate dom, sigurno želite prostor koji je po vašoj meri u svakom pogledu. Koristeći drevna znanja Feng Shui, možemo zajedno to da ostvarimo. Uz pomoć preciznih proračuna kvaliteta energije, dobićete  dom koji će podići vašu enrgiju, uneti mir u vaš um i balans u vaše odnose i funkcionalno zadovoljiti sve vaše potrebe.',
          buttonText: 'Dizajnirajte sa namerom',
          linkTo: '/upitnik',
        },
        {
          title: 'Vodič za energetsku procenu nekretnina',
          description: 'Otkrijte nekretnine koje rezoniraju sa vašom energijom i svrhom. Izbegnite prostore koji vam oduzimaju energiju i pronađite lokacije koje pojačavaju viziju i put vašeg života.',
          buttonText: 'Pronađite svoj usklađeni prostor',
          linkTo: '/upitnik',
        },
      ],
    },
    serviceDetails: [
      // 1. Home Consultations
      {
        title: 'Usklađivanje energije doma',
        subtitle: 'Stvorite harmoniju u prostoru u kojem već živite. Osetite promenu.',
        description: 'Ova analiza čita energetsku matricu vašeg trenutnog prostora koristeći tradicionalni Feng Shui, radiesteziju i Draganine personalizovane uvide. Identifikujemo blokade, usklađujemo protok i vodimo vaš dom ka ravnoteži.',
        includedItems: [
          'Energetska analiza prostora — da razumete zašto se osećate kako se osećate u svom domu',
          'Plan napravljen tačno za vas — ne generički saveti, već rešenja za vaš život',
          'Otključavanje blokiranih zona — za bolji protok energije, fokusa i mira',
          'Konkretne promene u rasporedu — znate tačno šta, gde i zašto promeniti',
          '3D energetska mapa vašeg doma — jasna, vizuelna, za lako praćenje',
          '3 meseca podrške — niste sami dok se promene ne ukore',
        ],
        buttonText: 'Započni promenu energije u svom domu',
        buttonLink: '/upitnik',
        image: 'https://picsum.photos/seed/services-calm-living-room/800/600',
        imageAlt: 'Svetla, mirna dnevna soba sa pogledom na prirodu',
      },
      // 2. Space Design
      {
        title: 'Idejni projekat za novogradnju ili adaptaciju',
        subtitle: 'Oživite svoj dom ili budući prostor uz kompletan energetski plan.',
        description: 'Ovo je Draganina autorska ponuda za energetski dizajn — idealna za nove domove, adaptacije ili kancelarije. Ucrtavamo vašu ličnu energiju u planove kako bismo osigurali protok, harmoniju i usklađene rezultate od prvog dana.',
        includedItems: [
          'Analiza planova pre izgradnje — da dom od početka bude usklađen',
          'Personalizacija za celu porodicu — svačija energija je uzeta u obzir',
          'Optimalan raspored prostorija — za prirodan protok i funkcionalnost',
          'Boje i elementi koji podržavaju vas — ne samo estetika, već energija',
          '3D energetska mapa — vizuelni vodič za graditelje i dizajnere',
          'Podrška tokom cele gradnje — da rezultat bude tačno onakav kakav želite',
        ],
        buttonText: 'Rezervišite svoj plan dizajna prostora',
        buttonLink: '/upitnik',
        image: 'https://picsum.photos/seed/services-balanced-design/800/600',
        imageAlt: 'Enterijer sa prirodnim svetlom i uravnoteženim dizajnom',
      },
      // 3. Real Estate Guidance
      {
        title: 'Vodič za energetsku procenu nekretnina',
        subtitle: 'Neka energija odabere vaš sledeći dom — ne samo cena.',
        description: 'Bilo da kupujete ili prodajete, energija nekretnine duboko utiče na vaše blagostanje i budući tok. Dragana kombinuje svoje majstorstvo Feng Shui sa licenciranim znanjem iz oblasti nekretnina kako bi procenila kompatibilnost vas i prostora.',
        includedItems: [
          'Energetska procena pre kupovine — izbegnite skupe greške',
          'Provera kompatibilnosti — da li nekretnina odgovara vašoj porodici',
          'Otkrivanje skrivenih problema — koje ne vidite na prvi pogled',
          'Priprema za prodaju — da vaša nekretnina privuče prave kupce brže',
          'Stručna podrška — znanje o energiji i tržištu u jednom paketu',
        ],
        buttonText: 'Proceni nekretninu',
        buttonLink: '/upitnik',
        image: 'https://picsum.photos/seed/services-house-nature/800/600',
        imageAlt: 'Mirna kuća sa prirodnim okruženjem',
      },
      // 4. Feng Shui Online School
      {
        title: 'Feng Shui onlajn škola',
        subtitle: 'Naučite da oblikujete svoj prostor — i svoju budućnost — uz drevnu mudrost.',
        description: 'Ovaj četvoromesečni intenzivni program oživljava Draganinu Feng Shui metodologiju kroz video lekcije, uživo vođene sesije i podršku grupe. Idealno za početnike i buduće praktičare, naučićete kako da čitate i transformišete sopstvene prostore, odnose i životne ciljeve.',
        includedItems: [
          '16 video lekcija — učite sopstvenim tempom, pristupajte uvek',
          'Praktične vežbe uz svaku lekciju — odmah primenite naučeno',
          'Rad na sopstvenom domu — vaš prostor postaje učionica',
          'Zatvorena grupa za podršku — okruženi ste ženama koje prolaze isti put',
          'Zvanični sertifikat — osnova za profesionalnu praksu',
        ],
        buttonText: 'Pridružite se grupi koja ima slična interesovanja vašim',
        buttonLink: '/school',
        image: 'https://picsum.photos/seed/services-teaching-space/800/600',
        imageAlt: 'Prostor za podučavanje sa biljkama i duhovnim materijalima',
      },
      // 5. Monthly & Annual Guidance
      {
        title: 'Godišnje i mesečno Feng Shui vođenje kroz energiju prostora',
        subtitle: 'Uskladite se sa energetskim ritmovima vremena.',
        description: 'Godišnji Feng Shui. Sve je u prirodi promenljivo. Tako se i energetski tokovi u vašem prostoru svake godine menjaju. Ova personalizovana usklađivanja pomažu vam da svake godine maksimalno koristite dobre uticaje  energije i da izbegnete one loše. To će vam doneti jasnoću u svakodnevnim odlukama, zaštitu i energetski balans.\nMesečni Feng Shui. Bilo da započinjete novi projekat, menjate posao, planirate venčanje ili jednostavno ulazite u novo poglavlje  života—mesečni Feng Shui može da bude vaša velika podrška i džoker u rukavu.',
        includedItems: [
          'Energetsko čitanje za vaš period — znate šta vas čeka i kako se pripremiti',
          'Aktiviranje povoljnih pravaca — maksimalno koristite energiju vremena',
          'Fleksibilan format — video poziv ili pisani izveštaj, kako vam odgovara',
          'Redovna podrška — mesečno ili godišnje, prema vašem ritmu',
        ],
        buttonText: 'Zatražite vremensko čitanje',
        buttonLink: '/upitnik',
        image: 'https://picsum.photos/seed/services-calendar-compass/800/600',
        imageAlt: 'Kalendar sa Feng Shui elementima i kompasom',
      },
      // 6. Abundance Vase
      {
        title: 'Kreiranje vaze izobilja',
        subtitle: 'Aktivirajte najjači simbol bogatstva, kreativnosti i unutrašnjeg protoka.',
        description: 'Ova radionica je jedna od Draganinih najtraženijih. Radionice se održavaju uživo ili onlajn. Kreiranje želja i punjenje vaze uz energetsku podršku cele grupe, daje fantastične rezultate u ispunjenju onoga što želite. Materijal koji dobijate za radionicu je personalizovan. Svaka vaza je ručno izrađena prema vašem datumu rođenja i ispunjena simbolima',
        includedItems: [
          'Personalizovana vaza — napravljena prema vašem datumu rođenja i namerama',
          'Vođena radionica — Dragana vas lično vodi kroz ceo ritual',
          'Optimalna pozicija u domu — da vaza radi za vas maksimalno',
          'Saveti za održavanje — da energija vaze ostane snažna',
        ],
        buttonText: 'Naručite moju vazu obilja',
        buttonLink: '/vaza-izobilja',
        image: 'https://picsum.photos/seed/services-golden-vase/800/600',
        imageAlt: 'Prelepa vaza sa zlatnim elementima na drvenom stolu',
      },
    ],
    labels: {
      includedHeading: 'Šta je uključeno:',
      primaryButtonMicrocopy: 'Besplatna energetska procena vašeg doma',
    },
    process: {
      title: 'Naš proces',
      subtitle: 'Korak po korak od prostora koji vam ne prija a ni sami ne znate zašto, do energetske usklađenosti.',
      steps: [
        {
          number: '1',
          title: 'Početna konsultacija',
          description: 'Započinjemo 1-na-1 razgovorom kako bismo razumeli vaše ciljeve, trenutne izazove i energetske potrebe.',
        },
        {
          number: '2',
          title: 'Procena energije na licu mesta ili na daljinu',
          description: 'Dragana ispituje vaš prostor (ličnim dolaskom ili onlajn)  kako bi procenila protok energije, raspored i prepreke.',
        },
        {
          number: '3',
          title: 'Personalizovane preporuke',
          description: 'Dobijate prilagođene savete, energetske korekcije i prilagođavanja rasporeda — sve mapirano prema vašem ličnom energetskom profilu.',
        },
        {
          number: '4',
          title: 'Podrška pri implementaciji',
          description: 'Vodimo vas kroz promene, dajemo predloge i instrukcije kako bi se preporuke efikasno integrisale.',
        },
        {
          number: '5',
          title: 'Praćenje integracije',
          description: 'Proveravamo rezultate, prilagođavamo po potrebi i osiguravamo da vaš prostor nastavi da podržava vaš razvoj.',
        },
      ],
    },
    faq: {
      title: 'Često postavljana pitanja',
      subtitle: 'Pronađite odgovore na najčešća pitanja o našim Feng Shui uslugama.',
      items: [
        {
          question: 'Koliko obično traje konsultacija?',
          answer: 'Standardna konsultacija za dom obično traje 2–3 sata, zavisno od veličine prostora. Ovo uključuje procenu i trenutne preporuke. Detaljni pisani izveštaji se dostavljaju u roku od nedelju dana.',
        },
        {
          question: 'Da li treba da očistim ili sredim prostor pre konsultacije?',
          answer: 'Osnovno sređivanje je korisno, ali nije neophodno. Zapravo, način na koji prirodno koristite svoj prostor pruža vredne uvide. Međutim, važno je obezbediti pristup svim delovima doma.',
        },
        {
          question: 'Da li ću morati da napravim velike promene u svom domu?',
          answer: 'Većina Feng Shui prilagođavanja je suptilna i izvodljiva. Fokusiramo se na praktične promene koje donose značajnu energetsku razliku, bez potrebe za velikim renoviranjima, osim ako to posebno ne želite.',
        },
        {
          question: 'Koliko brzo ću primetiti rezultate nakon promena?',
          answer: 'Mnogi klijenti prijavljuju da osećaju trenutnu promenu u energiji prostora. Specifičniji rezultati vezani za određene ciljeve mogu se manifestovati tokom nedelja ili meseci kako se energija nastavi da usklađuje.',
        },
        {
          question: 'Može li Feng Shui pomoći u rešavanju specifičnih životnih izazova?',
          answer: 'Da, Feng Shui može da se fokusira na određene oblasti života, uključujući karijeru, odnose, zdravlje i prosperitet. Tokom konsultacije, posvetićemo se oblastima koje su vam najvažnije.',
        },
        {
          question: 'Da li nudite virtuelne konsultacije za međunarodne klijente?',
          answer: 'Da, nudimo virtuelne konsultacije koristeći tlocrte i video pozive. Iako su lične procene idealne, naša virtuelna opcija se pokazala efikasnom za klijente širom sveta.',
        },
      ],
    },
    objections: {
      eyebrow: 'Česta razmišljanja',
      title: 'Pitanja koja žene najčešće postavljaju pre nego što se odluče',
      subtitle: 'Odgovori na dileme koje čujemo svake nedelje.',
      items: [
        {
          question: '„Da li je Feng Shui zaista zasnovan na nečemu, ili je to samo praznovjerje?"',
          answer: 'Feng Shui nije magija. To je sistem za razumevanje kako prostor utiče na vas — vaš fokus, energiju, odnose i odluke. Zasnovan je na principima koji se primenjuju više od 4000 godina. Nije važno da li prihvatate filozofiju — važno je šta primetite kada promenite prostor. A to primećuju sve naše klijentice, bez izuzetka.',
        },
        {
          question: '„Ja nisam posebno \'duhovna\' osoba. Da li je ovo za mene?"',
          answer: 'Većina naših klijentica su praktične, uspešne žene. Ne morate da meditirate ili verujete u energiju. Dovoljno je da budete otvoreni za eksperiment: promenite raspored, pratite kako se osećate. Rezultati govore sami za sebe — a Dragana vas vodi kroz svaki korak.',
        },
        {
          question: '„Kako se ovo razlikuje od dizajna enterijera?"',
          answer: 'Dizajner enterijera uređuje prostor da lepo izgleda. Mi usklađujemo prostor sa vama — vašim ciljevima, vašom energijom, vašim životnim ritmom. Rezultat nije samo lep dom — nego dom koji vas aktivno podržava u zdravlju, odnosima i prosperitetu. To je razlika koju osećate čim uđete.',
        },
        {
          question: '„Šta ako probam i ništa se ne promeni?"',
          answer: 'U 25 godina rada, sa preko 1000 projekata, to se nije desilo. Ali razumemo sumnju — zato nudimo besplatan prvi razgovor. Upoznajte Draganu, postavite pitanja, i sami procenite da li vam pristup odgovara. Bez pritiska, bez obaveze.',
        },
      ],
    },
    contactForm: {
      title: 'Niste sigurni odakle da počnete?',
      subtitle: 'Povežimo se i zajedno pronađimo pravi put.',
      description: 'Feng Shui je duboko ličan — ponekad putovanje počinje jednostavnim razgovorom. Dragana će vas pažljivo uputiti ka ponudi koja najbolje podržava vaš prostor, energiju i trenutnu životnu fazu.',
      submitText: 'Povežite se sa Draganom',
      submittingText: 'Slanje...',
      successMessage: 'Hvala što ste nas kontaktirali!',
      successSubtext: 'Dragana će vam lično odgovoriti u roku od 24–48 sati.',
      nameLabel: 'Ime *',
      namePlaceholder: 'Vaše ime',
      emailLabel: 'Email *',
      emailPlaceholder: 'Vaša email adresa',
      messageLabel: 'Poruka (Opciono)',
      messagePlaceholder: 'Podelite svoja pitanja ili specifične potrebe...',
      nameRequired: 'Ime je obavezno.',
      emailRequired: 'Email adresa je obavezna.',
      emailInvalid: 'Unesite ispravnu email adresu.',
    },
    cta: {
      title: 'Spremni da transformišete svoj prostor?',
      subtitle: 'Napravite prvi korak ka stvaranju harmoničnog okruženja koje podržava vaše ciljeve i unapređuje vaše blagostanje.',
      primaryButton: { text: 'Zakažite procenu', link: '/upitnik' },
      secondaryButton: { text: 'Pogledajte školu', link: '/school' },
      primaryMicrocopy: 'Besplatna energetska procena vašeg doma',
    },
  },

  school: {
    hero: {
      eyebrow: 'Feng Shui Škola',
      title: 'Naučite jezik svog doma — i promenite tok svog života',
      subtitle: 'Četvoromesečni program koji vas uči da čitate energiju prostora, uskladite dom sa sobom i stvorite okruženje koje vas svakodnevno podržava.',
      primaryButton: { text: 'Raspitajte se', link: '/upitnik' },
      primaryMicrocopy: 'Saznajte da li je program za vas',
      secondaryButton: { text: 'Pogledajte program', link: '#curriculum' },
      limitedSpotsText: 'Ograničen broj mesta',
      images: [
        {
          url: 'https://picsum.photos/seed/school-teaching-session/400/300',
          alt: 'Sesija predavanja Feng Shui',
          caption: 'Draganin studio za predavanja',
        },
        {
          url: 'https://picsum.photos/seed/school-harmonized-space/400/300',
          alt: 'Harmonizovan životni prostor',
          caption: 'Transformacija studenata',
        },
        {
          url: 'https://picsum.photos/seed/school-principles-action/400/300',
          alt: 'Feng Shui principi u praksi',
          caption: 'Rad na usklađivanju energije',
        },
        {
          url: 'https://picsum.photos/seed/school-online-guidance/400/300',
          alt: 'Onlajn sesija vođenja Feng Shui',
          caption: 'Sesija vođenja uživo',
        },
      ],
    },
    overview: {
      title: 'Transformišite svoj život kroz ovladavanje prostorom',
      subtitle: 'Proučavajte drevnu nauku Feng Shui sa Draganom Jović i otključajte energetske kodove koji stoje iza zdravlja, harmonije i uspeha.',
      description: 'Naš četvoromesečni imerzivni program spaja istočnjačku mudrost sa modernom primenom, vodeći vas kroz duboku transformaciju i vaših prostora i vašeg života. Pod stručnim vođstvom Dragane, savladaćete praktične tehnike ukorenjene u vekovima starim tradicijama, prilagođene za današnje domove i stilove života.',
      features: [
        'Dizajnirajte svoj život dizajniranjem svog prostora',
        'Naučite da čitate energiju kao mapu',
        'Izgradite sopstvenu Feng Shui osnovu',
        'Vođeno Draganinom autorskom metodom',
        'Vođenje uživo, snimljeni moduli i podrška studentima',
      ],
      buttonText: 'Započnite svoju transformaciju',
      buttonLink: '/upitnik',
      images: [
        {
          url: 'https://picsum.photos/seed/school-overview-space/400/300',
          alt: 'Harmonizovan prostor posle transformacije',
          caption: 'Rezultat rada studenata',
        },
        {
          url: 'https://picsum.photos/seed/school-overview-energy/400/300',
          alt: 'Mapa energije prostora',
          caption: 'Čitanje energetske mape',
        },
        {
          url: 'https://picsum.photos/seed/school-overview-practice/400/300',
          alt: 'Praktičan rad na prostoru',
          caption: 'Praktična primena principa',
        },
        {
          url: 'https://picsum.photos/seed/school-overview-mentoring/400/300',
          alt: 'Mentorstvo uživo',
          caption: 'Vođenje i podrška',
        },
      ],
    },
    benefits: {
      eyebrow: 'Zašto mi',
      title: 'Zašto nam hiljade veruje da predajemo Feng Shui koji funkcioniše',
      subtitle: 'Za razliku od generičkih kurseva koji samo zagrebu površinu, dokazana Draganina metodologija transformiše prostore — i živote — kroz autentičnu praksu.',
      items: [
        {
          title: 'Ukorenjen u pravoj tradiciji',
          description: 'Draganino 20+ godina posvećenog učenja kod priznatih Feng Shui majstora garantuje da dobijate autentičnu mudrost — ne razvodnjene internet koncepte.',
        },
        {
          title: 'Transformacija, ne teorija',
          description: 'Naši studenti ne uče samo koncepte — oni svedoče opipljivim promenama u svojim domovima i životima. Draganina metoda se fokusira na praktičnu primenu sa merljivim rezultatima.',
        },
        {
          title: 'Istočnjačka mudrost, zapadnjački život',
          description: 'Dragana je savladala retku sposobnost prevođenja drevnih istočnjačkih principa u moderne evropske domove, obraćajući se jedinstvenim arhitektonskim i energetskim obrascima našeg regiona.',
        },
      ],
    },
    curriculum: {
      eyebrow: 'Kurikulum',
      title: 'Vaše četvoromesečno putovanje kroz autorsku metodu',
      subtitle: 'Strukturiran, transformativan put koji vas vodi kroz drevnu mudrost Feng Shui sa modernom, praktičnom primenom.',
      months: [
        {
          monthNumber: '1',
          title: 'Svesnost i čišćenje',
          subtitle: 'Naučite da vidite svoj dom kao odraz svog unutrašnjeg sveta.',
          image: 'https://picsum.photos/seed/school-month1-awareness/800/600',
          imageAlt: 'Svesnost i čišćenje',
          weeks: [
            {
              number: '1',
              title: 'Uvod u Feng Shui',
              bullets: [
                'Razumite kako prostor oblikuje vaše emocije, misli i ishode',
                'Naučite zašto je 1/3 vašeg potencijala za uspeh u životu vezana za vaše okruženje',
                'Uskladite svoju svesnost pre preduzimanja akcije',
              ],
            },
            {
              number: '2',
              title: 'Mapiranje tlocrta',
              bullets: [
                'Nacrtajte tlocrt svog doma sa pravcem kompasa',
                'Počnite locirati tok energije i arhitektonske blokade',
              ],
            },
            {
              number: '3',
              title: 'Čišćenje blokada',
              bullets: [
                'Identifikujte suptilne obrasce nereda',
                'Primenite tehniku brzog čišćenja za otključavanje toka Qi energije',
              ],
            },
            {
              number: '4',
              title: 'Unutrašnja refleksija',
              bullets: [
                'Razmislite o prostornim uvidima i energetskim promenama',
                'Koristite vođenje dnevnika i namerne pauze za jasnoću',
              ],
            },
          ],
        },
        {
          monthNumber: '2',
          title: 'Usklađivanje i aktivacija',
          subtitle: 'Harmonizujte svaku prostoriju da podrži zdravlje, odmor, kreativnost i prosperitet.',
          image: 'https://picsum.photos/seed/school-month2-alignment/800/600',
          imageAlt: 'Usklađivanje i aktivacija',
          weeks: [
            {
              number: '1',
              title: 'Energetska forma i funkcija',
              bullets: [
                'Razumite kako oblici i arhitektura utiču na porodičnu dinamiku',
                'Vežbajte energetsko balansiranje na sopstvenom domu',
              ],
            },
            {
              number: '2',
              title: 'Dnevni i spavaći prostori',
              bullets: [
                'Reorganizujte svoje dnevne i spavaće prostore za optimalan tok',
              ],
            },
            {
              number: '3',
              title: 'Kuhinje i kupatila',
              bullets: [
                'Bavite se elementima vode i curenjem energije',
              ],
            },
            {
              number: '4',
              title: 'Radni i kreativni prostori',
              bullets: [
                'Razlikujte kućne kancelarije od zona za hobije',
                'Prilagodite raspored na osnovu energije aktivnosti',
              ],
            },
          ],
        },
        {
          monthNumber: '3',
          title: 'Energetski pravac i namera',
          subtitle: 'Koristite svoj lični energetski broj da otključate podršku za novac, zdravlje, ljubav i svrhu.',
          image: 'https://picsum.photos/seed/school-month3-direction/800/600',
          imageAlt: 'Energetski pravac i namera',
          weeks: [
            {
              number: '1',
              title: 'Lični energetski broj',
              bullets: [
                'Izračunajte svoj broj i razumite njegovo suštinsko značenje',
              ],
            },
            {
              number: '2',
              title: 'Aktivacija uspeha i prosperiteta',
              bullets: [
                'Primenite specifične tehnike za rast karijere i izobilje',
              ],
            },
            {
              number: '3',
              title: 'Aktivacija zdravlja i mira',
              bullets: [
                'Kreirajte prostore koji neguju fizičko i emocionalno blagostanje',
              ],
            },
            {
              number: '4',
              title: 'Aktivacija ljubavi i odnosa',
              bullets: [
                'Transformišite prostore da podrže povezanost i harmoniju',
              ],
            },
          ],
        },
        {
          monthNumber: '4',
          title: 'Izobilje i emocionalna integracija',
          subtitle: 'Kreirajte svoju personalizovanu Vazu izobilja i postavite svoj budući put.',
          image: 'https://picsum.photos/seed/school-month4-abundance/800/600',
          imageAlt: 'Izobilje i emocionalna integracija',
          weeks: [
            {
              number: '1',
              title: 'Refleksija i integracija',
              bullets: [
                'Sintetizujte svoja učenja iz prethodnih meseci',
              ],
            },
            {
              number: '2',
              title: 'Rituali emocionalnog čišćenja',
              bullets: [
                'Naučite ceremonije za oslobađanje energetskih blokada',
              ],
            },
            {
              number: '3',
              title: 'Postavljanje ciljeva i rad sa namerom',
              bullets: [
                'Uskladite svoj prostor sa svojom vizijom budućnosti',
              ],
            },
            {
              number: '4',
              title: 'Ritual kreiranja vaze uživo',
              bullets: [
                'Kreirajte svoju personalizovanu Vazu izobilja uz vođstvo',
              ],
            },
          ],
        },
      ],
      graduationNote: 'Završite svoje putovanje posebnom ceremonijom diplomiranja i primite zvanični Feng Shui sertifikat.',
      weekLabel: 'Nedelja',
      qaNote: 'Uključena sesija pitanja i odgovora uživo',
    },
    format: {
      eyebrow: 'Format',
      title: 'Format programa',
      subtitle: 'Fleksibilan ali strukturiran pristup dizajniran za duboko učenje i praktičnu primenu.',
      image: 'https://picsum.photos/seed/school-format-learning/800/600',
      imageAlt: 'Onlajn okruženje za učenje',
      items: [
        {
          title: 'Nedeljne sesije uživo',
          description: 'Dvočasovni interaktivni video časovi sa demonstracijama, diskusijama i pitanjima i odgovorima. Sve sesije se snimaju za one koji ne mogu da prisustvuju uživo.',
        },
        {
          title: 'Sveobuhvatni materijali',
          description: 'Pristup detaljnim materijalima kursa, literaturom i vizuelnim vodičima kroz našu korisnički prijatnu onlajn platformu.',
        },
        {
          title: 'Format male grupe',
          description: 'Časovi ograničeni na 15 studenata kako bi se obezbedila personalizovana pažnja i smislena povezanost.',
        },
        {
          title: 'Praktični zadaci',
          description: 'Praktični projekti koji primenjuju učenja svake nedelje na realne prostore, sa personalizovanim povratnim informacijama od vašeg instruktora.',
        },
      ],
    },
    faq: {
      eyebrow: 'Česta pitanja',
      title: 'Često postavljana pitanja',
      subtitle: 'Pronađite odgovore na česta pitanja o našoj Feng Shui školi.',
      items: [
        {
          question: 'Da li mi je potrebno prethodno znanje o Feng Shui da bih se upisao/la u školu?',
          answer: 'Nije potrebno prethodno znanje. Naš kurikulum počinje od osnova i postepeno gradi napredne koncepte, čineći ga pristupačnim za potpune početnike, a i dalje vrednim za one sa određenim iskustvom.',
        },
        {
          question: 'Koliko vremena treba da očekujem da posvetim svake nedelje?',
          answer: 'Trebalo bi da planirate otprilike 5-7 sati nedeljno, uključujući dvočasovnu sesiju uživo, čitanje i praktične zadatke. Što se više bavite materijalom, više ćete imati koristi od programa.',
        },
        {
          question: 'Šta ako ne mogu da prisustvujem sesijama uživo?',
          answer: 'Sve sesije uživo se snimaju i postaju dostupne u roku od 24 sata. Iako podsticemo prisustvo uživo radi interaktivnog iskustva, mnogi studenti uspešno završavaju program gledajući snimke i učestvujući u našoj onlajn zajednici.',
        },
        {
          question: 'Da li je sertifikacija međunarodno priznata?',
          answer: 'Da, naša sertifikacija je priznata od strane Međunarodne asocijacije za Feng Shui i poštovana u industriji. Diplomci su nastavili da osnivaju uspešne prakse širom sveta.',
        },
        {
          question: 'Kakva podrška je dostupna nakon što završim program?',
          answer: 'Diplomci dobijaju doživotni pristup materijalima kursa i našoj alumni zajednici. Takođe nudimo napredne kurseve i mogućnosti profesionalnog razvoja za kontinuirani rast.',
        },
        {
          question: 'Mogu li primeniti učenja ako živim u stanu ili iznajmljenom prostoru?',
          answer: 'Apsolutno! Pokrivamo prilagođavanja za sve životne situacije, uključujući iznajmljene i male prostore. Feng Shui principi se mogu primeniti uz poštujuća, privremena podešavanja koja ne zahtevaju strukturne promene.',
        },
      ],
    },
    testimonials: {
      eyebrow: 'Iskustva',
      title: 'Priče o uspehu studenata',
      subtitle: 'Čujte od diplomaca koji su transformisali svoje prostore i živote kroz naš program.',
      items: [
        {
          quote: 'Pre škole sam mislila da Feng Shui znači staviti bambus u ugao. Četiri meseca kasnije, imam potpuno novo razumevanje prostora. Promenila sam karijeru — sada radim Feng Shui konsultacije i već imam 12 stalnih klijenata.',
          author: 'Jelena M.',
          location: 'Beograd',
        },
        {
          quote: 'Upisao sam se jer je žena insistirala. Završio sam program jer sam video rezultate. Naš dom se potpuno transformisao — ali ono što me najviše iznenadilo je koliko se promenio moj fokus na poslu. Kancelariju sam uredio prema principima iz škole.',
          author: 'Milan D.',
          location: 'Novi Sad',
        },
        {
          quote: 'Kao dizajnerka enterijera sa 15 godina iskustva, mislila sam da znam sve o prostoru. Draganina škola mi je otvorila potpuno novu dimenziju. Sada kombinijem dizajn sa Feng Shui principima i klijenti osećaju razliku — čak i oni koji su skeptični.',
          author: 'Svetlana K.',
          location: 'Ljubljana',
        },
      ],
    },
    cta: {
      title: 'Započnite svoje Feng Shui putovanje danas',
      subtitle: 'Prostori imaju moć da transformišu naše živote. Pridružite nam se da otkrijete kako možete stvoriti okruženje koje podržava vaše najdublje namere i najviši potencijal.',
      primaryButton: { text: 'Raspitajte se', link: '/upitnik' },
      secondaryButton: { text: 'Kontaktirajte nas', link: '/upitnik' },
      primaryMicrocopy: '',
    },
  },

  vaza: {
    hero: {
      eyebrow: 'Vaza Izobilja',
      title: 'Simbol namere koji tiho menja sve oko sebe',
      subtitle: 'Vaza Izobilja je drevni Feng Shui ritual — ručno izrađen, personalizovan i ispunjen vašim namerama za prosperitet, mir i novi tok.',
      buttonText: 'Naručite vazu',
      buttonLink: '/upitnik',
      primaryMicrocopy: 'Personalizovana. Ručno izrađena.',
      image: 'https://picsum.photos/seed/vaza-hero-abundance/800/960',
      imageAlt: 'Vaza izobilja sa cvećem',
    },
    introduction: {
      eyebrow: 'O vazi',
      title: 'Šta je Vaza Izobilja?',
      subtitle: 'Moćan Feng Shui alat sa dubokim istorijskim korenima, sada dostupan u modernoj adaptaciji.',
      paragraphs: [
        'Vaza Izobilja nije ukrašena posuda na polici. To je drevni Feng Shui ritual — lični energetski sidro koji tiho radi u pozadini vašeg života. Svaka vaza je ručno izrađena prema vašem datumu rođenja i ispunjena simbolima koji odražavaju vaše namere za prosperitet, mir i rast.',
        'Ritual kreiranja vaze je jednako važan kao sama vaza. Kada jasno zapišete šta želite, kada to stavite u fizički oblik i postavite na pravo mesto u domu — postavljate temelje za promenu. Vaza postaje podsetnik, fokusna tačka i tihi saveznik na vašem putu.',
      ],
      benefits: [
        'Privucite prosperitet',
        'Unapredite blagostanje',
        'Pojačajte prilike',
        'Savršen poklon za useljenje',
      ],
      image: 'https://picsum.photos/seed/vaza-beautiful-flowers/800/600',
      imageAlt: 'Predivna vaza sa cvećem',
    },
    howItWorks: {
      eyebrow: 'Kako funkcioniše',
      title: 'Kako Vaza Izobilja funkcioniše',
      subtitle: 'Moćan energetski alat koji kombinuje drevnu mudrost sa modernom primenom.',
      scienceTitle: 'Kako vaza zapravo funkcioniše',
      introParagraph: 'Svaka Vaza Izobilja funkcioniše kao fizički sidro za vaše namere. U Feng Shui filozofiji, predmeti koji nose jasnu nameru privlače odgovarajuće prilike. Vaza kombinuje pažljivo odabrane elemente — svaki sa specifičnom svrhom:',
      symbols: [
        {
          title: 'Poludragog kamenje',
          description: 'Kristali i dragulji koji odgovaraju bogatstvu, jasnoći i zaštiti.',
        },
        {
          title: 'Organski elementi',
          description: 'Semenke, pirinač i bilje koji simbolizuju rast, ishranu i plodnost.',
        },
        {
          title: 'Metalni simboli',
          description: 'Novčići i metalni elementi koji predstavljaju materijalno bogatstvo i snagu.',
        },
        {
          title: 'Lične namere',
          description: 'Prostor za vaše zapisane namere, snove i ciljeve.',
        },
      ],
      closingParagraph: 'Rezultat je predmet koji vas svakodnevno podseća na ono što gradite — i koji kroz energetski princip fokusa privlači prilike usklađene sa vašim namerama.',
      image: 'https://picsum.photos/seed/vaza-feng-shui-symbols/800/600',
      imageAlt: 'Feng Shui simboli',
    },
    products: {
      eyebrow: 'Kolekcija',
      title: 'Naša kolekcija Vaza Izobilja',
      subtitle: 'Svaka vaza je ručno izrađena i ritualno pripremljena prema tradicionalnim praksama.',
      items: [
        {
          title: 'Klasično izobilje',
          description: 'Naša prepoznatljiva vaza za one koji žele da započnu ritual izobilja — jednostavno, moćno i personalizovano.',
          features: [
            'Ručno izrađena keramička vaza',
            'Tradicionalni simboli izobilja',
            'Poludrago kamenje',
            'Ceremonija blagoslova',
            'Uputstva za postavljanje',
            '90-dnevni vodič za ritual prosperiteta',
          ],
          image: 'https://picsum.photos/seed/vaza-classic-abundance/800/600',
          imageAlt: 'Klasično izobilje',
          highlighted: false,
          buttonText: 'Kontaktirajte nas',
          buttonLink: '/upitnik',
        },
        {
          title: 'Premium prosperitet',
          description: 'Za one koji žele dublje uroniti u ritual — premium kristali, proširena ceremonija i lična konsultacija sa Draganom.',
          features: [
            'Zanatska porcelanska vaza',
            'Premium kristali i kamenje',
            'Pozlaćeni simboli',
            'Personalizovano postavljanje namera',
            'Proširena ceremonija blagoslova',
            'Sveobuhvatan 6-mesečni vodič za rituale',
            '30-minutna konsultacija',
          ],
          image: 'https://picsum.photos/seed/vaza-premium-prosperity/800/600',
          imageAlt: 'Premium prosperitet',
          highlighted: true,
          buttonText: 'Kontaktirajte nas',
          buttonLink: '/upitnik',
        },
        {
          title: 'Poslovno izobilje',
          description: 'Posebno kreirana za preduzetnice i poslovne prostore — sa simbolima uspeha, fokusa i profesionalnog rasta.',
          features: [
            'Sud profesionalnog kvaliteta',
            'Simboli specifični za poslovanje',
            'Specijalizovano postavljanje namera',
            'Feng Shui procena poslovanja',
            'Konsultacija o postavljanju',
            'Kvartalni vodič za obnavljanje',
            '60-minutna konsultacija o poslovnom prosperitetu',
          ],
          image: 'https://picsum.photos/seed/vaza-business-abundance/800/600',
          imageAlt: 'Poslovno izobilje',
          highlighted: false,
          buttonText: 'Kontaktirajte nas',
          buttonLink: '/upitnik',
        },
      ],
    },
    labels: {
      popularBadge: 'Najpopularniji',
      includesLabel: 'Uključuje:',
    },
    testimonials: {
      eyebrow: 'Iskustva',
      title: 'Priče o izobilju',
      subtitle: 'Stvarna iskustva onih koji su poželeli dobrodošlicu Vazi Izobilja u svoje živote.',
      items: [
        {
          quote: 'Postavio sam Vazu Izobilja u kancelariju pre 6 meseci. Ne znam da li je energija ili fokus koji mi daje ritual sa vazom — ali tri meseca nakon toga dobio sam unapređenje koje sam čekao dve godine. Možda slučajnost, ali ritual me podseća na moje ciljeve svaki dan.',
          author: 'Marko J.',
          location: 'Beograd',
        },
        {
          quote: 'Kupila sam Poslovnu vazu za novu kancelariju. Svako jutro provodim minut sa njom, ponavljajući namere za taj dan. Za tri meseca, atmosfera u timu se potpuno promenila — manje tenzije, više saradnje. Klijenti to osećaju čim uđu.',
          author: 'Ana P.',
          location: 'Zagreb',
        },
        {
          quote: 'Vazu sam naručio nakon teškog perioda u životu. Ritual aktivacije me naterao da prvi put jasno zapišem šta zaista želim. To samo po sebi je bilo transformativno. Šest meseci kasnije, tri od pet stvari sa liste su se ostvarile.',
          author: 'Nikola M.',
          location: 'Novi Sad',
        },
      ],
    },
    howToUse: {
      eyebrow: 'Uputstvo',
      title: 'Kako koristiti vašu Vazu Izobilja',
      subtitle: 'Jednostavni koraci za aktiviranje i održavanje vaše vaze izobilja.',
      steps: [
        {
          number: '1',
          title: 'Izaberite savršenu lokaciju',
          description: 'Postavite vazu u ugao bogatstva vašeg doma (obično krajnji levi ugao od ulaza) ili u vaš kućni kabinet.',
        },
        {
          number: '2',
          title: 'Ritual aktivacije',
          description: 'Pratite naš vođeni ritual za aktivaciju vaše vaze, uključujući postavljanje jasnih namera za prosperitet koji želite da privučete.',
        },
        {
          number: '3',
          title: 'Redovna povezanost',
          description: 'Provedite nekoliko trenutaka sa svojom vazom nedeljno, izražavajući zahvalnost za izobilje koje već postoji u vašem životu i osnažujući svoje namere.',
        },
        {
          number: '4',
          title: 'Sezonska obnova',
          description: 'Svaka tri meseca, osvežite određene elemente vaše vaze koristeći naš sezonski vodič za održavanje njene snažne energije.',
        },
      ],
      bottomText: 'Svaka Vaza Izobilja dolazi sa detaljnim uputstvima za postavljanje, aktivaciju i održavanje kako biste ostvarili maksimalnu korist od ovog moćnog alata.',
      buttonText: 'Naručite svoju Vazu Izobilja',
      buttonLink: '/upitnik',
      images: [
        { url: 'https://picsum.photos/seed/vaza-meditation-space/400/300', alt: 'Vaza izobilja uputstvo 1' },
        { url: 'https://picsum.photos/seed/vaza-person-meditating/400/300', alt: 'Vaza izobilja uputstvo 2' },
        { url: 'https://picsum.photos/seed/vaza-room-plants-corner/400/300', alt: 'Vaza izobilja uputstvo 3' },
        { url: 'https://picsum.photos/seed/vaza-home-office-space/400/300', alt: 'Vaza izobilja uputstvo 4' },
      ],
    },
    faq: {
      eyebrow: 'Česta pitanja',
      title: 'Često postavljana pitanja',
      subtitle: 'Najčešća pitanja o Vazi Izobilja.',
      items: [
        {
          question: 'Koliko vremena je potrebno da se vide rezultati?',
          answer: 'Mnogi korisnici prijavljuju suptilne promene u energiji i prilikama unutar prvih 21 dan, sa značajnijim manifestacijama u roku od 90 dana. Međutim, rezultati variraju u zavisnosti od jasnoće vaše namere, energetske usklađenosti i akcija preduzetih kada se prilike ukažu.',
        },
        {
          question: 'Da li moram da razumem Feng Shui da bih koristio/la vazu?',
          answer: 'Nije potrebno prethodno znanje. Svaka vaza dolazi sa jednostavnim, jasnim uputstvima za optimalno postavljanje i korišćenje. Principi su integrisani u dizajn i pripremu same vaze.',
        },
        {
          question: 'Mogu li sam/a da napravim Vazu Izobilja?',
          answer: 'Iako je moguće napraviti sopstvenu vazu izobilja, naša Vaza Izobilja sadrži specifične elemente koji su pažljivo nabavljeni i ritualno pripremljeni. Svaka vaza prolazi ceremoniju blagoslova i sadrži simbole i elemente zasnovane na tradicionalnim Feng Shui principima.',
        },
        {
          question: 'Da li će vaza odgovarati mom enterijeru?',
          answer: 'Vaze su dizajnirane sa elegantnom, vanvremenskom estetikom koja se uklapa u većinu stilova enterijera. Nudimo nekoliko dizajnerskih opcija, od tradicionalnih do savremenih, kako bismo osigurali da vaša Vaza Izobilja unapredi vaš prostor vizuelno kao i energetski.',
        },
        {
          question: 'Kako da održavam svoju Vazu Izobilja?',
          answer: 'Vaša vaza dolazi sa detaljnim uputstvima za negu. Generalno, treba je održavati čistom, tretirati sa poštovanjem, a određene elemente treba sezonski osvežavati. Obezbeđujemo kompletni vodič za održavanje uz vašu kupovinu.',
        },
        {
          question: 'Mogu li da naručim prilagođenu Vazu Izobilja?',
          answer: 'Da, nudimo prilagođavanje za specifične namere ili estetske preferencije. Kontaktirajte nas putem obrasca za upit za personalizovane opcije i cene.',
        },
      ],
    },
    cta: {
      title: 'Pozovite izobilje u svoj život',
      subtitle: 'Vaša Vaza Izobilja je više od predivnog predmeta — to je transformativni alat koji otvara puteve ka prosperitetu u svim njegovim oblicima.',
      primaryButton: { text: 'Naručite vazu', link: '/upitnik' },
      secondaryButton: { text: 'Kontaktirajte nas', link: '/upitnik' },
      primaryMicrocopy: '',
    },
  },

  gallery: {
    hero: {
      eyebrow: 'Galerija',
      title: 'Galerija transformacija',
      subtitle: 'Pogledajte kako Feng Shui principi transformišu prostore — od domova do poslovnih objekata — donoseći harmoniju, ravnotežu i novi tok energije.',
    },
    categories: ['Sve', 'Domovi', 'Poslovni prostori', 'Pre i posle'],
    items: [
      { id: 'g1', title: 'Harmoničan dnevni boravak', description: 'Kompletna reorganizacija prostora za optimalan protok energije.', location: 'Beograd, Srbija', category: 'Domovi', imageUrl: 'https://picsum.photos/seed/gallery-living-room/800/600', span: 'wide' },
      { id: 'g2', title: 'Mirna spavaća soba', description: 'Transformacija spavaće sobe u oazu mira i odmora.', location: 'Novi Sad, Srbija', category: 'Domovi', imageUrl: 'https://picsum.photos/seed/gallery-bedroom/600/800', span: 'tall' },
      { id: 'g3', title: 'Moderna kancelarija', description: 'Feng Shui principi primenjeni na savremeni poslovni prostor.', location: 'Beograd, Srbija', category: 'Poslovni prostori', imageUrl: 'https://picsum.photos/seed/gallery-office/800/600' },
      { id: 'g4', title: 'Zen kuhinja', description: 'Kuhinja dizajnirana za ravnotežu elemenata i funkcionalnost.', location: 'Niš, Srbija', category: 'Domovi', imageUrl: 'https://picsum.photos/seed/gallery-kitchen/800/600' },
      { id: 'g5', title: 'Recepcija wellness centra', description: 'Prostor koji odmah dočarava mir i profesionalnost.', location: 'Zagreb, Hrvatska', category: 'Poslovni prostori', imageUrl: 'https://picsum.photos/seed/gallery-wellness/800/600', span: 'wide' },
      { id: 'g6', title: 'Dečja soba u ravnoteži', description: 'Kreativni i mirni prostor prilagođen energiji deteta.', location: 'Beograd, Srbija', category: 'Domovi', imageUrl: 'https://picsum.photos/seed/gallery-kids-room/600/800' },
      { id: 'g7', title: 'Pre i posle: Stan na Vračaru', description: 'Kompletna transformacija stana od 65m2 primenom Feng Shui principa.', location: 'Beograd, Srbija', category: 'Pre i posle', imageUrl: 'https://picsum.photos/seed/gallery-before-after/800/600', span: 'tall' },
      { id: 'g8', title: 'Restoran sa protokom', description: 'Raspored stolova i dekor koji podstiče pozitivnu energiju gostiju.', location: 'Novi Sad, Srbija', category: 'Poslovni prostori', imageUrl: 'https://picsum.photos/seed/gallery-restaurant/800/600' },
    ],
    transformations: [
      { beforeImage: 'https://picsum.photos/seed/transform1-before/800/600', afterImage: 'https://picsum.photos/seed/transform1-after/800/600', clientName: 'Jelena i Marko S.', location: 'Beograd, Srbija', service: 'Konsultacije za dom', quote: 'Nismo mogli da verujemo koliko se promenila atmosfera u našem domu. Deca su mirnija, mi smo srećniji, a prostor jednostavno diše.' },
      { beforeImage: 'https://picsum.photos/seed/transform2-before/800/600', afterImage: 'https://picsum.photos/seed/transform2-after/800/600', clientName: 'Ana P.', location: 'Zagreb, Hrvatska', service: 'Poslovni Feng Shui', quote: 'Moja kancelarija je bila haotična i stresna. Posle konsultacija, zaposleni su produktivniji a klijenti se osećaju dobrodošlo čim uđu.' },
      { beforeImage: 'https://picsum.photos/seed/transform3-before/800/600', afterImage: 'https://picsum.photos/seed/transform3-after/800/600', clientName: 'Nikola D.', location: 'Novi Sad, Srbija', service: 'Konsultacije za dom', quote: 'Posle razvoda, želeo sam novi početak. Feng Shui transformacija mog stana mi je pomogla da krenem napred sa pozitivnom energijom.' },
    ],
    cta: {
      title: 'Transformišite i vaš prostor',
      subtitle: 'Svaki prostor krije potencijal za harmoniju i ravnotežu. Dozvolite nam da otkrijemo potencijal vašeg doma ili poslovnog prostora.',
      primaryButton: { text: 'Popunite upitnik', link: '/upitnik' },
    },
  },

  global: {
    siteConfig: {
      siteName: 'Dragana Jović',
      phone: '+381 63 380 098',
      email: 'ptplan.rs@gmail.com',
      whatsapp: '38163380098',
      address: 'Beograd, Srbija',
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
      },
    },
    navigation: [
      { to: '/school', label: 'Škola' },
      { to: '/about', label: 'O meni' },
      { to: '/upitnik', label: 'Kontakt' },
    ],
    header: {
      loginButton: 'Prijava',
      myCoursesLabel: 'Moji kursevi',
      adminPanelLabel: 'Admin panel',
      logoutLabel: 'Odjava',
    },
    footer: {
      socialProofText: 'Preko 1000 uspešnih transformacija prostora, 25+ godina iskustva, 180+ održanih radionica',
      tagline: 'Harmonizacija domova, srca i energije kroz bezvremenu mudrost Feng Shui. Pratite nas za nedeljne savete o protoku energije, ritualima i usklađenom životu.',
      exploreHeading: 'Istražite',
      exploreLinks: [
        { to: '/school', label: 'Feng Shui Škola' },
        { to: '/vaza-izobilja', label: 'Vaza Izobilja' },
        { to: '/about', label: 'O meni' },
        { to: '/upitnik', label: 'Kontakt' },
      ],
      connectHeading: 'Povežimo se',
      whatsappLinkText: 'WhatsApp za brz odgovor',
      consultationButtonText: 'Zakažite Konsultaciju',
      consultationButtonLink: '/upitnik',
      copyrightText: '© 2025 Dragana Jović. Dizajnirano sa balansom.',
    },
  },

  guide: {
    hero: {
      eyebrow: 'Besplatni vodič',
      title: 'Dobrodošli u svoj novi pogled na dom',
      subtitle: 'Ovaj vodič nije običan PDF. To je interaktivno putovanje kroz 7 poglavlja koja će vam pomoći da razumete kako vaš dom utiče na vas — i šta možete da uradite povodom toga. Uključuje video sadržaj, kviz, praktične zadatke i refleksije.',
    },
    chapters: [
      {
        id: 'poglavlje-1',
        number: 1,
        title: 'Zašto vaš dom utiče na vas više nego što mislite',
        content: [
          'Vaš dom nije samo mesto gde spavate. To je prostor koji oblikuje vaše misli, emocije, odluke i energiju — svaki dan, bez izuzetka.',
          'U Feng Shui, dom se posmatra kao živi organizam. Svaka prostorija, svaki ugao, svaki predmet nosi određenu energiju — i ta energija utiče na vas, čak i kada toga niste svesni.',
          'Možda ste primetili da se u nekim prostorima osećate mirno i fokusirano, dok vas drugi čine nervoznim ili umornim. To nije slučajnost — to je energija prostora.',
        ],
        bullets: [
          'Raspored nameštaja utiče na protok energije (Chi) kroz vaš dom',
          'Boje u prostoru direktno utiču na vaše raspoloženje i produktivnost',
          'Nered stvara mentalnu težinu i smanjuje jasnoću uma',
          'Osvetljenje menja kako se osećate — i koliko energije imate',
          'Predmeti iz prošlosti nose energiju koja vas može držati u mestu',
        ],
        reflectionQuestions: [
          'Kako se osećate kada uđete u svoj dom nakon dugog dana?',
          'Da li postoji prostorija u kojoj se osećate bolje nego u drugima?',
          'Kada ste poslednji put svesno promenili nešto u svom prostoru?',
        ],
      },
      {
        id: 'poglavlje-2',
        number: 2,
        title: 'Interaktivni test: Kakva je energija vašeg doma?',
        content: [
          'Pre nego što krenemo dalje, hajde da napravimo brzu dijagnostiku vašeg prostora. Ovaj test od 10 pitanja pomoći će vam da razumete gde se nalazi vaš dom na skali energetske ravnoteže.',
          'Odgovarajte iskreno — nema pogrešnih odgovora. Cilj je da dobijete jasnu sliku trenutnog stanja.',
        ],
      },
      {
        id: 'poglavlje-3',
        number: 3,
        title: 'Mini mapa prostora',
        content: [
          'Sada kada znate kakva je energija vašeg doma, vreme je da napravite svoju prvu mapu prostora. Ovo je pojednostavljena verzija onoga što radimo sa klijentima — ali čak i ovaj osnovni korak može otkriti mnogo.',
        ],
        steps: [
          {
            title: 'Nacrtajte osnovu svog doma',
            description: 'Uzmite papir i olovku. Nacrtajte približan oblik svog stana ili kuće, sa svim prostorijama. Ne mora biti savršeno — bitno je da imate vizuelni pregled.',
          },
          {
            title: 'Označite ulazna vrata i prozore',
            description: 'Obeležite gde su glavni ulaz, prozori i prolazi između prostorija. Ovo su ključne tačke kroz koje energija ulazi i cirkuliše.',
          },
          {
            title: 'Zapišite kako se osećate u svakoj prostoriji',
            description: 'Za svaku prostoriju napišite jednu reč koja opisuje kako se osećate u njoj: mirno, napeto, prazno, toplo, hladno, haotično. Ovo je vaša emotivna mapa prostora.',
          },
        ],
      },
      {
        id: 'poglavlje-4',
        number: 4,
        title: 'Priprema prostora za harmonizaciju',
        content: [
          'Pre bilo kakve dublje Feng Shui intervencije, prostor mora biti pripremljen. Evo 8 koraka koji čine osnovu svake harmonizacije:',
        ],
        steps: [
          {
            title: 'Očistite prostor od nepotrebnih stvari',
            description: 'Prođite kroz svaku prostoriju i uklonite sve što ne koristite, ne volite ili vas asocira na negativna iskustva. Nered je najveći blokator energije.',
          },
          {
            title: 'Popravite sve što je pokvareno',
            description: 'Slavine koje cure, sijalice koje ne rade, vrata koja škrpe — sve ovo šalje poruku stagnacije. Popravite ili zamenite.',
          },
          {
            title: 'Dubinski očistite svaku prostoriju',
            description: 'Fizička čistoća je osnova energetske čistoće. Operite prozore, usisajte iza nameštaja, obrišite sve površine.',
          },
          {
            title: 'Otvorite prozore i pustite svež vazduh',
            description: 'Provetrite svaku prostoriju najmanje 15 minuta. Svež vazduh doslovno unosi novu energiju u prostor.',
          },
          {
            title: 'Proverite osvetljenje',
            description: 'Svaka prostorija treba da ima adekvatno osvetljenje. Tamni uglovi su mesta gde energija stagnira.',
          },
          {
            title: 'Uklonite ogledala koja reflektuju nered',
            description: 'Ogledala udvostručuju energiju onoga što reflektuju. Ako ogledalo gleda u nered, ono udvostručuje haos.',
          },
          {
            title: 'Postavite biljke na strateška mesta',
            description: 'Žive biljke unose vitalnost i čiste energiju. Postavite ih u uglove koji deluju prazno ili teško.',
          },
          {
            title: 'Stvorite jasan prolaz od ulaznih vrata',
            description: 'Glavni ulaz je "usta" vašeg doma — kroz njega energija ulazi. Osigurajte da je čist, osvetljen i prohodan.',
          },
        ],
      },
      {
        id: 'poglavlje-5',
        number: 5,
        title: 'Pet najčešćih blokada energije',
        content: [
          'Kroz rad sa stotinama klijenata, identifikovali smo pet najčešćih energetskih blokada koje nalazimo u domovima. Prepoznajte li neku od njih u svom prostoru?',
        ],
        blockages: [
          {
            title: 'Pretrpani hodnik ili ulaz',
            bullets: [
              'Cipele, jakne, ključevi, kese — sve na gomili',
              'Energija ne može da uđe slobodno',
              'Osećaj pritiska čim otvorite vrata',
            ],
            quickStep: 'Oslobodite ulaz. Ostavite samo ono što koristite svakodnevno. Dodajte malu biljku ili prijatno svetlo.',
          },
          {
            title: 'Spavaća soba puna elektronike',
            bullets: [
              'TV, telefon, laptop, punjači — sve u zoni odmora',
              'Elektromagnetno polje remeti san',
              'Um ne može da se isključi',
            ],
            quickStep: 'Uklonite TV iz spavaće sobe. Telefon stavite na punjenje u drugu prostoriju. Zamenite budilnik na telefonu klasičnim.',
          },
          {
            title: 'Kuhinja kao zona haosa',
            bullets: [
              'Prljavo posuđe, pretrpane radne površine',
              'Kuhinja predstavlja ishranu i obilje',
              'Haos ovde utiče na finansije i zdravlje',
            ],
            quickStep: 'Očistite radne površine. Ostavite samo aparate koje koristite svaki dan. Dodajte činiju sa svežim voćem.',
          },
          {
            title: 'Tamni i zanemareni uglovi',
            bullets: [
              'Prostori iza vrata, ispod stepenica, u ćoškovima',
              'Energija se ovde skuplja i stagnira',
              'Često izazivaju osećaj težine ili nemira',
            ],
            quickStep: 'Dodajte svetlo (lampicu ili sveću). Postavite biljku. Očistite i oživite svaki zanemareni ugao.',
          },
          {
            title: 'Previše stvari iz prošlosti',
            bullets: [
              'Stari pokloni, fotografije bivših, nasleđeni predmeti koji vam ne znače',
              'Drže vas emotivno vezanim za prošlost',
              'Sprečavaju novi tok energije i novih mogućnosti',
            ],
            quickStep: 'Prođite kroz stvari i pitajte se: "Da li mi ovo donosi radost ili me drži u prošlosti?" Pustite ono što vas više ne služi.',
          },
        ],
      },
      {
        id: 'poglavlje-6',
        number: 6,
        title: 'Refleksija',
        content: [
          'Sada kada ste prošli kroz prvih pet poglavlja, zastanite na trenutak. Ova refleksija vam pomaže da povežete sve što ste naučili sa vašim ličnim iskustvom.',
        ],
        reflectionQuestions: [
          'Šta sam danas saznao/la o svom domu što nisam znao/la ranije?',
          'Koji deo mog prostora me najviše opterećuje — i zašto?',
          'Koji je jedan konkretan korak koji mogu da napravim već danas?',
        ],
      },
      {
        id: 'poglavlje-7',
        number: 7,
        title: 'Sledeći korak ka harmoniji',
        content: [
          'Ako ste stigli do ovde, to znači da vas ova tema ne zanima samo površno — već osećate da vaš prostor zaslužuje promenu. I vi zaslužujete prostor koji vas podržava.',
          'Naš 4-mesečni Feng Shui program je osmišljen upravo za ljude poput vas — one koji žele dublju transformaciju, ali im treba struktura, podrška i stručno vođstvo.',
        ],
        programSections: [
          {
            title: 'Kompletna energetska analiza vašeg doma',
            description: 'Detaljan pregled svakog dela vašeg prostora, sa personalizovanim preporukama za harmonizaciju.',
          },
          {
            title: 'Personalizovani plan transformacije',
            description: 'Korak-po-korak vodič napravljen posebno za vaš dom, vaš raspored i vaše ciljeve.',
          },
          {
            title: 'Nedeljne konsultacije sa Feng Shui stručnjakom',
            description: 'Direktan pristup ekspertu koji vas vodi kroz svaku fazu procesa.',
          },
          {
            title: 'Video lekcije i praktični zadaci',
            description: 'Strukturirani materijali koje možete pratiti sopstvenim tempom.',
          },
          {
            title: 'Zajednica istomišljenika',
            description: 'Pridružite se grupi ljudi koji prolaze isti put — podrška, inspiracija i zajednički rast.',
          },
          {
            title: 'Certifikat o završenom programu',
            description: 'Dokaz vaše posvećenosti harmonizaciji prostora i ličnom razvoju.',
          },
        ],
        programBenefits: [
          'Pristup svim video lekcijama (40+ sati sadržaja)',
          'Lični Feng Shui plan za vaš dom',
          'Mesečne grupne konsultacije',
          'Pristup zatvorenoj grupi za podršku',
          'Bonus: Vodič za sezonsku harmonizaciju',
          'Bonus: Meditacije za čišćenje prostora',
        ],
        joinIfItems: [
          'Osećate da vaš dom ne reflektuje ko ste danas',
          'Želite da stvorite prostor koji vas podržava, a ne iscrpljuje',
          'Spremni ste za promenu, ali vam treba struktura i vođstvo',
          'Verujete da prostor utiče na sve aspekte života',
          'Želite da naučite veštinu koju ćete koristiti ceo život',
        ],
      },
    ],
    quiz: {
      questions: [
        { id: 1, text: 'Da li postoji prostorija ili deo doma koji izbegavate ili u koji ulazite samo kad morate?' },
        { id: 2, text: 'Da li se nered u vašem domu vraća vrlo brzo, čak i kada ga sredite?' },
        { id: 3, text: 'Da li često osećate umor, težinu ili nedostatak fokusa kada boravite kod kuće?' },
        { id: 4, text: 'Da li postoje predmeti koje godinama držite, ali vam ne koriste i nemate emotivnu vezu s njima?' },
        { id: 5, text: 'Da li postoji ugao, fioka ili polica u koju ne volite ni da pogledate?' },
        { id: 6, text: 'Da li je osvetljenje u vašem domu neravnomerno?' },
        { id: 7, text: 'Da li vam ponekad deluje da vam dan "nestane", a da ne znate gde je otišla energija?' },
        { id: 8, text: 'Da li imate biljke koje venu, bore se ili nikada ne izgledaju zdravo?' },
        { id: 9, text: 'Da li imate delove doma koji su pretrpani tehnologijom, kablovima ili starim uređajima?' },
        { id: 10, text: 'Da li vam je teško da spavate, fokusirate se ili donesete odluke dok ste kod kuće?' },
      ],
      results: [
        {
          range: [0, 3],
          title: 'Neravnoteža elemenata',
          type: 'Tip 1',
          description: 'Vaš dom nije "loš", ali mu nedostaje harmonija. Možda postoji: premalo prirodnih elemenata, previše jednoličnih boja, nedovoljno toplih boja ili svetlosti, osećaj praznine u nekim delovima. Ovo je znak da su vam potrebne male, ciljane promene da bi energija postala podržavajuća.',
        },
        {
          range: [4, 7],
          title: 'Zagušen prostor (blokirana energija)',
          type: 'Tip 2',
          description: 'Ovo je dom u kojem energija ne teče slobodno. Najverovatnije postoje: pretrpani delovi, skriveni "džepovi nereda", stvari koje ne koristite, previše predmeta koji nose energiju prošlosti. Takav prostor utiče na vašu motivaciju, raspoloženje i fokus.',
        },
        {
          range: [8, 10],
          title: 'Slab protok Chi-ja',
          type: 'Tip 3',
          description: 'Ovo je dom u kojem energija stagnira. U Feng Shui ovo je najjasniji pokazatelj: emocionalne blokade, nedostatak jasnoće, osećaj težine, problemi sa fokusom, umor koji ne nestaje odmorom.',
        },
      ],
      footerText: 'Poenta ovog testa nije da vam kaže da je vaš dom "loš" — već da vam pokaže gde postoji prostor za poboljšanje. Svaki dom ima potencijal za harmoniju.',
    },
    emailGate: {
      title: 'Otključajte kompletan vodič',
      subtitle: 'Unesite vaše ime i email da pristupite svim poglavljima, interaktivnom testu i bonus video sadržaju.',
      buttonText: 'Otključajte vodič',
    },
    cta: {
      title: 'Pridružite se našem 4-mesečnom Feng Shui programu',
      buttonText: 'Popunite upitnik',
      buttonLink: '/upitnik',
    },
  },
};
