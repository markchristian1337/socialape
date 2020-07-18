const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyA21rK2tYBuDit7sVSOIZXc1S6CMIPVOls",
    authDomain: "socialape-c3879.firebaseapp.com",
    databaseURL: "https://socialape-c3879.firebaseio.com",
    projectId: "socialape-c3879",
    storageBucket: "socialape-c3879.appspot.com",
    messagingSenderId: "407597475413",
    appId: "1:407597475413:web:f18e78f2ccb90cbdea16dc",
    measurementId: "G-FHQLMWXCVQ"
  };

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/screams', (req,res) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) =>{
        let screams = [];
        data.forEach((doc) => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount
            });
        });
        return res.json(screams);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json( { error: err.code });
    });
});

//Post one scream
app.post('/scream', (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty'});
    }

    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('screams')
        .add(newScream)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });
});

// Signup route
app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    // TODO: validate data
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ handle: 'this handle is already taken'});
        } else {
            return firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idToken) => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
       console.error(err);
       if(err.code === 'auth/email-already-in-use'){
           return res.status(400).json({ email: 'Email is already in use'});
       } else{
       return res.status(500).json({ error: err.code }); 
       }
    })
});

exports.api = functions.https.onRequest(app);