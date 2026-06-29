/* ============================================================
   ASHES & DUST - STAT RULES / VALUE SHEET
   ============================================================

   FILE:
   js/statRules.js

   PURPOSE:
   This file is the central stat value sheet for the game.

   Any page that needs stat math should use this file:
   - character.html
   - combat.html
   - future job pages
   - future training pages
   - future gear pages

   Core design rule:
   Raw stats create potential.
   Class, deeds, reputation, profession status, moral values,
   and organization approval determine how much of that potential
   can actually be converted into power.
   ============================================================ */


/* ============================================================
   STARTING MAIN STATS
   All new Lowborn characters begin with equal base stats.
   ============================================================ */

const STARTING_MAIN_STATS = {
  strength: 5,
  vitality: 5,
  intelligence: 5,
  wisdom: 5,
  dexterity: 5
};


/* ============================================================
   STARTING RESOURCE RULES
   Life = HP.
   Stamina = action fuel for combat, travel, work, mining, etc.
   Mana starts locked until magic, prayer, chi, or spirit systems unlock.
   ============================================================ */

const STARTING_RESOURCES = {
  baseLife: 25,
  baseStamina: 100,
  staminaPerLevel: 5,
  baseMana: 0
};


/* ============================================================
   DAMAGE ROLL RULES
   These control damage floor and ceiling.

   Example:
   rawAttack = 3.5

   floor = Math.floor(3.5 * 0.85) = 2
   ceiling = Math.ceil(3.5 * 1.15) = 5

   Damage range = 2 to 5
   ============================================================ */

const DAMAGE_ROLL_RULES = {
  floorMultiplier: 0.85,
  ceilingMultiplier: 1.15
};


/* ============================================================
   STAMINA ACTION COSTS
   Stamina is a tactical combat component.

   The player must decide how to spend stamina during battle.
   ============================================================ */

const STAMINA_ACTION_COSTS = {
  quickAttack: 3,
  basicAttack: 5,
  heavyAttack: 10,
  powerStrike: 15,
  guard: 3,
  dodge: 6,
  flee: 8,
  recoverBreath: 0
};


/* ============================================================
   STAMINA RECOVERY RULES
   These values are for future rest systems.
   ============================================================ */

const STAMINA_RECOVERY_RULES = {
  safeTownRestPerFiveMinutes: 15,
  homeRestPerFiveMinutes: 20,
  simpleMealRestore: 20,
  heartyMealRestore: 30,
  drinkWaterRestore: 5
};


/* ============================================================
   STRENGTH CONVERSION RULES
   This decides how much Physical Attack is gained per Strength.

   Important:
   Level makes the class tier available.
   Recognition, deeds, profession status, moral values, reputation,
   and organization approval decide whether it can be claimed.
   ============================================================ */

const STRENGTH_CONVERSION_BY_CLASS_TIER = {
  peasantLowborn: {
    label: "Peasant / Lowborn",
    tank: 0.10,
    meleeDps: 0.10,
    healer: 0.10,
    rangedDps: 0.10,
    mage: 0.10,
    rogue: 0.10
  },

  peasantDeveloped: {
    label: "Peasant Level 5-15",
    tank: 0.15,
    meleeDps: 0.15,
    healer: 0.15,
    rangedDps: 0.15,
    mage: 0.15,
    rogue: 0.15
  },

  tier1Class: {
    label: "Level 15 Tier 1 Class",
    tank: 0.25,
    meleeDps: 0.50,
    healer: 0.10,
    rangedDps: 0.15,
    mage: 0.05,
    rogue: 0.15
  },

  tier2Class: {
    label: "Level 30 Tier 2 Class",
    tank: 1,
    meleeDps: 2,
    healer: 0.30,
    rangedDps: 0.50,
    mage: 0.10,
    rogue: 0.30
  },

  tier3Class: {
    label: "Level 80 Tier 3 Class",
    tank: 2,
    meleeDps: 4,
    healer: 1,
    rangedDps: 1,
    mage: 0.30,
    rogue: 1
  },

  tier4Class: {
    label: "Level 120 Tier 4 Class",
    tank: 4,
    meleeDps: 8,
    healer: 2,
    rangedDps: 2,
    mage: 0.75,
    rogue: 2
  },

  tier5Class: {
    label: "Level 200 Tier 5 Class",
    tank: 8,
    meleeDps: 15,
    healer: 4,
    rangedDps: 4,
    mage: 1.5,
    rogue: 4
  },

  tier6Class: {
    label: "Level 250 Tier 6 Class",
    tank: 10,
    meleeDps: 20,
    healer: 6,
    rangedDps: 6,
    mage: 2,
    rogue: 6
  },

  tier7Class: {
    label: "Level 300 Tier 7 Class",
    tank: 15,
    meleeDps: 25,
    healer: 10,
    rangedDps: 10,
    mage: 3,
    rogue: 10
  }
};


/* ============================================================
   VITALITY / LIFE CAP RULES
   Life is capped by class tier.

   Extra Vitality beyond the current cap becomes locked potential.
   It does not increase Life until the next class tier is unlocked.
   ============================================================ */

