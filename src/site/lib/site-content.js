const onePagerPath = "/downloads/renvoo-clinic-one-pager.pptx";

export const pageSlugs = {
  home: "",
  about: "about",
  contact: "contact",
  useCases: "use-cases",
  dentalClinics: "dental-clinics",
  privateClinics: "private-clinics",
  noShowReduction: "no-show-reduction",
  appointmentReminders: "appointment-reminders",
  cancellationManagement: "cancellation-management",
  blogIndex: "blog",
  privacy: "privacy",
  patientNotice: "patient-notice",
  notFound: "404",
};

export const commercialPageKeys = [
  "home",
  "about",
  "contact",
  "useCases",
  "dentalClinics",
  "privateClinics",
  "noShowReduction",
  "appointmentReminders",
  "cancellationManagement",
  "blogIndex",
];

export const localeOrder = ["nl", "en"];

function sharedFooter(summary, proofNote) {
  return {
    summary,
    proofNote,
  };
}

export function alternateLocale(locale) {
  return locale === "en" ? "nl" : "en";
}

export function pagePathFor(locale, pageKey) {
  const prefix = locale === "en" ? "/en" : "";

  if (pageKey === "home") {
    return `${prefix}/`;
  }

  if (pageKey === "notFound") {
    return "/404.html";
  }

  return `${prefix}/${pageSlugs[pageKey]}/`;
}

export function pageFilePathFor(locale, pageKey) {
  if (pageKey === "home") {
    return locale === "en" ? "en/index.html" : "index.html";
  }

  if (pageKey === "notFound") {
    return "404.html";
  }

  const slug = pageSlugs[pageKey];
  return locale === "en" ? `en/${slug}/index.html` : `${slug}/index.html`;
}

export function pageLabelFor(content, pageKey) {
  return content.pageNames[pageKey] ?? content.nav[pageKey] ?? content.brand.name;
}

function buildRelatedLink(pageKey, label, blurb) {
  return { pageKey, label, blurb };
}

const sharedBrand = {
  name: "Renvoo",
  taglines: {
    nl: "Operationele software voor minder no-shows en minder lege stoeluren",
    en: "Operational software for fewer no-shows and fewer empty appointment slots",
  },
};

