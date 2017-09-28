const 
    config = require('../config/config'),
    webshot = require('webshot'),
    request = require('request'),    
    pug = require('pug'),
    fs = require('fs'),
    PUG_TEMPLATE_FILE_PATH = './templates/badge.pug',
    URL_TO_PRINTING_SERVICE = process.env.PRINT_ENDPOINT || config.PRINT_ENDPOINT,


    bodyRequestToFile = (path, body) => new Promise(
        (resolve, reject) => {
            fs.writeFile(path, body, err => {
                if (err) {
                    return reject(err)
                }

                resolve()
            })
        }
    ),

    renderImageFromHtml = (data, filePath) => {
        comPug = pug.compileFile(PUG_TEMPLATE_FILE_PATH)
        
        return new Promise( (resolve, reject) => {
            webshot( comPug(data), filePath, { siteType:'html' }, function(err) {
                if (err) {
                    return reject(`File couldn't be rendered or saved: ${err}`)
                }
                
                resolve()
            })
        })
    },

    printImageOnThermalPrinter = (image64) => new Promise(
        (resolve, reject) => {
            request({
                method: 'POST',
                url: URL_TO_PRINTING_SERVICE,
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ image64 })
            }, (error, res, body) => {
                if (error) {
                    return reject(error)
                }

                if (res && res.statusCode !== 200) {
                    return reject( new Error(`HTTP ${res.statusCode}: ${body || 'Something went wrong while trying to send to Print Service.'}`) )
                }

                resolve(body)
            })
        }
    )


    imageToBase64 = filePath => new Promise(
        (resolve, reject) => {
            fs.readFile(filePath, (err, bitmap) => {
                if (err) {
                    return reject(err)
                }

                resolve( new Buffer(bitmap).toString('base64') )
            })
        }
    )

    module.exports = {
        bodyRequestToFile,
        renderImageFromHtml,
        printImageOnThermalPrinter,
        imageToBase64
    }