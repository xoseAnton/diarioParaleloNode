// Variables globales
var opcionesConsulta;   // Contiene las opciones seleccionadas del listado
var usuarios; // Contiene los usuarios definidos
var miID;   // Contiene la variable de control del asiento seleccionado
var datosGrabar; // Contienen los datos que se quieren modificar
var pendienteGrabar = false;
var asientoInicial; // Contiene un objeto con los datos iniciales del asiento que se modifica


/*
 * Función que introduce los usuarios activos definidos en la base de datos
 * en un "select". Si estamos identificados selecciona por defecto el usuario.
 * @returns Lista de usuarios de la base de datos
 */
function listarUsuarios() {    
    // Enviamos la solicitud ajax a la página del servidor
    $.ajax({
        url: "./miAjax/listarUsuarios.php",
        type: 'POST',
        dataType: 'json',        
    }).done(function (resultado){        
        // Guardamos la consulta en la variable global
        usuarios = resultado;
        // Recorro todos los valores optenidos
        for (var i in usuarios) {
            if(usuarios[i].porDefecto == true)
                $("#usuario").append("<option value='" + usuarios[i].nombre + "' selected='true'>" + usuarios[i].nombre + "</option>");
            else
                $("#usuario").append("<option value='" + usuarios[i].nombre + "'>" + usuarios[i].nombre + "</option>");
        }
    }).fail(function() {
         alert("No su pudo listar los USUARIOS de la base de datos!");
    });         
}


/*
 * Función que introduce los diarios activos definidos en la base de datos
 * en un "select". Selecciona por defecto el último diario.
 * @returns Lista de los diarios activos de la base de datos.
 */
function listarDiarios() {
    
    // Solicito el evento para buscar diarios en el servidor
    conexionNode.emit("buscaDiarios");    
    // En la conexión NODE creada escucho un evento llamado "diarios" con la respuesta   
    conexionNode.on("diarios", function (diarios){        
        for (var i in diarios) {
            // Solo introducimos los diarios activos
            if (diarios[i].cerrado == 1)
                $("#diario").append("<option value='" + diarios[i].diario + "'>" + diarios[i].diario + "</option>");
        }
    });
    
}


/*
 * Función para guardar los datos introducidos en un asiento.
 * @returns {undefined}
 */
function guardarDatosAsientos(){
    
    // Recuperamos los datos a guardar   
    var asiento = $(miID+" label.mostraAsiento").data("asiento");
    var diario = $(miID+" label.mostraAsiento").data("diario");
    var fecha = $(miID+" label.mostrarFecha").data("fechaasiento");
    var situacion = $(miID+" input.textoSituacion").val();
    var incidencia = $(miID+" input.textoIncidencia").val();
    var otroTexto = $(miID+" input.textoOtros").val();
    var asignado = $(miID+" input.asignado").val(); 
    var cerrado;    
    if ($(miID + " input.checkActivo").is(':checked')) {
        cerrado = 1;
    } else {
        cerrado = 0;
    }
    
    // Inicializamos el array
    datosGrabar = new Array(); 
        
    // Definimos el array JSON con los indices
    datosGrabar = {asiento: asiento , diario: diario, fecha: fecha, situacion: situacion, incidencia: incidencia, otroTexto: otroTexto, asignado: asignado, cerrado: cerrado};
    
    $.ajax({
        url: "./miAjax/grabarDatosAsientos.php",
        type: 'POST',
        dataType: 'json',
        data: {datos: datosGrabar}
    }).done(function (resultado){
        if (resultado.grabado == true) {
                        
            // Elimino los elementos creados especificamente para modificar datos
            $(".campoPendienteGrabar, .botonGuardar, .botonCerrar, .botonAsignado, .contenAsignadoUsuario").remove();
            
            // Avisamos de que los datos se grabaron correctamente
            avisoDatosGrabados();

            // Introduzco nuevamente solo lectura en los campos        
            $(miID + " .textoSituacion," + miID + " .textoIncidencia," + miID + " .textoOtros").attr("readonly", true);
            // Desabilito el "checkActivo"
            $(miID + " .checkActivo").attr("disabled", true);
            
            // Muestro el borde en verde del asiento seleccionado
            $(miID + " .contenAsiento, " + miID + " .contenDatos").css("border-color", "green");
            $(miID + " .contenBotonsBaixo").css("border-top-color", "green");            
            
            // Pasados 2 segundo ocultamos el aviso y habilitamos los campos
            setTimeout(function () {                
                //LLamamos a la función para activar campos
                activarCampos();

                // Muestro el borde con otro color inidicando que fué modificado
                $(miID + " .contenAsiento, " + miID + " .contenDatos").css("border-color", "orange");
                $(miID + " .contenBotonsBaixo").css("border-top-color", "orange");

                // Elimino el resto de elementos creados especificamente para modificar datos
                $(".campoAvisoGrabado, #bloqueInformaSuperior, #bloqueInformaInferior").remove();

                // Muestro nuevamente los botones de abrir/información
                $(miID + " .botonAbrir").css("display", "");
                $(miID + " .botonDetalle").css("display", "");

                //Mostramos la barra de desplazamiento
                $("#zonaRelacionAsientos").css("overflow-y", "");

            }, 2000);
            
        } else {
            alert("No su pudo grabar las modificaciones!");            
        }
    }).fail(function() {
         alert("No su pudo grabar las modificaciones!");        
    });
}
   
   
/*
 * Función para guardar los datos actuales de un detalle de asiento 
 * seleccionado.
 * 
 * @returns {undefined}
 */ 
 function guardarDatosActuales() {
     
    // Recuperamos los datos a guardar   
    var asiento = $(miID).data("asiento");
    var diario = $(miID).data("diario");
    var fecha = $(miID+" label.mostrarFecha").data("fechaasiento");
    var situacion = $(miID+" input.textoSituacion").val();
    var incidencia = $(miID+" input.textoIncidencia").val();
    var otroTexto = $(miID+" input.textoOtros").val();
    var asignado = $(miID+" input.asignado").val(); 
    var cerrado;    
    if ($(miID + " input.checkActivo").is(':checked')) {
        cerrado = 1;
    } else {
        cerrado = 0;
    }
    
    // Vaciamos los datos de informes anteriores
    $("#zonaInfoAsientos").empty();
        
    // Añadimos el campo para el título y los datos:
    $("#zonaInfoAsientos").append("<legend id='legendInfoAsientos'></legend><div id='zonaRelacionInfoAsientos'></div>");
    
    // Inicializamos el array
    datosGrabar = new Array(); 
        
    // Definimos el array JSON con los indices
    datosGrabar = {asiento: asiento , diario: diario, fecha: fecha, situacion: situacion, incidencia: incidencia, otroTexto: otroTexto, asignado: asignado, cerrado: cerrado};
    
    $.ajax({
        url: "./miAjax/grabarDatosAsientos.php",
        type: 'POST',
        dataType: 'json',
        data: {datos: datosGrabar}
    }).done(function (resultado){
        if (resultado.grabado == true) {
            
            // Realizamos la nueva consulta para enseñar los datos nuevos
            informeAsiento(datosGrabar);
            
            // Realizamos una pausa para que cargue todos los elementos del informe del asiento
            setTimeout(function (){
                // Creo el ID del primer elemento (que se creo al grabar)
                miID = "#zonaAsientoID0";
                
                // Muestro el borde en verde del asiento seleccionado
                $(miID + " .contenInfoAsiento, " + miID + " .contenDatos").css("border-color", "green");
                $(miID + " .contenInfoBotonsBaixo").css("border-top-color", "green");
                
                 /* Introduzco un campo en la parte superior e inferior del asiento para mostrar
                 * posibles mensajes (y destacar el asiento que se modifica).
                 */
                $(miID).before("<div id='bloqueInformaSuperior' class='bloquePendienteGrabar'></div>");
                $(miID).after("<div id='bloqueInformaInferior' class='bloquePendienteGrabar'></div>");
                
                // Avisamos de que los datos se grabaron correctamente
                avisoDatosGrabados();                
                
                // Actualizamos los nuevos datos en la lista de asientos
                asientoInicial.actualizarDatosAsiento(situacion, asignado, incidencia, otroTexto, cerrado);
                
                // Pasados 2 segundo ocultamos el aviso y habilitamos los campos
                setTimeout(function () {
                    
                    // Muestro el borde original del elemento                 
                    $(miID + " .contenInfoAsiento, " + miID + " .contenDatos").css("border", "");
                    $(miID + " .contenInfoBotonsBaixo").css("border-top", "");

                    // Elimino el resto de elementos creados especificamente para modificar datos
                    $(".campoAvisoGrabado, #bloqueInformaSuperior, #bloqueInformaInferior").remove();

                    // Muestro el boton de cerrar la información de los asientos
                    $("#botonCerrarInfo").css("display", "block");

                    //Mostramos la barra de desplazamiento
                    $("#zonaRelacionInfoAsientos").css("overflow-y", "");

                }, 2000);
            }, 100);

        } else {
            alert("No su pudo grabar las modificaciones!");
        }
    }).fail(function() {
         alert("No su pudo grabar las modificaciones!");   
    });
}


