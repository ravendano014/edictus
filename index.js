const express = require('express');
require('dotenv').config()
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(cors({
  // origin: 'https://apps.csj.gob.sv' // limit front end to a given origin, uncomment to test
}));
app.use(express.json()); // For REST

app.set('appName','edictus API');
app.set('port', process.env.PORT || 3000);

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const { makeExecutableSchema } = require('graphql-tools');

const { GraphQLDateTime } = require("graphql-iso-date");

const customScalarResolver = {
  Date: GraphQLDateTime
};

const notifications = [];

const typeDefs = `
 
  type Acto {
    id_acto: Int!
    acto: String
  },

  input ActoInput {
    acto: String
  },

  type Bitacora {
    id_bitacora: Int!
    programado: Date
    realizado: Date
    cambio: String
    id_requerimiento: Int
    requerimientos: [Requerimiento]
    requirente: Int
    requirentes: [Usuario]
    userstory: String
    paso: Int
    avance: Int
    backlog: Int
    functional: Int
    type: Int
    developer: Int
    id_epica: Int
    epicas: [Epica]
    storypoints: String
    irqa: String
    attachment: String
    id_periodo: Int
  },

  type Costo {
    id_costo: Int
    id_medio: Int
    medios: [Medio]
    factura: String
    monto: String
    referencia: String
    edictos: Int
    lista: String
    lineas: Int
    programacion: String
    Ingreso: Date
    fecha_1a_publicacion: Date
    quedan: String
    id_asignado: Int
    asignados: [Usuario]
    id_estado: Int
    observaciones: String
  },

  type Departamento {
    id_departamento: String!
    departamento: String
    d: String
    poblacion: Int
    distribucion: String
    extension: String
    densidad: Int
    municipios: [Municipio]
  },

  input DepartamentoInput {
    departamento: String
    d: String
    poblacion: Int
    distribucion: String
    extension: String
    densidad: Int
    municipios: [MunicipioInput]
  },

  type Dependencia {
    id_dependencia: Int!
    dependencia: String
    id_municipio: Int
    municipios: [Municipio]
    cod_geo: String
    id_materia: Int
    materias: [Materia]
    telefonos: String
    uplt: String
    email: String
  },

  input DependenciaInput {
    dependencia: String
    id_municipio: Int
    municipios: [MunicipioInput]
    cod_geo: String
    id_materia: Int
    materias: [MateriaInput]
    telefonos: String
    uplt: String
    email: String
  },

  type Edicto {
    id_edicto: Int!
    nu: String
    id_estado: Int
    estados: [Estado]
    referencia: String
    id_dependencia: Int
    dependencias: [Dependencia]
    id_etapa: Int
    etapas: [Etapa]
    numero_oficio: String
    imputado: String
    imputados: [Imputado]
    ingreso: Date
    id_asignado: Int
    asignados: [Usuario]
    fecha_asignado: Date
    asignado_por: Int
    asignados_por: [Usuario]
    fecha_oficio: Date
    victima: String
    id_materia: Int
    materias: [Materia]
    delito: String
    fecha_1a_acto: Date
    fecha_2a_acto: Date
    id_acto: Int
    actos: [Acto]
    fecha_1a_publicacion: Date
    fecha_2a_publicacion: Date
    fecha_3a_publicacion: Date
    id_medio: Int
    medios: [Medio]
    lineas: Int
    costo: String
    enviado_do: Date
    publicado_do: String
    costo_do: String
    finalizado: Date
    finalizado_por: Int
    finalizados_por: [Usuario]
    finalizado_Obs: String
    creado: Date
    creado_por: Int
    creados_por: [Usuario]
    modificado: Date
    modificado_por: Int
    modificados_por: [Usuario]
    url: String
    id_periodo: Int
    periodos: [Periodo]
  },

  input EdictoInput {
    nu: String
    id_estado: Int
    estados: [EstadoInput]
    referencia: String
    id_dependencia: Int
    dependencias: [DependenciaInput]
    id_etapa: Int
    numero_oficio: String
    imputado: String
    ingreso: Date
    id_asignado: Int
    fecha_asignado: Date
    asignado_por: Int
    fecha_oficio: Date
    victima: String
    id_materia: Int
    delito: String
    fecha_1a_acto: Date
    fecha_2a_acto: Date
    id_acto: Int
    fecha_1a_publicacion: Date
    fecha_2a_publicacion: Date
    fecha_3a_publicacion: Date
    id_medio: Int
    lineas: Int
    costo: String
    enviado_do: Date
    publicado_do: String
    costo_do: String
    finalizado: Date
    finalizado_por: Int
    finalizado_Obs: String
    creado: Date
    creado_por: Int
    modificado: Date
    modificado_por: Int
    url: String
    id_periodo: Int
    periodos: [PeriodoInput]
  },

  type Epica {
    id_epica: Int!
    epica: String
    detalle: String
  },

  type Estado {
    id_estado: Int!
    estado: String
  },

  input EstadoInput {
    estado: String
  },

  type Etapa {
    id_etapa: Int!
    etapa: String
  },

  input EtapaInput {
    etapa: String
  },

  type Imputado {
    id_imputado: Int!
    id_dependencia: Int
    dependencias: [Dependencia]
    nombres_imputado: String
    apellidos_imputado: String
    estado_imputado: String
    cargo_imputado: String
    fecha_creacion: Date
    fecha_finalizacion: String
    id_usuario: Int
    usuarios: [Usuario]
  },

  type Materia {
    id_materia: Int!
    materia: String
  },

  input MateriaInput {
    materia: String
  },

  type Medio {
    id_medio: Int!
    medio: String
    razon: String
    detalles: String
    contacto: String
    codigo: String
    contrato: String
    compromiso: String
    firmado: Date
    inicia: Date
    finaliza: Date
    monto: String
    costo_x_linea: String
  },

  input MedioInput {
    medio: String
    razon: String
    detalles: String
    contacto: String
    codigo: String
    contrato: String
    compromiso: String
    firmado: Date
    inicia: Date
    finaliza: Date
    monto: String
    costo_x_linea: String
  },

  type Meta {
    id_meta: Int!
    codigo: String
    meta: String
    periodo: String
    ene: String
    feb: String
    mar: String
    abr: String
    may: String
    jun: String
    jul: String
    ago: String
    sep: String
    oct: String
    nov: String
    dic: String
    id_periodo: Int
  },
  
  input MetaInput {
    codigo: String
    meta: String
    periodo: String
    ene: String
    feb: String
    mar: String
    abr: String
    may: String
    jun: String
    jul: String
    ago: String
    sep: String
    oct: String
    nov: String
    dic: String
    id_periodo: Int
  },

  type Municipio {
      id_municipio: Int!
      municipio: String
      d: String
      poblacion: Int
      id_departamento: String
      departamentos: [Departamento]
    },

  input MunicipioInput {
    municipio: String
    d: String
    poblacion: Int
    id_departamento: String
    departamentos: [DepartamentoInput]
  },  

  type Periodo {
    id_periodo: Int!
    periodo: String
  },

  input PeriodoInput {
    periodo: String
  },

  type Requerimiento {
    id_requerimiento: Int!
    requerimiento: String
    programado: Date
    realizado: Date
    cambio: String
    codigo: String
  },

  input RequerimientoInput {
    requerimiento: String
    programado: Date
    realizado: Date
    cambio: String
    codigo: String
  },

  type Salida {
    id_salida: Int!
    id_tipo: Int
    fecha: Date
    id_usuario: Int
    usuarios: [Usuario]
    asunto: String
    destinatario: String
    referencia: String
  },

  type Solicitud {
    id_solicitud: Int!
    solicitud: String
    solicitada: Date
    plazo: Int
    referencia: String
    detalle: String
    respuesta: String
    observaciones: String
    digital: String
    id_periodo: Int
  },

  input SolicitudInput {
    solicitud: String
    solicitada: Date
    plazo: Int
    referencia: String
    detalle: String
    respuesta: String
    observaciones: String
    digital: String
    id_periodo: Int
  },

  type Task {
    id: Int!
    title: String
    description: String
    code: String
    advance: Int
    sysdate: Date
    enddate: Date
  },

  input TaskInput {
    title: String
    description: String
    code: String
    advance: Int
    sysdate: Date
    enddate: Date
  },

  type TaskHist {
    id: Int!
    title: String
    description: String
    code: String
    advance: Int
    sysdate: Date
    enddate: Date
  },

  input TaskHistInput {
    title: String
    description: String
    code: String
    advance: Int
    sysdate: Date
    enddate: Date
  },

  type Usuario {
    id_usuario: Int!
    nombres: String
    apellidos: String
    usuario: String
    estado: String
 }, 

 input UsuarioInput {
  nombres: String
  apellidos: String
  usuario: String
  estado: String
},

  # the schema allows the following query:
  scalar JSON
  scalar Date
  type Query {
    ver: JSON
    getActos(id_acto: Int): [Acto]
    getBitacoras(id_bitacora: Int): [Bitacora]
    getCostos(id_medio: Int, factura: String, programacion: String, id_estado: Int): [Costo]
    getDepartamentos(id_departamento: String, departamento: String): [Departamento]
    getDependencias(id_dependencia: Int, dependencia: String, id_municipio: Int, id_materia: Int, email: String): [Dependencia]
    getEdictos(id_edicto: Int, nu: String, imputado: String, referencia: String, page: Int, limit: Int, sort: String, sortorder: String): [Edicto]
    getEpicas(id_epica: Int): [Epica]
    getEstados(id_estado: Int, estado: String): [Estado]
    getEtapas(id_etapa: Int, etapa: String): [Etapa]
    getImputados(id_imputado: Int, nombres_imputados: String, apellidos_imputado: String): [Imputado]
    getMaterias(id_materia: Int, materia: String): [Materia]
    getMedios(id_medio: Int, medio: String): [Medio]
    getActo(id: Int): [Acto]
    getMetas(id_meta: Int, meta: String, periodo: String): [Meta]
    getMunicipios(id_municipio: Int, municipio: String, id_departamento: String): [Municipio]
    getPeriodos(id_periodo: Int): [Periodo]
    getRequerimientos(id_requerimiento: Int, requerimiento: String): [Requerimiento]
    getSalidas(id_salida: Int, salida: String, asunto: String, destinatario: String, referencia: String,  page: Int, limit: Int, sort: String, sortorder: String): [Salida]
    getSolicitudes(id_solicitud: Int, solicitud: String): [Solicitud]
    getTasks(id: Int, title: String, description: String, code: String, advance: Int, sysdate: Date, enddate: Date): [Task]
    getTasksHist(id: Int, title: String, description: String, code: String, advance: Int, sysdate: Date, enddate: Date): [TaskHist]
    getUsuarios(id_usuario: Int, nombres: String, apellidos: String, usuario: String, estado: String): [Usuario]
    notifications: [Notification]
  },
  type Notification { label: String },
  # this schema allows the following mutation:
  type Mutation {
    addActo(input: ActoInput): String
    updActo(id: Int!, input: ActoInput): String
    delActo(id: Int!): String
    addDepartamento(input: DepartamentoInput): String
    updDepartamento(id: Int!, input: DepartamentoInput): String
    delDepartamento(id: Int!): String
    addDependencia(input: DependenciaInput): String
    updDependencia(id: Int!, input: DependenciaInput): String
    delDependencia(id: Int!): String
    addEstado(input: EstadoInput): String
    updEstado(id: Int!, input: EstadoInput): String
    delEstado(id: Int!): String
    addEtapa(input: EtapaInput): String
    updEtapa(id: Int!, input: EtapaInput): String
    delEtapa(id: Int!): String
    addMateria(input: MateriaInput): String
    updMateria(id: Int!, input: MateriaInput): String
    delMateria(id: Int!): String
    addTask(input: TaskInput): String
    updTask(id: Int!, input: TaskInput): String
    delTask(id: Int!): String
    addTaskHist(input: TaskHistInput): String
    updTaskHist(id: Int!, input: TaskHistInput): String
    delTaskHist(id: Int!): String
    addMedio(input: MedioInput): String
    updMedio(id: Int!, input: MedioInput): String
    delMedio(input: MedioInput): String
    addMeta(input: MetaInput): String
    updMeta(id: Int!, input: MetaInput): String
    delMeta(id: Int!): String
    addMunicipio(input: MunicipioInput): String
    updMunicipio(id: Int!, input: MunicipioInput): String
    delMunicipio(id: Int!): String
    addPeriodo(input: PeriodoInput): String
    updPeriodo(id: Int!, input: PeriodoInput): String
    delPeriodo(id: Int!): String
    addRequerimiento(input: RequerimientoInput): String
    updRequerimiento(id: Int!, input: RequerimientoInput): String
    delRequerimiento(id: Int!): String
    addSolicitud(input: SolicitudInput): String
    updSolicitud(id: Int!, input: SolicitudInput): String
    delSolicitud(id: Int!): String
    addUsuario(input: UsuarioInput): String
    updUsuario(id: Int!, input: UsuarioInput): String
    delUsuario(id: Int!): String
    pushNotification(label: String!): Notification
  },
  type Subscription { newNotification: Notification }

`;
  

