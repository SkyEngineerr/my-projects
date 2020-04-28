const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const md5 = require("crypto-js/md5");
const axios = require('axios');

let random2 = ''
//Welcome Page
router.get("/", (_req, res) => res.render("welcome"));


//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});


//Keys and encryption for access to Marvel API
const PRIV_KEY = process.env.PRIV_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const ts = new Date().getTime();
const hash = md5(ts.toString() + PRIV_KEY + PUBLIC_KEY).toString();


//Creating random number to getting random character
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Post Search for Dashboard
router.post("/dashboard", (req, res) => {
  
  totalCharacters = 1478;
  characterOffset = getRandomInt(0, totalCharacters);
  
  const url1 = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${req.body.term}&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=100`
  const url2 = `https://gateway.marvel.com/v1/public/characters?&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=1&offset=${characterOffset}`

  if (req.body.method === 'regular') {
    url = url1;
  } else {
    url = url2
  }

  axios.get(url)
    .then(response => {
      res.send(response.data) 
    })
    .catch((error) => {
      console.log(error)
      res.send(error)
    });
})

router.post("/randomComics", (req, res) => {
  axios.get(`https://gateway.marvel.com/v1/public/characters/${req.body.heroid}/comics?format=comic&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=50`)
    .then(response => {
      res.send(response.data)
    }).catch((error) => {
      res.send(error)
       
    });
})

router.post("/btnGroup", (req, res) => {
  axios.get(`https://gateway.marvel.com/v1/public/characters/${req.body.heroid}?&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`)
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.send(error)
    })
})


router.post("/btnGroup2", (req, res) => {
  axios.get(`https://gateway.marvel.com/v1/public/characters/${req.body.heroid}/comics?format=comic&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=50`)
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.send(error)
    })
})


module.exports = router;

