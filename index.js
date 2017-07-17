const 
  express = require('express'),
  app = express()

app.use(express.static('app'))

app.listen(process.env.PORT, () => {
  console.log('Welcome App is running.💩')
})
