// content.js
function selectedText() {
  const selected = window.getSelection().toString();
  console.log("Here" ,selected);
  if (selected) {
    return selected;
  }
  return "please select the text!";
}

console.log("Running Content");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Request Text", request.type);
  if (request.type == "requestText") {
    sendResponse({
      type: "responseText",
      data: selectedText(),
    });
  }
});