const player = {
  name: "Unnamed Lowborn",
  title: "Lowborn Commoner",
  lineage: "Caucasian / European",
  origin: "Orphaned Laborer",
  rolePath: "Undecided",
  capital: "Ashen Crown",
  gold: 100,
  donation: 0,
  jobRank: 1,
  capitalReputation: 0,
  stats: {
    strength: 5,
    vitality: 5,
    intelligence: 5,
    wisdom: 5,
    dexterity: 5
  },
  hiddenStats: {
    luck: 10,
    divineFavor: 0,
    malice: 0,
    honor: 0,
    ambition: 0
  }
};

function updateUI() {
  document.getElementById("playerName").textContent = player.name;
  document.getElementById("playerTitle").textContent = player.title;
  document.getElementById("lineage").textContent = player.lineage;
  document.getElementById("origin").textContent = player.origin;
  document.getElementById("rolePath").textContent = player.rolePath;
  document.getElementById("capital").textContent = player.capital;

  document.getElementById("strength").textContent = player.stats.strength;
  document.getElementById("vitality").textContent = player.stats.vitality;
  document.getElementById("intelligence").textContent = player.stats.intelligence;
  document.getElementById("wisdom").textContent = player.stats.wisdom;
  document.getElementById("dexterity").textContent = player.stats.dexterity;

  document.getElementById("donation").textContent = player.donation;
  document.getElementById("jobRank").textContent = player.jobRank;
  document.getElementById("capitalRep").textContent = player.capitalReputation;
}

document.getElementById("completeQuestBtn").addEventListener("click", function () {
  player.stats.strength += 2;
  player.stats.vitality += 1;
  player.gold += 250;
  player.capitalReputation += 25;
  player.hiddenStats.ambition += 2;

  alert("Quest completed: Hands of Ash and Stone. You gained +2 Strength, +1 Vitality, 250 gold, and +25 Capital Reputation.");

  updateUI();
});

updateUI();
