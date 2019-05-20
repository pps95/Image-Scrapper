const express = require("express");
const app = express();
const GoogleImages = require('google-images');
const fs = require('fs');
const request = require('request');

const client = new GoogleImages('005147311550444661650:ig_fkb4kzfi', 'AIzaSyBVdBzZ2djtIVGQQN5u7T8ln3CS1ZW-hsw');

app.use(express.static('public'))

app.get("/images/:qs", (req, res) => {
  client.search(req.params.qs)
      .then(images => {
        //var imgData = [];
        var n = 0;
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
          for(var i=0; i<=n; i++){
            download(urls[i],"tmp-images/"+names[i], ()=>{
              console.log(names[i] + "   ...downloaded");
            });
          }

          var download = (uri, filename, callback)=>{
            request.head(uri, (err, res, body) =>{
            request(uri).pipe(fs.createWriteStream(filename).on('close', callback));
            });
          };


          //imgData.push(urls, names, img);
          console.log("done");
          //console.log(imgData.join("======="));

          res.end("<html><head><style>img{height:100px;width:150px;margin:5px}</style></head><body>"+img+"<p>"+urls.join('<br>')+"</p><p>"+n+"</p><p>"+names.join('<br>')+"</p></body></html>");
        })
      .catch(err => {
        if(err.statusCode == 403){
          res.end("Try next day.  You have exceeded the limit");
        }
        console.log(err)
      });
  //res.end("hello");
  //
});

app.listen(3000, () => {
  console.log("SERVERR IS RUNNING !!!");
});
