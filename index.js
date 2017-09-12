const 
  bodyParser = require('body-parser'),
  handler = require("./handler"),
  express = require('express'),
  request = require("request"),
  app = express()

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
app.use(bodyParser.json({limit: '5mb'}))
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

app.listen(3000, () => {
  console.log('Lobby Service is running.')
})
