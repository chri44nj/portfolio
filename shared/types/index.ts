export type Cards = {
  id: string;
  heading: string;
  imgSrc: string;
  alt: string;
  icon?: string;
};

export type ControlItem = {
  type: "text" | "icon" | "separator";
  content: string;
  customClass?: string;
};
