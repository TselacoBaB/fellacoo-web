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



const PORTFOLIO_VISUALS: Record<string, string[]> = {
  "WR Solutions":["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=82&auto=format&fit=crop"],
  "Mason.":["https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=82&auto=format&fit=crop"],
  "Ava UX":["https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1200&q=82&auto=format&fit=crop"],
  "NOVA Studio":["https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=82&auto=format&fit=crop"],
  "dev//Alex":["https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=82&auto=format&fit=crop"],
  "Lena / Photo":["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=82&auto=format&fit=crop"],
  "FRAME/3D":["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&q=82&auto=format&fit=crop"],
  "Jordan.":["https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=82&auto=format&fit=crop"],
  "Daniel Cole":["https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=82&auto=format&fit=crop"],
  "MUSE / 01":["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=82&auto=format&fit=crop"]
};

const BAKERY_VISUALS: Record<string, string[]> = {
  "The Daily Bake":["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=82&auto=format&fit=crop"],
  "Miette":["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1519869325930-281384150729?w=1200&q=82&auto=format&fit=crop"],
  "Good Grain":["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=82&auto=format&fit=crop"],
  "Maison Cacao":["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=82&auto=format&fit=crop"],
  "Bake & Share":["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=82&auto=format&fit=crop"],
  "Sweet Bloom":["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1558301211-0d8c8c6f6d9b?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&q=82&auto=format&fit=crop"],
  "Mzansi Bakehouse":["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1519869325930-281384150729?w=1200&q=82&auto=format&fit=crop"],
  "Roast & Rise":["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&q=82&auto=format&fit=crop"],
  "BakeBox":["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=82&auto=format&fit=crop"],
  "Daily Crumb Co.":["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1556911220-bff31c812dba5?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=82&auto=format&fit=crop"]
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
      { id:"hero-image", type:"image", props:{ src:(PORTFOLIO_VISUALS[brand]||PORTFOLIO_VISUALS["Mason."])[0], alt:brand+" portfolio feature photography", caption:"Featured work — replace this image with your own work." } },
      { id:"ticker", type:"section", props:{ label:"EXPERTISE", title:"Design · Strategy · Digital · Experience", text:"Selected capabilities brought together into one clear creative portfolio.", buttonLabel:"View Work", buttonUrl:"#work" } },
      { id:"work", type:"features", props:{ anchor:"work", eyebrow:"SELECTED WORK", title:"A portfolio built around meaningful outcomes.", item1:services[0], item1Description:"Thoughtful work from concept through polished delivery.", item2:services[1], item2Description:"Clear systems, strong visual direction and practical execution.", item3:services[2], item3Description:"Experiences designed to be useful, memorable and easy to use." } },
      { id:"gallery", type:"image", props:{ src:(PORTFOLIO_VISUALS[brand]||PORTFOLIO_VISUALS["Mason."])[1], alt:brand+" selected project photography", caption:"Selected project / case study." } },
      { id:"about", type:"section", props:{ label:"ABOUT ME", title:aboutTitle, text:aboutText, buttonLabel:"View My CV", buttonUrl:"#contact" } },
      { id:"stats", type:"features", props:{ title:"Experience at a glance.", item1:stats[0], item1Description:"Selected projects completed.", item2:stats[1], item2Description:"Clients, teams or brands supported.", item3:stats[2], item3Description:"Years spent creating digital work." } },
      { id:"tools", type:"features", props:{ anchor:"services", eyebrow:"MY TOOLKIT", title:"Tools behind the work.", item1:tools[0], item1Description:"Creative workflow and production.", item2:tools[1], item2Description:"Design, prototyping or development.", item3:tools[2], item3Description:"Planning, collaboration and delivery." } },
      { id:"proof", type:"testimonials", props:{ title:"A portfolio built to earn trust.", quote:"Clear thinking, polished execution and a process clients can understand.", author:"Client / collaborator" } },
      { id:"faq", type:"faq", props:{ title:"Working together", question1:"What can I help with?", question2:"How does a project start?", question3:"Can I work remotely?" } },
      { id:"contact", type:"lead-form", props:{ eyebrow:"START A PROJECT", title:contactTitle, namePlaceholder:"Your name", emailPlaceholder:"Email address", messagePlaceholder:"Tell me about your project", cta:"Send enquiry" } },
      { id:"footer", type:"footer", props:{ brand, copyright:"© 2026 · Portfolio · CV · Contact" } }
    ]
  }]
});



const RESTAURANT_VISUALS: Record<string, string[]> = {
  "Noir Table":["https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=82&auto=format&fit=crop"],
  "Casa Forma":["https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=82&auto=format&fit=crop"],
  "Ember House":["https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=82&auto=format&fit=crop"],
  "Sakana":["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=1200&q=82&auto=format&fit=crop"],
  "Sunday Social":["https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=82&auto=format&fit=crop"],
  "Mzansi Table":["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=82&auto=format&fit=crop"],
  "Slice Club":["https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200&q=82&auto=format&fit=crop"],
  "Green Table":["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=82&auto=format&fit=crop"],
  "The Grill Room":["https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=82&auto=format&fit=crop"],
  "The Terrace":["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=82&auto=format&fit=crop","https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=82&auto=format&fit=crop"]
};

