/* ============================================================
   ASHES & DUST / SHADOW DISTRICT RPG - CENTRAL STAT RULES
   ============================================================

   FILE:
   js/statRules.js

   PURPOSE:
   This is the one central value sheet for the website.
   Use this file before character.js, combat.js, home.js, and future pages.

   Systems included:
   - Starting stats
   - Life / HP from Vitality
   - Strength -> Physical Attack Power
   - Intelligence -> Magic Attack Power
   - Dexterity -> DEX Attack Power and derived stats
   - Wisdom -> Prayer Power
   - Mana / Spiritual Essence
   - Agility passive stamina bonus
   - Stamina action costs
   - EXP and leveling
   - Damage range formulas

   Core rule:
   Raw stats create potential. Class, deeds, recognition, profession status,
   moral values, reputation, and organization approval decide how much of that
   potential becomes real power.
   ============================================================ */

/* ============================================================
   ROLE KEYS
   Use these exact keys throughout the game.
   ============================================================ */

const ROLE_KEYS = {
  tank: "tank",
  healer: "healer",
  meleeDps: "meleeDps",
  rangedDps: "rangedDps",
  mage: "mage",
  rogue: "rogue"
};

const ROLE_ALIASES = {
  tank: "tank",
  guardian: "tank",
  sacredGuardian: "tank",

  healer: "healer",
  priest: "healer",

  melee: "meleeDps",
  meleeDps: "meleeDps",
  paladin: "meleeDps",
  templar: "meleeDps",
  monk: "meleeDps",
  martialArtist: "meleeDps",
  spiritualSword: "meleeDps",

  ranged: "rangedDps",
  rangedDps: "rangedDps",
  ranger: "rangedDps",
  archer: "rangedDps",
  spiritArcher: "rangedDps",

  mage: "mage",
  spiritualCaster: "mage",

  rogue: "rogue",
  streetUrchin: "rogue",
  assassin: "rogue"
};

function normalizeRoleKey(roleKey = "tank") {
  return ROLE_ALIASES[roleKey] || roleKey || "tank";
}

/* ============================================================
   STAGE KEYS
   These keys connect every stat table together.
   ============================================================ */

const STAGE_LABELS = {
  peasantLowborn: "Peasant / Lowborn",
  peasantDeveloped: "Peasant Level 5-15",
  tier1Class: "Level 15 Tier 1 Class",
  tier2Class: "Level 30 Tier 2 Class",
  tier3Class: "Level 80 Tier 3 Class",
  tier4Class: "Level 120 Tier 4 Class",
  tier5Class: "Level 200 Tier 5 Class",
  tier6Class: "Level 250 Tier 6 Class",
  tier7Class: "Level 300 Tier 7 Class",

  veteranTier1: "Veteran Tier 1",
  veteranTier2: "Veteran Tier 2",
  veteranTier3: "Veteran Tier 3",
  veteranTier4: "Veteran Tier 4",
  veteranTier5: "Veteran Tier 5",

  masterTier1: "Master Tier 1",
  masterTier2: "Master Tier 2",
  masterTier3: "Master Tier 3",
  masterTier4: "Master Tier 4",

  specializedTier1: "Specialized Tier 1",
  specializedTier2: "Specialized Tier 2",
  specializedTier3: "Specialized Tier 3",
  specializedTier4: "Specialized Tier 4",

  heroVillainTier1: "Hero / Villain Tier 1",
  heroVillainTier2: "Hero / Villain Tier 2",
  heroVillainTier3: "Hero / Villain Tier 3",
  heroVillainTier4: "Hero / Villain Tier 4",

  firstAwakening: "First Awakening",
  secondAwakening: "Second Awakening",
  thirdAwakening: "Third Awakening",
  fourthAwakening: "Fourth Awakening",
  fifthAwakening: "Fifth Awakening",
  sixthAwakening: "Sixth Awakening",
  seventhAwakening: "Seventh Awakening",

  ascensionGate: "Ascension Gate - Locked Until Rebirth Quest",
  ascensionClass: "Ascension Class",
  higherAscension: "Higher Ascension",
  highestAscension: "Highest Ascension",

  celestialEmbodiment: "Celestial Embodiment",
  celestialEvolution: "Celestial Evolution",
  purestOfBeings: "Purest of Beings",

  godbornDemonChildTier1: "Godborn / Demon Child Tier 1",
  godbornDemonChildTier2: "Godborn / Demon Child Tier 2",
  godbornDemonChild: "Godborn / Demon Child Final",

  deityDemon: "Final Deity / Demon Cap",
  aegisOfTitans: "Aegis of Titans Hidden Stat"
};

/* ============================================================
   STARTING MAIN STATS AND RESOURCES
   ============================================================ */

const STARTING_MAIN_STATS = {
  strength: 5,
  vitality: 5,
  intelligence: 5,
  wisdom: 5,
  dexterity: 5
};

const STARTING_RESOURCES = {
  baseLife: 25,
  baseStamina: 100,
  staminaPerLevel: 5,
  baseMana: 0
};

/* ============================================================
   DAMAGE ROLL RULES
   Raw attack becomes a damage range.
   ============================================================ */

const DAMAGE_ROLL_RULES = {
  floorMultiplier: 0.85,
  ceilingMultiplier: 1.15
};

function calculateDamageRange(rawAttack) {
  const floor = Math.max(0, Math.floor(rawAttack * DAMAGE_ROLL_RULES.floorMultiplier));
  const ceiling = Math.max(floor, Math.ceil(rawAttack * DAMAGE_ROLL_RULES.ceilingMultiplier));

  return { floor, ceiling };
}

