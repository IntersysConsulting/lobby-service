const 
  bodyParser = require('body-parser'),
  handler = require("./src/handler"),
  express = require('express'),
  request = require("request"),
  app = express()

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 1000000 }))
// app.use(bodyParser.json({limit: '5mb'}))
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
app.post('/upload', handler.putUpload)

app.get('/log', handler.getLog)
app.use('/images', express.static('images'))
app.get('/personal', handler.personalInit)
app.get('/search', handler.personalSearch)
app.get('/badge', handler.badge)

app.listen(3000, () => {
  console.log('Lobby Service is running at port 3000.')
})
