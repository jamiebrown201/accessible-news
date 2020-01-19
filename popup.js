window.addEventListener("load", init);

async function init() {
  const storage = await getStorage();
  addPrimaryBackgroundColourListeners(storage);
  addFontListeners(storage);
  addAudioListeners();
}

function addAudioListeners() {
  const getAudio = document.querySelector(".accessibility-news-get-audio");
  getAudio.addEventListener("click", e => {
    console.log("clicked");
    const audioPlayer = document.querySelector(
      ".accessibility-news-play-audio"
    );
    audioPlayer.classList.remove("accessibility-news-hidden");
  });
}

function addFontListeners(storage) {
  const fonts = document.getElementById("font-selection");

  fonts.addEventListener("change", e => {
    changeFont(e.target.value);
  });

  Array.from(fonts.children).forEach(option => {
    if (storage.font.fontName === option.value) {
      option.selected = true;
    }
  });
}

function addPrimaryBackgroundColourListeners(storage) {
  Array.from(document.querySelectorAll(".radio")).forEach(async radio => {
    const color = radio.children[0].id;
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
  const isActive = color !== "none";
  chrome.storage.sync.set(
    {
      primaryBackgroundColor: {
        classes: [
          `${color}`,
          `accessibility-news-primaryBackgroundColor-black-font`
        ],
        color,
        active: isActive
      }
    },
    function() {
      applyStyle({
        classes: [
          `${color}`,
          `accessibility-news-primaryBackgroundColor-black-font`
        ],
        changingElement: "primaryBackgroundColor",
        active: isActive
      });
    }
  );
}

function changeFont(font) {
  const isActive = font !== "none";
  console.log("isActive", isActive);
  chrome.storage.sync.set(
    {
      font: {
        classes: [`accessibility-news-font-${font}`],
        fontName: font,
        active: isActive
      }
    },
    function() {
      applyStyle({
        classes: [`accessibility-news-font-${font}`],
        changingElement: "font",
        active: isActive
      });
    }
  );
}
