'use strict'

const fs = require('fs')
const bellows = require('../src/bellows.js')

let base64Data
let binaryData

let options = {
	//use defaults
}

const B = bellows(options)

base64Data  =   B.replace(/^data:image\/png;base64,/, '')
base64Data  +=  base64Data.replace('+', ' ')
binaryData  =   new Buffer(base64Data, 'base64').toString('binary')

fs.writeFile('./example/bellows.png', binaryData, 'binary', (err) => {
	if (err) {
    	console.error(err) // writes out file without error, but it's not a valid image
	}
	console.log('Wrote file ./example/bellows.png')
})

//console.log(B)