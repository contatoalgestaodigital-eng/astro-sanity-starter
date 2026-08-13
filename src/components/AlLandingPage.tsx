import { FormEvent, useEffect, useRef, useState } from "react";

type Stage = "idle" | "reading" | "ready";

const WHATSAPP_NUMBER = "5538998602209";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Conheci a AL pelo site e gostaria de conversar sobre a presença digital da minha empresa.",
)}`;
const INSTAGRAM_URL = "https://www.instagram.com/al_gestaodigital/";

function normalizeProfile(value: string) {
  const clean = value.trim().replace(/\/$/, "");
  const fromUrl = clean.match(/instagram\.com\/([A-Za-z0-9._]+)/i)?.[1];
  const direct = clean.replace(/^@/, "");
  const handle = fromUrl ?? direct;
  return /^[A-Za-z0-9._]{2,30}$/.test(handle) ? handle : "";
}

const signals = [
  { index: "01", label: "Clareza", detail: "O que você oferece" },
  { index: "02", label: "Confiança", detail: "Por que acreditar" },
  { index: "03", label: "Conversão", detail: "Como iniciar contato" },
];

const methodSteps = [
  {
    number: "01",
    key: "entender",
    verb: "Entender",
    title: "Antes de comunicar, precisamos compreender.",
    description:
      "Conhecemos o negócio, o público, o momento atual e o que precisa mudar.",
    keywords: ["Negócio", "Público", "Objetivo"],
    image: "/metodo-entender.jpg",
    alt: "Duas profissionais conversando e organizando informações durante uma reunião",
  },
  {
    number: "02",
    key: "construir",
    verb: "Construir",
    title: "Transformamos informações em direção.",
    description:
      "Organizamos posicionamento, conteúdo e linguagem visual para cada escolha ter intenção.",
    keywords: ["Posicionamento", "Conteúdo", "Direção visual"],
    image: "/metodo-construir.jpg",
    alt: "Mãos organizando fotografias e referências visuais sobre uma mesa",
  },
  {
    number: "03",
    key: "acompanhar",
    verb: "Acompanhar",
    title: "Estratégia precisa responder ao movimento real.",
    description:
      "Observamos o que acontece, ajustamos a rota e fazemos a comunicação evoluir.",
    keywords: ["Observar", "Ajustar", "Evoluir"],
    image: "/metodo-acompanhar.jpg",
    alt: "Profissional acompanhando informações pelo celular em um ambiente de trabalho",
  },
];

const services = [
  {
    number: "01",
    key: "gestao",
    title: "Gestão de redes sociais",
    marker: "PERFIL · CONTEÚDO · ROTINA",
    problem: "Sua página está parada, desorganizada ou sem direção?",
    solution:
      "A AL planeja, cria e administra sua comunicação no Instagram e no Facebook.",
    scope: "Planejamento · Publicações · Legendas · Organização do perfil",
  },
  {
    number: "02",
    key: "conteudo",
    title: "Conteúdo e vídeo",
    marker: "REC 00:12",
    problem: "Você sabe que precisa aparecer, mas não sabe o que gravar ou publicar?",
    solution:
      "Criamos ideias, roteiros, direção para gravação, peças visuais e edição.",
    scope: "Ideias · Roteiros · Direção · Criativos · Edição",
  },
  {
    number: "03",
    key: "landing",
    title: "Landing pages",
    marker: "PÁGINA 01",
    problem: "Seu serviço ainda depende de explicações espalhadas pelo direct?",
    solution:
      "Construímos uma página clara para apresentar, gerar confiança e facilitar o contato ou a venda.",
    scope: "Estrutura · Texto · Design · Contato · Conversão",
  },
  {
    number: "04",
    key: "maps",
    title: "Google Maps",
    marker: "NEGÓCIO LOCAL",
    problem: "Quem procura pelo seu serviço na sua cidade consegue encontrar você?",
    solution:
      "Organizamos sua presença local com informações claras, atualizadas e confiáveis.",
    scope: "Perfil · Informações · Publicações · Avaliações",
  },
  {
    number: "05",
    key: "trafego",
    title: "Tráfego pago",
    marker: "PÚBLICO → MENSAGEM",
    problem: "Seu conteúdo está chegando somente a quem já segue o perfil?",
    solution:
      "Planejamos campanhas para levar a mensagem às pessoas com maior potencial de interesse.",
    scope: "Campanha · Público · Mensagem · Criativo · Acompanhamento",
  },
];

export default function Home() {
  const [profile, setProfile] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [activeSignal, setActiveSignal] = useState(-1);
  const [error, setError] = useState("");
  const [introOpen, setIntroOpen] = useState(false);
  const [introReplay, setIntroReplay] = useState(0);
  const [activeMethod, setActiveMethod] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const methodRefs = useRef<(HTMLElement | null)[]>([]);
  const servicesRef = useRef<HTMLElement>(null);
  const handle = normalizeProfile(profile);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = window.sessionStorage.getItem("al-brand-intro-seen") === "yes";

    if (reducedMotion || alreadySeen) return;

    const frame = window.requestAnimationFrame(() => setIntroOpen(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (stage !== "reading") return;

    const timers = [
      window.setTimeout(() => setActiveSignal(0), 260),
      window.setTimeout(() => setActiveSignal(1), 1080),
      window.setTimeout(() => setActiveSignal(2), 1900),
      window.setTimeout(() => setStage("ready"), 2780),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage]);

  useEffect(() => {
    let frame = 0;

    function updateMethod() {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const target = window.innerHeight * 0.42;
        const rects = methodRefs.current
          .map((element) => element?.getBoundingClientRect())
          .filter((rect): rect is DOMRect => Boolean(rect));

        if (!rects.length) return;

        const covering = rects.findIndex(
          (rect) => rect.top <= target && rect.bottom >= target,
        );
        const next = covering >= 0
          ? covering
          : target < rects[0].top
            ? 0
            : rects.length - 1;

        setActiveMethod(next);
      });
    }

    updateMethod();
    window.addEventListener("scroll", updateMethod, { passive: true });
    window.addEventListener("resize", updateMethod);

    return () => {
      window.removeEventListener("scroll", updateMethod);
      window.removeEventListener("resize", updateMethod);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();

    if (stage === "ready") {
      const originalLink = profile.startsWith("http")
        ? profile.trim()
        : `https://instagram.com/${handle}`;
      const message = `Olá! Gostaria de receber uma avaliação inicial do meu Instagram: ${originalLink}`;
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (!handle) {
      setError("Digite um @perfil ou cole um link válido do Instagram.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setActiveSignal(-1);
    setStage("reading");
  }

  function reset(value: string) {
    setProfile(value);
    setError("");
    setActiveSignal(-1);
    if (stage !== "idle") setStage("idle");
  }

  function closeIntro() {
    window.sessionStorage.setItem("al-brand-intro-seen", "yes");
    setIntroOpen(false);
  }

  function replayIntro() {
    setIntroReplay((current) => current + 1);
    setIntroOpen(true);
  }

  function moveServices(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    servicesRef.current?.style.setProperty("--service-x", `${x}px`);
    servicesRef.current?.style.setProperty("--service-y", `${y}px`);
  }

  function resetServicesPosition() {
    servicesRef.current?.style.setProperty("--service-x", "0px");
    servicesRef.current?.style.setProperty("--service-y", "0px");
  }

  const progress =
    stage === "ready"
      ? 100
      : stage === "reading"
        ? Math.max(0, ((activeSignal + 1) / signals.length) * 100)
        : 0;

  const statusText =
    stage === "ready"
      ? "Solicitação pronta"
      : stage === "reading" && activeSignal >= 0
        ? `${signals[activeSignal].label} em leitura`
        : stage === "reading"
          ? "Iniciando percurso"
          : "Veja como funciona";

  return (
    <main className={`experience stage-${stage}`}>
      {introOpen && (
        <div className="brand-intro" role="dialog" aria-label="Animação da marca AL Gestão Digital">
          <div className="brand-intro-film">
            <video
              key={introReplay}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/al-logo-final.jpg"
              onEnded={closeIntro}
            >
              <source src="/al-logo-movimento.webm" type="video/webm" />
              <source src="/al-logo-movimento.mp4" type="video/mp4" />
            </video>
            <button className="intro-skip" type="button" onClick={closeIntro}>
              Pular abertura <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}

      <section className="hero" id="inicio">
        <header className="site-header">
          <button
            className="brand-logo"
            type="button"
            onClick={replayIntro}
            aria-label="Reproduzir animação da logo AL"
          >
            <img src="/al-logo-oficial.png" alt="AL Gestão Digital" />
          </button>

          <nav aria-label="Navegação principal">
            <a href="#servicos">Soluções</a>
            <a href="#metodo">Como trabalhamos</a>
            <a href="#alcance">Alcance</a>
          </nav>

          <a className="header-action" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="hero-photo">
          <img
            src="/atendimento-negocio-real.jpg"
            alt="Duas profissionais embalando pedidos em um pequeno negócio"
          />
          <div className="photo-shade" aria-hidden="true" />
        </div>

        <div className="hero-copy">
          <div className="eyebrow">Gestão digital para negócios reais</div>
          <h1>Você cuida do seu negócio. A AL cuida da presença digital dele.</h1>
          <p>
            Planejamento, conteúdo, administração das redes e páginas construídas
            para apresentar seu trabalho com clareza e direção.
          </p>
          <div className="hero-contact" aria-label="Canais de contato da AL">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Falar no WhatsApp <span aria-hidden="true">↗</span>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className={`services services-active-${services[activeService].key}`}
        id="servicos"
        ref={servicesRef}
        onPointerMove={moveServices}
        onPointerLeave={resetServicesPosition}
      >
        <div className="services-shade" aria-hidden="true" />
        <div className="services-heading">
          <span>O que a AL resolve</span>
          <h2>Sua presença digital não precisa ser mais uma preocupação.</h2>
          <p>
            Da administração das redes à construção da página que apresenta o seu negócio.
          </p>
        </div>

        <div className="services-vitrine">
          <div className="service-center">
            <span className="service-center-count">
              AL em movimento <i>{services[activeService].number} / 05</i>
            </span>
            <h3>
              Você cuida do seu negócio.
              <em>A AL cuida da presença digital dele.</em>
            </h3>

            <div
              className="service-answer"
              id="service-detail"
              role="tabpanel"
              aria-live="polite"
              key={services[activeService].key}
            >
              <span>{services[activeService].title}</span>
              <strong>{services[activeService].problem}</strong>
              <p>{services[activeService].solution}</p>
              <small>{services[activeService].scope}</small>
            </div>
          </div>

          <div className="service-pieces" role="tablist" aria-label="Serviços da AL">
            {services.map((service, index) => (
              <button
                className={`service-piece service-piece-${service.key} ${
                  activeService === index ? "is-active" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeService === index}
                aria-controls="service-detail"
                onMouseEnter={() => setActiveService(index)}
                onFocus={() => setActiveService(index)}
                onClick={() => setActiveService(index)}
                key={service.key}
              >
                <span>{service.number}</span>
                <strong>{service.title}</strong>
                <small>{service.marker}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="services-base">
          <span>Estratégia</span>
          <span>Planejamento</span>
          <span>Acompanhamento</span>
          <p>Uma base contínua em todas as entregas.</p>
        </div>
      </section>

      <section className={`method method-active-${activeMethod}`} id="metodo">
        <div className="method-shell">
          <aside className="method-intro">
            <div className="method-kicker">Como a estratégia ganha movimento</div>
            <h2>Estratégia não nasce pronta.</h2>
            <p className="method-lead">
              Ela ganha direção, forma e movimento.
            </p>

            <div className="method-photo" aria-live="polite">
              {methodSteps.map((step, index) => (
                <img
                  className={activeMethod === index ? "is-active" : ""}
                  src={step.image}
                  alt={activeMethod === index ? step.alt : ""}
                  aria-hidden={activeMethod !== index}
                  key={step.key}
                />
              ))}
              <span className="method-photo-label">
                <i>{methodSteps[activeMethod].number}</i>
                {methodSteps[activeMethod].verb}
              </span>
            </div>

            <div className="method-progress" aria-label={`Etapa ${activeMethod + 1} de 3`}>
              <span style={{ width: `${((activeMethod + 1) / methodSteps.length) * 100}%` }} />
            </div>
          </aside>

          <div className="method-stages">
            {methodSteps.map((step, index) => (
              <article
                className={`method-stage ${activeMethod === index ? "is-active" : ""}`}
                data-method-index={index}
                ref={(element) => {
                  methodRefs.current[index] = element;
                }}
                key={step.key}
              >
                <div className="method-mobile-photo">
                  <img src={step.image} alt={step.alt} />
                  <span>{step.number}</span>
                </div>
                <div className="method-stage-heading">
                  <span>{step.number}</span>
                  <p>{step.verb}</p>
                </div>
                <h3>{step.title}</h3>
                <p className="method-description">{step.description}</p>
                <ul>
                  {step.keywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="method-close">
          <span>Continuidade estratégica</span>
          <h3>O trabalho não termina quando o conteúdo é publicado.</h3>
          <p>É o acompanhamento que transforma cada resposta do público em uma próxima decisão.</p>
          <a href="#avaliacao">
            Quero construir minha estratégia <i aria-hidden="true">↓</i>
          </a>
        </div>
      </section>

      <section className="reach" id="alcance">
        <div className="reach-copy">
          <span>Presença que ultrapassa distâncias</span>
          <h2>Estratégia próxima, onde quer que o negócio esteja.</h2>
          <p>
            A AL entende a realidade de cada marca e constrói uma comunicação
            preparada para alcançar pessoas em diferentes regiões.
          </p>
          <div className="reach-note">
            <strong>Brasil inteiro</strong>
            <small>Atendimento digital com direção e acompanhamento.</small>
            <small>Captação presencial em Montes Claros e região.</small>
          </div>
        </div>

        <div className="reach-map">
          <svg viewBox="0 0 600 620" role="img" aria-label="Mapa do Brasil com conexões partindo de Montes Claros para diferentes regiões do país">
            <defs>
              <filter id="mapGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#244f45" />
                <stop offset="1" stopColor="#0f2d27" />
              </linearGradient>
            </defs>
            <path className="country-shape" d="M313.318,587.881L309.575,578.73L315.505,571.103L307.728,560.224L297.132,551.435L283.231,541.312L278.225,541.791L264.663,529.671L255.914,531.336L273.899,510.165L289.161,495.284L298.202,489.065L309.575,480.689L309.867,468.634L303.111,459.976L296.403,462.865L299.028,454.235L300.875,445.42L300.875,437.271L296.014,434.596L290.959,436.996L285.953,436.346L284.349,430.653L283.085,417.21L280.558,412.832L271.468,408.882L265.927,411.745L251.686,408.956L252.561,389.27L248.575,381.245L252.804,378.277L251.491,370.098L255.234,363.831L257.616,352.621L254.408,343.81L247.068,339.834L245.61,334.264L247.603,326.109L221.696,325.538L216.495,309.208L220.432,308.971L220.286,302.942L217.613,298.882L217.03,290.825L209.204,286.71L200.698,286.851L195.108,282.812L185.97,280.067L180.672,274.911L165.556,272.616L150.877,260.257L151.995,251.031L150.342,245.751L151.752,235.467L134.108,237.786L126.963,242.94L115.151,248.495L112.138,252.66L105.187,252.963L95.174,251.799L87.543,254.173L81.419,252.59L82.294,231.735L71.211,239.805L59.303,239.457L54.199,232.152L45.256,231.365L48.124,225.484L40.59,217.184L35,204.907L38.548,202.419L38.548,196.661L46.714,192.726L45.353,185.391L48.804,180.658L49.776,174.345L65.233,165.124L76.267,162.511L78.065,160.471L90.265,161.113L96.341,124.04L96.632,118.188L94.542,110.441L88.564,105.527L88.612,95.701L96.195,93.484L98.917,94.878L99.354,89.713L91.48,88.319L91.286,79.861L117.582,80.158L122.053,75.517L125.796,79.792L128.469,87.77L130.997,86.102L138.434,93.233L148.933,92.364L151.557,88.227L161.57,85.073L167.16,82.856L168.715,77.14L178.339,73.298L177.61,70.463L166.188,69.296L164.292,60.785L164.875,51.719L158.8,48.214L161.327,46.954L171.34,48.695L182.082,52.085L185.97,48.878L195.691,46.771L210.759,41.706L215.717,36.546L213.919,32.715L220.967,32.119L224.077,35.239L222.328,41.178L226.994,43.242L230.056,49.52L226.313,54.306L224.175,65.796L227.626,72.635L228.598,78.901L236.909,85.233L243.568,85.896L245.027,83.244L249.304,82.673L255.428,80.295L259.803,76.706L267.288,77.849L270.545,77.369L277.884,78.466L279.099,75.722L276.864,73.024L278.225,69.113L283.668,70.325L290.036,68.93L297.764,71.789L303.645,74.579L307.826,70.92L310.839,71.492L312.686,75.288L319.151,74.328L324.352,69.204L328.483,59.228L336.455,46.862L341.072,46.221L344.426,53.711L351.96,77.346L359.202,79.564L359.542,88.89L349.432,100.02L353.612,104.088L377.478,106.19L377.964,119.743L388.22,110.875L405.183,115.72L427.639,123.972L434.201,131.883L432.014,139.362L447.714,135.199L473.961,142.359L494.132,141.833L514.11,153.026L531.365,168.196L541.766,172.096L553.286,172.646L558.195,176.915L562.764,194.198L565,202.442L559.653,224.998L552.751,233.914L533.746,253.009L525.143,268.593L515.13,280.606L511.776,280.864L507.985,291.084L508.957,317.242L505.215,338.925L503.756,348.272L499.479,353.872L497.097,372.958L483.39,391.739L481.106,406.713L470.17,413.03L467.01,421.822L452.331,421.772L431.09,427.414L421.612,433.971L406.496,438.297L390.602,450.099L379.179,464.922L377.186,476.158L379.422,484.512L376.943,499.918L373.881,507.428L364.403,515.916L349.432,543.39L337.572,555.917L328.386,563.382L322.213,578.648Z" />
            <g className="map-routes" filter="url(#mapGlow)">
              <path d="M441.7 332.2 Q425 370 404.3 430.3" />
              <path d="M441.7 332.2 Q525 280 563 212.1" />
              <path d="M441.7 332.2 Q410 322 387.5 319" />
              <path d="M441.7 332.2 Q395 430 342.2 528.4" />
              <path d="M441.7 332.2 Q315 210 223.6 145.2" />
              <path d="M441.7 332.2 Q430 210 379.2 122.7" />
              <path d="M441.7 332.2 Q480 300 514.1 279.7" />
            </g>
            <g className="destination-points">
              <circle cx="404.3" cy="430.3" r="4" /><circle cx="563" cy="212.1" r="4" />
              <circle cx="387.5" cy="319" r="4" /><circle cx="342.2" cy="528.4" r="4" />
              <circle cx="223.6" cy="145.2" r="4" /><circle cx="379.2" cy="122.7" r="4" />
              <circle cx="514.1" cy="279.7" r="4" />
            </g>
            <g className="origin" transform="translate(441.7 332.2)" filter="url(#mapGlow)">
              <circle className="origin-pulse" r="18" />
              <circle className="origin-core" r="7" />
            </g>
            <g className="origin-label" transform="translate(458 338)">
              <rect width="110" height="34" rx="17" />
              <text x="14" y="22">Montes Claros</text>
            </g>
          </svg>
        </div>
      </section>

      <section className="diagnostic" id="avaliacao" aria-live="polite">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <p>Diagnóstico em movimento</p>
            <h2>Uma leitura humana, guiada por três pontos.</h2>
          </div>
        </div>

        <div className="profile-strip">
          <div>
            <span>Perfil em análise</span>
            <strong>{handle ? `@${handle}` : "Aguardando seu link"}</strong>
          </div>
          <span className="strip-status">
            <i aria-hidden="true" />
            {statusText}
          </span>
          {stage === "reading" && <span className="strip-scanner" aria-hidden="true" />}
        </div>

        <div className="signal-track" id="signal-track">
          <div className="track-line" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
            <i />
          </div>
          {signals.map((signal, index) => (
            <div
              className={`signal ${activeSignal === index ? "is-active" : ""} ${
                stage === "ready" || activeSignal > index ? "is-complete" : ""
              }`}
              style={{ "--signal-index": index } as React.CSSProperties}
              key={signal.label}
            >
              <span className="signal-node">{signal.index}</span>
              <strong>{signal.label}</strong>
              <small>{signal.detail}</small>
            </div>
          ))}
        </div>

        <p className="motion-caption" key={statusText}>
          {stage === "idle" && "A linha mostra o percurso: clareza, confiança e conversão."}
          {stage === "reading" && `${statusText}. Acompanhe o movimento até o terceiro ponto.`}
          {stage === "ready" && "Percurso concluído. Agora o perfil pode ser enviado para a leitura humana."}
        </p>

        <div className="human-note">
          <span aria-hidden="true">✦</span>
          <p>
            {stage === "ready"
              ? "O próximo passo é enviar o perfil. A avaliação será feita por uma pessoa da AL."
              : "Isto mostra os critérios da avaliação — não é uma análise automática nem uma promessa de resultado."}
          </p>
        </div>

        <form className="profile-form" onSubmit={submit} noValidate>
          <label htmlFor="instagram">Cole seu Instagram</label>
          <div className={`field ${error ? "has-error" : ""}`}>
            <span className="at" aria-hidden="true">@</span>
            <input
              ref={inputRef}
              id="instagram"
              name="instagram"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="seuperfil ou instagram.com/perfil"
              value={profile}
              onChange={(event) => reset(event.target.value)}
              aria-describedby={error ? "instagram-error" : "instagram-help"}
              aria-invalid={Boolean(error)}
            />
            {profile && (
              <button
                className="clear"
                type="button"
                onClick={() => reset("")}
                aria-label="Limpar perfil"
              >
                ×
              </button>
            )}
          </div>
          <span
            id={error ? "instagram-error" : "instagram-help"}
            className={`field-help ${error ? "error" : ""}`}
          >
            {error || "Você envia o link; uma pessoa da AL faz a avaliação."}
          </span>

          <button className="primary-action" type="submit" disabled={stage === "reading"}>
            <span>
              {stage === "idle" && "Quero uma avaliação do meu perfil"}
              {stage === "reading" && "Organizando os 3 pontos…"}
              {stage === "ready" && "Enviar perfil para a AL"}
            </span>
            <i className="action-arrow" aria-hidden="true">↗</i>
          </button>
        </form>
      </section>

      <section className="final-contact" id="contato">
        <div className="final-contact-mark">
          <img src="/al-logo-oficial.png" alt="" aria-hidden="true" />
          <span>AL · Gestão Digital</span>
        </div>
        <h2>Sua presença digital pode começar a ganhar direção hoje.</h2>
        <p>
          Conte o que está faltando na comunicação do seu negócio e vamos pensar
          no próximo movimento.
        </p>
        <div className="final-actions">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Falar com a AL no WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Visitar o Instagram <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer>
        <span>© 2026 · AL Gestão Digital</span>
        <strong>Estratégia que cria movimento.</strong>
        <div className="footer-links">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="/politica-de-privacidade/">Privacidade</a>
        </div>
      </footer>
    </main>
  );
}
