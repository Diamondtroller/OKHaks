"use strict";
const textBox = document.getElementById("query");
const submitButton = document.getElementById("submit");
const results = document.getElementById("results");
const choice = document.getElementById("choice");
const itemInfo = document.getElementById("itemInfo");

import * as stringsLVmodule from "/data/js/stringsLV.js";
const stringsLV = stringsLVmodule.default;
import * as itemsmodule from "/data/js/items.js";
const items = itemsmodule.default;

function makeItem(id) {
  let icon = items.items[id].iconClass;
  if (icon === undefined) {
    icon = "quest_icons/misteryTask";
  } else {
    icon = "item_icons/"+icon;
  }
  return `<table><tr>
    <td><img src="https://okeanija.draugiem.lv/html5/i/${icon}.png"></td>
    <td>${stringsLV.ITEMS[id].CAPTION} (#${id})</td>
  </tr></table>`;
}

function makeItemRewardTable(id) {
  let table = [];
  for (const entry of items.items[id].reward.split(",")) {
    const [rewardId, amount] = entry.split(":")
    table.push(`<tr> <td>${amount}</td> <td>${makeItem(rewardId)}</td> </tr>`);
  }
  return `<table>${table.join("")}</table>`
}

function filterItems() {
  const query = textBox.value.toLowerCase();
  while (results.children.length > 0) {
    results.firstChild.remove();
  }
  for (const [id, n] of Object.entries(stringsLV.ITEMS)) {
    if (n.CAPTION.toLowerCase().search(query) !== -1 &&
    items.items[id].reward !== undefined) {
      const option = document.createElement("input");
      for (const [attrName, attrValue] of [
        ["type", "radio"],
        ["name", "item"],
        ["value", id.toString()],
        ["id", id.toString()],
      ]) {
        option.setAttribute(attrName, attrValue);
      }
      results.appendChild(option);
      const label = document.createElement("label");
      label.setAttribute("for", id.toString());
      label.innerHTML = `${n.CAPTION} (#${id})`;
      results.appendChild(label);
      results.appendChild(document.createElement("br"));
    }
  }
  textBox.value = "";
}

textBox.onkeydown = (e) => {
    if (e.key === "Enter") {
      filterItems();
    }
};

submitButton.onclick = filterItems;

choice.onsubmit = () => {
  const data = new FormData(choice);
  const id = data.get("item");
  itemInfo.innerHTML = `<hr />
  ${makeItem(id)}
  <hr />
  <!-- <h2>Vispārīgs info:</h2> -->
  <!-- <table> -->
  <!--   <tr> -->
  <!--     <td>Augšanas laiks:</td> -->
  <!--     <td>${items.ITEMS}</td> -->
  <!--   </tr> -->
  <!-- </table> -->
  <!-- <hr /> -->
  <h2>Lietas apbalvojumu varbūtības:</h2>
  ${makeItemRewardTable(id)}
`;
};
