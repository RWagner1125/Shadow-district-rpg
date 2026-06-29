const savedCharacterRaw = localStorage.getItem("shadowDistrictCharacter");

if (!savedCharacterRaw) {
  window.location.href = "index.html";
}

const savedCharacter = JSON.parse(savedCharacterRaw);

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

setText("homeName", savedCharacter.name || "Unnamed Lowborn");
setText("homeTitle", "Lowborn Commoner");
setText("homeLineage", savedCharacter.lineage || "Unknown");
setText("homeEthnicity", savedCharacter.ethnicity || "Unknown");
setText("homeGender", savedCharacter.gender || "Unknown");
setText("homeOrigin", savedCharacter.origin || "Unknown");
setText("homeCapital", savedCharacter.capital || "Ashen Crown");

const baseStats = {
  strength: 5,
  vitality: 5,
  intelligence: 5,
  wisdom: 5,
  dexterity: 5
};

setText("homeStrength", baseStats.strength);
setText("homeVitality", baseStats.vitality);
setText("homeIntelligence", baseStats.intelligence);
setText("homeWisdom", baseStats.wisdom);
setText("homeDexterity", baseStats.dexterity);

const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
  welcomeText.textContent =
    `${savedCharacter.name}, you are a ${savedCharacter.ethnicity} ${savedCharacter.gender} born from the ${savedCharacter.lineage} lineage as a ${savedCharacter.origin}. Your name has entered the lowborn record, but the world still does not care.`;
}
