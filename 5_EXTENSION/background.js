// background.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type == "getText") {
    console.log("recieved req from popup to background");
    async function fun() {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTab = tabs[0];
      if (activeTab) {
        try {
          console.log("async function2", activeTab);
          const msg = await chrome.tabs.sendMessage(activeTab.id, {
            type: "requestText",
          });
          console.log("sending response", msg);
          sendResponse({ message: msg.data });

          return true;
        } catch (error) {
          console.log("error catch", error);
          sendResponse({ message: error.toString() });

          return false;
        }
      }
    }

    let ans = await fun();
    console.log("Ans: ", ans);
    if (ans) {
      console.log("YAHA SE RETURN TRUE HO RHA HAI");
      return true;
    }
  }
});

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.type == "getText") {
//     console.log("recieved req from popup to background");
//     (async function fun() {
//       const tabs = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       const activeTab = tabs[0];
//       if (activeTab) {
//         try {
//           console.log("async function2");
//           const msg = await chrome.tabs.sendMessage(activeTab.id, {
//             type: "requestText",
//           });
//           console.log("sending response");
//           sendResponse({ message: msg.data });

//           return true;
//         } catch (error) {
//           console.log("error catch");
//           sendResponse({ message: error.toString() });

//           return false;
//         }
//       }
//     })();
//     console.log("YAHA SE RETURN TRUE HO RHA HAI");
//     return true;
//   }
// });
