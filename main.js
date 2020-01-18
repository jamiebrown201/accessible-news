window.addEventListener("load", init);

let currentPage = "default";
let availableProviders = { ft, theguardian };
let currentProvider = catchAll;

async function init() {
  try {
    const pageResult = await getCurrentOrginisation();
    currentPage = pageResult;
    console.log("currentPage", currentPage);
    if (availableProviders[currentPage]) {
      console.log("changing providers", currentProvider);
      currentProvider = availableProviders[currentPage];
    }
  } catch (err) {
    return;
  }
}

function applyStyle({ classes, changingElement }) {
  console.log(changingElement);
  currentProvider[changingElement].elements.forEach(pageClassName => {
    let targetElement = document.querySelector(pageClassName);
    if (!targetElement) {
      chrome.tabs.executeScript(
        {
          code: `var targetElement = document.querySelector(\"${pageClassName}\"); [\"${classes.join(
            '","'
          )}\"].forEach(className => targetElement.classList.add(className));`
        },
        function() {
          console.log("Element clicked !");
        }
      );
    } else {
      classes.forEach(className => targetElement.classList.add(className));
    }
  });
}

function getCurrentOrginisation() {
  return new Promise((resolve, reject) => {
    if (chrome.tabs) {
      chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        tabs => {
          resolve(domainFromUrl(tabs[0].url));
        }
      );
    } else {
      reject(new Error("No url match"));
    }
  });
}

function domainFromUrl(url) {
  var result;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result.split(".")[0];
}
