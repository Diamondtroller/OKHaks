"use strict";

import * as c from "../common.js";
const filter = document.getElementById("filter");
const results = document.getElementById("results");
const questInfo = document.getElementById("questInfo");

filter.onsubmit = () => {
  const data = new FormData(filter);
  const query = data.get("query").toLowerCase();
  c.deleteChildren(results);
  let count = 0;
  for (const [id, n] of Object.entries(c.stringsLV.QUESTS)) {
    if (
      n.NAME.toLowerCase().search(query) !== -1 &&
      c.quests.quests[id] !== undefined
    ) {
      const option = c.createElementWithAttrs("a", [
        ["href", `#${id}`],
      ]);
      option.textContent = `${n.NAME} (#${id})`;
      const item = document.createElement("li");
      item.appendChild(option);
      results.appendChild(item);
      count++;
    }
    if (count > 30) {
      break;
    }
  }
};

function load() {
  const id = location.hash.substring(1);

  if (id === null || id === "") {
    return;
  }

  c.deleteChildren(questInfo);

  if (c.quests.quests[id] === undefined) {
    questInfo.textContent = "Šis uzdevums netika atrasts!";
    return;
  }

  const quest = c.quests.quests[id];

  questInfo.appendChild(document.createElement("hr"));
  const questEl = document.createElement("h2");
  questEl.appendChild(c.makeQuest(id, c.link.none));
  questInfo.appendChild(questEl);
  questInfo.appendChild(document.createElement("hr"));

  const desc = c.stringsLV.QUESTS[id].DESCRIPTION;
  if (desc !== "") {
    const descEl = document.createElement("blockquote");
    descEl.textContent = desc;
    questInfo.appendChild(descEl);
  }

  if (quest.req_quests !== undefined) {
    questInfo.appendChild(c.makeTitle("Nepieciešamais uzdevums"));
    questInfo.appendChild(c.makeQuests(quest.req_quests, c.link.soft));
  }

  if (quest.reward !== undefined && quest.reward !== "") {
    questInfo.appendChild(c.makeTitle("Uzdevumu izpildīšanas apbalvojumi"));
    questInfo.appendChild(c.makeValueItemTable(quest.reward, c.link.hard));
  }

  questInfo.appendChild(document.createElement("hr"));
  const raw = document.createElement("details");
  const rawLabel = document.createElement("summary");
  rawLabel.textContent = "Skatīt tīros datus";
  raw.appendChild(rawLabel);
  const code = document.createElement("code");
  const text = document.createElement("pre");
  text.textContent = JSON.stringify(quest, null, 2);
  code.appendChild(text);
  raw.appendChild(code);
  questInfo.appendChild(raw);
}

load();
window.onhashchange = load;
