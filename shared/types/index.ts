export type Card = {
  id: string;
  heading: string;
  alt: string;
  icon?: string;
  text: string;
  textBack: string;
  step?: number;
};

export type ControlItem = {
  type: "text" | "icon" | "separator";
  content: string;
  customClass?: string;
};

interface ProfileContact {
  email: string;
  phone: string;
  linkedin: string;
  website?: string;
  github?: string;
  twitter?: string;
}

export type Profile = {
  id: string;
  name: string;
  title: string;
  imgSrc: string;
  alt: string;
  bio: string;
  pros: string[];
  cons: string[];
  cardMatches: string[];
};
