var http = require("http");
var url = require("url");
var https = require("https");
var cluster = require("cluster");
var fs = require("fs");
const hostname = '127.0.0.1';
const port = 3000;

if (cluster.isMaster) 
{
  var worker = cluster.fork()
}
else
{
  var server = http.createServer((req, res) =>
  {          
    b_url = url.parse(req.url, true);
   
    const Agent = new http.Agent({
      keepAlive: true,
      maxSockets: 1
    });
    
   
    var options = {
      agent: Agent,
      //method: 'GET',
      protocol: b_url.protocol,
      host: b_url.hostname,
      port: b_url.port || 80,
      path: b_url.path || '/', 
      
    }
    
    //console.log(b_url)
    
    if(options.host == "127.0.0.1" && options.port == "3000")
    {
      res.end()
      res.destroy();
    }
    var request = http.request(b_url,(response)=>
    {
       console.log(response.statusCode, "response from", b_url.host); 
    })

    request.on('socket', (socket)=>
     {
      socket.setTimeout(10000);  
      socket.on('timeout',()=>
      {
        //console.log("timeout");
      });
    });
  
    request.on('error', (err)=> 
    {
      //console.log(err);
      request.end();
      request.destroy();     
    }); 
    request.end();
    request.destroy();
   
    request.on("response", (p_res) => 
    {
      res.writeHead(p_res.statusCode, p_res.headers);
      p_res.on("data", (chunck)=>
      {
        res.write(chunck);
      })
      p_res.on('end', ()=>
      {
        res.end(); 
      })  
    })
    
  })
  //server.keepAliveTimeout = (60 * 1000) + 1000;
  //server.headersTimeout = (60 * 1000) + 2000;
  server.listen(port, hostname, () => 
  {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
          
}
