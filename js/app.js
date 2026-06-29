const existingCharacter = localStorage.getItem("shadowDistrictCharacter");

if (existingCharacter) {
  window.location.href = "home.html";
}
let currentStep = 0;

const character = {
  name: "",
  lineage: "",
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
    title: "The Lowborn Record",
    html: `
      <p>
        In this world, the old nations, temples, trade roads, and noble houses were built before you were born.
        You are not a lord. You are not a citizen. You are not a hero.
      </p>
      <p>
        You are lowborn. Your lineage may shape where your story begins, but your deeds will decide
        whether the world remembers your name.
      </p>
    `
  }
];

const lineageOptions = [
  {
    name: "Caucasian / European",
    description: "Born beneath castles, churches, guild halls, frontier villages, merchant roads, and noble estates.",
    status: "available"
  },
  {
    name: "Asian",
    description: "Born near imperial cities, shrine roads, monasteries, trade ports, disciplined schools, and old dynasties.",
    status: "comingSoon"
  },
  {
    name: "African",
    description: "Born among ancient tribal kingdoms, savanna routes, river settlements, spirit lands, and desert empires.",
    status: "comingSoon"
  },
  {
    name: "Hispanic / South American",
    description: "Born near jungle cities, river villages, coastal routes, old ruins, stone districts, and sacred lands.",
    status: "comingSoon"
  },
  {
    name: "Indian / Indic",
    description: "Born near temple cities, sacred markets, river capitals, mystic academies, and scholarly houses.",
    status: "comingSoon"
  }
];

const ethnicityOptionsByLineage = {
  "Caucasian / European": [
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
  ],

  "Asian": [
    {
      name: "Japanese",
      description: "Born near shrine paths, disciplined houses, sword schools, and island trade ports."
    },
    {
      name: "Korean",
      description: "Born among mountain roads, scholarly courts, fortified towns, and old clan traditions."
    },
    {
      name: "Chinese",
      description: "Born near imperial archives, river cities, old dynasties, engineering halls, and walled capitals."
    },
    {
      name: "Hawaiian",
      description: "Born among island settlements, ocean routes, ancestral chants, and sacred volcanic lands."
    },
    {
      name: "Malaysian",
      description: "Born near jungle ports, spice routes, coastal kingdoms, and merchant waters."
    },
    {
      name: "Filipino",
      description: "Born among island villages, trade docks, storm roads, and resilient family settlements."
    }
  ],

  "African": [
    {
      name: "Savanna Tribal",
      description: "Born among open plains, hunting paths, shield circles, and ancestral fires."
    },
    {
      name: "Desert Nomad",
      description: "Born across dunes, caravan trails, oasis towns, and sun-scorched roads."
    },
    {
      name: "River Kingdom",
      description: "Born beside great rivers, fishing villages, fertile banks, and royal river cities."
    },
    {
      name: "Highland Clan",
      description: "Born in mountain settlements, stone paths, guarded passes, and warrior kinships."
    },
    {
      name: "Forest Spiritborn",
      description: "Born near deep forests, ritual groves, herbal paths, and spirit-touched villages."
    }
  ],

  "Hispanic / South American": [
    {
      name: "Brazilian",
      description: "Born near jungle roads, river towns, coastal cities, music, trade, and survival labor."
    },
    {
      name: "Mexican",
      description: "Born among desert roads, mountain towns, old temples, markets, and frontier settlements."
    },
    {
      name: "Venezuelan",
      description: "Born near coastal routes, river lands, mountain villages, and trade crossroads."
    },
    {
      name: "Spaniard",
      description: "Born under old crowns, ports, churches, sword schools, and merchant houses."
    },
    {
      name: "Andean",
      description: "Born among high mountain settlements, stone roads, old ruins, and harsh climates."
    }
  ],

  "Indian / Indic": [
    {
      name: "Temple-Born",
      description: "Born near sacred temples, priestly halls, incense roads, and ritual service."
    },
    {
      name: "River Scholar",
      description: "Born near river cities, manuscript houses, teachers, and ancient study traditions."
    },
    {
      name: "Desert Trader",
      description: "Born along dry trade roads, caravan houses, markets, and merchant families."
    },
    {
      name: "Mountain Mystic",
      description: "Born near high monasteries, hidden paths, meditation halls, and old teachers."
    },
    {
      name: "Artisan Casteborn",
      description: "Born among craftsmen, metalworkers, weavers, tools, and inherited trade labor."
    }
  ]
};

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
    renderLineageStep();
  } else if (currentStep === 5) {
    renderEthnicityStep();
  } else if (currentStep === 6) {
    renderGenderStep();
  } else if (currentStep === 7) {
    renderOriginStep();
  } else if (currentStep === 8) {
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

function renderLineageStep() {
  screenTitle.textContent = "Choose Your Lineage";

  creationForm.innerHTML = `
    <p>
      Your lineage decides the first civilization, culture, and regional history your lowborn character comes from.
      It does not decide your final destiny.
    </p>

    <div class="choice-grid">
      ${lineageOptions.map(option => `
        <div class="choice-card ${character.lineage === option.name ? "selected" : ""}" data-choice="${option.name}" data-type="lineage">
          <h3>${option.name}</h3>
          <p>${option.description}</p>
          ${option.status === "comingSoon" ? `<p><strong>Available for planning. Full opening story comes later.</strong></p>` : `<p><strong>Opening path ready.</strong></p>`}
        </div>
      `).join("")}
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Next";
  attachChoiceListeners();
}

function renderEthnicityStep() {
  screenTitle.textContent = "Choose Your Ethnicity";

  const ethnicityOptions = ethnicityOptionsByLineage[character.lineage] || [];

  creationForm.innerHTML = `
    <p>
      Your ethnicity gives your character a more specific cultural background inside the broader
      ${character.lineage} lineage.
    </p>

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
    <p>
      Your gender shapes certain dialogue, social assumptions, and story flavor,
      but does not restrict your class path.
    </p>

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
    <p>
      Your origin decides the hardship that shaped you and the first questline you will walk.
    </p>

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

      if (type === "lineage") {
        character.ethnicity = "";
      }

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

  if (currentStep === 4 && character.lineage === "") {
    alert("Choose your lineage before continuing.");
    return false;
  }

  if (currentStep === 5 && character.ethnicity === "") {
    alert("Choose your ethnicity before continuing.");
    return false;
  }

  if (currentStep === 6 && character.gender === "") {
    alert("Choose your gender before continuing.");
    return false;
  }

  if (currentStep === 7 && character.origin === "") {
    alert("Choose your origin before continuing.");
    return false;
  }

  return true;
}

nextBtn.addEventListener("click", function () {
  if (!validateStep()) {
    return;
  }

  if (currentStep === 8) {
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
