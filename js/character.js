/* ============================================================
   ASHES & DUST / SHADOW DISTRICT RPG - CHARACTER SHEET
   ============================================================

   FILE:
   js/character.js

   PURPOSE:
   This file controls character.html.

   It reads the saved character from localStorage, uses statRules.js
   to calculate all current stat conversions, then displays them
   on the character sheet.

   Required script order in character.html:
   1. js/statRules.js
   2. js/character.js
   ============================================================ */


/* ============================================================
   LOAD SAVED CHARACTER
   If no saved character exists, send player back to creation.
   ============================================================ */

const savedCharacterRaw = localStorage.getItem("shadowDistrictCharacter");

if (!savedCharacterRaw) {
  window.location.href = "index.html";
}

let character = JSON.parse(savedCharacterRaw);


/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "0";
  }

  return Number(value).toLocaleString();
}

function formatPercent(decimalValue) {
  if (decimalValue === null || decimalValue === undefined) {
    return "0%";
  }

  return `${(decimalValue * 100).toFixed(2)}%`;
}

function formatDecimal(value) {
  if (value === null || value === undefined) {
    return "0";
  }

  return Number(value).toFixed(2);
}


/* ============================================================
   PATCH OLD CHARACTER SAVES
   Older characters may not have:
   - progression
   - classTierKey
   - roleKey
   - resources

   statRules.js has the patch function, so we use it here.
   ============================================================ */

character = window.AshesDustStats.patchCharacterDefaults(character);


/* ============================================================
   SAVE PATCHED CHARACTER
   This updates old saves so the new character sheet works.
   ============================================================ */

localStorage.setItem("shadowDistrictCharacter", JSON.stringify(character));


/* ============================================================
   GET FULL STAT BREAKDOWN
   This pulls all formulas from statRules.js.
   ============================================================ */

const breakdown = window.AshesDustStats.getFullStatBreakdown(character);


/* ============================================================
   RENDER IDENTITY
   ============================================================ */

setText("sheetName", character.name || "Unnamed Lowborn");
setText("sheetTitle", character.title || "Lowborn Commoner");

setText("sheetLevel", breakdown.level);
setText(
  "sheetExperience",
  `${formatNumber(breakdown.experience.currentExperience)} / ${formatNumber(breakdown.experience.experienceToNextLevel)}`
);
setText("sheetUnspentStatPoints", breakdown.experience.unspentStatPoints);

setText("sheetClassTier", breakdown.stageLabel || "Peasant / Lowborn");
setText("sheetRole", breakdown.roleKey || "tank");

setText("sheetLineage", character.lineage || "Unknown");
setText("sheetEthnicity", character.ethnicity || "Unknown");
setText("sheetGender", character.gender || "Unknown");
setText("sheetOrigin", character.origin || "Unknown");
setText("sheetCapital", character.capital || "Ashen Crown");


/* ============================================================
   RENDER RESOURCES
   ============================================================ */

const resources = character.resources;

setText(
  "sheetLife",
  `${formatNumber(resources.currentLife)} / ${formatNumber(resources.maxLife)}`
);

setText("sheetHpCap", formatNumber(breakdown.life.cap));
setText("sheetLockedLife", formatNumber(breakdown.life.lockedLifePotential));

setText(
  "sheetStamina",
  `${formatNumber(resources.currentStamina)} / ${formatNumber(resources.maxStamina)}`
);

setText(
  "sheetMana",
  `${formatNumber(resources.currentMana)} / ${formatNumber(resources.maxMana)}`
);

setText("sheetManaCap", formatNumber(breakdown.mana.cap));
setText("sheetPassiveMana", formatNumber(breakdown.mana.passiveMana));
setText("sheetWisdomMana", formatNumber(breakdown.mana.wisdomMana));


/* ============================================================
   RENDER MAIN STATS
   ============================================================ */

setText("sheetStrength", breakdown.stats.strength);
setText("sheetVitality", breakdown.stats.vitality);
setText("sheetIntelligence", breakdown.stats.intelligence);
setText("sheetWisdom", breakdown.stats.wisdom);
setText("sheetDexterity", breakdown.stats.dexterity);


/* ============================================================
   RENDER STRENGTH CONVERSION
   ============================================================ */

setText("sheetStrengthConversion", breakdown.strength.conversion);
setText("sheetStrengthAttack", formatDecimal(breakdown.strength.attackPower));


/* ============================================================
   RENDER INTELLIGENCE CONVERSION
   ============================================================ */

if (breakdown.intelligence.isLocked) {
  setText("sheetMagicConversion", "Locked");
  setText("sheetMagicAttack", "0");
} else {
  setText("sheetMagicConversion", breakdown.intelligence.conversion);
  setText("sheetMagicAttack", formatDecimal(breakdown.intelligence.magicAttack));
}


/* ============================================================
   RENDER DEXTERITY CONVERSION AND DERIVED STATS
   ============================================================ */

setText("sheetDexConversion", breakdown.dexterity.conversion);
setText("sheetDexAttack", formatDecimal(breakdown.dexterity.attackPower));

setText("sheetAccuracy", formatPercent(breakdown.dexDerived.accuracyBonus));
setText("sheetEvasion", formatPercent(breakdown.dexDerived.evasionBonus));
setText("sheetCritical", formatPercent(breakdown.dexDerived.criticalBonus));
setText("sheetMovement", formatPercent(breakdown.dexDerived.movementBonus));
setText("sheetFlee", formatPercent(breakdown.dexDerived.fleeBonus));


/* ============================================================
   RENDER WISDOM / PRAYER CONVERSION
   ============================================================ */

setText("sheetPrayerConversion", breakdown.wisdom.conversion);
setText("sheetPrayerPower", formatDecimal(breakdown.wisdom.prayerPower));