/*
 * Establece los eventos del formularío de busqueda
 * @returns {undefined}
 */
function establecerEventosFormularioBusqueda(){
    $(".contenedorBusqueda").on('focus mouseenter', '*', function() {
        mostrarBordeContenBusqueda(this);
    });
    
    $(".contenedorBusqueda").on('focusout mouseleave', '*', function() {
        ocultarBordeContenBusqueda(this);
    });    
    
    $("#zonaMostrarDatos").on('click', '.checkActivo', function() {
        if ($(this).is(':checked')) {
            $(this).css("outline", "4px solid green");
        } else {
            $(this).css("outline", "4px solid red");
        }
    });
}


/*
 * Fución que valida los datos introducidos en la zona "Listar por:"
 * @returns {Boolean}
 */
function validarDatosListar(){
    // Variable de control
    var validado = true;
    // Inicializamos el array
    opcionesConsulta = new Array(); 
        
    // Definimos el array JSON con los indices
    opcionesConsulta = {diario:[], asiento:[], fecha:[], texto:[], usuario:[], fechaModifica:[], horaModifica:[], buscaCerrados:[], buscaTodos:[], buscaActivos:[]};
    
    
    // Valido el diario
    var miDiario = $("#diario").val();      
    if (isNaN(miDiario) || miDiario == "" || miDiario == true) {
        validado = false;   // Cambiamos la variable de control
        // Mostramos el error            
        $("#diario").focus().after("<span class='campoError'>Diario incorrecto!</span>");       
    }
    else { //Guardamos la opción
        opcionesConsulta.diario.push({seleccionado: "si", valor: miDiario});
    }
    
    
    // Valido el asiento si esta seleccionado
    if(validado && $("#buscaPorAsiento").is(':checked')){
        // Recupero el valor introducido
        var miAsiento = $("#asiento").val();         
         if (isNaN(miAsiento) || miAsiento < 1 || miAsiento == "") {
            validado = false;   // Cambiamos la variable de control            
            // Mostramos el error            
            $("#asiento").focus().after("<span class='campoError'>Asiento incorrecto!</span>");
        }
        else {//Guardamos la opción            
            opcionesConsulta.asiento.push({seleccionado: "si", valor: miAsiento});
        }
    }
    else {//Guardamos la opción        
        opcionesConsulta.asiento.push({seleccionado: "no", valor: ""});
    }
    
    
    // Valido la fecha de asiento si esta seleccionado
    if(validado && $("#buscaPorFecha").is(':checked')){
        // Recupero el valor introducido
        var miFecha = new Date($("#fecha").val());         
         // Compruebo que el formato introducido de la fecha es correcto
        if ((miFecha.getDate()<1 || miFecha.getDate()>31) || ((miFecha.getMonth()+1)<1 || (miFecha.getMonth()+1)>12) || miFecha.getFullYear()<2016 || $("#fecha").val()=="") {
            validado = false;   // Cambiamos la variable de control            
            // Mostramos el error            
            $("#fecha").focus().after("<span class='campoError'>Fecha no valida!</span>");
        }
        else {//Guardamos la opción
            opcionesConsulta.fecha.push({seleccionado: "si", valor: $("#fecha").val()}); 
        }
    }
    else {//Guardamos la opción
        opcionesConsulta.fecha.push({seleccionado: "no", valor: ""});         
    }
    
    
    // Valido que tengamos texto de búsqueda
    if(validado && $("#buscaPorTexto").is(':checked')){
        // Recupero el valor introducido
        var miTexto = new String($("#textoBusca").val());
        
        /* Expresión regular para encontrar espacios en blanco: (uno o más) */
        var cadena = /^\s+$/;
        // Compruebo la expresión. Coincide = true
        var compruebo = miTexto.match(cadena) ? true : false;
        
         // Compruebo si no está vacío
        if (miTexto.length == 0 || miTexto == null || compruebo) {
            validado = false;   // Cambiamos la variable de control            
            // Mostramos el error            
            $("#textoBusca").focus().after("<span class='campoError'>Introduce algún texto!</span>");
        }
        else {//Guardamos la opción            
            opcionesConsulta.texto.push({seleccionado: "si", valor: miTexto});
        }
    }
    else {//Guardamos la opción
        opcionesConsulta.texto.push({seleccionado: "no", valor: ""});        
    }
    
    
    // Valido que tengamos texto, usuarios, en el campo "asignado"
    if(validado && $("#buscaPorUsuario").is(':checked')){
        // Recupero el valor introducido
        var miUsuario = new String($("#usuario").val());
        
        /* Expresión regular para encontrar espacios en blanco: (uno o más) */
        var cadena = /^\s+$/;
        // Compruebo la expresión. Coincide = true
        var compruebo = miUsuario.match(cadena) ? true : false;
        
         // Compruebo si no está vacío
        if (miUsuario.length == 0 || miUsuario == null || compruebo) {
            validado = false;   // Cambiamos la variable de control            
            // Mostramos el error            
            $("#usuario").focus().after("<span class='campoError'>No existe usuario!</span>");
        }
        else {//Guardamos la opción
            opcionesConsulta.usuario.push({seleccionado: "si", valor: miUsuario});            
        }
    }
    else {//Guardamos la opción
        opcionesConsulta.usuario.push({seleccionado: "no", valor: ""});
    }
    
    
    // Valido la fecha y hora de modificación introducida
    if(validado && $("#buscaPorFechaModifica").is(':checked')){
        // Recupero el valor introducido
        var miFecha = new Date($("#fechaModifica").val());                 
        
         // Compruebo que el formato introducido de la fecha es correcto
        if ((miFecha.getDate()<1 || miFecha.getDate()>31) || ((miFecha.getMonth()+1)<1 || (miFecha.getMonth()+1)>12) || miFecha.getFullYear()<2016 || $("#fechaModifica").val()=="") {
            validado = false;   // Cambiamos la variable de control            
            // Mostramos el error            
            $("#fechaModifica").focus().after("<span class='campoError'>Fecha no valida!</span>");
        }
        else { // Compruebo la hora
            // Recupero el valor introducido
            var horaMinutos = $("#horaModifica").val();
            if (horaMinutos == "") {
                validado = false;   // Cambiamos la variable de control
                // Mostramos el error            
                $("#horaModifica").focus().after("<span class='campoError'>Hora no valida!</span>");
            }
            else { // Compruebo que la hora introducida esté en los intervalos                
                var datosHora = horaMinutos.split(":");
                // Convierto a entero los datos optenidos
                var miHora = parseInt(datosHora[0]);
                var miMinuto = parseInt(datosHora[1]);                
                
                if ((miHora < 0 || miHora > 23) || (miMinuto < 0 || miMinuto > 59)) {
                    validado = false;   // Cambiamos la variable de control
                    // Mostramos el error            
                    $("#horaModifica").focus().after("<span class='campoError'>Fecha no valida!</span>");
                }
                else {//Guardamos la opción
                    opcionesConsulta.fechaModifica.push({seleccionado: "si", valor: $("#fechaModifica").val()}); 
                    opcionesConsulta.horaModifica.push({seleccionado: "si", valor: horaMinutos});                                         
                }
            }
        }
    }
    else {
        //Guardamos la opción
        opcionesConsulta.fechaModifica.push({seleccionado: "no", valor: ""}); 
        opcionesConsulta.horaModifica.push({seleccionado: "no", valor: ""});
    }
    
    // Busca por asientos ACTIVOS/CERRADOS/TODOS
    if ($("#buscaCerrados").is(':checked')) { // Asientos cerrados
        opcionesConsulta.buscaCerrados.push({seleccionado: "si", valor: ""});
        opcionesConsulta.buscaTodos.push({seleccionado: "no", valor: ""});
        opcionesConsulta.buscaActivos.push({seleccionado: "no", valor: ""});
    } else if ($("#buscaTodos").is(':checked')) { // Todos los asientos
        opcionesConsulta.buscaTodos.push({seleccionado: "si", valor: ""});
        opcionesConsulta.buscaCerrados.push({seleccionado: "no", valor: ""});
        opcionesConsulta.buscaActivos.push({seleccionado: "no", valor: ""});
    } else { // Por defecto buscamos los asientos activos
        opcionesConsulta.buscaActivos.push({seleccionado: "si", valor: ""});
        opcionesConsulta.buscaCerrados.push({seleccionado: "no", valor: ""});
        opcionesConsulta.buscaTodos.push({seleccionado: "no", valor: ""});
    }
    
    // Devolvemos el resultado
    if(validado){
        return validado;
    }
    else {
        // Ocultamos los errores pasados 3 segundos.
        setTimeout("$('.campoError').hide('slow');", 2000);       
    }
}


