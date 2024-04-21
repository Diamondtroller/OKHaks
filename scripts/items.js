"use strict";
const filter = document.getElementById("filter");
const results = document.getElementById("results");
const choice = document.getElementById("choice");
const itemInfo = document.getElementById("itemInfo");

import * as stringsLVmodule from "/data/js/stringsLV.js";
const stringsLV = stringsLVmodule.default;
import * as itemsmodule from "/data/js/items.js";
const items = itemsmodule.default;

function createElementWithAttrs(elTag, attrs) {
  const element = document.createElement(elTag);
  for (const [attrName, attrValue] of attrs) {
    element.setAttribute(attrName, attrValue);
  }
  return element;
}

function deleteChildren(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

function makeTitle(title) {
  const element = document.createElement("h3");
  element.textContent = title;
  return element;
}

function makeItem(id, makeLink) {
  let icon = items.items[id].iconClass;
  if (icon === undefined) {
    icon = "quest_icons/misteryTask";
  } else {
    icon = "item_icons/" + icon;
  }
  const item = document.createElement("table");
  const tr = document.createElement("tr");
  const imgCol = document.createElement("td");
  const nameCol = document.createElement("td");
  const img = createElementWithAttrs("img", [[
    "src",
    `https://okeanija.draugiem.lv/html5/i/${icon}.png`,
  ]]);
  const name = document.createTextNode(
    `${stringsLV.ITEMS[id].CAPTION} (#${id})`,
  );
  nameCol.appendChild(name);
  imgCol.appendChild(img);
  tr.appendChild(imgCol);
  tr.appendChild(nameCol);
  item.appendChild(tr);
  if (makeLink) {
    const anchor = createElementWithAttrs("a", [
      ["id", `a_${id}`],
      ["href", "#"],
      ["data-id", id.toString()],
    ]);
    anchor.appendChild(item);
    anchor.onclick = () => navigate(id);
    return anchor;
  }
  return item;
}

filter.onsubmit = () => {
  const data = new FormData(filter);
  const query = data.get("query").toLowerCase();
  deleteChildren(results);
  for (const [id, n] of Object.entries(stringsLV.ITEMS)) {
    if (
      n.CAPTION.toLowerCase().search(query) !== -1 &&
      items.items[id] !== undefined
    ) {
      const option = createElementWithAttrs("input", [
        ["type", "radio"],
        ["name", "item"],
        ["value", id.toString()],
        ["id", `c_${id}`],
      ]);
      results.appendChild(option);
      const label = createElementWithAttrs("label", [["for", `c_${id}`]]);
      label.textContent = `${n.CAPTION} (#${id})`;
      results.appendChild(label);
      results.appendChild(document.createElement("br"));
    }
  }
};

function load() {
  const url_data = new URLSearchParams(location.search);
  const id = url_data.get("item");

  deleteChildren(itemInfo);

  if (id === null) {
    return;
  }
  if (items.items[id] === undefined) {
    itemInfo.textContent = "Šī lieta netika atrasta!";
    return;
  }

  itemInfo.appendChild(document.createElement("hr"));
  const item = document.createElement("h2");
  item.appendChild(makeItem(id, false));
  itemInfo.appendChild(item);
  itemInfo.appendChild(document.createElement("hr"));

  if (stringsLV.ITEMS[id].NOTE !== "") {
    const note = document.createElement("blockquote");
    note.textContent = stringsLV.ITEMS[id].NOTE;
    itemInfo.appendChild(note);
  }

  itemInfo.appendChild(makeTitle("Vispārīga informācija"));
  function makeRow(label, value, doBorder) {
    if (value !== undefined) {
      const row = document.createElement("tr");
      let labelElement, valueElement;
      if (doBorder) {
        labelElement = createElementWithAttrs("td", [["class", "info"]]);
        valueElement = createElementWithAttrs("td", [["class", "info"]]);
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

  function makeValueItemTable(values) {
    const table = document.createElement("table");
    for (const entry of values.split(",")) {
      const [itemId, value] = entry.split(":");
      const row = document.createElement("tr");
      const valueElement = document.createElement("td");
      valueElement.textContent = value.toString();
      row.appendChild(valueElement);
      const itemElement = document.createElement("td");
      itemElement.appendChild(makeItem(itemId, true));
      row.appendChild(itemElement);
      table.appendChild(row);
    }
    return table;
  }

  const generalInfoRows = [];
  if (items.items[id].level !== undefined) {
    generalInfoRows.push(
      makeRow(
        "Atbloķēšanās līmenis",
        document.createTextNode(items.items[id].level),
        true,
      ),
    );
  }

  const superPrice = items.items[id].superPrice;
  if (superPrice !== "-1" && superPrice !== undefined) {
    const t = document.createElement("table");
    generalInfoRows.push(
      makeRow("Rubīnu cena", makeValueItemTable(`0:${superPrice}`), true),
    );
  }

  const price = items.items[id].price;
  if (price !== "-1" && price !== undefined) {
    generalInfoRows.push(
      makeRow("Veikala cena", makeValueItemTable(items.items[id].price), true),
    );
  }

  const sellPrice = items.items[id].sellPrice;
  if (sellPrice !== "-1" && sellPrice !== undefined) {
    generalInfoRows.push(
      makeRow(
        "Pārdošanas cena",
        makeValueItemTable(items.items[id].sellPrice),
        true,
      ),
    );
  }

  if (items.items[id].lifes !== undefined) {
    generalInfoRows.push(
      makeRow(
        "Darbības reizes",
        document.createTextNode(items.items[id].lifes),
        true,
      ),
    );
  }

  if (items.items[id].transform !== undefined) {
    generalInfoRows.push(
      makeRow("Pārvēršas par", makeItem(items.items[id].transform, true), true),
    );
  }

  itemInfo.appendChild(makeTable(generalInfo, generalInfoRows));

  if (items.items[id].reward !== undefined) {
    itemInfo.appendChild(makeTitle("Lietas apbalvojumu varbūtības"));
    itemInfo.appendChild(makeValueItemTable(items.items[id].reward));
  }

  if (items.items[id].friendReward !== undefined) {
    itemInfo.appendChild(
      makeTitle("Lietas apbalvojumu varbūtības pie draugiem"),
    );
    itemInfo.appendChild(makeValueItemTable(items.items[id].friendReward));
  }

  itemInfo.appendChild(document.createElement("hr"));
  const raw = document.createElement("details");
  const rawLabel = document.createElement("summary");
  rawLabel.textContent = "Skatīt tīros datus";
  raw.appendChild(rawLabel);
  const code = document.createElement("code");
  const text = document.createElement("pre");
  text.textContent = JSON.stringify(items.items[id], null, 2);
  code.appendChild(text);
  raw.appendChild(code);
  itemInfo.appendChild(raw);
}

load();

function navigate(id) {
  const url = new URL(location);
  url.searchParams.set("item", id);
  history.pushState({}, "", url);
  load();
}

choice.onsubmit = () => {
  const data = new FormData(choice);
  const id = data.get("item");
  if (id === null) {
    return;
  }
  navigate(id);
};

window.onpopstate = load;
