window.addEventListener("load", init);

function init() {
  chrome.storage.sync.set({ config: "hello" }, function() {
    console.log("Value is set to " + value);
  });

  console.log("hello", chrome.storage);
  const body = document.querySelector("body");
  body.classList.add("accessible-news-background-color");
}
