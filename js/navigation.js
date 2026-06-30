/* ============================================================
   ASHES & DUST - UNIVERSAL SIDE NAVIGATION
   ============================================================

   FILE:
   js/navigation.js

   PURPOSE:
   This creates one shared menu for every page.

   Any page that loads this file gets the same menu:
   - Home
   - Character
   - Journal
   - Settings
   - Future pages like Combat, Jobs, Market, Guild, etc.

   This prevents us from updating every HTML file manually.
   ============================================================ */


function createUniversalNavigation() {
  const existingNav = document.getElementById("universalSideNav");

  if (existingNav) {
    return;
  }

  const nav = document.createElement("aside");
  nav.id = "universalSideNav";
  nav.className = "universal-side-nav";

  nav.innerHTML = `
    <div class="side-nav-title">
      <h2>Ashes & Dust</h2>
      <p>Player Menu</p>
    </div>

    <div class="side-nav-section">
      <h3>Main</h3>
      <a href="./home.html">Home</a>
      <a href="./character.html">Character</a>
      <a href="./journal.html">Journal</a>
      <a href="./settings.html">Settings</a>
    </div>

    <div class="side-nav-section">
      <h3>World</h3>
      <a href="#">Capital</a>
      <a href="#">Town</a>
      <a href="#">World</a>
      <a href="#">Market</a>
    </div>

    <div class="side-nav-section">
      <h3>Growth</h3>
      <a href="#">Jobs</a>
      <a href="#">Education</a>
      <a href="#">Guild</a>
      <a href="#">Training</a>
    </div>

    <div class="side-nav-section">
      <h3>Combat</h3>
      <a href="./combat.html">Combat</a>
      <a href="#">Arena</a>
      <a href="#">Missions</a>
      <a href="#">Dungeon</a>
    </div>
  `;

  document.body.prepend(nav);
}


createUniversalNavigation();
