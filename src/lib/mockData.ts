import type { Purchase } from '../types';

let seq = 0;
function p(
  date: string,
  categoryId: Purchase['categoryId'],
  brand: string,
  product: string,
  quantity: number,
  unitId: string,
  totalPrice: number,
): Purchase {
  return {
    id: `seed-${++seq}`,
    date,
    categoryId,
    brand,
    product,
    quantity,
    unitId,
    totalPrice,
  };
}

/**
 * Realistic sample data covering ~7 months so charts, filters and the
 * Quick Price Checker have history immediately. Includes the spec example:
 * BOW kibble bought as 10 gói (= 5 kg) for 80,000 ₫ -> 16,000 ₫/kg.
 */
export const SEED_PURCHASES: Purchase[] = [
  // --- Kibble ---
  p('2026-05-10', 'kibble', 'BOW', 'BOW Sữa dê', 10, 'goi', 80000), // 5 kg -> 16k/kg
  p('2026-05-28', 'kibble', 'BOW', 'BOW Sữa dê', 4, 'kg', 76000), // 19k/kg
  p('2026-06-12', 'kibble', 'BOW', 'BOW Sữa dê', 10, 'goi', 84000), // 5 kg -> 16.8k/kg
  p('2026-06-30', 'kibble', 'BOW', 'BOW Cá ngừ', 1, 'bao', 165000), // 5kg -> 33k/kg
  p('2026-07-15', 'kibble', 'BOW', 'BOW Cá ngừ', 20, 'goi', 320000), // 10kg -> 32k/kg
  p('2026-07-29', 'kibble', 'BOW', 'BOW Cá ngừ', 2, 'tui', 90000), // 4kg -> 22.5k/kg
  p('2026-08-08', 'kibble', 'PetQ', 'PetQ Kibble Adult', 3, 'kg', 150000), // 50k/kg
  p('2026-08-22', 'kibble', 'PetQ', 'PetQ Kibble Adult', 5, 'kg', 235000), // 47k/kg
  p('2026-09-05', 'kibble', 'Royal Canin', 'Royal Canin Kitten', 2, 'kg', 320000), // 160k/kg
  p('2026-09-19', 'kibble', 'Royal Canin', 'Royal Canin Kitten', 1, 'kg', 165000), // 165k/kg
  p('2026-10-03', 'kibble', 'BOW', 'BOW Vị bò', 10, 'goi', 79000), // 5kg -> 15.8k/kg
  p('2026-10-21', 'kibble', 'BOW', 'BOW Sữa dê', 10, 'goi', 81000), // 5kg -> 16.2k/kg
  p('2026-11-02', 'kibble', 'BOW', 'BOW Sữa dê', 8, 'kg', 150000), // ~18.75k/kg
  p('2026-11-14', 'kibble', 'PetQ', 'PetQ Kibble Adult', 4, 'kg', 188000), // 47k/kg

  // --- Pate ---
  p('2026-05-15', 'pate', 'PetQ', 'PetQ Pate cá hồi', 24, 'goi', 288000), // 12k/gói
  p('2026-06-02', 'pate', 'PetQ', 'PetQ Pate cá hồi', 1, 'hop', 150000), // 12 gói -> 12.5k/gói
  p('2026-06-20', 'pate', 'Whiskas', 'Whiskas Pate cá ngừ', 12, 'lon', 144000), // 12k/lon
  p('2026-07-08', 'pate', 'PetQ', 'PetQ Pate gà', 24, 'goi', 264000), // 11k/gói
  p('2026-07-25', 'pate', 'Royal Canin', 'Royal Canin Pate Kitten', 12, 'goi', 216000), // 18k/gói
  p('2026-08-14', 'pate', 'Whiskas', 'Whiskas Pate cá ngừ', 1, 'hop', 156000), // 13k/gói
  p('2026-09-01', 'pate', 'PetQ', 'PetQ Pate cá hồi', 24, 'goi', 300000), // 12.5k/gói
  p('2026-09-16', 'pate', 'Royal Canin', 'Royal Canin Pate Kitten', 12, 'goi', 228000), // 19k/gói
  p('2026-10-05', 'pate', 'PetQ', 'PetQ Pate gà', 24, 'goi', 276000), // 11.5k/gói
  p('2026-10-28', 'pate', 'Whiskas', 'Whiskas Pate cá ngừ', 12, 'lon', 150000), // 12.5k/lon

  // --- Cat litter ---
  p('2026-05-20', 'litter', 'N1', 'N1 Cát vệ sinh', 10, 'kg', 145000), // 14.5k/kg
  p('2026-06-18', 'litter', 'N1', 'N1 Cát vệ sinh', 4, 'lit', 30000), // 2kg -> 15k/kg
  p('2026-07-12', 'litter', 'Ever Clean', 'Ever Clean Clump', 5, 'kg', 75000), // 15k/kg
  p('2026-08-05', 'litter', 'Pet Angle', 'Pet Angle Cát', 5, 'kg', 80000), // 16k/kg
  p('2026-08-28', 'litter', 'N1', 'N1 Cát vệ sinh', 10, 'kg', 138000), // 13.8k/kg
  p('2026-09-22', 'litter', 'Ever Clean', 'Ever Clean Clump', 5, 'kg', 72000), // 14.4k/kg
  p('2026-10-12', 'litter', 'Pet Angle', 'Pet Angle Cát', 5, 'kg', 79000), // 15.8k/kg
  p('2026-11-08', 'litter', 'N1', 'N1 Cát vệ sinh', 10, 'kg', 142000), // 14.2k/kg

  // --- Treats ---
  p('2026-06-05', 'treats', 'Ciao', 'Ciao Thanh cá hồi', 20, 'thanh', 60000), // 3k/thanh
  p('2026-06-26', 'treats', 'INABA', 'INABA Snack cá', 1, 'tui', 45000), // 10 thanh -> 4.5k/thanh
  p('2026-07-18', 'treats', 'Ciao', 'Ciao Thanh gà', 20, 'thanh', 56000), // 2.8k/thanh
  p('2026-08-10', 'treats', 'PetQ', 'PetQ Snack gà', 15, 'thanh', 45000), // 3k/thanh
  p('2026-09-03', 'treats', 'Ciao', 'Ciao Thanh cá hồi', 1, 'goi', 90000), // 15 thanh -> 6k/thanh
  p('2026-09-27', 'treats', 'INABA', 'INABA Snack cá', 1, 'tui', 48000), // 4.8k/thanh
  p('2026-10-19', 'treats', 'Ciao', 'Ciao Thanh gà', 20, 'thanh', 58000), // 2.9k/thanh
  p('2026-11-10', 'treats', 'PetQ', 'PetQ Snack gà', 15, 'thanh', 43500), // 2.9k/thanh
];
