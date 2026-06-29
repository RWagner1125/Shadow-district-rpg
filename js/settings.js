const savedCharacter = JSON.parse(localStorage.getItem("shadowDistrictCharacter"));

if (!savedCharacter) {
  window.location.href = "index.html";
}

const settingsName = document.getElementById("settingsName");
const settingsLineage = document.getElementById("settingsLineage");
const settingsOrigin = document.getElementById("settingsOrigin");
const deleteInput = document.getElementById("deleteConfirmInput");
const deleteButton = document.getElementById("deleteCharacterBtn");
const settingsMessage = document.getElementById("settingsMessage");

settingsName.textContent = savedCharacter.name;
settingsLineage.textContent = savedCharacter.lineage;
settingsOrigin.textContent = savedCharacter.origin;

deleteInput.addEventListener("input", function () {
  if (deleteInput.value === "DELETE") {
    deleteButton.disabled = false;
  } else {
    deleteButton.disabled = true;
  }
});

deleteButton.addEventListener("click", function () {
  if (deleteInput.value !== "DELETE") {
    settingsMessage.textContent = "Deletion cancelled. You must type DELETE exactly.";
    settingsMessage.classList.remove("hidden");
    return;
  }

  localStorage.removeItem("shadowDistrictCharacter");

  settingsMessage.textContent = "Character deleted. Returning to character creation...";
  settingsMessage.classList.remove("hidden");

  setTimeout(function () {
    window.location.href = "index.html";
  }, 1200);
});