/*
 * Función para consultar en la base de datos los datos de los asientos.
 * @param {type} consulta
 * @returns {Muestra la informacion de los asientos según la consulta}
 */

function listarAsientos(consulta){     
    
    // Añadimos la imagen de "trabajando"
    $("#zonaMostrarDatos").append("<img class='contenTrabajando' src='./imagenes/trabajando.gif'/>");
    
    $.ajax({
        url: "./miAjax/listarAsientos.php",
        type: 'POST',
        dataType: 'json',
        data: {opciones: consulta}
    }).done(function (asientos){
        
        // Calculo el número de elementos recibidos
        var numeroAsientos = Object.keys(asientos).length;

        if (numeroAsientos == 0) {
            $("#zonaRelacionAsientos").append(
                // Zona para mostrar que no existen datos -->
                "<div id='zonaNoDatos'>"+
                    "<div id='textoNoDatos'>¡NO EXISTEN DATOS PARA ESTA CONSULTA!</div>"+
                "</div>"                
                );

        } else {
            
            // Mostramos la leyenda de los datos adquiridos
            var tiempo = new Date();
            $("#legendAñadir").append("<div id='leyendaListado'>Listado de asientos del diario "+asientos[0].diario+
                    "<label class='textoLengMostrar'> (actualizado "+digitosFecha(tiempo.getHours())+":"+digitosFecha(tiempo.getMinutes())+"  h)</label></div>");

            /*
             * Para el caso en que se consiga respuesta de la página php, recorremos todo el array
             * y mostramos la información de cada asiento
             */
            for (var i in asientos) {
                
                // Recuperamos los datos:
                var fechaAsiento = new Date(asientos[i].fecha);
                
                var formatoFechaAsiento = digitosFecha(fechaAsiento.getDate()) + " / " + digitosFecha((fechaAsiento.getMonth() + 1)) + " / " + fechaAsiento.getFullYear();
                var condicionCerrado = ""
                // Comprobamos si está cerrado el asiento
                if (asientos[i].cerrado == 1)
                    condicionCerrado = "checked />";
                else
                    condicionCerrado = "/>"; 
            
                // Incluimos un nuevo asiento en su contenedor
                $("#zonaRelacionAsientos").append(                        

                        //MOSTRAMOS UN ASIENTO
                    "<div class='asiento' id='asientoID"+i+"'>"+
                        "<form id='formularioID' name='formularioID'>"+
                            "<div class='contenAsiento'>"+
                                "<label class='mostraAsiento' data-asiento='"+asientos[i].asiento+"' data-diario='"+asientos[i].diario+"' title='Número de asiento'>"+ asientos[i].asiento+"</label>"+
                            "</div>"+
                            "<div class='contenBotons'>"+
                                "<div class='contenBotonsArriba'>"+
                                    "<input type='button' class='botonAbrir' name='botonAbrir' value='' data-id='"+i+"' title='Apertura de los datos del asiento para poder modificar' />"+                                    
                                "</div>"+
                                "<div class='contenBotonsBaixo'>"+
                                    "<input type='button' class='botonDetalle' name='botonDetalle' value='' data-id='"+i+"' title='Informacion detallada del asiento' />"+
                                "</div>"+
                            "</div>"+

                            "<div class='contenDatos'>"+
                                "<div class='contenDatosSuperior'>"+
                                    "<div class='contenFecha'>"+                                        
                                        "<label class='mostrarTitulo'>Fecha:</label><label class='mostrarFecha' data-fechaasiento='"+asientos[i].fecha+"' title='Fecha presentación del asiento'>"+formatoFechaAsiento+"</label>"+                                        
                                    "</div>"+
                                    "<div class='contenSituacion'>"+
                                        "<label class='mostrarTitulo'>Situación:</label>"+
                                        "<input type='text' class='textoSituacion' name='textoSituacion' value='"+asientos[i].situacion+"' readonly onkeydown='datosPendientes()' title='Texto sobre la situación del asiento'/>"+
                                    "</div>"+
                                    "<div class='cancelarFlotantes'></div>"+
                                "</div>"+
                                "<div class='contenDatosInferior'>"+

                                    "<div class='contenAsignado'>"+                                        
                                        "<label class='mostrarTitulo'>Asignado:</label>"+
                                        "<input type='text' class='asignado' name='asignado' value='"+asientos[i].asignado+"' readonly title='Persona que despacha el asiento'/>"+                                                                                
                                        "<div class='contenBotonAsignado'></div>"+
                                    "</div>"+

                                    "<div class='contenIncidencia'>"+
                                        "<label class='mostrarTitulo'>Incidencia:</label>"+
                                        "<input type='text' class='textoIncidencia' name='textoIncidencia' readonly value='"+asientos[i].incidencia+"' onkeydown='datosPendientes()' title='Texto sobre las incidencias del asiento' />"+
                                    "</div>"+

                                    "<div class='contenOtros'>"+
                                        "<label class='mostrarTitulo'>Otros:</label>"+
                                        "<input type='text' class='textoOtros' name='textoOtros' readonly value='"+asientos[i].otroTexto+"' onkeydown='datosPendientes()' title='Texto para otras incidencias'/>"+
                                    "</div>"+

                                    "<div class='contenActivos'>"+
                                        "<label class='mostrarTitulo'>Activo:</label>"+
                                        "<input type='checkbox' class='checkActivo' name='checkActivo' disabled onchange='datosPendientes()' title='Asiento abierto o cerrado' "+ condicionCerrado +
                                    "</div>"+

                                    "<div class='cancelarFlotantes'></div>"+
                                "</div>"+
                            "</div>"+
                            "<div class='cancelarFlotantes'></div>"+
                        "</form>"+
                    "</div>"                            
                );
           };  
         
       }
       
       // Ocultamos la imagen de trabajando
       $(".contenTrabajando").css("display", "none");
       // Mostramos los datos
       $("#zonaRelacionAsientos").css("display", "block");
           
    }).fail(function() {
        alert("FALLO LA RESPUESTA");
    });
}