const restaurantDocument = ({
  brand, tagline, title, eyebrow, description, accent, background="#faf8f4", surface="#f0ece5",
  text="#191714", muted="#756f67", style="Restaurant", menuTitle="Signature dishes.",
  dishes=["Signature Dish","Chef's Special","Dessert"], prices=["R145","R185","R65"],
  primary="Book a Table", secondary="View Menu", reservationTitle="Reserve your table."
}: {
  brand:string; tagline:string; title:string; eyebrow:string; description:string; accent:string;
  background?:string; surface?:string; text?:string; muted?:string; style?:string;
  menuTitle?:string; dishes?:[string,string,string]; prices?:[string,string,string];
  primary?:string; secondary?:string; reservationTitle?:string;
}): BuilderDocument => {
  const photos=RESTAURANT_VISUALS[brand]||RESTAURANT_VISUALS["Noir Table"];
  return {
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
      id:"home",path:"/",title:brand+" — Restaurant",
      elements:[
        {id:"header",type:"header",props:{brand,nav1:"Menu",nav2:"Experience",nav3:"Reservations",nav4:"Contact",cta:primary}},
        {id:"hero",type:"hero",props:{eyebrow,title,description,primary,secondary,primaryUrl:"#reservation",secondaryUrl:"#menu",badge:style}},
        {id:"hero-image",type:"image",props:{src:photos[0],alt:brand+" restaurant interior and signature food",caption:"A visual taste of the experience."}},
        {id:"menu",type:"products",props:{anchor:"menu",title:menuTitle,item1:dishes[0],price1:prices[0],item2:dishes[1],price2:prices[1],item3:dishes[2],price3:prices[2],cta:"View / Enquire"}},
        {id:"story",type:"section",props:{label:"THE EXPERIENCE",title:"More than a meal.",text:"Tell the story behind the kitchen, the ingredients, the people and the atmosphere that make your restaurant distinct.",buttonLabel:"Our Story",buttonUrl:"#about"}},
        {id:"feature-image",type:"image",props:{src:photos[1],alt:brand+" dining experience",caption:"The atmosphere behind the table."}},
        {id:"specialties",type:"features",props:{anchor:"experience",eyebrow:"WHY GUESTS RETURN",title:"Designed around the experience.",item1:"Fresh ingredients",item1Description:"Seasonal ingredients prepared with care.",item2:"Thoughtful hospitality",item2Description:"A warm experience from arrival to dessert.",item3:"Memorable plates",item3Description:"Signature dishes worth coming back for."}},
        {id:"gallery-image",type:"image",props:{src:photos[2],alt:brand+" food and dining",caption:"Selected dishes and moments."}},
        {id:"proof",type:"testimonials",props:{title:"Guests leave with something to remember.",quote:"Beautiful food, warm service and an atmosphere we wanted to return to.",author:"Guest review"}},
        {id:"reservation",type:"booking",props:{title:reservationTitle,helper:"Choose date · Choose time · Confirm reservation"}},
        {id:"contact",type:"lead-form",props:{eyebrow:"PRIVATE EVENTS & ENQUIRIES",title:"Planning something special?",namePlaceholder:"Your name",emailPlaceholder:"Phone or email",messagePlaceholder:"Tell us about your booking or event",cta:"Send enquiry"}},
        {id:"faq",type:"faq",props:{title:"Dining questions",question1:"Do I need a reservation?",question2:"Do you cater for dietary needs?",question3:"Can I book a private event?"}},
        {id:"footer",type:"footer",props:{brand,copyright:"© 2026 · Menu · Reservations · Contact · Privacy · Terms"}}
      ]
    }]
  };
};

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
      {id:"hero-image",type:"image",props:{src:(BAKERY_VISUALS[brand]||BAKERY_VISUALS["The Daily Bake"])[0],alt:brand+" bakery photography",caption:"Real product photography — replace with your own products."}},
      {id:"menu",type:"products",props:{anchor:"menu",title:menuTitle,item1:services[0],price1:"From R25",item2:services[1],price2:"From R35",item3:services[2],price3:"From R85",cta:"Order / Enquire"}},
      {id:"product-image",type:"image",props:{src:(BAKERY_VISUALS[brand]||BAKERY_VISUALS["The Daily Bake"])[1],alt:services.join(", ")+" bakery products",caption:"Featured products."}},
      {id:"story",type:"section",props:{label:"OUR STORY",title:aboutTitle,text:"Share the story behind your bakery, your ingredients, your community and the reason customers come back.",buttonLabel:"Our Story",buttonUrl:"#about"}},
      {id:"specialties",type:"features",props:{anchor:"services",eyebrow:"WHAT WE BAKE",title:"Something for every craving.",item1:services[0],item1Description:"Freshly prepared favourites made throughout the day.",item2:services[1],item2Description:"Sweet and savoury treats for every occasion.",item3:services[2],item3Description:"Celebration cakes and custom orders made to order."}},
      {id:"gallery",type:"image",props:{src:(BAKERY_VISUALS[brand]||BAKERY_VISUALS["The Daily Bake"])[2],alt:brand+" bakery interior and products",caption:"The atmosphere behind the brand."}},
      {id:"proof",type:"testimonials",props:{title:"Loved by local customers.",quote:"Fresh, reliable and made with care — exactly what a neighbourhood bakery should feel like.",author:"Happy customer"}},
      {id:"faq",type:"faq",props:{title:"Ordering questions",question1:"How do I place an order?",question2:"Do you offer custom orders?",question3:"Do you deliver?"}},
      {id:"contact",type:"lead-form",props:{eyebrow:"ORDER & ENQUIRE",title:"Ready to order?",namePlaceholder:"Your name",emailPlaceholder:"Phone or email",messagePlaceholder:"What would you like to order?",cta:"Send enquiry"}},
      {id:"footer",type:"footer",props:{brand,copyright:"© 2026 · Freshly baked · Orders · Contact"}}
    ]
  }]
});


