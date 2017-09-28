const
  { execFile } = require('child_process'),
  getRawBody = require('raw-body'),
  jsonfile = require('jsonfile'), 
  request = require('request'),
  helper = require('./utils'),
  util = require('util'),
  path = require('path'),
  pug = require('pug'),
  fs = require('fs'),
  generateBadge = data => {
    const comPug = pug.compileFile('./templates/badge.pug')
    return comPug(data)
  }

module.exports = {
  personalInit: (req, res) => res.status(200).send(jsonfile.readFileSync('./personal.json')),
  personalSearch: (req, res) => res.status(200).send(jsonfile.readFileSync('./personal.json')),


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

    let visitor = {
          name: req.query.name,
          email: req.query.email,
          host: req.query.host,
          company: req.query.company,
          career: req.query.career,
          image: `http://localhost:3000/images/${req.query.email}.png`
        }


    
    helper.bodyRequestToPngFile(`./images/${visitor.email}.png`, req.body)
      .then( () => helper.renderImageFromHtml(visitor, `./src/${visitor.email}.png`) )
      .then( () => helper.imageToBase64(`./src/${visitor.email}.png`) )
      .then( helper.printImageOnThermalPrinter )
      .then(response => {
        console.log('Wow, such debugging response', response)
        return response
      })
      .then(() => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify({
          status: 'OK'
        }))
      })
      .catch( err => {
        return res.status(500).send()
      })
    
    
    // Saves the user
    let logFile = jsonfile.readFileSync('./log.json')
    logFile.push(visitor)
    jsonfile.writeFileSync('./log.json', logFile)





    // fs.writeFile(`./images/${JSON.parse(req.query.json).email}.png`, req.body, err => {


    //   if (err) {
    //     return res.status(500).send()
    //   }

    //   let logFile = jsonfile.readFileSync('./log.json'),
    //     json = JSON.parse(req.query.json),
    //     currentUser = {
    //       name: json.name,
    //       email: json.email,
    //       host: json.host,
    //       company: json.company,
    //       career: json.career,
    //       image: `http://localhost:3000/images/${json.email}.png`
    //     }
    //   logFile.push(currentUser)
    //   jsonfile.writeFileSync('./log.json', logFile)
    //   /**
    //    * PRINT HERE.
    //    */
    //   let 
    //     html = generateBadge(currentUser), 
    //     lePath = path.resolve(__dirname, './bin/printhtml.exe'),
    //     cmd = `${lePath} url="http://localhost:3000/badge?name=${currentUser.name}&company=${currentUser.company}&image=${currentUser.image}" nopreserve title="" header="" footer=""`
    //   execFile(cmd, (err, stdout, stderr) => {
    //     if (err) {
    //       console.log(err)
    //       return res.status(500).send(JSON.stringify({ status: 'error', error: err }));
    //     }
    //     request({
    //       method: 'POST',
    //       url: process.env.SLACK_URL,
    //       headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //       form: {
    //         token: process.env.SLACK_TOKEN,
    //         channel: process.env.SLACK_CHANNEL,
    //         text: `Hey, ${json.host}! ${json.name} is waiting for you in the lobby!`,
    //         as_user: 'true'
    //       }
    //     }, (error, res, body) => {
    //       if (error) throw new Error(error)
    //       console.log(body)
    //     })

    //     res.status(200).send(JSON.stringify({ status: 'ok' }))
    //   })
    // })
  },


  getLog: (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    status: 'OK'
    res.status(200).send(JSON.stringify({
    }))
  },


  badge: (req, res) => {
    res.status(200).send(generateBadge(req.query))
  }
}