function rollDamage(rawAttack) {
  const range = calculateDamageRange(rawAttack);
  const roll = Math.floor(Math.random() * (range.ceiling - range.floor + 1)) + range.floor;

  return {
    ...range,
    roll
  };
}
/* ============================================================
   WEAKNESS DAMAGE MODIFIER
   ============================================================

   Weakness modifiers are stored as bonus damage.

   Example:
   Enemy weakness:
   modifier: 0.25

   This means:
   +25% bonus damage

   Formula:
   weaknessBonus = rawAttackPower * modifier
   finalAttackPower = rawAttackPower + weaknessBonus

   Example:
   rawAttackPower = 3.5
   modifier = 0.25

   weaknessBonus = 3.5 * 0.25 = 0.875
   finalAttackPower = 3.5 + 0.875 = 4.375

   Then finalAttackPower goes into calculateDamageRange().
   ============================================================ */

function applyWeaknessModifier(rawAttackPower, attackDamageType, enemy) {
  if (!enemy || !enemy.weaknesses || enemy.weaknesses.length === 0) {
    return {
      weaknessApplied: false,
      weaknessType: null,
      weaknessModifier: 0,
      weaknessBonus: 0,
      finalAttackPower: rawAttackPower
    };
  }

  const matchingWeakness = enemy.weaknesses.find(function (weakness) {
    return weakness.damageType.toLowerCase() === attackDamageType.toLowerCase();
  });

  if (!matchingWeakness) {
    return {
      weaknessApplied: false,
      weaknessType: null,
      weaknessModifier: 0,
      weaknessBonus: 0,
      finalAttackPower: rawAttackPower
    };
  }

  const weaknessBonus = rawAttackPower * matchingWeakness.modifier;
  const finalAttackPower = rawAttackPower + weaknessBonus;

  return {
    weaknessApplied: true,
    weaknessType: matchingWeakness.damageType,
    weaknessModifier: matchingWeakness.modifier,
    weaknessBonus,
    finalAttackPower
  };
}
/* ============================================================
   STAMINA ACTION COSTS
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

const STAMINA_RECOVERY_RULES = {
  safeTownRestPerFiveMinutes: 15,
  homeRestPerFiveMinutes: 20,
  simpleMealRestore: 20,
  heartyMealRestore: 30,
  drinkWaterRestore: 5
};

/* ============================================================
   EXPERIENCE / LEVELING RULES
   ============================================================ */

const EXPERIENCE_RULES = {
  startingLevel: 1,
  startingExperience: 0,
  baseExperienceRequirement: 100,
  experiencePerLevelMultiplier: 50,
  statPointsPerLevel: 1
};

const ENEMY_EXPERIENCE_REWARDS = {
  streetRat: 25,
  mudfangStray: 40,
  drunkenKnifehand: 75,
  starvedBandit: 100
};

function getExperienceNeededForNextLevel(level = 1) {
  return EXPERIENCE_RULES.baseExperienceRequirement + level * EXPERIENCE_RULES.experiencePerLevelMultiplier;
}

function addExperienceToCharacter(character, experienceGained) {
  if (!character.progression) {
    character.progression = {
      level: character.level || 1,
      experience: 0,
      unspentStatPoints: 0
    };
  }

  character.progression.experience += experienceGained;

  let levelsGained = 0;

  while (character.progression.experience >= getExperienceNeededForNextLevel(character.progression.level)) {
    const requiredExperience = getExperienceNeededForNextLevel(character.progression.level);

    character.progression.experience -= requiredExperience;
    character.progression.level += 1;
    character.level = character.progression.level;
    character.progression.unspentStatPoints += EXPERIENCE_RULES.statPointsPerLevel;
    levelsGained += 1;
  }

  return {
    character,
    levelsGained,
    currentLevel: character.progression.level,
    currentExperience: character.progression.experience,
    experienceToNextLevel: getExperienceNeededForNextLevel(character.progression.level)
  };
}

/* ============================================================
   VITALITY / LIFE / HP CAPS
   Life is capped by current stage and class family.
   Extra vitality becomes locked potential.
   ============================================================ */

