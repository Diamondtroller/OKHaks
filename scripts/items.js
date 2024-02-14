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
  let name;
  if (makeLink) {
    name = createElementWithAttrs("a", [
      ["id", `a_${id}`],
      ["href", "#"],
      ["data-id", id.toString()],
    ]);
    name.textContent = `${stringsLV.ITEMS[id].CAPTION} (#${id})`;
    name.onclick = () => navigate(id);
  } else {
    name = document.createTextNode(`${stringsLV.ITEMS[id].CAPTION} (#${id})`);
  }
  nameCol.appendChild(name);
  imgCol.appendChild(img);
  tr.appendChild(imgCol);
  tr.appendChild(nameCol);
  item.appendChild(tr);
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
  const generalInfo = document.createElement("table");
  
  function makeRow(label, value) {
    if (value !== undefined) {
      const row = document.createElement("tr");
      const labelElement = createElementWithAttrs("td", [["class", "info"]]);
      labelElement.textContent = label;
      row.appendChild(labelElement);
      const valueElement = createElementWithAttrs("td", [["class", "info"]]);
      valueElement.textContent = value;
      row.appendChild(valueElement);
      generalInfo.appendChild(row);
    }
  }

  makeRow("Atbloķēšanās līmenis", items.items[id].level);
  makeRow("Darbības reizes", items.items[id].lifes);
  itemInfo.appendChild(generalInfo);

  if (items.items[id].reward !== undefined) {
    itemInfo.appendChild(makeTitle("Lietas apbalvojumi"));
    const rewards = document.createElement("table");
    for (const entry of items.items[id].reward.split(",")) {
      const [rewardId, amount] = entry.split(":");
      const row = document.createElement("tr");
      const probCol = document.createElement("td");
      probCol.textContent = amount.toString();
      row.appendChild(probCol);
      const itemCol = document.createElement("td");
      itemCol.appendChild(makeItem(rewardId, true));
      row.appendChild(itemCol);
      rewards.appendChild(row);
    }
    itemInfo.appendChild(rewards);
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
