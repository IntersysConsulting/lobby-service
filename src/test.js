const 
    webshot = require('webshot'),
    pug = require('pug')



const
    data = {
        "name": "Medinilla",
        "email": "medinilla@intersysconsulting.com",
        "company": "Intersys Consulting",
        "host": "Edgardo Campus Party",
        "image": "./images/cara-delevingne.jpg"
    },
    comPug = pug.compileFile('./templates/badge.pug')



webshot( comPug(data), './src/hello_world2.png', {siteType:'html'}, function(err) {
    // screenshot now saved to hello_world.png 
    if (err) {
        console.error('Algo chafeó', err)
    }

    console.log('Ya se guardó')
});