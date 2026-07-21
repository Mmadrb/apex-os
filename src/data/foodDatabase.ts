export interface FoodItem {
  id: string;
  nameEn: string;
  nameFa: string;
  categoryEn: string;
  categoryFa: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  fiberPer100g: number;
  magnesiumMgPer100g?: number;
  potassiumMgPer100g?: number;
}

export const FOOD_DATABASE: FoodItem[] = [
  {
    id: 'f-1',
    nameEn: 'Grilled Chicken Breast',
    nameFa: 'سینه مرغ گریل شده',
    categoryEn: 'Protein',
    categoryFa: 'پروتئین خالص',
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    carbsPer100g: 0.0,
    fatsPer100g: 3.6,
    fiberPer100g: 0.0,
    magnesiumMgPer100g: 29,
    potassiumMgPer100g: 256
  },
  {
    id: 'f-2',
    nameEn: 'Cooked Steamed Rice',
    nameFa: 'برنج کته پخته شده',
    categoryEn: 'Carbohydrates',
    categoryFa: 'کربوهیدرات پیچیده',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.0,
    fatsPer100g: 0.3,
    fiberPer100g: 0.4,
    magnesiumMgPer100g: 12,
    potassiumMgPer100g: 35
  },
  {
    id: 'f-3',
    nameEn: 'Atlantic Salmon Fillet',
    nameFa: 'فیله ماهی سالمون',
    categoryEn: 'Protein & Healthy Fats',
    categoryFa: 'پروتئین و چربی سالم',
    caloriesPer100g: 208,
    proteinPer100g: 20.0,
    carbsPer100g: 0.0,
    fatsPer100g: 13.0,
    fiberPer100g: 0.0,
    magnesiumMgPer100g: 30,
    potassiumMgPer100g: 363
  },
  {
    id: 'f-4',
    nameEn: 'Whole Eggs (Boiled)',
    nameFa: 'تخم‌مرغ کامل آب‌پز',
    categoryEn: 'Protein',
    categoryFa: 'پروتئین و چربی',
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatsPer100g: 10.6,
    fiberPer100g: 0.0,
    magnesiumMgPer100g: 12,
    potassiumMgPer100g: 126
  },
  {
    id: 'f-5',
    nameEn: 'Baked Sweet Potato',
    nameFa: 'سیب‌زمینی شیرین تنوری',
    categoryEn: 'Carbohydrates',
    categoryFa: 'کربوهیدرات پیچیده',
    caloriesPer100g: 90,
    proteinPer100g: 2.0,
    carbsPer100g: 20.7,
    fatsPer100g: 0.15,
    fiberPer100g: 3.3,
    magnesiumMgPer100g: 27,
    potassiumMgPer100g: 475
  },
  {
    id: 'f-6',
    nameEn: 'Whey Protein Isolate',
    nameFa: 'پودر پروتئین وی ایزوله',
    categoryEn: 'Supplement',
    categoryFa: 'مکمل ورزشی',
    caloriesPer100g: 370,
    proteinPer100g: 85.0,
    carbsPer100g: 2.5,
    fatsPer100g: 1.0,
    fiberPer100g: 0.0,
    magnesiumMgPer100g: 60,
    potassiumMgPer100g: 450
  },
  {
    id: 'f-7',
    nameEn: 'Extra Virgin Olive Oil',
    nameFa: 'روغن زیتون فرابکر',
    categoryEn: 'Fats',
    categoryFa: 'چربی مفید',
    caloriesPer100g: 884,
    proteinPer100g: 0.0,
    carbsPer100g: 0.0,
    fatsPer100g: 100.0,
    fiberPer100g: 0.0
  },
  {
    id: 'f-8',
    nameEn: 'Skyr / Greek Yogurt (0%)',
    nameFa: 'ماست ایسلندی / یونانی بدون چربی',
    categoryEn: 'Dairy / Protein',
    categoryFa: 'لبنیات پروتئینی',
    caloriesPer100g: 63,
    proteinPer100g: 11.0,
    carbsPer100g: 4.0,
    fatsPer100g: 0.2,
    fiberPer100g: 0.0,
    potassiumMgPer100g: 150
  },
  {
    id: 'f-9',
    nameEn: 'Rolled Oatmeal',
    nameFa: 'جو دوسر پرک',
    categoryEn: 'Carbohydrates',
    categoryFa: 'کربوهیدرات و فیبر',
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    carbsPer100g: 66.0,
    fatsPer100g: 6.9,
    fiberPer100g: 10.6,
    magnesiumMgPer100g: 177,
    potassiumMgPer100g: 429
  },
  {
    id: 'f-10',
    nameEn: 'Fresh Ripe Banana',
    nameFa: 'موز تازه',
    categoryEn: 'Fruits',
    categoryFa: 'میوه / کربوهیدرات',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatsPer100g: 0.3,
    fiberPer100g: 2.6,
    potassiumMgPer100g: 358
  }
];

export function calculateFoodNutrition(food: FoodItem, grams: number) {
  const factor = grams / 100;
  return {
    calories: Math.round(food.caloriesPer100g * factor),
    proteinG: Number((food.proteinPer100g * factor).toFixed(1)),
    carbsG: Number((food.carbsPer100g * factor).toFixed(1)),
    fatsG: Number((food.fatsPer100g * factor).toFixed(1)),
    fiberG: Number((food.fiberPer100g * factor).toFixed(1))
  };
}
