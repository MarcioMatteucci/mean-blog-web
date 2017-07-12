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

  /* ===============================================================
     DELETE BLOG POST
  =============================================================== */
  router.delete('/deleteBlog/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No se ha proveido el ID del Blog.'
      }); // Return error message
    } else {
      // Check if id is found in database
      Blog.findOne({
        _id: req.params.id
      }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({
            success: false,
            message: 'No es un ID válido de Blog.'
          }); // Return error message
        } else {
          // Check if blog was found in database
          if (!blog) {
            res.json({
              success: false,
              messasge: 'No se ha encontrado el Blog.'
            }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
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
                // Check if user's id was found in database
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Unable to authenticate user.'
                  }); // Return error message
                } else {
                  // Check if user attempting to delete blog is the same user who originally posted the blog
                  if (user.username !== blog.createdBy) {
                    res.json({
                      success: false,
                      message: 'No estas autorizado para Borrar este Blog.'
                    }); // Return error message
                  } else {
                    // Remove the blog from database
                    blog.remove((err) => {
                      if (err) {
                        res.json({
                          success: false,
                          message: err
                        }); // Return error message
                      } else {
                        res.json({
                          success: true,
                          message: 'Blog Eliminado!'
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

  router.put('/likeBlog', (req, res) => {
    if (!req.body.id) {
      res.json({
        success: false,
        message: 'No se ha proveido el ID del Blog.'
      });
    } else {
      Blog.findOne({
        _id: req.body.id
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: 'No es un ID válido de Blog.'
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              messasge: 'No se ha encontrado el Blog.'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'Algo salió mal.'
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'No se pudo autenticar el Usuario.'
                  });
                } else {
                  if (user.username === blog.createdBy) {
                    res.json({
                      success: false,
                      message: 'No puede reaccionar a su propio post.'
                    });
                  } else {
                    if (blog.likedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: 'Ya reaccionó a este post.'
                      });
                    } else {
                      if (blog.dislikedBy.includes(user.username)) {
                        blog.dislikes--;
                        const arrayIndex = blog.dislikedBy.indexOf(user.username);
                        blog.dislikedBy.splice(arrayIndex, 1);
                        blog.likes++;
                        blog.likedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Algo salió mal.'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Blog liked!'
                            });
                          }
                        });
                      } else {
                        blog.likes++;
                        blog.likedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Algo salió mal.'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Blog liked!'
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/dislikeBlog', (req, res) => {
    if (!req.body.id) {
      res.json({
        success: false,
        message: 'No se ha proveido el ID del Blog.'
      });
    } else {
      Blog.findOne({
        _id: req.body.id
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: 'No es un ID válido de Blog.'
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              messasge: 'No se ha encontrado el Blog.'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'Algo salió mal.'
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'No se pudo autenticar el Usuario.'
                  });
                } else {
                  if (user.username === blog.createdBy) {
                    res.json({
                      success: false,
                      message: 'No puede reaccionar a su propio post.'
                    });
                  } else {
                    if (blog.dislikedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: 'Ya reaccionó a este post.'
                      });
                    } else {
                      if (blog.likedBy.includes(user.username)) {
                        blog.likes--;
                        const arrayIndex = blog.likedBy.indexOf(user.username);
                        blog.likedBy.splice(arrayIndex, 1);
                        blog.dislikes++;
                        blog.dislikedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Algo salió mal.'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Blog disliked!'
                            });
                          }
                        });
                      } else {
                        blog.dislikes++;
                        blog.dislikedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Algo salió mal.'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Blog disliked!'
                            });
                          }
                        });
                      }
                    }
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
     COMMENT ON BLOG POST
  =============================================================== */
  router.post('/comment', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); // Return error message
      } else {
        // Use id to search for blog post in database
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid blog id' }); // Return error message
          } else {
            // Check if id matched the id of any blog post in the database
            if (!blog) {
              res.json({ success: false, message: 'Blog not found.' }); // Return error message
            } else {
              // Grab data of user that is logged in
              User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' }); // Return error message
                } else {
                  // Check if user was found in the database
                  if (!user) {
                    res.json({ success: false, message: 'User not found.' }); // Return error message
                  } else {
                    // Add the new comment to the blog post's array
                    blog.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: user.username // Person who commented
                    });
                    // Save blog post
                    blog.save((err) => {
                      // Check if error was found
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
});

  return router;
};