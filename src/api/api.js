const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const auth = require('./validate');
const { v4: uuidv4 } = require('uuid');

const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    // origin: 'https://expense-api-y41f.onrender.com', 
    credentials: true
  }));
app.use(cookieParser());

const PORT = process.env.PORT ;
const uri = process.env.DATABASE_URL ;

// app.get('/',validate,async (req,res)=>{
app.get('/',async (req,res)=>{
    const client = await MongoClient.connect(uri);
    const data = await client.db('users').collection('users').find({}).toArray();
    res.status(200);
    res.send(data);
})

// login post
app.post('/login',async (req,res)=>{
    const body = await req.body;
    const client = await MongoClient.connect(uri);
    const data = await client.db('users').collection('users').find({"email":body.email}).toArray();

    
    if(data[0]){
        const validPassword = await bcrypt.compare(body.password,data[0].password );

        if(validPassword){
            const token = jwt.sign({"_id":data[0]._id},process.env.SECRET_KEY);
            const options={
                maxAge: 1000*60*30,
                // httpOnly: true
            };
            // res.cookie('token',token,options);
            res.sendStatus(200);
        }else{
            res.sendStatus(401);
            console.log('wrong password')
        }
    }else{
        res.sendStatus(401);
        console.log("email dosn't exist")
    }
})


// register POST
app.post('/register',async (req,res)=>{
    const salt  = await bcrypt.genSalt(10);
    const body = await req.body;
    const hashPassword = await bcrypt.hash(body.password,salt);

    const client = await MongoClient.connect(uri);
    const registeredEmail = await client.db('users').collection('users').find({"email":body.email}).toArray();
    if(registeredEmail[0] ){
        res.sendStatus(401);
    }else{
        await client.db('users').collection('users').insertOne({
            "firstname":body.firstname,
            "lastname":body.lastname,
            "username":body.username,
            "email":body.email,
            "password":hashPassword
        });
        
        const id = await client.db('users').collection('users').find({"email":body.email}).toArray();

        await client.db('users').collection('expenses').insertOne({
            "id":id[0]._id,
            expenses:[]
        })
        res.sendStatus(200).end();
   }

})

// get user info GET
app.get('/user/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        const decode = jwt.verify(id,process.env.SECRET_KEY);
        const client = await MongoClient.connect(uri);
        const data = await client.db('users').collection('expenses').find({"id":new ObjectId(decode._id)}).toArray();
        res.status(200);
        res.send(data);
    } catch (error) {
        console.log(error)
        res.status(401);
    }
})

// add expense PUT
app.put('/addexpense/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        const decode = jwt.verify(id,process.env.SECRET_KEY);
        const body = req.body;
        const client = await MongoClient.connect(uri);
        const expenseObj = {
            "id":uuidv4(),
            "amount":body.amount,
            "description":body.description,
            "category":body.category,
            "createdAt":new Date(Date.now()),
            "updatedAt":new Date(Date.now())
        };
        const data = await client.db('users').collection('expenses').updateOne({"id":new ObjectId(decode._id)},{$push:{"expenses":expenseObj}})
        res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        res.status(401);
    }
    
})

// delete expense PUT
app.put('/deleteexpense',async (req,res)=>{
    try {
        const id = req.body.encryptedCookieValue;
        const taskid = req.body.taskid;
        const decode = jwt.verify(id,process.env.SECRET_KEY);
        console.log(decode)
        console.log(taskid)
        console.log(req.body)
        const client = await MongoClient.connect(uri);

        await client.db('users').collection('expenses').updateOne({"id":new ObjectId(decode._id)},{$pull:{"expenses":{"id":taskid}}})
        res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        res.status(401);
    }
    
})
app.listen(PORT,()=>{
    console.log(`server started at : http://localhost:${PORT}`);
    
})