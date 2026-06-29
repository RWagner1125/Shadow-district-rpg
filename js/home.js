const savedCharacter = JSON.parse(localStorage.getItem("shadowDistrictCharacter"));

if (!savedCharacter) {
  window.location.href = "index.html";
}

const baseStats = {
  strength: 5,
  vitality: 5,
  intelligence: 5,
  wisdom: 5,
  dexterity: 5
};

document.getElementById("homeName").textContent = savedCharacter.name;
document.getElementById("homeTitle").textContent = "Lowborn Commoner";
document.getElementById("homeLineage").textContent = savedCharacter.lineage;
document.getElementById("homeEthnicity").textContent = savedCharacter.ethnicity;
document.getElementById("homeGender").textContent = savedCharacter.gender;
document.getElementById("homeOrigin").textContent = savedCharacter.origin;

document.getElementById("homeStrength").textContent = baseStats.strength;
document.getElementById("homeVitality").textContent = baseStats.vitality;
document.getElementById("homeIntelligence").textContent = baseStats.intelligence;
document.getElementById("homeWisdom").textContent = baseStats.wisdom;
document.getElementById("homeDexterity").textContent = baseStats.dexterity;

document.getElementById("welcomeText").textContent =
  `${savedCharacter.name}, you are a ${savedCharacter.ethnicity} ${savedCharacter.gender} born as a ${savedCharacter.origin}. Your name has entered the lowborn record, but the world still does not care.`;

document.getElementById("resetCharacterBtn").addEventListener("click", function () {
  localStorage.removeItem("shadowDistrictCharacter");
  window.location.href = "index.html";
});
