Ymir 
--- 

Use a python WSGI Middleware in your Express App. Maybe we'll add support for better stuff later


### WHY????

Well bjoern is practically using Node.js' old HTTP parser and an event loop. So... at this point, lets just have it in Node.JS, good parts are you can seamlessly share python and node code and since its a single application its neat! It started while writing a good compiler for https://webtask.io / https://goextend.io in Node.JS it became evident that we were either going to waste CPU Cycles creating a proxy server or or going to do something better, looking at bjoern's internals (Ugh the nightmares) we decided to just use Node. 

### Should I use it in production ?

Maybe? vOv YMMV

### Show me the ways!

```javascript
const express = require('express');
const ymir    = require('ymir');
const app     = express();

app.use(ymir.middleware('path/to/python', 'app_name_exported'));

app.listen(4040);
```