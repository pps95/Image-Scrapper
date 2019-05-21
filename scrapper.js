const express = require("express");
const app = express();
const GoogleImages = require('google-images');
const fs = require('fs');
const request = require('request');

const client = new GoogleImages('005147311550444661650:efay_wx4t4a', 'AIzaSyAcqFzGQd0D6aA_lYUZ_ZOBC972K9crSiA');

app.use(express.static('public'))

app.get("/images/:qs", (req, res) => {
  client.search(req.params.qs)
      .then(images => {

        var img = "";
        var urls = [];
        var names = [];
        var mime = ["image/jpg","image/jpeg","image/png","image/gif",]
          for(var i=0; i<=9; i++){
            if(mime.indexOf(images[i].type) != -1){
              console.log("hi");
              urls.push(images[i].url);
              names.push(req.params.qs + i + "." +(images[i].type).slice(6))
              img = img + "<img src='" + images[i].url + "'/>";
              n++;
            }
          }


// downloded images here ............
          for(var i=0; i<=9; i++){
            download(urls[i],"tmp-images/"+names[i], ()=>{
              console.log(names[i] + "   ...downloaded");
            });
          }

          var download = (uri, filename, callback)=>{
            request.head(uri, (err, res, body) =>{
            request(uri).pipe(fs.createWriteStream(filename).on('close', callback));
            });
          };

        })
      .catch(err => {
        if(err.statusCode == 403){
          res.end("Try next day.  You have exceeded the limit");
        }
        console.log(err)
      });
});

app.listen(3000, () => {
  console.log("SERVERR IS RUNNING !!!");
});
