const fs = require('fs')

const indexPage = async (req, res) => {
   
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./src/index.html').pipe(res)
 
};

module.exports = indexPage;