import type { BuilderDocument } from "@/types/builder";

export type StarterTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  style: string;
  audience: string;
  featured?: boolean;
  document: BuilderDocument;
};

const section = (id: string, title: string, text: string) => ({
  id,
  type: "section",
  props: { label: "SECTION", title },
  children: [
    { id: id + "-heading", type: "heading", props: { text: title, level: "h2" } },
    { id: id + "-text", type: "text", props: { text } },
    { id: id + "-button", type: "button", props: { label: "Get Started", url: "#contact", variant: "primary" } }
  ]
});

const starterSite: BuilderDocument["site"] = {
  brandName: "Your Business",
  tagline: "Build a business people remember.",
  theme: {
    colors: { primary:"#7c3aed", secondary:"#ec4899", accent:"#3b82f6", text:"#111522", muted:"#697287", background:"#ffffff", surface:"#f7f8fb" },
    typography: { headingFont:"Inter, ui-sans-serif, system-ui, sans-serif", bodyFont:"Inter, ui-sans-serif, system-ui, sans-serif", headingWeight:"800", bodyWeight:"400" },
    radius:"12px", containerWidth:"1180px", buttonStyle:"solid"
  },
  seo: { title:"Your Business", description:"A responsive website built with Fellacoo." }
};


const portfolioDocument = ({
  brand,
  tagline,
  title,
  eyebrow,
  description,
  primary,
  secondary,
  services,
  aboutTitle,
  aboutText,
  stats,
  tools,
  accent,
  background = "#ffffff",
  surface = "#f4f5f4",
  text = "#0b0d10",
  muted = "#6b7280",
  style = "Modern Portfolio",
  contactTitle = "Let's work together."
}: {
  brand:string; tagline:string; title:string; eyebrow:string; description:string;
  primary:string; secondary:string; services:[string,string,string];
  aboutTitle:string; aboutText:string; stats:[string,string,string];
  tools:[string,string,string]; accent:string; background?:string; surface?:string;
  text?:string; muted?:string; style?:string; contactTitle?:string;
}): BuilderDocument => ({
  version: 1,
  site: {
    brandName: brand,
    tagline,
    theme: {
      colors: {
        primary: accent,
        secondary: text,
        accent,
        text,
        muted,
        background,
        surface
      },
      typography: {
        headingFont: "Inter, ui-sans-serif, system-ui, sans-serif",
        bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
        headingWeight: "900",
        bodyWeight: "400"
      },
      radius: "18px",
      containerWidth: "1180px",
      buttonStyle: "pill"
    },
    seo: {
      title: brand + " — " + tagline,
      description
    }
  },
  pages: [{
    id: "home",
    path: "/",
    title: brand + " Portfolio",
    elements: [
      { id:"header", type:"header", props:{ brand, nav1:"Home", nav2:"Work", nav3:"Services", nav4:"About", cta:"Let's Talk" } },
      { id:"hero", type:"hero", props:{ eyebrow, title, description, primary, secondary, primaryUrl:"#work", secondaryUrl:"#about", badge:style } },
      { id:"ticker", type:"section", props:{ label:"EXPERTISE", title:"Design · Strategy · Digital · Experience", text:"Selected capabilities brought together into one clear creative portfolio.", buttonLabel:"View Work", buttonUrl:"#work" } },
      { id:"work", type:"features", props:{ eyebrow:"SELECTED WORK", title:"A portfolio built around meaningful outcomes.", item1:services[0], item1Description:"Thoughtful work from concept through polished delivery.", item2:services[1], item2Description:"Clear systems, strong visual direction and practical execution.", item3:services[2], item3Description:"Experiences designed to be useful, memorable and easy to use." } },
      { id:"about", type:"section", props:{ label:"ABOUT ME", title:aboutTitle, text:aboutText, buttonLabel:"View My CV", buttonUrl:"#contact" } },
      { id:"stats", type:"features", props:{ title:"Experience at a glance.", item1:stats[0], item1Description:"Selected projects completed.", item2:stats[1], item2Description:"Clients, teams or brands supported.", item3:stats[2], item3Description:"Years spent creating digital work." } },
      { id:"tools", type:"features", props:{ eyebrow:"MY TOOLKIT", title:"Tools behind the work.", item1:tools[0], item1Description:"Creative workflow and production.", item2:tools[1], item2Description:"Design, prototyping or development.", item3:tools[2], item3Description:"Planning, collaboration and delivery." } },
      { id:"contact", type:"lead-form", props:{ eyebrow:"START A PROJECT", title:contactTitle, namePlaceholder:"Your name", emailPlaceholder:"Email address", messagePlaceholder:"Tell me about your project", cta:"Send enquiry" } },
      { id:"footer", type:"footer", props:{ brand, copyright:"© 2026 · Portfolio · CV · Contact" } }
    ]
  }]
});