/*
 * Función para crear elemento de aviso: "Datos pendientes grabar".
 * @returns {undefined}
 */
function datosPendientes() {
    if (pendienteGrabar == false) {   
        // Vaciamos el contenedor e introducimos el recordatorio "pendiente grabar"
        $("#bloqueInformaSuperior").empty().append("<span class='campoPendienteGrabar'>¡Pendiente GUARDAR modificaciones!</span>");
        $(".campoPendienteGrabar").fadeIn();
        // Cambiamos la variable de control
        pendienteGrabar = true;  
    }
}


/*
 * Función para crear elemento de aviso: "Datos grabados".
 * @returns {undefined}
 */
function avisoDatosGrabados() {
    // Vaciamos el contenedor e introducimos el recordatorio "pendiente grabar"
    $("#bloqueInformaSuperior").empty().append("<span class='campoAvisoGrabado'>¡Datos GRABADOS correctamente!</span>");
    $(".campoAvisoGrabado").fadeIn();
}


/*
 * Función que desactiva los campos para que no se produzcan dobles peticiones
 * @returns {undefined}
 */
function desactivarCampos() {
    // Desactivamos los eventos de selección del formulario de busqueda
    $(".contenedorBusqueda").off("focus mouseenter focusout mouseleave", "*");
    // Desabilitamos todos los campos del formulario de búsqueda:
    $("#formularioBusqueda *").attr("disabled", true);
    // Desabilitamos todos los campos de los demas asientos
    $("#zonaRelacionAsientos *").attr("disabled", true);
    // Cambiamos el color de fondo
    $(".contenAsiento, .mostrarFecha, .contenDatos").css("background-color", "#eee");
}


/*
 * Función que activa los campos para poder realizar cualquier otra petición.
 * @returns {undefined}
 */

function activarCampos() {
    // Activo los eventos de selección del formulario de busqueda
    establecerEventosFormularioBusqueda();    
    
    // Habilito todos los campos del formulario de búsqueda:
    $("#formularioBusqueda *").attr("disabled", false);
        
    // Habilito todos los campos de los demas asientos
    $("#zonaRelacionAsientos *").attr("disabled", false);
    // Desabilitamos los "checkActivo"
    $("#zonaRelacionAsientos .checkActivo").attr("disabled", true);
    // Cambiamos el color de fondo para el contenido:
    $(".contenAsiento, .mostrarFecha, .contenDatos").css("background-color", "white");    
    
    /* Busco todos los elementos que estan seleccionados en el formulario de busqueda
     * y los habilito y cambio color de fondo.
     */    
    $("#formularioBusqueda .checkBusqueda").each(function(){                
        // Recupero los elementos que controla el check, escepto los de tipo "radio".
        if ($(this).attr('type') != 'radio') {
            var elemento = JSON.parse('[' + $(this).data("controla") + ']');
            if ($(this).is(':checked')) {
                // Recorremos todos los elementos por si tenemos más de uno               
                for (i in elemento) {
                    $(elemento[i]).attr("disabled", false);
                    $(elemento[i]).css("background-color", "white");
                }
            } else {
                // Recorremos todos los elementos por si tenemos más de uno
                for (i in elemento) {
                    $(elemento[i]).attr("disabled", true);
                    $(elemento[i]).css("background-color", "");
                }
            }
        }
    });
}


/*
 * Función para mostrar todas las modificaciones realizadas en un asiento.
 * 
 * @param {type} consulta
 * @returns {undefined}
 */