function generateUUID(){
	var d = new Date().getTime();
	
	if( window.performance && typeof window.performance.now === "function" ){
		d += performance.now();
	}
	
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

return uuid;
};

  let getActosById = (id_acto) => {
    const sqlActos = `SELECT * FROM acto`;
    let sqlById = `${sqlActos} WHERE id_acto = '${id_acto}'`;
    let sql = id_acto? sqlById : sqlActos;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateActoById = (id, input) => {
    const sqlActo = `UPDATE acto`;
    let sqlById = `${sqlActo} SET ? WHERE id_acto = ?`;
    let sql = id? sqlById : sqlActo;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newActo = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO acto (acto) VALUES ('${input.acto}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };

  let deleteActoById = (id, input) => {
    const sqlActo = `DELETE FROM acto`;
    let sqlById = `${sqlActo} WHERE id_acto = ${id}`;
    let sql = id? sqlById : sqlActo;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getBitacorasById = (id_bitacora) => {
    const sqlBitacoras = `SELECT * FROM bitacora`;
    let sqlById = `${sqlBitacoras} WHERE id_bitacora = '${id_bitacora}'`;
    let sql = id_bitacora? sqlById : sqlBitacoras;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getCostosByParams = (id_medio, factura, programacion, id_estado) => {
    const sqlCostos = `SELECT * FROM costo`;
    let sqlById = `${sqlCostos} WHERE id_medio = '${id_medio}'`;
    let sqlByFactura = `${sqlCostos} WHERE factura = '${factura}'`;
    let sqlByProgramacion = `${sqlCostos} WHERE programacion = ${programacion}`;
    let sqlByEstado = `${sqlCostos} WHERE id_estado = ${id_estado}`;
    let sql = sqlCostos;
    if(id_medio){
      sql = sqlById;
    } else if(factura) { 
      sql = sqlByFactura;
    } else if(programacion) { 
      sql = sqlByProgramacion;
    } else if(id_estado) { 
      sql = sqlByEstado;
    } 
    
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getDepartamentosByParams = (id_departamento, departamento) => {
    const sqlDepartamentos = `SELECT * FROM departamento`;
    let sqlById = `${sqlDepartamentos} WHERE id_departamento = '${id_departamento}'`;
    let sqlByDepartamento = `${sqlDepartamentos} WHERE departamento LIKE '%${departamento}%'`;
    let sql = sqlDepartamentos;
    if(id_departamento){
      sql = sqlById;
    } else if(departamento) { 
      sql = sqlByDepartamento;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateDepartamentoById = (id, input) => {
    const sqlDepartamento = `UPDATE departamento`;
    let sqlById = `${sqlDepartamento} SET ? WHERE id_departamento = ?`;
    let sql = id? sqlById : sqlDepartamento;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newDepartamento = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO departamento (departamento) VALUES ('${input.departamento}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteDepartamentoById = (id, input) => {
    const sqlDepartamento = `DELETE FROM departamento`;
    let sqlById = `${sqlDepartamento} WHERE id_departamento = ${id}`;
    let sql = id? sqlById : sqlDepartamento;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getDependenciasByParams = (id_dependencia, dependencia, id_municipio, id_materia, email) => {
    const sqlDependencias = `SELECT * FROM dependencia`;
    let sqlById = `${sqlDependencias} WHERE id_dependencia = '${id_dependencia}'`;
    let sqlByDependencia = `${sqlDependencias} WHERE dependencia LIKE '%${dependencia}%'`;
    let sqlById_Municipio = `${sqlDependencias} WHERE id_municipio = ${id_municipio}`;
    let sqlById_Materia = `${sqlDependencias} WHERE id_materia = ${id_materia}`;
    let sqlByEmail = `${sqlDependencias} WHERE email LIKE '%${email}%'`;
    let sql = sqlDependencias;
    if(id_dependencia){
      sql = sqlById;
    } else if(dependencia) { 
      sql = sqlByDependencia;
    } else if(id_municipio) { 
      sql = sqlById_Municipio;
    } else if(id_materia) { 
      sql = sqlById_Materia;
    } else if(email) { 
      sql = sqlByEmail;
    } 
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateDependenciaById = (id, input) => {
    const sqlDependencia = `UPDATE dependencia`;
    let sqlById = `${sqlDependencia} SET ? WHERE id_dependencia = ?`;
    let sql = id? sqlById : sqlDependencia;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newDependencia = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO dependencia (dependencia) VALUES ('${input.dependencia}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };

  let deleteDependenciaById = (id, input) => {
    const sqlDependencia = `DELETE FROM dependencia`;
    let sqlById = `${sqlDependencia} WHERE id_dependencia = ${id}`;
    let sql = id? sqlById : sqlDependencia;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };
  
  let getEdictosByParams = (id_edicto, nu, imputado, referencia, page, limit = 10, sort = 'ingreso', sortorder = 'desc' ) => {
    const sqlEdictos = `SELECT * FROM edicto`;
    let sqlById = `${sqlEdictos} WHERE id_edicto = '${id_edicto}'`;
    let sqlByNu = `${sqlEdictos} WHERE nu = '${nu}'`;
    let sqlByImputado = `${sqlEdictos} WHERE imputado like '%${imputado}%' `;
    let sqlByReferencia = `${sqlEdictos} WHERE referencia = '${referencia}'`;
    let sql = sqlEdictos;
    if(id_edicto){
      sql = sqlById;
    } else if(nu) { 
      sql = sqlByNu;
    } else if(imputado) { 
      sql = sqlByImputado;
    } else if(referencia) { 
      sql = sqlByReferencia;
    } 
    
    if(page){
        offset = (page - 1) * limit;
        sql = sql + ` ORDER BY ${sort} ${sortorder}  LIMIT ${offset} , ${limit}`;
      } else {
        sql = sql + ` ORDER BY ${sort} ${sortorder}`;
      }

    //console.log(sql);

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getEpicasById = (id_epica) => {
    const sqlEpicas = `SELECT * FROM epica`;
    let sqlById = `${sqlEpicas} WHERE id_epica = '${id_epica}'`;
    let sql = id_epica? sqlById : sqlEpicas;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getEstadosByParams = (id_estado, estado) => {
    const sqlEstados = `SELECT * FROM estado`;
    let sqlById = `${sqlEstados} WHERE id_estado = '${id_estado}'`;
    let sqlByEstado = `${sqlEstados} WHERE estado LIKE '%${estado}%'`;
    let sql = sqlEstados;
    if(id_estado){
      sql = sqlById;
    } else if(estado) { 
      sql = sqlByEstado;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateEstadoById = (id, input) => {
    const sqlEstado = `UPDATE estado`;
    let sqlById = `${sqlEstado} SET ? WHERE id_estado = ?`;
    let sql = id? sqlById : sqlEstado;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newEstado = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO estado (estado) VALUES ('${input.estado}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteEstadoById = (id, input) => {
    const sqlEstado = `DELETE FROM estado`;
    let sqlById = `${sqlEstado} WHERE id_estado = ${id}`;
    let sql = id? sqlById : sqlEstado;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getEtapasByParams = (id_etapa, etapa) => {
    const sqlEtapas = `SELECT * FROM etapa`;
    let sqlById = `${sqlEtapas} WHERE id_etapa = '${id_etapa}'`;
    let sqlByEtapa = `${sqlEtapas} WHERE etapa LIKE '%${etapa}%'`;
    let sql = sqlEtapas;
    if(id_etapa){
      sql = sqlById;
    } else if(etapa) { 
      sql = sqlByEtapa;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateEtapaById = (id, input) => {
    const sqlEtapa = `UPDATE etapa`;
    let sqlById = `${sqlEtapa} SET ? WHERE id_etapa = ?`;
    let sql = id? sqlById : sqlEtapa;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newEtapa = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO etapa (etapa) VALUES ('${input.etapa}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteEtapaById = (id, input) => {
    const sqlEtapa = `DELETE FROM etapa`;
    let sqlById = `${sqlEtapa} WHERE id_etapa = ${id}`;
    let sql = id? sqlById : sqlEtapa;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getImputadosByParams = (id_imputado, nombres_imputado, apellidos_imputado) => {
    const sqlImputados = `SELECT * FROM imputado`;
    let sqlById = `${sqlImputados} WHERE id_imputado = '${id_imputado}'`;
    let sqlByNombres_Imputado = `${sqlImputados} WHERE nombres_imputado LIKE '%${nombres_imputado}%'`;
    let sqlByApellidos_Imputado = `${sqlImputados} WHERE apellidos_imputado LIKE '%${apellidos_imputado}%'`;
    let sql = sqlImputados;
    if(id_imputado){
      sql = sqlById;
    } else if(nombres_imputado) { 
      sql = sqlByNombres_Imputado;
    } else if(apellidos_imputado) { 
      sql = sqlByApellidos_Imputado;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getMateriasByParams = (id_materia, materia) => {
    const sqlMaterias = `SELECT * FROM materia`;
    let sqlById = `${sqlMaterias} WHERE id_materia = '${id_materia}'`;
    let sqlByMateria = `${sqlMaterias} WHERE materia LIKE '%${materia}%'`;
    let sql = sqlMaterias;
    if(id_materia){
      sql = sqlById;
    } else if(materia) { 
      sql = sqlByMateria;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateMateriaById = (id, input) => {
    const sqlMateria = `UPDATE materia`;
    let sqlById = `${sqlMateria} SET ? WHERE id_materia = ?`;
    let sql = id? sqlById : sqlMateria;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newMateria = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO materia (materia) VALUES ('${input.materia}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteMateriaById = (id, input) => {
    const sqlMateria = `DELETE FROM materia`;
    let sqlById = `${sqlMateria} WHERE id_materia = ${id}`;
    let sql = id? sqlById : sqlMateria;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getMediosByParams = (id_medio, medio) => {
    const sqlMedios = `SELECT * FROM medio`;
    let sqlById = `${sqlMedios} WHERE id_medio = '${id_medio}'`;
    let sqlByMedio = `${sqlMedios} WHERE medio LIKE '%${medio}%'`;
    let sql = sqlMedios;
    if(id_medio){
      sql = sqlById;
    } else if(medio) { 
      sql = sqlByMedio;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateMedioById = (id, input) => {
    const sqlMedio = `UPDATE medio`;
    let sqlById = `${sqlMedio} SET ? WHERE id_medio = ?`;
    let sql = id? sqlById : sqlMedio;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newMedio = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO medio (medio) VALUES ('${input.medio}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };

  let deleteMedioById = (id, input) => {
    const sqlMedio = `DELETE FROM medio`;
    let sqlById = `${sqlMedio} WHERE id_medio = ${id}`;
    let sql = id? sqlById : sqlMedio;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getMetasByParams = (id_meta, meta, periodo) => {
    const sqlMetas = `SELECT * FROM plan_anual`;
    let sqlById = `${sqlMetas} WHERE id_meta = '${id_meta}'`;
    let sqlByMeta = `${sqlMetas} WHERE meta LIKE '%${meta}%'`;
    let sqlByPeriodo = `${sqlMetas} WHERE periodo LIKE '%${periodo}%'`;
    let sql = sqlMetas;
    if(id_meta){
      sql = sqlById;
    } else if(meta) { 
      sql = sqlByMeta;
    } else if(periodo) { 
      sql = sqlByPeriodo;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateMetaById = (id, input) => {
    const sqlMeta = `UPDATE meta`;
    let sqlById = `${sqlMeta} SET ? WHERE id_meta = ?`;
    let sql = id? sqlById : sqlMeta;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newMeta = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO meta (meta) VALUES ('${input.meta}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };

  let deleteMetaById = (id, input) => {
    const sqlMeta = `DELETE FROM plan_anual`;
    let sqlById = `${sqlMeta} WHERE id_meta = ${id}`;
    let sql = id? sqlById : sqlMeta;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getMunicipiosByParams = (id_municipio, municipio, id_departamento) => {
    const sqlMunicipios = `SELECT * FROM municipio`;
    let sqlById = `${sqlMunicipios} WHERE id_municipio = '${id_municipio}'`;
    let sqlByMunicipio = `${sqlMunicipios} WHERE municipio LIKE '%${municipio}%'`;
    let sqlById_Departamento = `${sqlMunicipios} WHERE id_departamento = '${id_departamento}'`;
    let sql = sqlMunicipios;
    if(id_municipio){
      sql = sqlById;
    } else if(municipio) { 
      sql = sqlByMunicipio;
    } else if(id_departamento) { 
      sql = sqlById_Departamento;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getMunicipiosbyDepartamento = (id_departamento) => {
    const sql = `SELECT * FROM municipio WHERE id_departamento = '${id_departamento}'`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateMunicipioById = (id, input) => {
    const sqlMunicipio = `UPDATE municipio`;
    let sqlById = `${sqlMunicipio} SET ? WHERE id_municipio = ?`;
    let sql = id? sqlById : sqlMunicipio;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newMunicipio = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO municipio (municipio) VALUES ('${input.municipio}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteMunicipioById = (id, input) => {
    const sqlMunicipio = `DELETE FROM municipio`;
    let sqlById = `${sqlMunicipio} WHERE id_municipio = ${id}`;
    let sql = id? sqlById : sqlMunicipio;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getPeriodosById = (id_periodo) => {
    const sqlPeriodos = `SELECT * FROM periodo`;
    let sqlById = `${sqlPeriodos} WHERE id_periodo = '${id_periodo}'`;
    let sql = id_periodo? sqlById : sqlPeriodos;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updatePeriodoById = (id, input) => {
    const sqlPeriodo = `UPDATE periodo`;
    let sqlById = `${sqlPeriodo} SET ? WHERE id_periodo = ?`;
    let sql = id? sqlById : sqlPeriodo;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newPeriodo = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO periodo (periodo) VALUES ('${input.periodo}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deletePeriodoById = (id, input) => {
    const sqlPeriodo = `DELETE FROM periodo`;
    let sqlById = `${sqlPeriodo} WHERE id_periodo = ${id}`;
    let sql = id? sqlById : sqlPeriodo;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getRequerimientosByParams = (id_requerimiento, requerimiento) => {
    const sqlRequerimientos = `SELECT * FROM requerimiento`;
    let sqlById = `${sqlRequerimientos} WHERE id_requerimiento = '${id_requerimiento}'`;
    let sqlByRequerimiento = `${sqlRequerimientos} WHERE requerimiento LIKE '%${requerimiento}%'`;
    let sql = sqlRequerimientos;
    if(id_requerimiento){
      sql = sqlById;
    } else if(requerimiento) { 
      sql = sqlByRequerimiento;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateRequerimientoById = (id, input) => {
    const sqlRequerimiento = `UPDATE requerimiento`;
    let sqlById = `${sqlRequerimiento} SET ? WHERE id_requerimiento = ?`;
    let sql = id? sqlById : sqlRequerimiento;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newRequerimiento = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO requerimiento (requerimiento) VALUES ('${input.requerimiento}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
 
  let deleteRequerimientoById = (id, input) => {
    const sqlRequerimiento = `DELETE FROM requerimiento`;
    let sqlById = `${sqlRequerimiento} WHERE id_requerimiento = ${id}`;
    let sql = id? sqlById : sqlRequerimiento;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getSalidasByParams = (id_salida, id_usuario, asunto, destinatario, referencia, page = 1, limit = 10, sort = 'fecha', sortorder = 'desc') => {
    const sqlSalidas = `SELECT * FROM salida`;
    let sqlById = `${sqlSalidas} WHERE id_salida = '${id_salida}'`;
    let sqlById_Usuario = `${sqlSalidas} WHERE id_usuario = '${id_usuario}'`;
    let sqlByAsunto = `${sqlSalidas} WHERE asunto LIKE '%${asunto}%'`;
    let sqlByDestinatario = `${sqlSalidas} WHERE destinatario LIKE '%${destinatario}%'`;
    let sqlByReferencia = `${sqlSalidas} WHERE referencia = '${referencia}'`;
    let sql = sqlSalidas;
    if(id_salida){
      sql = sqlById;
    } else if(id_usuario) { 
      sql = sqlById_Usuario;
    }  else if(asunto) { 
      sql = sqlByAsunto;
    }  else if(destinatario) { 
      sql = sqlByDestinatario;
    }  else if(referencia) { 
      sql = sqlByReferencia;
    }
     
    offset = (page - 1) * limit;
    sql = sql + ` ORDER BY ${sort} ${sortorder}  LIMIT ${offset} , ${limit}`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let getSolicitudesByParams = (id_solicitud, solicitud) => {
    const sqlSolicitudes = `SELECT * FROM solicitudes`;
    let sqlById = `${sqlSolicitudes} WHERE id_solicitud = '${id_solicitud}'`;
    let sqlBySolicitud = `${sqlSolicitud} WHERE solicitud LIKE '%${solicitud}%'`;
    let sql = sqlSolicitudes;
    if(id_solicitud){
      sql = sqlById;
    } else if(solicitud) { 
      sql = sqlBySolicitud;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateSolicitudById = (id, input) => {
    const sqlSolicitud = `UPDATE solicitud`;
    let sqlById = `${sqlSolicitud} SET ? WHERE id_solicitud = ?`;
    let sql = id? sqlById : sqlSolicitud;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newSolicitud = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO solicitud (solicitud) VALUES ('${input.solicitud}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };

  let deleteSolicitudById = (id, input) => {
    const sqlSolicitud = `DELETE FROM solicitudes`;
    let sqlById = `${sqlSolicitud} WHERE id_solicitud = ${id}`;
    let sql = id? sqlById : sqlSolicitud;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };  

  let getTasksByParams = (id, title, code) => {
    const sqlTasks = `SELECT * FROM tasks`;
    let sqlById = `${sqlTasks} WHERE id = '${id}'`;
    let sqlByTitle = `${sqlTasks} WHERE title LIKE '%${title}%'`;
    let sqlByCode = `${sqlTasks} WHERE code = '${code}'`;
    let sql = sqlTasks;
    if(id){
      sql = sqlById;
    } else if(title) { 
      sql = sqlByTitle;
    } else if(code) { 
      sql = sqlByCode;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };
  
  let updateTaskById = (id, input) => {
    console.log(input);

    const sqlTask = `UPDATE tasks`;
    let sqlById = `${sqlTask} SET ? WHERE id = ?`;
    let sql = id? sqlById : sqlTask;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };
  
  let newTask = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO tasks (title) VALUES ('${input.title}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteTaskById = (id, input) => {
    const sqlTask = `DELETE FROM tasks`;
    let sqlById = `${sqlTask} WHERE id = ${id}`;
    let sql = id? sqlById : sqlTask;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let getTasksHistByParams = (id, title, code) => {
    const sqlTasks = `SELECT * FROM taskshist`;
    let sqlById = `${sqlTasks} WHERE id = '${id}'`;
    let sqlByTitle = `${sqlTasks} WHERE title LIKE '%${title}%'`;
    let sqlByCode = `${sqlTasks} WHERE code = '${code}'`;
    let sql = sqlTasks;
    if(id){
      sql = sqlById;
    } else if(title) { 
      sql = sqlByTitle;
    } else if(code) { 
      sql = sqlByCode;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };
  
  let updateTaskHistById = (id, input) => {
    console.log(input);

    const sqlTask = `UPDATE taskshist`;
    let sqlById = `${sqlTask} SET ? WHERE id = ?`;
    let sql = id? sqlById : sqlTask;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };
  
  let newTaskHist = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO taskshist (title) VALUES ('${input.title}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteTaskHistById = (id, input) => {
    const sqlTask = `DELETE FROM taskshist`;
    let sqlById = `${sqlTask} WHERE id = ${id}`;
    let sql = id? sqlById : sqlTask;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };


let getUsuariosByParams = (id_usuario, nombres, apellidos, usuario, estado) => {
    const sqlUsuarios = `SELECT * FROM usuario`;
    let sqlById = `${sqlUsuarios} WHERE id_usuario = '${id_usuario}'`;
    let sqlByNombres = `${sqlUsuarios} WHERE nombres LIKE '%${nombres}%'`;
    let sqlByApellidos = `${sqlUsuarios} WHERE apellidos LIKE '%${apellidos}%'`;
    let sqlByUsuario = `${sqlUsuarios} WHERE usuario LIKE '%${usuario}%'`;
    let sqlByEstado = `${sqlUsuarios} WHERE estado LIKE '%${estado}%'`;
   
    let sql = sqlUsuarios;
    if(id_usuario){
      sql = sqlById;
    } else if(nombres) { 
      sql = sqlByNombres;
    }  else if(apellidos) { 
      sql = sqlByApellidos;
    }  else if(usuario) { 
      sql = sqlByUsuario;
    } else if(estado) { 
      sql = sqlByEstado;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
  };

  let updateUsuarioById = (id, input) => {
    const sqlUsuario = `UPDATE usuario`;
    let sqlById = `${sqlUsuario} SET ? WHERE id_usuario = ?`;
    let sql = id? sqlById : sqlUsuario;
    return new Promise((resolve, reject) => {
        connection.query(sql,[input,id], (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

  let newUsuario = (input) => {
    //console.log(input.author);
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO usuario (usuario) VALUES ('${input.usuario}')`;
        connection.query(sql, (err, results) => {
            if (err) reject(console.log(err));
            resolve(results);
        });
    });
  };
  
  let deleteUsuarioById = (id, input) => {
    const sqlUsuario = `DELETE FROM usuario`;
    let sqlById = `${sqlUsuario} WHERE id_usuario = ${id}`;
    let sql = id? sqlById : sqlUsuario;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(console.log(results));
        });
    });
  };

const resolvers = {

  Query: {
    ver: () => {
      return {
        api: "GPQL Ver 1.03", 
        database: "edictus", 
        api: "https://edictus.herokuapp.com/graphql",
        dev: "Lic. Ronald Avenda??o", 
        dbd: "https://dbdiagram.io/d/5f587f1288d052352cb67c62",
        cli: "https://ravendano014.github.io/edictuscli/",
        doc: "https://github.com/ravendano014/edictus-doc",
        git: "https://github.com/ravendano014/react-edictus"};
    },

    getActos: (obj, {id_acto}) => {
      return getActosById(id_acto).then(rows => rows);
    },

    getBitacoras: (obj, {id_bitacora}) => {
      return getBitacorasById(id_bitacora).then(rows => rows);
    },

    getCostos: (obj, {id_medio, factura, programacion, id_estado}) => {
      return getCostosByParams(id_medio, factura, programacion, id_estado).then(rows => rows);
    },

    getDepartamentos: (obj, {id_departamento, departamento}) => {
      return getDepartamentosByParams(id_departamento, departamento).then(rows => rows);
    },

    getDependencias: (obj, {id_dependencia, dependencia, id_municipio, id_materia, email}) => {
      return getDependenciasByParams(id_dependencia, dependencia, id_municipio, id_materia, email).then(rows => rows);
    },

    getEdictos: (obj, {id_edicto, nu,  imputado, referencia, page, limit, sort, sortorder}) => {
      return getEdictosByParams(id_edicto, nu, imputado, referencia, page, limit, sort, sortorder).then(rows => rows);
    },

    getEpicas: (obj, {id_epica}) => {
      return getEpicasById(id_epica).then(rows => rows);
    },

    getEstados: (obj, {id_estado, estado}) => {
      return getEstadosByParams(id_estado, estado).then(rows => rows);
    },

    getEtapas: (obj, {id_etapa, etapa}) => {
      return getEtapasByParams(id_etapa, etapa).then(rows => rows);
    },

    getImputados: (obj, {id_imputado, nombres_imputado, apellidos_imputado}) => {
      return getImputadosByParams(id_imputado, nombres_imputado, apellidos_imputado).then(rows => rows);
    },

    getMaterias: (obj, {id_materia, materia}) => {
      return getMateriasByParams(id_materia, materia).then(rows => rows);
    },

    getMedios: (obj, {id_medio, medio}) => {
      return getMediosByParams(id_medio, medio).then(rows => rows);
    },

    getActo: (obj,{id}) => {
      return getActoById(id).then(rows => rows);
    },

    getMetas: (obj, {id_meta, meta, periodo}) => {
      return getMetasByParams(id_meta, meta, periodo).then(rows => rows);
    },

    getMunicipios: (obj, {id_municipio, municipio, id_departamento}) => {
      return getMunicipiosByParams(id_municipio, municipio, id_departamento).then(rows => rows);
    },

    getPeriodos: (obj, {id_periodo}) => {
      return getPeriodosById(id_periodo).then(rows => rows);
    },

    getRequerimientos: (obj, {id_requerimiento, requerimiento}) => {
      return getRequerimientosByParams(id_requerimiento, requerimiento).then(rows => rows);
    },

    getSalidas: (obj, {id_salida, id_usuario, asunto, destinatario, referencia, page, limit, sort, sortorder}) => {
      return getSalidasByParams(id_salida, id_usuario, asunto, destinatario, referencia, page, limit, sort, sortorder).then(rows => rows);
    },

    getSolicitudes: (obj, {id_solicitud, solicitud, referencia}) => {
      return getSolicitudesByParams(id_solicitud, solicitud, referencia).then(rows => rows);
    },

    getTasks: (obj, {id, title, code}) => {
      return getTasksByParams(id, title, code).then(rows => rows);
    },

    getTasksHist: (obj, {id, title, code}) => {
      return getTasksHistByParams(id, title, code).then(rows => rows);
    },

    getUsuarios: (obj, {id_usuario, nombres, apellidos, usuario, estado}) => {
      return getUsuariosByParams(id_usuario, nombres, apellidos, usuario, estado).then(rows => rows);
    },

    notifications: () => notifications

  },
  Edicto: {
    estados: (parent, args, ctx, info) => {
      return getEstadosByParams(parent.id_estado).then(rows => rows);
     },
    dependencias: (parent, args, ctx, info) => {
      return getDependenciasByParams(parent.id_dependencia).then(rows => rows);
     },
    etapas: (parent, args, ctx, info) => {
     return getEtapasByParams(parent.id_etapa).then(rows => rows);
    }, 
    imputados: (parent, args, ctx, info) => {
      return getEtapasByParams(parent.id_etapa).then(rows => rows);
     }, 
    asignados: (parent, args, ctx, info) => {
      return getUsuariosByParams(parent.id_asignado).then(rows => rows);
     }, 
    asignados_por: (parent, args, ctx, info) => {
      return getUsuariosByParams(parent.asignado_por).then(rows => rows);
     }, 
    materias: (parent, args, ctx, info) => {
      return getMateriasByParams(parent.id_materia).then(rows => rows);
     }, 
    actos: (parent, args, ctx, info) => {
      return getActosById(parent.id_acto).then(rows => rows);
     }, 
    medios: (parent, args, ctx, info) => {
      return getMediosByParams(parent.id_medio).then(rows => rows);
     }, 
    finalizados_por: (parent, args, ctx, info) => {
      return getUsuariosByParams(parent.finalizado_por).then(rows => rows);
     }, 
    creados_por: (parent, args, ctx, info) => {
      return getUsuariosByParams(parent.creado_por).then(rows => rows);
     }, 
    modificados_por: (parent, args, ctx, info) => {
      return getUsuariosByParams(parent.modificado_por).then(rows => rows);
     }, 
    periodos: (parent, args, ctx, info) => {
      return getPeriodosById(parent.id_periodo).then(rows => rows);
     }, 
  },
  Departamento: {
    municipios: (parent) => {
      //console.log(parent);
          return getMunicipiosbyDepartamento(parent.id_departamento).then(rows => rows);
        }
  },
  Dependencia: {
    municipios: (parent, args, ctx, info) => {
      return getMunicipiosByParams(parent.id_municipio).then(rows => rows);
     }, 
    materias: (parent) => {
      return getMateriasByParams(parent.id_materia).then(rows => rows);
     }, 
  },
  Municipio: {
    departamentos: (parent, args, ctx, info) => {
      return getDepartamentosByParams(parent.id_departamento).then(rows => rows);
     },
  },
  Salida: {
    async usuarios(parent){
      return await getUsuariosByParams(parent.id_usuario).then(rows => rows);
     },

  },
  
  Mutation: {

    // Sample call on GraphQL
    //mutation {
    //  addActo(input: {
    //    acto: "Acto string value",
    //  }) {
    //    id
    //  }
    //}

    //Sample call on GraphQL
    //mutation {
    //  updActo(id: 1, input: {acto: "Testing acto"}) {
    //    id
    //    acto
    //  }
    //}

    addActo: async (_,{input}) => {
      const newId = await newActo(input).then(rows => rows.insertId);
      return "Acto Saved";
    },

    updActo: async (_,{id, input}) => {
      await updateActoById(id, input);
      return "Acto Updated";
    },

    delActo: async (_,{id}) => {
      await deleteActoById(id);
      return "Acto Deleted";
    },

    addDepartamento: async (_,{input}) => {
      const newId = await newDepartamento(input).then(rows => rows.insertId);
      return "Departamento Saved";
    },
  
    updDepartamento: async (_,{id, input}) => {
      await updateDepartamentoById(id, input);
      return "Departamento Updated";
    },

    delDepartamento: async (_,{id}) => {
      await deleteDepartamentoById(id);
      return "Departamento Deleted";
    },

    addDependencia: async (_,{input}) => {
      const newId = await newDependencia(input).then(rows => rows.insertId);
      return "Dependencia Saved";
    },
  
    updDependencia: async (_,{id, input}) => {
      await updateDependenciaById(id, input);
      return "Dependencia Updated";
    },
  
    delDependencia: async (_,{id}) => {
      await deleteDependenciaById(id);
      return "Dependencia Deleted";
    },

    addEstado: async (_,{input}) => {
      const newId = await newEstado(input).then(rows => rows.insertId);
      return "Estado Saved";
    },
  
    updEstado: async (_,{id, input}) => {
      await updateEstadoById(id, input);
      return "Estado Updated";
    },

    delEstado: async (_,{id}) => {
      await deleteEstadoById(id);
      return "Estado Deleted";
    },

    addEtapa: async (_,{input}) => {
      const newId = await newEtapa(input).then(rows => rows.insertId);
      return "Etapa Saved";
    },
  
    updEtapa: async (_,{id, input}) => {
      await updateEtapaById(id, input);
      return "Etapa Updated";
    },

    delEtapa: async (_,{id}) => {
      await deleteEtapaById(id);
      return "Etapa Deleted";
    },

    addMateria: async (_,{input}) => {
      const newId = await newMateria(input).then(rows => rows.insertId);
      return "Materia Saved";
    },
  
    updMateria: async (_,{id, input}) => {
      awaitupdateMateriaById(id, input);
      return "Materia Updated";
    },
    
    delMateria: async (_,{id}) => {
      await deleteMateriaById(id);
      return "Materia Deleted";
    },

    addMedio: async (_,{input}) => {
        const newId = await newMedio(input).then(rows => rows.insertId);
        return "Medio Saved";
    },

    updMedio: async (_,{id, input}) => {
      await updateMedioById(id, input);
      return "Medio Updated";
    },

    delMedio: async (_,{id}) => {
      await deleteMedioById(id);
      return "Medio Deleted";
    },

    addMeta: async (_,{input}) => {
      const newId = await newMeta(input).then(rows => rows.insertId);
      return "Meta Saved";
    },

    updMeta: async (_,{id, input}) => {
      await updateMetaById(id, input);
      return "Meta Updated";
    },

    delMeta: async (_,{id}) => {
      await deleteMetaById(id);
      return "Meta Deleted";
    },

    addMunicipio: async (_,{input}) => {
      const newId = await newMunicipio(input).then(rows => rows.insertId);
      return "Municipio Saved";
    },
  
    updMunicipio: async (_,{id, input}) => {
      await updateMunicipioById(id, input);
      return "Municipio Updated";
    },

    delMunicipio: async (_,{id}) => {
      await deleteMunicipioById(id);
      return "Municipio Deleted";
    },
  
    addPeriodo: async (_,{input}) => {
      const newId = await newPeriodo(input).then(rows => rows.insertId);
      return "Periodo Saved";
    },

    updPeriodo: async (_,{id, input}) => {
      await updatePeriodoById(id, input);
      return "Periodo Updated";
    },

    delPeriodo: async (_,{id}) => {
      await deletePeriodoById(id);
      return "Periodo Deleted";
    },

    addTask: async (_,{input}) => {
      const newId = await newTask(input).then(rows => rows.insertId);
      return "Task Saved";
    },
  
    updTask: async (_,{id, input}) => {
      await updateTaskById(id, input);
      return "Task Updated";
    },
    
    delTask: async (_,{id}) => {
      await deleteTaskById(id);
      return "Task Deleted";
    },

    addTaskHist: async (_,{input}) => {
      const newId = await newTaskHist(input).then(rows => rows.insertId);
      return "Task Saved";
    },
  
    updTaskHist: async (_,{id, input}) => {
      await updateTaskHistById(id, input);
      return "Task Updated";
    },
    
    delTaskHist: async (_,{id}) => {
      await deleteTaskHistById(id);
      return "Task Deleted";
    },

    addUsuario: async (_,{input}) => {
      const newId = await newUsuario(input).then(rows => rows.insertId);
      return "Usuario Saved";
    },
  
    updUsuario: async (_,{id, input}) => {
      await updateUsuarioById(id, input);
      return "Usuario Updated";
    },

    delUsuario: async (_,{id}) => {
      await deleteUsuarioById(id);
      return "Usuario Deleted";
    },

    pushNotification: (root, args) => {
      const newNotification = { label: args.label };
      //notifications.push(newNotification);
      //pubsub.publish(NOTIFICATION_SUBSCRIPTION_TOPIC, { newNotification: newNotification });

      return newNotification;
    },

  },
  Subscription: {
    newNotification: {
      //subscribe: () => pubsub.asyncIterator(NOTIFICATION_SUBSCRIPTION_TOPIC)
    }
  },

};


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

var mysql      = require('mysql');  
//const { genKey } = require('./apikeys');
var connection = mysql.createConnection({  
  host     : process.env.host_db,  
  user     : process.env.user_db,  
  password : process.env.password_db,  
  database : process.env.name_db,    
});        

// for API Rest traditional use Morgan to log url and method
app.use((req, res, next) => {
  if(req.url != '/favicon.ico'){
    // console.log(`log: request url: ${req.url} method: ${req.method}`);
  }
  next();
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

// RESTFUL Endpoints
app.use("/actos",require('./routes/actos'));
app.use("/departamentos",require('./routes/departamentos'));
app.use("/dependencias",require('./routes/dependencias'));
app.use("/edictos",require('./routes/edictos'));
app.use("/estados",require('./routes/estados'));
app.use("/etapas",require('./routes/etapas'));
app.use("/materias",require('./routes/materias'));
app.use("/medios",require('./routes/medios'));
app.use("/metas",require('./routes/metas'));
app.use("/municipios",require('./routes/municipios'));
app.use("/periodos",require('./routes/periodos'));
app.use("/requerimientos",require('./routes/requerimientos'));
app.use("/solicitudes",require('./routes/solicitudes'));
app.use("/tasks",require('./routes/tasks'));
app.use("/taskshist",require('./routes/taskshist'));
app.use("/cafs",require('./routes/cafs'));
app.use("/items",require('./routes/items'));
app.use("/usuarios",require('./routes/usuarios'));
app.use("/api",require('./routes/api'));

// V1 API Versioning
app.use("/v1/actos",require('./routes/actos'));
app.use("/v1/departamentos",require('./routes/departamentos'));
app.use("/v1/dependencias",require('./routes/dependencias'));
app.use("/v1/edictos",require('./routes/edictos'));
app.use("/v1/estados",require('./routes/estados'));
app.use("/v1/etapas",require('./routes/etapas'));
app.use("/v1/materias",require('./routes/materias'));
app.use("/v1/medios",require('./routes/medios'));
app.use("/v1/metas",require('./routes/metas'));
app.use("/v1/municipios",require('./routes/municipios'));
app.use("/v1/periodos",require('./routes/periodos'));
app.use("/v1/requerimientos",require('./routes/requerimientos'));
app.use("/v1/solicitudes",require('./routes/solicitudes'));
app.use("/v1/tasks",require('./routes/tasks'));
app.use("/v1/taskshist",require('./routes/taskshist'));
app.use("/v1/cafs",require('./routes/cafs'));
app.use("/v1/items",require('./routes/items'));
app.use("/v1/usuarios",require('./routes/usuarios'));

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0 testing",
      title: "edictus API",
      description: "edictus API Information",
      contact: {
        name: "Lic. Ronald Avenda??o"
      },
      servers: ["https://edictus.herokuapp.com"]
    }
  },
  components: {
  securitySchemes: {
    BasicAuth: {
      type: "http",
      scheme: "basic" }},
  security: {
      BasicAuth: [] }
  },
  // ['.routes/*.js']
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('*', (req, res) => {
  res.status(404).end(app.get('appName')+': {"message": "404 Not found"}');
})

// 202 Solictud recibida en proceso
// 401 No autorizado
// 405 Metodo no permitido

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log('App:', app.get('appName'));
  console.log(`Server on port ${app.get('port')}`);
});

