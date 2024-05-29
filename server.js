   const { createServer } = require('https');
   const { parse } = require('url');
   const next = require('next');
   const fs = require('fs');

   const port = 3303; 
   const dev = process.env.NODE_ENV !== 'production';
   const app = next({ dev });
   const handle = app.getRequestHandler();

   const httpsOptions = {
     key: fs.readFileSync('/data/cert/key.pem'), // 私钥路径
     cert: fs.readFileSync('/data/cert/cert.pem') // 证书路径
   };

   app.prepare().then(() => {
     createServer(httpsOptions, (req, res) => {
       const parsedUrl = parse(req.url, true);
       handle(req, res, parsedUrl);
     }).listen(port, (err) => {
       if (err) throw err;
       console.log(`> Ready on https://localhost:${port}`); 
     });
   });

