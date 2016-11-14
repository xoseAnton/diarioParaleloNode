// Variable globales
var opcionesConsulta;
var asientos;
var usuarios; // Contiene los usuarios definidos
var miID;   // Contiene la variable de control del asiento seleccionado
var datosGrabar; // Contienen los datos que se quieren modificar
var pendienteGrabar = false;

/*
 * Función introduce los usuarios activos definidos en la base de datos
 * en un "select". Si estamos identificados selecciona por defecto el usuario.
 * @returns Lista de usuarios de la base de datos
 */
function listarUsuarios() {
    // Enviamos la solicitud ajax a la página del servidor
    $.getJSON("./miAjax/listarUsuarios.php", function (resultado) {
        // Guardamos la consulta en la variable global
        usuarios = resultado;
        // Recorro todos los valores optenidos
        $.each(resultado, function (i, usuario) {
            if(usuario.porDefecto == true)
                $("#usuario").append("<option value='" + usuario.nombre + "' selected='true'>" + usuario.nombre + "</option>");
            else
                $("#usuario").append("<option value='" + usuario.nombre + "'>" + usuario.nombre + "</option>");
        });
    });
}


/*
 * Función introduce los diarios activos definidos en la base de datos
 * en un "select". Selecciona por defecto el último diario.
 * @returns Lista de los diarios activos de la base de datos.
 */
function listarDiarios() {
    // Enviamos la solicitud ajax a la página del servidor
    $.getJSON("./miAjax/listarDiarios.php", function (resultado) {
        // Recorro todos los valores optenidos
        $.each(resultado, function (i, miDiario) {
            if(miDiario.cerrado == 1)
                $("#diario").append("<option value='" + miDiario.diario + "'>" + miDiario.diario + "</option>");
        });
    });
}



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
    datosGrabar = {asiento: asiento , diario: diario, fecha: fecha, situacion: situacion, incidencia: incidencia, otroTexto: otroTexto, asigna: asignado, cerrado: cerrado};
    
    $.ajax({
        url: "./miAjax/grabarDatosAsientos.php",
        type: 'POST',
        dataType: 'json',
        data: {datos: datosGrabar}
    }).done(function (resultado){
        alert(JSON.stringify(resultado));
    }).fail(function() {
        return false;        
    }).always(function (){
        // FALTA CODIGO
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
        setTimeout("$('.campoError').hide('slow');", 3000);       
    }
}

/*
 * Función para consultar en la base de datos los datos de los asientos.
 * @param {type} consulta
 * @returns {Muestra la informacion de los asientos según la consulta}
 */

function listarAsientos(consulta){     
    $.ajax({
        url: "./miAjax/listarAsientos.php",
        type: 'POST',
        dataType: 'json',
        data: {opciones: consulta}
    }).done(function (asientos){                
        // Calculo el número de elementos recibido
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
                    "<label id='textoLengMostrar'> (actualizado "+tiempo.getHours()+":"+tiempo.getMinutes()+"  h)</label></div>");

            /*
             * Para el caso en que se consiga respuesta de la página php, recorremos todo el array
             * y mostramos la información de cada asiento
             * @type listarAsientos.operacionesAsientoDiarioJS_L231.asientos
             */
            for (var i in asientos) {
                /*
                 * Función para incluir dos digitos en el dia y fecha
                 * @param {type} dato
                 * @returns {listarAsientos.operacionesAsientoDiarioJS_L251.digitosFecha.digito|String}
                 */
                function digitosFecha(datoFecha){
                    var digitos = new String(datoFecha);
                    if(digitos.length < 2)
                        digitos = '0'+datoFecha;
                    return digitos;
                    }
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
                                    "<input type='button' class='botonDetalle' name='botonDetalle' value='' title='Informacion detallada del asiento' />"+
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
           
           
    }).fail(function() {
        alert("FALLO LA RESPUESTA");
    }).always(function (){
        // FALTA CODIGO
    });      
}

