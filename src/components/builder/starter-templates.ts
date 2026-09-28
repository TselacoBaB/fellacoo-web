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

export const starterTemplates: StarterTemplate[] = [
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
      pages: [{ id: "home", path: "/", title: "Landing Page", elements: [
        { id: "hero", type: "hero", props: { eyebrow: "LIMITED OFFER", title: "Turn more visitors into customers.", description: "A focused campaign page built around one audience, one offer and one next action.", primary: "Claim the Offer", secondary: "See How It Works", primaryUrl: "#contact", secondaryUrl: "#proof" } },
        { id: "benefits", type: "features", props: { title: "Everything you need to decide.", item1: "Clear value", item1Description: "Make the offer easy to understand.", item2: "Social proof", item2Description: "Give visitors confidence before they act.", item3: "One next step", item3Description: "Reduce friction with a focused CTA." } },
        { id: "proof", type: "testimonials", props: { title: "People are already choosing it.", quote: "A clear experience made the decision easy.", author: "Customer name" } },
        { id: "contact", type: "lead-form", props: { eyebrow: "TAKE THE NEXT STEP", title: "Let's get started.", namePlaceholder: "Your name", emailPlaceholder: "Email address", messagePlaceholder: "What are you interested in?", cta: "Get Started" } }
      ] }]
    }
  }
];
