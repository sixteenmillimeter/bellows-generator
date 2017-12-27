'use strict'

/**
 * @module bellows
 * @example
 * const bellows = require('bellows')
 */

const IN = 25.4
const BLACK = '0,0,0,1.0'
const RED = '255,0,0,1.0'
const BLUE = '0,0,255,1.0'

let browser = (typeof module === 'undefined')
let createCanvas

if (!browser) {
    createCanvas = require('canvas').createCanvas
}

function line (ctx, rgba, start, end) {
    ctx.strokeStyle = `rgba(${rgba})`
    ctx.beginPath()
    ctx.moveTo(start[0], start[1])
    ctx.lineTo(end[0], end[1])
    ctx.stroke()
}

function dash (ctx, rgba, dpi, start, end) {
    ctx.strokeStyle = `rgba(${rgba})`
    ctx.setLineDash([(dpi / IN) * 1, (dpi / IN) * 0.5])
    ctx.beginPath()
    ctx.moveTo(start[0], start[1])
    ctx.lineTo(end[0], end[1])
    ctx.stroke()
    ctx.setLineDash([0, 0])
}

function basicShape (ctx, offset, front, back, length) {
    const frontOffset = Math.round((back - front) / 2)
    const X = -back / 2 + offset[0]
    const Y = -length / 2 + offset[1]
    //sides
    line(ctx, BLACK, [X, Y], [X + frontOffset, Y + length])
    line(ctx, BLACK, [X + back, Y], [X + front + frontOffset, Y + length])

    //top+bottom
    line(ctx, BLACK, [X, Y], [X + back, Y])
    line(ctx, BLACK, [X + frontOffset, Y + length], [X + front + frontOffset, Y + length])
}

function taper (back, front, length, pos) {
	const diff = (back - front) / 2
	//0, 0 -> length, diff
	return Math.round((diff / length) * pos)
}

/**
 * @alias module:bellows
 * @typicalname:bellows
 *
 * Generate bellows pattern for cutting and folding.
 *
 * @param {Object} 	[options]			Bellows configuration options
 * @param {Integer} [options.dpi] 		DPI of the image
 * @param {Integer} [options.pageW] 	Page width in pixels
 * @param {Integer} [options.pageH] 	Page height in pixels
 * @param {Integer} [options.frontIW]	Front inner width of bellows in pixels
 * @param {Integer} [options.frontOW]	Front outer width of bellows in pixels
 * @param {Integer} [options.frontIH]	Front inner height of bellows in pixels
 * @param {Integer} [options.frontOH] 	Front outer height of bellows in pixels
 * @param {Integer} [options.backIW] 	Back inner width of bellows in pixels
 * @param {Integer} [options.backOW] 	Back outer width of bellows in pixels
 * @param {Integer} [options.backIH] 	Back inner height of bellows in pixels
 * @param {Integer} [options.backOH] 	Back outer height of bellows in pixels
 * @param {Integer} [options.maxLength]	Maximum length of bellows in pixels
 * @param {Integer} [options.align] 	Vertical alignment adjustment in pixels
 * @param {Integer} [options.parts] 	Number of parts to split pattern into: 1, 2, or 4
 *
 * returns {String}  Base64 encoded png data
 *
 * @example
 * const b = bellows({ parts : 2 })
 * console.log(b)
 */

