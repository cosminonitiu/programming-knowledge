import { Subcategory } from "./Subcategory";

export interface Category {
  id: string;
  name: string;
  icon: any; // Replace 'any' with the proper type of your icon component or data.
  subcategories: Subcategory[];
}