const HP_CAPS_BY_CLASS_TIER = {
  peasantLowborn: { mage: 250, healer: 250, rangedDps: 250, rogue: 250, meleeDps: 250, tank: 250 },

  tier1Class: { mage: 750, healer: 900, rangedDps: 900, rogue: 900, meleeDps: 1000, tank: 1500 },
  tier2Class: { mage: 1250, healer: 1600, rangedDps: 1700, rogue: 1700, meleeDps: 2000, tank: 3000 },
  tier3Class: { mage: 2000, healer: 2700, rangedDps: 3000, rogue: 3000, meleeDps: 3500, tank: 5000 },
  tier4Class: { mage: 3000, healer: 4000, rangedDps: 4500, rogue: 4500, meleeDps: 5250, tank: 7000 },
  tier5Class: { mage: 4250, healer: 5500, rangedDps: 6000, rogue: 6000, meleeDps: 7000, tank: 8500 },
  tier6Class: { mage: 5500, healer: 7000, rangedDps: 7500, rogue: 7500, meleeDps: 8500, tank: 9500 },
  tier7Class: { mage: 6500, healer: 8000, rangedDps: 8500, rogue: 8500, meleeDps: 9000, tank: 10000 },

  veteranTier1: { mage: 9000, healer: 11000, rangedDps: 11500, rogue: 11500, meleeDps: 12500, tank: 15000 },
  veteranTier2: { mage: 11000, healer: 14000, rangedDps: 14500, rogue: 14500, meleeDps: 16000, tank: 19000 },
  veteranTier3: { mage: 13500, healer: 17000, rangedDps: 17500, rogue: 17500, meleeDps: 20000, tank: 23000 },
  veteranTier4: { mage: 16500, healer: 21000, rangedDps: 21500, rogue: 21500, meleeDps: 24500, tank: 27000 },
  veteranTier5: { mage: 20000, healer: 25000, rangedDps: 25500, rogue: 25500, meleeDps: 28000, tank: 30000 },

  masterTier1: { mage: 22000, healer: 28000, rangedDps: 29000, rogue: 29000, meleeDps: 32000, tank: 35000 },
  masterTier2: { mage: 25000, healer: 33000, rangedDps: 34000, rogue: 34000, meleeDps: 38000, tank: 41000 },
  masterTier3: { mage: 28000, healer: 38000, rangedDps: 39000, rogue: 39000, meleeDps: 44000, tank: 46000 },
  masterTier4: { mage: 32000, healer: 42000, rangedDps: 43000, rogue: 43000, meleeDps: 48000, tank: 50000 },

  specializedTier1: { mage: 36000, healer: 46000, rangedDps: 47000, rogue: 47000, meleeDps: 53000, tank: 58000 },
  specializedTier2: { mage: 41000, healer: 52000, rangedDps: 54000, rogue: 54000, meleeDps: 60000, tank: 66000 },
  specializedTier3: { mage: 46000, healer: 58000, rangedDps: 60000, rogue: 60000, meleeDps: 68000, tank: 75000 },

  heroVillainTier1: { mage: 50000, healer: 63000, rangedDps: 65000, rogue: 65000, meleeDps: 72000, tank: 80000 },
  heroVillainTier2: { mage: 55000, healer: 68000, rangedDps: 70000, rogue: 70000, meleeDps: 78000, tank: 85000 },
  heroVillainTier3: { mage: 60000, healer: 74000, rangedDps: 76000, rogue: 76000, meleeDps: 84000, tank: 90000 },

  firstAwakening: { mage: 65000, healer: 80000, rangedDps: 82000, rogue: 82000, meleeDps: 90000, tank: 100000 },
  secondAwakening: { mage: 70000, healer: 87000, rangedDps: 89000, rogue: 89000, meleeDps: 98000, tank: 110000 },
  thirdAwakening: { mage: 76000, healer: 94000, rangedDps: 96000, rogue: 96000, meleeDps: 106000, tank: 120000 },
  fourthAwakening: { mage: 82000, healer: 102000, rangedDps: 105000, rogue: 105000, meleeDps: 116000, tank: 130000 },
  fifthAwakening: { mage: 88000, healer: 110000, rangedDps: 114000, rogue: 114000, meleeDps: 126000, tank: 138000 },
  sixthAwakening: { mage: 94000, healer: 118000, rangedDps: 122000, rogue: 122000, meleeDps: 136000, tank: 144000 },
  seventhAwakening: { mage: 100000, healer: 125000, rangedDps: 130000, rogue: 130000, meleeDps: 140000, tank: 150000 },

  celestialEmbodiment: { mage: 130000, healer: 155000, rangedDps: 160000, rogue: 160000, meleeDps: 175000, tank: 180000 },
  celestialEvolution: { mage: 160000, healer: 185000, rangedDps: 190000, rogue: 190000, meleeDps: 210000, tank: 215000 },
  purestOfBeings: { mage: 200000, healer: 225000, rangedDps: 230000, rogue: 230000, meleeDps: 240000, tank: 250000 },

  godbornDemonChildTier1: { mage: 220000, healer: 245000, rangedDps: 250000, rogue: 250000, meleeDps: 265000, tank: 280000 },
  godbornDemonChildTier2: { mage: 245000, healer: 275000, rangedDps: 285000, rogue: 285000, meleeDps: 305000, tank: 320000 },
  godbornDemonChild: { mage: 250000, healer: 320000, rangedDps: 335000, rogue: 335000, meleeDps: 345000, tank: 350000 },

  deityDemon: { mage: 400000, healer: 500000, rangedDps: 550000, rogue: 550000, meleeDps: 600000, tank: 777000 },
  aegisOfTitans: { tank: 999999 }
};

const VITALITY_LIFE_CONVERSION_BY_CLASS_TIER = {
  peasantLowborn: 5
};

function getHpCap(classTierKey = "peasantLowborn", roleKey = "tank") {
  const role = normalizeRoleKey(roleKey);
  const capData = HP_CAPS_BY_CLASS_TIER[classTierKey] || HP_CAPS_BY_CLASS_TIER.peasantLowborn;
  return capData[role] ?? capData.tank ?? 250;
}

function calculateMaxLifeFromVitality(vitality, classTierKey = "peasantLowborn", roleKey = "tank") {
  const baseLife = STARTING_RESOURCES.baseLife;
  const conversion = VITALITY_LIFE_CONVERSION_BY_CLASS_TIER[classTierKey] || VITALITY_LIFE_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const hardCap = getHpCap(classTierKey, roleKey);
  const calculatedLife = baseLife + vitality * conversion;

  return Math.min(calculatedLife, hardCap);
}

function calculateLockedLifePotential(vitality, classTierKey = "peasantLowborn", roleKey = "tank") {
  const baseLife = STARTING_RESOURCES.baseLife;
  const conversion = VITALITY_LIFE_CONVERSION_BY_CLASS_TIER[classTierKey] || VITALITY_LIFE_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const hardCap = getHpCap(classTierKey, roleKey);
  const calculatedLife = baseLife + vitality * conversion;

  return Math.max(0, calculatedLife - hardCap);
}

/* ============================================================
   STRENGTH -> PHYSICAL ATTACK POWER
   Normal class tier table we have locked so far.
   ============================================================ */