const ECOMMERCE_VISUAL_POOL = [
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1600&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=82&auto=format&fit=crop"
  ...ecommerceTemplates,
];

const ecommerceDocument = ({
  brand, tagline, title, eyebrow, description, accent, background="#ffffff", surface="#f5f5f3",
  text="#151515", muted="#6b6b67", style="Modern Commerce", productType="physical",
  products=["Product One","Product Two","Product Three"], prices=["R299","R499","R799"],
  primary="Shop Collection", secondary="Explore Products", badge="NEW", shipping="Free delivery over R750",
  visualStart=0
}: {
  brand:string; tagline:string; title:string; eyebrow:string; description:string; accent:string;
  background?:string; surface?:string; text?:string; muted?:string; style?:string; productType?:string;
  products?:[string,string,string]; prices?:[string,string,string]; primary?:string; secondary?:string;
  badge?:string; shipping?:string; visualStart?:number;
}): BuilderDocument => {
  const photos=[0,1,2].map(offset=>ECOMMERCE_VISUAL_POOL[(visualStart+offset)%ECOMMERCE_VISUAL_POOL.length]);
  return {
    version:1,
    site:{
      brandName:brand,tagline,
      theme:{colors:{primary:accent,secondary:text,accent,text,muted,background,surface},
        typography:{headingFont:"Inter, ui-sans-serif, system-ui, sans-serif",bodyFont:"Inter, ui-sans-serif, system-ui, sans-serif",headingWeight:"900",bodyWeight:"400"},
        radius:"18px",containerWidth:"1200px",buttonStyle:"pill"},
      seo:{title:brand+" — "+tagline,description}
    },
    pages:[{id:"home",path:"/",title:brand+" — Store",elements:[
      {id:"header",type:"header",props:{brand,nav1:"Shop",nav2:"Collections",nav3:"About",nav4:"Support",cta:"Cart"}},
      {id:"hero",type:"hero",props:{eyebrow,title,description,primary,secondary,primaryUrl:"#products",secondaryUrl:"#story",badge}},
      {id:"hero-image",type:"image",props:{src:photos[0],alt:brand+" ecommerce product photography",caption:"Replace demo photography with your own product imagery."}},
      {id:"trust",type:"features",props:{eyebrow:"SHOP WITH CONFIDENCE",title:"Everything customers need before checkout.",item1:"Secure checkout",item1Description:"Clear pricing, payment and order confirmation.",item2:"Flexible fulfilment",item2Description:shipping,item3:"Customer support",item3Description:"Easy contact, returns and order questions."}},
      {id:"products",type:"products",props:{anchor:"products",title:"Featured products.",item1:products[0],price1:prices[0],item2:products[1],price2:prices[1],item3:products[2],price3:prices[2],image1:photos[1],image2:photos[2],image3:photos[0],badge1:badge,badge2:"BEST SELLER",badge3:"FEATURED",type1:productType,type2:productType,type3:productType,shipping1:shipping,shipping2:shipping,shipping3:shipping,cta:"Add to cart"}},
      {id:"story",type:"section",props:{anchor:"story",label:"THE BRAND",title:"A store built around trust, not clutter.",text:"Use this space for materials, sourcing, guarantees, product education and the story behind the brand.",buttonLabel:"Our Story",buttonUrl:"#contact"}},
      {id:"lifestyle-image",type:"image",props:{src:photos[2],alt:brand+" lifestyle product photography",caption:"Lifestyle imagery helps customers understand the product in context."}},
      {id:"fulfilment",type:"features",props:{eyebrow:"FULFILMENT",title:"Clear fulfilment for every order.",item1:"Physical goods",item1Description:"Calculate shipping and route packing and dispatch information.",item2:"Digital goods",item2Description:"Skip shipping and issue a secure download after payment.",item3:"Dropship items",item3Description:"Forward supplier fulfilment data and synchronize availability."}},
      {id:"proof",type:"testimonials",props:{title:"Loved after the first order.",quote:"The product looked exactly like the site, checkout was clear and delivery updates were easy to follow.",author:"Verified customer"}},
      {id:"faq",type:"faq",props:{title:"Shopping questions",question1:"How does shipping work?",question2:"What is your returns policy?",question3:"When will my order be delivered?"}},
      {id:"contact",type:"lead-form",props:{eyebrow:"CUSTOMER SUPPORT",title:"Need help before you buy?",namePlaceholder:"Your name",emailPlaceholder:"Email or order number",messagePlaceholder:"How can we help?",cta:"Contact Support"}},
      {id:"footer",type:"footer",props:{brand,copyright:"© 2026 · Shop · Shipping · Returns · Privacy · Terms · Contact"}}
    ]}]
  };
};

