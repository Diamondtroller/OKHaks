import * as stringsLVmodule from "/data/js/stringsLV.js";
export const stringsLV = stringsLVmodule.default;
import * as questsmodule from "/data/js/quests.js";
export const quests = questsmodule.default;
import * as itemsmodule from "/data/js/items.js";
export const items = itemsmodule.default;

export const link = {
  none: 0,
  soft: 1,
  hard: 2 
};

export function hms(s) {
  const hours = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  return `${hours}h ${mins}m ${secs}s`;
}

export function createElementWithAttrs(elTag, attrs) {
  const element = document.createElement(elTag);
  for (const [attrName, attrValue] of attrs) {
    element.setAttribute(attrName, attrValue);
  }
  return element;
}

export function deleteChildren(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

export function makeImage(link) {
  return createElementWithAttrs("img", [[
    "src",
    link,
  ]]);

}

export function makeTitle(title) {
  const element = document.createElement("h3");
  element.textContent = title;
  return element;
}

export function makeItem(id, l) {
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
  const img = makeImage(`https://okeanija.draugiem.lv/html5/i/${icon}.png`);
  const name = document.createTextNode(
    `${stringsLV.ITEMS[id].CAPTION} (#${id})`,
  );
  nameCol.appendChild(name);
  imgCol.appendChild(img);
  tr.appendChild(imgCol);
  tr.appendChild(nameCol);
  item.appendChild(tr);
  if (l === link.hard) {
    const anchor = createElementWithAttrs("a", [
      ["href", `/items/#${id}`]
    ]);
    anchor.appendChild(item);
    return anchor;
  } else if (l === link.soft) {
    const anchor = createElementWithAttrs("a", [
      ["href", `#${id}`],
    ]);
    anchor.onclick = () => navigate(id);
    anchor.appendChild(item);
    return anchor;
  }
  return item;
}

export function makeValueItemTable(values, l) {
  const table = document.createElement("table");
  for (const entry of values.split(",")) {
    const [itemId, value] = entry.split(":");
    const row = document.createElement("tr");
    const valueElement = document.createElement("td");
    valueElement.textContent = value.toString();
    row.appendChild(valueElement);
    const itemElement = document.createElement("td");
    itemElement.appendChild(makeItem(itemId, l));
    row.appendChild(itemElement);
    table.appendChild(row);
  }
  return table;
}


export function makeQuest(id, l) {
  let name, icon;
  if (quests.quests[id] !== undefined) {
    name = stringsLV.QUESTS[id].NAME;
    icon = quests.quests[id].image;
  } else {
    name = "Nav atrasts";
    icon = "misteryTask";
    l = link.none;
  }
  if (icon === undefined) {
    icon = "misteryTask";
  }
  const quest = document.createElement("table");
  const tr = document.createElement("tr");
  const imgCol = document.createElement("td");
  const nameCol = document.createElement("td");
  const img = makeImage(`https://okeanija.draugiem.lv/html5/i/quest_icons/${icon}.png`);
  const nameEl = document.createTextNode(
    `${name} (#${id})`,
  );
  nameCol.appendChild(nameEl);
  imgCol.appendChild(img);
  tr.appendChild(imgCol);
  tr.appendChild(nameCol);
  quest.appendChild(tr);

  if (l === link.hard) {
    const anchor = createElementWithAttrs("a", [
      ["href", `/quests/#${id}`]
    ]);
    anchor.appendChild(quest);
    return anchor;
  } else if (l === link.soft) {
    const anchor = createElementWithAttrs("a", [
      ["href", `#${id}`],
    ]);
    anchor.onclick = () => navigate(id);
    anchor.appendChild(quest);
    return anchor;
  }
  return quest;
}

export function makeQuests(ids, l) {
  const table = document.createElement("table");
  for (const id of ids.split(",")) {
    const row = document.createElement("tr");
    table.appendChild(row);
    const cell = document.createElement("td");
    row.appendChild(cell);
    cell.appendChild(makeQuest(id, l));
  }
  return table;
}

export function navigate(id) {
  location.hash = id;
}