const STRENGTH_CONVERSION_BY_CLASS_TIER = {
  peasantLowborn: { tank: 0.10, healer: 0.10, meleeDps: 0.10, rangedDps: 0.10, mage: 0.10, rogue: 0.10 },
  peasantDeveloped: { tank: 0.15, healer: 0.15, meleeDps: 0.15, rangedDps: 0.15, mage: 0.15, rogue: 0.15 },

  tier1Class: { tank: 0.25, healer: 0.10, meleeDps: 0.50, rangedDps: 0.15, mage: 0.05, rogue: 0.15 },
  tier2Class: { tank: 1, healer: 0.30, meleeDps: 2, rangedDps: 0.50, mage: 0.10, rogue: 0.30 },
  tier3Class: { tank: 2, healer: 1, meleeDps: 4, rangedDps: 1, mage: 0.30, rogue: 1 },
  tier4Class: { tank: 4, healer: 2, meleeDps: 8, rangedDps: 2, mage: 0.75, rogue: 2 },
  tier5Class: { tank: 8, healer: 4, meleeDps: 15, rangedDps: 4, mage: 1.5, rogue: 4 },
  tier6Class: { tank: 10, healer: 6, meleeDps: 20, rangedDps: 6, mage: 2, rogue: 6 },
  tier7Class: { tank: 15, healer: 10, meleeDps: 25, rangedDps: 10, mage: 3, rogue: 10 }
};

function calculateStrengthAttack(strength, classTierKey = "peasantLowborn", roleKey = "tank") {
  const role = normalizeRoleKey(roleKey);
  const tierData = STRENGTH_CONVERSION_BY_CLASS_TIER[classTierKey] || STRENGTH_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const conversion = tierData[role] ?? 0.10;

  return {
    conversion,
    attackPower: strength * conversion
  };
}

/* ============================================================
   INTELLIGENCE -> MAGIC ATTACK POWER
   ============================================================ */

const INTELLIGENCE_CONVERSION_BY_CLASS_TIER = {
  peasantLowborn: { tank: 0.10, healer: 0.10, meleeDps: 0.10, rangedDps: 0.10, mage: 0.10, rogue: 0.10 },
  peasantDeveloped: { tank: 0.15, healer: 0.15, meleeDps: 0.15, rangedDps: 0.15, mage: 0.15, rogue: 0.15 },

  tier1Class: { tank: 0.15, healer: 0.25, meleeDps: 0.15, rangedDps: 0.15, mage: 0.50, rogue: 0.15 },
  tier2Class: { tank: 0.15, healer: 1, meleeDps: 0.15, rangedDps: 0.15, mage: 2, rogue: 0.15 },
  tier3Class: { tank: 0.15, healer: 2, meleeDps: 0.15, rangedDps: 0.15, mage: 4, rogue: 0.15 },
  tier4Class: { tank: 0.15, healer: 4, meleeDps: 0.15, rangedDps: 0.15, mage: 8, rogue: 0.15 },
  tier5Class: { tank: 0.15, healer: 8, meleeDps: 0.15, rangedDps: 0.50, mage: 15, rogue: 0.15 },
  tier6Class: { tank: 0.15, healer: 10, meleeDps: 0.15, rangedDps: 0.75, mage: 20, rogue: 0.15 },
  tier7Class: { tank: 0.15, healer: 15, meleeDps: 0.15, rangedDps: 1, mage: 25, rogue: 0.15 },

  veteranTier1: { tank: 0.25, healer: 20, meleeDps: 1, rangedDps: 2, mage: 30, rogue: 0.15 },
  veteranTier2: { tank: 0.30, healer: 22, meleeDps: 1, rangedDps: 3, mage: 33, rogue: 0.15 },
  veteranTier3: { tank: 0.30, healer: 25, meleeDps: 1, rangedDps: 3, mage: 35, rogue: 0.15 },
  veteranTier4: { tank: 1, healer: 27, meleeDps: 1, rangedDps: 3, mage: 40, rogue: 1 },
  veteranTier5: { tank: 1, healer: 30, meleeDps: 1, rangedDps: 5, mage: 45, rogue: 1 },

  masterTier1: { tank: 1, healer: 32, meleeDps: 1, rangedDps: 10, mage: 48, rogue: 1 },
  masterTier2: { tank: 1, healer: 35, meleeDps: 1, rangedDps: 10, mage: 55, rogue: 1 },
  masterTier3: { tank: 1, healer: 40, meleeDps: 1, rangedDps: 10, mage: 65, rogue: 1 },
  masterTier4: { tank: 1, healer: 50, meleeDps: 1, rangedDps: 10, mage: 70, rogue: 1 },

  specializedTier1: { tank: 1, healer: 60, meleeDps: 1, rangedDps: 25, mage: 80, rogue: 1 },
  specializedTier2: { tank: 1, healer: 70, meleeDps: 1, rangedDps: 25, mage: 100, rogue: 1 },
  specializedTier3: { tank: 1, healer: 75, meleeDps: 1, rangedDps: 25, mage: 115, rogue: 1 },
  specializedTier4: { tank: 1, healer: 85, meleeDps: 1, rangedDps: 25, mage: 125, rogue: 1 },

  heroVillainTier1: { tank: 1, healer: 100, meleeDps: 1, rangedDps: 50, mage: 150, rogue: 1 },
  heroVillainTier2: { tank: 1, healer: 150, meleeDps: 1, rangedDps: 50, mage: 250, rogue: 1 },
  heroVillainTier3: { tank: 1, healer: 175, meleeDps: 1, rangedDps: 50, mage: 299, rogue: 1 },
  heroVillainTier4: { tank: 1, healer: 195, meleeDps: 1, rangedDps: 50, mage: 325, rogue: 1 },

  firstAwakening: { tank: 1, healer: 200, meleeDps: 1, rangedDps: 50, mage: 350, rogue: 1 },
  secondAwakening: { tank: 1, healer: 225, meleeDps: 1, rangedDps: 50, mage: 400, rogue: 1 },
  thirdAwakening: { tank: 1, healer: 275, meleeDps: 1, rangedDps: 50, mage: 500, rogue: 1 },
  fourthAwakening: { tank: 1, healer: 300, meleeDps: 1, rangedDps: 50, mage: 550, rogue: 1 },
  fifthAwakening: { tank: 1, healer: 325, meleeDps: 1, rangedDps: 50, mage: 600, rogue: 1 },
  sixthAwakening: { tank: 1, healer: 350, meleeDps: 1, rangedDps: 50, mage: 650, rogue: 1 },
  seventhAwakening: { tank: 1, healer: 375, meleeDps: 1, rangedDps: 50, mage: 750, rogue: 1 },

  ascensionGate: { tank: null, healer: null, meleeDps: null, rangedDps: null, mage: null, rogue: null },
  ascensionClass: { tank: 1, healer: 500, meleeDps: 1, rangedDps: 50, mage: 1000, rogue: 1 },
  higherAscension: { tank: 1, healer: 750, meleeDps: 1, rangedDps: 50, mage: 1500, rogue: 1 },
  highestAscension: { tank: 1, healer: 850, meleeDps: 1, rangedDps: 50, mage: 2000, rogue: 1 },

  celestialEmbodiment: { tank: 1, healer: 1250, meleeDps: 1, rangedDps: 50, mage: 2500, rogue: 1 },
  celestialEvolution: { tank: 1, healer: 1500, meleeDps: 1, rangedDps: 50, mage: 3000, rogue: 1 },
  purestOfBeings: { tank: 1, healer: 2000, meleeDps: 1, rangedDps: 50, mage: 4000, rogue: 1 },
  godbornDemonChild: { tank: 1, healer: 2250, meleeDps: 1, rangedDps: 50, mage: 5000, rogue: 1 },
  deityDemon: { tank: 1, healer: 2500, meleeDps: 1, rangedDps: 50, mage: 7500, rogue: 1 }
};