const HP_CAPS_BY_CLASS_TIER = {
  peasantLowborn: {
    label: "Peasant / Lowborn",
    mage: 250,
    healer: 250,
    rangedDps: 250,
    rogue: 250,
    meleeDps: 250,
    tank: 250
  },

  tier1Class: {
    label: "Level 15 Tier 1 Class",
    mage: 750,
    healer: 900,
    rangedDps: 900,
    rogue: 900,
    meleeDps: 1000,
    tank: 1500
  },

  tier2Class: {
    label: "Level 30 Tier 2 Class",
    mage: 1250,
    healer: 1600,
    rangedDps: 1700,
    rogue: 1700,
    meleeDps: 2000,
    tank: 3000
  },

  tier3Class: {
    label: "Level 80 Tier 3 Class",
    mage: 2000,
    healer: 2700,
    rangedDps: 3000,
    rogue: 3000,
    meleeDps: 3500,
    tank: 5000
  },

  tier4Class: {
    label: "Level 120 Tier 4 Class",
    mage: 3000,
    healer: 4000,
    rangedDps: 4500,
    rogue: 4500,
    meleeDps: 5250,
    tank: 7000
  },

  tier5Class: {
    label: "Level 200 Tier 5 Class",
    mage: 4250,
    healer: 5500,
    rangedDps: 6000,
    rogue: 6000,
    meleeDps: 7000,
    tank: 8500
  },

  tier6Class: {
    label: "Level 250 Tier 6 Class",
    mage: 5500,
    healer: 7000,
    rangedDps: 7500,
    rogue: 7500,
    meleeDps: 8500,
    tank: 9500
  },

  tier7Class: {
    label: "Level 300 Tier 7 Class",
    mage: 6500,
    healer: 8000,
    rangedDps: 8500,
    rogue: 8500,
    meleeDps: 9000,
    tank: 10000
  },

  veteranTier5: {
    label: "Veteran Final Cap",
    mage: 20000,
    healer: 25000,
    rangedDps: 25500,
    rogue: 25500,
    meleeDps: 28000,
    tank: 30000
  },

  masterTier4: {
    label: "Master Final Cap",
    mage: 32000,
    healer: 42000,
    rangedDps: 43000,
    rogue: 43000,
    meleeDps: 48000,
    tank: 50000
  },

  specializedTier3: {
    label: "Specialized Final Cap",
    mage: 46000,
    healer: 58000,
    rangedDps: 60000,
    rogue: 60000,
    meleeDps: 68000,
    tank: 75000
  },

  heroVillainTier3: {
    label: "Hero / Villain Final Cap",
    mage: 60000,
    healer: 74000,
    rangedDps: 76000,
    rogue: 76000,
    meleeDps: 84000,
    tank: 90000
  },

  seventhAwakening: {
    label: "Seventh Awakening Cap",
    mage: 100000,
    healer: 125000,
    rangedDps: 130000,
    rogue: 130000,
    meleeDps: 140000,
    tank: 150000
  },

  purestOfBeings: {
    label: "Purest of Beings Cap",
    mage: 200000,
    healer: 225000,
    rangedDps: 230000,
    rogue: 230000,
    meleeDps: 240000,
    tank: 250000
  },

  godbornDemonChild: {
    label: "Godborn / Demon Child Cap",
    mage: 250000,
    healer: 320000,
    rangedDps: 335000,
    rogue: 335000,
    meleeDps: 345000,
    tank: 350000
  },

  deityDemon: {
    label: "Deity / Demon Final Cap",
    mage: 400000,
    healer: 500000,
    rangedDps: 550000,
    rogue: 550000,
    meleeDps: 600000,
    tank: 777000
  },

  aegisOfTitans: {
    label: "Aegis of Titans Absolute Cap",
    tank: 999999
  }
};


/* ============================================================
   VITALITY LIFE CONVERSION
   Current beginner conversion:
   Peasant / Lowborn receives 5 Life per Vitality.

   Later we can expand this into class-tier-specific conversion.
   ============================================================ */

const VITALITY_LIFE_CONVERSION = {
  peasantLowborn: 5
};


/* ============================================================
   STAT FORMULA FUNCTIONS
   These functions are what pages should call.
   ============================================================ */

function calculateMaxLifeFromVitality(vitality, classTierKey = "peasantLowborn", roleKey = "tank") {
  const baseLife = STARTING_RESOURCES.baseLife;
  const conversion = VITALITY_LIFE_CONVERSION[classTierKey] || 5;

  const capData = HP_CAPS_BY_CLASS_TIER[classTierKey] || HP_CAPS_BY_CLASS_TIER.peasantLowborn;
  const hardCap = capData[roleKey] || capData.tank || 250;

  const calculatedLife = baseLife + vitality * conversion;

  return Math.min(calculatedLife, hardCap);
}


function calculateLockedLifePotential(vitality, classTierKey = "peasantLowborn", roleKey = "tank") {
  const baseLife = STARTING_RESOURCES.baseLife;
  const conversion = VITALITY_LIFE_CONVERSION[classTierKey] || 5;

  const capData = HP_CAPS_BY_CLASS_TIER[classTierKey] || HP_CAPS_BY_CLASS_TIER.peasantLowborn;
  const hardCap = capData[roleKey] || capData.tank || 250;

  const calculatedLife = baseLife + vitality * conversion;

  return Math.max(0, calculatedLife - hardCap);
}


function calculateStrengthAttack(strength, classTierKey = "peasantLowborn", roleKey = "tank") {
  const tierData = STRENGTH_CONVERSION_BY_CLASS_TIER[classTierKey] || STRENGTH_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const conversion = tierData[roleKey] || 0.10;

  return strength * conversion;
}


function calculateDamageRange(rawAttack) {
  const floor = Math.floor(rawAttack * DAMAGE_ROLL_RULES.floorMultiplier);
  const ceiling = Math.ceil(rawAttack * DAMAGE_ROLL_RULES.ceilingMultiplier);

  return {
    floor,
    ceiling
  };
}
