var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one' : {
        title: 'Article One',
        heading: 'Article One',
        date: 'Aug 16th',
        content: `<p>
                    This is paragraph of Article 1
                </p>
                
                <p>
                    This is paragraph of Article 1
                </p>`
    },
    'article-two' : {
        title: 'Article Two',
        heading: 'Article Two',
        date: 'Aug 17th',
        content: `<p>
                    This is paragraph of Article 2
                </p>
                
                <p>
                    This is paragraph of Article 2
                </p>`
    },
    'article-three' : {
        title: 'Article Three',
        heading: 'Article Three',
        date: 'Aug 18th',
        content: `<p>
                    This is paragraph of Article 3
                </p>
                
                <p>
                    This is paragraph of Article 3
                </p>`
    }
};

function createTemplate(data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate = `<html>
        <head>
            <title>${title}</title>
        </head>
        
        <body>
            <div><a href="/">Home</a></div>
            <hr/>
            
            <h3>${heading}</h3>
            
            <div>${date}</div>
            
            <div>
                ${content}
            </div>
        </body>
    </html>`;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleName', function (req, res) {
    res.send(createTemplate(articles[articleName]));
    //res.send('Article one requested will be served here.');
});

app.get('/article-one', function (req, res) {
    res.send(createTemplate(articleOne));
    //res.send('Article one requested will be served here.');
});

app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
  //res.send('Article two requested will be served here.');
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
  //res.send('Article three requested will be served here.');
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