function datosPendientes() {
    if (pendienteGrabar == false) {   
        // Introducimos el recordatorio "pendiente grabar"
        $("#bloqueInformaSuperior").append("<span class='campoPendienteGrabar'>¡Pendiente GUARDAR modificaciones!</span>");
        $(".campoPendienteGrabar").fadeIn();
        // Cambiamos la variable de control
        pendienteGrabar = true;  
    }
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
 * Cuando la página esté preparada
 * @returns {undefined}
 */

$(function() {
    // Introducimos la información del proyecto en su campo
    mostrarInformacion();
    
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
    $("#zonaRelacionAsientos").on('focus mouseenter', ".botonAbrir, .botonDetalle", function () {
        $(this).css("padding", "15px");
    });
    $("#zonaRelacionAsientos").on('focusout mouseleave', ".botonAbrir, .botonDetalle", function () {
        $(this).css("padding", "");
    });    
    
    
    /*
     * Establezco el evento "ABRIR" para modificar asiento
     */
    $("#zonaRelacionAsientos").on('click', ".botonAbrir", function () {
        // Borro los posibles botones ocultos de "cerrar" creados en otras llamadas
        $(".botonCerrar").remove();
        
        // Recupero el ID asignado al asiento seleccionado para modificar
        miID = "#asientoID" + $(this).data("id");
        
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
        if(posicion.top > 700){            
            var posicionBarra = $("#zonaRelacionAsientos").scrollTop();              
            $("#zonaRelacionAsientos").scrollTop(posicionBarra+90);
        }      
        
        //LLamamos a la función para desactivar campos
        desactivarCampos();
        
        // Oculto los botones de abrir/información
        $(miID + " .botonAbrir").css("display", "none");
        $(miID + " .botonDetalle").css("display", "none");
        
        // Introduzco los nuevos botones
        $(miID+ " .contenBotonsArriba").append("<input type='button' class='botonGuardar' name='botonGuardarConfir' value='Guardar' disabled title='Guardar las modificaciones realizadas en el asiento'/>");
        $(miID+ " .contenBotonsBaixo").append("<input type='reset' class='botonCerrar' name='botonCerrarConfir' value='' title='Cancelar las modificaciones realizadas en el asiento' />");        
                
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
        $(miID+" .asignado").after("<div class='contenAsignadoUsuario'></div>");
        $(miID+ " .contenAsignadoUsuario").append("<input type='text' class='asignadoUsuario' name='asignadoUsuario' value='' readonly title='Persona que despachará el asiento'/>");
        $.each(usuarios, function (i, usuario) {                        
                $(miID+ " .contenAsignadoUsuario").append("<input type='text' class='asignadoUsuario' name='asignadoUsuario' value='"+usuario.nombre+"' readonly title='Persona que despachará el asiento'/>");
        });
        
        /* 
         * Establezco los eventos para los botones:
         * Guardar modificaciones y Cancelar modificaciones
         */
        $("#zonaRelacionAsientos").on('focus mouseenter', ".botonGuardar", function () {
            $(this).css("border-color", "red");
            $(this).css("color", "red");
        });
        $("#zonaRelacionAsientos").on('focusout mouseleave', ".botonGuardar", function () {
            $(this).css("border-color", "");
            $(this).css("color", "");
        });
        $("#zonaRelacionAsientos").on('focus mouseenter', ".botonCerrar", function () {
            $(this).css("padding", "15px");
        });
        $("#zonaRelacionAsientos").on('focusout mouseleave', ".botonCerrar", function () {
            $(this).css("padding", "");
        });
        
        // Evento click para el botón cancelar:
        $("#zonaRelacionAsientos").on('click', ".botonCerrar", function () {
            //LLamamos a la función para desactivar campos
            activarCampos();

            // Muestro el borde original en el asiento seleccionado
            $(miID + " .contenAsiento, " + miID + " .contenDatos").css("border", "");
            $(miID + " .contenBotonsBaixo").css("border-top", "");

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
        });
        
        
        /* 
         * Establezco los eventos para el botón:
         * Incluir nuevo asignado
         */
        $("#zonaRelacionAsientos").on('focus mouseenter', ".botonAsignado", function () {
            $(this).css("padding", "4px 8px");
        });
        $("#zonaRelacionAsientos").on('focusout mouseleave', ".botonAsignado", function () {
            $(this).css("padding", "");
        });
        $("#zonaRelacionAsientos").on('click', ".botonAsignado", function () {
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

        });
        
        
        /* 
         * Establezco los eventos para el contenedor de nuevos usuarios asignados
         */

        /* Para el caso de que salgamos del contenedor */
        $("#zonaRelacionAsientos").on('focusout mouseleave', ".contenAsignadoUsuario", function () {
            // Ocultamos el contenedor
            $(this).css("display", "none");
            // Mostramos el valor asignado anteriormente y el botón para modificar nuevamente
            $(miID + " .asignado").css("display", "");
            $(miID + " .botonAsignado").css("display", "");

        });
        /* Para el caso de que nos pongamos sobre un usuario */
        $("#zonaRelacionAsientos").on('focus mouseenter', ".asignadoUsuario", function () {
            $(this).css("border", "2px solid purple");
        });
        $("#zonaRelacionAsientos").on('focusout mouseleave', ".asignadoUsuario", function () {
            $(this).css("border", "");
        });
        /* Para el caso de que seleccionemos un usuario */
        $("#zonaRelacionAsientos").on('click', ".asignadoUsuario", function () {
            //Cambiamos el valor de lo seleccionado.
            $(miID + " .asignado").val($(this).val());
            // Ocultamos el panel de selección de nuevos usuarios
            $(miID + " .contenAsignadoUsuario").css("display", "none");
            // Mostramos el valor asignado anteriormente y el botón para modificar nuevamente
            $(miID + " .asignado").css("display", "");
            $(miID + " .botonAsignado").css("display", "");
            // Mostramos el aviso de pendiente grabar modificaciones
            datosPendientes();
        });
        
        /*
         * Establecemos el evento "click" para el botón GUARDAR
         */
        $("#zonaRelacionAsientos").on('click', ".botonGuardar", function () {
            // Guardamos los datos introducidos
            guardarDatosAsientos();
            
        });
   
        
    });
    
    
    /* 
      * Establecemos los eventos de los campos de selección de busqueda
      */    
    establecerEventosFormularioBusqueda();
    
    
    /*
     * Establecemos el evento "click" para el "checkbox" de las zonas de busqueda
     */
    $(".checkBusqueda").click(function (){
       // Recupero la información del contenedor 
       var contenedor = $(this).data("contenedor");
       // Compruebo si está seleccionado
       if($(this).is(':checked')){
           if($(this).attr('type') == 'radio') { // Para el caso de que el selector sea de tipo "radio"              
              // Ponemos todos los elementos tipo "radio" como no seleccionados
              $("#buscaEstadoActivo, #buscaEstadoCerrado, #buscaEstadoTodos").css("background-color", "#eee");
              // Ponemos el elemento tipo "radio" como seleccionado
              $(contenedor).css("background-color", "#93C572");              
           }
            else {
                // Recupero los elementos que controla el check.
                var elemento = JSON.parse('['+$(this).data("controla")+']');                
                $(contenedor).css("background-color", "#93C572");
                // Recorremos todos los elementos por si tenemos más de uno               
                for (i in elemento) {
                    $(elemento[i]).attr("disabled", false);
                    $(elemento[i]).css("background-color", "white");
                }
            }
       }
       else { // Si el elemento no está seleccionado los deshabilito
            // Recupero los elementos que controla el check.
            var elemento = JSON.parse('['+$(this).data("controla")+']');
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
    $("#listar").click( function(evento){
       // Detenemos la acción del botón input
       evento.preventDefault();
       // Borramos las posibles notificaciones de errores existentes
       $(".campoError").remove();
       
       // Borramos los posibles datos de otras consultas
       $(".asiento").remove();
       
       // Borramos el posible mensaje de NO DATOS de consultas anteriores
       $("#zonaNoDatos").remove();
       
       // Borramos la leyenda de posibles consultas anteriores
       $("#leyendaListado").remove();
       
       // Validamos los datos introducidos
       if(validarDatosListar()) {          
            // Realizamos la consulta                   
            listarAsientos(opcionesConsulta);
        }
       
   });
   
   
    
   
    
}); // Fin de la página preparada



// Cuando la página esta cargada
$(document).ready(function (){
    // Cargamos los usuarios
    listarUsuarios();
    // Cargamos los diarios
    listarDiarios();
});