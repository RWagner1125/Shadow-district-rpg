/* ============================================================
   SHADOW DISTRICT RPG - CHARACTER CREATION SCRIPT
   ============================================================

   FILE:
   js/app.js

   PURPOSE:
   This file controls the opening character creation page.

   It handles:
   - redirecting existing characters to home.html
   - story slide progression
   - name entry
   - lineage selection
   - ethnicity selection
   - gender selection
   - origin selection
   - final character summary
   - saving the character to localStorage
   - sending the player to home.html after creation

   IMPORTANT:
   This file works with index.html and css/style.css.

   The visual card theme is mostly controlled by CSS.
   This JavaScript only changes the body class with updateCreationTheme().
   ============================================================ */


/* ============================================================
   EXISTING CHARACTER CHECK
   If the player already created a character in this browser,
   skip character creation and send them to the home page.

   This prevents the deploy link from forcing character creation
   every time the player revisits the website.
   ============================================================ */

const existingCharacter = localStorage.getItem("shadowDistrictCharacter");

if (existingCharacter) {
  window.location.href = "home.html";
}


/* ============================================================
   CHARACTER CREATION STEP TRACKER
   currentStep controls which screen the player sees.

   Step list:
   0 = Opening story slide 1
   1 = Opening story slide 2
   2 = Opening story slide 3
   3 = Name entry
   4 = Lineage selection
   5 = Ethnicity selection
   6 = Gender selection
   7 = Origin selection
   8 = Final summary / Create Character
   ============================================================ */

let currentStep = 0;


/* ============================================================
   CHARACTER OBJECT
   This stores the character choices while the player creates them.

   Later, when the player clicks "Create Character",
   this object is saved into localStorage as:

   shadowDistrictCharacter
   ============================================================ */

const character = {
  name: "",
  lineage: "",
  ethnicity: "",
  gender: "",
  origin: "",
  title: "Lowborn Commoner",
  capital: "Ashen Crown",
  rolePath: "Undecided",

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
    ambition: 0,
    guile: 0,
    bloodguilt: 0
  },

  progress: {
    gold: 100,
    donation: 0,
    jobRank: 1,
    capitalReputation: 0,
    recognizedCitizen: false
  }
};


/* ============================================================
   OPENING STORY SLIDES
   These are the first three text slides before the player
   begins entering character information.

   To add another story slide:
   1. Add another object to this array.
   2. Update renderStep() step numbers if needed.
   ============================================================ */

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


/* ============================================================
   LINEAGE OPTIONS
   These are the broad ancestry/civilization starting paths.

   The player chooses one lineage first.
   Then the ethnicity list changes based on that selected lineage.
   ============================================================ */

const lineageOptions = [
  {
    name: "Caucasian / European",
    description: "Born beneath castles, churches, guild halls, frontier villages, merchant roads, and noble estates.",
    status: "available"
  },
  {
    name: "Asian",
    description: "Born near imperial cities, shrine roads, monasteries, trade ports, disciplined schools, and old dynasties.",
    status: "available"
  },
  {
    name: "African",
    description: "Born among ancient tribal kingdoms, savanna routes, river settlements, spirit lands, and desert empires.",
    status: "available"
  },
  {
    name: "Hispanic / South American",
    description: "Born near jungle cities, river villages, coastal routes, old ruins, stone districts, and sacred lands.",
    status: "available"
  },
  {
    name: "Indian / Indic",
    description: "Born near temple cities, sacred markets, river capitals, mystic academies, and scholarly houses.",
    status: "available"
  }
];


/* ============================================================
   ETHNICITY OPTIONS BY LINEAGE
   These lists appear after the player chooses a lineage.

   To add new ethnicities:
   Find the correct lineage name and add another object with:
   - name
   - description
   ============================================================ */

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


/* ============================================================
   GENDER OPTIONS
   These currently affect story flavor only.
   They do not restrict class paths or stats.
   ============================================================ */

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


/* ============================================================
   ORIGIN OPTIONS
   These decide the player's starting hardship and first questline.

   Later, each origin can trigger:
   - a unique origin quest
   - unique starting skill
   - unique NPC contact
   - small stat reward after completing the origin quest
   ============================================================ */

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


/* ============================================================
   DOM ELEMENT REFERENCES
   These grab the HTML elements from index.html.

   If one of these IDs is changed in index.html,
   it must also be changed here.
   ============================================================ */

const screenTitle = document.getElementById("screenTitle");
const storyText = document.getElementById("storyText");
const creationForm = document.getElementById("creationForm");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");




/* ============================================================
   CREATION THEME UPDATE
   This controls the body class for visual mood progression
   and layout changes.

   Why this matters:
   Different creation screens need different card shapes.

   Step 4 = Lineage selection, needs 5 horizontal cards
   Step 5 = Ethnicity selection, needs 3 by 2 layout
   Step 7 = Origin selection, needs 4 by 2 layout
   Step 8 = Lowborn Record, needs centered summary layout
   ============================================================ */

