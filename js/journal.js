const savedCharacter = JSON.parse(localStorage.getItem("shadowDistrictCharacter"));

if (!savedCharacter) {
  window.location.href = "index.html";
}

const activeQuestList = document.getElementById("activeQuestList");
const completedQuestList = document.getElementById("completedQuestList");
const questDetailTitle = document.getElementById("questDetailTitle");
const questDetailBox = document.getElementById("questDetailBox");

function getJournal() {
  let journal = JSON.parse(localStorage.getItem("shadowDistrictJournal"));

  if (!journal) {
    journal = {
      activeQuests: [],
      completedQuests: []
    };

    localStorage.setItem("shadowDistrictJournal", JSON.stringify(journal));
  }

  return journal;
}

function saveJournal(journal) {
  localStorage.setItem("shadowDistrictJournal", JSON.stringify(journal));
}

function addQuestIfMissing(quest) {
  const journal = getJournal();

  const alreadyActive = journal.activeQuests.some(q => q.id === quest.id);
  const alreadyCompleted = journal.completedQuests.some(q => q.id === quest.id);

  if (!alreadyActive && !alreadyCompleted) {
    journal.activeQuests.push(quest);
    saveJournal(journal);
  }
}

function completeQuest(questId) {
  const journal = getJournal();

  const questIndex = journal.activeQuests.findIndex(q => q.id === questId);

  if (questIndex === -1) {
    return;
  }

  const completedQuest = journal.activeQuests.splice(questIndex, 1)[0];

  completedQuest.status = "Completed";
  completedQuest.completedAt = new Date().toLocaleString();

  journal.completedQuests.push(completedQuest);
  saveJournal(journal);
  renderJournal();
}

function renderJournal() {
  const journal = getJournal();

  activeQuestList.innerHTML = "";
  completedQuestList.innerHTML = "";

  if (journal.activeQuests.length === 0) {
    activeQuestList.innerHTML = `<p>No active quests.</p>`;
  }

  if (journal.completedQuests.length === 0) {
    completedQuestList.innerHTML = `<p>No completed quests yet.</p>`;
  }

  journal.activeQuests.forEach(quest => {
    const questCard = document.createElement("div");
    questCard.className = "journal-quest-card active";

    questCard.innerHTML = `
      <h3>${quest.title}</h3>
      <p>Status: <span class="quest-status-active">Active</span></p>
      <p>Location: ${quest.location}</p>
    `;

    questCard.addEventListener("click", function () {
      showQuestDetails(quest, "Active");
    });

    activeQuestList.appendChild(questCard);
  });

  journal.completedQuests.forEach(quest => {
    const questCard = document.createElement("div");
    questCard.className = "journal-quest-card completed";

    questCard.innerHTML = `
      <h3>${quest.title}</h3>
      <p>Status: <span class="quest-status-completed">Completed</span></p>
      <p>Completed: ${quest.completedAt || "Recorded"}</p>
    `;

    questCard.addEventListener("click", function () {
      showQuestDetails(quest, "Completed");
    });

    completedQuestList.appendChild(questCard);
  });
}

function showQuestDetails(quest, status) {
  questDetailTitle.textContent = quest.title;

  questDetailBox.innerHTML = `
    <h3>${quest.title}</h3>

    <p>
      <strong>Status:</strong>
      ${
        status === "Completed"
          ? `<span class="quest-status-completed">Completed</span>`
          : `<span class="quest-status-active">Active</span>`
      }
    </p>

    <p><strong>Quest Type:</strong> ${quest.type}</p>
    <p><strong>Location:</strong> ${quest.location}</p>
    <p><strong>Contact:</strong> ${quest.contact}</p>

    <div class="objective-box">
      <strong>Objective:</strong>
      <p>${quest.objective}</p>
    </div>

    <p><strong>Description:</strong></p>
    <p>${quest.description}</p>

    <p><strong>Reward:</strong> ${quest.reward}</p>

    ${
      status === "Active"
        ? `<button onclick="completeQuest('${quest.id}')">Mark Quest Completed</button>`
        : `<p><strong>Completion Record:</strong> ${quest.completedAt || "Completed"}</p>`
    }
  `;
}

const startingOriginQuest = {
  id: "origin_hands_of_ash_and_stone",
  title: "Hands of Ash and Stone",
  type: "Origin Quest",
  status: "Active",
  location: "Ashen Crown Outer Ward",
  contact: "Outer Ward Labor Overseer",
  objective: "Go to the Outer Ward labor yard and speak with the Labor Overseer. Accept work hauling stone for the city repairs.",
  description:
    "The lowborn are not remembered by words. They are noticed by labor. The Outer Ward needs stone moved, roads cleared, and broken walls patched. This is your first chance to prove that your hands are worth more than hunger.",
  reward: "+2 Strength, +1 Vitality, 250 gold, +25 Capital Reputation"
};

addQuestIfMissing(startingOriginQuest);
renderJournal();
