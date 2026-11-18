import type { CategoryId } from '../types';

export interface BrandEntry {
  brand: string;
  products: string[];
}

export type Catalog = Record<CategoryId, BrandEntry[]>;

/** Seed catalog — extendable at runtime via addBrand / addProduct */
export const SEED_CATALOG: Catalog = {
  kibble: [
    { brand: 'BOW', products: ['BOW Sữa dê', 'BOW Cá ngừ', 'BOW Vị bò'] },
    { brand: 'PetQ', products: ['PetQ Kibble Adult'] },
    { brand: 'Royal Canin', products: ['Royal Canin Kitten'] },
  ],
  pate: [
    { brand: 'PetQ', products: ['PetQ Pate cá hồi', 'PetQ Pate gà'] },
    { brand: 'Whiskas', products: ['Whiskas Pate cá ngừ'] },
    { brand: 'Royal Canin', products: ['Royal Canin Pate Kitten'] },
  ],
  litter: [
    { brand: 'N1', products: ['N1 Cát vệ sinh'] },
    { brand: 'Ever Clean', products: ['Ever Clean Clump'] },
    { brand: 'Pet Angle', products: ['Pet Angle Cát'] },
  ],
  treats: [
    { brand: 'Ciao', products: ['Ciao Thanh cá hồi', 'Ciao Thanh gà'] },
    { brand: 'INABA', products: ['INABA Snack cá'] },
    { brand: 'PetQ', products: ['PetQ Snack gà'] },
  ],
};
