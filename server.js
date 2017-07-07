console.log('Server.js begin');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const URLTOCON = process.env.URLTOCON;
const port = 80; 
var db;
console.log(URLTOCON);
MongoClient.connect(URLTOCON, (err, database) => {
  if (err) return console.log(err);
  db = database;

  app.listen(port, () => {
    console.log(`listening on ${port}` )
  })

})

app.get('/', ( req , res ) => {
    res.sendFile(`${__dirname}/views/index.html`);
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/node_modules`));
app.use(express.static(`${__dirname}/js`));

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204)
});

app.post('/quotes', (req,res) =>{
    db.collection('quotes').save({name:req.body.name, quote:req.body.quote,ip:req.body.ip},(err,result)=>{
        if(err) return console.log(err);
        console.log('save to database');
        res.redirect('/');

    })
})

app.get("/getvar", function(req, res ){
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.json(result);
    })
});

app.get('/getIp', ( req , res )=>{
     let ip =  
     req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
     res.json({ip:ip});
})

// Create ObjectID
var {ObjectId} = require('mongodb'); // or ObjectID // or var ObjectId = require('mongodb').ObjectId if node version < 6
var safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
// this other way is probably more efficient:
const objectIdRe = /^[0-9a-fA-F]{24}$/;
var safeObjectId = s => objectIdRe.test(s) ? new ObjectId(Buffer.from(s, 'hex')) : null;

// object to Object ID
app.post('/update', (req,res) =>{
    console.log("to update ", req.body._id)
    if(req.body._id != ''){
        db.collection('quotes')
        .update({_id: safeObjectId(req.body._id)}, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
        sort: {_id: -1},
        upsert: true
        }, (err, result) => {
            if (err) return res.send(err)
            console.log('Updated', safeObjectId(req.body._id));
            res.redirect('/');
        })
    }else
        res.redirect('/');

})


app.post('/delete', (req,res) =>{
    console.log("to update ", req.body._id)
    if(req.body._id != ''){
        db.collection('quotes')
        .remove({_id: safeObjectId(req.body._id)}
        , (err, result) => {
            if (err) return res.send(err)
            console.log('Deleted', safeObjectId(req.body._id));
            res.redirect('/');
        })
    }else
        res.redirect('/');
})