function updateCreationTheme() {
  document.body.className = `creation-theme step-${currentStep}`;
}


/* ============================================================
   MAIN RENDER FUNCTION
   This function decides which screen to show based on currentStep.

   Every time the player clicks Next or Back,
   renderStep() runs again and refreshes the visible content.
   ============================================================ */

function renderStep() {
  updateCreationTheme();

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


/* ============================================================
   STORY SLIDE RENDERER
   Shows the opening story slides.
   ============================================================ */

function renderStorySlide() {
  const slide = storySlides[currentStep];

  screenTitle.textContent = slide.title;
  storyText.innerHTML = slide.html;

  storyText.classList.remove("hidden");
  nextBtn.textContent = "Next";
}


/* ============================================================
   NAME STEP
   Player types their character name here.
   ============================================================ */

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


/* ============================================================
   LINEAGE STEP
   Player chooses broad ancestry/civilization path.
   ============================================================ */

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
          <p><strong>Opening path ready.</strong></p>
        </div>
      `).join("")}
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Next";
  attachChoiceListeners();
}


/* ============================================================
   ETHNICITY STEP
   Ethnicity options change depending on selected lineage.
   ============================================================ */

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


/* ============================================================
   GENDER STEP
   Player chooses gender.
   Currently story-flavor only.
   ============================================================ */

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


/* ============================================================
   ORIGIN STEP
   Player chooses lowborn origin.
   ============================================================ */

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


/* ============================================================
   SUMMARY STEP
   Final confirmation screen before saving the character.
   ============================================================ */

function renderSummaryStep() {
  screenTitle.textContent = "Lowborn Record";

  creationForm.innerHTML = `
    <div class="summary-box">
      <p><strong>Name:</strong> ${character.name}</p>
      <p><strong>Title:</strong> ${character.title}</p>
      <p><strong>Lineage:</strong> ${character.lineage}</p>
      <p><strong>Ethnicity:</strong> ${character.ethnicity}</p>
      <p><strong>Gender:</strong> ${character.gender}</p>
      <p><strong>Origin:</strong> ${character.origin}</p>
      <p><strong>Capital:</strong> ${character.capital}</p>
      <p><strong>Role Path:</strong> ${character.rolePath}</p>

      <p>
        You are not yet a citizen. You are not yet a class. You are merely a lowborn soul
        standing before the first road of survival.
      </p>
    </div>
  `;

  creationForm.classList.remove("hidden");
  nextBtn.textContent = "Create Character";
}


/* ============================================================
   CHOICE CARD CLICK LISTENERS
   This function is used by lineage, ethnicity, gender, and origin.

   It reads:
   data-type="lineage"
   data-choice="Caucasian / European"

   Then saves that choice to:
   character.lineage
   ============================================================ */

function attachChoiceListeners() {
  const cards = document.querySelectorAll(".choice-card");

  cards.forEach(card => {
    card.addEventListener("click", function () {
      const type = this.dataset.type;
      const choice = this.dataset.choice;

      character[type] = choice;

      /*
        If the player changes lineage after already choosing an ethnicity,
        reset ethnicity so they cannot keep an ethnicity from the wrong lineage.
      */
      if (type === "lineage") {
        character.ethnicity = "";
      }

      cards.forEach(c => c.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
}


/* ============================================================
   VALIDATION
   Stops the player from moving forward without making required choices.
   ============================================================ */

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


/* ============================================================
   NEXT BUTTON EVENT
   Handles moving forward through the creation process.

   On final step:
   - saves character to localStorage
   - creates starter journal if missing
   - redirects to home.html
   ============================================================ */

nextBtn.addEventListener("click", function () {
  if (!validateStep()) {
    return;
  }

  if (currentStep === 8) {
    localStorage.setItem("shadowDistrictCharacter", JSON.stringify(character));

    /*
      Create starter journal storage if it does not exist yet.
      The actual first quest is still added by journal.js when the journal page loads.
    */
    const existingJournal = localStorage.getItem("shadowDistrictJournal");

    if (!existingJournal) {
      localStorage.setItem("shadowDistrictJournal", JSON.stringify({
        activeQuests: [],
        completedQuests: []
      }));
    }

    window.location.href = "home.html";
    return;
  }

  currentStep++;
  renderStep();
});


/* ============================================================
   BACK BUTTON EVENT
   Allows player to move backward through creation steps.
   ============================================================ */

backBtn.addEventListener("click", function () {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
});


/* ============================================================
   INITIAL PAGE LOAD
   Starts the character creation screen at step 0.
   ============================================================ */

renderStep();
