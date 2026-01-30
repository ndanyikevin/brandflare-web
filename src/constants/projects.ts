export interface Project {
  id: number;
  title: string;
  location: string;
  category: "Construction" | "Gypsum" | "Finishing" | "Interior Design";
  img: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Contemporary Multi-Unit Complex",
    location: "Oaklands, Ruiru",
    category: "Construction",
    img: "/portfolio/house-2.png"
  },
  {
    id: 2,
    title: "Bulk head Gypsum",
    location: "Kiamumbi, Kiambu",
    category: "Gypsum",
    img: "/portfolio/minimalist-gypsum.png"
  },
  {
    id: 3,
    title: "Modular Master Wardrobe",
    location: "Karen, Nairobi",
    category: "Finishing",
    img: "/portfolio/wardrobe-oak.jpeg"
  },
  {
    id: 4,
    title: "Luxury Marble Feature Wall & Fireplace",
    location: "Kiamumbi, Kiambu",
    category: "Interior Design",
    img: "/portfolio/fireplace-marble.jpeg"
  },
  {
    id: 5,
    title: "Pinnacle Towers",
    location: "Kiamumbi, Kiambu",
    category: "Construction",
    img: "/portfolio/pinnacle-tower-2.jpeg"
  },
  {
    id: 6,
    title: "Executive Apartments",
    location: "Ukunda, Kwale",
    category: "Finishing",
    img: "/portfolio/executive-apartments.jpeg"
  },
  {
    id: 7,
    title: "Modern 5-Bedroom Residence",
    location: "Karatina, Nyeri",
    category: "Construction",
    img: "/portfolio/house-1.png"
  }
];