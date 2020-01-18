chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: "#3aa757" }, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: "theguardian.com" }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: "ft.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

chrome.extension.getBackgroundPage().console.log("foo0000");

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.extension.getBackgroundPage().console.log("foo");
  if (changeInfo.status == "complete" && tab.active) {
    chrome.extension.getBackgroundPage().console.log("bar");
  }
});