function calculateMagicAttack(intelligence, classTierKey = "peasantLowborn", roleKey = "mage") {
  const role = normalizeRoleKey(roleKey);
  const tierData = INTELLIGENCE_CONVERSION_BY_CLASS_TIER[classTierKey] || INTELLIGENCE_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const conversion = tierData[role];

  if (conversion === null || conversion === undefined) {
    return { isLocked: true, conversion: null, magicAttack: 0 };
  }

  return {
    isLocked: false,
    conversion,
    magicAttack: intelligence * conversion
  };
}

/* ============================================================
   DEXTERITY -> DEX ATTACK POWER
   Only scalable for Melee DPS, Ranged DPS, and Rogue.
   ============================================================ */

const DEXTERITY_DAMAGE_CONVERSION_BY_CLASS_TIER = {
  peasantLowborn: { meleeDps: 0.10, rangedDps: 0.10, rogue: 0.10 },
  peasantDeveloped: { meleeDps: 0.15, rangedDps: 0.15, rogue: 0.15 },

  tier1Class: { meleeDps: 0.20, rangedDps: 0.50, rogue: 0.75 },
  tier2Class: { meleeDps: 0.30, rangedDps: 2, rogue: 3 },
  tier3Class: { meleeDps: 0.50, rangedDps: 4, rogue: 5 },
  tier4Class: { meleeDps: 1, rangedDps: 8, rogue: 10 },
  tier5Class: { meleeDps: 2, rangedDps: 15, rogue: 18 },
  tier6Class: { meleeDps: 3, rangedDps: 20, rogue: 24 },
  tier7Class: { meleeDps: 5, rangedDps: 25, rogue: 30 },

  veteranTier1: { meleeDps: 8, rangedDps: 35, rogue: 45 },
  veteranTier2: { meleeDps: 10, rangedDps: 40, rogue: 55 },
  veteranTier3: { meleeDps: 12, rangedDps: 45, rogue: 65 },
  veteranTier4: { meleeDps: 15, rangedDps: 55, rogue: 80 },
  veteranTier5: { meleeDps: 20, rangedDps: 65, rogue: 95 },

  masterTier1: { meleeDps: 25, rangedDps: 80, rogue: 115 },
  masterTier2: { meleeDps: 30, rangedDps: 95, rogue: 135 },
  masterTier3: { meleeDps: 40, rangedDps: 115, rogue: 160 },
  masterTier4: { meleeDps: 50, rangedDps: 130, rogue: 180 },

  specializedTier1: { meleeDps: 65, rangedDps: 170, rogue: 225 },
  specializedTier2: { meleeDps: 85, rangedDps: 220, rogue: 290 },
  specializedTier3: { meleeDps: 110, rangedDps: 280, rogue: 360 },
  specializedTier4: { meleeDps: 130, rangedDps: 320, rogue: 420 },

  heroVillainTier1: { meleeDps: 160, rangedDps: 450, rogue: 600 },
  heroVillainTier2: { meleeDps: 220, rangedDps: 650, rogue: 850 },
  heroVillainTier3: { meleeDps: 275, rangedDps: 850, rogue: 1100 },
  heroVillainTier4: { meleeDps: 325, rangedDps: 1000, rogue: 1300 },

  firstAwakening: { meleeDps: 400, rangedDps: 1200, rogue: 1600 },
  secondAwakening: { meleeDps: 500, rangedDps: 1500, rogue: 2000 },
  thirdAwakening: { meleeDps: 650, rangedDps: 1900, rogue: 2600 },
  fourthAwakening: { meleeDps: 800, rangedDps: 2300, rogue: 3200 },
  fifthAwakening: { meleeDps: 950, rangedDps: 2800, rogue: 3900 },
  sixthAwakening: { meleeDps: 1100, rangedDps: 3300, rogue: 4700 },
  seventhAwakening: { meleeDps: 1300, rangedDps: 4000, rogue: 5600 },

  ascensionClass: { meleeDps: 1800, rangedDps: 6500, rogue: 8500 },
  higherAscension: { meleeDps: 2500, rangedDps: 9000, rogue: 12000 },
  highestAscension: { meleeDps: 3500, rangedDps: 12000, rogue: 16000 },

  celestialEmbodiment: { meleeDps: 5000, rangedDps: 17500, rogue: 24000 },
  celestialEvolution: { meleeDps: 7000, rangedDps: 24000, rogue: 32000 },
  purestOfBeings: { meleeDps: 10000, rangedDps: 32000, rogue: 45000 },
  godbornDemonChild: { meleeDps: 12500, rangedDps: 45000, rogue: 65000 },
  deityDemon: { meleeDps: 15000, rangedDps: 60000, rogue: 90000 }
};

