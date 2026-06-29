let currentStep = 0;

const character = {
  name: "",
  lineage: "Caucasian / European",
  ethnicity: "",
  gender: "",
  origin: ""
};

const storySlides = [
  {
    title: "Created from Ashes and Dust",
    html: `
      <p>
        Created from ashes and from dust, a pitiful creature made among the land built by Gods.
      </p>
      <p>
        Your name is nothing yet. Who even cares?
      </p>
    `
  },
  {
    title: "Born Beneath Foreign Banners",
    html: `
      <p>
        Born beneath the banners of kingdoms you did not own or help create, under laws you did not write,
        and inside an economy built by people who would never remember your name.
      </p>
      <p>
        The nobles inherited land. The elders inherited law. The merchants inherited coin.
        You inherited hunger, dust, and the burden of survival.
      </p>
    `
  },
  {
    title: "The Caucasian / European Lowborn",
    html: `
      <p>
        In the western kingdoms, stone castles rise above muddy villages, church bells echo over fields,
        and guild halls decide who may work, trade, learn, and rise.
      </p>
      <p>
        You were born among farm roads, chapel steps, militia posts, market alleys, and the shadow of noble houses.
        You are not a knight. You are not a lord. You are not even a citizen worth naming.
      </p>
      <p>
        But the old world is cracking, and even a lowborn may find a path through labor, reputation,
        education, and sacrifice.
      </p>
    `
  }
];

const ethnicityOptions = [
  {
    name: "Russian",
    description: "Born near frozen marches, old forts, harsh winters, and iron discipline."
  },
  {
    name: "European",
    description: "Born among old kingdoms, trade roads, guild halls, and noble estates."
  },
  {
    name: "American",
    description: "Born from frontier settlements, mixed trades, survival labor, and restless ambition."
  },
  {
    name: "Netherlandic",
    description: "Born near canals, merchants, shipyards, and disciplined trade houses."
  },
  {
    name: "Polish",
    description: "Born among borderlands, horse roads, village militias, and stubborn survival."
  },
  {
    name: "Germanic",
    description: "Born around workshops, fortress towns, blacksmiths, engineers, and military order."
  }
];

const genderOptions = [
  {
    name: "Male",
    description: "Your body was shaped by hardship, labor, and the expectations of your birth."
  },
  {
    name: "Female",
    description: "Your life was shaped by survival, judgment, labor, and the will to rise."
  }
];

const originOptions = [
  {
    name: "Orphaned Laborer",
    description: "Raised hauling stone, grain, and timber for scraps of food.",
    bonus: "+2 Strength, +1 Vitality after origin quest"
  },
  {
    name: "Debt-Bound Servant",
    description: "Born into debt and forced to serve merchants, nobles, or landowners.",
    bonus: "+2 Intelligence, +1 Dexterity after origin quest"
  },
  {
    name: "Street Survivor",
    description: "Raised in alleys, rooftops, markets, and forgotten corners of the capital.",
    bonus: "+2 Dexterity, hidden Guile growth after origin quest"
  },
  {
    name: "Village Farmhand",
    description: "Raised in fields, animal pens, mills, and rural villages.",
    bonus: "+2 Vitality, +1 Strength after origin quest"
  },
  {
    name: "Temple Ward",
    description: "Raised near chapels, priests, priestesses, shrines, and sacred caretakers.",
    bonus: "+2 Wisdom, +1 Intelligence after origin quest"
  },
  {
    name: "Apprentice Helper",
    description: "Worked beneath a craftsman, scholar, alchemist, scribe, or shop owner.",
    bonus: "+2 Intelligence, +1 Dexterity after origin quest"
  },
  {
    name: "Refugee Child",
    description: "Fled war, famine, plague, invasion, or political collapse.",
    bonus: "+2 Vitality, +1 Dexterity after origin quest"
  },
  {
    name: "Guild Runner",
    description: "Delivered goods, tools, messages, and contracts for a minor guild office.",
    bonus: "+1 Dexterity, +1 Intelligence, +1 Vitality after origin quest"
  }
];

const screenTitle = document.getElementById("screenTitle");
const storyText = document.getElementById("storyText");
const creationForm = document.getElementById("creationForm");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

function renderStep() {
  backBtn.classList.toggle("hidden", currentStep === 0);

  storyText.classList.add("hidden");
  creationForm.classList.add("hidden");

  if (currentStep <= 2) {
    renderStorySlide();
  } else if (currentStep === 3) {
    renderNameStep();
  } else if (currentStep === 4) {
    renderEthnicityStep();
  } else if (currentStep === 5) {
    renderGenderStep();
  } else if (currentStep === 6) {
    renderOriginStep();
  } else if (currentStep === 7) {
    renderSummaryStep();
  }
}

