const 
  bodyParser = require('body-parser'),
  handler = require("./src/handler"),
  express = require('express'),
  request = require("request"),
  config = require('./config/config'),  
  app = express(),
  PORT = process.env.PORT || config.PORT


app.use(bodyParser.urlencoded({ limit: '500mb', extended: false, limit: 500*1024*1024*1024}))
//app.use(bodyParser.json({limit: '5mb'}))
app.use(express.static('app'))

app.use(handler.stream)

app.post('/image', handler.postImage)

/**
 * This route is used to recieve the image from the application.
 * The path is:
 *
 *   PUT: /upload
 *
 * You should send the image from the client as a buffer.
 * 
 */
app.put('/upload', handler.putUpload)

app.get('/log', handler.getLog)
app.use('/images', express.static('images'))
app.get('/personal', handler.personalInit)
app.get('/search', handler.personalSearch)
app.get('/badge', handler.badge)

app.listen(PORT, () => {
  console.log(`Lobby Service is running at port ${PORT}.`)
})