function calculateDexterityAttack(dexterity, classTierKey = "peasantLowborn", roleKey = "rogue") {
  const role = normalizeRoleKey(roleKey);
  const tierData = DEXTERITY_DAMAGE_CONVERSION_BY_CLASS_TIER[classTierKey] || DEXTERITY_DAMAGE_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const conversion = tierData[role] ?? 0;

  return {
    conversion,
    attackPower: dexterity * conversion,
    isDexDamageClass: conversion > 0
  };
}

/* ============================================================
   DEXTERITY DERIVED STATS
   Percent values are decimals.
   0.18 = +18%.
   ============================================================ */

const DEXTERITY_DERIVED_STAT_RULES = {
  meleeDps: {
    accuracy: { perDex: 0.002, cap: 0.18 },
    evasion: { perDex: 0.0015, cap: 0.12 },
    critical: { perDex: 0.0012, cap: 0.10 },
    movement: { perDex: 0.0006, cap: 0.05 },
    flee: { perDex: 0.0015, cap: 0.12 }
  },

  rangedDps: {
    accuracy: { perDex: 0.003, cap: 0.25 },
    evasion: { perDex: 0.0012, cap: 0.10 },
    critical: { perDex: 0.0018, cap: 0.15 },
    movement: { perDex: 0.0008, cap: 0.07 },
    flee: { perDex: 0.0018, cap: 0.15 }
  },

  rogue: {
    accuracy: { perDex: 0.0025, cap: 0.22 },
    evasion: { perDex: 0.003, cap: 0.25 },
    critical: { perDex: 0.003, cap: 0.25 },
    movement: { perDex: 0.0012, cap: 0.10 },
    flee: { perDex: 0.0025, cap: 0.20 }
  }
};

function calculateDexterityDerivedStats(dexterity, roleKey = "rogue") {
  const role = normalizeRoleKey(roleKey);
  const rules = DEXTERITY_DERIVED_STAT_RULES[role] || DEXTERITY_DERIVED_STAT_RULES.rogue;

  function calc(statName) {
    const rule = rules[statName];
    return Math.min(dexterity * rule.perDex, rule.cap);
  }

  return {
    accuracyBonus: calc("accuracy"),
    evasionBonus: calc("evasion"),
    criticalBonus: calc("critical"),
    movementBonus: calc("movement"),
    fleeBonus: calc("flee")
  };
}

/* ============================================================
   AGILITY ADVANCED PASSIVE STAT
   Agility is not a beginner main stat. It unlocks later.
   ============================================================ */

const AGILITY_STAMINA_CONVERSION_BY_CLASS = {
  rogue: 2,
  ranger: 1.5,
  rangedDps: 1.5,
  dualSword: 2,
  monk: 2.5,
  martialArtist: 2.5,
  meleeDps: 1,
  tank: 0,
  mage: 0,
  healer: 0
};

function calculateAgilityStaminaBonus(agility = 0, classKey = "rogue") {
  const conversion = AGILITY_STAMINA_CONVERSION_BY_CLASS[classKey] ?? AGILITY_STAMINA_CONVERSION_BY_CLASS[normalizeRoleKey(classKey)] ?? 0;

  return {
    conversion,
    bonusStamina: agility * conversion
  };
}

/* ============================================================
   WISDOM -> PRAYER POWER
   Wisdom is prayer power, spiritual authority, sacred arts, and
   spiritual essence control.
   ============================================================ */

