const
  jsonfile = require("jsonfile"),
  fs = require("fs")

module.exports = {
  stream: (req, res, next) => {
    if (req.headers['content-type'] === 'application/octet-stream') {
      getRawBody(req, {
        length: req.headers['content-length'],
        encoding: this.charset
      }, (err, string) => {
        if (err)
          return next(err)
        req.body = string
        next()
      })
    }
    else {
      next()
    }
  },
  postImage: (req, res) => {
    let logFile = jsonfile.readFileSync('./log.json')
    logFile.push({
      name: req.body.name,
      email: req.body.email,
      host: req.body.host,
      company: req.body.company
    })
    jsonfile.writeFileSync('./log.json', logFile)
    let base64Image = req.body.pdf.split(';base64,').pop()
    res.setHeader('Content-Type', 'application/json')
    fs.writeFile(`./data/pdf/${req.body.email}.pdf`,
      base64Image, { encoding: 'base64' }, err => {
        if (err) {
          return res.status(500).send(JSON.stringify({
            status: 'error',
            error: err
          }))
        }
        console.log('File created!')
        res.status(200).send(JSON.stringify({
          status: 'OK',
          url: `pdf/${req.body.email}.pdf`
        }))
      })
  },
  putUpload: (req, res) => {
    fs.writeFile('./image.png', req.body, err => {
      if (err)
        return res.status(500).send()
      let logFile = jsonfile.readFileSync('./log.json'),
        json = JSON.parse(req.query.json)
      logFile.push({
        name: json.name,
        email: json.email,
        host: json.host,
        company: json.company,
        career: json.career
      })
      jsonfile.writeFileSync('./log.json', logFile)
      /**
       * PRINT HERE.
       */

      let opts = {
        method: 'POST',
        url: process.env.SLACK_URL,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          token: process.env.SLACK_TOKEN,
          channel: process.env.SLACK_CHANNEL,
          text: `Hey, ${json.host}! ${json.name} is waiting for you in the lobby!`,
          as_user: 'true'
        }
      }

      request(opts, (error, res, body) => {
        if (error) throw new Error(error)
        console.log(body)
      })

      res.status(200).send(JSON.stringify({ status: 'ok' }))
    })
  },
  getLog: (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify({
      status: 'OK'
    }))
  }
}