export const siteContent = {
  nl: {
    htmlLang: "nl",
    locale: "nl-NL",
    switchLabel: "EN",
    brand: sharedBrand,
    nav: {
      home: "Start",
      useCases: "Use cases",
      about: "Over",
      blogIndex: "Blog",
      contact: "Contact",
      cta: "Plan een workflow review",
    },
    pageNames: {
      home: "Start",
      about: "Over",
      contact: "Contact",
      useCases: "Use cases",
      dentalClinics: "Tandartspraktijken",
      privateClinics: "Private clinics",
      noShowReduction: "No-show reduction",
      appointmentReminders: "Appointment reminders",
      cancellationManagement: "Cancellation management",
      blogIndex: "Blog",
      privacy: "Privacy",
      patientNotice: "Patiëntbericht",
      notFound: "Niet gevonden",
    },
    footer: sharedFooter(
      "Renvoo is een vroege Nederlandse healthtech startup die tandartspraktijken en andere afspraak-intensieve klinieken helpt no-shows, late uitval en herstelwerk rustiger op te vangen.",
      "Gebouwd rond operationele logica en pilot-validatie, niet rond verzonnen traction.",
    ),
    contactForm: {
      title: "Vraag een korte workflow review aan",
      intro:
        "Gebruik dit formulier om een kort gesprek voor te bereiden over no-shows, late uitval en herstelcapaciteit. Zonder backend sturen we de samenvatting via e-mail of kopiëren we die netjes voor follow-up.",
      fields: {
        name: "Naam",
        clinic: "Praktijknaam",
        role: "Rol",
        email: "Zakelijk e-mailadres",
        phone: "Telefoonnummer (optioneel)",
        challenge: "Grootste operationele pijnpunt",
        preferredTime: "Voorkeur voor dag of tijd",
        notes: "Extra context",
      },
      roles: ["Praktijkhouder", "Praktijkmanager", "Operations", "Front-desk lead", "Anders"],
      buttons: {
        submit: "Maak verzoeksamenvatting",
        copy: "Kopieer samenvatting",
        mail: "Open e-mail",
      },
      validation: {
        required: "Vul dit veld in.",
        email: "Gebruik een geldig e-mailadres.",
      },
      success:
        "De aanvraag is samengevat. Als er een publiek contactadres is ingesteld, staat de e-mail klaar; anders kunt u de tekst direct kopiëren.",
      missingEmail:
        "Er is nog geen publiek contactadres ingesteld in de site-configuratie. Kopieer de samenvatting en stuur die via uw gewenste kanaal.",
      mailSubject: "Workflow review voor Renvoo",
    },
    blog: {
      eyebrow: "Blog",
      title: "Praktische inzichten voor afspraak-intensieve klinieken",
      intro:
        "Deze blog is bedoeld voor praktijkhouders, praktijkmanagers en operations leads die minder no-shows, minder late uitval en minder herstelstress willen.",
      featuredLabel: "Uitgelichte artikelen",
      emptyLabel: "Er zijn nog geen gepubliceerde artikelen in deze taal.",
      readMore: "Lees artikel",
      backToBlog: "Terug naar blog",
      sourcesTitle: "Bronnen",
      faqTitle: "Veelgestelde vragen",
      relatedTitle: "Verder lezen",
      ctaTitle: "Wilt u dit vertalen naar uw eigen workflow?",
      ctaBody:
        "De beste volgende stap is een korte workflow review rond no-shows, late uitval en hoe uw team nu probeert lege stoeluren te voorkomen.",
      ctaPrimary: "Plan een workflow review",
    },
    pages: {
      home: {
        type: "home",
        seo: {
          title: "Renvoo | No-show software voor tandartspraktijken en private clinics",
          description:
            "Renvoo helpt Nederlandse tandartspraktijken en afspraak-intensieve private clinics no-shows, late afzeggingen en lege afspraakcapaciteit rustiger op te vangen zonder extra administratieve druk.",
        },
        hero: {
          eyebrow: "No-show reduction software voor Nederlandse tandartspraktijken",
          title: "Minder no-shows. Minder lege stoeluren. Minder herstelwerk.",
          lead:
            "Renvoo helpt tandartspraktijken en private clinics gemiste afspraken eerder signaleren, bevestigingen en verplaatsingen beter aansturen en vrijgekomen capaciteit sneller herstellen zonder extra front-desk chaos.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { href: onePagerPath, label: "Download de one-pager" },
          badges: [
            "Tandartspraktijken eerst",
            "Geen patiëntaccounts in v1",
            "Niet-klinische datagrens",
          ],
        },
        answer:
          "Renvoo is operationele software voor Nederlandse klinieken die gemiste afspraken, late afzeggingen en terugvullen van vrijgekomen tijd wil verbeteren zonder een nieuw patiëntplatform te bouwen.",
        definitionTitle: "Wat is Renvoo?",
        definition:
          "Renvoo is geen generieke reminder-tool en ook geen klinische AI. Het is een workflowlaag rond afspraakrisico: eerder zien waar onzekerheid zit, gerichter bevestigen of verplaatsen, en vrijgekomen capaciteit sneller terugwinnen.",
        audienceTitle: "Voor wie is dit bedoeld?",
        audience: [
          "Praktijkhouders die direct voelen wat lege stoeluren kosten.",
          "Praktijkmanagers die no-shows, confirmations en verplaatsingen in de operatie zien samenkomen.",
          "Private clinics met afspraak-intensieve agenda's en beperkte herstelruimte op dezelfde dag.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Waarom praktijken dit voelen",
            title: "Het probleem is groter dan alleen de gemiste afspraak.",
            intro:
              "De schade zit in een kettingreactie: omzet valt weg, planning wordt onrustig en het team vangt de onzekerheid handmatig op.",
            items: [
              {
                title: "Lege stoeluren raken direct de omzet",
                body: "Een geplande afspraak levert pas iets op als de patiënt ook echt verschijnt of de vrijgekomen tijd nog op tijd wordt gevuld.",
              },
              {
                title: "Late afzeggingen komen vaak te laat voor herstel",
                body: "Zelfs wanneer patiënten het netjes melden, is het tijdsvenster om nog slim te schuiven of terug te vullen vaak klein.",
              },
              {
                title: "Het herstelwerk landt bij de balie",
                body: "Bevestigen, nabellen, verplaatsen en gaten opvangen worden extra handmatig werk zodra de agenda onrustig wordt.",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Belangrijkste use cases",
            title: "Start bij de route die het best past bij uw vraag",
            items: [
              {
                title: "Tandartspraktijken",
                body: "Voor dichte agenda's, hoge stoelwaardes en dagelijkse herstelstress.",
                pageKey: "dentalClinics",
                label: "Bekijk tandartspraktijken",
              },
              {
                title: "No-show reduction",
                body: "Voor teams die niet alleen meer reminders willen, maar eerder grip op uitval.",
                pageKey: "noShowReduction",
                label: "Bekijk no-show reduction",
              },
              {
                title: "Cancellation management",
                body: "Voor praktijken die late afzeggingen en terugvullen beter willen afhandelen.",
                pageKey: "cancellationManagement",
                label: "Bekijk cancellation management",
              },
            ],
          },
          {
            type: "steps",
            eyebrow: "Hoe het werkt",
            title: "Van risico zien naar herstel organiseren",
            intro:
              "De productlogica is bewust operationeel gehouden: geen klinische beslissingen, geen patiëntplatform in v1, wel meer rust rond risicovolle afspraken.",
            items: [
              {
                title: "Detecteer risicovolle afspraken eerder",
                body: "Gebruik plannings- en communicatiesignalen om eerder te zien waar no-show of late uitval waarschijnlijker wordt.",
              },
              {
                title: "Bevestig of verplaats gerichter",
                body: "Geef het team een betere aanleiding om te bevestigen, na te bellen of te verplaatsen vóór de stoel verloren raakt.",
              },
              {
                title: "Herstel vrijgekomen tijd sneller",
                body: "Denk sneller in wachtlijsten, eerdere slots en praktisch herstel zonder de agenda automatisch over te nemen.",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "Waarom dit anders is",
            title: "Reminder-only versus operationele workflow",
            leftTitle: "Alleen reminders",
            rightTitle: "Renvoo",
            leftItems: [
              "Iedere afspraak krijgt ongeveer dezelfde flow.",
              "Risico wordt vaak pas duidelijk als een slot al kwetsbaar is.",
              "Front-desk teams moeten gaten reactief opvangen.",
            ],
            rightItems: [
              "Afspraken met hoger risico worden eerder zichtbaar.",
              "Bevestigen, verplaatsen en herstel horen bij dezelfde workflow.",
              "De praktijk houdt controle, maar werkt minder reactief.",
            ],
          },
        ],
        faq: [
          {
            question: "Is Renvoo alleen voor tandartspraktijken?",
            answer:
              "Tandartspraktijken zijn de eerste wedge, omdat lege stoeluren daar direct voelbaar zijn. Dezelfde logica kan later breder relevant zijn voor andere afspraak-intensieve private clinics.",
          },
          {
            question: "Is dit een patiëntportaal of patiëntapp?",
            answer:
              "Nee. De huidige richting is expliciet clinic SaaS: operationele software voor het team, zonder patiëntaccounts in v1.",
          },
          {
            question: "Gebruikt Renvoo klinische gegevens?",
            answer:
              "De huidige posture is bewust smal: administratieve plannings- en communicatiegegevens eerst, niet diagnose, behandeladvies of klinische notities.",
          },
          {
            question: "Wat is de beste volgende stap?",
            answer:
              "Een kort workflowgesprek waarin we uw huidige no-show-, afzeg- en herstelproces begrijpen. Dat is nuttiger dan meteen een grote demo.",
          },
        ],
        relatedPages: [
          buildRelatedLink("useCases", "Bekijk alle use cases", "Zie hoe de probleemruimte is opgesplitst."),
          buildRelatedLink("about", "Lees wat Renvoo wel en niet is", "Krijg de product- en company-context zonder marketingmist."),
          buildRelatedLink("contact", "Plan een workflow review", "Gebruik een korte intake in plaats van een zware salescall."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Wilt u dit toetsen aan uw eigen praktijkworkflow?",
          body:
            "Plan dan een korte workflow review over no-shows, late afzeggingen, bevestigingen en hoe uw team nu probeert lege tijd terug te winnen.",
          primary: { pageKey: "contact", label: "Plan de workflow review" },
          secondary: { pageKey: "useCases", label: "Bekijk eerst de use cases" },
        },
      },
      about: {
        type: "standard",
        seo: {
          title: "Over Renvoo | Nederlandse healthtech voor no-shows en afspraakherstel",
          description:
            "Lees wat Renvoo is, waarom de focus begint bij tandartspraktijken en waarom de productposture bewust operationeel en niet-klinisch blijft.",
        },
        hero: {
          eyebrow: "Over Renvoo",
          title: "Een Nederlandse healthtech startup met een smalle, operationele wedge.",
          lead:
            "Renvoo wordt gebouwd rond een simpel uitgangspunt: gemiste afspraken zijn niet alleen een patiëntprobleem, maar een plannings- en herstelprobleem voor de praktijk.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { href: onePagerPath, label: "Download de one-pager" },
        },
        answer:
          "Renvoo is een vroege Nederlandse healthtech startup die eerst private tandartspraktijken helpt om minder afspraakcapaciteit te verliezen aan no-shows, late afzeggingen en handmatig herstelwerk.",
        definitionTitle: "Waar komt die focus vandaan?",
        definition:
          "De scherpste commerciële wedge zit vandaag bij Nederlandse tandartspraktijken: dichte agenda's, hoge waarde per stoeluur en operationele pijn die praktijkhouders en praktijkmanagers direct zelf voelen.",
        audienceTitle: "Wat Renvoo bewust niet is",
        audience: [
          "Geen patiëntportaal of consumentenapp.",
          "Geen klinische AI voor diagnose of behandeladvies.",
          "Geen brede ziekenhuisplatformstrategie in de eerste fase.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Waarom dental-first",
            title: "De eerste wedge is klein, maar commercieel scherp.",
            items: [
              {
                title: "Lege stoeluren zijn direct zichtbaar",
                body: "Een gemiste afspraak in een tandartspraktijk is geen abstract KPI-probleem maar direct voelbare misgelopen capaciteit.",
              },
              {
                title: "Agenda's laten weinig herstelruimte",
                body: "Wanneer een slot laat uitvalt, is de ruimte om nog te schuiven vaak beperkt en tijdkritisch.",
              },
              {
                title: "De buyer zit dicht op de operatie",
                body: "Praktijkhouders en praktijkmanagers voelen de pijn rond no-shows, reminders en rescheduling dagelijks zelf.",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Productgrens",
            title: "Wat Renvoo wel en niet doet",
            items: [
              {
                title: "Wel",
                body: "Operationele software rond risicovolle afspraken, bevestigingen, verplaatsingen en herstel van vrijgekomen capaciteit.",
              },
              {
                title: "Niet",
                body: "Geen klinische notities analyseren, geen behandelbeslissingen nemen en geen patiëntaccountproduct bouwen in v1.",
              },
              {
                title: "Bewust pilot-first",
                body: "De huidige bewijspositie is operationele logica plus pilot-validatie, niet een opgeblazen verhaal over traction die er nog niet is.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Waarom niet meteen breder de zorg in?",
            answer:
              "Omdat de tandartswedge vandaag het duidelijkst verkoopt en valideert. Een smallere wedge geeft scherper productleren en minder ruis in GTM.",
          },
          {
            question: "Waarom niet gewoon een reminder-tool verkopen?",
            answer:
              "Omdat de echte pijn vaak pas zichtbaar wordt wanneer reminders niet genoeg zijn. Renvoo wil juist die operationele laag verbeteren.",
          },
          {
            question: "Waarom zo voorzichtig met claims?",
            answer:
              "Omdat het product nog in pilotfase zit. Renvoo kiest bewust voor een geloofwaardige posture met duidelijke grenzen in plaats van generieke AI-marketing.",
          },
        ],
        relatedPages: [
          buildRelatedLink("dentalClinics", "Lees de tandartspraktijken-pagina", "Zie waarom de dental wedge zo scherp is."),
          buildRelatedLink("useCases", "Bekijk de use cases", "Ga van company-context naar concrete workflows."),
          buildRelatedLink("contact", "Praat over uw praktijk", "Vertaal de thesis naar uw eigen operatie."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Heeft uw praktijk dezelfde druk rond no-shows en late uitval?",
          body:
            "Dan is een kort workflowgesprek nuttiger dan nog meer algemene productcopy. We bespreken hoe uw team bevestigt, verplaatst en herstelwerk nu afhandelt.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "dentalClinics", label: "Bekijk de dental use case" },
        },
      },
      contact: {
        type: "contact",
        seo: {
          title: "Contact Renvoo | Vraag een korte workflow review aan",
          description:
            "Vraag een korte workflow review aan over no-shows, late afzeggingen en vrijgekomen afspraakcapaciteit in uw tandartspraktijk of private clinic.",
        },
        hero: {
          eyebrow: "Contact",
          title: "Begin met een korte workflow review, niet met een zware demo.",
          lead:
            "Het eerste gesprek is bedoeld om uw huidige no-show-, bevestigings- en herstelproces te begrijpen. Pas daarna wordt duidelijk of een lichte pilot logisch is.",
          primary: { pageKey: "contact", label: "Vul het verzoek in" },
          secondary: { href: onePagerPath, label: "Download de one-pager" },
        },
        answer:
          "De beste eerste stap voor Renvoo is een kort gesprek met een praktijkhouder, praktijkmanager of operations lead die de dagelijkse planningspijn echt kent.",
        definitionTitle: "Wat kunt u verwachten?",
        definition:
          "Geen theatrale salescall. Wel een praktisch gesprek over no-shows, late afzeggingen, bevestigingen, rescheduling en hoe uw team vrijgekomen capaciteit nu probeert te herstellen.",
        audienceTitle: "Voor wie is dit gesprek het meest relevant?",
        audience: [
          "Praktijkhouders die direct sturen op gerealiseerde stoeluren.",
          "Praktijkmanagers die confirmations, planning en front-desk werk overzien.",
          "Operations leads in afspraak-intensieve private clinics.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Wat we bespreken",
            title: "Het gesprek is klein, maar concreet genoeg voor een eerste ja of nee.",
            items: [
              {
                title: "Huidige workflow",
                body: "Hoe bevestigt u afspraken, hoe ontstaat uitval en wanneer merkt het team dat een stoel risico loopt?",
              },
              {
                title: "Operationele signalen",
                body: "Welke data of tooling ziet u al, en waar is het team nu nog te reactief?",
              },
              {
                title: "Pilot-fit",
                body: "Is er genoeg operationele pijn om een kleine, meetbare pilot te rechtvaardigen?",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Vertrouwen",
            title: "Smalle posture, zodat het gesprek zuiver blijft.",
            items: [
              {
                title: "Geen patiëntplatform in v1",
                body: "De focus ligt op teamworkflow, niet op een nieuwe patiëntapp of portal.",
              },
              {
                title: "Niet-klinische datagrens",
                body: "Administratieve plannings- en communicatiegegevens eerst, geen diagnoses of behandelnotities.",
              },
              {
                title: "Pilot-first",
                body: "De vraag is niet of het verhaal mooi klinkt, maar of de workflowpijn in uw praktijk groot genoeg is om te testen.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Moeten we al klaar zijn voor een pilot?",
            answer:
              "Nee. Het contactmoment is juist bedoeld om te bepalen of een pilot logisch is. Veel gesprekken eindigen eerst als validatie, niet als directe rollout.",
          },
          {
            question: "Wat als we nog geen publiek contactadres live hebben?",
            answer:
              "Het formulier maakt sowieso een nette samenvatting. Als er een publiek contactadres in de site is geconfigureerd, opent die direct als e-mail; anders kunt u de samenvatting kopiëren.",
          },
          {
            question: "Is dit alleen voor tandartspraktijken?",
            answer:
              "Tandartspraktijken zijn de eerste wedge, maar afspraak-intensieve private clinics kunnen ook relevant zijn wanneer dezelfde operationele pijn speelt.",
          },
        ],
        relatedPages: [
          buildRelatedLink("about", "Lees eerst over Renvoo", "Krijg de company- en productcontext voor u contact opneemt."),
          buildRelatedLink("useCases", "Bekijk use cases", "Ga direct naar de route die het best aansluit op uw vraag."),
          buildRelatedLink("privacy", "Bekijk privacy", "Controleer de smalle launch-posture en privacygrens."),
        ],
        cta: {
          eyebrow: "Nog niet klaar om het verzoek te sturen?",
          title: "Bekijk dan eerst de relevantste route voor uw praktijk.",
          body:
            "Veel teams willen eerst zien hoe Renvoo over tandartspraktijken, reminders of cancellation management denkt voordat ze een gesprek plannen.",
          primary: { pageKey: "useCases", label: "Bekijk de use cases" },
          secondary: { pageKey: "dentalClinics", label: "Start bij tandartspraktijken" },
        },
      },
      useCases: {
        type: "standard",
        seo: {
          title: "Renvoo use cases | Tandartspraktijken, reminders en cancellation management",
          description:
            "Verken de belangrijkste Renvoo use cases: tandartspraktijken, private clinics, no-show reduction, appointment reminders en cancellation management.",
        },
        hero: {
          eyebrow: "Use cases",
          title: "Kies de ingang die het best past bij uw operationele vraag.",
          lead:
            "Renvoo verkoopt geen abstract AI-verhaal. Deze pagina groepeert de concrete workflows waar afspraak-intensieve praktijken meestal eerst op zoeken.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { href: onePagerPath, label: "Download de one-pager" },
        },
        answer:
          "De kernuse-cases van Renvoo draaien om minder no-shows, betere appointment reminders, slimmer cancellation management en een duidelijkere aanpak voor tandartspraktijken en private clinics.",
        definitionTitle: "Welke routes zijn het belangrijkst?",
        definition:
          "Sommige bezoekers willen branche-specifieke taal, anderen willen direct weten hoe no-show reduction of appointment confirmation operationeel werkt. Daarom is de site opgesplitst in duidelijke, intent-gedreven pagina's.",
        audienceTitle: "Gebruik deze pagina als cluster-hub",
        audience: [
          "Start bij tandartspraktijken als u chair-time economics en dense schedules wilt zien.",
          "Start bij no-show reduction als u vooral het probleemdomein en de workflow zoekt.",
          "Start bij cancellation management als late afzeggingen en terugvullen de grootste pijn zijn.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Kernroutes",
            title: "De belangrijkste commerciële en informatieve pagina's",
            items: [
              {
                title: "Tandartspraktijken",
                body: "De scherpste wedge: lege stoeluren, dichte agenda's en directe economische pijn.",
                pageKey: "dentalClinics",
                label: "Open tandartspraktijken",
              },
              {
                title: "Private clinics",
                body: "Voor andere afspraak-intensieve private practices met vergelijkbare planningsstress.",
                pageKey: "privateClinics",
                label: "Open private clinics",
              },
              {
                title: "No-show reduction",
                body: "Voor bezoekers die direct zoeken naar software om gemiste afspraken te verminderen.",
                pageKey: "noShowReduction",
                label: "Open no-show reduction",
              },
              {
                title: "Appointment reminders",
                body: "Voor teams die willen snappen waar reminders ophouden en workflow automation begint.",
                pageKey: "appointmentReminders",
                label: "Open appointment reminders",
              },
              {
                title: "Cancellation management",
                body: "Voor praktijken die late afzeggingen, rescheduling en backfill beter willen organiseren.",
                pageKey: "cancellationManagement",
                label: "Open cancellation management",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "Hoe deze routes samenhangen",
            title: "Van branchevraag naar workflowvraag",
            leftTitle: "Branche-ingang",
            rightTitle: "Workflow-ingang",
            leftItems: [
              "Tandartspraktijken",
              "Private clinics",
              "Nederlandse context",
            ],
            rightItems: [
              "No-show reduction",
              "Appointment reminders",
              "Cancellation management en backfill",
            ],
          },
        ],
        faq: [
          {
            question: "Waarom niet alles op één pagina laten?",
            answer:
              "Omdat zoekintentie verschilt. Een praktijkhouder zoekt anders dan iemand die direct 'no-show software' of 'appointment reminder automation' intypt.",
          },
          {
            question: "Zijn deze pagina's alleen voor Google SEO?",
            answer:
              "Nee. De structuur helpt ook AI-search engines omdat elke pagina een duidelijk antwoord, definities, FAQ en interne route naar de volgende stap geeft.",
          },
        ],
        relatedPages: [
          buildRelatedLink("blogIndex", "Lees de blog", "Bekijk praktische posts voor operators."),
          buildRelatedLink("about", "Lees over Renvoo", "Krijg de product- en company-context erbij."),
          buildRelatedLink("contact", "Plan een workflow review", "Ga van informatie naar gesprek."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Wilt u weten welke route het best bij uw praktijk past?",
          body:
            "Dan is een kort workflowgesprek de snelste manier om te bepalen of uw grootste pijn eerder in reminders, no-show reduction of cancellation management zit.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "blogIndex", label: "Lees eerst de blog" },
        },
      },
      dentalClinics: {
        type: "standard",
        seo: {
          title: "Renvoo voor tandartspraktijken | Minder no-shows en minder lege stoeluren",
          description:
            "Zie waarom Renvoo begint bij Nederlandse tandartspraktijken: dichte agenda's, lege stoeluren, late afzeggingen en operationeel herstelwerk maken no-show software hier extra relevant.",
        },
        hero: {
          eyebrow: "Tandartspraktijken",
          title: "Waarom tandartspraktijken de scherpste eerste wedge zijn voor Renvoo",
          lead:
            "Tandartspraktijken voelen no-shows, late afzeggingen en onrust rond bevestigingen vaak direct in de dagplanning. Daardoor is de operationele waarde van betere workflow hier sneller zichtbaar.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { pageKey: "noShowReduction", label: "Bekijk no-show reduction" },
        },
        answer:
          "Voor tandartspraktijken is no-show software vooral relevant omdat lege stoeluren direct economisch voelbaar zijn en laat uitgevallen afspraken lastig op dezelfde dag te herstellen zijn.",
        definitionTitle: "Waarom dental-first?",
        definition:
          "Renvoo begint bij Nederlandse tandartspraktijken omdat de combinatie van hoge stoelwaarde, dichte agenda's en dagelijkse front-desk stress hier een duidelijke en verkoopbare use case vormt.",
        audienceTitle: "Waar de pijn meestal zit",
        audience: [
          "Geen reactie op bevestigingen tot vlak voor de afspraak.",
          "Late afzeggingen met te weinig tijd om nog slim te schuiven.",
          "Handmatig herstelwerk om gaten in de agenda te voorkomen.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Praktijkrealiteit",
            title: "De dental context maakt elke gemiste afspraak duurder",
            items: [
              {
                title: "Hoge waarde per stoeluur",
                body: "Wanneer een stoel leeg blijft, is de misgelopen waarde vaak direct voelbaar in de dagelijkse operatie.",
              },
              {
                title: "Agenda's zijn dicht gepland",
                body: "Er is weinig slack om laat uitgevallen tijd nog netjes terug te winnen.",
              },
              {
                title: "Het team vangt de onzekerheid op",
                body: "Bevestigen, verplaatsen, nabellen en gaten vullen komen vaak terecht bij hetzelfde front-desk of praktijkmanagementteam.",
              },
            ],
          },
          {
            type: "steps",
            eyebrow: "Wat Renvoo hier wil verbeteren",
            title: "Drie manieren waarop de workflow rustiger kan worden",
            items: [
              {
                title: "Eerder zicht op risico",
                body: "Niet wachten tot het reminder-moment is verstreken, maar eerder weten welke afspraken extra aandacht nodig hebben.",
              },
              {
                title: "Gerichter bevestigen en verplaatsen",
                body: "Minder one-size-fits-all, meer focus op de afspraken waar onzekerheid duur wordt.",
              },
              {
                title: "Faster backfill thinking",
                body: "Wanneer een stoel vrijkomt, wil het team sneller kunnen schakelen rond wachtlijsten of eerdere slots zonder chaos.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Is Renvoo bedoeld om alle praktijksoftware te vervangen?",
            answer:
              "Nee. De huidige productrichting is juist laagfrictie: aansluiten op bestaande planning- en communicatieflows in plaats van alles vervangen.",
          },
          {
            question: "Werkt dit alleen voor grote praktijken?",
            answer:
              "Niet per se. De pijn is vaak juist scherp in kleinere of middelgrote praktijken waar elke lege stoel direct opvalt en het team beperkte herstelcapaciteit heeft.",
          },
        ],
        relatedPages: [
          buildRelatedLink("appointmentReminders", "Lees over appointment reminders", "Zie waarom reminders vaak nodig zijn maar niet voldoende."),
          buildRelatedLink("cancellationManagement", "Lees over cancellation management", "Ga dieper in op late afzeggingen en herstel."),
          buildRelatedLink("contact", "Plan een workflow review", "Bespreek hoe dit zich vertaalt naar uw praktijk."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Wilt u deze dental use case spiegelen aan uw agenda?",
          body:
            "Dan is een kort gesprek over no-shows, bevestigingen en laat vrijgekomen stoeluren de snelste manier om te zien of een pilot logisch is.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "cancellationManagement", label: "Bekijk cancellation management" },
        },
      },
      privateClinics: {
        type: "standard",
        seo: {
          title: "Renvoo voor private clinics | Scheduling automation voor afspraak-intensieve praktijken",
          description:
            "Bekijk hoe Renvoo ook relevant is voor afspraak-intensieve private clinics die no-shows, late afzeggingen en lege capaciteit operationeel beter willen opvangen.",
        },
        hero: {
          eyebrow: "Private clinics",
          title: "Ook buiten tandartspraktijken speelt dezelfde operationele pijn",
          lead:
            "Tandartspraktijken zijn de eerste wedge, maar andere private clinics voelen vaak dezelfde combinatie van no-shows, late afzeggingen en onrustig herstelwerk rond de agenda.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { pageKey: "useCases", label: "Terug naar use cases" },
        },
        answer:
          "Renvoo kan ook relevant zijn voor private clinics waar afspraken dicht gepland zijn, lege slots direct pijn doen en het team veel handmatig herstelwerk verricht rond confirmations en rescheduling.",
        definitionTitle: "Welke clinics passen hier het best?",
        definition:
          "Niet elke zorgorganisatie is de juiste eerste fit. De beste overlap zit bij private practices waar afspraakcapaciteit direct omzet, teambelasting of geplande productie beïnvloedt.",
        audienceTitle: "Signalen van fit",
        audience: [
          "U voelt leeggevallen tijd direct in omzet of benutting.",
          "Uw team is tijd kwijt aan reminder-, confirmatie- en verplaatsingswerk.",
          "Laat uitgevallen tijd is moeilijk genoeg om handmatig te herstellen.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Waar overlap ontstaat",
            title: "De branchenaam verandert, de workflowpijn vaak niet",
            items: [
              {
                title: "Dense daily scheduling",
                body: "Wanneer de dag strak gepland is, maken no-shows en late afzeggingen de planning direct instabiel.",
              },
              {
                title: "Operator pressure",
                body: "Het team moet reageren op onzekerheid terwijl patiëntcommunicatie en planning doorlopen.",
              },
              {
                title: "Recovery matters",
                body: "De waarde zit niet alleen in voorkomen, maar ook in sneller kunnen denken in verplaatsen en terugvullen.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Is deze pagina een bredere productbelofte dan de huidige wedge?",
            answer:
              "Nee. Ze laat zien waar overlap mogelijk is, maar de scherpste huidige go-to-market blijft tandartspraktijken in Nederland.",
          },
        ],
        relatedPages: [
          buildRelatedLink("dentalClinics", "Bekijk de dental wedge", "Zie waar de eerste markt het scherpst is."),
          buildRelatedLink("noShowReduction", "Lees over no-show reduction", "Ga van branche-overlap naar workflowprobleem."),
          buildRelatedLink("contact", "Plan een workflow review", "Bespreek of uw clinic op de huidige fit lijkt."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Twijfelt u of uw clinic binnen de huidige wedge valt?",
          body:
            "Een kort gesprek maakt snel duidelijk of uw operationele patroon genoeg lijkt op de eerste dental use case of dat de timing later beter is.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "dentalClinics", label: "Bekijk de dental use case" },
        },
      },
      noShowReduction: {
        type: "standard",
        seo: {
          title: "No-show reduction software | Hoe Renvoo gemiste afspraken operationeel benadert",
          description:
            "Lees hoe Renvoo no-show reduction benadert voor Nederlandse klinieken: eerder risico zien, gerichter bevestigen en vrijgekomen capaciteit sneller herstellen.",
        },
        hero: {
          eyebrow: "No-show reduction",
          title: "No-show reduction software moet méér doen dan herinneringen sturen.",
          lead:
            "Gemiste afspraken verminderen vraagt meestal om eerder risicosignalen, gerichtere confirmatie en een duidelijker herstelproces wanneer een afspraak toch uitvalt.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { pageKey: "appointmentReminders", label: "Bekijk appointment reminders" },
        },
        answer:
          "No-show reduction software is pas echt waardevol wanneer het teams helpt eerdere signalen te zien, gericht te handelen en vrijgevallen capaciteit sneller te herstellen.",
        definitionTitle: "Wat bedoelen we met no-show reduction?",
        definition:
          "Niet alleen minder no-shows tellen, maar ook de operationele keten daaromheen verbeteren: confirmations, rescheduling, waitlist/backfill en minder reactief front-desk werk.",
        audienceTitle: "Waar veel teams vastlopen",
        audience: [
          "De reminder is verstuurd, maar er is nog steeds onzekerheid.",
          "Het team weet te laat welke afspraak echt risico loopt.",
          "Herstel begint pas wanneer de stoel al grotendeels verloren is.",
        ],
        sections: [
          {
            type: "steps",
            eyebrow: "Renvoo's aanpak",
            title: "Drie lagen van no-show reduction",
            items: [
              {
                title: "Detect",
                body: "Breng eerder in beeld welke afspraken waarschijnlijker uitvallen of te laat bevestigd worden.",
              },
              {
                title: "Confirm & reschedule",
                body: "Zorg dat het team gerichter kan bevestigen, opvolgen of verplaatsen voordat de planning stukloopt.",
              },
              {
                title: "Recover",
                body: "Wanneer een slot vrijkomt, moet de workflow helpen sneller te denken in backfill en herstel.",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "Belangrijk onderscheid",
            title: "No-show reduction is breder dan reminders",
            leftTitle: "Beperkte aanpak",
            rightTitle: "Operationele aanpak",
            leftItems: [
              "Eén reminderflow voor alle afspraken",
              "Geen echte prioritering van risico",
              "Weinig ondersteuning rond laat vrijgekomen tijd",
            ],
            rightItems: [
              "Eerder zicht op risicovolle afspraken",
              "Gerichtere confirmatie en verplaatsing",
              "Sneller herstel van vrijgevallen capaciteit",
            ],
          },
        ],
        faq: [
          {
            question: "Betekent no-show reduction dat no-shows verdwijnen?",
            answer:
              "Nee. Het doel is niet een magisch nulresultaat, maar een rustiger, beter meetbaar proces rond voorkomen én herstellen.",
          },
          {
            question: "Past dit ook wanneer we al reminders hebben?",
            answer:
              "Juist dan is de vraag relevant. Veel praktijken hebben reminders, maar missen nog steeds een goede workflow voor onzekerheid, no-response en herstel.",
          },
        ],
        relatedPages: [
          buildRelatedLink("appointmentReminders", "Lees over appointment reminders", "Zie waar reminders ophouden."),
          buildRelatedLink("cancellationManagement", "Lees over cancellation management", "Ga dieper in op late uitval en backfill."),
          buildRelatedLink("contact", "Plan een workflow review", "Bekijk waar uw huidige proces hapert."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Wilt u no-show reduction spiegelen aan uw huidige praktijkproces?",
          body:
            "Plan dan een kort gesprek rond confirmations, no-response, late afzeggingen en de vraag hoe snel uw team nu nog kan herstellen.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "appointmentReminders", label: "Bekijk reminders" },
        },
      },
      appointmentReminders: {
        type: "standard",
        seo: {
          title: "Appointment reminder automation | Waarom reminders alleen vaak niet genoeg zijn",
          description:
            "Lees hoe Renvoo appointment reminder automation positioneert: reminders blijven nuttig, maar echte no-show reduction vraagt ook bevestiging, rescheduling en herstelworkflow.",
        },
        hero: {
          eyebrow: "Appointment reminders",
          title: "Appointment reminder automation is nuttig, maar zelden genoeg.",
          lead:
            "Veel praktijken sturen al reminders. De echte vraag is wat er gebeurt wanneer een patiënt niet reageert, laat afzegt of wanneer het team te laat merkt dat een afspraak onrustig wordt.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { pageKey: "noShowReduction", label: "Bekijk no-show reduction" },
        },
        answer:
          "Appointment reminder automation blijft belangrijk, maar lost niet vanzelf het bredere probleem op van no-response, late afzeggingen en handmatig herstel rond de agenda.",
        definitionTitle: "Waar eindigt reminder automation?",
        definition:
          "Een reminder helpt herinneren. Een operationele workflow helpt ook prioriteren, bevestigen, verplaatsen en herstellen zodra standaard reminders niet genoeg blijken.",
        audienceTitle: "Veelvoorkomende reminder-gaps",
        audience: [
          "Iedereen krijgt dezelfde flow, ook al is het risico per afspraak anders.",
          "No-response is zichtbaar, maar er is geen duidelijke volgende stap.",
          "Laat vrijgevallen tijd blijft lastig om opnieuw te benutten.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Wat reminders wel doen",
            title: "Reminders blijven onderdeel van de oplossing",
            items: [
              {
                title: "Herinneren",
                body: "Reminders zijn zinvol om afspraken top-of-mind te houden en onbedoelde vergeetno-shows te verminderen.",
              },
              {
                title: "Bevestiging starten",
                body: "Ze zijn vaak het eerste moment in de flow waarop reactie, geen reactie of verplaatsingssignalen zichtbaar worden.",
              },
              {
                title: "Maar niet genoeg",
                body: "Zodra onzekerheid blijft bestaan, verschuift de vraag van 'herinneren' naar 'wat doet het team nu?'.",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "Reminder tool versus workflowlaag",
            title: "Waar Renvoo in theorie boven reminders uitstijgt",
            leftTitle: "Reminder automation",
            rightTitle: "Workflow automation",
            leftItems: [
              "Bericht uitsturen",
              "Reageren op directe bevestiging",
              "Beperkte grip op no-response",
            ],
            rightItems: [
              "Risico eerder zien",
              "Gericht bevestigen of verplaatsen",
              "Sneller denken in herstel en backfill",
            ],
          },
        ],
        faq: [
          {
            question: "Betekent dit dat reminders niet meer nodig zijn?",
            answer:
              "Nee. Reminders blijven nuttig. De vraag is vooral hoe de workflow verdergaat als een reminder niet genoeg blijkt.",
          },
          {
            question: "Moet Renvoo dan alle communicatie overnemen?",
            answer:
              "Niet in de huidige posture. De praktijk houdt controle. Renvoo is bedoeld als operationele laag rond de beslismomenten, niet als los consumentenkanaal.",
          },
        ],
        relatedPages: [
          buildRelatedLink("noShowReduction", "Lees over no-show reduction", "Ga van reminders naar het bredere operationele probleem."),
          buildRelatedLink("cancellationManagement", "Lees over cancellation management", "Zie hoe uitval en herstel samenhangen."),
          buildRelatedLink("contact", "Plan een workflow review", "Bespreek waar uw huidige reminderflow stopt."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Wilt u zien waar uw reminderflow ophoudt en herstelwerk begint?",
          body:
            "Een kort gesprek maakt snel zichtbaar of uw grootste pijn zit in bevestigen, no-response, rescheduling of laat vrijgekomen tijd.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "cancellationManagement", label: "Bekijk cancellation management" },
        },
      },
      cancellationManagement: {
        type: "standard",
        seo: {
          title: "Cancellation management voor klinieken | Van late afzegging naar sneller herstel",
          description:
            "Lees hoe Renvoo cancellation management voor klinieken benadert: eerder bevestigen, slimmer verplaatsen en vrijgekomen afspraakcapaciteit sneller herstellen.",
        },
        hero: {
          eyebrow: "Cancellation management",
          title: "Late afzeggingen zijn pas echt duur als de workflow te laat reageert.",
          lead:
            "Cancellation management gaat niet alleen over een afzegging registreren, maar over de vraag hoe snel een team kan bevestigen, verplaatsen en vrijgekomen tijd nog benutten.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { pageKey: "noShowReduction", label: "Bekijk no-show reduction" },
        },
        answer:
          "Goede cancellation management software helpt teams late afzeggingen eerder signaleren, rescheduling rustiger organiseren en terugvullen sneller activeren wanneer er tijd vrijkomt.",
        definitionTitle: "Wat hoort bij cancellation management?",
        definition:
          "Niet alleen de afzegging zelf, maar ook confirmatie, verplaatsing, wachtlijstdenken en het teamproces rond vrijgevallen capaciteit.",
        audienceTitle: "Waar het vaak misgaat",
        audience: [
          "De afzegging komt binnen, maar iedereen ziet het te laat.",
          "Er is geen vast moment om te beslissen over verplaatsen of terugvullen.",
          "Wachtlijst- of backfill-logica zit in hoofden, notities of losse lijstjes.",
        ],
        sections: [
          {
            type: "steps",
            eyebrow: "De workflow die ertoe doet",
            title: "Van bevestigen naar backfill",
            items: [
              {
                title: "Bevestiging",
                body: "Hoe eerder onzekerheid zichtbaar wordt, hoe groter het herstelvenster bij mogelijke uitval.",
              },
              {
                title: "Rescheduling",
                body: "Wanneer een afspraak moet schuiven, wil het team duidelijke opties en minder handmatige frictie.",
              },
              {
                title: "Backfill",
                body: "Vrijgekomen tijd terugwinnen is vaak waar de economische waarde van cancellation management echt zichtbaar wordt.",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Waarom dit anders is dan alleen administratie",
            title: "Cancellation management is een opbrengstvraag, geen registratietaak",
            items: [
              {
                title: "Meer herstelvenster",
                body: "Eerder zicht op risico vergroot de kans om een vrijgekomen slot nog zinnig te hergebruiken.",
              },
              {
                title: "Minder ad-hoc front-desk druk",
                body: "Een duidelijkere workflow verkleint de kans dat herstelwerk alleen reactief en handmatig gebeurt.",
              },
              {
                title: "Meer rust voor de planning",
                body: "Het doel is niet meer complexiteit, maar minder chaos rond laat vrijgekomen tijd.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Moet een praktijk altijd een no-show fee inzetten?",
            answer:
              "Niet per se. Renvoo gaat niet primair over fee-beleid, maar over workflow: eerder signaleren, beter bevestigen en sneller herstellen.",
          },
          {
            question: "Is backfill hetzelfde als een open marktplaats?",
            answer:
              "Nee. De huidige posture blijft smal en praktijkgestuurd. Backfill betekent hier vooral operationeel slimmer omgaan met vrijgekomen tijd onder controle van de praktijk.",
          },
        ],
        relatedPages: [
          buildRelatedLink("appointmentReminders", "Lees over reminders", "Zie hoe cancellation management aansluit op confirmatieflows."),
          buildRelatedLink("dentalClinics", "Lees de dental use case", "Bekijk waar late afzeggingen extra pijnlijk worden."),
          buildRelatedLink("contact", "Plan een workflow review", "Bespreek hoe uw team nu uitval opvangt."),
        ],
        cta: {
          eyebrow: "Volgende stap",
          title: "Wilt u cancellation management spiegelen aan uw huidige teamproces?",
          body:
            "Plan dan een kort gesprek over confirmations, verplaatsingen, wachtlijsten en hoe snel een laat vrijgevallen stoel nu echt te herstellen is.",
          primary: { pageKey: "contact", label: "Plan het gesprek" },
          secondary: { pageKey: "dentalClinics", label: "Bekijk tandartspraktijken" },
        },
      },
      blogIndex: {
        type: "blogIndex",
        seo: {
          title: "Renvoo blog | No-shows, reminders en clinic operations",
          description:
            "Lees praktische blogposts over no-show reduction, appointment reminders, cancellation management en clinic operations voor Nederlandse tandartspraktijken en private clinics.",
        },
        hero: {
          eyebrow: "Blog",
          title: "Praktische content voor clinic decision-makers",
          lead:
            "Geen AI-theater, maar concrete posts over reminders, cancellations, no-shows, terugvullen en workflowfrictie in afspraak-intensieve praktijken.",
          primary: { pageKey: "contact", label: "Plan een workflow review" },
          secondary: { pageKey: "useCases", label: "Bekijk de use cases" },
        },
      },
      privacy: {
        type: "legal",
        seo: {
          title: "Renvoo privacy | Smalle website- en lead-capture posture",
          description:
            "Pre-launch privacy note voor Renvoo's website, lead capture en pilot outreach flow.",
        },
        hero: {
          eyebrow: "Privacy",
          title: "Smalle privacy-posture voor website en outreach",
          lead:
            "Deze pagina beschrijft Renvoo's huidige privacygrens voor de eigen website, lead capture en pilot outreach. Voor live launch moeten definitieve contactgegevens en vendor-keuzes worden ingevuld.",
        },
        cards: [
          {
            title: "Wat deze pagina dekt",
            body: "De eigen website van Renvoo, contactverzoeken en zakelijke pilotcommunicatie. Niet de privacy notice van de kliniek richting patiënten.",
          },
          {
            title: "Welke data Renvoo direct kan ontvangen",
            body: "Naam, praktijk, zakelijke contactgegevens, contactberichten en technische beveiligingsinformatie die nodig is om de site veilig te beheren.",
          },
          {
            title: "Huidige launch-posture",
            body: "Clinic SaaS, geen patiëntportaal, geen niet-noodzakelijke cookies standaard en een bewust smalle set van publieke websiteprocessen.",
          },
        ],
        cta: {
          eyebrow: "Verder lezen",
          title: "Bekijk ook de patiëntbericht-notitie",
          body: "Die beschrijft de smalle, clinic-gestuurde messaging-posture voor de eerste pilotfase.",
          primary: { pageKey: "patientNotice", label: "Bekijk patiëntbericht" },
          secondary: { pageKey: "contact", label: "Plan een gesprek" },
        },
      },
      patientNotice: {
        type: "legal",
        seo: {
          title: "Renvoo patiëntbericht | Smalle notitie voor pilot-communicatie",
          description:
            "Pre-launch patiëntberichtnotitie voor clinic-gestuurde reminders, bevestigingen en reschedulinglinks in de eerste Renvoo-pilotfase.",
        },
        hero: {
          eyebrow: "Patiëntbericht",
          title: "Smalle notitie voor praktijkgestuurde afspraakcommunicatie",
          lead:
            "Deze pagina laat zien hoe de eerste patiëntgerichte uitleg rondom reminders, bevestigingen en rescheduling bewust beperkt blijft tot operationele afspraakcommunicatie.",
        },
        cards: [
          {
            title: "Wat het wel is",
            body: "Een korte uitleg dat een kliniek Renvoo kan inzetten voor afspraakbevestiging, verplaatsing en operationele communicatie rond vrijgekomen tijd.",
          },
          {
            title: "Wat het niet is",
            body: "Geen patiëntaccount, geen diagnose-tool en geen medische adviesdienst.",
          },
          {
            title: "Rol van de kliniek",
            body: "De kliniek blijft verantwoordelijk voor de zorgrelatie en voor de bredere privacycommunicatie richting patiënten.",
          },
        ],
        cta: {
          eyebrow: "Verder lezen",
          title: "Bekijk ook de website-privacygrens",
          body: "Samen vormen deze pagina's de smalle trust-posture voor de eerste publieke versie van de site.",
          primary: { pageKey: "privacy", label: "Bekijk privacy" },
          secondary: { pageKey: "contact", label: "Plan een gesprek" },
        },
      },
      notFound: {
        type: "notFound",
        seo: {
          title: "Renvoo | Pagina niet gevonden",
          description: "De gevraagde Renvoo-pagina is niet gevonden.",
        },
        hero: {
          eyebrow: "404",
          title: "Deze pagina bestaat niet meer of is verplaatst.",
          lead: "Gebruik de hoofdroute hieronder om terug te gaan naar de commerciële of informatieve pagina's van Renvoo.",
        },
      },
    },
  },
  en: {
    htmlLang: "en",
    locale: "en-US",
    switchLabel: "NL",
    brand: sharedBrand,
    nav: {
      home: "Home",
      useCases: "Use Cases",
      about: "About",
      blogIndex: "Blog",
      contact: "Contact",
      cta: "Book a workflow review",
    },
    pageNames: {
      home: "Home",
      about: "About",
      contact: "Contact",
      useCases: "Use Cases",
      dentalClinics: "Dental Clinics",
      privateClinics: "Private Clinics",
      noShowReduction: "No-Show Reduction",
      appointmentReminders: "Appointment Reminders",
      cancellationManagement: "Cancellation Management",
      blogIndex: "Blog",
      privacy: "Privacy",
      patientNotice: "Patient Notice",
      notFound: "Not Found",
    },
    footer: sharedFooter(
      "Renvoo is an early Dutch healthtech company focused on reducing missed appointments, late cancellations, and manual recovery work in appointment-heavy clinics.",
      "Built around operational logic and pilot validation, not inflated traction claims.",
    ),
    contactForm: {
      title: "Request a short workflow review",
      intro:
        "Use this form to prepare a short conversation about no-shows, late cancellations, and recovered capacity. Without a backend, the site creates a clean email-ready summary and copy fallback.",
      fields: {
        name: "Name",
        clinic: "Clinic name",
        role: "Role",
        email: "Work email",
        phone: "Phone number (optional)",
        challenge: "Main operational challenge",
        preferredTime: "Preferred day or time",
        notes: "Extra context",
      },
      roles: ["Owner", "Practice manager", "Operations", "Front-desk lead", "Other"],
      buttons: {
        submit: "Create request summary",
        copy: "Copy summary",
        mail: "Open email",
      },
      validation: {
        required: "Please fill in this field.",
        email: "Use a valid email address.",
      },
      success:
        "The request summary is ready. If a public contact email is configured, the site can open the email draft; otherwise you can copy the summary directly.",
      missingEmail:
        "No public contact email is configured yet. Copy the summary and send it through your preferred channel.",
      mailSubject: "Renvoo workflow review request",
    },
    blog: {
      eyebrow: "Blog",
      title: "Practical content for appointment-heavy clinics",
      intro:
        "The Renvoo blog is written for clinic owners, practice managers, and operations leaders who want fewer missed appointments and less scheduling friction.",
      featuredLabel: "Featured articles",
      emptyLabel: "There are no published articles in this language yet.",
      readMore: "Read article",
      backToBlog: "Back to the blog",
      sourcesTitle: "Sources",
      faqTitle: "Frequently asked questions",
      relatedTitle: "Related reading",
      ctaTitle: "Want to translate this into your own workflow?",
      ctaBody:
        "The best next step is a short workflow review around no-shows, late cancellations, and how your team currently tries to recover lost appointment capacity.",
      ctaPrimary: "Book a workflow review",
    },
    pages: {
      home: {
        type: "home",
        seo: {
          title: "Renvoo | No-show software for dental clinics and private practices",
          description:
            "Renvoo helps dental clinics and appointment-heavy private practices reduce missed appointments, handle late cancellations earlier, and recover lost capacity without adding admin workload.",
        },
        hero: {
          eyebrow: "No-show software for Dutch dental clinics and private practices",
          title: "Fewer no-shows. Fewer empty slots. Less recovery chaos.",
          lead:
            "Renvoo helps clinics spot risky appointments earlier, guide confirmations and rescheduling more deliberately, and recover otherwise lost appointment capacity without building another patient platform.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { href: onePagerPath, label: "Download the one-pager" },
          badges: ["Dental clinics first", "No patient accounts in v1", "Non-clinical data boundary"],
        },
        answer:
          "Renvoo is operational software for appointment-heavy clinics that want to reduce missed appointments, respond earlier to late cancellations, and recover freed capacity with less manual admin work.",
        definitionTitle: "What is Renvoo?",
        definition:
          "Renvoo is not a generic reminder tool and not clinical AI. It is a workflow layer around appointment risk: see uncertainty earlier, confirm or reschedule more deliberately, and recover freed capacity sooner.",
        audienceTitle: "Who is this for?",
        audience: [
          "Clinic owners who feel the revenue impact of empty appointments directly.",
          "Practice managers who own confirmations, rescheduling, and operational calm.",
          "Appointment-heavy private clinics where lost slots create immediate friction.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Why this matters",
            title: "The cost is bigger than the missed appointment itself.",
            intro:
              "The damage shows up in lost revenue, unstable schedules, and extra manual recovery work around confirmations and rescheduling.",
            items: [
              {
                title: "Empty slots hit realized revenue",
                body: "Booked time only creates value if the patient shows up or the slot can still be recovered in time.",
              },
              {
                title: "Late cancellations are still expensive",
                body: "Even when patients notify the clinic, the timing is often too late for smooth recovery.",
              },
              {
                title: "Recovery work lands on the team",
                body: "Confirming, calling, rescheduling, and backfilling all become reactive admin load when the schedule turns uncertain.",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Start with the right route",
            title: "Use the path that matches your intent",
            items: [
              {
                title: "Dental clinics",
                body: "For dense schedules, valuable chair time, and daily no-show pressure.",
                pageKey: "dentalClinics",
                label: "View dental clinics",
              },
              {
                title: "No-show reduction",
                body: "For visitors searching directly for missed-appointment prevention software.",
                pageKey: "noShowReduction",
                label: "View no-show reduction",
              },
              {
                title: "Cancellation management",
                body: "For teams focused on late cancellations, rescheduling, and backfill.",
                pageKey: "cancellationManagement",
                label: "View cancellation management",
              },
            ],
          },
          {
            type: "steps",
            eyebrow: "How it works",
            title: "From risk visibility to recovered capacity",
            intro:
              "The product logic stays deliberately operational: no clinical decisions, no patient platform in v1, and a narrow workflow around risky appointments.",
            items: [
              {
                title: "Spot risky appointments earlier",
                body: "Use scheduling and communication signals to see where uncertainty is rising before the standard reminder flow is finished.",
              },
              {
                title: "Confirm or reschedule more deliberately",
                body: "Give the team a clearer reason to confirm, follow up, or move an appointment before the slot is lost.",
              },
              {
                title: "Recover freed time faster",
                body: "Think sooner in waitlists, earlier slots, and practical recovery without handing over schedule control.",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "Why this is different",
            title: "Reminder-only versus operational workflow software",
            leftTitle: "Reminder-only tools",
            rightTitle: "Renvoo",
            leftItems: [
              "The same flow for nearly every appointment",
              "Risk becomes visible late",
              "Front-desk teams recover gaps reactively",
            ],
            rightItems: [
              "Risk is surfaced earlier",
              "Confirmation, rescheduling, and recovery sit in one flow",
              "The clinic keeps control with less reactive work",
            ],
          },
        ],
        faq: [
          {
            question: "Is Renvoo only for dental clinics?",
            answer:
              "Dental clinics are the first wedge because the economics and workflow pain are so clear there. The same logic may later apply to other appointment-heavy private clinics.",
          },
          {
            question: "Is this a patient app or portal?",
            answer:
              "No. The current direction is explicitly clinic SaaS: operational software for the clinic team, without patient accounts in v1.",
          },
          {
            question: "Does Renvoo need clinical data?",
            answer:
              "The current posture is deliberately narrow: administrative scheduling and communication data first, not diagnoses, treatment decisions, or clinical notes.",
          },
        ],
        relatedPages: [
          buildRelatedLink("useCases", "View all use cases", "See the site split by clear intent."),
          buildRelatedLink("about", "Read what Renvoo is and is not", "Get the company and product context without fluff."),
          buildRelatedLink("contact", "Book a workflow review", "Move from reading to a practical conversation."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Want to map this onto your own clinic workflow?",
          body:
            "Book a short workflow review around no-shows, late cancellations, confirmations, and how your team currently tries to recover freed capacity.",
          primary: { pageKey: "contact", label: "Book the workflow review" },
          secondary: { pageKey: "useCases", label: "Explore the use cases first" },
        },
      },
      about: {
        type: "standard",
        seo: {
          title: "About Renvoo | Dutch healthtech for no-shows and appointment recovery",
          description:
            "Read what Renvoo is, why the wedge starts with dental clinics, and why the product posture stays operational and non-clinical.",
        },
        hero: {
          eyebrow: "About Renvoo",
          title: "A Dutch healthtech company with a deliberately narrow operational wedge.",
          lead:
            "Renvoo is built around a simple idea: missed appointments are not only a patient behavior issue, they are a workflow and recovery problem for the clinic.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { href: onePagerPath, label: "Download the one-pager" },
        },
        answer:
          "Renvoo is an early Dutch healthtech company focused first on helping private dental clinics lose less capacity to missed appointments, late cancellations, and manual recovery work.",
        definitionTitle: "Why start there?",
        definition:
          "The sharpest current wedge is Dutch dental clinics: dense schedules, valuable chair time, and buyers who feel the pain of wasted capacity directly.",
        audienceTitle: "What Renvoo is not",
        audience: [
          "Not a patient portal or consumer app.",
          "Not clinical AI for diagnosis or treatment advice.",
          "Not a broad hospital platform in the first phase.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Why dental-first",
            title: "The first market is small on purpose",
            items: [
              {
                title: "Empty chair time is visible immediately",
                body: "A missed dental appointment is not an abstract KPI issue. It is directly felt in realized capacity and daily operations.",
              },
              {
                title: "Schedules leave little recovery room",
                body: "Late cancellations often leave too little time to respond smoothly on the same day.",
              },
              {
                title: "The buyer lives in the workflow",
                body: "Owners and practice managers feel the pain of no-shows, reminders, and rescheduling themselves.",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Product boundary",
            title: "What Renvoo does and does not promise",
            items: [
              {
                title: "Does",
                body: "Targets the operational workflow around risky appointments, confirmations, rescheduling, and recovery of freed capacity.",
              },
              {
                title: "Does not",
                body: "Analyze clinical notes, make treatment decisions, or launch as a patient account platform in v1.",
              },
              {
                title: "Stays pilot-first",
                body: "The current proof posture is operational logic plus pilot validation, not exaggerated traction claims.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Why not go after all of healthcare at once?",
            answer:
              "Because the dental wedge is clearer today. A tighter wedge gives sharper product learning and a more credible commercial story.",
          },
          {
            question: "Why not just sell a reminder tool?",
            answer:
              "Because the real pain often starts after reminders stop being enough. Renvoo focuses on the workflow around uncertainty, not just message sending.",
          },
        ],
        relatedPages: [
          buildRelatedLink("dentalClinics", "Read the dental clinics page", "See why the first wedge is so sharp."),
          buildRelatedLink("useCases", "View the use cases", "Move from company context to concrete workflow routes."),
          buildRelatedLink("contact", "Talk about your clinic", "Translate the thesis into your own operation."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Does your clinic feel the same pressure around no-shows and late cancellations?",
          body:
            "A short workflow conversation is more useful than more product copy. We can look at confirmations, rescheduling, and how your team currently recovers lost time.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "dentalClinics", label: "See the dental use case" },
        },
      },
      contact: {
        type: "contact",
        seo: {
          title: "Contact Renvoo | Request a short workflow review",
          description:
            "Request a short workflow review about no-shows, late cancellations, and freed appointment capacity in your dental clinic or private practice.",
        },
        hero: {
          eyebrow: "Contact",
          title: "Start with a short workflow review, not a heavy demo.",
          lead:
            "The first conversation is meant to understand your current no-show, confirmation, and recovery process. Only then can we judge whether a light pilot makes sense.",
          primary: { pageKey: "contact", label: "Fill in the request" },
          secondary: { href: onePagerPath, label: "Download the one-pager" },
        },
        answer:
          "The best first conversation for Renvoo is a short call with an owner, practice manager, or operations lead who understands the daily scheduling pain directly.",
        definitionTitle: "What should you expect?",
        definition:
          "Not a theatrical sales demo. A practical conversation about missed appointments, late cancellations, confirmations, rescheduling, and how your team currently tries to recover freed capacity.",
        audienceTitle: "Who is this most relevant for?",
        audience: [
          "Owners who care directly about realized capacity.",
          "Practice managers who oversee confirmations, planning, and front-desk pressure.",
          "Operations leads in appointment-heavy private clinics.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "What we cover",
            title: "Small enough for a first yes or no",
            items: [
              {
                title: "Current workflow",
                body: "How are appointments confirmed, when does uncertainty become visible, and where does the schedule start to break down?",
              },
              {
                title: "Signals and constraints",
                body: "Which data or tooling do you already have, and where is the team still too reactive?",
              },
              {
                title: "Pilot fit",
                body: "Is the operational pain real enough to justify a small, measurable pilot?",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Do we need to be ready for a pilot already?",
            answer:
              "No. The contact point is meant to determine whether a pilot even makes sense. Many conversations stay at workflow validation first.",
          },
          {
            question: "What if there is no public contact email configured yet?",
            answer:
              "The form still creates a clean summary. If a public contact email is configured, the site can open an email draft; otherwise you can copy the summary directly.",
          },
        ],
        relatedPages: [
          buildRelatedLink("about", "Read about Renvoo first", "Get the company and product context before you reach out."),
          buildRelatedLink("useCases", "Explore the use cases", "Go to the route that best matches your intent."),
          buildRelatedLink("privacy", "Read the privacy note", "Check the narrow launch posture and privacy boundary."),
        ],
        cta: {
          eyebrow: "Not ready to send the request yet?",
          title: "Start with the most relevant route for your clinic.",
          body:
            "Many visitors want to read the dental, reminders, or cancellation-management pages before they ask for a workflow review.",
          primary: { pageKey: "useCases", label: "See the use cases" },
          secondary: { pageKey: "dentalClinics", label: "Start with dental clinics" },
        },
      },
      useCases: {
        type: "standard",
        seo: {
          title: "Renvoo use cases | Dental clinics, reminders, and cancellation management",
          description:
            "Explore the main Renvoo use cases: dental clinics, private clinics, no-show reduction, appointment reminders, and cancellation management.",
        },
        hero: {
          eyebrow: "Use cases",
          title: "Choose the route that matches your operational question.",
          lead:
            "Renvoo does not sell an abstract AI story. This page groups the concrete workflows and verticals that visitors usually search for first.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { href: onePagerPath, label: "Download the one-pager" },
        },
        answer:
          "The core Renvoo use cases revolve around fewer no-shows, better appointment reminders, clearer cancellation management, and a strong fit for dental clinics and other appointment-heavy private practices.",
        definitionTitle: "Why split the site this way?",
        definition:
          "Some visitors want vertical-specific language. Others want to understand the workflow problem first. Splitting the site by clear intent makes both Google and AI search easier to satisfy.",
        audienceTitle: "Use this page as the cluster hub",
        audience: [
          "Start with dental clinics if you want the strongest current wedge.",
          "Start with no-show reduction if your main question is the workflow problem itself.",
          "Start with cancellation management if late cancellations and backfill are the biggest pain.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Core routes",
            title: "The main commercial and informational pages",
            items: [
              {
                title: "Dental clinics",
                body: "The sharpest wedge: valuable chair time, dense schedules, and direct workflow pain.",
                pageKey: "dentalClinics",
                label: "Open dental clinics",
              },
              {
                title: "Private clinics",
                body: "For other appointment-heavy private practices with similar scheduling pressure.",
                pageKey: "privateClinics",
                label: "Open private clinics",
              },
              {
                title: "No-show reduction",
                body: "For visitors searching directly for software to reduce missed appointments.",
                pageKey: "noShowReduction",
                label: "Open no-show reduction",
              },
              {
                title: "Appointment reminders",
                body: "For teams who want to understand where reminders end and workflow automation begins.",
                pageKey: "appointmentReminders",
                label: "Open appointment reminders",
              },
              {
                title: "Cancellation management",
                body: "For practices that need a better operational approach to late cancellations and backfill.",
                pageKey: "cancellationManagement",
                label: "Open cancellation management",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "How these routes work together",
            title: "From vertical question to workflow question",
            leftTitle: "Vertical route",
            rightTitle: "Workflow route",
            leftItems: ["Dental clinics", "Private clinics", "Dutch private-practice context"],
            rightItems: ["No-show reduction", "Appointment reminders", "Cancellation management and backfill"],
          },
        ],
        faq: [
          {
            question: "Why not keep everything on one long page?",
            answer:
              "Because search intent differs. Someone searching for dental clinic software needs a different answer from someone searching for no-show reduction or appointment reminder automation.",
          },
        ],
        relatedPages: [
          buildRelatedLink("blogIndex", "Read the blog", "See practical posts for clinic operators."),
          buildRelatedLink("about", "Read about Renvoo", "Add company and product context."),
          buildRelatedLink("contact", "Book a workflow review", "Move from information to a practical conversation."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Want to know which route best matches your clinic?",
          body:
            "A short workflow conversation quickly shows whether your biggest pain sits in reminders, missed appointments, or cancellation recovery.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "blogIndex", label: "Read the blog first" },
        },
      },
      dentalClinics: {
        type: "standard",
        seo: {
          title: "Renvoo for dental clinics | Fewer no-shows and fewer empty chair hours",
          description:
            "See why Renvoo starts with dental clinics: dense schedules, valuable chair time, and daily no-show pressure make workflow software especially relevant here.",
        },
        hero: {
          eyebrow: "Dental clinics",
          title: "Why dental clinics are the sharpest first wedge for Renvoo",
          lead:
            "Dental clinics feel no-shows, late cancellations, and confirmation friction directly in the day-to-day schedule. That makes the operational value of better workflow easier to validate here first.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { pageKey: "noShowReduction", label: "See no-show reduction" },
        },
        answer:
          "For dental clinics, no-show software matters because empty chair time is immediately visible and late cancellations are hard to recover smoothly on the same day.",
        definitionTitle: "Why dental first?",
        definition:
          "Renvoo starts with Dutch dental clinics because the mix of valuable chair time, dense schedules, and direct buyer pain makes the use case commercially clear.",
        audienceTitle: "Where the pain usually shows up",
        audience: [
          "No response to confirmations until shortly before the appointment.",
          "Late cancellations with too little time left to recover the slot.",
          "Manual recovery work falling back on the same front-desk team.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Clinic reality",
            title: "The dental context makes missed appointments more expensive",
            items: [
              {
                title: "High value per chair hour",
                body: "An empty chair is often directly visible in realized revenue and utilization.",
              },
              {
                title: "Schedules are tightly packed",
                body: "There is often little slack to recover lost time smoothly once an appointment falls out.",
              },
              {
                title: "The team absorbs the uncertainty",
                body: "Confirmations, rescheduling, and gap recovery often hit the same front-desk or practice-management workflow.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Is Renvoo meant to replace all practice software?",
            answer:
              "No. The current direction is deliberately low-friction: fit around existing scheduling and communication workflows rather than replace everything.",
          },
        ],
        relatedPages: [
          buildRelatedLink("appointmentReminders", "Read about appointment reminders", "See why reminders matter but are not the whole answer."),
          buildRelatedLink("cancellationManagement", "Read about cancellation management", "Go deeper on late cancellations and recovery."),
          buildRelatedLink("contact", "Book a workflow review", "Translate the wedge into your own clinic."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Want to compare this dental use case to your own schedule?",
          body:
            "A short conversation about no-shows, confirmations, and freed chair time is the quickest way to see whether a pilot is realistic.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "cancellationManagement", label: "See cancellation management" },
        },
      },
      privateClinics: {
        type: "standard",
        seo: {
          title: "Renvoo for private clinics | Scheduling automation for appointment-heavy practices",
          description:
            "See how Renvoo can also fit appointment-heavy private clinics that want to handle missed appointments, late cancellations, and empty capacity more calmly.",
        },
        hero: {
          eyebrow: "Private clinics",
          title: "The vertical name changes, but the workflow pain often looks familiar",
          lead:
            "Dental clinics are the first wedge, but other appointment-heavy private clinics often feel the same combination of missed appointments, late cancellations, and reactive recovery work.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { pageKey: "useCases", label: "Back to the use cases" },
        },
        answer:
          "Renvoo can also be relevant for private clinics where empty slots hurt directly, reminders and rescheduling consume admin time, and late cancellations are difficult to recover.",
        definitionTitle: "Which clinics fit best?",
        definition:
          "The best overlap sits with private practices where appointment capacity maps closely to realized revenue, utilization, or staff pressure.",
        audienceTitle: "Signals of fit",
        audience: [
          "Lost time hurts immediately.",
          "The team spends too much time on reminders, confirmations, and rescheduling.",
          "Freed slots are difficult to recover manually once the day is underway.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "Where the overlap comes from",
            title: "The branch label changes, the operational pattern often does not",
            items: [
              {
                title: "Dense daily scheduling",
                body: "When the day is tightly planned, missed appointments and late cancellations quickly destabilize the calendar.",
              },
              {
                title: "Operator pressure",
                body: "The team is forced to absorb uncertainty while patient communication and planning continue in parallel.",
              },
              {
                title: "Recovery matters",
                body: "The value is not only prevention, but also a better workflow around rescheduling and backfill.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Does this page mean Renvoo is already broad across healthcare?",
            answer:
              "No. It explains where the pattern may overlap, but the sharpest current go-to-market remains Dutch dental clinics.",
          },
        ],
        relatedPages: [
          buildRelatedLink("dentalClinics", "See the dental wedge", "Understand where the first market is strongest."),
          buildRelatedLink("noShowReduction", "Read about no-show reduction", "Move from vertical fit to workflow fit."),
          buildRelatedLink("contact", "Book a workflow review", "Discuss whether your clinic resembles the current fit."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Not sure whether your clinic fits the current wedge?",
          body:
            "A short conversation can quickly show whether your operational pattern is close enough to the current dental-first motion or whether the timing is better later.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "dentalClinics", label: "See the dental use case" },
        },
      },
      noShowReduction: {
        type: "standard",
        seo: {
          title: "No-show reduction software | How Renvoo approaches missed appointments",
          description:
            "Read how Renvoo approaches no-show reduction for clinics: earlier risk visibility, more deliberate confirmation, and faster recovery of freed appointment capacity.",
        },
        hero: {
          eyebrow: "No-show reduction",
          title: "No-show reduction software should do more than send reminders.",
          lead:
            "Reducing missed appointments usually requires earlier risk visibility, more deliberate confirmation, and a clearer recovery workflow once an appointment still drops out.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { pageKey: "appointmentReminders", label: "See appointment reminders" },
        },
        answer:
          "No-show reduction software becomes valuable when it helps clinic teams see risk earlier, act more deliberately, and recover freed capacity faster.",
        definitionTitle: "What do we mean by no-show reduction?",
        definition:
          "Not only fewer missed appointments on paper, but a stronger operational chain around confirmations, rescheduling, waitlists, backfill, and less reactive admin work.",
        audienceTitle: "Where teams often get stuck",
        audience: [
          "The reminder went out, but the uncertainty remains.",
          "The team sees the risk too late.",
          "Recovery starts only when the slot is mostly lost already.",
        ],
        sections: [
          {
            type: "steps",
            eyebrow: "Renvoo's workflow view",
            title: "Three layers of no-show reduction",
            items: [
              {
                title: "Detect",
                body: "See which appointments are more likely to turn into no-shows or late changes sooner.",
              },
              {
                title: "Confirm and reschedule",
                body: "Give the team a clearer trigger to confirm, follow up, or move an appointment before the schedule breaks.",
              },
              {
                title: "Recover",
                body: "Once time is freed, the workflow should help the clinic think faster in backfill and recovery.",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "The key distinction",
            title: "No-show reduction is broader than reminders alone",
            leftTitle: "Limited approach",
            rightTitle: "Operational approach",
            leftItems: [
              "One reminder flow for everyone",
              "Little prioritization of risk",
              "Minimal help once time opens up late",
            ],
            rightItems: [
              "Earlier visibility into risky appointments",
              "More deliberate confirmation and rescheduling",
              "Faster recovery of freed capacity",
            ],
          },
        ],
        faq: [
          {
            question: "Does no-show reduction mean no-shows disappear entirely?",
            answer:
              "No. The goal is not a magical zero, but a calmer and more measurable workflow around both prevention and recovery.",
          },
          {
            question: "Does this still matter if we already have reminders?",
            answer:
              "Yes. Many clinics already send reminders but still lack a strong workflow for uncertainty, no response, and late recovery.",
          },
        ],
        relatedPages: [
          buildRelatedLink("appointmentReminders", "Read about appointment reminders", "See where reminder tools stop."),
          buildRelatedLink("cancellationManagement", "Read about cancellation management", "Go deeper on late changes and backfill."),
          buildRelatedLink("contact", "Book a workflow review", "See where your current process breaks down."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Want to compare no-show reduction to your current process?",
          body:
            "Book a short review of confirmations, no response, late cancellations, and how quickly your team can realistically recover freed time today.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "appointmentReminders", label: "See reminders" },
        },
      },
      appointmentReminders: {
        type: "standard",
        seo: {
          title: "Appointment reminder automation | Why reminders alone are often not enough",
          description:
            "Read how Renvoo positions appointment reminder automation: reminders stay useful, but real no-show reduction also needs confirmation, rescheduling, and recovery workflow.",
        },
        hero: {
          eyebrow: "Appointment reminders",
          title: "Appointment reminder automation is useful, but rarely sufficient.",
          lead:
            "Many clinics already send reminders. The real question is what happens when a patient does not respond, cancels late, or when the team sees the risk too late.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { pageKey: "noShowReduction", label: "See no-show reduction" },
        },
        answer:
          "Appointment reminder automation still matters, but it does not solve the broader workflow problem of uncertainty, no response, late cancellations, and manual recovery.",
        definitionTitle: "Where does reminder automation stop?",
        definition:
          "A reminder helps people remember. An operational workflow also helps the team prioritize, confirm, reschedule, and recover capacity once reminders are not enough.",
        audienceTitle: "Common reminder gaps",
        audience: [
          "The same flow is used for nearly every appointment.",
          "No response is visible, but there is no structured next step.",
          "Freed slots remain hard to reuse when the change comes late.",
        ],
        sections: [
          {
            type: "cards",
            eyebrow: "What reminders still do well",
            title: "Reminders remain part of the answer",
            items: [
              {
                title: "Keep the appointment top-of-mind",
                body: "Reminders remain useful for reducing pure forgetfulness.",
              },
              {
                title: "Start the confirmation moment",
                body: "They often create the first moment where response, no response, or change signals appear.",
              },
              {
                title: "But they do not finish the workflow",
                body: "Once uncertainty remains, the problem becomes what the team should do next, not whether a reminder was sent.",
              },
            ],
          },
          {
            type: "comparison",
            eyebrow: "Reminder tool versus workflow layer",
            title: "Where Renvoo aims to sit above reminder-only tooling",
            leftTitle: "Reminder automation",
            rightTitle: "Workflow automation",
            leftItems: ["Send the message", "Capture direct confirmation", "Limited support for no response"],
            rightItems: ["Surface risk earlier", "Guide confirmation or rescheduling", "Support faster recovery and backfill"],
          },
        ],
        faq: [
          {
            question: "Does this mean reminders are no longer needed?",
            answer:
              "No. Reminders still matter. The question is how the workflow continues when a reminder is not enough on its own.",
          },
        ],
        relatedPages: [
          buildRelatedLink("noShowReduction", "Read about no-show reduction", "Move from reminders to the broader workflow problem."),
          buildRelatedLink("cancellationManagement", "Read about cancellation management", "See how late cancellations connect to confirmation flows."),
          buildRelatedLink("contact", "Book a workflow review", "Discuss where your current reminder flow stops."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Want to see where your reminder flow ends and recovery work begins?",
          body:
            "A short conversation quickly shows whether your biggest friction sits in confirmations, no response, rescheduling, or freed appointment time.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "cancellationManagement", label: "See cancellation management" },
        },
      },
      cancellationManagement: {
        type: "standard",
        seo: {
          title: "Cancellation management for clinics | From late cancellation to faster recovery",
          description:
            "Read how Renvoo approaches cancellation management for clinics: earlier confirmation, smoother rescheduling, and faster recovery of freed appointment capacity.",
        },
        hero: {
          eyebrow: "Cancellation management",
          title: "Late cancellations become expensive when the workflow reacts too late.",
          lead:
            "Cancellation management is not only about recording a change. It is about how quickly a team can confirm, reschedule, and reuse newly freed time.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { pageKey: "noShowReduction", label: "See no-show reduction" },
        },
        answer:
          "Good cancellation management software helps teams surface late changes earlier, organize rescheduling more calmly, and activate backfill sooner when time opens up.",
        definitionTitle: "What belongs inside cancellation management?",
        definition:
          "Not just the cancellation itself, but the operational chain around confirmation, moving appointments, waitlists, and backfill once a slot is freed.",
        audienceTitle: "Where teams often struggle",
        audience: [
          "The cancellation comes in, but not everyone sees it fast enough.",
          "There is no clear moment to decide on rescheduling or backfill.",
          "Waitlist logic lives in people, notes, and ad hoc memory.",
        ],
        sections: [
          {
            type: "steps",
            eyebrow: "The workflow that matters",
            title: "From confirmation to backfill",
            items: [
              {
                title: "Confirmation",
                body: "The earlier uncertainty becomes visible, the larger the recovery window when a cancellation happens.",
              },
              {
                title: "Rescheduling",
                body: "If an appointment must move, the team needs clearer options and less manual friction.",
              },
              {
                title: "Backfill",
                body: "Recovering freed time is often where the real operational value of cancellation management becomes visible.",
              },
            ],
          },
          {
            type: "cards",
            eyebrow: "Why this is more than admin",
            title: "Cancellation management is a utilization question, not just a logging task",
            items: [
              {
                title: "Larger recovery window",
                body: "Earlier visibility increases the odds that newly freed time can still be used well.",
              },
              {
                title: "Less ad hoc front-desk pressure",
                body: "A clearer workflow reduces the chance that recovery work remains entirely reactive.",
              },
              {
                title: "More schedule calm",
                body: "The goal is not complexity. It is less chaos when time frees up late in the schedule.",
              },
            ],
          },
        ],
        faq: [
          {
            question: "Does cancellation management mainly mean enforcing a fee policy?",
            answer:
              "Not primarily. Renvoo is more focused on workflow: earlier visibility, better confirmation, and faster recovery once a slot changes.",
          },
        ],
        relatedPages: [
          buildRelatedLink("appointmentReminders", "Read about reminders", "See how cancellation management connects to confirmations."),
          buildRelatedLink("dentalClinics", "Read the dental use case", "See where late cancellations hurt the most."),
          buildRelatedLink("contact", "Book a workflow review", "Discuss how your team handles cancellations today."),
        ],
        cta: {
          eyebrow: "Next step",
          title: "Want to compare cancellation management to your team's current process?",
          body:
            "Book a short conversation around confirmations, rescheduling, waitlists, and how quickly a late change can actually be recovered in your clinic today.",
          primary: { pageKey: "contact", label: "Book the conversation" },
          secondary: { pageKey: "dentalClinics", label: "See dental clinics" },
        },
      },
      blogIndex: {
        type: "blogIndex",
        seo: {
          title: "Renvoo blog | No-shows, reminders, and clinic operations",
          description:
            "Read practical articles about missed appointments, appointment reminders, cancellation management, and clinic operations for dental clinics and private practices.",
        },
        hero: {
          eyebrow: "Blog",
          title: "Practical content for clinic decision-makers",
          lead:
            "No AI theater, just practical articles about reminders, cancellations, no-shows, backfill, and workflow friction in appointment-heavy clinics.",
          primary: { pageKey: "contact", label: "Book a workflow review" },
          secondary: { pageKey: "useCases", label: "Explore the use cases" },
        },
      },
      privacy: {
        type: "legal",
        seo: {
          title: "Renvoo privacy | Narrow website and lead-capture posture",
          description: "Pre-launch privacy note for the Renvoo website, lead capture, and pilot outreach flow.",
        },
        hero: {
          eyebrow: "Privacy",
          title: "A narrow privacy posture for the website and outreach flow",
          lead:
            "This page describes the current privacy boundary for the Renvoo website, lead capture, and pilot outreach. Final public contact details and vendor choices still need to be completed before launch.",
        },
        cards: [
          {
            title: "What this page covers",
            body: "The Renvoo website, contact requests, and business-facing pilot communication. It is not a clinic patient privacy notice.",
          },
          {
            title: "What Renvoo may collect directly",
            body: "Name, clinic name, business contact details, inquiry messages, and technical security information needed to operate the site safely.",
          },
          {
            title: "Current launch posture",
            body: "Clinic SaaS, no patient portal, no non-essential cookies by default, and a deliberately narrow set of public website processes.",
          },
        ],
        cta: {
          eyebrow: "Continue reading",
          title: "See the patient communication note too",
          body: "It explains the narrow, clinic-led messaging posture for the first pilot phase.",
          primary: { pageKey: "patientNotice", label: "See the patient notice" },
          secondary: { pageKey: "contact", label: "Book a conversation" },
        },
      },
      patientNotice: {
        type: "legal",
        seo: {
          title: "Renvoo patient notice | Narrow note for pilot appointment communication",
          description:
            "Pre-launch patient notice for clinic-triggered reminders, confirmations, and rescheduling links during the first Renvoo pilot phase.",
        },
        hero: {
          eyebrow: "Patient notice",
          title: "A narrow note for clinic-led appointment communication",
          lead:
            "This page shows how the first patient-facing explanation around reminders, confirmations, and rescheduling stays deliberately limited to operational appointment communication.",
        },
        cards: [
          {
            title: "What it is",
            body: "A short explanation that a clinic may use Renvoo for appointment confirmations, rescheduling, and operational messaging around freed capacity.",
          },
          {
            title: "What it is not",
            body: "Not a patient account, not a diagnostic tool, and not a medical advice service.",
          },
          {
            title: "The clinic's role",
            body: "The clinic remains responsible for the care relationship and the broader privacy communication toward patients.",
          },
        ],
        cta: {
          eyebrow: "Continue reading",
          title: "See the website privacy boundary too",
          body: "Together these pages form the narrow trust posture for the first public version of the site.",
          primary: { pageKey: "privacy", label: "See privacy" },
          secondary: { pageKey: "contact", label: "Book a conversation" },
        },
      },
      notFound: {
        type: "notFound",
        seo: {
          title: "Renvoo | Page not found",
          description: "The requested Renvoo page could not be found.",
        },
        hero: {
          eyebrow: "404",
          title: "This page does not exist anymore or has moved.",
          lead: "Use the main routes below to return to the commercial and informational Renvoo pages.",
        },
      },
    },
  },
};