const bakeryDocument = ({
  brand, tagline, title, eyebrow, description, accent, background="#fffaf3", surface="#f4eadf",
  text="#241914", muted="#796b63", style="Bakery", menuTitle="Fresh from the oven.",
  aboutTitle="Baked with care.", services=["Breads","Pastries","Cakes"],
  cta="Order Now", secondary="View Menu"
}: {
  brand:string; tagline:string; title:string; eyebrow:string; description:string; accent:string;
  background?:string; surface?:string; text?:string; muted?:string; style?:string;
  menuTitle?:string; aboutTitle?:string; services?:[string,string,string];
  cta?:string; secondary?:string;
}): BuilderDocument => ({
  version:1,
  site:{
    brandName:brand,
    tagline,
    theme:{
      colors:{primary:accent,secondary:text,accent,text,muted,background,surface},
      typography:{
        headingFont:"Inter, ui-sans-serif, system-ui, sans-serif",
        bodyFont:"Inter, ui-sans-serif, system-ui, sans-serif",
        headingWeight:"900",
        bodyWeight:"400"
      },
      radius:"18px",
      containerWidth:"1180px",
      buttonStyle:"pill"
    },
    seo:{title:brand+" — "+tagline,description}
  },
  pages:[{
    id:"home",path:"/",title:brand+" Bakery",
    elements:[
      {id:"header",type:"header",props:{brand,nav1:"Home",nav2:"Menu",nav3:"About",nav4:"Contact",cta}},
      {id:"hero",type:"hero",props:{eyebrow,title,description,primary:cta,secondary,primaryUrl:"#menu",secondaryUrl:"#about",badge:style}},
      {id:"menu",type:"products",props:{title:menuTitle,item1:services[0],price1:"From R25",item2:services[1],price2:"From R35",item3:services[2],price3:"From R85",cta:"Order / Enquire"}},
      {id:"story",type:"section",props:{label:"OUR STORY",title:aboutTitle,text:"Share the story behind your bakery, your ingredients, your community and the reason customers come back.",buttonLabel:"Our Story",buttonUrl:"#about"}},
      {id:"specialties",type:"features",props:{eyebrow:"WHAT WE BAKE",title:"Something for every craving.",item1:services[0],item1Description:"Freshly prepared favourites made throughout the day.",item2:services[1],item2Description:"Sweet and savoury treats for every occasion.",item3:services[2],item3Description:"Celebration cakes and custom orders made to order."}},
      {id:"contact",type:"lead-form",props:{eyebrow:"ORDER & ENQUIRE",title:"Ready to order?",namePlaceholder:"Your name",emailPlaceholder:"Phone or email",messagePlaceholder:"What would you like to order?",cta:"Send enquiry"}},
      {id:"footer",type:"footer",props:{brand,copyright:"© 2026 · Freshly baked · Orders · Contact"}}
    ]
  }]
});

