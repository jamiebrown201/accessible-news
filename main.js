window.addEventListener("load", init);

let currentPage = "default";

async function init() {
  try {
    const pageResult = await getCurrentOrginisation();
    currentPage = pageResult;
  } catch (err) {
    return;
  }
}

function applyStyle(color) {}

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
