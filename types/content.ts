// Reusable sub-types
export interface ButtonContent {
  text: string;
  link: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  location: string;
  service?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CTAContent {
  title: string;
  subtitle: string;
  primaryButton: ButtonContent;
  secondaryButton: ButtonContent;
  primaryMicrocopy?: string;
}

// --- HOME PAGE ---
export interface HomeContent {
  hero: {
    titleTop: string;
    titleMain: string;
    titleBottom: string;
    subtitle: string;
    primaryButton: ButtonContent;
    primaryMicrocopy: string;
    secondaryButton: ButtonContent;
    backgroundImage: string;
  };
  problemSection: {
    badge: string;
    title: string;
    painPoints: string[];
    anchorAnalogy: string;
    reframe: string;
  };
  introduction: {
    badge: string;
    title: string;
    subtitle: string;
    bodyParagraph: string;
    authorityBadges: string[];
    buttonText: string;
    buttonLink: string;
    image: string;
  };
  blockquote: {
    quote: string;
    attribution: string;
  };
  video: {
    badge: string;
    title: string;
    description: string;
    videoUrl: string;
    videoTitle: string;
    quoteAuthor: string;
    quoteAttribution: string;
  };
  thePlan: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string }>;
    buttonText: string;
    buttonLink: string;
    buttonMicrocopy: string;
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  services: Array<{
    title: string;
    description: string;
    buttonText: string;
    linkTo: string;
    image?: string;
  }>;
  schoolSpotlight: {
    badge: string;
    title: string;
    paragraph: string;
    features: string[];
    primaryButton: ButtonContent;
    secondaryButton: ButtonContent;
    videoUrl: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  freeGuide: {
    badge: string;
    title: string;
    description: string;
    chapters: string[];
    buttonText: string;
    buttonLink: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
    successMessage: string;
  };
  webinarSection: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    // Local datetime string (datetime-local input format: "YYYY-MM-DDTHH:mm").
    // Empty when not set. Drives both the displayed date and the countdown,
    // and when "now" passes this time the section auto-hides.
    startsAt: string;
    buttonText: string;
    successMessage: string;
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    closingParagraph: string;
    primaryButton: ButtonContent;
    secondaryButton: ButtonContent;
  };
}

// --- ABOUT PAGE ---
export interface AboutContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  bio: {
    heading: string;
    paragraphs: string[];
    image: string;
    credentials: string[];
    quote: string;
    email: string;
    phone: string;
  };
  philosophy: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    items: Array<{ number: string; title: string; description: string }>;
  };
  timeline: {
    eyebrow: string;
    title: string;
    subtitle: string;
    entries: Array<{ year: string; title: string; description: string }>;
  };
  cta: CTAContent;
}

// --- SERVICES PAGE ---
export interface ServiceDetailContent {
  title: string;
  subtitle: string;
  description: string;
  includedItems: string[];
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
}

export interface ServicesContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tagline: string;
  };
  overview: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: Array<{ title: string; description: string; buttonText: string; linkTo: string }>;
  };
  serviceDetails: ServiceDetailContent[];
  labels: {
    includedHeading: string;
    primaryButtonMicrocopy: string;
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{ number: string; title: string; description: string }>;
  };
  faq: {
    title: string;
    subtitle: string;
    items: FAQItem[];
  };
  objections: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  contactForm: {
    title: string;
    subtitle: string;
    description: string;
    submitText: string;
    submittingText: string;
    successMessage: string;
    successSubtext: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
  };
  cta: CTAContent;
}

// --- SCHOOL PAGE ---
export interface CurriculumWeek {
  number: string;
  title: string;
  bullets: string[];
}

export interface CurriculumMonth {
  monthNumber: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  weeks: CurriculumWeek[];
}

export interface SchoolContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryButton: ButtonContent;
    primaryMicrocopy: string;
    secondaryButton: ButtonContent;
    limitedSpotsText: string;
    images: Array<{ url: string; alt: string; caption: string }>;
  };
  overview: {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    images: Array<{ url: string; alt: string; caption: string }>;
  };
  benefits: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
  };
  curriculum: {
    eyebrow: string;
    title: string;
    subtitle: string;
    months: CurriculumMonth[];
    graduationNote: string;
    weekLabel: string;
    qaNote: string;
  };
  format: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    items: Array<{ title: string; description: string }>;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FAQItem[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  cta: CTAContent;
}

// --- VAZA IZOBILJA PAGE ---
export interface VazaProduct {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  highlighted: boolean;
  buttonText: string;
  buttonLink: string;
}

export interface VazaContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    primaryMicrocopy: string;
    image: string;
    imageAlt: string;
  };
  introduction: {
    eyebrow: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    benefits: string[];
    image: string;
    imageAlt: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    scienceTitle: string;
    introParagraph: string;
    symbols: Array<{ title: string; description: string }>;
    closingParagraph: string;
    image: string;
    imageAlt: string;
  };
  products: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: VazaProduct[];
  };
  labels: {
    popularBadge: string;
    includesLabel: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  howToUse: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: Array<{ number: string; title: string; description: string }>;
    bottomText: string;
    buttonText: string;
    buttonLink: string;
    images: Array<{ url: string; alt: string }>;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FAQItem[];
  };
  cta: CTAContent;
}

// --- GALLERY PAGE ---
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  span?: 'wide' | 'tall';
}

export interface TransformationStoryContent {
  beforeImage: string;
  afterImage: string;
  clientName: string;
  location: string;
  service: string;
  quote: string;
}

export interface GalleryContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  categories: string[];
  items: GalleryItem[];
  transformations: TransformationStoryContent[];
  cta: {
    title: string;
    subtitle: string;
    primaryButton: ButtonContent;
  };
}

// --- GLOBAL SETTINGS ---
export interface GlobalContent {
  siteConfig: {
    siteName: string;
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    socialLinks: { facebook: string; instagram: string };
  };
  navigation: Array<{ to: string; label: string; children?: Array<{ to: string; label: string }> }>;
  header: {
    loginButton: string;
    myCoursesLabel: string;
    adminPanelLabel: string;
    logoutLabel: string;
  };
  footer: {
    socialProofText: string;
    tagline: string;
    exploreHeading: string;
    exploreLinks: Array<{ to: string; label: string }>;
    connectHeading: string;
    whatsappLinkText: string;
    consultationButtonText: string;
    consultationButtonLink: string;
    copyrightText: string;
  };
}

// --- GUIDE PAGE ---
export interface GuideQuizQuestion {
  id: number;
  text: string;
}

export interface GuideQuizResult {
  range: [number, number];
  title: string;
  type: string;
  description: string;
}

export interface GuideChapterContent {
  id: string;
  number: number;
  title: string;
  content: string[];
  bullets?: string[];
  reflectionQuestions?: string[];
  steps?: Array<{ title: string; description: string }>;
  blockages?: Array<{ title: string; bullets: string[]; quickStep: string }>;
  programSections?: Array<{ title: string; description: string }>;
  programBenefits?: string[];
  joinIfItems?: string[];
}

export interface GuideContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  chapters: GuideChapterContent[];
  quiz: {
    questions: GuideQuizQuestion[];
    results: GuideQuizResult[];
    footerText: string;
  };
  emailGate: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  cta: {
    title: string;
    buttonText: string;
    buttonLink: string;
  };
}

// --- MASTER TYPE ---
export interface SiteContent {
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  school: SchoolContent;
  vaza: VazaContent;
  gallery: GalleryContent;
  global: GlobalContent;
  guide: GuideContent;
}
