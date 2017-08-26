console.log('Loaded!');

var button = document.getElementById('counter');

/*var counter = 0;
button.onclick = function () {
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var counter = request.responseText;
                
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    }
    
    //Make the request
    request.open('GET', 'http://arun22772742.imad.hasura-app.io/counter', true);
    request.send(null);
}*/


var submit = document.getElementById('submit.btn');
var names = [];
submit.onclick = function () {
    
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                console.log('User logged in');
                alert(';ogged in successfully');
            }else if (request.status === 200) {
                alert ('username/password is incorrect');
            }else if (request.status === 500) {
                alert ('something went wrong on the server');
            }
        }
    }
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    alert (username+' '+password);
    
    //Make the request
    request.open('POST', 'http://arun22772742.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify({username:username, password:password}));
};