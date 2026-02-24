let html=document.getElementById('html')
let css=document.getElementById('css')
let javascript=document.getElementById('javascript')
let clear= document.querySelector('.clear');



const myCodeMirror1 = CodeMirror.fromTextArea((html),{
    lineNumbers:true,
    mode: "htmlmixed"
});
const myCodeMirror2=CodeMirror.fromTextArea((css),{
    mode:"css",
    lineNumbers:true,
});
const myCodeMirror3=CodeMirror.fromTextArea((javascript),{
    mode:"javascript",
    lineNumbers:true,
})


// this function is taking the updated textarea content
function update(){
    
    // the three variables are geting value in in the codemirror textareas
    const htmlval= myCodeMirror1.getValue();
    const cssval=`<style>${myCodeMirror2.getValue()}</style>`
    const jsval=`<script>${myCodeMirror3.getValue()}</script>`

    // we are getting the iframe each time the change is made in the textarea
    let iframe= document.getElementById('iframe');

    const iframeoutput= iframe.contentDocument || iframe.contentWindow.document
    iframeoutput.open();
    iframeoutput.write(htmlval,cssval,jsval);
    iframeoutput.close();

}

function update2(){
    const jstext= myCodeMirror3.getValue();
    let iframe2= document.getElementById('iframe2');

    const iframeoutput2= iframe2.contentDocument || iframe2.contentWindow.document
    iframeoutput2.open();
    iframeoutput2.write(jstext);
    iframeoutput2.close();
}

// event listner
myCodeMirror1.on("change", update)
myCodeMirror2.on("change",update)
myCodeMirror3.on("change", update, update2)


function vanish(){
    htmlval=myCodeMirror1.setValue('');
    cssval=myCodeMirror2.setValue('');
    jsval=myCodeMirror3.setValue('');
}
// clearing the text areas
clear.addEventListener('click',vanish)

console.log(CodeMirror.mimeModes);
console.log(CodeMirror.modes);


