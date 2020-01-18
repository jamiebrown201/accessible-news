window.addEventListener("load", init);

function init() {
  addPrimaryBackgroundColourListeners();
}

function addPrimaryBackgroundColourListeners() {
  Array.from(document.querySelectorAll(".radio")).forEach(function(radio) {
    const color = radio.children[0].id;
    radio.addEventListener("click", e => changePrimaryBackgroundColor(color));
  });
}

function changePrimaryBackgroundColor(color) {
  chrome.storage.sync.set({ primaryBackgroundColor: { color } }, function() {
    applyStyle({
      classes: [`${color}`, `black-font`],
      changingElement: "primaryBackgroundColor"
    });
  });
}