function informeAsiento(consulta){
    
    // Añadimos la imagen de "trabajando"
    $("#zonaInfoAsientos").append("<img class='contenTrabajando' src='./imagenes/trabajando.gif'/>");
    
    $.ajax({
        url: "./miAjax/informeAsiento.php",
        type: 'POST',
        dataType: 'json',
        data: {opciones: consulta}
    }).done(function (infoAsiento){
        
        // Calculo el número de elementos recibidos
        var numeroAsientos = Object.keys(infoAsiento).length;
        if (numeroAsientos != 0) {

            // Variable de control
            var numeroInforme = 0;
            
            /* 
             * Borramos las leyendas anteriores y mostramos la nueva
             * leyenda de los datos adquiridos
             */
            var tiempo = new Date();
            $("#legendInfoAsientos").empty().append("<div class='leyendaInfoListado'>Informe del asiento " + infoAsiento[0].asiento + " / " + infoAsiento[0].diario +
                    "<label class='textoLengMostrar'> (actualizado " + digitosFecha(tiempo.getHours()) + ":" + digitosFecha(tiempo.getMinutes()) + "  h)</label></div>"+
                    "<input type='button' id='botonCerrarInfo' class='botonCerrar' name='botonCerrarConfir' value='' title='Cancelar las modificaciones realizadas en el asiento' />"+
                    "<div class='cancelarFlotantes'></div>"
                    );
            
            // Variables generales para todos los detalles
            var asiento = infoAsiento[0].asiento;
            var diario = infoAsiento[0].diario;


            /*
             * Para el caso en que se consiga respuesta de la página php, recorremos todo el array
             * y mostramos la información de cada asiento
             * @type listarAsientos.operacionesAsientoDiarioJS_L231.asientos
             */
            for (var i in infoAsiento) {

                // Recuperamos los datos:
                var fechaAsiento = new Date(infoAsiento[i].fecha);
                var formatoFechaAsiento = digitosFecha(fechaAsiento.getDate()) + "/" + digitosFecha((fechaAsiento.getMonth() + 1)) + "/" + fechaAsiento.getFullYear();
                var fechaModificado = new Date(infoAsiento[i].fechaModificado);
                var formatoFechaModificado = digitosFecha(fechaModificado.getDate()) + "/" + digitosFecha((fechaModificado.getMonth() + 1)) + "/" + fechaModificado.getFullYear();
                var formatoHoraModificado = digitosFecha(fechaModificado.getHours()) + ":" + digitosFecha(fechaModificado.getMinutes());

                var condicionCerrado = ""
                // Comprobamos si está cerrado el asiento
                if (infoAsiento[i].cerrado == 1)
                    condicionCerrado = "checked />";
                else
                    condicionCerrado = "/>";
            
                // Incluimos un nuevo detalle de asiento en su contenedor
                $("#zonaRelacionInfoAsientos").append(

                //-- MOSTRAMOS DETALLE DEL ASIENTO --
                    "<div id='zonaAsientoID"+i+"' data-asiento='" + asiento + "' data-diario='" + diario + "' class='asiento'>"+
                        "<form name='formularioID'>"+
                            "<div class='contenInfoAsiento'>"+
                                "<div class='contenFechaHora'>"+                                    
                                    "<input type='text' class='textoFechaHora' name='textoFechaActualizar' readonly value='"+formatoFechaModificado+"' title='Fecha de grabación de los datos' />"+
                                    "<input type='text' class='textoFechaHora' name='textoHoraActualizar' readonly value='"+formatoHoraModificado+"' title='Hora de grabación de los datos' />"+
                                "</div>"+
                                "<div class='contenUsuarioModif'>"+
                                    "<input type='text' class='textoUsuarioModif' name='textoUsuarioModif' readonly value='"+infoAsiento[i].usuarioModifica+"' title='Usuario que grabo los datos'/>"+
                                "</div>"+
                            "</div>"+
                            "<div class='contenBotonsInfo'>"+
                                "<div id='contenBotonsArribaID"+i+"' class='contenInfoBotonsArriba'></div>"+
                                "<div id='contenBotonsBaixoID"+i+"' class='contenInfoBotonsBaixo'></div>"+
                            "</div>"+
                        "<div class='contenDatos'>"+
                            "<div class='contenDatosSuperior'>"+
                                "<div class='contenFecha'>"+                                        
                                    "<label class='mostrarTitulo'>Fecha:</label><label class='mostrarFecha' data-fechaasiento='"+infoAsiento[i].fecha+"' title='Fecha presentación del asiento'>"+formatoFechaAsiento+"</label>"+                                        
                                "</div>"+
                                "<div class='contenSituacion'>"+
                                    "<label class='mostrarTitulo'>Situación:</label>"+
                                    "<input type='text' class='textoSituacion' name='textoSituacion' value='"+infoAsiento[i].situacion+"' readonly onkeydown='datosPendientes()' title='Texto sobre la situación del asiento'/>"+
                                "</div>"+
                                "<div class='cancelarFlotantes'></div>"+
                            "</div>"+
                            "<div class='contenDatosInferior'>"+

                                "<div class='contenAsignado'>"+                                        
                                    "<label class='mostrarTitulo'>Asignado:</label>"+
                                    "<input type='text' class='asignado' name='asignado' value='"+infoAsiento[i].asignado+"' readonly title='Persona que despacha el asiento'/>"+                                                                                
                                    "<div class='contenBotonAsignado'></div>"+
                                "</div>"+

                                "<div class='contenIncidencia'>"+
                                    "<label class='mostrarTitulo'>Incidencia:</label>"+
                                    "<input type='text' class='textoIncidencia' name='textoIncidencia' readonly value='"+infoAsiento[i].incidencia+"' onkeydown='datosPendientes()' title='Texto sobre las incidencias del asiento' />"+
                                "</div>"+

                                "<div class='contenOtros'>"+
                                    "<label class='mostrarTitulo'>Otros:</label>"+
                                    "<input type='text' class='textoOtros' name='textoOtros' readonly value='"+infoAsiento[i].otroTexto+"' onkeydown='datosPendientes()' title='Texto para otras incidencias'/>"+
                                "</div>"+

                                "<div class='contenActivos'>"+
                                    "<label class='mostrarTitulo'>Activo:</label>"+
                                    "<input type='checkbox' class='checkActivo' name='checkActivo' disabled onchange='datosPendientes()' title='Asiento abierto o cerrado' "+ condicionCerrado +
                                "</div>"+

                                "<div class='cancelarFlotantes'></div>"+
                            "</div>"+
                        "</div>"+
                        "<div class='cancelarFlotantes'></div>"+
                    "</form>"+
                "</div>"
                );
        
                // Si es el primer elemento no se podrá poner como actual (ya es el actual)
                if (numeroInforme != 0) {
                    $("#contenBotonsArribaID" + i + "").append(
                            "<input type='button' class='botonActualInfo' name='botonActualInfo' value='Actual' data-id='" + i + "' data-fecha='"+formatoFechaModificado+"' data-hora='"+formatoHoraModificado+"' title='Guardar como ACTUAL los datos introducidos en esta fecha/hora'/>");
                }
                // Incrementamos la variable
                numeroInforme++;
           }  
           
           // Ocultamos la imagen de trabajando
           $(".contenTrabajando").css("display", "none");            
           
           // Mostramos el contenedor para enseñar los datos
           $("#zonaRelacionInfoAsientos").css("display", "block");
       }
    }).fail(function() {
        alert("FALLO LA RESPUESTA");
    });      
}


/*
 * Cuando la página esté preparada
 * @returns {undefined}
 */

