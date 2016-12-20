/*
 * Función para incluir dos digitos en el dia y fecha
 * @param {type} dato
 * @returns {listarAsientos.operacionesAsientoDiarioJS_L251.digitosFecha.digito|String}
 */
function digitosFecha(datoFecha) {
    var digitos = new String(datoFecha);
    if (digitos.length < 2)
        digitos = '0' + datoFecha;
    return digitos;
}


/* 
 * Configuro el servidor NODE.JS
 */

// Defino las variables importando los módulos correspondientes de NODE
var http = require('http'),     // Modulo HTTP
        fs = require('fs'),     // Modulo FS (administración de archivos)
        mysql = require('mysql'),   // Modulo MYSQL
        PORT = 2500;                // Puerto de acceso al servidor


// Configuro las variables del servidor MYSQL
var conexionBD = mysql.createConnection({
    'user' : 'reg.negreira',
    'password' : 'abc123.',
    'host' : 'localhost',
    'port' : 3306
});


/* 
 * Creo la variable servidor Web.
 * Pasamos como parametros:
 *      "req" (nuestro  CallBack), que es la  funcion que se ejecuta cada  vez que
 *             se lance el evento create (cada vez que  apuntemos a  nuestra pagina web)
 *      "res" que es la que nos da la oportunidad de responder a la peticion de
 *            nuestro "req"
 */
var server = http.createServer(function (req, res){    
    
    fs.readFile("../index.php", function (error, datos){
        if (error)   // Si tenemos un error nos lo muestra
            throw error;
        
        /*
         * La funcion writeHead tiene dos parametros, el primero indica el codigo
         * de la respuesta, y el segungo el tipo de documento.
         * (El codigo 200 en http significa -> OK, el tipo de documento es texto plano en formato html)
         */
        
        res.writeHead(200, {
            "Content-type": "text/html"
        });
        
        // Enviará como resultado una respuesta
        res.write("<h3>Servidor NODE activado...</h3>");
        // Terminamos la respuesta
        res.end();
    });   
    
}).listen(PORT); // El servidor escucha por el puerto que asignemos


// Incluimos la librería para permitir manejar eventos en tiempo real
var io = require('socket.io').listen(server);

// Creo un evento que escucha la conexión
io.sockets.on("connection", function (socket){
    
    
    // Creo un evento que escucha la petición "buscaUsuarios"
    socket.on('buscaUsuarios', function () {
        
        // Base de datos que usaremos
        conexionBD.query("USE negreira");
        
        // Realizamos la consulta para obtener los usuarios
        conexionBD.query("SELECT id, nombre, rol FROM usuarios WHERE activo = '1' ORDER BY nombre", function (error, respuesta) {
            // Si tenemos un error en la consulta cerramos la conexión
            if (error) {
                conexionBD.end();
                return;
            }
            // Defino un evento "usuarios" que envía la respuesta de la consulta si es llamdo desde el cliente
            socket.emit("usuarios", respuesta);
            var miHora = new Date();
            console.log("buscando USUARIOS..." + digitosFecha(miHora.getHours()) + ":" + digitosFecha(miHora.getMinutes()) + "h");
        });

    });
        
   // Creo un evento que escucha la petición "buscaDiarios"
    socket.on('buscaDiarios', function () {
        
        // Base de datos que usaremos
        conexionBD.query("USE diariosparalelos");
        
        // Realizamos la consulta en la base de datos para obtener los DIARIOS
        conexionBD.query("SELECT id, diario, asientos, fechaAsiento, fechaCreacion, usuarioCreacion, cerrado FROM diarios ORDER BY diario DESC", function (error, respuesta) {
            // Si tenemos un error en la consulta cerramos la conexión
            if (error) {
                conexionBD.end();
                return;
            }
            // Defino un evento "diarios" que envía la respuesta de la consulta si es llamdo desde el cliente
            socket.emit("diarios", respuesta);
            var miHora = new Date();
            console.log("buscando DIARIOS..." + digitosFecha(miHora.getHours()) + ":" + digitosFecha(miHora.getMinutes()) + "h");            
        });

    });
    
    
});

console.log("Servidor iniciado en el puerto: " + PORT);