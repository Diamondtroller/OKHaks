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
  const element = document.createElement("h2");
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

  if (id === null || items.items[id] === undefined) {
    itemInfo.textContent = "Šī lieta netika atrasta!";
    return;
  }

  itemInfo.appendChild(document.createElement("hr"));
  itemInfo.appendChild(makeItem(id, false));
  itemInfo.appendChild(document.createElement("hr"));

  if (items.items[id].reward !== undefined) {
    itemInfo.appendChild(makeTitle("Lietas apbalvojumu varbūtības"));
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
