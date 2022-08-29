'use strict';

const router = require( 'express' ).Router(),
  coursesController = require( '../controllers/coursesController' ),
  usersController = require("../controllers/usersController");
  
//curl -d "email=jon@jonwexler.com&password=12345" http://localhost:3000/api/login
router.post("/login", usersController.apiAuthenticate)
router.get( '/courses', coursesController.index, coursesController.filterUserCourses, coursesController.respondJSON );
router.get( '/courses/:id/join', coursesController.join, coursesController.respondJSON );
router.use( coursesController.errorJSON );

module.exports = router;
