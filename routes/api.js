const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Usuarios
/**
 * @swagger
 * /usuarios:
 *  get:
 *    description: Use to request all usuarios
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/user', (req, res) => {
  ref = req.query.q;
  const results = {}

  mysqlConnection.query('SELECT name, age, email, address FROM users', (err, rows, fields) => {
    results.status = 'success';
    results.data = rows;
    results.msg = '';
    //results.totalrows = rows.length; 

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });  
});

// GET all Usuarios
/**
 * @swagger
 * /usuarios:
 *  get:
 *    description: Use to request all usuarios
 *    responses:
 *      '200':
 *        description: A successful response
 */
 router.get('/user/search', (req, res) => {
  mysqlConnection.query('SELECT * FROM usuario', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Usuario
/**
 * @swagger
*  /usuarios/{id_usuario}:
*    get:
*      tags:
*      - usuario
*      summary: Find usuario by ID
*      description: Returns a single usuario
*      operationId: getUsuarios
*      produces:
*      - application/json
*      parameters:
*      - name: id_usuario
*        in: path
*        description: ID of usuario to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: usuario not found
*      security:
*      - api_key: []
*/
router.get('/user/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM usuario WHERE id_usuario = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Usuario
/**
 * @swagger
*  /usuarios/{id_usuario}:
*    delete:
*      tags:
*      - usuario
*      summary: Deletes an usuario
*      operationId: delUsuario
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: usuarioId
*        in: path
*        description: Usuario id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Usuario not found
*      security:
*      - usuariostore_auth:
*        - write:usuarios
*        - read:usuarios
*/
router.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM usuario WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Usuario Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Usuario
/**
* @swagger
*  /usuarios/{usuario}:
*   post:
*      tags:
*      - usuario
*      summary: Updates a usuario in the store with form data
*      operationId: updateUsuarioWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: usuario
*        in: path
*        description: ID of usuario that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the usuario
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the usuario
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - usuariostore_auth:
*        - write:usuarios
*        - read:usuarios
*/
router.post('/user/register', (req, res) => {
  const {email} = req.body;
  //console.log(id_usuario, usuario);
  let exists = false;
  mysqlConnection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({ status: "failed", data: {}, msg: "User Already Exists" });
      exists = true;
    } 
  });

  if(!exists) {
    const query = `INSERT INTO users SET ?;`;
    let post = {
      name: req.body.name, 
      age: req.body.age, 
      email: req.body.email, 
      address: req.body.adress, 
      password: req.body.password
    }
    mysqlConnection.query(query, [post], (err, rows, fields) => {
      if(!err) {
        res.status(201).json({ status: "success", data: req.body, msg: "" });
      } else {
        res.json({error: err});
      }
    });
  }

});

// INSERT An Usuario
/**
* @swagger
*  /usuarios/{usuario}:
*   post:
*      tags:
*      - usuario
*      summary: Updates a usuario in the store with form data
*      operationId: updateUsuarioWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: usuario
*        in: path
*        description: ID of usuario that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the usuario
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the usuario
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - usuariostore_auth:
*        - write:usuarios
*        - read:usuarios
*/
router.post('/user/login', (req, res) => {
  const {user_email} = req.body;
  const {user_password} = req.body;
  //console.log(req.body);

  mysqlConnection.query('SELECT * FROM users WHERE email = ? AND password = ?', [user_email, user_password], (err, rows, fields) => {
    //console.log(rows[0]);

    if(!err) {
      if(rows.length>0){
        res.status(201).json({ status: "success", data: rows[0], msg: "" });
      } else {
        res.status(201).json({ status: "failed", data: {}, msg: "No UserId / Password Found" });
      }
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Usuario
/**
 * @swagger
 * /usuarios:
 *    put:
 *      description: Use to update an usuario
 *    parameters:
 *      - name: usuarios
 *        in: query
 *        description: usuario of usuario
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated usuario
 */
router.put('/user/:id', (req, res) => {
  const { usuario } = req.body;
  const { id } = req.params;
  const query = `UPDATE usuario SET usuario = ? WHERE id_usuario = ?;`;
  mysqlConnection.query(query, [usuario,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Usuario Updated'});
    } else {
      res.json({error: err});
    }
  });
});

//POST An email
/**
 * @swagger
 * /api/send-email:
 *    post:
 *      description: Send a message using Office 365 email
 *      consumes:
 *      - application/json 
 *      produces:
 *      - application/json 
 *    parameters:
 *      - name: user_email
 *        in: formData
 *        description: User email address
 *        required: true
 *        type: string
 *      - name: to_email
 *        in: formData
 *        description: To email address
 *        required: true
 *        type: string
 *      - name: subject_email
 *        in: formData
 *        description: Subject
 *        required: true
 *        type: string
 *      - name: text_email
 *        in: formData
 *        description: Text of Message
 *        required: true
 *        type: string
 * 
 *    responses:
 *      '201':
 *        status: A failed or successful response
 */
router.post('/send-email', (req, res) => {

const {user_email} = req.body;
const {to_email} = req.body;
const {subject_email} = req.body;
const {html_email} = req.body;
const {text_email} = req.body;

mysqlConnection.query('SELECT * FROM users WHERE email = ?', [user_email], (err, rows, fields) => {
  if(!err) {
    if(rows.length>0){

      let user_password = rows[0].password;

      /*
      // Important: First step for GMAIL    
      // https://myaccount.google.com/u/1/lesssecureapps?pageId=none&pli=1
      
      const transporter = nodemailer.createTransport( smtpTransport ({
          
          host               :        "smtp.gmail.com",
          secureConnection   :         false,
          port               :         587,
          requiresAuth       :         true,        
          domains            :        ["gmail.com", "googlemail.com"],
          auth               :       {
                                      user : user_email,            //give your email id and password make
                                                                  // sure it does not have active two way authentication
                                      pass : user_password
                                      },
          tls                :       {
                                    rejectUnauthorized:false   
                                    }
      }))      
      
      */

      const transporter = nodemailer.createTransport( smtpTransport ({
          host: 'smtp.office365.com',
          port: '587',
          auth: { user: user_email, pass: user_password },
          secureConnection: false,
          tls: { ciphers: 'SSLv3' }
      }));
    
      const mailOptions = {
          to      :   to_email,             //the email id from above
          from    :   user_email,       //receiver email id
          subject :   subject_email,
          html    :   html_email,
          text    :   text_email
      }
    
      transporter.sendMail( mailOptions, (err,info) =>{
        
          if(err) {
                  console.log(err)
          }   else   {
              console.log(info)
              res.status(201).json({ status: "success", data: info, msg: "" });
          }
      })

      
    } else {
      res.status(201).json({ status: "failed", data: {user_email: user_email}, msg: "No email Found" });
    }
  } else {
    res.json({error: err});
  }
});
  
});

//POST An email
/**
 * @swagger
 * /api/send-email/p:
 *    post:
 *      description: Send a message using Office 365 email
 *      consumes:
 *      - application/json 
 *      produces:
 *      - application/json 
 *    parameters:
 *      - name: user_email
 *        in: formData
 *        description: User email address
 *        required: true
 *        type: string
 *      - name: to_email
 *        in: formData
 *        description: To email address
 *        required: true
 *        type: string
 *      - name: subject_email
 *        in: formData
 *        description: Subject
 *        required: true
 *        type: string
 *      - name: text_email
 *        in: formData
 *        description: Text of Message
 *        required: true
 *        type: string
 * 
 *    responses:
 *      '201':
 *        status: A failed or successful response
 */
router.get('/send-email/p', (req, res) => {

  const user_email = req.query.email;
  const to_email = req.query.to;
  const subject_email = req.query.subject;
  const html_email = req.query.html;
  const text_email = req.query.text;
  
  mysqlConnection.query('SELECT * FROM users WHERE email = ?', [user_email], (err, rows, fields) => {
    if(!err) {
      if(rows.length>0){
  
        let user_password = rows[0].password;
   
        const transporter = nodemailer.createTransport( smtpTransport ({
            host: 'smtp.office365.com',
            port: '587',
            auth: { user: user_email, pass: user_password },
            secureConnection: false,
            tls: { ciphers: 'SSLv3' }
        }));
      
        const mailOptions = {
            to      :   to_email,         //the email id from above
            from    :   user_email,       //receiver email id
            subject :   subject_email,
            html    :   html_email,
            text    :   text_email
        }
      
        transporter.sendMail( mailOptions, (err,info) =>{
          
            if(err) {
                    console.log(err)
            }   else   {
                console.log(info)
                res.status(201).json({ status: "success", data: info, msg: "" });
            }
        })
  
        
      } else {
        //console.log(req.query);
        //console.log(`SELECT * FROM users WHERE email = ${req.query.email}`);
        res.status(201).json({ status: "failed", data: {user_email: user_email}, msg: "No email Found" });
      }
    } else {
      res.json({error: err});
    }
  });
    
  });

module.exports = router;
