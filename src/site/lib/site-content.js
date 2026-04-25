const sharedFounderLine =
  "Renvoo is being built by Mohamed Ibrahim, former Electrical Subteam Lead for Team Polar at TU/e and part of the NVIDIA 6G Developer Program.";

const sharedPricingLine =
  "Preliminary pilot pricing starts at EUR 2.49 per appointment, plus a fixed fee depending on the clinic. Final pricing is still being shaped with pilot partners.";

const sharedDownloads = [
  {
    title: "Clinic one-pager",
    description: "Compact leave-behind for operators after a short intro or follow-up email.",
    href: "downloads/renvoo-clinic-one-pager.pptx",
    label: "Download the one-pager",
  },
];

export const siteContent = {
  nl: {
    htmlLang: "nl",
    locale: "nl-NL",
    languageLabel: "Nederlands",
    switchLabel: "EN",
    brandLine: "Operationele SaaS voor rustigere agenda's",
    nav: {
      home: "Start",
      product: "Product",
      pilot: "Pilot",
      trust: "Vertrouwen",
      blogIndex: "Blog",
      cta: "Plan gesprek",
    },
    footer: {
      summary:
        "Renvoo is een vroege B2B clinic SaaS voor Nederlandse tandartspraktijken die no-shows, late uitval en leeg stoeluur rustiger wil opvangen.",
      quickLinksTitle: "Funnel",
      legalTitle: "Juridisch",
      languageTitle: "Taal",
      legalLinks: [
        { page: "privacy", label: "Privacyverklaring website" },
        { page: "patientNotice", label: "Notitie patiëntbericht" },
      ],
      languageLinks: [{ lang: "en", page: "home", label: "English" }],
      proofNote: "Gebouwd rond pilot-proof, niet rond opgeblazen claims.",
    },
    pageNames: {
      home: "Start",
      product: "Product",
      pilot: "Pilot",
      trust: "Vertrouwen",
      blogIndex: "Blog",
      privacy: "Privacy",
      patientNotice: "Patiëntbericht",
      notFound: "Niet gevonden",
    },
    blog: {
      eyebrow: "Blog",
      title: "Praktische inzichten voor rustigere agenda's",
      intro:
        "Korte, eerlijke artikelen voor praktijkhouders en praktijkmanagers over no-shows, late afzeggingen, herinneringen en herstel van lege stoeluren.",
      emptyLabel: "Er staan nog geen gepubliceerde artikelen klaar.",
      readMore: "Lees artikel",
      backToBlog: "Terug naar blog",
      sourcesTitle: "Bronnen",
      relatedTitle: "Verder lezen",
      ctaTitle: "Wilt u dit vertalen naar uw eigen praktijk?",
      ctaBody:
        "De beste volgende stap is nog steeds een kort validatiegesprek over uw huidige no-show-, bevestigings- en herstelworkflow.",
      ctaPrimary: "Plan het gesprek",
    },
    pages: {
      home: {
        seo: {
          title: "Renvoo | Minder no-shows. Meer grip op de agenda.",
          description:
            "Renvoo helpt Nederlandse tandartspraktijken no-shows eerder signaleren, late uitval rustiger opvangen en verloren afspraken beter herstellen zonder extra front-desk werk.",
        },
        hero: {
          eyebrow: "Voor Nederlandse tandartspraktijken",
          title: "Minder no-shows. Meer grip op de agenda.",
          body:
            "Renvoo helpt tandartspraktijken no-shows eerder signaleren, late uitval rustiger opvangen en verloren afspraken sneller herstellen zonder extra front-desk werk.",
          primaryCta: "Vraag een validatiegesprek aan",
          secondaryCta: "Bekijk hoe het werkt",
          badges: [],
          operatorCard: {
            title: "Waar operators direct last van hebben",
            items: [
              "Boekingen lijken gevuld, maar stoeltijd blijft kwetsbaar.",
              "Late afzeggingen geven te weinig tijd om slim te herstellen.",
              "Front-desk teams vangen de onzekerheid handmatig op.",
            ],
          },
        },
        pains: {
          eyebrow: "Het echte probleem",
          title: "De schade zit niet alleen in de no-show.",
          intro:
            "Het verlies ontstaat in de combinatie van lege stoeluren, te late signalen en extra herstelwerk rond bevestigen, verplaatsen en opvullen.",
          items: [
            {
              title: "Lege stoeluren raken direct de omzet",
              body: "Een geplande afspraak levert pas iets op als de patiënt ook echt verschijnt.",
            },
            {
              title: "Late uitval is vaak netjes gemeld, maar nog steeds duur",
              body: "Zelfs een keurige afmelding kan te laat komen om de stoel nog te redden.",
            },
            {
              title: "Herstelwerk groeit rond onzekerheid",
              body: "Bevestigen, nabellen, schuiven en terugvullen belanden als extra werk bij het team.",
            },
          ],
        },
        workflowTeaser: {
          eyebrow: "Hoe Renvoo denkt",
          title: "Van losse reminders naar planningszekerheid",
          intro:
            "De pilot is ontworpen als operationele workflowlaag. Eerst zien waar risico zit, daarna gerichter bevestigen of verplaatsen en pas dan herstellen.",
          steps: [
            {
              label: "Connect",
              body: "Start met plannings- en communicatiedata, niet met klinische inhoud.",
            },
            {
              label: "Detect",
              body: "Maak risicovolle afspraken eerder zichtbaar dan de standaard reminderflow doet.",
            },
            {
              label: "Confirm",
              body: "Geef het team een duidelijker moment om te bevestigen of te verplaatsen.",
            },
            {
              label: "Replace",
              body: "Help verloren capaciteit sneller terug te winnen terwijl de praktijk de controle houdt.",
            },
          ],
        },
        proof: {
          eyebrow: "Waarom dit geloofwaardig voelt",
          title: "Gebouwd om met praktijken te valideren, niet om alvast te overbeloven.",
          cards: [
            {
              title: "Bewijspositie",
              body: "De huidige case rust op duidelijke operationele logica en scenario-denken. De pilot is er juist om echte reductie, herstel en tijdswinst te bewijzen.",
            },
            {
              title: "Datagrens",
              body: "Renvoo is bewust gepositioneerd rond administratieve planning- en communicatiegegevens, niet rond diagnoses, notities of behandelbeslissingen.",
            },
          ],
        },
        paths: {
          eyebrow: "Kies uw route",
          title: "Niet iedereen wil hetzelfde eerst zien.",
          items: [
            {
              title: "Eerst begrijpen wat het product doet",
              body: "Bekijk de volledige Connect → Detect → Confirm → Replace workflow.",
              page: "product",
              label: "Naar product",
            },
            {
              title: "Eerst zien hoe de pilot werkt",
              body: "Bekijk de validatie-opzet, de meetingstructuur en de planner.",
              page: "pilot",
              label: "Naar pilot",
            },
            {
              title: "Eerst vertrouwen en datagrens controleren",
              body: "Zie de controller/processor-posture, FAQ en clinic-materialen.",
              page: "trust",
              label: "Naar vertrouwen",
            },
          ],
        },
        closing: {
          eyebrow: "Volgende stap",
          title: "De volgende stap is klein en praktisch.",
          body:
            "We zoeken een kort validatiegesprek met een praktijkhouder of praktijkmanager om de huidige no-show- en uitvalworkflow te begrijpen.",
          primaryCta: "Plan het gesprek",
          secondaryCta: "Bekijk eerst de pilot",
        },
      },
      product: {
        seo: {
          title: "Renvoo | Productflow voor no-showpreventie",
          description:
            "Bekijk hoe Renvoo Nederlandse tandartspraktijken helpt met een operationele workflow voor signaleren, bevestigen, verplaatsen en herstellen.",
        },
        hero: {
          eyebrow: "Product",
          title: "Niet nog een reminder-tool.",
          body:
            "Renvoo is bedoeld als operationele laag rond planningsonzekerheid. Het doel is niet meer berichten sturen, maar eerder weten waar uitval dreigt en het team betere herstelmomenten geven.",
          primaryCta: "Plan een validatiegesprek",
          secondaryCta: "Bekijk vertrouwen & data",
        },
        comparison: {
          eyebrow: "Voor en na",
          title: "Wat verandert er operationeel",
          beforeTitle: "Zonder Renvoo",
          afterTitle: "Met Renvoo",
          before: [
            "Iedere afspraak krijgt ongeveer dezelfde reminderflow.",
            "Risico wordt vaak pas duidelijk als de stoel al kwetsbaar is.",
            "Front-desk teams reageren handmatig op gaten en no-response.",
            "Terugvullen gebeurt via losse lijsten, geheugen en tijdsdruk.",
          ],
          after: [
            "Het team ziet eerder welke afspraken extra aandacht nodig hebben.",
            "Bevestigen en verplaatsen kan gerichter gebeuren, niet alleen generiek.",
            "Herstelwerk wordt onderdeel van een duidelijke workflow in plaats van losse brandjes.",
            "De praktijk houdt controle over agenda-mutaties en patiëntcontactmomenten.",
          ],
        },
        workflow: {
          eyebrow: "De vier stappen",
          title: "Connect. Detect. Confirm. Replace.",
          intro:
            "De architectuur is bewust klein gehouden voor de eerste pilots: laagdrempelige intake, heldere teamzichtbaarheid en geen patiëntplatform in v1.",
          steps: [
            {
              title: "Connect",
              body: "CSV-first of read-only onboarding rond agenda-, afspraak- en communicatievelden die operationeel genoeg zijn om risico te zien.",
              bullets: [
                "Focus op scheduling en statusvelden",
                "Geen diagnoses of klinische notities nodig",
                "Lage frictie voor een eerste pilot",
              ],
            },
            {
              title: "Detect",
              body: "Afspraken met verhoogd no-show- of late-uitvalrisico worden eerder zichtbaar dan in een standaard reminderprogramma.",
              bullets: [
                "Risico per afspraak in plaats van één generieke flow",
                "Operatorgericht, niet klinisch",
                "Gebouwd voor uitlegbaar gebruik in een praktijk",
              ],
            },
            {
              title: "Confirm",
              body: "Het team kan sneller zien waar een bevestiging, verplaatsing of extra check zinvol is voordat de stoel verloren raakt.",
              bullets: [
                "Ondersteunt praktische opvolging",
                "Past naast bestaande systemen",
                "Helpt no-response eerder adresseren",
              ],
            },
            {
              title: "Replace",
              body: "Wanneer een stoel vrijkomt, helpt de workflow de praktijk eerder denken in herstel en backfill terwijl daadwerkelijke agenda-acties onder praktijkcontrole blijven.",
              bullets: [
                "Geen autonome mutaties in v1",
                "Herstel boven theater",
                "Praktijk of EPD houdt de uiteindelijke controle",
              ],
            },
          ],
        },
        fit: {
          eyebrow: "Lage frictie als ontwerpkeuze",
          title: "Bewust eenvoudig gehouden voor de eerste kliniekpilots",
          items: [
            {
              title: "Niet-klinische datagrens",
              body: "Administratieve planning- en communicatiegegevens eerst. Dat houdt de scope smal en operationeel.",
            },
            {
              title: "CSV-first of read-only intake",
              body: "De eerste stap hoeft geen zwaar integratieproject te zijn om te zien of de pilot de moeite waard is.",
            },
            {
              title: "Geen patiëntaccounts in v1",
              body: "Patiëntinteractie blijft via praktijkgestuurde berichten en veilige links, niet via een nieuw consumentproduct.",
            },
          ],
        },
        whyDental: {
          eyebrow: "Waarom tandartspraktijken eerst",
          title: "De wedge is klein, maar scherp.",
          items: [
            "Lege stoeluren zijn direct economisch voelbaar.",
            "Agenda's zijn dicht gepland en laten weinig herstelruimte over.",
            "Praktijkhouders en praktijkmanagers voelen dit probleem zelf in de operatie.",
          ],
        },
        closing: {
          eyebrow: "Volgende stap",
          title: "Ziet dit eruit als een realistische workflow voor uw praktijk?",
          body:
            "Dan is de beste volgende stap een kort gesprek waarin we niet demo'en, maar uw huidige no-show- en uitvalproces scherp krijgen.",
          primaryCta: "Vraag het validatiegesprek aan",
          secondaryCta: "Bekijk de pilot",
        },
      },
      pilot: {
        seo: {
          title: "Renvoo | Vraag een validatiegesprek aan",
          description:
            "Vraag een kort validatiegesprek aan en deel wanneer uw tandartspraktijk het liefst wil praten over no-shows, late uitval en herstelcapaciteit.",
        },
        hero: {
          eyebrow: "Pilot",
          title: "Vraag een validatiegesprek aan",
          body:
            "Het eerste gesprek is geen zware salesdemo. Het is een korte operator-review van uw no-show-, bevestigings- en herstelworkflow om te zien of een lichte pilot logisch is.",
          primaryCta: "Start de planner",
          secondaryCta: "Bekijk eerst het product",
          chips: ["15 minuten", "Founder-led", "Google Calendar-uitnodiging na aanvraag"],
        },
        agenda: {
          eyebrow: "Wat het gesprek oplevert",
          title: "Praktisch genoeg voor een eerste ja of nee",
          items: [
            {
              title: "Workflow-scan",
              body: "We lopen kort door hoe no-shows, late uitval en herstel nu worden afgehandeld.",
            },
            {
              title: "Signalen & beperkingen",
              body: "We bespreken waar de praktijk te laat zicht krijgt en welke data of tooling er nu al beschikbaar is.",
            },
            {
              title: "Pilot-fit",
              body: "We bepalen of er genoeg operationele pijn is voor een kleine, meetbare pilot.",
            },
          ],
        },
        bookingIntro: {
          eyebrow: "Lokale planner",
          title: "Kies een voorkeursmoment en een backupmoment",
          body:
            "Deze planner werkt nu als request-flow. U kiest een eerste moment en eventueel een backupmoment, daarna staat een Google Calendar-draft klaar terwijl live routing nog ontbreekt.",
          support: [
            "Naam en zakelijke contactgegevens",
            "Korte context over praktijk en huidige workflow",
            "Gesprekstype plus een eerste en tweede tijdsoptie",
          ],
        },
        pricing: {
          eyebrow: "Prijsstelling blijft secundair",
          title: "Preliminary pilot pricing",
          body: sharedPricingLine,
          note:
            "De prijsregel is er om budgetfit te framen, niet om een zwaar commitment te forceren vóór validatie.",
        },
        plannerAside: {
          title: "Wat u na versturen ziet",
          items: [
            "Een Google Calendar-draft op basis van uw eerste voorkeur",
            "Een kopieerbare handoff voor de live routing",
            "Een schone samenvatting voor interne opvolging",
          ],
          responseExpectation:
            "Doelrespons: bevestiging op uw eerste tijdsoptie of een korte follow-up met uw backupmoment.",
        },
        fallback: {
          title: "Nog niet klaar om te boeken?",
          body:
            "Bekijk dan eerst de trust-pagina met datagrens, proof posture, materialen en juridische notities voordat u terugkomt naar de planner.",
          label: "Eerst vertrouwen bekijken",
        },
      },
      trust: {
        seo: {
          title: "Renvoo | Vertrouwen, datagrens en clinic-materialen",
          description:
            "Bekijk de trust-laag van Renvoo: proof posture, controller/processor-rolverdeling, FAQ, materialen en juridische notities voor de eerste tandartspraktijkpilots.",
        },
        hero: {
          eyebrow: "Vertrouwen",
          title: "Gebouwd om met praktijken te valideren, niet om teveel te beloven.",
          body:
            "Deze pagina is voor de kritische route: wat Renvoo wel en niet claimt, welke data wel en niet in scope zijn, en welke clinic-materialen al klaar liggen voor een echt gesprek.",
          primaryCta: "Ga naar de planner",
          secondaryCta: "Bekijk het product",
        },
        boundary: {
          eyebrow: "Datagrens & rolverdeling",
          title: "Nauw genoeg om werkbaar te blijven",
          items: [
            {
              title: "Niet-klinische scope",
              body: "Renvoo is ontworpen rond administratieve planning- en communicatiegegevens, niet rond diagnose, behandeladvies of klinische notities.",
            },
            {
              title: "Praktijk als controller",
              body: "Voor patiënt- en afspraakgegevens in de operatie blijft de praktijk controller en werkt Renvoo als processor onder instructie.",
            },
            {
              title: "Geen patiëntplatform in v1",
              body: "De eerste pilots blijven weg van patiëntaccounts, openbare marktplaatsdynamiek en onnodige consumer-features.",
            },
          ],
        },
        proof: {
          eyebrow: "Bewijspositie",
          title: "Wat vandaag eerlijk gezegd kan worden",
          items: [
            "De kerncase rust op operationele logica en scenario-math, niet op verzonnen traction.",
            "Het doel van de pilot is echte reductie, herstel en admin-tijdswinst valideren met praktijkdata.",
            "De founder-led motion is gericht op workflow-validatie, niet op een generieke self-serve funnel.",
          ],
          founderLine: sharedFounderLine,
        },
        faq: {
          eyebrow: "Veelgehoorde vragen",
          title: "De belangrijkste bezwaren zonder startup-theater",
          items: [
            {
              question: "We sturen al reminders. Wat verandert er dan?",
              answer:
                "Reminders zijn het startpunt, niet de oplossing. Renvoo richt zich op wat er gebeurt wanneer de reminder niet genoeg is: geen reactie, te late reactie en extra herstelwerk voor het team.",
            },
            {
              question: "We willen niet nog een zwaar systeem erbij.",
              answer:
                "Dat is precies waarom de huidige richting laagdrempelig is: CSV-first of read-only onboarding, geen patiëntaccounts in v1 en eerst een korte workflowvalidatie in plaats van een grote rollout.",
            },
            {
              question: "Hoe zit het met patiëntdata?",
              answer:
                "Die voorzichtigheid is terecht. Renvoo is bewust ontworpen rond niet-klinische administratieve planning- en communicatiegegevens. Het doel is operationele verbetering met smallere data-exposure.",
            },
            {
              question: "Moeten patiënten een account aanmaken?",
              answer:
                "Nee. De v1-posture is clinic SaaS, geen patiëntplatform. Patiëntinteractie loopt via praktijkgestuurde berichten en veilige links.",
            },
            {
              question: "We hebben nu geen tijd voor een grote verandering.",
              answer:
                "Het validatiegesprek is juist bedoeld om te zien of er genoeg operationele pijn is voor een kleine pilot, niet om meteen een zwaar verandertraject te starten.",
            },
            {
              question: "Hoe weten we of het echt de moeite waard is?",
              answer:
                "Dat is precies de pilotvraag. De huidige case is logisch, maar de pilot moet bewijzen of no-show-reductie, herstel en admin-tijdswinst in uw praktijk ook echt zichtbaar worden.",
            },
          ],
        },
        materials: {
          eyebrow: "Clinic-materialen",
          title: "Een scherpe one-pager is genoeg voor de eerste follow-up",
          intro:
            "Voor de website houden we het materiaal bewust smal: één clinic one-pager die probleem, workflow en pilot-posture rustig samenvat.",
          downloads: sharedDownloads,
          previews: [
            {
              src: "assets/previews/one-pager-preview.png",
              alt: "Preview van de Renvoo clinic one-pager",
              caption: "One-pager preview",
              width: 1080,
              height: 1528,
            },
          ],
        },
        legal: {
          eyebrow: "Juridische basis",
          title: "Smalle launch-posture",
          body:
            "De juridische pagina's blijven bewust eenvoudig: website privacy, patiëntberichtnotitie en verwijzingen naar de bredere legal pack voor controller/processor, DPIA-lite en contracttemplates.",
          links: [
            { page: "privacy", label: "Privacyverklaring website" },
            { page: "patientNotice", label: "Notitie patiëntbericht" },
          ],
        },
        closing: {
          eyebrow: "Volgende stap",
          title: "Als de posture klopt, plan dan het korte gesprek.",
          body:
            "De funnel is bewust simpel: eerst begrijpen, dan vertrouwen, dan pas een gesprek aanvragen. Geen theatrale claim nodig om te zien of de workflow pijn echt genoeg is.",
          primaryCta: "Plan het validatiegesprek",
          secondaryCta: "Bekijk de pilotflow",
        },
      },
      blogIndex: {
        seo: {
          title: "Renvoo | Blog over no-shows, reminders en herstelwerk",
          description:
            "Lees praktische Renvoo-artikelen over no-shows, late afzeggingen, reminder-workflows en het terugwinnen van lege stoeluren in tandartspraktijken.",
        },
        hero: {
          eyebrow: "Blog",
          title: "Praktische inzichten voor minder no-shows en rustiger herstelwerk",
          body:
            "Geen startup-theater, maar concrete uitleg over waar no-shows ontstaan, waarom reminder-only tooling vaak tekortschiet en hoe praktijken eerder kunnen herstellen.",
          primaryCta: "Plan het gesprek",
          secondaryCta: "Bekijk het product",
        },
      },
      privacy: {
        seo: {
          title: "Renvoo | Privacyverklaring website",
          description:
            "Pre-launch privacy note voor Renvoo's clinic-SaaS website, lead capture en pilot outreach flow.",
        },
        hero: {
          eyebrow: "Pre-launch note",
          title: "Privacyverklaring website",
          body:
            "Deze pagina beschrijft de smalle privacy-posture die nu is bedoeld voor Renvoo's eigen website, clinic lead capture en pilot outreach. Voor live launch moeten de definitieve `Renvoo B.V.` contactgegevens en keuzes nog worden ingevuld.",
        },
        cards: [
          {
            title: "Wat deze pagina dekt",
            body:
              "Deze note gaat over Renvoo's eigen website, lead capture en business-developmentcommunicatie. Het is geen vervanging voor de privacy notice van een kliniek richting patiënten.",
          },
          {
            title: "Huidige productposture",
            list: [
              "Renvoo wordt gelanceerd als B2B clinic SaaS voor Nederlandse private klinieken, gestart met tandartspraktijken.",
              "De site is informatief en gericht op lead capture en pilotgesprekken.",
              "De site is geen patiëntportaal en geen patiëntaccountproduct.",
            ],
          },
          {
            title: "Welke data Renvoo direct kan verzamelen",
            list: [
              "naam, praktijk en zakelijke contactgegevens die u zelf verstuurt",
              "berichten, meeting requests en notities uit pilotgesprekken",
              "basis technische en security-informatie die nodig is om de site te laten werken",
            ],
          },
          {
            title: "Cookies",
            body:
              "De beoogde launch-posture is geen niet-noodzakelijke cookies standaard. Als dat verandert, hoort daar eerst een expliciete consent-flow bij.",
          },
          {
            title: "Waarom die data wordt gebruikt",
            list: [
              "om praktijkvragen te beantwoorden",
              "om validatie- of pilotgesprekken in te plannen",
              "om de website te beveiligen en beheren",
              "om normale bedrijfsadministratie uit te voeren",
            ],
          },
          {
            title: "Implementatienotitie",
            body:
              "Vervang deze pre-launch note vóór publieke livegang door de definitieve website privacy notice uit de legal pack, met contactgegevens, bewaartermijnen en eventuele goedgekeurde vendors.",
          },
        ],
      },
      patientNotice: {
        seo: {
          title: "Renvoo | Notitie patiëntbericht",
          description:
            "Pre-launch patient message note voor praktijkgestuurde herinneringen, bevestigingen en veilige verplaatslinks in de eerste Renvoo-pilotfase.",
        },
        hero: {
          eyebrow: "Pre-launch note",
          title: "Notitie patiëntbericht",
          body:
            "Deze pagina laat de korte patiëntnotitie zien die Renvoo wil gebruiken voor praktijkgestuurde reminders, bevestigingen en veilige verplaatslinks in de eerste pilotfase.",
        },
        cards: [
          {
            title: "Korte versie",
            body:
              "Uw praktijk kan Renvoo gebruiken om afspraakbevestigingen, verplaatsingen en herstel van anders ongebruikte tijd te ondersteunen. Renvoo werkt daarbij namens de praktijk voor deze operationele berichten.",
          },
          {
            title: "Rolverdeling",
            list: [
              "uw praktijk blijft verantwoordelijk voor de zorgrelatie en uw patiëntdata",
              "Renvoo levert de operationele workflow als serviceprovider voor de praktijk",
              "vragen over uw afspraak of privacyrechten horen in eerste instantie bij uw praktijk",
            ],
          },
          {
            title: "Welke data hier bedoeld is",
            list: [
              "uw naam en contactgegevens",
              "uw afspraakmoment en afspraakstatus",
              "bericht- en responsstatus die nodig is voor planningsoperatie",
            ],
          },
          {
            title: "Wat dit niet is",
            list: [
              "geen patiëntaccount of patiëntportaal",
              "geen diagnosetool",
              "geen behandeladvies of medische dienst",
            ],
          },
          {
            title: "Implementatienotitie",
            body:
              "Vóór live pilotgebruik moeten praktijkspecifieke formuleringen, contactgegevens en goedgekeurde datacategorieën definitief worden gemaakt in de formele legal notice.",
          },
        ],
      },
      notFound: {
        seo: {
          title: "Renvoo | Pagina niet gevonden",
          description: "De gevraagde Renvoo-pagina bestaat niet of is verplaatst.",
        },
        hero: {
          eyebrow: "404",
          title: "Deze pagina bestaat niet meer.",
          body:
            "Ga terug naar de funnel en kies opnieuw of u eerst product, vertrouwen of direct het validatiegesprek wilt bekijken.",
        },
        actions: [
          { page: "home", label: "Terug naar start" },
          { page: "pilot", label: "Naar planner" },
        ],
      },
    },
    booking: {
      labels: {
        stepLabel: "Stap",
        step1: "Context",
        step2: "Voorkeuren",
        step3: "Controleren",
        statusReady: "Vul de praktijkcontext in om verder te gaan.",
        statusStep2: "Kies uw voorkeursmomenten voor het gesprek.",
        statusReview: "Controleer uw aanvraag en verstuur wanneer alles klopt.",
        statusSuccess: "Uw aanvraag is lokaal opgeslagen voor de live handoff.",
        summaryTitle: "Renvoo booking request",
        submittedAt: "Ingediend op",
        mode: "Modus",
        contactName: "Naam",
        contactEmail: "Zakelijk e-mailadres",
        role: "Rol",
        clinicName: "Praktijknaam",
        city: "Stad",
        clinicSize: "Praktijkgrootte",
        primaryPain: "Grootste pijnpunt",
        workflowNotes: "Huidige workflow of tooling",
        meetingFormat: "Gesprekstype",
        preferredSlot: "Voorkeursmoment",
        backupSlot: "Backupmoment (optioneel)",
        buttons: {
          next: "Verder",
          back: "Terug",
          submit: "Verstuur aanvraag",
          calendar: "Open Google Calendar",
          restart: "Nieuwe aanvraag",
          copy: "Kopieer samenvatting",
          download: "Download samenvatting",
        },
        help: {
          workflowNotes:
            "Beschrijf kort uw huidige systeem of werkwijze… Bijvoorbeeld Exquise met handmatige reminders en losse terugbellijst.",
          preferredSlot: "Kies uw beste eerste optie. Tijden worden gelezen als Europe/Amsterdam.",
          backupSlot: "Handig als alternatief wanneer de eerste optie schuift.",
        },
        errors: {
          required: "Dit veld is nodig om verder te gaan.",
          email: "Gebruik een geldig zakelijk e-mailadres.",
          tooShort: "Voeg iets meer context toe zodat de praktijkworkflow duidelijk wordt.",
          dateTime: "Kies een geldig datum- en tijdsmoment.",
          differentDateTime: "Kies een ander backupmoment dan uw eerste voorkeur.",
        },
        previewMode:
          "Live routing is nog niet gekoppeld. De planner maakt daarom nu een nette handoff en een Google Calendar-draft op basis van uw eerste voorkeur.",
        responseExpectation:
          "Doel: na deze aanvraag volgt bevestiging op de eerste optie of een korte afstemming via het backupmoment.",
        successTitle: "Aanvraag klaar voor opvolging",
        successBody:
          "De planner heeft de aanvraag lokaal opgeslagen. Open daarna de Google Calendar-draft voor uw eerste voorkeursmoment, of kopieer/download de handoff zolang live routing nog niet actief is.",
        copySuccess: "Samenvatting gekopieerd.",
        copyFallback: "Kopiëren lukte niet automatisch. Gebruik de downloadknop als fallback.",
        downloadReady: "Samenvatting gedownload.",
        calendarReady: "Google Calendar-draft geopend.",
      },
      roles: [
        { value: "owner", label: "Praktijkhouder / eigenaar" },
        { value: "manager", label: "Praktijkmanager" },
        { value: "operations", label: "Operations / front-desk lead" },
        { value: "other", label: "Anders, maar betrokken bij planning" },
      ],
      clinicSizes: [
        { value: "solo", label: "1 behandelkamer of solo-praktijk" },
        { value: "small", label: "2-4 behandelkamers" },
        { value: "mid", label: "5-8 behandelkamers" },
        { value: "group", label: "Meerdere locaties of grotere groep" },
      ],
      primaryPains: [
        { value: "no-shows", label: "No-shows" },
        { value: "late-cancellations", label: "Late afzeggingen" },
        { value: "backfill", label: "Terugvullen van lege plekken" },
        { value: "admin-load", label: "Te veel handmatig front-desk werk" },
      ],
      meetingFormats: [
        { value: "video", label: "Video call" },
        { value: "phone", label: "Telefonisch" },
        { value: "onsite", label: "Op locatie als het logisch is" },
      ],
    },
  },
  en: {
    htmlLang: "en",
    locale: "en-US",
    languageLabel: "English",
    switchLabel: "NL",
    brandLine: "Operational SaaS for calmer schedule recovery",
    nav: {
      home: "Home",
      product: "Product",
      pilot: "Pilot",
      trust: "Trust",
      blogIndex: "Blog",
      cta: "Book Meeting",
    },
    footer: {
      summary:
        "Renvoo is an early-stage B2B clinic SaaS for Dutch dental clinics that aims to reduce no-shows, handle late cancellations earlier, and recover lost chair time without extra front-desk work.",
      quickLinksTitle: "Funnel",
      legalTitle: "Legal",
      languageTitle: "Language",
      legalLinks: [
        { page: "privacy", label: "Website privacy note" },
        { page: "patientNotice", label: "Patient message note" },
      ],
      languageLinks: [{ lang: "nl", page: "home", label: "Nederlandse versie" }],
      proofNote: "Built around pilot proof, not inflated claims.",
    },
    pageNames: {
      home: "Home",
      product: "Product",
      pilot: "Pilot",
      trust: "Trust",
      blogIndex: "Blog",
      privacy: "Privacy",
      patientNotice: "Patient note",
      notFound: "Not found",
    },
    blog: {
      eyebrow: "Blog",
      title: "Practical reading for calmer schedule recovery",
      intro:
        "Short, specific articles for clinic operators on no-shows, late cancellations, reminder workflows, and recovering empty chair time without extra noise.",
      emptyLabel: "No published articles are live yet.",
      readMore: "Read article",
      backToBlog: "Back to blog",
      sourcesTitle: "Sources",
      relatedTitle: "Related reading",
      ctaTitle: "Want to translate this into your own workflow?",
      ctaBody:
        "The best next step is still a short validation meeting around your current no-show, confirmation, and recovery process.",
      ctaPrimary: "Book the meeting",
    },
    pages: {
      home: {
        seo: {
          title: "Renvoo | Reduce no-shows. Recover lost appointments.",
          description:
            "Renvoo helps Dutch dental clinics spot no-show risk earlier, handle late cancellations sooner, and recover empty chair time without adding front-desk work.",
        },
        hero: {
          eyebrow: "For Dutch dental clinics",
          title: "Reduce no-shows. Recover lost appointments.",
          body:
            "Renvoo helps Dutch dental clinics spot no-show risk earlier, handle late cancellations sooner, and recover empty chair time without adding front-desk work.",
          primaryCta: "Request a Validation Meeting",
          secondaryCta: "See How It Works",
          badges: [],
          operatorCard: {
            title: "What operators feel first",
            items: [
              "The schedule looks full, but chair time still feels fragile.",
              "Late notice leaves too little time to recover the slot well.",
              "Front-desk teams absorb the uncertainty manually.",
            ],
          },
        },
        pains: {
          eyebrow: "The real problem",
          title: "The damage is not only the no-show itself.",
          intro:
            "Loss compounds when empty chair time, late signals, and recovery work all hit the same day. That is why reminders alone are not enough.",
          items: [
            {
              title: "Empty chair time becomes immediate revenue loss",
              body: "A scheduled appointment only creates value if the patient actually shows up.",
            },
            {
              title: "Late cancellations can still be expensive even when polite",
              body: "A patient may warn the clinic, and the slot can still be too late to save.",
            },
            {
              title: "Admin work grows around uncertainty",
              body: "Confirmations, chasing replies, rescheduling, and backfill all create extra operational load.",
            },
          ],
        },
        workflowTeaser: {
          eyebrow: "How Renvoo thinks",
          title: "From generic reminders to schedule resilience",
          intro:
            "The pilot is designed as a lightweight operations layer. First surface risk, then confirm or reschedule more intentionally, then recover capacity faster.",
          steps: [
            {
              label: "Connect",
              body: "Start with scheduling and communication data rather than clinical data.",
            },
            {
              label: "Detect",
              body: "Surface higher-risk appointments earlier than a generic reminder flow does.",
            },
            {
              label: "Confirm",
              body: "Give staff a clearer moment to confirm, reschedule, or intervene earlier.",
            },
            {
              label: "Replace",
              body: "Help the clinic recover lost capacity while keeping schedule control inside the practice.",
            },
          ],
        },
        proof: {
          eyebrow: "Why this feels credible",
          title: "Built to validate with clinics, not to claim too much too early.",
          cards: [
            {
              title: "Proof posture",
              body: "The current case is grounded in clear operating logic and scenario math. The pilot exists to prove real reduction, recovery, and admin relief with clinic workflows.",
            },
            {
              title: "Data boundary",
              body: "Renvoo is deliberately framed around non-clinical scheduling and communication data, not diagnoses, notes, or treatment decisions.",
            },
          ],
        },
        paths: {
          eyebrow: "Choose your route",
          title: "Not every buyer wants the same thing first.",
          items: [
            {
              title: "Understand the product first",
              body: "See the full Connect → Detect → Confirm → Replace workflow and why it is different from reminder software.",
              page: "product",
              label: "Go to Product",
            },
            {
              title: "See the pilot path first",
              body: "Review the validation meeting, pilot framing, and local booking flow.",
              page: "pilot",
              label: "Go to Pilot",
            },
            {
              title: "Check trust and data posture first",
              body: "Review controller/processor boundaries, FAQs, materials, and legal notes.",
              page: "trust",
              label: "Go to Trust",
            },
          ],
        },
        closing: {
          eyebrow: "Next step",
          title: "The next step is small and practical.",
          body:
            "We are looking for a short validation meeting with a dental clinic owner or practice manager to review the current no-show and cancellation workflow.",
          primaryCta: "Book the Meeting",
          secondaryCta: "See the Pilot First",
        },
      },
      product: {
        seo: {
          title: "Renvoo | Product workflow for no-show prevention",
          description:
            "See how Renvoo helps Dutch dental clinics with an operational workflow for detecting risk, confirming earlier, and recovering empty chair time.",
        },
        hero: {
          eyebrow: "Product",
          title: "Not another reminder tool.",
          body:
            "Renvoo is meant to be an operations layer around attendance uncertainty. The point is not more messages. The point is earlier visibility, better intervention timing, and calmer schedule recovery.",
          primaryCta: "Book a Validation Meeting",
          secondaryCta: "See Trust & Data",
        },
        comparison: {
          eyebrow: "Before and after",
          title: "What changes operationally",
          beforeTitle: "Without Renvoo",
          afterTitle: "With Renvoo",
          before: [
            "Most appointments pass through roughly the same reminder logic.",
            "Risk often becomes obvious only after the slot is already fragile.",
            "Front-desk teams react manually to gaps, no-response, and late notice.",
            "Backfill relies on memory, lists, and time pressure.",
          ],
          after: [
            "Staff can see earlier which appointments need more attention.",
            "Confirming and rescheduling can happen more intentionally, not only generically.",
            "Recovery work becomes a clearer workflow instead of scattered firefighting.",
            "The clinic keeps final control over schedule changes and patient touchpoints.",
          ],
        },
        workflow: {
          eyebrow: "The four steps",
          title: "Connect. Detect. Confirm. Replace.",
          intro:
            "The architecture is deliberately small for early pilots: lightweight intake, operational visibility, and no patient-platform behavior in v1.",
          steps: [
            {
              title: "Connect",
              body: "Start with scheduling, appointment, and communication fields that are operationally useful enough to surface risk.",
              bullets: [
                "Scheduling and status fields first",
                "No diagnoses or clinical notes required",
                "Lower-friction path into pilot validation",
              ],
            },
            {
              title: "Detect",
              body: "Surface higher-risk appointments earlier than a standard reminder program would.",
              bullets: [
                "Appointment-level risk, not one generic flow",
                "Operator-facing, not clinical",
                "Built for explainable use in practice",
              ],
            },
            {
              title: "Confirm",
              body: "Give the team a clearer moment to confirm, reschedule, or intervene before chair time is lost.",
              bullets: [
                "Supports practical staff follow-up",
                "Fits beside existing systems",
                "Helps address no-response sooner",
              ],
            },
            {
              title: "Replace",
              body: "When a slot opens up, the workflow helps the clinic think about recovery earlier while keeping actual schedule mutation under clinic or EHR control.",
              bullets: [
                "No autonomous schedule mutations in v1",
                "Recovery over theater",
                "Practice or EHR keeps final control",
              ],
            },
          ],
        },
        fit: {
          eyebrow: "Low friction by design",
          title: "Deliberately simple for the first clinic pilots",
          items: [
            {
              title: "Non-clinical data boundary",
              body: "Administrative scheduling and communication data comes first. That keeps the scope narrow and operational.",
            },
            {
              title: "CSV-first or read-only intake",
              body: "The first step does not need to become a heavy integration project before the pilot case is clear.",
            },
            {
              title: "No patient accounts in v1",
              body: "Patient interaction stays in clinic-triggered messages and secure links, not in a new consumer product.",
            },
          ],
        },
        whyDental: {
          eyebrow: "Why dental first",
          title: "The wedge is narrow, but sharp.",
          items: [
            "Empty chair time is economically visible immediately.",
            "Schedules are dense and hard to recover once notice is late.",
            "Owners and practice managers feel the pain directly in daily operations.",
          ],
        },
        closing: {
          eyebrow: "Next step",
          title: "Does this look like a realistic workflow for your clinic?",
          body:
            "If yes, the best next step is a short meeting where we do not demo first. We review the current no-show, cancellation, and recovery workflow.",
          primaryCta: "Request the Meeting",
          secondaryCta: "See the Pilot",
        },
      },
      pilot: {
        seo: {
          title: "Renvoo | Request a validation meeting",
          description:
            "Request a short validation meeting and share when your dental clinic would prefer to talk about no-shows, late cancellations, and capacity recovery.",
        },
        hero: {
          eyebrow: "Pilot",
          title: "Request a validation meeting",
          body:
            "The first conversation is not a heavy product demo. It is a short operator review of the current no-show, confirmation, and recovery workflow to see whether a lightweight pilot is worth it.",
          primaryCta: "Start the Planner",
          secondaryCta: "See the Product First",
          chips: ["15 minutes", "Founder-led", "Google Calendar follow-up"],
        },
        agenda: {
          eyebrow: "What the first meeting should do",
          title: "Practical enough for a real yes or no",
          items: [
            {
              title: "Workflow review",
              body: "Walk through how no-shows, late cancellations, and recovery currently get handled.",
            },
            {
              title: "Signals and constraints",
              body: "Review where the clinic gets visibility too late and what data or tooling already exists.",
            },
            {
              title: "Pilot fit",
              body: "Decide whether the operational pain is strong enough for a measurable pilot.",
            },
          ],
        },
        bookingIntro: {
          eyebrow: "Local booking flow",
          title: "Choose a preferred slot and one backup option",
          body:
            "This planner currently works as a request flow. Choose a first option and an optional backup, then open a Google Calendar draft while live routing is still being connected.",
          support: [
            "Name and business contact details",
            "Short context about clinic and current workflow",
            "Meeting format plus a first and second time option",
          ],
        },
        pricing: {
          eyebrow: "Pricing stays secondary",
          title: "Preliminary pilot pricing",
          body: sharedPricingLine,
          note:
            "The pricing line is here to frame budget fit, not to force a heavy commitment before validation.",
        },
        plannerAside: {
          title: "What happens after submit",
          items: [
            "A Google Calendar draft based on the first preferred slot",
            "A copyable handoff while live routing is not yet active",
            "A tidy summary for internal follow-up or launch prep",
          ],
          responseExpectation:
            "Target response: confirmation on the first option or a short follow-up using the backup slot.",
        },
        fallback: {
          title: "Not ready to book yet?",
          body:
            "Review the trust page first for the data boundary, proof posture, FAQ, materials, and legal notes before returning to the planner.",
          label: "See Trust First",
        },
      },
      trust: {
        seo: {
          title: "Renvoo | Trust, data boundary, and clinic materials",
          description:
            "Review Renvoo's trust layer: proof posture, controller/processor split, FAQ, clinic materials, and legal notes for the first dental pilots.",
        },
        hero: {
          eyebrow: "Trust",
          title: "Built to validate with clinics, not to overclaim.",
          body:
            "This page is for the skeptical route: what Renvoo does and does not claim, what data is and is not in scope, and what clinic materials already exist for real conversations.",
          primaryCta: "Go to the Planner",
          secondaryCta: "See the Product",
        },
        boundary: {
          eyebrow: "Data boundary & role split",
          title: "Narrow enough to stay workable",
          items: [
            {
              title: "Non-clinical scope",
              body: "Renvoo is designed around administrative scheduling and communication data, not diagnoses, treatment decisions, or clinical notes.",
            },
            {
              title: "Clinic stays controller",
              body: "For patient and appointment operational data, the clinic stays controller and Renvoo acts as processor under clinic instruction.",
            },
            {
              title: "No patient platform in v1",
              body: "The first pilots stay away from patient accounts, marketplace behavior, and unnecessary consumer-facing product sprawl.",
            },
          ],
        },
        proof: {
          eyebrow: "Proof posture",
          title: "What can be said honestly today",
          items: [
            "The current case is grounded in operating logic and scenario math, not invented traction.",
            "The pilot exists to validate real reduction, recovery, and admin relief with live clinic workflows.",
            "The founder-led motion is meant to create workflow proof, not a generic self-serve funnel.",
          ],
          founderLine: sharedFounderLine,
        },
        faq: {
          eyebrow: "Frequent questions",
          title: "The main objections without startup theater",
          items: [
            {
              question: "We already send reminders. What changes then?",
              answer:
                "That makes sense. Reminders are part of the baseline. The gap Renvoo is focused on is what happens when reminders are not enough: no response, late response, and manual recovery work around lost capacity.",
            },
            {
              question: "We do not want another heavy system.",
              answer:
                "That is exactly why the current direction is low friction: CSV-first or read-only onboarding, no patient accounts in v1, and a short workflow validation before anything heavier.",
            },
            {
              question: "We are careful with patient data.",
              answer:
                "That caution is right. Renvoo is designed around non-clinical administrative scheduling and communication data, not diagnoses, clinical notes, or treatment decisions.",
            },
            {
              question: "Do patients need to create an account?",
              answer:
                "No. The v1 posture is clinic SaaS, not a patient platform. Patient interaction should happen through clinic-triggered reminders, confirmations, and secure links.",
            },
            {
              question: "We are too busy to change workflow now.",
              answer:
                "That is part of the problem Renvoo is trying to solve. The first meeting is not a heavy rollout. It is there to see whether the operational pain is strong enough for a lightweight pilot.",
            },
            {
              question: "How do we know this is worth it?",
              answer:
                "That is the central pilot question. The current case is logical, but the pilot should validate whether no-show reduction, recovery, and admin relief become visible in your clinic.",
            },
          ],
        },
        materials: {
          eyebrow: "Clinic materials",
          title: "One sharp one-pager is enough for the first follow-up",
          intro:
            "For the website, the materials stay intentionally narrow: one clinic one-pager that calmly summarizes the problem, workflow, and pilot posture.",
          downloads: sharedDownloads,
          previews: [
            {
              src: "assets/previews/one-pager-preview.png",
              alt: "Preview of the Renvoo clinic one-pager",
              caption: "One-pager preview",
              width: 1080,
              height: 1528,
            },
          ],
        },
        legal: {
          eyebrow: "Legal base layer",
          title: "Narrow launch posture",
          body:
            "The legal pages stay deliberately simple: website privacy, patient message note, and pointers into the broader legal pack for controller/processor posture, DPIA-lite, and contract templates.",
          links: [
            { page: "privacy", label: "Website privacy note" },
            { page: "patientNotice", label: "Patient message note" },
          ],
        },
        closing: {
          eyebrow: "Next step",
          title: "If the posture feels right, request the short meeting.",
          body:
            "The funnel is intentionally simple: understand the workflow, validate the trust layer, and only then request the conversation.",
          primaryCta: "Book the Validation Meeting",
          secondaryCta: "See the Pilot Flow",
        },
      },
      blogIndex: {
        seo: {
          title: "Renvoo | Blog on no-shows, reminders, and schedule recovery",
          description:
            "Read practical Renvoo articles on no-shows, late cancellations, reminder workflows, and recovering empty chair time in dental clinics.",
        },
        hero: {
          eyebrow: "Blog",
          title: "Practical insights for calmer clinic operations",
          body:
            "No inflated thought leadership. Just specific explanations of where no-shows start, why reminder-only tooling often falls short, and how clinics can recover fragile schedule time earlier.",
          primaryCta: "Book the meeting",
          secondaryCta: "See the product",
        },
      },
      privacy: {
        seo: {
          title: "Renvoo | Website privacy note",
          description:
            "Pre-launch privacy note for Renvoo's clinic-SaaS website, lead capture, and pilot outreach workflow.",
        },
        hero: {
          eyebrow: "Pre-launch note",
          title: "Website privacy note",
          body:
            "This page describes the narrow privacy posture currently intended for Renvoo's own website, clinic lead capture, and pilot outreach flow. The final `Renvoo B.V.` contact details and retention choices still need to be added before launch.",
        },
        cards: [
          {
            title: "What this page covers",
            body:
              "This note covers Renvoo's own website, clinic lead capture, and business-development communication. It does not replace a clinic's own patient privacy notice.",
          },
          {
            title: "Current product posture",
            list: [
              "Renvoo is being launched as B2B clinic SaaS for Dutch private clinics, starting with dental clinics.",
              "The site is informational and lead-generation oriented.",
              "The site is not a patient portal or patient account product.",
            ],
          },
          {
            title: "Data Renvoo may collect directly",
            list: [
              "name, clinic, and business contact details you send directly",
              "messages, meeting requests, and notes from pilot conversations",
              "basic technical and security information needed to operate the site",
            ],
          },
          {
            title: "Cookies",
            body:
              "The intended default launch posture is no non-essential cookies by default. If that changes, an explicit consent flow should be added first.",
          },
          {
            title: "Why the data is used",
            list: [
              "to answer clinic inquiries",
              "to schedule validation or pilot conversations",
              "to secure and operate the website",
              "to handle ordinary business administration",
            ],
          },
          {
            title: "Implementation note",
            body:
              "Before public launch, replace this pre-launch note with the finalized website privacy notice from the legal pack, including legal contact details, retention choices, and any approved vendor list.",
          },
        ],
      },
      patientNotice: {
        seo: {
          title: "Renvoo | Patient message note",
          description:
            "Pre-launch patient message note for clinic-triggered reminders, confirmations, and secure rescheduling links in the first Renvoo pilot phase.",
        },
        hero: {
          eyebrow: "Pre-launch note",
          title: "Patient message note",
          body:
            "This page shows the short-form patient message note Renvoo plans to use for clinic-triggered reminders, confirmations, and secure rescheduling links during the first pilot phase.",
        },
        cards: [
          {
            title: "Short version",
            body:
              "Your clinic may use Renvoo to help manage appointment confirmations, rescheduling, and recovery of otherwise unused appointment time. Renvoo acts on behalf of the clinic for those operational messages.",
          },
          {
            title: "Role split",
            list: [
              "your clinic stays responsible for your care relationship and patient data",
              "Renvoo provides the operational workflow as a service provider to the clinic",
              "questions about your appointment or privacy rights should first go to your clinic",
            ],
          },
          {
            title: "What data this is meant to use",
            list: [
              "your name and contact details",
              "your appointment time and appointment status",
              "message and response status needed for scheduling operations",
            ],
          },
          {
            title: "What this is not",
            list: [
              "not a patient account or patient portal",
              "not a diagnosis tool",
              "not a treatment recommendation or medical advice service",
            ],
          },
          {
            title: "Implementation note",
            body:
              "Before live pilot use, clinic-specific wording, contact details, and approved data categories should be finalized in the formal legal notice.",
          },
        ],
      },
      notFound: {
        seo: {
          title: "Renvoo | Page not found",
          description: "The requested Renvoo page does not exist or has moved.",
        },
        hero: {
          eyebrow: "404",
          title: "This page no longer exists.",
          body:
            "Go back into the funnel and choose whether you want to review the product, the trust layer, or the meeting planner next.",
        },
        actions: [
          { page: "home", label: "Back to Home" },
          { page: "pilot", label: "Go to Planner" },
        ],
      },
    },
    booking: {
      labels: {
        stepLabel: "Step",
        step1: "Context",
        step2: "Preferences",
        step3: "Review",
        statusReady: "Add the clinic context first to continue.",
        statusStep2: "Choose preferred meeting timing next.",
        statusReview: "Review the request and submit when everything looks right.",
        statusSuccess: "Your request has been saved locally for the live handoff.",
        summaryTitle: "Renvoo booking request",
        submittedAt: "Submitted at",
        mode: "Mode",
        contactName: "Name",
        contactEmail: "Business email",
        role: "Role",
        clinicName: "Clinic name",
        city: "City",
        clinicSize: "Clinic size",
        primaryPain: "Primary pain point",
        workflowNotes: "Current workflow or tooling",
        meetingFormat: "Meeting format",
        preferredSlot: "Preferred slot",
        backupSlot: "Backup slot (optional)",
        buttons: {
          next: "Continue",
          back: "Back",
          submit: "Submit Request",
          calendar: "Open Google Calendar",
          restart: "Start Again",
          copy: "Copy Summary",
          download: "Download Summary",
        },
        help: {
          workflowNotes:
            "Briefly describe the current system or process… For example Exquise with manual reminders and a separate backfill list.",
          preferredSlot: "Choose the best first option. Times are interpreted in Europe/Amsterdam.",
          backupSlot: "Helpful as a fallback if the first option slips.",
        },
        errors: {
          required: "This field is needed to continue.",
          email: "Use a valid business email address.",
          tooShort: "Add a bit more context so the clinic workflow is clear.",
          dateTime: "Choose a valid date and time.",
          differentDateTime: "Choose a different backup slot from the first option.",
        },
        previewMode:
          "Live routing is not connected yet. The planner therefore creates a clean local handoff plus a Google Calendar draft from the first preferred slot.",
        responseExpectation:
          "Target response: confirmation on the first option or a short follow-up using the backup slot.",
        successTitle: "Request ready for follow-up",
        successBody:
          "The planner has saved the request locally. Open the Google Calendar draft for the first preferred slot, or copy/download the handoff while live routing is still inactive.",
        copySuccess: "Summary copied.",
        copyFallback: "Automatic copy did not work. Use the download button as fallback.",
        downloadReady: "Summary downloaded.",
        calendarReady: "Google Calendar draft opened.",
      },
      roles: [
        { value: "owner", label: "Clinic owner" },
        { value: "manager", label: "Practice manager" },
        { value: "operations", label: "Operations or front-desk lead" },
        { value: "other", label: "Other planning stakeholder" },
      ],
      clinicSizes: [
        { value: "solo", label: "1 chair or solo clinic" },
        { value: "small", label: "2-4 chairs" },
        { value: "mid", label: "5-8 chairs" },
        { value: "group", label: "Multi-location or larger group" },
      ],
      primaryPains: [
        { value: "no-shows", label: "No-shows" },
        { value: "late-cancellations", label: "Late cancellations" },
        { value: "backfill", label: "Backfilling open slots" },
        { value: "admin-load", label: "Too much manual front-desk work" },
      ],
      meetingFormats: [
        { value: "video", label: "Video call" },
        { value: "phone", label: "Phone call" },
        { value: "onsite", label: "On-site if it makes sense" },
      ],
    },
  },
};

export const pageOrder = ["home", "product", "pilot", "trust", "blogIndex", "privacy", "patientNotice", "notFound"];

export const pageFileNames = {
  home: "index.html",
  product: "product.html",
  pilot: "pilot.html",
  trust: "trust.html",
  blogIndex: "blog/index.html",
  privacy: "privacy.html",
  patientNotice: "patient-notice.html",
  notFound: "404.html",
};
