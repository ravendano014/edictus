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
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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
router.post('/', (req, res) => {
  const {usuario} = req.body;
  //console.log(id_usuario, usuario);
  const query = `INSERT INTO usuario (usuario) VALUES (?);`;
  mysqlConnection.query(query, [usuario], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Usuario Saved'});
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
router.put('/:id', (req, res) => {
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

module.exports = router;
