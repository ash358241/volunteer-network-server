const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// console.log(process.env.DB_USER);
const port = process.env.PORT || 5055;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");

  app.get('/events', (req, res) => {
    eventCollection.find({})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post('/addEvent', (req,res) => {
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result);
        res.send(result.insertedCount > 0);
    })
 })

 app.delete('/deleteEvent/:id', (req, res) => {
  const id = ObjectId(req.params.id);
  console.log('deleting event', id);
  eventCollection.findOneAndDelete({_id: id})
  .then(result => res.send(result.deletedCount > 0))
 })
//   client.close();
});


app.listen(process.env.PORT || port)