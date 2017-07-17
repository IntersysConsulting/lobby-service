const 
  express = require('express'),
  app = express()

app.use(express.static('app'))

app.listen(3000, () => {
  console.log('Welcome App is running.💩')
})
