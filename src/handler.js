const
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
    let json = JSON.parse(req.query.json), visitor = {
      name: json.name,
      email: json.email,
      host: json.host,
      company: json.company,
      career: json.career,
      image: `http://localhost:3000/images/${json.email}.png`
    }
    console.log(json)

    helper.bodyRequestToFile(`./images/${visitor.email}.png`, req.body)
      .then( () => helper.renderImageFromHtml(visitor, `./src/${visitor.email}.png`) )
      .then( () => helper.imageToBase64(`./src/${visitor.email}.png`) )
      .then( helper.printImageOnThermalPrinter )
      .then(response => {
        console.log(`Image of visitor '${visitor.name}' sent succesfully to printing service.`)
        return response
      })
      .then(() => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify({
          status: 'OK'
        }))
      })
      .catch( err => {
        console.error(err)
        return res.status(500).send()
      })
    
    
    // Saves the user
    let logFile = jsonfile.readFileSync('./log.json')
    logFile.push(visitor)
    jsonfile.writeFileSync('./log.json', logFile)
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