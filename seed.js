'use strict';

const mongoose = require( 'mongoose' ),
  Subscriber = require( './models/subscriber' ),
  Course = require( './models/course' ),
  User = require( './models/user' );

mongoose.connect( 'mongodb://localhost/confetti_cuisine' );
mongoose.connection;

// COURSES
var courses = [
  {
    title: 'Event Driven Cakes',
    description: 'Event Driven Cakes course description',
    maxStudents: 10,
    cost: 50
  },
  {
    title: 'Asynchronous Artichoke',
    description: 'Asynchronous Artichoke course description',
    maxStudents: 10,
    cost: 25
  }, {
    title: 'Object Oriented Orange Juice',
    description: 'Object Oriented Orange Juice course description',
    maxStudents: 10,
    cost: 10
  }
];

// USERS
var users = [ {
    name: {
      first: 'Jon',
      last: 'Wexler',
    },
    email: 'jon@jonwexler.com',
    zipCode: 10016,
    password: '12345'
  },
  {
    name: {
      first: 'Chef',
      last: 'Eggplant',
    },
    email: 'eggplant@recipeapp.com',
    zipCode: 20331,
    password: '12345'
  },
  {
    name: {
      first: 'Professor',
      last: 'Souffle',
    },
    email: 'souffle@recipeapp.com',
    zipCode: 19103,
    password: '12345'
  }
];

//****************** */
/* COURSES */
//****************** */
let createCourse = ( c, resolve ) => {
  Course.create( {
      title: c.title,
      description: c.description,
      maxStudents: c.maxStudents,
      cost: c.cost
    } )
    .then( sub => {
      console.log( `CREATED COURSE: ${sub.name}` );
      resolve( sub );
    } );
};

courses.reduce( ( promiseChain, next ) => {
  return promiseChain.then( () => new Promise( ( resolve ) => {
    createCourse( next, resolve );
  } ) );
}, Course.remove( {} )
.exec()
.then( () => {
  console.log( 'Course data is empty!' );
} ) );



//****************** */
/* SUBSCRIBERS */
//****************** */
let createSubscriber = ( c, resolve ) => {
  Subscriber.create( {
      name: `${c.name.first} ${c.name.last}`,
      email: c.email,
      zipCode: c.zipCode
    } )
    .then( sub => {
      console.log( `CREATED SUBSCRIBER: ${sub.name}` );
      resolve( sub );
    } );
};

users.reduce( ( promiseChain, next ) => {
    return promiseChain.then( () => new Promise( ( resolve ) => {
      createSubscriber( next, resolve );
    } ) );
  }, Subscriber.remove( {} )
  .exec()
  .then( () => {
    console.log( 'Subscriber data is empty!' );
  } ) );


  
//****************** */
/* USERS */
//****************** */
let registerUser = ( u, resolve ) => {
  User.register( {
      name: {
        first: u.name.first,
        last: u.name.last,
      },
      email: u.email,
      zipCode: u.zipCode,
      password: u.password
    },
    u.password,
    ( error, user ) => {
      console.log( `USER created: ${user.fullName}` );
      resolve( user );
    } );
};

users.reduce( ( promiseChain, next ) => {
      return promiseChain.then( () => new Promise( ( resolve ) => {
        registerUser( next, resolve );
      } ) );
    }, User.remove( {} )
    .exec()
    .then( () => {
      console.log( 'User data is empty!' );
    } ) )
  .then( r => {
    console.log( JSON.stringify( r ) );
    mongoose.connection.close();
  } )
  .catch( error => {
    console.log( `ERROR: ${error}` );
  } );
