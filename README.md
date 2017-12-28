<a name="module_bellows"></a>

## bellows
**Example**  
```js
const bellows = require('bellows')
```

* [bellows](#module_bellows)
    * [bellows([options])](#exp_module_bellows--bellows) ⏏
        * [~IN](#module_bellows--bellows..IN)

<a name="exp_module_bellows--bellows"></a>

### bellows([options]) ⏏
Generate bellows pattern for cutting and folding.

**Kind**: Exported function  
**Typicalname:bellows**:   

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | Bellows configuration options |
| [options.dpi] | <code>Integer</code> | DPI of the image |
| [options.pageW] | <code>Integer</code> | Page width in pixels |
| [options.pageH] | <code>Integer</code> | Page height in pixels |
| [options.frontIW] | <code>Integer</code> | Front inner width of bellows in pixels |
| [options.frontOW] | <code>Integer</code> | Front outer width of bellows in pixels |
| [options.frontIH] | <code>Integer</code> | Front inner height of bellows in pixels |
| [options.frontOH] | <code>Integer</code> | Front outer height of bellows in pixels |
| [options.backIW] | <code>Integer</code> | Back inner width of bellows in pixels |
| [options.backOW] | <code>Integer</code> | Back outer width of bellows in pixels |
| [options.backIH] | <code>Integer</code> | Back inner height of bellows in pixels |
| [options.backOH] | <code>Integer</code> | Back outer height of bellows in pixels |
| [options.maxLength] | <code>Integer</code> | Maximum length of bellows in pixels |
| [options.align] | <code>Integer</code> | Vertical alignment adjustment in pixels |
| [options.parts] | <code>Integer</code> | Number of parts to split pattern into: 1, 2, or 4 |
| [options.key] | <code>Boolean</code> | Print key on page |
| [options.overlap] | <code>Boolean</code> | Add overlapping flap between parts returns {String}  Base64 encoded png data |

**Example**  
```js
const b = bellows({ parts : 2 })
console.log(b)
```
<a name="module_bellows--bellows..IN"></a>

#### bellows~IN
Try it out [in the browser](https://sixteenmillimeter.github.io/bellows/).

### Install (node.js)

First, install dependencies required by 
[node-canvas](https://github.com/Automattic/node-canvas) by following 
the [install instructions](https://github.com/Automattic/node-canvas#installation) 
for your OS.

```
git clone https://github.com/sixteenmillimeter/bellows.git
cd bellows
npm install
```

**Kind**: inner constant of [<code>bellows</code>](#exp_module_bellows--bellows)  
