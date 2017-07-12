const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

  /* ===============================================================
     CREATE NEW BLOG
  =============================================================== */
  router.post('/newBlog', (req, res) => {
    // Check if blog title was provided
    if (!req.body.title) {
      res.json({
        success: false,
        message: 'El Título del Blog es requerido.'
      }); // Return error message
    } else {
      // Check if blog body was provided
      if (!req.body.body) {
        res.json({
          success: false,
          message: 'El Contenido del Blog es requerido.'
        }); // Return error message
      } else {
        // Check if blog's creator was provided
        if (!req.body.createdBy) {
          res.json({
            success: false,
            message: 'El Creador del Blog es requerido.'
          }); // Return error
        } else {
          // Create the blog object for insertion into database
          const blog = new Blog({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy // CreatedBy field
          });
          // Save blog into database
          blog.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({
                    success: false,
                    message: err.errors.title.message
                  }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({
                      success: false,
                      message: err.errors.body.message
                    }); // Return error message
                  } else {
                    res.json({
                      success: false,
                      message: err
                    }); // Return general error message
                  }
                }
              } else {
                res.json({
                  success: false,
                  message: err
                }); // Return general error message
              }
            } else {
              res.json({
                success: true,
                message: 'Blog creado!'
              }); // Return success message
            }
          });
        }
      }
    }
  });

  router.get('/allBlogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
      if (err) {
        res.json({
          success: false,
          message: err
        });
      } else {
        if (!blogs) {
          res.json({
            success: false,
            message: 'No se encontraron blogs.'
          });
        } else {
          res.json({
            success: true,
            blogs: blogs
          });
        }
      }
    }).sort({
      '_id': -1
    });
  });

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
  router.get('/singleBlog/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No se ha proveido el ID del Blog.'
      }); // Return error message
    } else {
      // Check if the blog id is found in database
      Blog.findOne({
        _id: req.params.id
      }, (err, blog) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({
            success: false,
            message: 'No es un ID válido de Blog'
          }); // Return error message
        } else {
          // Check if blog was found by id
          if (!blog) {
            res.json({
              success: false,
              message: 'No se ha encontrado el Blog'
            }); // Return error message
          } else {
            // Find the current user that is logged in
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({
                  success: false,
                  message: err
                }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Unable to authenticate user'
                  }); // Return error message
                } else {
                  // Check if the user who requested single blog is the one who created it
                  if (user.username !== blog.createdBy) {
                    res.json({
                      success: false,
                      message: 'No estas autorizado para Editar este Blog.'
                    }); // Return authentication reror
                  } else {
                    res.json({
                      success: true,
                      blog: blog
                    }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     UPDATE BLOG POST
  =============================================================== */
  router.put('/updateBlog', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({
        success: false,
        message: 'No se ha proveido el ID del Blog.'
      }); // Return error message
    } else {
      // Check if id exists in database
      Blog.findOne({
        _id: req.body._id
      }, (err, blog) => {
        // Check if id is a valid ID
        if (err) {
          res.json({
            success: false,
            message: 'No es un ID válido de Blog.'
          }); // Return error message
        } else {
          // Check if id was found in the database
          if (!blog) {
            res.json({
              success: false,
              message: 'No se ha encontrado el Blog.'
            }); // Return error message
          } else {
            // Check who user is that is requesting blog update
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({
                  success: false,
                  message: err
                }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Unable to authenticate user.'
                  }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update blog post
                  if (user.username !== blog.createdBy) {
                    res.json({
                      success: false,
                      message: 'No estas autorizado para Editar este Blog.'
                    }); // Return error message
                  } else {
                    blog.title = req.body.title; // Save latest blog title
                    blog.body = req.body.body; // Save latest body
                    blog.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({
                            success: false,
                            message: 'Asegúrese de que el formulario se rellene correctamente.'
                          });
                        } else {
                          res.json({
                            success: false,
                            message: err
                          }); // Return error message
                        }
                      } else {
                        res.json({
                          success: true,
                          message: 'Blog Actualizado!'
                        }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  return router;
};