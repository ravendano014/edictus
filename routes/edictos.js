const { json } = require('express');
const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Edictos
/**
 * @swagger
 * /edictos:
 *  get:
 *    description: Use to request all edictos
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  const page = parseInt(req.query.page,10) || 1;
  const limit = parseInt(req.query.limit,10) || 10;

  const offset = (page -1) * limit;
  const sql = `SELECT * FROM edicto LIMIT ${offset} , ${limit}`;

  const results = {}

  mysqlConnection.query(sql, (err, rows, fields) => {
    results.next = { page: page + 1, limit: limit};
    results.previous = { page: page - 1, limit: limit};
    results.items = rows;
    results.totalrows = rows.length; // execute query 2 times to get total rows or slice the rows with js?
    results.message = { message: "Datos para Prueba de API"}

    //console.log(fields);

    if(!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Edicto
/**
 * @swagger
*  /edictos/{id_edicto}:
*    get:
*      tags:
*      - edicto
*      summary: Find edicto by ID
*      description: Returns a single edicto
*      operationId: getEdictos
*      produces:
*      - application/json
*      parameters:
*      - name: id_edicto
*        in: path
*        description: ID of edicto to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: edicto not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM edicto WHERE id_edicto = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});


// GET An Edicto
/**
 * @swagger
*  /edictos/ref/{referencia}:
*    get:
*      tags:
*      - edicto
*      summary: Find edicto by Ref
*      description: Returns a single edicto
*      operationId: getEdictos
*      produces:
*      - application/json
*      parameters:
*      - name: referencia
*        in: path
*        description: ID of edicto to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: edicto not found
*      security:
*      - api_key: []
*/
router.get('/ref/:ref', (req, res) => {
  const { ref } = req.params; 

  const results = {}

  mysqlConnection.query('SELECT * FROM edicto WHERE referencia = ?', [ref], (err, rows, fields) => {
    results.items = rows;
    results.totalrows = rows.length; 

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });
});

// GET A Chart of Edicto by id_estado
/**
 * @swagger
*  /edictos/chart/{year}:
*    get:
*      tags:
*      - edicto
*      summary: Create chart from edicto by year
*      description: Returns a single edicto
*      operationId: getEdictos
*      produces:
*      - application/json
*      parameters:
*      - name: referencia
*        in: path
*        description: ID of edicto to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: edicto not found
*      security:
*      - api_key: []
*/
router.get('/chart/:year', (req, res) => {
  const { year } = req.params; 

  const results = {}

  mysqlConnection.query(`select concat('{"v":"',estado.estado,'","f":null}, {"v":',count(id_edicto), ',"f":null}') as c from edicto inner join estado on edicto.id_estado = estado.id_estado where year(ingreso)=? group by edicto.id_estado`, [year], (err, rows, fields) => {
    results.cols = [
      {"id":"","label":"estado","pattern":"","type":"string"},
      {"id":"","label":"edictos","pattern":"","type":"number"}
  ];

    function geta1(item) {
      var formatted = item.c.split(', ');
      
      
      a1 = JSON.parse(formatted[0]);
      a2 = JSON.parse(formatted[1]);
      c = { c: [a1, a2] }
      return c;
    }
    
    results.rows =  rows.map(geta1)  ;

    //console.log(results);

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });
});

// GET A Chart of Edicto montly by ingreso
/**
 * @swagger
*  /edictos/montly/{year}:
*    get:
*      tags:
*      - edicto
*      summary: Create chart from edicto by year
*      description: Returns a single edicto
*      operationId: getEdictos
*      produces:
*      - application/json
*      parameters:
*      - name: referencia
*        in: path
*        description: ID of edicto to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: edicto not found
*      security:
*      - api_key: []
*/
router.get('/montly/:year', (req, res) => {
  const { year } = req.params; 

  const results = {}

  mysqlConnection.query(`select MONTH(ingreso) as Mes, COUNT(id_edicto) as Edictos  from edicto where Year(Ingreso)=? group by MONTH(Ingreso) order by month(Ingreso)`, [year], (err, rows, fields) => {

    //console.log(rows);

    if (!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });
});

// GET An Edicto
/**
 * @swagger
*  /edictos/publisher/{id_medio}:
*    get:
*      tags:
*      - edicto
*      summary: Find edicto by id_medio
*      description: Returns a single edicto
*      operationId: getEdictos
*      produces:
*      - application/json
*      parameters:
*      - name: referencia
*        in: path
*        description: ID of edicto to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: edicto not found
*      security:
*      - api_key: []
*/
router.get('/publisher/:id', (req, res) => {
const { id } = req.params; 

const page = parseInt(req.query.page,10) || 1;
const limit = parseInt(req.query.limit,10) || 10;

const offset = (page -1) * limit;
const sql = `SELECT * FROM edicto WHERE id_medio = ${id} LIMIT ${offset} , ${limit}`;

const results = {}

mysqlConnection.query(sql, [id], (err, rows, fields) => {
  //console.log(sql);
  results.next = { page: page + 1, limit: limit};
  results.previous = { page: page - 1, limit: limit};
  results.items = rows;
  results.totalrows = rows.length; 

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Edicto
/**
 * @swagger
*  /edictos/{id_edicto}:
*    delete:
*      tags:
*      - edicto
*      summary: Deletes an edicto
*      operationId: delEdicto
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: edictoId
*        in: path
*        description: Edicto id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Edicto not found
*      security:
*      - edictostore_auth:
*        - write:edictos
*        - read:edictos
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM edicto WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({affectedRows:rows.affectedRows}).end();
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Edicto
/**
* @swagger
*  /edictos/{edicto}:
*   post:
*      tags:
*      - edicto
*      summary: Updates a edicto in the store with form data
*      operationId: updateEdictoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: edicto
*        in: path
*        description: ID of edicto that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the edicto
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the edicto
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - edictostore_auth:
*        - write:edictos
*        - read:edictos
*/
router.post('/', (req, res) => {
  const {edicto} = req.body;
  //console.log(id_edicto, edicto);
  const query = `INSERT INTO edicto (nu) VALUES (?);`;
  mysqlConnection.query(query, [edicto], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({insertId: rows.insertId}).end();
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Edicto
/**
 * @swagger
 * /edictos:
 *    put:
 *      description: Use to update an edicto
 *    parameters:
 *      - name: edictos
 *        in: query
 *        description: edicto of edicto
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated edicto
 */

router.put('/:id',(req, res) => {
  const data = req.body;
  const query = mysqlConnection.query('UPDATE edicto SET ? WHERE id_edicto = ?', [data, req.params.id], (err, rows) => {
      if(err){
        res.status(404).json({error: err});
      } else {
        res.status(200).json({changedRows:rows.changedRows, affectedRows:rows.affectedRows}).end();
      }
  })
  //console.log(query.sql)
});

/*
router.put('/:id', (req, res) => {
  const { edicto } = req.body;
  const { id } = req.params;
  const query = `UPDATE edicto SET edicto = ? WHERE id_edicto = ?;`;
  mysqlConnection.query(query, [edicto,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Edicto Updated'});
    } else {
      res.json({error: err});
    }
  });
});
*/

router.patch('/:id',(req, res) => {
  const data = req.body;
  const query = mysqlConnection.query('UPDATE edicto SET ? WHERE id_edicto = ?', [data, req.params.id], (err, rows) => {
      if(err){
        res.status(404).json({error: err});
      } else {
        res.status(200).json({changedRows:rows.changedRows, affectedRows:rows.affectedRows}).end();
      }
  })
  
});

module.exports = router;
