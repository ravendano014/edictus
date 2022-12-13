const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Consol
/**
 * @swagger
 * /consol:
 *  get:
 *    description: Use to request all consol
 *    responses:
 *      '200':
 *        description: A successful response
 */
 router.get('/', (req, res) => {
  const page = parseInt(req.query.page,10) || 1;
  const limit = parseInt(req.query.limit,10) || 10;

  const offset = (page -1) * limit;
  const sql = `SELECT * FROM consol LIMIT ${offset} , ${limit}`;

  const results = {}

  mysqlConnection.query(sql, (err, rows, fields) => {
    results.next = { page: page + 1, limit: limit};
    results.previous = { page: page - 1, limit: limit};
    results.items = rows;
    results.totalrows = rows.length; 
    results.message = { message: "Códigos de Activo Fijo"}

    if(!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });  
});

// GET all Consol
/**
 * @swagger
 * /consol:
 *  get:
 *    description: Use to request all consol
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/p', function(req, res) {
  //res.send("q is set to " + req.query.q);
  ref = req.query.q;
  cod = ref.substr(0,2);
  correlativo = ref.substr(2,5);
  const results = {}

  //query = "SELECT concat(cod,correlativo,' Descripción: ',descrip,' Marca: ',marca,' Modelo: ',modelo,' Serie: ',serie,' Exp. Gtia: ',fecha_garantia) as caf FROM consol WHERE cod = '"+cod+"' AND correlativo = '"+correlativo+"'";

  mysqlConnection.query("SELECT concat(cod,correlativo,' Descripción: ',descrip,' Marca: ',marca,' Modelo: ',modelo,' Serie: ',serie,' Exp. Gtia: ',fecha_garantia, 'Unidad: ',unidad.descripcio) as caf FROM consol inner join unidad on consol.unidad = unidad.codunidad WHERE cod = '"+cod+"' AND correlativo = '"+correlativo+"'", [cod, correlativo], (err, rows, fields) => {
    
    results.items = rows;
    results.totalrows = rows.length; 
    let mapped = results.items.map(el => el.caf);

    if (!err) {
       res.json(mapped);
      // res.send(cod+correlativo+' '+query);
    } else {
      res.json({error: err});
    }
  });
});

// GET all Consol
/**
 * @swagger
 * /consol:
 *  get:
 *    description: Use to request all consol
 *    responses:
 *      '200':
 *        description: html
 */
 router.get('/h', function(req, res) {
  //res.send("q is set to " + req.query.q);
  ref = req.query.q;
  cod = ref.substr(0,2);
  correlativo = ref.substr(2,5);
  const results = {}

  //query = "SELECT concat(cod,correlativo,' Descripción: ',descrip,' Marca: ',marca,' Modelo: ',modelo,' Serie: ',serie,' Exp. Gtia: ',fecha_garantia) as caf FROM consol WHERE cod = '"+cod+"' AND correlativo = '"+correlativo+"'";

  mysqlConnection.query("SELECT cod,correlativo,descrip,marca,modelo,serie,fecha_garantia,unidad.descripcio as unidad FROM consol inner join unidad on consol.unidad = unidad.codunidad WHERE cod = '"+cod+"' AND correlativo = '"+correlativo+"'", [cod, correlativo], (err, rows, fields) => {
    
    results.items = rows;
    results.totalrows = rows.length; 

    if (!err) {
      // res.send(cod+correlativo+' '+query);
      //console.log(results.items[0].cod);
      string = '<html><head><title>Intranet DDTI</title></head><body>'+'<br><b><h2>Consulta de Datos de Activo Fijo</h2></b><hr><table width="100%"></td></tr><tr><td>CAF</td><td>'+results.items[0].cod+results.items[0].correlativo+'</td></tr><tr><td>Marca: </td><td>'+results.items[0].marca+'</td></tr><tr><td>Modelo: </td><td>'+results.items[0].modelo+'</td></tr><tr><td>Serie: </td><td>'+results.items[0].serie+'</td></tr><tr><td>Expira Garantía: </td><td>'+results.items[0].fecha_garantia+'</td></tr><tr><td colspan=2></td></tr><tr><td colspan=2></td></tr><tr><td>Unidad: </td><td>'+results.items[0].unidad+'</td></tr><tr><td colspan=2></td></tr><tr><td colspan=2><a href="https://ddti-items.herokuapp.com">Ver Todos los códigos escaneados</a></tr></table>'+'<hr><br><b>Dirección de Desarrollo Tecnológico</b></body></html>';
      //console.log(string);
      res.send(string);
    } else {
      res.json({error: err});
    }
  });
});

// GET All CAF By Organizational Unit
/**
 * @swagger
*  /cafs/ref/{referencia}:
*    get:
*      tags:
*      - caf
*      summary: Find caf by Ou
*      description: Returns all cafs by Ou
*      operationId: getCafs
*      produces:
*      - application/json
*      parameters:
*      - name: referencia
*        in: path
*        description: ID of caf to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: caf not found
*      security:
*      - api_key: []
*/
router.get('/ou/:ou', (req, res) => {
  const { ou } = req.params; 

  const results = {}

  mysqlConnection.query('SELECT * FROM consol WHERE unidad = ?', [ou], (err, rows, fields) => {
    results.items = rows;
    results.totalrows = rows.length; 

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });
});

// GET All CAF By Organizational Unit
/**
 * @swagger
*  /cafs/ref/{referencia}:
*    get:
*      tags:
*      - caf
*      summary: Find caf by Ou
*      description: Returns all cafs by Ou
*      operationId: getCafs
*      produces:
*      - application/json
*      parameters:
*      - name: referencia
*        in: path
*        description: ID of caf to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: caf not found
*      security:
*      - api_key: []
*/
router.get('/segment/:ou/:cod', (req, res) => {
  const { ou } = req.params; 
  const { cod } = req.params;
  const results = {}

  mysqlConnection.query('SELECT * FROM consol WHERE unidad = ? AND cod = ?', [ou, cod], (err, rows, fields) => {
    results.items = rows;
    results.totalrows = rows.length; 

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });
});

// GET a Organizational Unit
/**
 * @swagger
 * /consol:
 *  get:
 *    description: Use to request a Unity
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/unity/:ref', (req, res) => {
  const { ref } = req.params; 

  const results = {}

  mysqlConnection.query('SELECT * FROM unidad WHERE codunidad = ?', [ref], (err, rows, fields) => {
    results.items = rows;
    results.totalrows = rows.length; 

    if (!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });
});


module.exports = router;
