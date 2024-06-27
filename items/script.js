"use strict";

import * as c from "./common.js";
const filter = document.getElementById("filter");
const results = document.getElementById("results");
const itemInfo = document.getElementById("itemInfo");

filter.onsubmit = () => {
  const data = new FormData(filter);
  const query = data.get("query").toLowerCase();
  c.deleteChildren(results);
  let count = 0;
  for (const [id, n] of Object.entries(c.stringsLV.ITEMS)) {
    if (
      n.CAPTION.toLowerCase().search(query) !== -1 &&
      c.items.items[id] !== undefined
    ) {
      const option = c.createElementWithAttrs("a", [
        ["href", `#${id}`],
      ]);
      option.textContent = `${n.CAPTION} (#${id})`;
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

  c.deleteChildren(itemInfo);

  const item = c.items.items[id];

  if (item === undefined) {
    itemInfo.textContent = "Šī lieta netika atrasta!";
    return;
  }

  itemInfo.appendChild(document.createElement("hr"));
  const itemEl = document.createElement("h2");
  itemEl.appendChild(c.makeItem(id, c.link.none));
  itemInfo.appendChild(itemEl);
  itemInfo.appendChild(document.createElement("hr"));

  if (c.stringsLV.ITEMS[id].NOTE !== "") {
    const note = document.createElement("blockquote");
    note.textContent = c.stringsLV.ITEMS[id].NOTE;
    itemInfo.appendChild(note);
  }

  itemInfo.appendChild(c.makeTitle("Vispārīga informācija"));
  function makeRow(label, value, doBorder) {
    if (value !== undefined) {
      const row = document.createElement("tr");
      let labelElement, valueElement;
      if (doBorder) {
        labelElement = c.createElementWithAttrs("td", [["class", "info"]]);
        valueElement = c.createElementWithAttrs("td", [["class", "info"]]);
      } else {
        labelElement = document.createElement("td");
        valueElement = document.createElement("td");
      }

      labelElement.textContent = label;
      row.appendChild(labelElement);

      valueElement.appendChild(value);
      row.appendChild(valueElement);
      return row;
    }
  }

  const generalInfo = document.createElement("table");
  function makeTable(table, values) {
    for (const v of values) {
      table.appendChild(v);
    }
    return table;
  }

  const generalInfoRows = [];

  if (item.level !== undefined) {
    generalInfoRows.push(
      makeRow(
        "Atbloķēšanās līmenis",
        document.createTextNode(item.level),
        true,
      ),
    );
  }

  if (item.superPrice !== "-1" && item.superPrice !== undefined) {
    generalInfoRows.push(
      makeRow("Rubīnu cena", c.makeValueItemTable(`0:${item.superPrice}`, c.link.soft), true),
    );
  }

  if (item.price !== "-1" && item.price !== undefined) {
    generalInfoRows.push(
      makeRow("Veikala cena", c.makeValueItemTable(item.price, c.link.soft), true),
    );
  }

  if (item.sellPrice !== "-1" && item.sellPrice !== undefined) {
    generalInfoRows.push(
      makeRow(
        "Pārdošanas cena",
        c.makeValueItemTable(item.sellPrice, c.link.soft),
        true,
      ),
    );
  }

  if (item.lifes !== undefined) {
    generalInfoRows.push(
      makeRow(
        "Darbības reizes",
        document.createTextNode(item.lifes),
        true,
      ),
    );
  }

  if (item.transform !== undefined) {
    generalInfoRows.push(
      makeRow("Pārvēršas par", c.makeItem(item.transform, c.link.soft), true),
    );
  }

  itemInfo.appendChild(makeTable(generalInfo, generalInfoRows));

  if (item.quests !== undefined) {
    itemInfo.appendChild(c.makeTitle("Nepieciešamie uzdevumi"));
    itemInfo.appendChild(c.makeQuests(item.quests, c.link.hard));
  }


  if (item.reward !== undefined) {
    itemInfo.appendChild(c.makeTitle("Lietas apbalvojumu varbūtības"));
    itemInfo.appendChild(c.makeValueItemTable(item.reward, c.link.soft));
  }

  if (item.friendReward !== undefined) {
    itemInfo.appendChild(
      c.makeTitle("Lietas apbalvojumu varbūtības pie draugiem"),
    );
    itemInfo.appendChild(c.makeValueItemTable(item.friendReward, c.link.soft));
  }

  itemInfo.appendChild(document.createElement("hr"));
  const raw = document.createElement("details");
  const rawLabel = document.createElement("summary");
  rawLabel.textContent = "Skatīt tīros datus";
  raw.appendChild(rawLabel);
  const code = document.createElement("code");
  const text = document.createElement("pre");
  text.textContent = JSON.stringify(item, null, 2);
  code.appendChild(text);
  raw.appendChild(code);
  itemInfo.appendChild(raw);
}

load();
window.onhashchange = load;