const ecommerceTemplates: StarterTemplate[] = [
  ["ecom-luxury-atelier","High-End Atelier","Editorial luxury storefront for designer fashion, jewellery and high-ticket products.","High-End Atelier","Luxury fashion and premium goods","Aurelia Atelier","Objects made to be kept.","Quiet luxury, considered in every detail.","THE NEW COLLECTION","A restrained editorial storefront where craftsmanship and photography lead the sale.","#111111","#fbfaf7","#f0eee9","#171717","#77736d",["Silk Tailored Coat","Sculptural Bag","Gold Signet"],["R4 800","R3 200","R2 450"],"Shop the Collection","Discover the Craft","NEW","Complimentary delivery over R3 000","physical",0],
  ["ecom-quiet-luxury","Quiet Luxury","Muted premium shop with generous whitespace and tactile product storytelling.","Quiet Luxury","Premium apparel and lifestyle brands","NOVA Maison","Less, but better.","Pieces for a slower, better wardrobe.","QUIET LUXURY","Soft neutrals and confident product presentation for customers who value quality.","#8b8176","#f8f6f2","#eeebe5","#24211e","#79736c",["Linen Lounge Chair","Soft Wool Throw","Oak Side Table"],["R6 900","R1 850","R8 400"],"Shop Essentials","Read Our Story","EDITED","Free nationwide delivery","physical",3],
  ["ecom-art-gallery","Art Gallery Shop","Asymmetrical gallery-style store for furniture, objects, art and collectible design.","Art Gallery Minimal","Furniture studios and collectible design brands","Arc Objects","Objects with a point of view.","Functional objects, displayed like art.","COLLECTED OBJECTS","A gallery-inspired commerce experience built around visual discovery.","#b45309","#f7f6f2","#e9e7df","#171716","#77766f",["Arc Lounge Chair","Studio Lamp","Stone Side Table"],["R12 500","R2 900","R5 600"],"View the Collection","Visit the Studio","COLLECTED","White-glove delivery available","physical",6],
  ["ecom-heritage","Bespoke Heritage","Heritage commerce for handcrafted leather, watches and artisan goods.","Bespoke Heritage","Leather goods and heritage craft brands","Heritage & Co.","Crafted for generations.","The craft is in the details.","EST. 1986 · HANDCRAFTED","Deep heritage tones and craftsmanship storytelling build premium trust.","#a67c52","#17130f","#262019","#f4eadf","#b8a999",["Handstitched Briefcase","Automatic Field Watch","Leather Belt"],["R4 200","R9 800","R1 450"],"Shop Heritage","Our Craft","HANDCRAFTED","Complimentary insured delivery","physical",9],
  ["ecom-vip","VIP Lounge","Dark exclusive storefront for limited drops and premium collections.","VIP Lounge","Exclusive drops and premium collections","Velvet Room","Access the exceptional.","Private access to the next drop.","MEMBERS FIRST","A cinematic shopping experience built around exclusivity and scarcity.","#d4af67","#0d0c0d","#1b181b","#f8f4ec","#aaa09a",["Limited Edition Jacket","Velvet Shoulder Bag","Collector Sneaker"],["R5 500","R3 900","R4 800"],"Enter the Collection","Join the List","LIMITED DROP","Priority insured shipping","physical",12],
  ["ecom-bento-tech","Bento Grid Shop","Modular DTC technology store with product, feature and proof cards.","Bento Grid Shop","Gadgets and tech accessories","Mono Supply","Better tools for modern life.","Technology that earns its place.","SMARTER ESSENTIALS","A crisp product-first shop for modern hardware.","#2563eb","#f7f9fc","#e9eef7","#101827","#64748b",["Studio Headphones","Desk Dock","Travel Keyboard"],["R2 499","R1 299","R1 899"],"Shop Devices","Compare Products","NEW","Free shipping over R1 500","physical",15],
  ["ecom-dtc-tech","SaaS-Style DTC","Ultra-clean electronics store focused on features, comparison and warranty.","SaaS-Style DTC","Smart home and modern electronics","HomeTech Co.","Technology, without the friction.","Smart products. Simple decisions.","DESIGNED FOR EVERYDAY","A conversion-focused electronics storefront with crisp hierarchy.","#4f46e5","#ffffff","#f3f4f6","#111827","#6b7280",["Smart Hub","Air Sensor","Desk Light"],["R1 799","R899","R1 299"],"Shop Smart Home","Compare Features","BEST SELLER","30-day returns + 2-year warranty","physical",18],
  ["ecom-apothecary","Clean Apothecary","Clinical-modern skincare storefront with ingredient education and trust.","Clean Apothecary","Skincare and clean personal care brands","Glow Lab","Simple science for better skin.","Your routine, made clearer.","DERMATOLOGY-INSPIRED CARE","Ingredients, routines, reviews and transparent information lead the sale.","#111827","#ffffff","#f5f7f6","#17201d","#69756f",["Barrier Cream","Daily Serum","Mineral SPF"],["R420","R510","R360"],"Build Your Routine","Explore Ingredients","CLINICALLY MINDED","Free delivery over R600","physical",21],
  ["ecom-fast-fashion","Hyper-Functional Fashion","High-volume fashion grid for rapid browsing and quick purchase decisions.","Hyper-Functional Fast-Fashion","Affordable fashion and apparel catalogues","Street Dept.","New looks, every week.","The drop starts here.","NEW IN · WEEKLY","A dense mobile-first storefront built for rapid shopping.","#111111","#ffffff","#f4f4f4","#111111","#666666",["Oversized Bomber","Utility Cargo","Graphic Tee"],["R899","R699","R399"],"Shop New In","View Sale","-20%","Fast nationwide delivery","physical",24],
  ["ecom-curated-boutique","Curated Boutique","Lifestyle-led boutique shop using styled photography and story-rich discovery.","Curated Boutique","Home decor, gifts and lifestyle stores","NOVA Maison","Beautiful things for everyday life.","A home, curated slowly.","THE EDIT","Products are photographed inside real spaces so customers can imagine owning them.","#a16207","#faf8f3","#eee8dd","#28231e","#746d63",["Ceramic Vessel","Linen Cushion","Oak Tray"],["R520","R380","R690"],"Shop the Edit","Explore the Home","EDITOR'S PICK","Free local delivery over R1 000","physical",27],
  ["ecom-streetwear","Streetwear Drop Culture","Neo-brutalist hype store for limited sneakers, apparel and culture drops.","Streetwear Drop Culture","Streetwear and limited-edition apparel","Street Dept.","No restocks. No apologies.","The drop is live.","DROP 014 · LIMITED","Raw photography, bold type and scarcity cues for hype-driven launches.","#ccff00","#f4f4f0","#ffffff","#090909","#4b4b4b",["Drop Hoodie","Runner 014","Utility Cap"],["R1 299","R2 499","R499"],"Shop the Drop","View Lookbook","LIMITED","Same-week dispatch","physical",30],
  ["ecom-candy-pop","Candy Pop Retail","Playful youth-focused storefront for beauty, accessories and colourful products.","Candy Pop Retail","Gen-Z beauty and accessory brands","Candy Club","Cute things. Big energy.","Your cart just got happier.","NEW & PLAYFUL","A colourful store designed around discovery and gifting.","#ec4899","#fff7fb","#fce7f3","#251522","#866a7d",["Gloss Kit","Charm Case","Mini Bag"],["R299","R349","R599"],"Shop the Fun","Gift Guide","JUST IN","Free shipping over R750","physical",0],
  ["ecom-acid-pop","Acid Pop Marketplace","Experimental commerce direction for alternative fashion and rave culture.","Acid Pop Marketplace","Alternative fashion and rave wear","Chrome Youth","Wear the future.","Reality, but louder.","ACID / CHROME / NIGHT","A high-energy storefront designed to feel like an event.","#8b5cf6","#f3f0ff","#e9e4ff","#17121f","#756c82",["Chrome Top","Iridescent Bag","Night Runner"],["R1 100","R850","R1 600"],"Enter the Drop","Explore Looks","NEW WAVE","Tracked express delivery","physical",3],
  ["ecom-y2k","Y2K Retro Shop","Retro-digital storefront for vintage accessories and collectibles.","Y2K Retro-Shop","Vintage and retro accessory sellers","Pixel Supply","Back online.","The internet's favourite era is back.","Y2K ARCHIVE","Nostalgic commerce energy with a clear modern shopping path.","#06b6d4","#eefaff","#dcf7ff","#0d1820","#55717d",["Arcade Headset","Pixel Console","Retro Tee"],["R799","R1 999","R499"],"Shop Archive","See the Collection","ARCHIVE","Tracked delivery worldwide","physical",6],
  ["ecom-cyber-gamified","Gamified Cyber-Shop","Dark gaming storefront with progress-driven incentives and drops.","Gamified Cyber-Shop","Gaming peripherals and PC accessories","Pixel Supply","Level up your setup.","Build a setup worth showing off.","LOADOUT 08","A dark gaming commerce experience designed around equipment and high intent.","#22c55e","#080b0a","#111714","#effff5","#8da296",["Mechanical Keyboard","Gaming Mouse","RGB Headset"],["R1 699","R999","R1 499"],"Build Your Loadout","Compare Gear","EPIC","Free shipping over R2 000","physical",9],
  ["ecom-earthy","Earthy Organic Shop","Natural commerce template with tactile surfaces and sustainability proof.","Earthy Organic Shop","Eco-friendly products and sustainable home brands","Terra Goods","Made with the earth in mind.","Everyday goods, thoughtfully made.","LOW-IMPACT LIVING","Warm materials and honest product stories build ethical buying confidence.","#a16207","#f7f2e9","#ebe1d1","#30261c","#75695b",["Woven Basket","Clay Candle","Linen Throw"],["R480","R260","R890"],"Shop Thoughtfully","Our Materials","LOW IMPACT","Plastic-free packaging","physical",12],
  ["ecom-botanical","Botanical Green Market","Forest-green natural shop for teas, plants and botanical products.","Botanical Green Market","Herbal teas, plant shops and natural wellness","Botanica Market","Good things grow here.","A greener kind of shopping.","BOTANICAL GOODS","Deep greens and educational product storytelling for botanical brands.","#166534","#f5faf4","#e3efe1","#18301e","#667568",["Herbal Tea Set","Indoor Plant","Botanical Oil"],["R320","R450","R280"],"Shop Botanicals","Learn the Plants","FRESH HARVEST","Careful plant-safe delivery","physical",15],
  ["ecom-wellness","Holistic Wellness Zen","Calm wellness storefront with routines and soft conversion pathways.","Holistic Wellness Zen","Yoga, meditation and wellness products","Still / Well","Make space to feel better.","Tools for a quieter everyday.","WELLNESS ESSENTIALS","Product education and routines lead naturally toward purchase.","#52758a","#f7f8f6","#e9efef","#172126","#68777c",["Meditation Cushion","Yoga Mat","Breathwork Cards"],["R690","R1 100","R280"],"Shop Wellness","Build a Routine","CALM ESSENTIAL","Free delivery over R900","physical",18],
  ["ecom-cottagecore","Cottagecore Market","Handcrafted market aesthetic for soaps, preserves and handmade goods.","Cottagecore Market","Handmade and artisanal brands","Meadow Market","Made slowly, shared warmly.","Little goods with a big story.","HANDMADE · SMALL BATCH","A handcrafted storefront with warm imagery and a personal maker voice.","#9a6b4a","#fbf4e8","#f0dfc7","#3a2a20","#7c695c",["Handmade Soap","Berry Preserve","Linen Apron"],["R95","R120","R520"],"Shop Handmade","Meet the Maker","SMALL BATCH","Packed by hand within 2 days","physical",21],
  ["ecom-sun-drenched","Sun-Drenched Nomad","Warm resort-commerce template for swimwear, travel goods and summer lifestyle.","Sun-Drenched Nomad","Swimwear and travel gear","Sol Nomad","Made for the way there.","Pack light. Live brightly.","SUMMER / TRAVEL / SUN","A sunlit lifestyle store built around travel stories and product discovery.","#ea580c","#fff8ed","#f6e4c8","#2d1b12","#80685b",["Linen Set","Canvas Weekender","Sun Hat"],["R1 250","R1 850","R490"],"Shop the Escape","Explore the Journal","SUMMER EDIT","Worldwide tracked delivery","physical",24],
  ["ecom-magazine","The Magazine Shop","Editorial commerce where products live inside stories and long-form content.","The Magazine Shop","Independent stationery and niche brands","Field Notes","Objects worth writing about.","Shop the stories behind the things.","ISSUE 07 · THE EDIT","A magazine-inspired store that turns product discovery into editorial storytelling.","#7c3aed","#f8f7f4","#ebe9e3","#171717","#706e69",["Field Journal","Archive Pen","Photo Book"],["R260","R180","R690"],"Shop the Issue","Read the Stories","EDITOR'S EDIT","Instant secure download after payment","digital",27],
  ["ecom-culinary","Culinary Editorial Shop","Food-first commerce for gourmet ingredients and recipe-led product sales.","Culinary Editorial","Gourmet food and specialty ingredients","Cask & Kitchen","Cook something worth remembering.","Ingredients with a story to tell.","PANTRY / RECIPES / CRAFT","High-impact food photography connects inspiration directly to products.","#b45309","#fffaf2","#f2e6d5","#241a12","#786b61",["Smoked Chilli Oil","Reserve Olive Oil","Chef's Pantry Box"],["R190","R260","R690"],"Shop the Pantry","Browse Recipes","CHEF'S PICK","Temperature-safe packaging","physical",30],
  ["ecom-everyday","Everyday Essential","Trust-first high-volume storefront for household goods, pet products and catalogues.","Everyday Essential","Household goods and repeat-purchase catalogues","Everyday Supply","The things you need, made easy.","Everyday shopping without the friction.","ESSENTIALS · VALUE · DELIVERY","A predictable fast-shopping architecture designed for repeat orders.","#0f766e","#f7fbfb","#e7f2f0","#132525","#607371",["Home Care Pack","Pet Essentials","Kitchen Bundle"],["R299","R449","R599"],"Shop Essentials","Browse Categories","TOP RATED","Physical + digital items can share one cart","hybrid",0],
  ["ecom-hardware","Fintech-Clean Hardware","Premium hardware store with warranty, secure payment and high-consideration messaging.","Fintech-Clean Hardware","Appliances and high-consideration products","HomeTech Co.","Big purchases, made simple.","Confidence before you click buy.","WARRANTY · DELIVERY · SUPPORT","A trustworthy hardware experience that answers practical questions before checkout.","#0f766e","#f8fafc","#e9eef2","#13212b","#63727d",["Smart Air Purifier","Sleep System","Home Hub"],["R4 999","R12 900","R2 499"],"Shop Hardware","Compare & Learn","2-YEAR WARRANTY","Supplier fulfilment + live stock synchronization","dropship",3]
].map((x,i)=>({
  id:x[0],name:x[1],description:x[2],category:"E-commerce",style:x[3],audience:x[4],featured:i<3,
  document:ecommerceDocument({brand:x[5],tagline:x[6],title:x[7],eyebrow:x[8],description:x[9],accent:x[10],background:x[11],surface:x[12],text:x[13],muted:x[14],products:x[15],prices:x[16],primary:x[17],secondary:x[18],badge:x[19],shipping:x[20],productType:x[21],visualStart:x[22]})
})) as StarterTemplate[];

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
  },
  {
    id:"restaurant-editorial-fine-dining", name:"Editorial Fine Dining",
    description:"High-end editorial restaurant template with immersive photography, refined typography and reservation-first conversion.",
    category:"Restaurant", style:"Editorial Luxury", audience:"Fine dining restaurants and premium hospitality", featured:true,
    document:restaurantDocument({brand:"Noir Table",tagline:"Modern dining after dark.",title:"An evening worth dressing up for.",eyebrow:"FINE DINING · JOHANNESBURG",description:"A cinematic restaurant experience for seasonal menus, intimate dining and memorable evenings.",accent:"#c59b63",background:"#0c0c0b",surface:"#191816",text:"#f5f0e8",muted:"#aaa094",style:"Fine Dining",dishes:["Tasting Menu","Chef's Selection","Dessert Course"],prices:["R895","R1 250","R165"],primary:"Reserve a Table",secondary:"Explore Menu"})
  },
  {
    id:"restaurant-italian", name:"Italian Trattoria",
    description:"Warm contemporary Italian restaurant template focused on pasta, pizza, wine and relaxed dining.",
    category:"Restaurant", style:"Warm Mediterranean", audience:"Italian restaurants, trattorias and pizzerias",
    document:restaurantDocument({brand:"Casa Forma",tagline:"Pasta, pizza and good company.",title:"Come hungry. Leave happy.",eyebrow:"ITALIAN KITCHEN",description:"A warm digital home for handmade pasta, wood-fired pizza and long lunches with friends.",accent:"#b45309",background:"#fffaf2",surface:"#f3e8d5",text:"#211b15",muted:"#75695e",style:"Italian Trattoria",dishes:["Handmade Pasta","Wood-Fired Pizza","Tiramisu"],prices:["R165","R145","R65"],primary:"Book a Table",secondary:"See the Menu"})
  },
  {
    id:"restaurant-steakhouse", name:"Modern Steakhouse",
    description:"Dark, premium steakhouse template with bold photography, menu highlights and reservation CTA.",
    category:"Restaurant", style:"Dark Premium", audience:"Steakhouses, grill houses and premium dining",
    document:restaurantDocument({brand:"Ember House",tagline:"Fire, flavour and good company.",title:"Steak worth making plans for.",eyebrow:"FIRE-GRILLED DINING",description:"Showcase prime cuts, open-fire cooking and a bold hospitality experience.",accent:"#ef4444",background:"#11100f",surface:"#1e1b19",text:"#f8f3ee",muted:"#b3a69d",style:"Modern Steakhouse",dishes:["Prime Ribeye","Ember Burger","Chocolate Tart"],prices:["R395","R165","R85"],primary:"Reserve a Table",secondary:"View Cuts"})
  },
  {
    id:"restaurant-japanese", name:"Japanese Sushi Bar",
    description:"Calm Japanese-inspired restaurant template with disciplined spacing, food photography and precise navigation.",
    category:"Restaurant", style:"Japanese Minimal", audience:"Sushi bars, Japanese restaurants and omakase venues",
    document:restaurantDocument({brand:"Sakana",tagline:"Precision, freshness, simplicity.",title:"Japanese dining with quiet confidence.",eyebrow:"SUSHI · SASHIMI · OMAKASE",description:"A refined digital experience for sushi, sashimi, ramen and chef-led dining.",accent:"#dc2626",background:"#f7f7f5",surface:"#ececea",text:"#151515",muted:"#6b6b67",style:"Japanese Sushi",dishes:["Omakase","Sushi Selection","Miso Ramen"],prices:["R850","R320","R125"],primary:"Reserve Omakase",secondary:"View Menu"})
  },
  {
    id:"restaurant-cafe-brunch", name:"Café & Brunch",
    description:"Bright lifestyle café template for breakfast, brunch, coffee and social dining.",
    category:"Restaurant", style:"Lifestyle Café", audience:"Cafés, brunch spots and coffee-led restaurants",
    document:restaurantDocument({brand:"Sunday Social",tagline:"Slow mornings. Good food.",title:"Your new favourite weekend table.",eyebrow:"CAFÉ · BRUNCH · COFFEE",description:"A bright, social website built around brunch favourites, specialty coffee and an easy visit journey.",accent:"#e07a5f",background:"#fffaf7",surface:"#f6e9e3",text:"#211816",muted:"#786b66",style:"Café & Brunch",dishes:["Breakfast Board","Avocado Toast","Flat White"],prices:["R145","R95","R38"],primary:"Book a Table",secondary:"Brunch Menu"})
  },
  {
    id:"restaurant-south-african", name:"South African Dining",
    description:"Modern proudly-local restaurant template for South African cuisine, hospitality and community storytelling.",
    category:"Restaurant", style:"Modern African", audience:"South African restaurants and local dining brands",
    document:restaurantDocument({brand:"Mzansi Table",tagline:"South African food, beautifully served.",title:"A taste of home, made memorable.",eyebrow:"PROUDLY SOUTH AFRICAN",description:"Celebrate local ingredients, familiar flavours and contemporary South African hospitality.",accent:"#d97706",background:"#fffaf0",surface:"#f2e5ce",text:"#241b12",muted:"#756757",style:"Modern African Dining",dishes:["Braai Platter","Bunny Chow","Malva Pudding"],prices:["R295","R125","R75"],primary:"Book a Table",secondary:"Explore Menu"})
  },
  {
    id:"restaurant-pizzeria", name:"Modern Pizzeria",
    description:"Energetic pizza restaurant template with bold product cards, takeaway pathways and delivery-ready CTAs.",
    category:"Restaurant", style:"Bold Pizzeria", audience:"Pizzerias, takeaway restaurants and delivery kitchens",
    document:restaurantDocument({brand:"Slice Club",tagline:"Hot pizza. Zero fuss.",title:"Your next pizza night starts here.",eyebrow:"PIZZA · TAKEAWAY · DELIVERY",description:"Put your signature pizzas first and make ordering, takeaway and delivery impossible to miss.",accent:"#f97316",background:"#fffaf5",surface:"#ffead8",text:"#24150c",muted:"#7b6254",style:"Modern Pizzeria",dishes:["Margherita","Spicy Salami","Garlic Knots"],prices:["R110","R145","R55"],primary:"Order Now",secondary:"View Menu"})
  },
  {
    id:"restaurant-vegan", name:"Plant-Based Restaurant",
    description:"Fresh organic restaurant template for vegan, vegetarian and health-conscious dining.",
    category:"Restaurant", style:"Organic Modern", audience:"Vegan restaurants, vegetarian cafés and wellness food brands",
    document:restaurantDocument({brand:"Green Table",tagline:"Plants first. Flavour always.",title:"Fresh food with nothing to hide.",eyebrow:"PLANT-BASED KITCHEN",description:"A clean, vibrant restaurant experience built around seasonal produce and thoughtful plant-based food.",accent:"#16a34a",background:"#f7fbf6",surface:"#e8f2e7",text:"#132018",muted:"#647267",style:"Plant-Based",dishes:["Seasonal Bowl","Green Burger","Coconut Tart"],prices:["R135","R125","R70"],primary:"Book a Table",secondary:"Explore Dishes"})
  },
  {
    id:"restaurant-grill", name:"Contemporary Grill Room",
    description:"Structured premium grill template for business lunches, dinners, private dining and special occasions.",
    category:"Restaurant", style:"Contemporary Grill", audience:"Grill rooms, business restaurants and premium casual dining",
    document:restaurantDocument({brand:"The Grill Room",tagline:"Good food. Serious flavour.",title:"Made for long lunches and late dinners.",eyebrow:"CONTEMPORARY GRILL",description:"A confident restaurant website built for reservations, business dining and signature grill dishes.",accent:"#b91c1c",background:"#151313",surface:"#242020",text:"#f7f3f0",muted:"#b4aaa4",style:"Contemporary Grill",dishes:["Dry-Aged Sirloin","Chicken Supreme","Crème Brûlée"],prices:["R365","R195","R85"],primary:"Book a Table",secondary:"View Menu"})
  },
  {
    id:"restaurant-rooftop", name:"Rooftop & Cocktail Dining",
    description:"Atmospheric rooftop restaurant template built around sunset views, cocktails, events and reservations.",
    category:"Restaurant", style:"Rooftop Lifestyle", audience:"Rooftop restaurants, cocktail bars and destination dining",
    document:restaurantDocument({brand:"The Terrace",tagline:"Dinner above the city.",title:"Eat, drink and stay for sunset.",eyebrow:"ROOFTOP · DINING · COCKTAILS",description:"Sell the atmosphere as much as the menu with an experience-led rooftop restaurant website.",accent:"#7c3aed",background:"#0f1020",surface:"#1c1d35",text:"#f8f7ff",muted:"#aaa9c0",style:"Rooftop Dining",dishes:["Terrace Burger","Seared Tuna","Signature Cocktail"],prices:["R185","R225","R110"],primary:"Reserve Your Table",secondary:"Explore the Experience"})
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
  ...ecommerceTemplates,
];