function renderStorySlide() {
  const slide = storySlides[currentStep];

  screenTitle.textContent = slide.title;
  storyText.innerHTML = slide.html;

  storyText.classList.remove("hidden");
  nextBtn.textContent = "Next";
}

function renderNameStep() {
  screenTitle.textContent = "Name the Lowborn";
  creationForm.innerHTML = `
    <div class="form-group">
      <label for="characterName">Your name is:</label>
      <input id="characterName" type="text" placeholder="Enter your character name" value="${character.name}">
    </div>
    <p>
      A name means little in this world until deeds give it weight.
    </p>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Next";
}

function renderEthnicityStep() {
  screenTitle.textContent = "Choose Your Ethnicity";
  creationForm.innerHTML = `
    <p>Your first lineage path begins within the Caucasian / European world.</p>
    <div class="choice-grid">
      ${ethnicityOptions.map(option => `
        <div class="choice-card ${character.ethnicity === option.name ? "selected" : ""}" data-choice="${option.name}" data-type="ethnicity">
          <h3>${option.name}</h3>
          <p>${option.description}</p>
        </div>
      `).join("")}
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Next";
  attachChoiceListeners();
}

function renderGenderStep() {
  screenTitle.textContent = "Choose Your Gender";
  creationForm.innerHTML = `
    <p>Your gender shapes certain dialogue, social assumptions, and story flavor, but does not restrict your class path.</p>
    <div class="choice-grid">
      ${genderOptions.map(option => `
        <div class="choice-card ${character.gender === option.name ? "selected" : ""}" data-choice="${option.name}" data-type="gender">
          <h3>${option.name}</h3>
          <p>${option.description}</p>
        </div>
      `).join("")}
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Next";
  attachChoiceListeners();
}

function renderOriginStep() {
  screenTitle.textContent = "Choose Your Lowborn Origin";
  creationForm.innerHTML = `
    <p>Your origin decides the hardship that shaped you and the first questline you will walk.</p>
    <div class="choice-grid">
      ${originOptions.map(option => `
        <div class="choice-card ${character.origin === option.name ? "selected" : ""}" data-choice="${option.name}" data-type="origin">
          <h3>${option.name}</h3>
          <p>${option.description}</p>
          <p><strong>${option.bonus}</strong></p>
        </div>
      `).join("")}
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Next";
  attachChoiceListeners();
}

function renderSummaryStep() {
  screenTitle.textContent = "Lowborn Record";
  creationForm.innerHTML = `
    <div class="summary-box">
      <p><strong>Name:</strong> ${character.name}</p>
      <p><strong>Lineage:</strong> ${character.lineage}</p>
      <p><strong>Ethnicity:</strong> ${character.ethnicity}</p>
      <p><strong>Gender:</strong> ${character.gender}</p>
      <p><strong>Origin:</strong> ${character.origin}</p>
      <p>
        You are not yet a citizen. You are not yet a class. You are merely a lowborn soul
        standing before the first road of survival.
      </p>
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Create Character";
}

function attachChoiceListeners() {
  const cards = document.querySelectorAll(".choice-card");

  cards.forEach(card => {
    card.addEventListener("click", function () {
      const type = this.dataset.type;
      const choice = this.dataset.choice;

      character[type] = choice;

      cards.forEach(c => c.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
}

function validateStep() {
  if (currentStep === 3) {
    const nameInput = document.getElementById("characterName");
    character.name = nameInput.value.trim();

    if (character.name === "") {
      alert("Your lowborn still needs a name.");
      return false;
    }
  }

  if (currentStep === 4 && character.ethnicity === "") {
    alert("Choose your ethnicity before continuing.");
    return false;
  }

  if (currentStep === 5 && character.gender === "") {
    alert("Choose your gender before continuing.");
    return false;
  }

  if (currentStep === 6 && character.origin === "") {
    alert("Choose your origin before continuing.");
    return false;
  }

  return true;
}

nextBtn.addEventListener("click", function () {
  if (!validateStep()) {
    return;
  }

if (currentStep === 7) {
  localStorage.setItem("shadowDistrictCharacter", JSON.stringify(character));
  window.location.href = "home.html";
  return;
}

  currentStep++;
  renderStep();
});

backBtn.addEventListener("click", function () {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
});

renderStep();