const WISDOM_PRAYER_CONVERSION_BY_CLASS_TIER = {
  peasantLowborn: { tank: 0.10, healer: 0.10, meleeDps: 0.10, rangedDps: 0.10, mage: 0.10, rogue: 0.10 },
  peasantDeveloped: { tank: 0.15, healer: 0.15, meleeDps: 0.15, rangedDps: 0.15, mage: 0.15, rogue: 0.15 },

  tier1Class: { tank: 0.25, healer: 0.50, meleeDps: 0.35, rangedDps: 0.25, mage: 0.35, rogue: 0.15 },
  tier2Class: { tank: 0.50, healer: 2, meleeDps: 1, rangedDps: 0.50, mage: 1.25, rogue: 0.25 },
  tier3Class: { tank: 1, healer: 4, meleeDps: 2, rangedDps: 1, mage: 2.5, rogue: 0.50 },
  tier4Class: { tank: 2, healer: 8, meleeDps: 4, rangedDps: 2, mage: 5, rogue: 1 },
  tier5Class: { tank: 4, healer: 15, meleeDps: 8, rangedDps: 4, mage: 10, rogue: 1.5 },
  tier6Class: { tank: 6, healer: 20, meleeDps: 10, rangedDps: 6, mage: 15, rogue: 2 },
  tier7Class: { tank: 10, healer: 25, meleeDps: 15, rangedDps: 10, mage: 20, rogue: 3 },

  veteranTier1: { tank: 15, healer: 40, meleeDps: 25, rangedDps: 15, mage: 30, rogue: 5 },
  veteranTier2: { tank: 20, healer: 45, meleeDps: 30, rangedDps: 18, mage: 35, rogue: 6 },
  veteranTier3: { tank: 25, healer: 50, meleeDps: 35, rangedDps: 22, mage: 40, rogue: 8 },
  veteranTier4: { tank: 30, healer: 60, meleeDps: 45, rangedDps: 28, mage: 50, rogue: 10 },
  veteranTier5: { tank: 40, healer: 75, meleeDps: 55, rangedDps: 35, mage: 65, rogue: 12 },

  masterTier1: { tank: 50, healer: 90, meleeDps: 65, rangedDps: 45, mage: 80, rogue: 15 },
  masterTier2: { tank: 60, healer: 110, meleeDps: 80, rangedDps: 55, mage: 100, rogue: 18 },
  masterTier3: { tank: 75, healer: 130, meleeDps: 95, rangedDps: 65, mage: 120, rogue: 22 },
  masterTier4: { tank: 90, healer: 150, meleeDps: 115, rangedDps: 75, mage: 140, rogue: 25 },

  specializedTier1: { tank: 110, healer: 180, meleeDps: 140, rangedDps: 90, mage: 165, rogue: 30 },
  specializedTier2: { tank: 130, healer: 220, meleeDps: 170, rangedDps: 110, mage: 200, rogue: 35 },
  specializedTier3: { tank: 150, healer: 260, meleeDps: 200, rangedDps: 130, mage: 240, rogue: 40 },
  specializedTier4: { tank: 175, healer: 300, meleeDps: 230, rangedDps: 150, mage: 275, rogue: 45 },

  heroVillainTier1: { tank: 225, healer: 400, meleeDps: 300, rangedDps: 200, mage: 350, rogue: 60 },
  heroVillainTier2: { tank: 300, healer: 550, meleeDps: 425, rangedDps: 275, mage: 500, rogue: 75 },
  heroVillainTier3: { tank: 375, healer: 700, meleeDps: 550, rangedDps: 350, mage: 650, rogue: 90 },
  heroVillainTier4: { tank: 450, healer: 850, meleeDps: 650, rangedDps: 425, mage: 800, rogue: 100 },

  firstAwakening: { tank: 600, healer: 1000, meleeDps: 800, rangedDps: 500, mage: 900, rogue: 125 },
  secondAwakening: { tank: 700, healer: 1250, meleeDps: 950, rangedDps: 575, mage: 1100, rogue: 150 },
  thirdAwakening: { tank: 850, healer: 1500, meleeDps: 1100, rangedDps: 650, mage: 1350, rogue: 175 },
  fourthAwakening: { tank: 1000, healer: 1750, meleeDps: 1300, rangedDps: 750, mage: 1600, rogue: 200 },
  fifthAwakening: { tank: 1200, healer: 2000, meleeDps: 1500, rangedDps: 850, mage: 1850, rogue: 225 },
  sixthAwakening: { tank: 1400, healer: 2250, meleeDps: 1750, rangedDps: 950, mage: 2100, rogue: 250 },
  seventhAwakening: { tank: 1600, healer: 2500, meleeDps: 2000, rangedDps: 1100, mage: 2400, rogue: 300 },

  ascensionClass: { tank: 2000, healer: 3500, meleeDps: 2500, rangedDps: 1500, mage: 3250, rogue: 400 },
  higherAscension: { tank: 2750, healer: 5000, meleeDps: 3500, rangedDps: 2000, mage: 4750, rogue: 500 },
  highestAscension: { tank: 3500, healer: 6500, meleeDps: 4500, rangedDps: 2500, mage: 6250, rogue: 650 },

  celestialEmbodiment: { tank: 4500, healer: 8500, meleeDps: 6000, rangedDps: 3500, mage: 8000, rogue: 800 },
  celestialEvolution: { tank: 6000, healer: 11000, meleeDps: 8000, rangedDps: 4500, mage: 10500, rogue: 1000 },
  purestOfBeings: { tank: 8000, healer: 15000, meleeDps: 10000, rangedDps: 6000, mage: 14000, rogue: 1250 },
  godbornDemonChild: { tank: 11000, healer: 20000, meleeDps: 14000, rangedDps: 8000, mage: 18000, rogue: 1500 },
  deityDemon: { tank: 15000, healer: 30000, meleeDps: 20000, rangedDps: 12000, mage: 25000, rogue: 2000 }
};

function calculatePrayerPower(wisdom, classTierKey = "peasantLowborn", roleKey = "healer") {
  const role = normalizeRoleKey(roleKey);
  const tierData = WISDOM_PRAYER_CONVERSION_BY_CLASS_TIER[classTierKey] || WISDOM_PRAYER_CONVERSION_BY_CLASS_TIER.peasantLowborn;
  const conversion = tierData[role] ?? 0.10;

  return {
    conversion,
    prayerPower: wisdom * conversion
  };
}

/* ============================================================
   MANA / SPIRITUAL ESSENCE
   Priest and mage can reach 999,999 mana. Other classes have lower caps.
   ============================================================ */

const MANA_RULES_BY_CLASS = {
  tank: {
    finalManaCap: 100000,
    passiveManaPerLevel: 3,
    wisdomManaPerWisdom: 5,
    purpose: "Sacred blocks, mountain barriers, radiant beast wards"
  },

  meleeDps: {
    finalManaCap: 150000,
    passiveManaPerLevel: 5,
    wisdomManaPerWisdom: 8,
    purpose: "Sacred blade arts, chi sword, aura weapon techniques"
  },

  rangedDps: {
    finalManaCap: 250000,
    passiveManaPerLevel: 6,
    wisdomManaPerWisdom: 10,
    purpose: "Spirit arrows, divine ammunition, charged shots"
  },

  rogue: {
    finalManaCap: 50000,
    passiveManaPerLevel: 2,
    wisdomManaPerWisdom: 3,
    purpose: "Shadow prayers, curse tricks, escape arts"
  },

  healer: {
    finalManaCap: 999999,
    passiveManaPerLevel: 15,
    wisdomManaPerWisdom: 25,
    purpose: "Prayer casting, healing, blessings, divine channeling"
  },

  mage: {
    finalManaCap: 999999,
    passiveManaPerLevel: 15,
    wisdomManaPerWisdom: 25,
    purpose: "Spell casting, mana body, spiritual spell control"
  }
};

