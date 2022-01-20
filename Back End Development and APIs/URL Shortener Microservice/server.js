require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const URL = require('url').URL;
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Short URL API
let shortUrls = [];

app
.route('/api/shorturl/:urlid?')
.post(function (req, res) {
  try {
    const rawUrl = req.body.url;
    const url = new URL(rawUrl);
    if (!/http/.test(url.protocol)) {
      throw 'Invalid url';
    }
    if (shortUrls.includes(url.href)) {
      res.json({
        original_url: rawUrl,
        short_url: shortUrls.indexOf(url.href)
      });
    }
    else {
      const urlId = shortUrls.length;
      shortUrls.push(url.href);
      res.json({
        original_url: rawUrl,
        short_url: urlId
      });
      console.log(shortUrls);
    }
  }
  catch {
    res.json({ error: 'invalid url' });
  }
})
.get(function (req, res, next) {
  const urlId = req.params.urlid;
  if (shortUrls[urlId]) {
    res.redirect(shortUrls[urlId]);
  }
  next();
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
