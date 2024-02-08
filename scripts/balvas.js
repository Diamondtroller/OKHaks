"use strict";
const textBox = document.getElementById("query");
const submitButton = document.getElementById("submit");
const results = document.getElementById("results");
const names = await fetch("../data/stringsLV.json").then((file) => file.json());
const itemInfo = await fetch("../data/items.json").then((file) => file.json());

function makeItem(id) {
  let icon = itemInfo.items[id].iconClass;
  if (icon === undefined) {
    icon = "quest_icons/misteryTask";
  } else {
    icon = "item_icons/"+icon;
  }
  return `<table><tr><td><img src="https://okeanija.draugiem.lv/html5/i/${icon}.png"></td>
<td>${names.ITEMS[id].CAPTION} (#${id})</td></tr></table>`;
}
function makeItemRewardTable(id) {
  let table = [];
  for (const entry of itemInfo.items[id].reward.split(",")) {
    const [rewardId, amount] = entry.split(":")
    table.push(`<tr> <td>${amount}</td> <td>${makeItem(rewardId)}</td> </tr>`);
  }
  return `<table>${table.join("")}</table>`
}

function doSearch() {
  const query = textBox.value.toLowerCase();
  while (results.children.length > 0) {
    results.firstChild.remove();
  }
  for (const [id, n] of Object.entries(names.ITEMS)) {
    if (n.CAPTION.toLowerCase().startsWith(query) &&
    itemInfo.items[id].reward !== undefined) {
      const entry = document.createElement("li");
      entry.innerHTML = `${makeItem(id)} <ul><li>${makeItemRewardTable(id)}</li></ul>`;
      results.appendChild(entry);
    }
  }
  textBox.value = "";
}

textBox.onkeyup = (e) => {
    if (e.key === "Enter") {
      doSearch();
    }
};

submitButton.onclick = doSearch