$(function() {
    // Introducimos la información del proyecto en su campo
    mostrarInformacion();
        
    
    /*
     * 
     * DEFINIMOS LOS EVENTOS:
     * 
     */   
    
    /* 
     * Establecemos los eventos para los botones      
     */
    $(".botonMenu").on('focus mouseenter', function () {
        mostrarBorde(this);
    });
    $(".botonMenu").on('focusout mouseleave', function () {
        ocultarBorde(this);
    });
    
    
     /* 
      * Establecemos los eventos para los botones:
      * Modificar asientos e informe asientos
      */
    $("#zonaMostrarDatos").on('focus mouseenter', ".botonAbrir, .botonDetalle", function () {
        $(this).css("padding", "15px");
    });
    $("#zonaMostrarDatos").on('focusout mouseleave', ".botonAbrir, .botonDetalle", function () {
        $(this).css("padding", "");
    });    
    
    
    /*
     * Establezco el evento "ABRIR" para modificar asiento
     */
    $("#zonaMostrarDatos").on('click', ".botonAbrir", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();

        // Borro los posibles botones ocultos y avisos creados en otras llamadas
        $(".botonCerrar").remove();

        // Recupero el ID asignado al asiento seleccionado para modificar
        miID = "#asientoID" + $(this).data("id");
        
        // Guardo los datos iniciales por si quieren despues cancelar la modificación:
        asientoInicial = new AsientoInicial(); // Creo un objeto y cargo los datos iniciales
        asientoInicial.recuperaDatosInicialAsiento(miID);
        

        /* Introduzco un campo en la parte superior e inferior del asiento para mostrar
         * posibles mensajes (y destacar el asiento que se modifica).
         */
        $(miID).before("<div id='bloqueInformaSuperior' class='bloquePendienteGrabar'></div>");
        $(miID).after("<div id='bloqueInformaInferior' class='bloquePendienteGrabar'></div>");

        /* Miramos la posición del asiento por si está muy al final de la
         * página (se puede ocultar con el recordatorio de grabar), entonces
         * bajamos un poco la barra de desplazamiento.
         */
        var posicion = $(miID).position();
        if (posicion.top > 700) {
            var posicionBarra = $("#zonaRelacionAsientos").scrollTop();
            $("#zonaRelacionAsientos").scrollTop(posicionBarra + 90);
        }

        //LLamamos a la función para desactivar campos
        desactivarCampos();

        // Oculto los botones de abrir/información
        $(miID + " .botonAbrir").css("display", "none");
        $(miID + " .botonDetalle").css("display", "none");

        // Introduzco los nuevos botones
        $(miID + " .contenBotonsArriba").append("<input type='button' class='botonGuardar' name='botonGuardarConfir' value='Guardar' disabled title='Guardar las modificaciones realizadas en el asiento'/>");
        $(miID + " .contenBotonsBaixo").append("<input type='reset' class='botonCerrar' name='botonCerrarConfir' value='' title='Cancelar las modificaciones realizadas en el asiento' />");

        //Sacamos la barra de desplazamiento
        $("#zonaRelacionAsientos").css("overflow-y", "hidden");

        // Habilitamos los campos solicitados para modificar       
        $(miID + " *").attr("disabled", false);
        // Activo como modificables los campos de texto:
        $(miID + " .textoSituacion," + miID + " .textoIncidencia," + miID + " .textoOtros").attr("readonly", false);
        // Cambio el color de fondo al original         
        $(miID + " .contenAsiento, " + miID + " .mostrarFecha, " + miID + " .contenDatos").css("background-color", "white");
        // Muestro un borde rojo en el asiento que modifico
        $(miID + " .contenAsiento, " + miID + " .contenDatos").css("border", "2px solid red");
        $(miID + " .contenBotonsBaixo").css("border-top", "3px solid red");
        // Introduzco el boton para introducir nuevos "asignados"
        $(miID + " .contenBotonAsignado").append(
                "<input type='button' class='botonAsignado' name='escogeAsignado' value='' title='Cambia la persona que despacha el asiento' />");

        // Creamos el panel de usuarios para poder escoger uno nuevo o ninguno
        $(miID + " .asignado").after("<div class='contenAsignadoUsuario'></div>");
        $(miID + " .contenAsignadoUsuario").append("<input type='text' class='asignadoUsuario' name='asignadoUsuario' value='' readonly title='Persona que despachará el asiento'/>");
        $.each(usuarios, function (i, usuario) {
            $(miID + " .contenAsignadoUsuario").append("<input type='text' class='asignadoUsuario' name='asignadoUsuario' value='" + usuario.nombre + "' readonly title='Persona que despachará el asiento'/>");
        });
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });


    /* 
     * Establezco los eventos para los botones:
     * Guardar modificaciones y Cancelar modificaciones
     */
    $("#zonaMostrarDatos").on('focus mouseenter', ".botonGuardar", function () {
        $(this).css("border-color", "red");
        $(this).css("color", "red");
    });
    $("#zonaMostrarDatos").on('focusout mouseleave', ".botonGuardar", function () {
        $(this).css("border-color", "");
        $(this).css("color", "");
    });
    $("#zonaMostrarDatos").on('focus mouseenter', ".botonCerrar", function () {
        $(this).css("padding", "15px");
    });
    $("#zonaMostrarDatos").on('focusout mouseleave', ".botonCerrar", function () {
        $(this).css("padding", "");
    });
    
    
    // Evento click para el botón cancelar:
    $("#zonaMostrarDatos").on('click', ".botonCerrar", function (evento) {
        
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
         // Cargamos los datos iniciales
        asientoInicial.mostrarDatosInicialesAsiento();
        
        //LLamamos a la función para activar los campos
        activarCampos();

        // Elimino los elementos creados especificamente para modificar datos
        $(".botonGuardar, .botonAsignado, .contenAsignadoUsuario, .campoPendienteGrabar, #bloqueInformaSuperior, #bloqueInformaInferior").remove();
        pendienteGrabar = false; // Borrado el aviso, cambio la variable de control

        // Oculto el botón de "reset" para que se produzca la acción "reset"
        $(miID + " .botonCerrar").css("display", "none");

        // Introduzco nuevamente solo lectura en los campos        
        $(miID + " .textoSituacion," + miID + " .textoIncidencia," + miID + " .textoOtros").attr("readonly", true);

        // Muestro nuevamente los botones de abrir/información
        $(miID + " .botonAbrir").css("display", "");
        $(miID + " .botonDetalle").css("display", "");

        //Mostramos la barra de desplazamiento
        $("#zonaRelacionAsientos").css("overflow-y", "");
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
        
        
     /* 
      * Establezco los eventos para el botón:
      * Incluir nuevo asignado
      */
    $("#zonaMostrarDatos").on('focus mouseenter', ".botonAsignado", function () {
        $(this).css("padding", "4px 8px");
    });
    $("#zonaMostrarDatos").on('focusout mouseleave', ".botonAsignado", function () {
        $(this).css("padding", "");
    });
    $("#zonaMostrarDatos").on('click', ".botonAsignado", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        // Ocultamos el texto donde muestra el usuario asignado
        $(miID + " .asignado").css("display", "none");
        // Ocultamos el boton para no poder seleccionar nuevamente
        $(miID + " .botonAsignado").css("display", "none");

        /* Comprobamos la posición del elemento seleccionado para mostrar en la
         * posición visible el panel de usuarios
         */
        var posicion = $(miID).position();
        if (posicion.top > 550) {
            $(miID + " .contenAsignadoUsuario").css("margin-top", "-267px");
        }
        // Mostramos el panel para seleccionar usuarios
        $(miID + " .contenAsignadoUsuario").css("display", "block");
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    /* 
     * Establezco los eventos para el contenedor de nuevos usuarios asignados
     */

    /* Para el caso de que salgamos del contenedor */
    $("#zonaMostrarDatos").on('focusout mouseleave', ".contenAsignadoUsuario", function () {
        // Ocultamos el contenedor
        $(this).css("display", "none");
        // Mostramos el valor asignado anteriormente y el botón para modificar nuevamente
        $(miID + " .asignado").css("display", "");
        $(miID + " .botonAsignado").css("display", "");

    });
    
    /* Para el caso de que nos pongamos sobre un usuario */
    $("#zonaMostrarDatos").on('focus mouseenter', ".asignadoUsuario", function () {
        $(this).css("border", "2px solid purple");
    });
    $("#zonaMostrarDatos").on('focusout mouseleave', ".asignadoUsuario", function () {
        $(this).css("border", "");
    });
    /* Para el caso de que seleccionemos un usuario */
    $("#zonaMostrarDatos").on('click', ".asignadoUsuario", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        //Cambiamos el valor de lo seleccionado.
        $(miID + " .asignado").val($(this).val());
        // Ocultamos el panel de selección de nuevos usuarios
        $(miID + " .contenAsignadoUsuario").css("display", "none");
        // Mostramos el valor asignado anteriormente y el botón para modificar nuevamente
        $(miID + " .asignado").css("display", "");
        $(miID + " .botonAsignado").css("display", "");
        // Mostramos el aviso de pendiente grabar modificaciones
        datosPendientes();
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });


    /*
     * Establecemos el evento "click" para el botón GUARDAR
     */
    $("#zonaMostrarDatos").on('click', ".botonGuardar", function (event) {
        // Detenemos la acción predeterminada del evento
        event.preventDefault();
        // Guardamos los datos introducidos
        guardarDatosAsientos();
        
        // Paramos la propagación indeseada del evento
        event.stopPropagation();
    });

    
    /* 
     * Establecemos los eventos de los campos de selección de busqueda
     */
    establecerEventosFormularioBusqueda();
    
    
    /*
     * Establecemos el evento "click" para el "checkbox" de las zonas de busqueda
     */
    $(".checkBusqueda").click(function (evento) {        
        // Recupero la información del contenedor 
        var contenedor = $(this).data("contenedor");
        // Compruebo si está seleccionado
        if ($(this).is(':checked')) {
            if ($(this).attr('type') == 'radio') { // Para el caso de que el selector sea de tipo "radio"              
                // Ponemos todos los elementos tipo "radio" como no seleccionados
                $("#buscaEstadoActivo, #buscaEstadoCerrado, #buscaEstadoTodos").css("background-color", "#eee");
                // Ponemos el elemento tipo "radio" como seleccionado
                $(contenedor).css("background-color", "#93C572");
            } else {
                // Recupero los elementos que controla el check.
                var elemento = JSON.parse('[' + $(this).data("controla") + ']');
                $(contenedor).css("background-color", "#93C572");
                // Recorremos todos los elementos por si tenemos más de uno               
                for (i in elemento) {
                    $(elemento[i]).attr("disabled", false);
                    $(elemento[i]).css("background-color", "white");
                }
            }
        } else { // Si el elemento no está seleccionado los deshabilito
            // Recupero los elementos que controla el check.
            var elemento = JSON.parse('[' + $(this).data("controla") + ']');
            $(contenedor).css("background-color", "#eee");
            // Recorremos todos los elementos por si tenemos más de uno               
            for (i in elemento) {
                $(elemento[i]).attr("disabled", true);
                $(elemento[i]).css("background-color", "");
            }
        }
    });
    
    
    /*
     * Establecemos el evento "click" para el botón listar
     */
    $("#listar").click(function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        // Borramos las posibles notificaciones de errores existentes
        $(".campoError").remove();
        
        // Vaciamos las consultas anteriores
        $("#zonaMostrarDatos").empty();
        
        // Añadimos la zona del título y zona de datos.
        $("#zonaMostrarDatos").append("<legend id='legendAñadir'></legend><div id='zonaRelacionAsientos'></div>");
        
        // Validamos los datos introducidos
        if (validarDatosListar()) {
            // Realizamos la consulta                   
            listarAsientos(opcionesConsulta);
        }

        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
     /*
     * Establecemos el evento "click" para el botón imprimir
     */
    $("#mostrarImprimir").click(function (evento) {
        
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();        
        
        var a = document.createElement("a");
        a.target = "_blank";  
        a.href = "./miAjax/pdfListadoAsientos.php"
        a.click();
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    /*
     * Establezco el evento "INFORME" para modificar asiento
     */
    $("#zonaMostrarDatos").on('click', ".botonDetalle", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();       

        // Recupero el ID asignado al asiento seleccionado para modificar
        miID = "#asientoID" + $(this).data("id");
        
        // Guardo los datos iniciales por si despues se quieren actualizar
        asientoInicial = new AsientoInicial(); // Creo un objeto y cargo los datos iniciales
        asientoInicial.recuperaDatosInicialAsiento(miID);

        //LLamamos a la función para desactivar campos
        desactivarCampos();
        
        //Sacamos la barra de desplazamiento
        $("#zonaRelacionAsientos").css("overflow-y", "hidden");
        
        // Recuperamos los datos a guardar   
        var asiento = $(miID + " label.mostraAsiento").data("asiento");
        var diario = $(miID + " label.mostraAsiento").data("diario");
        
        // Ocultamos el contenedor con el listado de asientos
        $("#zonaMostrarDatos").css("display", "none");
        
        // Vaciamos los datos de informes anteriores
        $("#zonaInfoAsientos").empty();
        
        // Añadimos el campo para el título y los datos:
        $("#zonaInfoAsientos").append("<legend id='legendInfoAsientos'></legend><div id='zonaRelacionInfoAsientos'></div>");
        
        // Mostramos el contenedor para enseñar los datos
        $("#zonaInfoAsientos").css("display", "block");
        
        // Definimos el array JSON con los indices
        var consulta = {diario: diario, asiento: asiento};
        
        // Realizamos la consulta                   
        informeAsiento(consulta);
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    // Eventos para el botón Cerrar cuadro de información asiento
    $("#zonaInfoAsientos").on('focus mouseenter', "#botonCerrarInfo", function () {
        $(this).css("padding", "15px");
    });
    $("#zonaInfoAsientos").on('focusout mouseleave', "#botonCerrarInfo", function () {
        $(this).css("padding", "");
    });
    
    $("#zonaInfoAsientos").on('click', "#botonCerrarInfo", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
        // Ocultamos el contenedor con el detalle del asiento
        $("#zonaInfoAsientos").css("display", "none");
        
        // Borramos los elementos de la consulta
        $("#zonaRelacionInfoAsientos").empty();

        //LLamamos a la función para activar campos
        activarCampos();        
        
        //Mostramos la barra de desplazamiento
        $("#zonaRelacionAsientos").css("overflow-y", "");
        
        // Mostramos el contenedor para enseñar los datos del listado de asientos
        $("#zonaMostrarDatos").css("display", "block");
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    // Eventos para el botón Actualizar Información Asiento
    $("#zonaInfoAsientos").on('focus mouseenter', ".botonActualInfo", function () {
        $(this).css("border-color", "red");
        $(this).css("color", "red");
    });
    $("#zonaInfoAsientos").on('focusout mouseleave', ".botonActualInfo", function () {
        $(this).css("border-color", "");
        $(this).css("color", "");
    });
        
    $("#zonaInfoAsientos").on('click', ".botonActualInfo", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
        // Recupero el ID asignado al asiento seleccionado para modificar
        miID = "#zonaAsientoID" + $(this).data("id");
        // Recupero los datos
        var fechaModifica = $(this).data("fecha");
        var horaModifica = $(this).data("hora");
        
        // Muestro un borde rojo en el asiento que modifico
        $(miID + " .contenInfoAsiento, " + miID + " .contenDatos").css("border", "2px solid red");
        $(miID + " .contenInfoBotonsBaixo").css("border-top", "3px solid red");

        /* Introduzco un campo en la parte superior e inferior del asiento para mostrar
         * posibles mensajes (y destacar el asiento que se modifica).
         */
        $(miID).before("<div id='bloqueInformaSuperior' class='bloquePendienteGrabar'></div>");
        $(miID).after("<div id='bloqueInformaInferior' class='bloquePendienteGrabar'></div>");

        /* Miramos la posición del asiento por si está muy al final de la
         * página (se puede ocultar con el recordatorio de grabar), entonces
         * bajamos un poco la barra de desplazamiento.
         */
        var posicion = $(miID).position();
        if (posicion.top > 700) {
            var posicionBarra = $("#zonaRelacionInfoAsientos").scrollTop();
            $("#zonaRelacionInfoAsientos").scrollTop(posicionBarra + 90);
        }
        
        // Ocultamos los botones de "Actulizar" para no repetir el proceso
        $("#zonaRelacionInfoAsientos .botonActualInfo").css("display", "none");
        // Ocultamos el boton de cerrar la información de los asientos
        $("#botonCerrarInfo").css("display", "none");

        // Introduzco los botones para confirmar la grabación
        $("#bloqueInformaSuperior").append(                
                "<div class='contenConfirmacion'>"+
                    "<div class='zonaConfirmacion'>"+
                        "<div class='zonaConfirmacion1'></div>"+
                        "<div class='zonaConfirmacion2'>"+
                            "<div class='zonaTextoConfirmacion'>"+
                                "<input type='text' class='textoConfir' name='textoConfir' value='Quieres poner como actuales los datos de fecha: "+fechaModifica+" y hora: "+horaModifica+" ?' readonly />"+
                            "</div>"+
                            "<div class='zonaBotonesConfirmacion'>"+
                                "<div class='zonaBotonGuardarConfirmacion'>"+
                                    "<input type='button' class='botonGuardarConfirma' name='botonGuardarDiario' data-miid='" + miID + "' value='Si' title='Poner como actual este detalle de asiento'/>"+
                                "</div>"+
                                "<div class='zonaBotonCancelarConfirmacion'>"+
                                    "<input type='button' class='botonCerrarConfirma' name='botonCancelarDiario' data-miid='" + miID + "' value='No' title='Cancelar la actualización del detalle de este asiento' />"+
                                "</div>"+
                                "<div class='cancelarFlotantes'></div>"+
                            "</div>"+
                            "<div class='cancelarFlotantes'></div>"+
                        "</div>"+
                    "</div>"+
                "</div>");

        //Sacamos la barra de desplazamiento
        $("#zonaRelacionInfoAsientos").css("overflow-y", "hidden");        
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
   
   
   // Eventos para los botones de confirmación de "Actual detalle asiento".
    $("#zonaInfoAsientos").on('focus mouseenter', ".botonGuardarConfirma, .botonCerrarConfirma", function () {
        $(this).css("border-color", "red");
        $(this).css("color", "red");
    });
    $("#zonaInfoAsientos").on('focusout mouseleave', ".botonGuardarConfirma, .botonCerrarConfirma", function () {
        $(this).css("border-color", "");
        $(this).css("color", "");
    });
        
    $("#zonaInfoAsientos").on('click', ".botonCerrarConfirma", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
        // Recupero el ID asignado al asiento seleccionado para modificar
        miID = $(this).data("miid");
                
        // Muestro el borde original del asiento que modifico
        $(miID + " .contenInfoAsiento, " + miID + " .contenDatos").css("border", "");
        $(miID + " .contenInfoBotonsBaixo").css("border-top", "");

        /* Borro los campos introducidos en la parte superior e inferior del asiento para mostrar
         * posibles mensajes.
         */
        $("#bloqueInformaSuperior").remove();
        $("#bloqueInformaInferior").remove();
        
        // Muestro los botones de "Actulizar"
        $("#zonaRelacionInfoAsientos .botonActualInfo").css("display", "block");
        // Muestro el boton de cerrar la información de los asientos
        $("#botonCerrarInfo").css("display", "block");

        //Mostramos la barra de desplazamiento
        $("#zonaRelacionInfoAsientos").css("overflow-y", "");
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    $("#zonaInfoAsientos").on('click', ".botonGuardarConfirma", function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
        // Recupero el ID asignado al asiento seleccionado para modificar
        miID = $(this).data("miid");               
        
        // Guardamos los datos introducidos
        guardarDatosActuales();
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    
    /*
     * Establecemos el evento "click" para el botón LISTAR ACCIONES
     */
    $("#mostrarAcciones").click(function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault(); 
        
        //LLamamos a la función para desactivar campos
        desactivarCampos();
        
        //Sacamos la barra de desplazamiento
        $("#zonaRelacionAsientos").css("overflow-y", "hidden");
        
        // Mostramos el panel del listado de acciones
        $("#contenedorZonaAcciones").css("display", "block");
        
        mostrarAcciones();        

        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    // Eventos para el botón CERRAR cuadro de ACCIONES
    $("#cerrarAcciones").on('focus mouseenter', function () {
        $(this).css("padding", "15px");
    });
    $("#cerrarAcciones").on('focusout mouseleave', function () {
        $(this).css("padding", "");
    });
    
    $("#cerrarAcciones").click( function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
        // Ocultamos el contenedor la información de las acciones
        $("#contenedorZonaAcciones").hide("slow"); //Desaparición con desplazamiento
        
        // Borramos los elementos de la consulta anteriores
        $(".contenedorIncidencias").empty();

        //LLamamos a la función para activar campos
        activarCampos();        
        
        //Mostramos la barra de desplazamiento
        $("#zonaRelacionAsientos").css("overflow-y", "");
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
     /*
     * Establecemos el evento "click" para el botón ADMINISTRAR DIARIO
     */
    $("#adminDiario").click(function (evento) {
        
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();        
        
        var a = document.createElement("a");        
        a.href = "./adminDiario.php"
        a.click();
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    /*
     * Para controlar el pulsado de la tecla "enter" en el formulario
     * @param {type} param
     */
    $("#formularioBusqueda").keypress(function (evento) {
       if(evento.which == 13) {           
           // Tomamos como evento por defecto el "listar" en el formulario
            $("#listar").trigger('click');
            // Retornamos "false" para no ejecutar por defecto el formulario
            return false;
       } 
    });
        
    /*
     * FIN DE LA DEFINICIÓN DE EVENTOS
     */
    
    // Al inicio establezco el foco en la selección de diario
    $("#diario").focus();
   
    
}); // Fin de la página preparada



// Cuando la página esta cargada
$(document).ready(function (){
    // Cargamos los usuarios
    listarUsuarios();
    // Cargamos los diarios
    listarDiarios();
});