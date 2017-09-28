const 
    webshot = require('webshot'),
    pug = require('pug'),
    fs = require('fs'),
    PUG_TEMPLATE_FILE_PATH = './templates/badge.pug',
    URL_TO_PRINTING_SERVICE = 'http://10.1.2.32/printer-helper-net/api/Print',


    bodyRequestToPngFile = (path, body) => new Promise(
        (resolve, reject) => {

            //console.log('Wow, such debugging', body)
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
            try {
                request({
                    method: 'POST',
                    url: URL_TO_PRINTING_SERVICE,
                    headers: { 'content-type': 'application/json' },
                    data: { image64 }
                }, (error, res, body) => {
                    if (error) {
                        return reject(error)
                    }
    
                    resolve(body)
                })
            }
            catch(err) {
                return reject(err)
            }
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
        bodyRequestToPngFile,
        renderImageFromHtml,
        printImageOnThermalPrinter,
        imageToBase64
    }