// Comprehensive MyFitnessPal Food Database with macronutrients, micronutrients, categories, and barcode references
const FOOD_DATABASE = [
  // BREAKFAST
  {
    id: 'food-1',
    name: 'Egg (Large, Whole, Boiled)',
    brand: 'Fresh Farm',
    category: 'breakfast',
    barcode: '011110825310',
    serving: { size: 1, unit: '1 large egg', grams: 50 },
    nutrition: { calories: 78, carbs: 0.6, protein: 6.3, fat: 5.3, fiber: 0, sugar: 0.6, sodium: 62 }
  },
  {
    id: 'food-2',
    name: 'Scrambled Eggs (with splash of milk)',
    brand: 'Homemade',
    category: 'breakfast',
    barcode: '011110825311',
    serving: { size: 2, unit: '2 eggs portion', grams: 110 },
    nutrition: { calories: 182, carbs: 2.2, protein: 13.5, fat: 12.8, fiber: 0, sugar: 1.8, sodium: 175 }
  },
  {
    id: 'food-3',
    name: 'Rolled Oatmeal (Cooked with Water)',
    brand: 'Quaker',
    category: 'breakfast',
    barcode: '030000010302',
    serving: { size: 1, unit: '1 cup (234g)', grams: 234 },
    nutrition: { calories: 158, carbs: 27.4, protein: 5.9, fat: 3.2, fiber: 4.0, sugar: 1.1, sodium: 5 }
  },
  {
    id: 'food-4',
    name: 'Greek Yogurt (0% Fat, Plain)',
    brand: 'Chobani',
    category: 'breakfast',
    barcode: '894700010052',
    serving: { size: 1, unit: '3/4 cup (170g)', grams: 170 },
    nutrition: { calories: 100, carbs: 6.0, protein: 16.0, fat: 0.0, fiber: 0, sugar: 4.0, sodium: 65 }
  },
  {
    id: 'food-5',
    name: 'Avocado Toast on Sourdough',
    brand: 'Cafe Style',
    category: 'breakfast',
    barcode: '071110001015',
    serving: { size: 1, unit: '1 slice loaded', grams: 140 },
    nutrition: { calories: 260, carbs: 28.0, protein: 6.5, fat: 14.5, fiber: 6.2, sugar: 2.0, sodium: 290 }
  },
  {
    id: 'food-6',
    name: 'Whey Protein Shake (Vanilla with Water)',
    brand: 'Optimum Nutrition',
    category: 'breakfast',
    barcode: '748927028669',
    serving: { size: 1, unit: '1 scoop (31g powder)', grams: 31 },
    nutrition: { calories: 120, carbs: 3.0, protein: 24.0, fat: 1.5, fiber: 1.0, sugar: 1.0, sodium: 130 }
  },
  {
    id: 'food-7',
    name: 'Banana Protein Pancakes',
    brand: 'Homemade',
    category: 'breakfast',
    barcode: '071110001022',
    serving: { size: 2, unit: '2 medium pancakes', grams: 160 },
    nutrition: { calories: 290, carbs: 38.0, protein: 18.0, fat: 7.0, fiber: 4.5, sugar: 14.0, sodium: 310 }
  },
  {
    id: 'food-8',
    name: 'Caffe Latte with Oat Milk',
    brand: 'Starbucks Style',
    category: 'beverages',
    barcode: '076211124401',
    serving: { size: 1, unit: 'Grande 16 fl oz', grams: 473 },
    nutrition: { calories: 170, carbs: 23.0, protein: 3.0, fat: 7.0, fiber: 2.0, sugar: 11.0, sodium: 135 }
  },
  {
    id: 'food-9',
    name: 'Whole Wheat Bagel with Light Cream Cheese',
    brand: 'Thomas',
    category: 'breakfast',
    barcode: '048121113055',
    serving: { size: 1, unit: '1 bagel with 2 tbsp spread', grams: 135 },
    nutrition: { calories: 310, carbs: 54.0, protein: 12.0, fat: 5.5, fiber: 5.0, sugar: 6.0, sodium: 490 }
  },
  {
    id: 'food-10',
    name: 'Fresh Orange Juice (100% Pure)',
    brand: 'Tropicana',
    category: 'beverages',
    barcode: '048500001256',
    serving: { size: 1, unit: '1 glass (240ml)', grams: 248 },
    nutrition: { calories: 110, carbs: 26.0, protein: 2.0, fat: 0.0, fiber: 0.5, sugar: 22.0, sodium: 0 }
  },

  // PROTEINS & MAIN MEALS
  {
    id: 'food-11',
    name: 'Chicken Breast (Skinless, Grilled)',
    brand: 'Generic Fresh',
    category: 'protein',
    barcode: '020011123456',
    serving: { size: 1, unit: '1 breast filet (150g)', grams: 150 },
    nutrition: { calories: 248, carbs: 0.0, protein: 46.5, fat: 5.4, fiber: 0, sugar: 0, sodium: 115 }
  },
  {
    id: 'food-12',
    name: 'Atlantic Salmon Fillet (Pan-Seared)',
    brand: 'Wild Catch',
    category: 'protein',
    barcode: '020011123457',
    serving: { size: 1, unit: '1 fillet (150g)', grams: 150 },
    nutrition: { calories: 310, carbs: 0.0, protein: 33.0, fat: 19.5, fiber: 0, sugar: 0, sodium: 95 }
  },
  {
    id: 'food-13',
    name: 'Lean Ground Beef (90% Lean / 10% Fat, Cooked)',
    brand: 'Choice Meat',
    category: 'protein',
    barcode: '020011123458',
    serving: { size: 1, unit: '100g portion', grams: 100 },
    nutrition: { calories: 217, carbs: 0.0, protein: 26.1, fat: 11.8, fiber: 0, sugar: 0, sodium: 70 }
  },
  {
    id: 'food-14',
    name: 'Firm Tofu (Organic, Stir-Fried)',
    brand: 'Nasoya',
    category: 'protein',
    barcode: '025484000123',
    serving: { size: 1, unit: '1/2 block (125g)', grams: 125 },
    nutrition: { calories: 140, carbs: 3.5, protein: 15.0, fat: 8.0, fiber: 2.0, sugar: 0.5, sodium: 20 }
  },
  {
    id: 'food-15',
    name: 'Sirloin Steak (Trimmed, Grilled)',
    brand: 'USDA Choice',
    category: 'protein',
    barcode: '020011123459',
    serving: { size: 1, unit: '6 oz (170g)', grams: 170 },
    nutrition: { calories: 340, carbs: 0.0, protein: 51.0, fat: 13.0, fiber: 0, sugar: 0, sodium: 102 }
  },
  {
    id: 'food-16',
    name: 'Canned Albacore Tuna in Spring Water',
    brand: 'StarKist',
    category: 'protein',
    barcode: '080000001402',
    serving: { size: 1, unit: '1 can drained (120g)', grams: 120 },
    nutrition: { calories: 130, carbs: 0.0, protein: 29.0, fat: 1.0, fiber: 0, sugar: 0, sodium: 360 }
  },
  {
    id: 'food-17',
    name: 'Turkey Breast Slices (Deli, Low Sodium)',
    brand: 'Boar\'s Head',
    category: 'protein',
    barcode: '042421001124',
    serving: { size: 3, unit: '3 slices (85g)', grams: 85 },
    nutrition: { calories: 90, carbs: 1.0, protein: 20.0, fat: 1.0, fiber: 0, sugar: 0, sodium: 340 }
  },
  {
    id: 'food-18',
    name: 'Red Lentil Dal (Cooked Curry)',
    brand: 'Home Recipe',
    category: 'meals',
    barcode: '071110001035',
    serving: { size: 1, unit: '1 bowl (240g)', grams: 240 },
    nutrition: { calories: 230, carbs: 38.0, protein: 14.0, fat: 3.5, fiber: 11.0, sugar: 2.5, sodium: 420 }
  },
  {
    id: 'food-19',
    name: 'Black Beans (Cooked, Canned)',
    brand: 'Bush\'s Best',
    category: 'protein',
    barcode: '039400016024',
    serving: { size: 1, unit: '1/2 cup (130g)', grams: 130 },
    nutrition: { calories: 110, carbs: 20.0, protein: 7.0, fat: 0.5, fiber: 7.5, sugar: 0.5, sodium: 220 }
  },
  {
    id: 'food-20',
    name: 'Shrimp (Large, Steamed or Grilled)',
    brand: 'Fresh Seafood',
    category: 'protein',
    barcode: '020011123460',
    serving: { size: 6, unit: '6 large shrimp (85g)', grams: 85 },
    nutrition: { calories: 84, carbs: 0.2, protein: 20.4, fat: 0.9, fiber: 0, sugar: 0, sodium: 190 }
  },

  // GRAINS & CARBOHYDRATES
  {
    id: 'food-21',
    name: 'Brown Rice (Cooked, Long Grain)',
    brand: 'Uncle Ben\'s',
    category: 'grains',
    barcode: '054800010041',
    serving: { size: 1, unit: '1 cup (195g)', grams: 195 },
    nutrition: { calories: 218, carbs: 45.8, protein: 4.5, fat: 1.6, fiber: 3.5, sugar: 0.7, sodium: 10 }
  },
  {
    id: 'food-22',
    name: 'White Jasmine Rice (Steamed)',
    brand: 'Royal',
    category: 'grains',
    barcode: '745114001015',
    serving: { size: 1, unit: '1 cup (158g)', grams: 158 },
    nutrition: { calories: 205, carbs: 45.0, protein: 4.2, fat: 0.4, fiber: 0.6, sugar: 0.1, sodium: 2 }
  },
  {
    id: 'food-23',
    name: 'Quinoa (Cooked, Fluffy)',
    brand: 'Ancient Harvest',
    category: 'grains',
    barcode: '089824001103',
    serving: { size: 1, unit: '1 cup (185g)', grams: 185 },
    nutrition: { calories: 222, carbs: 39.4, protein: 8.1, fat: 3.6, fiber: 5.2, sugar: 1.6, sodium: 13 }
  },
  {
    id: 'food-24',
    name: 'Sweet Potato (Baked, Skin On)',
    brand: 'Fresh Produce',
    category: 'grains',
    barcode: '020011123461',
    serving: { size: 1, unit: '1 medium (130g)', grams: 130 },
    nutrition: { calories: 112, carbs: 26.2, protein: 2.1, fat: 0.1, fiber: 3.9, sugar: 5.4, sodium: 72 }
  },
  {
    id: 'food-25',
    name: 'Whole Wheat Bread (100% Whole Grain)',
    brand: 'Nature\'s Own',
    category: 'grains',
    barcode: '072250011379',
    serving: { size: 1, unit: '1 slice (38g)', grams: 38 },
    nutrition: { calories: 81, carbs: 13.8, protein: 4.0, fat: 1.1, fiber: 2.3, sugar: 1.5, sodium: 135 }
  },
  {
    id: 'food-26',
    name: 'Whole Wheat Pasta (Penne, Cooked)',
    brand: 'Barilla',
    category: 'grains',
    barcode: '076808000459',
    serving: { size: 1, unit: '1 cup (140g)', grams: 140 },
    nutrition: { calories: 174, carbs: 37.2, protein: 7.5, fat: 0.8, fiber: 4.6, sugar: 1.5, sodium: 4 }
  },
  {
    id: 'food-27',
    name: 'Whole Wheat Tortilla Wrap',
    brand: 'Mission',
    category: 'grains',
    barcode: '073731001208',
    serving: { size: 1, unit: '1 large wrap (62g)', grams: 62 },
    nutrition: { calories: 170, carbs: 28.0, protein: 5.0, fat: 4.5, fiber: 4.0, sugar: 1.0, sodium: 360 }
  },
  {
    id: 'food-28',
    name: 'Baked Russet Potato with Salt',
    brand: 'Produce',
    category: 'grains',
    barcode: '020011123462',
    serving: { size: 1, unit: '1 medium (173g)', grams: 173 },
    nutrition: { calories: 168, carbs: 38.0, protein: 4.6, fat: 0.2, fiber: 3.8, sugar: 1.2, sodium: 140 }
  },

  // HEALTHY FATS & NUTS
  {
    id: 'food-29',
    name: 'Raw Almonds (Whole)',
    brand: 'Blue Diamond',
    category: 'fats',
    barcode: '041570001041',
    serving: { size: 1, unit: '1 oz / ~23 kernels (28g)', grams: 28 },
    nutrition: { calories: 164, carbs: 6.1, protein: 6.0, fat: 14.2, fiber: 3.5, sugar: 1.2, sodium: 1 }
  },
  {
    id: 'food-30',
    name: 'Natural Peanut Butter (No Added Sugar)',
    brand: 'Smucker\'s',
    category: 'fats',
    barcode: '051500022401',
    serving: { size: 2, unit: '2 tbsp (32g)', grams: 32 },
    nutrition: { calories: 190, carbs: 7.0, protein: 8.0, fat: 16.0, fiber: 2.5, sugar: 2.0, sodium: 105 }
  },
  {
    id: 'food-31',
    name: 'Extra Virgin Olive Oil',
    brand: 'Bertolli',
    category: 'fats',
    barcode: '041790001402',
    serving: { size: 1, unit: '1 tablespoon (15ml)', grams: 14 },
    nutrition: { calories: 119, carbs: 0.0, protein: 0.0, fat: 13.5, fiber: 0, sugar: 0, sodium: 0 }
  },
  {
    id: 'food-32',
    name: 'Fresh Hass Avocado (Half)',
    brand: 'Fresh Produce',
    category: 'fats',
    barcode: '020011123463',
    serving: { size: 1, unit: '1/2 medium avocado (100g)', grams: 100 },
    nutrition: { calories: 160, carbs: 8.5, protein: 2.0, fat: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7 }
  },
  {
    id: 'food-33',
    name: 'Chia Seeds (Black or White)',
    brand: 'Nutiva',
    category: 'fats',
    barcode: '692752000214',
    serving: { size: 1, unit: '1 tablespoon (12g)', grams: 12 },
    nutrition: { calories: 60, carbs: 5.0, protein: 2.0, fat: 3.5, fiber: 4.5, sugar: 0, sodium: 2 }
  },
  {
    id: 'food-34',
    name: 'Raw Walnut Halves',
    brand: 'Diamond of California',
    category: 'fats',
    barcode: '010340001155',
    serving: { size: 1, unit: '1/4 cup (30g)', grams: 30 },
    nutrition: { calories: 196, carbs: 4.1, protein: 4.6, fat: 19.5, fiber: 2.0, sugar: 0.8, sodium: 1 }
  },

  // FRUITS & VEGETABLES
  {
    id: 'food-35',
    name: 'Fresh Banana (Medium)',
    brand: 'Chiquita',
    category: 'fruits_veg',
    barcode: '020011123464',
    serving: { size: 1, unit: '1 medium (118g)', grams: 118 },
    nutrition: { calories: 105, carbs: 27.0, protein: 1.3, fat: 0.3, fiber: 3.1, sugar: 14.4, sodium: 1 }
  },
  {
    id: 'food-36',
    name: 'Honeycrisp Apple (Medium)',
    brand: 'Stemilt',
    category: 'fruits_veg',
    barcode: '020011123465',
    serving: { size: 1, unit: '1 medium (182g)', grams: 182 },
    nutrition: { calories: 95, carbs: 25.1, protein: 0.5, fat: 0.3, fiber: 4.4, sugar: 18.9, sodium: 2 }
  },
  {
    id: 'food-37',
    name: 'Fresh Blueberries',
    brand: 'Driscoll\'s',
    category: 'fruits_veg',
    barcode: '033383001024',
    serving: { size: 1, unit: '1 cup (148g)', grams: 148 },
    nutrition: { calories: 84, carbs: 21.4, protein: 1.1, fat: 0.5, fiber: 3.6, sugar: 14.7, sodium: 1 }
  },
  {
    id: 'food-38',
    name: 'Fresh Strawberries (Sliced)',
    brand: 'Driscoll\'s',
    category: 'fruits_veg',
    barcode: '033383001025',
    serving: { size: 1, unit: '1 cup (166g)', grams: 166 },
    nutrition: { calories: 53, carbs: 12.7, protein: 1.1, fat: 0.5, fiber: 3.3, sugar: 8.1, sodium: 2 }
  },
  {
    id: 'food-39',
    name: 'Fresh Broccoli Florets (Steamed)',
    brand: 'Fresh Produce',
    category: 'fruits_veg',
    barcode: '020011123466',
    serving: { size: 1, unit: '1 cup (150g)', grams: 150 },
    nutrition: { calories: 55, carbs: 11.2, protein: 3.7, fat: 0.6, fiber: 5.1, sugar: 2.2, sodium: 60 }
  },
  {
    id: 'food-40',
    name: 'Baby Spinach Leaves (Raw)',
    brand: 'Earthbound Farm',
    category: 'fruits_veg',
    barcode: '032601001103',
    serving: { size: 2, unit: '2 cups packed (60g)', grams: 60 },
    nutrition: { calories: 14, carbs: 2.2, protein: 1.7, fat: 0.2, fiber: 1.3, sugar: 0.3, sodium: 48 }
  },
  {
    id: 'food-41',
    name: 'Roasted Green Asparagus',
    brand: 'Produce',
    category: 'fruits_veg',
    barcode: '020011123467',
    serving: { size: 6, unit: '6 spears (90g)', grams: 90 },
    nutrition: { calories: 35, carbs: 3.8, protein: 2.2, fat: 1.5, fiber: 1.8, sugar: 1.7, sodium: 95 }
  },
  {
    id: 'food-42',
    name: 'Crisp Garden Salad (with Balsamic Vinaigrette)',
    brand: 'Restaurant Style',
    category: 'fruits_veg',
    barcode: '071110001045',
    serving: { size: 1, unit: '1 side bowl (150g)', grams: 150 },
    nutrition: { calories: 95, carbs: 7.0, protein: 1.8, fat: 6.8, fiber: 2.5, sugar: 4.0, sodium: 180 }
  },

  // SNACKS & HEALTHY TREATS
  {
    id: 'food-43',
    name: 'Chocolate Peanut Butter Protein Bar',
    brand: 'Quest Nutrition',
    category: 'snacks',
    barcode: '888849000147',
    serving: { size: 1, unit: '1 bar (60g)', grams: 60 },
    nutrition: { calories: 200, carbs: 22.0, protein: 20.0, fat: 8.0, fiber: 14.0, sugar: 1.0, sodium: 220 }
  },
  {
    id: 'food-44',
    name: 'Dark Chocolate (70% Cocoa)',
    brand: 'Lindt Excellence',
    category: 'snacks',
    barcode: '037466016451',
    serving: { size: 3, unit: '3 squares (30g)', grams: 30 },
    nutrition: { calories: 170, carbs: 13.0, protein: 2.2, fat: 12.0, fiber: 3.0, sugar: 8.0, sodium: 5 }
  },
  {
    id: 'food-45',
    name: 'Roasted Red Pepper Hummus with Pita Chips',
    brand: 'Sabra & Stacy\'s',
    category: 'snacks',
    barcode: '040822011033',
    serving: { size: 1, unit: '2 tbsp hummus + 8 chips (55g)', grams: 55 },
    nutrition: { calories: 190, carbs: 24.0, protein: 4.5, fat: 8.5, fiber: 3.0, sugar: 2.0, sodium: 280 }
  },
  {
    id: 'food-46',
    name: 'Mozzarella String Cheese (Part Skim)',
    brand: 'Sargento',
    category: 'snacks',
    barcode: '046100001152',
    serving: { size: 1, unit: '1 stick (28g)', grams: 28 },
    nutrition: { calories: 80, carbs: 1.0, protein: 7.0, fat: 5.0, fiber: 0, sugar: 0, sodium: 170 }
  },
  {
    id: 'food-47',
    name: 'Sea Salt Brown Rice Cakes',
    brand: 'Lundberg',
    category: 'snacks',
    barcode: '073416000214',
    serving: { size: 2, unit: '2 cakes (28g)', grams: 28 },
    nutrition: { calories: 70, carbs: 15.0, protein: 1.5, fat: 0.5, fiber: 1.0, sugar: 0, sodium: 70 }
  },

  // RESTAURANT / POPULAR MEALS
  {
    id: 'food-48',
    name: 'Chipotle Chicken Burrito Bowl',
    brand: 'Chipotle',
    category: 'meals',
    barcode: '071110001050',
    serving: { size: 1, unit: '1 standard bowl (chicken, brown rice, black beans, fajita veg, fresh tomato salsa, lettuce)', grams: 460 },
    nutrition: { calories: 510, carbs: 54.0, protein: 43.0, fat: 13.0, fiber: 12.0, sugar: 4.5, sodium: 1240 }
  },
  {
    id: 'food-49',
    name: 'Thin Crust Pepperoni Pizza (1 Slice)',
    brand: 'Domino\'s',
    category: 'meals',
    barcode: '071110001051',
    serving: { size: 1, unit: '1 medium slice (105g)', grams: 105 },
    nutrition: { calories: 230, carbs: 24.0, protein: 9.0, fat: 11.0, fiber: 1.5, sugar: 2.0, sodium: 560 }
  },
  {
    id: 'food-50',
    name: 'California Sushi Roll',
    brand: 'Sushi Bar',
    category: 'meals',
    barcode: '071110001052',
    serving: { size: 8, unit: '8 pieces roll (210g)', grams: 210 },
    nutrition: { calories: 255, carbs: 38.0, protein: 7.0, fat: 7.5, fiber: 3.5, sugar: 6.0, sodium: 520 }
  },
  {
    id: 'food-51',
    name: 'Grilled Chicken Caesar Salad',
    brand: 'Panera Style',
    category: 'meals',
    barcode: '071110001053',
    serving: { size: 1, unit: '1 entree salad (340g)', grams: 340 },
    nutrition: { calories: 440, carbs: 16.0, protein: 34.0, fat: 28.0, fiber: 4.0, sugar: 3.0, sodium: 870 }
  },
  {
    id: 'food-52',
    name: 'Classic Cheeseburger (Single Patty)',
    brand: 'Shake Shack Style',
    category: 'meals',
    barcode: '071110001054',
    serving: { size: 1, unit: '1 burger with bun (210g)', grams: 210 },
    nutrition: { calories: 530, carbs: 32.0, protein: 29.0, fat: 31.0, fiber: 1.5, sugar: 6.0, sodium: 980 }
  }
];

// Helper search function for the food database
function searchFoodDatabase(query, category = 'all') {
  if (!query && category === 'all') return FOOD_DATABASE;
  const q = (query || '').toLowerCase().trim();
  return FOOD_DATABASE.filter(food => {
    const matchesQuery = !q || 
      food.name.toLowerCase().includes(q) || 
      (food.brand && food.brand.toLowerCase().includes(q)) ||
      (food.barcode && food.barcode.includes(q));
    const matchesCategory = category === 'all' || food.category === category;
    return matchesQuery && matchesCategory;
  });
}

// Find food by barcode or ID
function getFoodById(idOrBarcode) {
  return FOOD_DATABASE.find(f => f.id === idOrBarcode || f.barcode === idOrBarcode);
}