//Global variable declaration
httpPort = 3000;

// Requires 
var http = require('http');
let url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


//Instantite server
var httpServer = http.createServer((request,response)=>{
    doServerLogic(request,response);
});

// Tell the server to listen por incoming requeests
httpServer.listen(httpPort, ()=>{
    console.log('Server is listening on port '+ httpPort)
});


//Handle the server logic
let doServerLogic = (request, response) =>{
    //Get query strings
    //The second argument is to make the parsing method use string sanitization procedures
        let parsedUrl = url.parse(request.url,true);

    // Get the path
        let path = parsedUrl.pathname;
    
    //Trim the path variable to remove useless slashes
        let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //Get the method
        let method = request.method.toLowerCase();



    //Fetch the payload
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    request.on('data', (data)=>{
        //Apend to the buffer each time we recive a new data piece
        buffer +=decoder.write(data);
    });

    //When the request ends, send response

    request.on('end',()=>{
        buffer+=decoder.end();

        //Choose handler for this request.... Only /hello handler is admited
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        ////////////// NOTE //////////////
        // The asingment says that the method must me 'post'
        //  '' When someone POSTS anything to the route /hello.....'' 
        //  THerefore we are only going to respond in case the method equals post
        chosenHandler = method=='post' ? chosenHandler : handlers.invalidMethod;

        chosenHandler({},(statusCode,payload)=>{
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            let payloadString = JSON.stringify(payload);

            response.setHeader('Content-Type','application/json');

            response.writeHead(statusCode);

            response.end(payloadString);

            console.log(chosenHandler);
        })

    });

    


};



//Request Handlers
let handlers = {};

handlers.hello=(data,callback) => {
    callback(200, {'message' : 'Hello user :) '});
};

handlers.notFound = (data,callback) => {
    callback(404, {'message' : 'Route not found '})
};


handlers.invalidMethod = (data,callback) => {
    callback(404, {'message' : 'This api only accepts post requests'})
};


let router = {
    'hello'  : handlers.hello
};
