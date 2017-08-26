var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user: 'arun22772742',
    database: 'arun22772742',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
    //return hashed.toString('hex');
}
app.get('/hash/:input', function (req, res) {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user', function (req, res) {
    //JSON
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');//'this is password encryption';
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES($1, $2)', [username, dbString], function (err, result) {
        if (err) {
            res.status(500).send(err.toString());
        }else {
            res.send('User successfully created ' + username);
        }
    });
});

app.get('/login', function (req, res) {
    var username = req.params.username;
    var password = req.params.password;
    //var username = req.body.username;
    //var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
        if (err) {
            res.status(500).send(err.toString());
        }else {
            if (result.rows.length === 0) {
                res.send('username is invalid');
            }else {res.send('errror3');
                var dbString = result.rows[0].password;
                var salt = dbstring.split('$')[2];
                var hashedPassword = hash(password, salt);
                if (hashedPassword === dbString) {
                    res.send('credentials correct');    
                }else {
                    res.send('password is invalid');
                }
                
            }
        }
    }); 
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
  pool.query('SELECT * FROM test', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      }else {
          res.send(JSON.stringify(result.rows));
      }
  })
});

var counter = 0;
app.get('/counter', function (req, res) {
  counter = counter + 1;
  res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function (req, res) {
  var name = req.query.name;
  
  names.push(name);
  res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
    var articleName = req.params.articleName;
    
    pool.query("SELECT * from article WHERE title = $1", [req.params.articleName], function (err, result) {
       if (err) {
          res.status(500).send(err.toString());
      }else {
          if (result.rows.length === 0) {
              res.status(404).send('Article not found');
          }else {
              articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }
      } 
    });
});

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
            
            <div>${date.toDateString()}</div>
            
            <div>
                ${content}
            </div>
        </body>
    </html>`;
    return htmlTemplate;
}

app.get('/static/:articleName', function (req, res) {
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
    //res.send('Article one requested will be served here.');
});

/*app.get('/article-one', function (req, res) {
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
});*/

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
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
