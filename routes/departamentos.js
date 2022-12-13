const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

var func = require('./main.js');

// GET all Departamentos
/**
 * @swagger
 * /departamentos:
 *  get:
 *    description: Use to request all departamentos
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM departamento', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET A Departamento
/**
 * @swagger
*  /departamentos/{id_departamento}:
*    get:
*      tags:
*      - departamento
*      summary: Find departamento by ID
*      description: Returns a single departamento
*      operationId: getDepartamentos
*      produces:
*      - application/json
*      parameters:
*      - name: id_departamento
*        in: path
*        description: ID of departamento to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: departamento not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM departamento WHERE id_departamento = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

/*
router.get('/:id/municipios', (req, res) => {
  const { id } = req.params; 

  mysqlConnection.query('SELECT departamento.id_departamento, departamento.departamento, municipio.id_municipio, municipio.municipio FROM departamento INNER JOIN municipio ON departamento.id_departamento = municipio.id_departamento WHERE departamento.id_departamento = ?', [id], (err, rows, fields) => {
   
    if (!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });
});
*/
router.get('/:id/municipios', (req, res) => {
  const { id } = req.params; 

  sql = 'SELECT * FROM departamento INNER JOIN municipio ON departamento.id_departamento = municipio.id_departamento WHERE departamento.id_departamento = ?'
  //Key relations, Define each table's primary and foreign keys
  var nestingOptions = [
    { tableName : 'departamento', pkey: 'id_departamento'},
    { tableName : 'municipio', pkey: 'id_municipio', fkeys:[{table:'departamento',col:'id_departamento'}]},
    
  ];

  mysqlConnection.query({sql: sql, nestTables: true}, [id], (err, rows, fields) => {
   
    if (!err) {
      //res.json(rows);
      var nestedRows = func.convertToNested(rows, nestingOptions);
      // res.send(JSON.stringify(nestedRows));
      res.send(nestedRows);
    } else {
      res.json({error: err});
    }
  })
});


// DELETE An Departamento
/**
 * @swagger
*  /departamentos/{id_departamento}:
*    delete:
*      tags:
*      - departamento
*      summary: Deletes an departamento
*      operationId: delDepartamento
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: departamentoId
*        in: path
*        description: Departamento id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Departamento not found
*      security:
*      - departamentostore_auth:
*        - write:departamentos
*        - read:departamentos
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM departamento WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Departamento Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Departamento
/**
* @swagger
*  /departamentos/{departamento}:
*   post:
*      tags:
*      - departamento
*      summary: Updates a departamento in the store with form data
*      operationId: updateDepartamentoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: departamento
*        in: path
*        description: ID of departamento that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the departamento
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the departamento
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - departamentostore_auth:
*        - write:departamentos
*        - read:departamentos
*/
router.post('/', (req, res) => {
  const {departamento} = req.body;
  //console.log(id_departamento, departamento);
  const query = `INSERT INTO departamento (departamento) VALUES (?);`;
  mysqlConnection.query(query, [departamento], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Departamento Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Departamento
/**
 * @swagger
 * /departamentos:
 *    put:
 *      description: Use to update a departamento
 *    parameters:
 *      - name: departamentos
 *        in: query
 *        description: departamento of departamento
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated departamento
 */
router.put('/:id', (req, res) => {
  const { departamento } = req.body;
  const { id } = req.params;
  const query = `UPDATE departamento SET departamento = ? WHERE id_departamento = ?;`;
  mysqlConnection.query(query, [departamento,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Departamento Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
