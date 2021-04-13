const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
require('dotenv').config();

const port = process.env.PORT || 4000;
const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//mongodb
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oor8w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const destinationCollection = client.db(`${process.env.DB_NAME}`).collection("destinations");
    const packagesCollection = client.db(`${process.env.DB_NAME}`).collection("packages");
    const galleryCollection = client.db(`${process.env.DB_NAME}`).collection("gallery");
    const postsCollection = client.db(`${process.env.DB_NAME}`).collection("posts");
    const bookingCollection = client.db(`${process.env.DB_NAME}`).collection("bookings");


    //nodemailer

    app.post('/send_mail', (req, res) => {

        const email = req.body;

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "sarowarhosenakib2@gmail.com", // generated ethereal user
                pass: "SaRowar.@005", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = transporter.sendMail({
            from: 'sarowarhosenakib2@gmail.com', // sender address
            to: `${email.email}`, // list of receivers
            subject: `${email.subject}`, // Subject line
            text: `${email.message}`, // plain text body
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.send(true);
    })

    //post booking
    app.post('/booking', (req, res) => {
        const booking = req.body;
        bookingCollection.insertMany([booking])
            .then(result => {
                if (result.insertedCount > 0) {
                    res.send(true);
                }
            })
    })

    //get destination
    app.get("/destinations", (req, res) => {
        destinationCollection.find({})
            .toArray((err, destination) => {
                res.send(destination)
            })
    })

    //get packagesCollection
    app.get("/packages", (req, res) => {
        packagesCollection.find({})
            .toArray((err, packages) => {
                res.send(packages)
            })
    })

    //get gallery
    app.get('/gallery', (req, res) => {
        galleryCollection.find({})
            .toArray((err, gallery) => {
                res.send(gallery)
            })
    })

    //get posts
    app.get('/posts', (req, res) => {
        postsCollection.find({})
            .toArray((err, posts) => {
                res.send(posts)
            })
    })

});

app.get('/', (req, res) => res.send("Hello world!"));

app.listen(port, () => console.log(`Server is running on ${port}`));