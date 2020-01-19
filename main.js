window.addEventListener("load", init);

let currentPage = "default";
let availableProviders = { ft, theguardian };
let currentProvider = catchAll;

async function init() {
  try {
    const pageResult = await getCurrentOrginisation();
    currentDomain = pageResult.domain;
    if (availableProviders[currentDomain]) {
      currentProvider = availableProviders[currentDomain];
    }
    if (pageResult.source === "main") {
      await initPage();
    }
  } catch (err) {
    return;
  }
}

async function initPage() {
  const storage = await getStorage();
  console.log("storage", storage);
  Object.keys(storage).forEach(key => {
    if (currentProvider[key]) {
      applyStyle({
        classes: storage[key].classes,
        changingElement: key,
        active: storage[key].active
      });
    }
  });
}

function applyStyle({ classes, changingElement, active }) {
  const customRules = currentProvider[changingElement].customRules;
  currentProvider[changingElement].elements.forEach(pageClassName => {
    let targetElement = document.querySelector(pageClassName);
    if (!targetElement) {
      console.log(customRules);
      chrome.tabs.executeScript(
        {
          code: `var targetElement = document.querySelector(\"${pageClassName}\"); targetElement.setAttribute( "class", Array.from(targetElement.classList) .filter(className => !className.includes("accessibility-news-${changingElement}")) .join(" ") );   if (${active}) { [\"${classes.join(
            '","'
          )}\"].forEach(className => targetElement.classList.add(className))} if (${JSON.stringify(
            customRules
          )}) { ${JSON.stringify(
            customRules
          )}.forEach(({ classIdentifier, classBeingAdded }) => { document .querySelector(classIdentifier) .classList.add(classBeingAdded); }); };`
        },
        function() {
          console.log("Element clicked !");
        }
      );
    } else {
      targetElement.setAttribute(
        "class",
        Array.from(targetElement.classList)
          .filter(
            className =>
              !className.includes(`accessibility-news-${changingElement}`)
          )
          .join(" ")
      );
      if (active) {
        classes.forEach(className => targetElement.classList.add(className));
      }
      if (customRules) {
        customRules.forEach(({ classIdentifier, classBeingAdded }) => {
          document
            .querySelector(classIdentifier)
            .classList.add(classBeingAdded);
        });
      }
    }
  });
}

function getCurrentOrginisation() {
  return new Promise((resolve, reject) => {
    if (chrome.tabs) {
      chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        tabs => {
          resolve({ source: "popup", domain: domainFromUrl(tabs[0].url) });
        }
      );
    } else {
      resolve({ source: "main", domain: domainFromUrl(window.location.host) });
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

function getStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, function(items) {
      resolve(items);
    });
  });
}
