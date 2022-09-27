const http = require('http');
const fs = require('fs')

const server = http.createServer((req, res) => {
    const data = fs.readFileSync('./index.html');
    res.write(data); 

    if (req.method == "GET" || req.method == "POST")
    {
        res.end('Hello world');
    }    
    else
    {
        res.end(' not Hello ');
    }  
}).listen(3001);