export const starterTemplates: StarterTemplate[] = [

  {
    id: "starter-neon-designer",
    name: "Neon Product Designer",
    description: "A high-contrast personal portfolio inspired by the supplied Oliver Scott design: oversized typography, electric green accents, service cards, profile story and tools showcase.",
    category: "Portfolio & Creative",
    style: "Neon Minimal",
    audience: "Product designers, UI/UX designers, developers and creative professionals",
    featured: true,
    document: {
      version: 1,
      site: {
        brandName: "Oliver",
        tagline: "Product Designer based in USA.",
        theme: {
          colors: {
            primary: "#35ff3f",
            secondary: "#0b0d0f",
            accent: "#35ff3f",
            text: "#090b0d",
            muted: "#707574",
            background: "#ffffff",
            surface: "#f4f5f4"
          },
          typography: {
            headingFont: "Inter, ui-sans-serif, system-ui, sans-serif",
            bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
            headingWeight: "900",
            bodyWeight: "400"
          },
          radius: "18px",
          containerWidth: "1180px",
          buttonStyle: "pill"
        },
        seo: {
          title: "Oliver — Product Designer",
          description: "Product design, UI/UX and web design portfolio."
        }
      },
      pages: [{
        id: "home",
        path: "/",
        title: "Oliver — Product Designer",
        elements: [
          {
            id: "header",
            type: "header",
            props: {
              brand: "Oliver.",
              nav1: "Home",
              nav2: "Works",
              nav3: "Projects",
              nav4: "About Me",
              cta: "Let's Talk"
            }
          },
          {
            id: "hero",
            type: "hero",
            props: {
              eyebrow: "Hello There!",
              title: "I'm Oliver Scott, Product Designer based in USA.",
              description: "I create purposeful digital products and memorable web experiences, combining clear strategy with bold visual design.",
              primary: "View My Work",
              secondary: "Download CV",
              primaryUrl: "#work",
              secondaryUrl: "#about",
              badge: "PRODUCT DESIGNER"
            }
          },
          {
            id: "specialties",
            type: "features",
            props: {
              title: "Services | Provide",
              eyebrow: "My Specialization",
              item1: "UI/UX Design",
              item1Description: "Clear interfaces, thoughtful user journeys and polished product experiences.",
              item2: "Application Design",
              item2Description: "Scalable product experiences designed around real users and business goals.",
              item3: "Website Design",
              item3Description: "High-impact websites that turn a brand into a memorable digital experience."
            }
          },
          {
            id: "ticker",
            type: "section",
            props: {
              label: "WHAT I DO",
              title: "Web Design · App Design · Dashboard · Wireframe",
              text: "Digital experiences with strategy, clarity and personality.",
              buttonLabel: "View Services",
              buttonUrl: "#services"
            }
          },
          {
            id: "about",
            type: "section",
            props: {
              label: "About Me",
              title: "Who is Oliver Scott?",
              text: "I'm a product designer focused on creating digital experiences that are simple to understand, enjoyable to use and built to move businesses forward.",
              buttonLabel: "Download CV",
              buttonUrl: "#contact"
            }
          },
          {
            id: "stats",
            type: "features",
            props: {
              title: "A few numbers behind the work.",
              item1: "600+",
              item1Description: "Projects & ideas shaped through design.",
              item2: "50+",
              item2Description: "Happy clients and collaborators.",
              item3: "18+",
              item3Description: "Years of combined creative experience."
            }
          },
          {
            id: "tools",
            type: "features",
            props: {
              title: "Exploring the Tools Behind My Designs",
              eyebrow: "My Favorite Tools",
              item1: "Figma",
              item1Description: "Interface design, prototypes and collaborative product work.",
              item2: "Framer",
              item2Description: "Interactive web experiences and rapid visual experimentation.",
              item3: "Notion",
              item3Description: "Research, planning and keeping creative systems organized."
            }
          },
          {
            id: "contact",
            type: "lead-form",
            props: {
              eyebrow: "LET'S CREATE",
              title: "Have a project in mind?",
              namePlaceholder: "Your name",
              emailPlaceholder: "Email address",
              messagePlaceholder: "Tell me about your project",
              cta: "Let's Talk"
            }
          },
          {
            id: "footer",
            type: "footer",
            props: {
              brand: "Oliver.",
              copyright: "© 2026 · Product Design · UI/UX · Web Design · Contact"
            }
          }
        ]
      }]
    }
  },
  {
    id:"portfolio-dark-lime",
    name:"Dark Lime IT Portfolio",
    description:"Dark technology portfolio inspired by the supplied WR Solutions reference, with neon-lime accents, service cards and an editorial profile section.",
    category:"Portfolio & Creative",
    style:"Dark Lime Tech",
    audience:"IT specialists, product designers, developers and digital consultants",
    featured:true,
    document:portfolioDocument({
      brand:"WR Solutions",
      tagline:"Innovative IT solutions that drive results.",
      title:"Innovative IT Solutions That Drive Results",
      eyebrow:"Hello There!",
      description:"A bold technology portfolio for professionals who combine design, innovation and practical digital solutions.",
      primary:"View Our Portfolio",
      secondary:"Hire Me",
      services:["UI/UX Design","App Design","Web Design"],
      aboutTitle:"The Story Behind WR Solutions",
      aboutText:"Build trust with a concise personal story, clear expertise and proof that turns skills into business outcomes.",
      stats:["1K+","10+","8+"],
      tools:["Figma","Framer","Webflow"],
      accent:"#b7ff00",
      background:"#080d0f",
      surface:"#171d20",
      text:"#f4f7f5",
      muted:"#9aa5a0",
      style:"IT Solutions"
    })
  },
  {
    id:"portfolio-minimal-mono",
    name:"Minimal Mono Portfolio",
    description:"Editorial black-and-white personal portfolio with oversized typography, restrained navigation and a strong case-study-first structure.",
    category:"Portfolio & Creative",
    style:"Minimal Editorial",
    audience:"Designers, architects, strategists and creative professionals",
    featured:true,
    document:portfolioDocument({
      brand:"Mason.",
      tagline:"Independent designer & creative strategist.",
      title:"I turn complex ideas into clear digital experiences.",
      eyebrow:"Independent Creative",
      description:"A refined portfolio designed to let selected work, thinking and personality lead the experience.",
      primary:"Explore My Work",
      secondary:"Download CV",
      services:["Brand Identity","Digital Product","Creative Direction"],
      aboutTitle:"A little about Mason.",
      aboutText:"A concise professional story focused on how you think, collaborate and create value for ambitious teams.",
      stats:["42+","18","9+"],
      tools:["Figma","Notion","Adobe"],
      accent:"#111111",
      background:"#fbfbf8",
      surface:"#f1f1ec",
      text:"#101010",
      muted:"#777777",
      style:"Creative Director"
    })
  },
  {
    id:"portfolio-cobalt-ux",
    name:"Cobalt UX Portfolio",
    description:"Confident blue UX portfolio built around case studies, process, research and measurable product outcomes.",
    category:"Portfolio & Creative",
    style:"UX Case Study",
    audience:"UX designers, product designers and researchers",
    featured:false,
    document:portfolioDocument({
      brand:"Ava UX",
      tagline:"Research-led product design.",
      title:"I design products people understand and love to use.",
      eyebrow:"Product Designer",
      description:"A case-study-led portfolio for showing the thinking behind interfaces, systems and product decisions.",
      primary:"View Case Studies",
      secondary:"My Process",
      services:["Product Design","UX Research","Design Systems"],
      aboutTitle:"Design starts with understanding.",
      aboutText:"Show how research, collaboration and iteration connect to practical product outcomes.",
      stats:["24+","12","6+"],
      tools:["Figma","FigJam","Maze"],
      accent:"#2563eb",
      background:"#f8fbff",
      surface:"#eef5ff",
      text:"#101827",
      muted:"#64748b",
      style:"UX Designer"
    })
  },
  {
    id:"portfolio-creative-pink",
    name:"Creative Studio Portfolio",
    description:"Expressive pink-and-orange creative portfolio for visual designers, art directors and independent studios.",
    category:"Portfolio & Creative",
    style:"Expressive Creative",
    audience:"Art directors, graphic designers and creative studios",
    featured:false,
    document:portfolioDocument({
      brand:"NOVA Studio",
      tagline:"Ideas with attitude.",
      title:"We make brands impossible to ignore.",
      eyebrow:"Creative Studio",
      description:"A playful portfolio foundation for showcasing campaigns, visual identities and bold creative direction.",
      primary:"See Our Work",
      secondary:"Start a Project",
      services:["Art Direction","Brand Design","Campaigns"],
      aboutTitle:"Small studio. Big creative energy.",
      aboutText:"Position a creative studio through a strong point of view, selected work and a simple path to enquire.",
      stats:["80+","32","11+"],
      tools:["Adobe","Figma","Cinema 4D"],
      accent:"#ff4f91",
      background:"#fff8fb",
      surface:"#fff0f5",
      text:"#181018",
      muted:"#756875",
      style:"Creative Studio"
    })
  },
  {
    id:"portfolio-terminal-dev",
    name:"Terminal Developer Portfolio",
    description:"Developer portfolio with a technical visual language, project-focused content and a direct hire pathway.",
    category:"Portfolio & Creative",
    style:"Developer / Terminal",
    audience:"Software developers, engineers and technical freelancers",
    featured:false,
    document:portfolioDocument({
      brand:"dev//Alex",
      tagline:"Software engineer building useful things.",
      title:"I build fast, reliable digital products.",
      eyebrow:"Full-Stack Developer",
      description:"A developer-first portfolio for communicating technical depth without losing clarity for clients and hiring teams.",
      primary:"View Projects",
      secondary:"Download CV",
      services:["Web Applications","APIs & Systems","Cloud Engineering"],
      aboutTitle:"Code is the tool. Outcomes are the goal.",
      aboutText:"Explain your technical approach, preferred stack and the kinds of problems you enjoy solving.",
      stats:["35+","14","7+"],
      tools:["TypeScript","Next.js","Supabase"],
      accent:"#22c55e",
      background:"#070b09",
      surface:"#111814",
      text:"#ecfdf5",
      muted:"#86a595",
      style:"Full-Stack Engineer"
    })
  },
  {
    id:"portfolio-photo-editorial",
    name:"Editorial Photographer Portfolio",
    description:"Image-led editorial portfolio for photographers with a calm luxury aesthetic and project storytelling.",
    category:"Portfolio & Creative",
    style:"Editorial Photography",
    audience:"Photographers, filmmakers and visual storytellers",
    featured:false,
    document:portfolioDocument({
      brand:"Lena / Photo",
      tagline:"Stories captured in light.",
      title:"Portraits, places and moments worth remembering.",
      eyebrow:"Photographer & Visual Storyteller",
      description:"A sophisticated portfolio foundation for photographers who want the work to dominate while keeping enquiries simple.",
      primary:"View Gallery",
      secondary:"Book a Shoot",
      services:["Portraits","Editorial","Commercial"],
      aboutTitle:"Behind the camera.",
      aboutText:"Introduce your visual style, approach and experience while keeping the portfolio itself at the center of attention.",
      stats:["120+","40","10+"],
      tools:["Lightroom","Photoshop","Capture One"],
      accent:"#8b5cf6",
      background:"#faf9f7",
      surface:"#f0eeeb",
      text:"#171717",
      muted:"#77716c",
      style:"Photographer"
    })
  },
  {
    id:"portfolio-motion-3d",
    name:"3D Motion Designer Portfolio",
    description:"Futuristic motion portfolio with electric purple accents, digital services and a strong showreel-style introduction.",
    category:"Portfolio & Creative",
    style:"3D / Motion",
    audience:"Motion designers, 3D artists and animation studios",
    featured:false,
    document:portfolioDocument({
      brand:"FRAME/3D",
      tagline:"Motion, worlds and visual experiments.",
      title:"I create moving visuals that make ideas feel alive.",
      eyebrow:"3D & Motion Designer",
      description:"A cinematic portfolio foundation for showreels, product animation, motion systems and visual experiments.",
      primary:"Watch Showreel",
      secondary:"View Projects",
      services:["3D Design","Motion Graphics","Product Animation"],
      aboutTitle:"Built for motion.",
      aboutText:"Tell the story behind your craft, the software you use and the visual problems you solve for brands.",
      stats:["70+","28","9+"],
      tools:["Blender","After Effects","Cinema 4D"],
      accent:"#a855f7",
      background:"#09070e",
      surface:"#17111f",
      text:"#faf7ff",
      muted:"#a99bb6",
      style:"Motion Designer"
    })
  },
  {
    id:"portfolio-bento-freelancer",
    name:"Bento Freelancer Portfolio",
    description:"Modern bento-style personal brand foundation for freelancers combining multiple creative and business disciplines.",
    category:"Portfolio & Creative",
    style:"Modern Bento",
    audience:"Freelancers, creators and multidisciplinary professionals",
    featured:false,
    document:portfolioDocument({
      brand:"Jordan.",
      tagline:"Designer, maker and problem solver.",
      title:"A multidisciplinary creative helping ambitious ideas move forward.",
      eyebrow:"Designer · Maker · Freelancer",
      description:"A flexible personal brand portfolio designed to combine services, selected work, experience and a strong contact CTA.",
      primary:"See What I Do",
      secondary:"My Story",
      services:["Web Design","Brand Systems","Creative Strategy"],
      aboutTitle:"A portfolio that works like a personal homepage.",
      aboutText:"Bring together your strongest capabilities, personality and proof in one flexible experience.",
      stats:["50+","20","8+"],
      tools:["Figma","Framer","Notion"],
      accent:"#f59e0b",
      background:"#fffdf7",
      surface:"#fff4d9",
      text:"#18130a",
      muted:"#766b58",
      style:"Multidisciplinary Creative"
    })
  },
  {
    id:"portfolio-luxury-consultant",
    name:"Luxury Personal Brand Portfolio",
    description:"Premium personal-brand portfolio for senior consultants, executives and creative leaders with restrained gold accents.",
    category:"Portfolio & Creative",
    style:"Luxury Personal Brand",
    audience:"Consultants, executives, strategists and senior creatives",
    featured:false,
    document:portfolioDocument({
      brand:"Daniel Cole",
      tagline:"Strategy, leadership and transformation.",
      title:"I help ambitious organizations turn complexity into momentum.",
      eyebrow:"Strategist & Advisor",
      description:"An authoritative personal website for senior professionals who need credibility, clarity and an elegant conversion path.",
      primary:"Explore My Work",
      secondary:"Download CV",
      services:["Strategy","Advisory","Leadership"],
      aboutTitle:"Experience that creates perspective.",
      aboutText:"Present a concise career story, leadership philosophy and the evidence behind your expertise.",
      stats:["25+","60+","15+"],
      tools:["Notion","Miro","PowerPoint"],
      accent:"#b88a44",
      background:"#f9f7f2",
      surface:"#f0ece3",
      text:"#1b1916",
      muted:"#746f67",
      style:"Executive Advisor"
    })
  },
  {
    id:"portfolio-fashion-artist",
    name:"Fashion & Art Portfolio",
    description:"High-fashion visual portfolio for stylists, fashion designers and artists with dramatic typography and editorial structure.",
    category:"Portfolio & Creative",
    style:"Fashion Editorial",
    audience:"Fashion designers, stylists, artists and creative directors",
    featured:false,
    document:portfolioDocument({
      brand:"MUSE / 01",
      tagline:"Fashion, image and creative direction.",
      title:"Visual stories made to be remembered.",
      eyebrow:"Fashion Designer & Artist",
      description:"A dramatic editorial portfolio for collections, campaigns, collaborations and visual art direction.",
      primary:"View Collection",
      secondary:"Collaborate",
      services:["Collections","Creative Direction","Editorial"],
      aboutTitle:"Where fashion meets visual storytelling.",
      aboutText:"Introduce the creative philosophy, influences and collaborations behind the work.",
      stats:["16","30+","7+"],
      tools:["Adobe","Figma","Procreate"],
      accent:"#ef4444",
      background:"#ffffff",
      surface:"#f3f3f3",
      text:"#0a0a0a",
      muted:"#737373",
      style:"Fashion Artist"
    })
  },
  {
    id:"bakery-warm-classic", name:"Warm Classic Bakery",
    description:"A welcoming neighbourhood bakery template with warm tones, product-led ordering and a strong family feel.",
    category:"Food & Bakery", style:"Warm Classic", audience:"Neighbourhood bakeries, bread shops and family bakeries", featured:true,
    document:bakeryDocument({brand:"The Daily Bake",tagline:"Fresh bread. Happy moments.",title:"Freshly baked for every day.",eyebrow:"BAKED FRESH DAILY",description:"A friendly bakery website built to showcase your favourites, take orders and bring customers through the door.",accent:"#d97745",services:["Fresh Bread","Pastries","Celebration Cakes"],style:"Neighbourhood Bakery"})
  },
  {
    id:"bakery-modern-minimal", name:"Modern Minimal Bakery",
    description:"Clean premium bakery storefront with restrained typography, product highlights and elegant ordering pathways.",
    category:"Food & Bakery", style:"Modern Minimal", audience:"Premium bakeries, patisseries and artisan bread brands", featured:true,
    document:bakeryDocument({brand:"Miette",tagline:"Small batch. Beautifully baked.",title:"Bread, pastry and beautiful things.",eyebrow:"ARTISAN BAKERY",description:"A refined digital storefront for bakeries that care about ingredients, craft and presentation.",accent:"#8b6b4f",background:"#fbfaf7",surface:"#f0ede7",text:"#24211d",muted:"#77716a",services:["Sourdough","Viennoiserie","Custom Cakes"],style:"Artisan Patisserie"})
  },
  {
    id:"bakery-bold-green", name:"Fresh Green Bakery",
    description:"Bright modern bakery design with energetic green accents for businesses focused on freshness and community.",
    category:"Food & Bakery", style:"Fresh & Organic", audience:"Healthy bakeries, organic food brands and community bakeries",
    document:bakeryDocument({brand:"Good Grain",tagline:"Good food starts here.",title:"Fresh from our kitchen to your table.",eyebrow:"FRESH · LOCAL · GOOD",description:"Put your ingredients, products and community story at the centre of a lively bakery website.",accent:"#65a30d",background:"#f7fbea",surface:"#edf4df",text:"#18200f",muted:"#68715d",services:["Wholegrain Bread","Healthy Bakes","Family Meals"],style:"Fresh & Organic"})
  },
  {
    id:"bakery-chocolate-luxury", name:"Chocolate Patisserie",
    description:"Dark luxury bakery template designed for premium desserts, chocolate, cakes and gifting.",
    category:"Food & Bakery", style:"Dark Luxury", audience:"Patisseries, chocolatiers and premium dessert brands",
    document:bakeryDocument({brand:"Maison Cacao",tagline:"Indulgence, beautifully made.",title:"A little luxury in every bite.",eyebrow:"PREMIUM PATISSERIE",description:"A sophisticated bakery experience for premium cakes, chocolates, desserts and special occasions.",accent:"#d6a15c",background:"#15100d",surface:"#241a15",text:"#f8eee3",muted:"#b7a79b",services:["Signature Cakes","Artisan Chocolate","Dessert Boxes"],style:"Luxury Patisserie",cta:"Order a Box",secondary:"Explore Menu"})
  },
  {
    id:"bakery-family", name:"Family Bakery",
    description:"Friendly high-conversion bakery template built around affordable favourites, meals and family occasions.",
    category:"Food & Bakery", style:"Family Friendly", audience:"Family bakeries, local food shops and community businesses",
    document:bakeryDocument({brand:"Bake & Share",tagline:"Made for family.",title:"Good food made for good moments.",eyebrow:"WELCOME TO OUR BAKERY",description:"Make it easy for families and local customers to discover meals, baked goods and celebration orders.",accent:"#ef8f3d",services:["Daily Bread","Wholesome Meals","Birthday Cakes"],style:"Family Bakery",cta:"Order Today",secondary:"See Menu"})
  },
  {
    id:"bakery-pink-cake", name:"Cake Studio",
    description:"Playful cake and celebration website focused on custom cakes, birthdays, weddings and enquiries.",
    category:"Food & Bakery", style:"Celebration Cakes", audience:"Cake designers, home bakers and celebration cake studios",
    document:bakeryDocument({brand:"Sweet Bloom",tagline:"Cakes made for your moment.",title:"Make every celebration sweeter.",eyebrow:"CUSTOM CAKES & DESSERTS",description:"A joyful portfolio-and-order template for custom cakes, cupcakes, dessert tables and celebrations.",accent:"#ec4899",background:"#fff7fb",surface:"#fcecf4",text:"#27151e",muted:"#806b75",services:["Birthday Cakes","Wedding Cakes","Cupcakes"],style:"Cake Studio",cta:"Request a Cake",secondary:"View Cakes"})
  },
  {
    id:"bakery-african", name:"Proudly Local Bakery",
    description:"Community-first South African bakery template for affordable bread, meals and local customer enquiries.",
    category:"Food & Bakery", style:"Local & Community", audience:"South African bakeries, township bakeries and community food businesses",
    document:bakeryDocument({brand:"Mzansi Bakehouse",tagline:"Freshly baked. Proudly local.",title:"Food that brings the community together.",eyebrow:"PROUDLY SOUTH AFRICAN",description:"Celebrate local flavour, affordable favourites and the people behind your bakery.",accent:"#eab308",background:"#fffdf3",surface:"#f5efc9",text:"#211e10",muted:"#746f55",services:["Fresh Bread","Wholesome Meals","Local Favourites"],style:"Community Bakery",cta:"Order / Enquire",secondary:"Our Menu"})
  },
  {
    id:"bakery-cafe", name:"Bakery Café",
    description:"Café-and-bakery template combining coffee, breakfast, baked goods and visit-focused calls to action.",
    category:"Food & Bakery", style:"Café Lifestyle", audience:"Cafés, coffee shops and bakery cafés",
    document:bakeryDocument({brand:"Roast & Rise",tagline:"Coffee, bread and slow mornings.",title:"Your neighbourhood place for good coffee.",eyebrow:"BAKERY · CAFÉ · COFFEE",description:"Showcase breakfast, coffee, pastries and the atmosphere that makes your café worth visiting.",accent:"#a16207",background:"#faf7f0",surface:"#eee7da",text:"#211c16",muted:"#776d62",services:["Breakfast","Coffee & Tea","Fresh Pastries"],style:"Bakery Café",cta:"View Menu",secondary:"Find Us"})
  },
  {
    id:"bakery-online", name:"Bakery Online Shop",
    description:"Commerce-ready bakery template designed around product discovery, online orders and delivery.",
    category:"Food & Bakery", style:"Online Ordering", audience:"Bakeries selling online, delivery kitchens and food entrepreneurs",
    document:bakeryDocument({brand:"BakeBox",tagline:"Your favourites, delivered.",title:"Fresh bakery favourites at your door.",eyebrow:"ORDER ONLINE",description:"A product-first bakery website designed to move customers from discovery to online ordering quickly.",accent:"#f97316",background:"#fffaf5",surface:"#fff0e3",text:"#24170f",muted:"#7c6b60",services:["Bread Boxes","Treat Boxes","Celebration Cakes"],style:"Bakery Commerce",cta:"Shop Now",secondary:"View Products"})
  },
  {
    id:"bakery-corporate", name:"Corporate Bakery & Catering",
    description:"Professional bakery template for wholesale, office catering, events and recurring business orders.",
    category:"Food & Bakery", style:"Catering & Corporate", audience:"Corporate bakeries, caterers and wholesale food suppliers",
    document:bakeryDocument({brand:"Daily Crumb Co.",tagline:"Baked for teams, events and everyday.",title:"Reliable baking for your business.",eyebrow:"CORPORATE BAKING & CATERING",description:"Present catering packages, wholesale services and easy enquiry pathways for business customers.",accent:"#0f766e",background:"#f5fbfa",surface:"#e5f3f0",text:"#102522",muted:"#61736f",services:["Office Catering","Wholesale Bread","Event Platters"],style:"Corporate Catering",cta:"Request a Quote",secondary:"View Packages"})
  }
  {
    id: "starter-bakery",
    name: "Fresh Bakery",
    description: "Warm conversion-focused bakery website with products, story and enquiry CTA.",
    category: "Food & Bakery",
    style: "Warm Editorial",
    audience: "Bakeries, cafes and food businesses",
    featured: true,
    document: {
      version: 1,
      site: starterSite,
      pages: [{ id: "home", path: "/", title: "Fresh Bakery", elements: [
        { id: "header", type: "header", props: { brand: "Your Bakery", nav1: "Home", nav2: "Menu", nav3: "About", nav4: "Contact", cta: "Order Now" } },
        { id: "hero", type: "hero", props: { eyebrow: "FRESH EVERY DAY", title: "Made fresh. Made with care.", description: "Show customers your signature breads, baked goods and meals with a beautiful mobile-first storefront.", primary: "View Menu", secondary: "Contact Us", primaryUrl: "#menu", secondaryUrl: "#contact" } },
        { id: "menu", type: "features", props: { title: "Customer favourites.", item1: "Fresh Bread", item1Description: "Daily baked loaves and rolls.", item2: "Sweet Treats", item2Description: "Cakes, pastries and desserts.", item3: "Wholesome Meals", item3Description: "Affordable meals made for the community." } },
        section("story", "A bakery people remember.", "Tell your story, highlight quality and make it easy for customers to order or enquire."),
        { id: "contact", type: "lead-form", props: { eyebrow: "ORDER & ENQUIRE", title: "Ready for something delicious?", namePlaceholder: "Your name", emailPlaceholder: "Phone or email", messagePlaceholder: "What would you like to order?", cta: "Send enquiry" } },
        { id: "footer", type: "footer", props: { brand: "Your Bakery", copyright: "© 2026 · Privacy · Terms · Contact" } }
      ] }]
    }
  },
  {
    id: "starter-professional",
    name: "Professional Services",
    description: "Clean authority-led site for consultants, agencies and professional service firms.",
    category: "Professional Services",
    style: "Modern Corporate",
    audience: "Consultants, agencies and service firms",
    featured: true,
    document: {
      version: 1,
      site: starterSite,
      pages: [{ id: "home", path: "/", title: "Professional Services", elements: [
        { id: "header", type: "header", props: { brand: "Your Firm", nav1: "Services", nav2: "Approach", nav3: "About", nav4: "Contact", cta: "Book a Call" } },
        { id: "hero", type: "hero", props: { eyebrow: "EXPERT SUPPORT", title: "Clarity for your next stage of growth.", description: "Position your expertise clearly and turn qualified visitors into conversations.", primary: "Book a Call", secondary: "Our Services", primaryUrl: "#contact", secondaryUrl: "#services" } },
        { id: "services", type: "services", props: { eyebrow: "WHAT WE DO", title: "Practical expertise. Clear outcomes.", item1: "Strategy", item1Description: "A focused roadmap around your priorities.", item2: "Implementation", item2Description: "Hands-on support from plan to execution.", item3: "Advisory", item3Description: "Ongoing guidance when decisions matter." } },
        { id: "proof", type: "testimonials", props: { title: "Trusted by growing teams.", quote: "The process gave us clarity and a much stronger customer experience.", author: "Client name" } },
        { id: "contact", type: "booking", props: { title: "Book a consultation.", helper: "Choose a convenient date and time." } },
        { id: "footer", type: "footer", props: { brand: "Your Firm", copyright: "© 2026 · Privacy · Terms · Contact" } }
      ] }]
    }
  },
  {
    id: "starter-fitness",
    name: "Fitness Studio",
    description: "Bold, energetic layout for gyms, trainers, wellness and fitness studios.",
    category: "Health & Fitness",
    style: "Bold Performance",
    audience: "Gyms, trainers and wellness brands",
    featured: false,
    document: {
      version: 1,
      site: starterSite,
      pages: [{ id: "home", path: "/", title: "Fitness Studio", elements: [
        { id: "header", type: "header", props: { brand: "Your Fitness", nav1: "Programs", nav2: "Coaches", nav3: "Results", nav4: "Contact", cta: "Join Now" } },
        { id: "hero", type: "hero", props: { eyebrow: "TRAIN SMARTER", title: "Your strongest chapter starts here.", description: "Turn your training offer into a clear, motivating digital experience.", primary: "Join Now", secondary: "Explore Programs", primaryUrl: "#contact", secondaryUrl: "#programs" } },
        { id: "programs", type: "features", props: { title: "Programs built around you.", item1: "Strength", item1Description: "Build confidence with structured training.", item2: "Conditioning", item2Description: "Improve fitness, energy and endurance.", item3: "Coaching", item3Description: "Get guidance and accountability." } },
        { id: "pricing", type: "pricing", props: { title: "Simple membership.", item1: "Starter", price1: "R399 / month", item2: "Unlimited", price2: "R699 / month", item3: "Coaching", price3: "R999 / month" } },
        { id: "contact", type: "lead-form", props: { eyebrow: "GET STARTED", title: "Ready to train?", namePlaceholder: "Your name", emailPlaceholder: "Email or phone", messagePlaceholder: "Tell us your goal", cta: "Start my journey" } },
        { id: "footer", type: "footer", props: { brand: "Your Fitness", copyright: "© 2026 · Privacy · Terms · Contact" } }
      ] }]
    }
  },
  {
    id: "starter-retail",
    name: "Modern Store",
    description: "Product-led storefront foundation for retailers and small online shops.",
    category: "Retail & E-commerce",
    style: "Minimal Commerce",
    audience: "Retailers and online sellers",
    featured: true,
    document: {
      version: 1,
      site: starterSite,
      pages: [{ id: "home", path: "/", title: "Modern Store", elements: [
        { id: "header", type: "header", props: { brand: "Your Store", nav1: "Shop", nav2: "Collections", nav3: "About", nav4: "Contact", cta: "Shop Now" } },
        { id: "hero", type: "hero", props: { eyebrow: "NEW COLLECTION", title: "Products worth coming back for.", description: "Create a polished storefront foundation and connect it to your product and checkout tools.", primary: "Shop Collection", secondary: "Learn More", primaryUrl: "#products", secondaryUrl: "#about" } },
        { id: "products", type: "products", props: { title: "Featured products.", item1: "Product One", price1: "R299.00", item2: "Product Two", price2: "R499.00", item3: "Product Three", price3: "R799.00", cta: "Add to cart" } },
        { id: "about", type: "features", props: { title: "Why customers choose us.", item1: "Quality", item1Description: "Products selected with care.", item2: "Fast delivery", item2Description: "Clear fulfilment and communication.", item3: "Real support", item3Description: "A team ready to help." } },
        { id: "footer", type: "footer", props: { brand: "Your Store", copyright: "© 2026 · Privacy · Terms · Contact" } }
      ] }]
    }
  },
  {
    id: "starter-restaurant",
    name: "Restaurant & Takeaway",
    description: "Menu-first restaurant layout with booking and enquiry pathways.",
    category: "Food & Hospitality",
    style: "Editorial Dining",
    audience: "Restaurants, takeaways and hospitality",
    featured: false,
    document: {
      version: 1,
      site: starterSite,
      pages: [{ id: "home", path: "/", title: "Restaurant", elements: [
        { id: "header", type: "header", props: { brand: "Your Restaurant", nav1: "Menu", nav2: "About", nav3: "Bookings", nav4: "Contact", cta: "Book a Table" } },
        { id: "hero", type: "hero", props: { eyebrow: "GOOD FOOD, GOOD MOMENTS", title: "A table worth talking about.", description: "Present your menu, atmosphere and booking options in one focused experience.", primary: "Book a Table", secondary: "View Menu", primaryUrl: "#booking", secondaryUrl: "#menu" } },
        { id: "menu", type: "products", props: { title: "Menu favourites.", item1: "Signature Dish", price1: "R145.00", item2: "Family Meal", price2: "R260.00", item3: "Dessert", price3: "R65.00", cta: "Order / Enquire" } },
        { id: "booking", type: "booking", props: { title: "Reserve your table.", helper: "Select date · Select time · Confirm booking" } },
        { id: "footer", type: "footer", props: { brand: "Your Restaurant", copyright: "© 2026 · Privacy · Terms · Contact" } }
      ] }]
    }
  },
  {
    id: "starter-landing",
    name: "High-Converting Landing Page",
    description: "Focused lead-generation page for campaigns, launches and paid traffic.",
    category: "Marketing",
    style: "Conversion First",
    audience: "Campaigns, launches and lead generation",
    featured: true,
    document: {
      version: 1,
      site: starterSite,
      pages: [{ id: "home", path: "/", title: "Landing Page", elements: [
        { id: "hero", type: "hero", props: { eyebrow: "LIMITED OFFER", title: "Turn more visitors into customers.", description: "A focused campaign page built around one audience, one offer and one next action.", primary: "Claim the Offer", secondary: "See How It Works", primaryUrl: "#contact", secondaryUrl: "#proof" } },
        { id: "benefits", type: "features", props: { title: "Everything you need to decide.", item1: "Clear value", item1Description: "Make the offer easy to understand.", item2: "Social proof", item2Description: "Give visitors confidence before they act.", item3: "One next step", item3Description: "Reduce friction with a focused CTA." } },
        { id: "proof", type: "testimonials", props: { title: "People are already choosing it.", quote: "A clear experience made the decision easy.", author: "Customer name" } },
        { id: "contact", type: "lead-form", props: { eyebrow: "TAKE THE NEXT STEP", title: "Let's get started.", namePlaceholder: "Your name", emailPlaceholder: "Email address", messagePlaceholder: "What are you interested in?", cta: "Get Started" } }
      ] }]
    }
  }
];