function calculateMaxMana(level = 1, wisdom = 0, roleKey = "mage") {
  const role = normalizeRoleKey(roleKey);
  const rules = MANA_RULES_BY_CLASS[role] || MANA_RULES_BY_CLASS.mage;

  const passiveMana = level * rules.passiveManaPerLevel;
  const wisdomMana = wisdom * rules.wisdomManaPerWisdom;
  const calculatedMana = STARTING_RESOURCES.baseMana + passiveMana + wisdomMana;
  const maxMana = Math.min(calculatedMana, rules.finalManaCap);
  const lockedManaPotential = Math.max(0, calculatedMana - rules.finalManaCap);

  return {
    maxMana,
    calculatedMana,
    passiveMana,
    wisdomMana,
    lockedManaPotential,
    cap: rules.finalManaCap,
    passiveManaPerLevel: rules.passiveManaPerLevel,
    wisdomManaPerWisdom: rules.wisdomManaPerWisdom,
    purpose: rules.purpose
  };
}

/* ============================================================
   STARTING CHARACTER RESOURCE CREATION / PATCHING
   Use this from app.js when creating a new character,
   and from pages when migrating older saved characters.
   ============================================================ */

function createStartingResources(character) {
  const stats = character.stats || STARTING_MAIN_STATS;
  const roleKey = normalizeRoleKey(character.roleKey || character.rolePath || "tank");
  const classTierKey = character.classTierKey || "peasantLowborn";
  const level = character.level || character.progression?.level || 1;

  const maxLife = calculateMaxLifeFromVitality(stats.vitality, classTierKey, roleKey);
  const manaData = calculateMaxMana(level, stats.wisdom, roleKey);

  return {
    maxLife,
    currentLife: maxLife,

    maxStamina: STARTING_RESOURCES.baseStamina,
    currentStamina: STARTING_RESOURCES.baseStamina,

    maxMana: manaData.maxMana,
    currentMana: manaData.maxMana
  };
}

function patchCharacterDefaults(character) {
  if (!character.stats) {
    character.stats = { ...STARTING_MAIN_STATS };
  }

  if (!character.level) {
    character.level = 1;
  }

  if (!character.progression) {
    character.progression = {
      level: character.level,
      experience: 0,
      unspentStatPoints: 0
    };
  }

  if (!character.classTierKey) {
    character.classTierKey = "peasantLowborn";
  }

  if (!character.roleKey) {
    character.roleKey = "tank";
  }

  if (!character.resources) {
    character.resources = createStartingResources(character);
  }

  return character;
}

/* ============================================================
   COMBINED STAT BREAKDOWN
   Useful for character sheet and combat display.
   ============================================================ */

function getFullStatBreakdown(character) {
  const patched = patchCharacterDefaults(character);
  const stats = patched.stats;
  const roleKey = normalizeRoleKey(patched.roleKey || "tank");
  const classTierKey = patched.classTierKey || "peasantLowborn";
  const level = patched.progression?.level || patched.level || 1;

  const strength = calculateStrengthAttack(stats.strength, classTierKey, roleKey);
  const intelligence = calculateMagicAttack(stats.intelligence, classTierKey, roleKey);
  const dexterity = calculateDexterityAttack(stats.dexterity, classTierKey, roleKey);
  const dexDerived = calculateDexterityDerivedStats(stats.dexterity, roleKey);
  const wisdom = calculatePrayerPower(stats.wisdom, classTierKey, roleKey);
  const mana = calculateMaxMana(level, stats.wisdom, roleKey);
  const maxLife = calculateMaxLifeFromVitality(stats.vitality, classTierKey, roleKey);
  const lockedLifePotential = calculateLockedLifePotential(stats.vitality, classTierKey, roleKey);

  return {
    roleKey,
    classTierKey,
    stageLabel: STAGE_LABELS[classTierKey] || classTierKey,
    level,
    stats,
    resources: patched.resources,

    life: {
      maxLife,
      cap: getHpCap(classTierKey, roleKey),
      lockedLifePotential
    },

    strength,
    intelligence,
    dexterity,
    dexDerived,
    wisdom,
    mana,

    experience: {
      currentExperience: patched.progression.experience,
      experienceToNextLevel: getExperienceNeededForNextLevel(level),
      unspentStatPoints: patched.progression.unspentStatPoints
    }
  };
}

/* ============================================================
   EXPORT TO WINDOW
   This keeps the file simple for normal browser scripts.
   Example:
   const data = AshesDustStats.getFullStatBreakdown(character);
   ============================================================ */

window.AshesDustStats = {
  ROLE_KEYS,
  ROLE_ALIASES,
  STAGE_LABELS,

  STARTING_MAIN_STATS,
  STARTING_RESOURCES,
  DAMAGE_ROLL_RULES,
  STAMINA_ACTION_COSTS,
  STAMINA_RECOVERY_RULES,
  EXPERIENCE_RULES,
  ENEMY_EXPERIENCE_REWARDS,

  HP_CAPS_BY_CLASS_TIER,
  VITALITY_LIFE_CONVERSION_BY_CLASS_TIER,
  STRENGTH_CONVERSION_BY_CLASS_TIER,
  INTELLIGENCE_CONVERSION_BY_CLASS_TIER,
  DEXTERITY_DAMAGE_CONVERSION_BY_CLASS_TIER,
  DEXTERITY_DERIVED_STAT_RULES,
  AGILITY_STAMINA_CONVERSION_BY_CLASS,
  WISDOM_PRAYER_CONVERSION_BY_CLASS_TIER,
  MANA_RULES_BY_CLASS,

  normalizeRoleKey,
  calculateDamageRange,
  rollDamage,
  applyWeaknessModifier,
  getExperienceNeededForNextLevel,

  getHpCap,
  calculateMaxLifeFromVitality,
  calculateLockedLifePotential,

  calculateStrengthAttack,
  calculateMagicAttack,
  calculateDexterityAttack,
  calculateDexterityDerivedStats,
  calculateAgilityStaminaBonus,
  calculatePrayerPower,
  calculateMaxMana,

  createStartingResources,
  patchCharacterDefaults,
  getFullStatBreakdown
};