function bellows (options = {}) {
    let canvas
    let ctx

    let dpi = options.dpi || 300
    const MM = dpi / IN

    let pageW = options.pageW || dpi * 8.5
    let pageH = options.pageH || dpi * 11

    let frontIW = options.frontIW  || Math.round(MM * 40)
    let frontOW = options.frontOW || Math.round(MM * 50)
    let frontIH = options.frontIH || Math.round(MM * 40)
    let frontOH = options.frontOH || Math.round(MM * 50)

    let backIW = options.backIW || Math.round(MM * 40)
    let backOW = options.backOW || Math.round(MM * 50)
    let backIH = options.backIH || Math.round(MM * 40)
    let backOH = options.backOH || Math.round(MM * 50)

    let align = options.align || 0 //adjust the alignment (find formula)

    let maxLength = options.maxLength || MM * 280
    let parts = options.parts || 1

    let centerX = Math.round(pageW / 2)
    let centerY = Math.round(pageH / 2)

    let key = (typeof options.key !== 'undefined' && options.key === false) ? false : true

    let fold = (frontOW - frontIW) / 2
    let folds = Math.floor(maxLength / fold)
    let length = folds * fold

    let angleW
    let angleH

    if (!browser) {
        canvas = createCanvas(pageW, pageH)
    } else {
        canvas = document.createElement('canvas')
        canvas.width = pageW
        canvas.height = pageH
    }

    ctx = canvas.getContext('2d')
    ctx.antialias = 'subpixel'

    //fill background white
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
    ctx.fillRect(0, 0, pageW, pageH)

    //text config
    ctx.fillStyle='rgba(0,0,0,1.0)'
    ctx.font = '24px Arial'; 
    ctx.textAlign= 'start'; 

    function sideW (side) {
        const frontOffset = Math.round((backOW - frontOW) / 2)

        const X = -backOW / 2
        const Y = -length / 2

    	let foldIN = X + ((backOW - backIW) / 2) //inside
    	let foldOUT = X //outside
    	let t
    	let t2

        //sides
        if (side === 1 || parts === 4 || (parts === 2 && side === 3)) {
        	line(ctx, BLACK, [X, Y], [X + frontOffset, Y + length])
        }
        if (parts === 4) {
        	line(ctx, BLACK, [X + backOW, Y], [X + backOW - frontOffset, Y + length])
        }
        //inner
        //line(ctx, BLACK, [X + ((backOW - backIW) / 2), Y], [X + ((backOW - backIW) / 2) + frontOffset, Y + length])
        //line(ctx, BLACK, [X + backOW - ((backOW - backIW) / 2), Y], [X + ((backOW - backIW) / 2) + frontIW + frontOffset, Y + length])
        //top
        line(ctx, BLACK, [X, Y], [X + backOW, Y])
        //bottom
        line(ctx, BLACK, [X + frontOffset, Y + length], [X + frontOW + frontOffset, Y + length])

    	//fold lines
    	for (let i = 1; i < folds; i++) {
            if (i % 2 === 0) {
            	if (backIW !== frontIW) {
            		t = taper(backIW, frontIW, length, i * fold)
            	} else {
            		t = 0
            	}
            	//fold out
                dash(ctx, BLUE, dpi, [foldIN + t, Y + (i * fold)], [foldIN + backIW - t, Y + (i * fold)])
            } else {
            	if (backOW !== frontOW) {
            		t = taper(backOW, frontOW, length, i * fold)
            	} else {
            		t = 0
            	}
            	//fold in
                dash(ctx, RED, dpi, [foldOUT + t, Y + (i * fold)], [foldOUT + backOW - t, Y + (i * fold)])
            }
        }

        //fold corners, left
        for (let i = 0; i < folds; i++) {
        	if (i % 2 === 0) {
        		if (backIW !== frontIW) {
            		t = taper(backIW, frontIW, length, i * fold)
            		t2 = taper(backIW, frontIW, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
        		dash(ctx, BLUE, dpi, [foldIN + t, Y + i * fold ], [foldIN - ((backOW - backIW) / 2) + t2, (Y + (i + 1) * fold) ])
        	} else {
        		if (backIW !== frontIW) {
            		t = taper(backIW, frontIW, length, i * fold)
            		t2 = taper(backIW, frontIW, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
            	dash(ctx, BLUE, dpi, [foldOUT + t, Y + i * fold ], [foldIN + t2, (Y + (i + 1) * fold) ])
        	}
        	//
        }
        //fold corners, right
        for (let i = 0; i < folds; i++) {
        	if (i % 2 === 0) {
        		if (backIW !== frontIW) {
            		t = taper(backIW, frontIW, length, i * fold)
            		t2 = taper(backIW, frontIW, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
        		dash(ctx, BLUE, dpi, [foldIN + backIW - t, Y + i * fold ], [foldOUT + backOW - t2, (Y + (i + 1) * fold) ])
        	} else {
        		if (backIW !== frontIW) {
            		t = taper(backIW, frontIW, length, i * fold)
            		t2 = taper(backIW, frontIW, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
            	dash(ctx, BLUE, dpi, [foldOUT + backOW - t, Y + i * fold ], [foldIN + backIW - t2, (Y + (i + 1) * fold) ])
        	}
        	//
        }
    }
    function sideH (side) {
        const frontOffset = Math.round((backOH - frontOH) / 2)

        const X = -backOH / 2
        const Y = -length / 2

    	let foldIN = X + ((backOH - backIH) / 2) //inside
    	let foldOUT = X //outside
    	let t
    	let t2

        //sides
        if (parts === 4) {
        	line(ctx, BLACK, [X, Y], [X + frontOffset, Y + length])
        }
        if (parts !== 1 || side === 4) {
        	line(ctx, BLACK, [X + backOH, Y], [X + backOH - frontOffset, Y + length])
        }
        //inner
        //line(ctx, BLACK, [X + ((backOH - backIH) / 2), Y], [X + ((backOH - backIH) / 2) + frontOffset, Y + length])
        //line(ctx, BLACK, [X + backOH - ((backOH - backIH) / 2), Y], [X + ((backOH - backIH) / 2) + frontIH + frontOffset, Y + length])

        //top
        line(ctx, BLACK, [X, Y], [X + backOH, Y])
        //bottom
        line(ctx, BLACK, [X + frontOffset, Y + length], [X + frontOH + frontOffset, Y + length])

    	//fold lines
    	for (let i = 1; i < folds; i++) {
            if (i % 2 !== 0) {
            	if (backIH !== frontIH) {
            		t = taper(backIH, frontIH, length, i * fold)
            	} else {
            		t = 0
            	}
            	//fold out
                dash(ctx, BLUE, dpi, [foldIN + t, Y + (i * fold)], [foldIN + backIH - t, Y + (i * fold)])
            } else {
            	if (backOH !== frontOH) {
            		t = taper(backOH, frontOH, length, i * fold)
            	} else {
            		t = 0
            	}
            	//fold in
                dash(ctx, RED, dpi, [foldOUT + t, Y + (i * fold)], [foldOUT + backOH - t, Y + (i * fold)])
            }
        }
        
        //fold corners, left
        for (let i = 0; i < folds; i++) {
        	if (i % 2 !== 0) {
        		if (backIH !== frontIH) {
            		t = taper(backIH, frontIH, length, i * fold)
            		t2 = taper(backIH, frontIH, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
        		dash(ctx, BLUE, dpi, [foldIN + t, Y + i * fold ], [foldIN - ((backOH - backIH) / 2) + t2, (Y + (i + 1) * fold) ])
        	} else {
        		if (backIH !== frontIH) {
            		t = taper(backIH, frontIH, length, i * fold)
            		t2 = taper(backIH, frontIH, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
            	dash(ctx, BLUE, dpi, [foldOUT + t, Y + i * fold ], [foldIN + t2, (Y + (i + 1) * fold) ])
        	}
        	//
        }
        //fold corners, right
        for (let i = 0; i < folds; i++) {
        	if (i % 2 !== 0) {
        		if (backIH !== frontIH) {
            		t = taper(backIH, frontIH, length, i * fold)
            		t2 = taper(backIH, frontIH, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
        		dash(ctx, BLUE, dpi, [foldIN + backIH - t, Y + i * fold ], [foldOUT + backOH - t2, (Y + (i + 1) * fold) ])
        	} else {
        		if (backIH !== frontIH) {
            		t = taper(backIH, frontIH, length, i * fold)
            		t2 = taper(backIH, frontIH, length, (i + 1) * fold)
            	} else {
            		t = 0
            		t2 = 0
            	}
            	dash(ctx, BLUE, dpi, [foldOUT + backOH - t, Y + i * fold ], [foldIN + backIH - t2, (Y + (i + 1) * fold) ])
        	}
        }
    }

    function overlap (side) {
        const frontOffset = Math.round((backOW - frontOW) / 2)

        const X = -backOW / 2
        const Y = -length / 2

    	let foldIN = X + ((backOW - backIW) / 2) //inside
    	let foldOUT = X //outside
    	let t
    	let t2
    }

    if (key) {
	    //key
	    ctx.fillText('Cut lines', dpi / 2, dpi / 2); 
	    line(ctx, BLACK, [dpi / 2, (dpi / 2) + 10], [dpi, (dpi / 2) + 10]);

	    ctx.fillText('Fold away', dpi / 2, (dpi / 2) + (dpi / 6)); 
	    dash(ctx, BLUE, dpi, [dpi / 2, (dpi / 2) + (dpi / 6) + 10], [dpi, (dpi / 2) + (dpi / 6) + 10]);

		ctx.fillText('Fold toward', dpi / 2, (dpi / 2) + (dpi / 3)); 
	    dash(ctx, RED, dpi, [dpi / 2, (dpi / 2) + (dpi / 3) + 10], [dpi, (dpi / 2) + (dpi / 3) + 10]);
	}

    ctx.translate(centerX, centerY)
    angleW = Math.atan( (backOW - frontOW) / length) // / (Math.PI / 180)
    angleH = Math.atan( (backOH - frontOH) / length)

    //SIDES

    ctx.translate(-backOW - (backOH / 2), 0)
    ctx.rotate((angleW + angleH) / 2)
    sideW(1)

    if (parts === 4) {
    	ctx.translate(backOH - backIH + (0.2 * backOW), 0)
    }

    ctx.translate((backOW / 2) + (backOH / 2) - (((backOW - frontIW) + (backOH - frontIH)) / 4), align)
    ctx.rotate((angleW + angleH) / 2)
    sideH(2)
    
    if (parts === 4 || parts === 2) {
    	ctx.translate(backOW - backIW, 0)
    }

    ctx.translate((backOW / 2) + (backOH / 2) - (((backOW - frontIW) + (backOH - frontIH)) / 4), align)
    ctx.rotate((angleW + angleH) / 2)
    sideW(3)

        if (parts === 4) {
    	ctx.translate(backOH - backIH, 0)
    }
    
    ctx.translate((backOW / 2) + (backOH / 2) - (((backOW - frontIW) + (backOH - frontIH)) / 4), align)
    ctx.rotate((angleW + angleH) / 2)
    sideH(4)

    return canvas.toDataURL()
}

if (!browser) {
    module.exports = bellows
}

 /**
  * Try it out [in the browser](https://sixteenmillimeter.github.io/bellows/).
  *
  * ### Install (node.js)
  *
  * First, install dependencies required by 
  * [node-canvas](https://github.com/Automattic/node-canvas) by following 
  * the [install instructions](https://github.com/Automattic/node-canvas#installation) 
  * for your OS.
  *
  *```
  * git clone https://github.com/sixteenmillimeter/bellows.git
  * cd bellows
  * npm install
  *```
  */