var createError = require('http-errors');
var express = require('express');
const { ApolloServer } = require('apollo-server-express');
const moment = require('moment');

// var path = require('path');
// var cookieParser = require('cookie-parser');
var exjwt = require('express-jwt');
var cors = require('cors')


// Import hidden values from .env
import { PORT, SECRET } from './config';

// Apollo Imports
import Schema from './schema';

/**
 * Import a custom route (non-GraphQL) like so:
 */
// var customRouter = require('./routes/custom');

/**
 * Setup Apollo
 * @param schema: The schema containing the type definitions & resolvers
 * @param context: This is used to pass the decoded JWT object (passed in the header) to the GraphQL functions
 */
const server = new ApolloServer({ 
    schema: Schema,
    context: async ({ req }) => {
      // Gets the decoded jwt object which our exjwt (below) creates for us as req.user
      // Inspiration from: https://www.apollographql.com/blog/setting-up-authentication-and-authorization-with-apollo-federation
      const decodedJWT = req.user || null;
      // const user = await getUserFromToken(token);
      return { decodedJWT };
    }
});

// Initiate express
var app = express();

// Twilio requirements -- Texting API
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


// Apply cors for dev purposes
app.use(cors({
    // Set CORS options here
    // origin: "*"
}))

// Twilio Text
app.get("/send-text",(req,res) => {
  // Get variables, passed via query string
  const { departureLoc, arrivalLoc, departureDate, ownerPhone} = req.query
  
  client.messages
  .create({
     body: 'Your ride from '+departureLoc+' to '+arrivalLoc+' at '+departureDate+' has been deleted.',
    // body:'hahahaha',
     from: process.env.TWILIO_PHONE_NUMBER,
     to: '+'+ownerPhone
   })
  .then(message => console.log(message.sid));
})

// Twilio Text
app.get("/send-text3",(req,res) => {
  // Get variables, passed via query string
  const { departureLoc, arrivalLoc, departureDate, riderPhone} = req.query
  
  client.messages
  .create({
     body: 'Your ride from '+departureLoc+' to '+arrivalLoc+' at '+departureDate+' has been deleted.',
    // body:'hahahaha',
     from: process.env.TWILIO_PHONE_NUMBER,
     to: '+'+riderPhone
   })
  .then(message => console.log(message.sid));
})



// const minute = 56
// const cronJob = require('cron').CronJob;
//   var textJob = new cronJob( `${minute.toString()} 17 * * *`, function(){
//     client.messages.create( { to:'+15163840028', from: process.env.TWILIO_PHONE_NUMBER, body:'hahaha' }, function( err, data ) {});
//   },  null, true);

// Twilio Text
app.get("/send-text2",(req,res) => {
  const { Day_of_week, Hour, Minute, Date_of_month, Month} = req.query

  const cronJob = require('cron').CronJob;
  var textJob = new cronJob( `${Minute.toString()} ${Hour.toString()} ${Date_of_month.toString()} ${Month.toString()} ${Day_of_week.toString()}`, function(){
    client.messages.create( { to:'+15163840028', from:process.env.TWILIO_PHONE_NUMBER, body:'Your carpool ride is about to leave in an hour!' }, function( err, data ) {});
  },  null, true);
  
})

// Add JWT so that it is AVAILABLE; does NOT protect all routes (nor do we want it to)
// Inspiration from: https://www.apollographql.com/blog/setting-up-authentication-and-authorization-with-apollo-federation
app.use(exjwt({
  secret: SECRET, 
  credentialsRequired: false 
}));

// This connects apollo with express
server.applyMiddleware({ app });

// If we have custom routes, we need these to accept JSON input
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// This creates a route to our custom controller OUTSIDE of GraphQL
// app.use('/api/custom', customRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
    res.status(401).send(err);
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

// Need to call httpServer.listen instead of app.listen so that the WebSockets (subscriptions) server runs
app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});