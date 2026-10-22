import type { ComponentType, SVGProps } from "react";
import { BrushIcon, CreamIcon, DryerIcon, LipstickIcon, MascaraIcon, MirrorIcon, PerfumeIcon, PolishIcon } from "@/components/Icons";

export type RailBrand = {
  name: string;
  url: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional: put a logo file in public/images/brands/ and write its path here, e.g. "/images/brands/dyson.svg" */
  logo?: string;
};

// ✏️ برندها و لینک‌ها رو می‌تونی اینجا عوض کنی. برای لوگوی واقعی، فایل رو توی public/images/brands/ بذار و مسیرش رو در logo بنویس.
export const RAIL_BRANDS: RailBrand[] = [
  { name: "Dyson", url: "https://www.dyson.com", icon: DryerIcon },
  { name: "ghd", url: "https://www.ghdhair.com", icon: DryerIcon },
  { name: "BaByliss", url: "https://www.babyliss.com", icon: BrushIcon },
  { name: "Shark", url: "https://www.sharkclean.com", icon: DryerIcon },
  { name: "Maybelline", url: "https://www.maybelline.com", icon: MascaraIcon },
  { name: "MAC", url: "https://www.maccosmetics.com", icon: LipstickIcon },
  { name: "NYX", url: "https://www.nyxcosmetics.com", icon: LipstickIcon },
  { name: "Estée Lauder", url: "https://www.esteelauder.com", icon: CreamIcon },
  { name: "Lancôme", url: "https://www.lancome.com", icon: PerfumeIcon },
  { name: "Dior Beauty", url: "https://www.dior.com", icon: PerfumeIcon },
  { name: "Clinique", url: "https://www.clinique.com", icon: CreamIcon },
  { name: "The Ordinary", url: "https://theordinary.com", icon: CreamIcon },
  { name: "CeraVe", url: "https://www.cerave.com", icon: CreamIcon },
  { name: "NIVEA", url: "https://www.nivea.com", icon: CreamIcon },
  { name: "Garnier", url: "https://www.garnier.com", icon: MirrorIcon },
  { name: "Essie", url: "https://www.essie.com", icon: PolishIcon },
];
