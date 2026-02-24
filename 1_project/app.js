const express= require('express');
const app= express();
const PORT=4444;
const path=require('path') //path method is provided by the node.js, no need to install it

app.use(express.static(path.join(__dirname,'/static')));

// to get the decoded data as res we need to encode it, hence using this middleware
// general middleware= will run for all the incoming request
app.use(express.urlencoded({extended:true})) //extended for emojis and all


// POST REQUEST USING POSTMAN - kuch data dene ke liye kaam atti h
// it is used to hide the data in the url from the client 
// data is added on the postman, we are taking the data from the post using req.body

// making a database (local)
person=[];

// POST REQUEST
app.post('/add',(req,res)=>{
    const {name, id}= req.body;
    console.log(req.body);
    let p={name, id};
    person.push(p);
    res.send(`new person- ${p.name}`); //this will be sent to the body of the postman only  
})

app.get('/add',(req,res)=>{
    const {id}=req.query;
    let p1;
    for(let i in person){
        if(i.id==id) p1=i.name;
    }
    console.log(person);
    res.send(person[0].name);
})

// -----------------------------------------------------------------------------------

// GET REQUEST
// 1. res.send
// app.get('/',(req,res)=>{
//     res.send("hello world");
// })

// 2. req.query
app.get('/greet',(req,res)=>{
    // console.log(req.query);
    const{name}=req.query
    res.send(`hii after requesting from browser to send name- "${name}" to the server`);
})

// 3.req.params
app.get('/movies/:movie',(req,res)=>{
    const{movie}=req.params;
    res.send(`the data requested using req.params is -${movie}`)
})

// -------------------------------------------------------------------------------------
// 4. res.sendFile

// app.get('/indexFile', (req,res)=>{
//     res.sendFile(path.join(__dirname, '/index.html'));
// })
// app.get('/script.js', (req,res)=>{
//     res.sendFile(path.join(__dirname, '/script.js'));
// })
// app.get('/style.css', (req,res)=>{
//     res.sendFile(path.join(__dirname, '/style.css'));
// })

// APP STARTS A SERVER AND LISTEN TO THE PORT 4444
app.listen(PORT,()=>{
    console.log(`http://localhost:`+PORT);
})


