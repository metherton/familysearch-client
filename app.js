var express = require('express'),
    app = express(),
    path = require('path');
    
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', function(req, res){
  res.render('index');
});
app.get('/examples/:example', function(req, res){
  res.render('globals/examples', {
    exampleName: req.params.example
  });
});

var server = app.listen(process.env.PORT || 8080, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});