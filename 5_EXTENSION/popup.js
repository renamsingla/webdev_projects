// popup.js
const selectedText= document.querySelector('.selected');
console.log("Running popup.js")
const result= chrome.runtime.sendMessage({"type":"getText"})
            .then((msg)=>{
                console.log(msg)
                const ans= msg
                console.log(selectedText)
                selectedText.innerText= ans;
            }).catch((error)=>{
                console.log(error);
            })

