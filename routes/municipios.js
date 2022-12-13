const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Municipios
/**
 * @swagger
 * /municipios:
 *  get:
 *    description: Use to request all municipios
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM municipio', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Municipio
/**
 * @swagger
*  /municipios/{id_municipio}:
*    get:
*      tags:
*      - municipio
*      summary: Find municipio by ID
*      description: Returns a single municipio
*      operationId: getMunicipios
*      produces:
*      - application/json
*      parameters:
*      - name: id_municipio
*        in: path
*        description: ID of municipio to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: municipio not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM municipio WHERE id_municipio = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

router.get('/:id/dependencias', (req, res) => {
  const { id } = req.params; 

  sql = 'SELECT * FROM municipio INNER JOIN dependencia ON municipio.id_municipio = dependencia.id_municipio WHERE municipio.id_municipio = ?'
  //Key relations, Define each table's primary and foreign keys
  var nestingOptions = [
    { tableName : 'municipio', pkey: 'id_municipio'},
    { tableName : 'dependencia', pkey: 'id_dependencia', fkeys:[{table:'municipio',col:'id_municipio'}]},
    
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

// DELETE A Municipio
/**
 * @swagger
*  /municipios/{id_municipio}:
*    delete:
*      tags:
*      - municipio
*      summary: Deletes a municipio
*      operationId: delMunicipio
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: municipioId
*        in: path
*        description: Municipio id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Municipio not found
*      security:
*      - municipiostore_auth:
*        - write:municipios
*        - read:municipios
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM municipio WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Municipio Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Municipio
/**
* @swagger
*  /municipios/{municipio}:
*   post:
*      tags:
*      - municipio
*      summary: Updates a municipio in the store with form data
*      operationId: updateMunicipioWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: municipio
*        in: path
*        description: ID of municipio that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the municipio
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the municipio
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - municipiostore_auth:
*        - write:municipios
*        - read:municipios
*/
router.post('/', (req, res) => {
  const {municipio} = req.body;
  //console.log(id_municipio, municipio);
  const query = `INSERT INTO municipio (municipio) VALUES (?);`;
  mysqlConnection.query(query, [municipio], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Municipio Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Municipio
/**
 * @swagger
 * /municipios:
 *    put:
 *      description: Use to update a municipio
 *    parameters:
 *      - name: municipios
 *        in: query
 *        description: municipio of municipio
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated municipio
 */
router.put('/:id', (req, res) => {
  const { municipio } = req.body;
  const { id } = req.params;
  const query = `UPDATE municipio SET municipio = ? WHERE id_municipio = ?;`;
  mysqlConnection.query(query, [municipio,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Municipio Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
