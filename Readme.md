Ymir 
--- 

Python WSGI middleware for your Express app.


### Why?

While writing a good Python compiler for https://webtask.io / https://goextend.io in Node.JS it became evident that we were either going to waste CPU cycles creating a proxy server or something similar. Looking at bjoern's internals (ugh, the nightmares) showed it was practically using Node.JS's old HTTP parser and an event loop, so at this point, might as well just have it in Node. Good parts are you can seamlessly share Python and Node code, and since it's a single application it's neat!

### Can I use it in production?

Maybe? vOv YMMV.

### Show me the ways!

```javascript
const express = require('express');
const ymir    = require('ymir');
const app     = express();
app.use(ymir.middleware(['path/to/python', 'app_name_exported']));
app.use(ymir.middleware(('python.node').import('foo.bar').some_app));

app.listen(4040);
```

### Or the webtask-ified version

```javascript
const ymir = require('ymir');

// 
module.exports = ymir.load('path.to.file')['appName'];
module.exports = ymir.wsgi('path.to.file:appName');


// or 
module.exports = ymir.execute(`
def app(ctx, cb):
    cb({
        "How to auth": [
            "Get access token", 
            "Call API"
        ]
    })
`).app;

```

### But who likes that, I wanna code in pyyyyythoooonnnnnN!?

FInal goal is to have a compiler that lets you just pass this as a webtask compiler


