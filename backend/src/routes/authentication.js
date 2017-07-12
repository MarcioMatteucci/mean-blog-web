const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
  /* ==============
     Register Route
  ============== */
  router.post('/register', (req, res) => {
    // Check if email was provided
    if (!req.body.email) {
      res.json({
        success: false,
        message: 'Debe ingresar un E-mail'
      }); // Return error
    } else {
      // Check if username was provided
      if (!req.body.username) {
        res.json({
          success: false,
          message: 'Debe ingresar un Nombre de Usuario'
        }); // Return error
      } else {
        // Check if password was provided
        if (!req.body.password) {
          res.json({
            success: false,
            message: 'Debe ingresar una Contraseña'
          }); // Return error
        } else {
          // Create new user object and apply user input
          let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
          // Save user to database
          user.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({
                  success: false,
                  message: 'Nombre de Usuario y/o E-mail ya existen'
                }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({
                      success: false,
                      message: err.errors.email.message
                    }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({
                        success: false,
                        message: err.errors.username.message
                      }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({
                          success: false,
                          message: err.errors.password.message
                        }); // Return error
                      } else {
                        res.json({
                          success: false,
                          message: err
                        }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({
                    success: false,
                    message: 'No se pudo registrar el Usuario. Error: ',
                    err
                  }); // Return error if not related to validation
                }
              }
            } else {
              res.json({
                success: true,
                message: 'Usuario Registrado!'
              }); // Return success
            }
          });
        }
      }
    }
  });

  /* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({
        success: false,
        message: 'E-mail no fue proveido'
      }); // Return error
    } else {
      // Search for user's e-mail in database;
      User.findOne({
        email: req.params.email
      }, (err, user) => {
        if (err) {
          res.json({
            success: false,
            message: err
          }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({
              success: false,
              message: 'E-mail ya existe'
            }); // Return as taken e-mail
          } else {
            res.json({
              success: true,
              message: 'E-mail está disponible'
            }); // Return as available e-mail
          }
        }
      });
    }
  });

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  router.get('/checkUsername/:username', (req, res) => {
    // Check if username was provided in paramaters
    if (!req.params.username) {
      res.json({
        success: false,
        message: 'Nombre de Usuario no fue proveido'
      }); // Return error
    } else {
      // Look for username in database
      User.findOne({
        username: req.params.username
      }, (err, user) => {
        // Check if connection error was found
        if (err) {
          res.json({
            success: false,
            message: err
          }); // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({
              success: false,
              message: 'Nombre de Usuario ya existe'
            }); // Return as taken username
          } else {
            res.json({
              success: true,
              message: 'Nombre de Usuario esta disponible'
            }); // Return as vailable username
          }
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    if (!req.body.username) {
      res.json({
        success: false,
        message: 'Nombre de Usuario no fue proveido'
      });
    } else {
      if (!req.body.password) {
        res.json({
          success: false,
          message: 'Contraseña no fue proveida'
        });
      } else {
        User.findOne({
          username: req.body.username.toLowerCase()
        }, (err, user) => {
          if (err) {
            res.json({
              success: false,
              message: err
            });
          } else {
            if (!user) {
              res.json({
                success: false,
                message: 'Usuario y/o Contraseña incorrectos'
              });
            } else {
              const validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {
                res.json({
                  success: false,
                  message: 'Usuario y/o Contraseña incorrectos'
                });
              } else {
                const token = jwt.sign({
                  userId: user._id
                }, config.secret, {
                  expiresIn: '24h'
                });
                res.json({
                  success: true,
                  message: 'Exito!',
                  token: token,
                  user: {
                    username: user.username
                  }
                });
              }
            }
          }
        });
      }
    }
  });

  // Arriba lo que no necesita autorizacion
  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
   router.use((req, res, next) => {
     const token = req.headers['authorization']; // Create token found in headers
     // Check if token was found in headers
     if (!token) {
       res.json({
         success: false,
         message: 'No token provided'
       }); // Return error
     } else {
       // Verify the token is valid
       jwt.verify(token, config.secret, (err, decoded) => {
         // Check if error is expired or invalid
         if (err) {
           res.json({
             success: false,
             message: 'Token invalid: ' + err
           }); // Return error for token validation
         } else {
           req.decoded = decoded; // Create global variable to use in any request beyond
           next(); // Exit middleware
         }
       });
     }
   });
  // Abajo lo que necesita autorizacion

  /* ===============================================================
     Route to get user's profile data
  =============================================================== */
  router.get('/profile', (req, res) => {
    // Search for user in database
    User.findOne({
      _id: req.decoded.userId
    }).select('username email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({
            success: false,
            message: 'User not found'
          }); // Return error, user was not found in db
        } else {
          res.json({
            success: true,
            user: user
          }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

  router.get('/publicProfile/:username', (req, res) =>{
    if (!req.params.username){
      res.json({ success: false, message: 'No se ha proveido Nombre de Usuario.' });
    } else {
      User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
        if (err) {
          res.json({ success: false, message: 'Algo salió mal.' });
        } else {
          if (!user) {
            res.json({ success: false, message: 'No se encontro Nombre de Usuario.' });
          } else {
            res.json({ success: true, user: user });
          }
        }
      });
    }
  });

  return router; // Return router object to main app.js
}