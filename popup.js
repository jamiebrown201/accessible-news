window.addEventListener("load", init);

async function init() {
  await addPrimaryBackgroundColourListeners();
}

async function addPrimaryBackgroundColourListeners() {
  Array.from(document.querySelectorAll(".radio")).forEach(async radio => {
    const color = radio.children[0].id;
    const storage = await getStorage();
    if (storage.primaryBackgroundColor) {
      if (color === storage.primaryBackgroundColor.color) {
        radio.children[0].checked = true;
      }
    }
    radio.addEventListener("click", e => {
      document.getElementById(color).checked;
      changePrimaryBackgroundColor(color);
    });
  });
}

function changePrimaryBackgroundColor(color) {
  chrome.storage.sync.set(
    {
      primaryBackgroundColor: {
        classes: [`${color}`, `accessibility-news-black-font`],
        color
      }
    },
    function() {
      applyStyle({
        classes: [`${color}`, `accessibility-news-black-font`],
        changingElement: "primaryBackgroundColor"
      });
    }
  );
}
