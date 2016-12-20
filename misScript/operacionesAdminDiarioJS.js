// Variable globales
var listaDiarios;
var datosGrabar; // Contienen los datos que se quieren modificar



/*
 * Establece los eventos de foco para los botones de la página
 * @returns {undefined}
 */
function establecerEventosPagina(){
    $(".botonMenu").on('focus mouseenter', function () {
        mostrarBorde(this);
    });
    $(".botonMenu").on('focusout mouseleave', function () {
        ocultarBorde(this);
    });    
    
    /*
     * Eventos para mostrar/ocultar el menu de botones
     */
    $("#botonMostrarMenu").on('focus mouseenter', function () {
        $("#zonaControl").slideDown("slow"); // Muestro el menu de botones
        $("#zonaBotonMenu").slideUp("slow"); // Oculto el botón para mostrar
    });    
    
    $("#zonaControl").on('focusout mouseleave', function () {
        $("#zonaBotonMenu").slideDown("slow"); // Muestro el botón
        $("#zonaControl").slideUp("slow");  // Oculto el menu de botones
    });    
    
     /* 
      * Establecemos los eventos para los botones de control del diario
      * 
      */
    $(".contenBotonActivar").on('focus mouseenter', function () {
        $(this).css({
            "border": "2px solid purple",
            "border-radius": "15em",
        });
        $(this).children(".contenTextoBoton").css({
            "color": "red",
            "cursor": "default"
        });
    });
    $(".contenBotonActivar").on('focusout mouseleave', function () {
        $(this).css({
            "border": "",
            "border-radius": "",
            "color": "",
            "cursor": ""
        });
        $(this).children(".contenTextoBoton").css({
            "color": "",
            "cursor": ""
        });

    }); 
    
    
    /*
     * Establecemos el evento "click" para el botón ADMINISTRAR DIARIO
     */
    $(".contenBotonActivar").click(function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();

        // Recupero el ID asignado al campo seleccionado para modificar
        var miID = $(this).data("id");

        // Desactivamos los campos de los demás elementos
        desactivarCampos(this);

        // Comprobamos que evento fué seleccionado
        if (miID == "#bloqueCrearAsientos")
            mostrarBloqueCrearAsientos();
        if (miID == "#bloqueCrearDiario")
            mostrarBloqueCrearDiario();
        if (miID == "#bloqueCerrarAbrirDiario")
            mostrarBloqueAbrirCerrarDiario();

        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });    
}


/*
 * Función que desactiva los campos para que no se produzcan dobles peticiones
 * @returns {undefined}
 */
function desactivarCampos(miEvento) {
    // Desactivamos los eventos sobre los botones de control
    $(".botonMenu").off("focus mouseenter focusout mouseleave");
    $("#botonMostrarMenu").off("focus mouseenter focusout mouseleave");
    $("#zonaControl").off("focus mouseenter focusout mouseleave");
    $(".contenBotonActivar").off("focus mouseenter focusout mouseleave click");
    
    // Cambiamos la opacidad de los botones de administración del diario
    $(".contenBotonActivar").css("opacity", "0.2");
    $(miEvento).css("opacity", ""); // Mantenemos la opacidad inicial en el botón seleccionado
    
}

function desactivarTotalCampos(){
    // Desactivamos los eventos sobre los botones de control
    $(".botonMenu").off("focus mouseenter focusout mouseleave");
    $("#botonMostrarMenu").off("focus mouseenter focusout mouseleave");
    $("#zonaControl").off("focus mouseenter focusout mouseleave");
    $(".contenBotonActivar").off("focus mouseenter focusout mouseleave click");
        
    // Cambiamos la opacidad de los botones de administración del diario
    $(".contenBotonActivar").css("opacity", "0.2");
}


/*
 * Función que activa los campos para poder acceder al menú de administración diario
 * @returns {undefined}
 */
function activarCampos() {    
    // Establecemos los eventos
    establecerEventosPagina();   
    
    // Cambiamos las propiedades del elemento a las iniciales    
    $(".contenBotonActivar").css({
        "opacity": "",
        "border": "",
        "border-radius": "",
        "color": "",
        "cursor": ""
    });
    $(".contenTextoBoton").css({
        "color": "",
        "cursor": ""
    });    
}





function mostraCampoConfirmacion(miID, texto){
    $(miID + " .contenConfirmacion").empty().append(            
            "<div class='zonaConfirmacion'>"+
                "<div class='zonaConfirmacion1'></div>"+
                "<div class='zonaConfirmacion2'>"+
                    "<div class='zonaTextoConfirmacion'>"+
                        "<input type='text' class='textoConfir' name='textoConfir' value='"+texto+"' readonly />"+
                    "</div>"+
                    "<div class='zonaBotonesConfirmacion'>"+
                        "<div class='zonaBotonGuardarConfirmacion'>"+
                            "<input type='button' class='botonConfirmaGrabar' name='botonGuardar' data-id='" + miID + "' value='Si' title='Guardar los datos'/>"+
                        "</div>"+
                        "<div class='zonaBotonCancelarConfirmacion'>"+
                            "<input type='button' class='botonConfirmaCerrar' name='botonCancelar' data-id='" + miID + "' value='No' title='Cancelar grabación de los datos' />"+
                        "</div>"+
                        "<div class='cancelarFlotantes'></div>"+
                    "</div>"+
                    "<div class='cancelarFlotantes'></div>"+
                "</div>"+
            "</div>");
    // Ocultamos los datos
    $(miID + " .contenZonaDatos").css("display", "none");
    // Mostramos la confirmación
    $(miID + " .contenConfirmacion").css("display", "block");
}


/*
 * Función para mostrar el resultado de Grabación de los datos
 * @param {type} resultado
 * @param {type} miID
 * @param {type} texto
 * @returns {undefined}
 */
function mostrarCampoResultadoGrabar(resultado, miID,texto) {    
    // Ocultamos la imagen de trabajando
    $(miID + " .contenTrabajando").css("display", "none");
    
    // Mostramos el campo unión de datos
    $(miID + " .contenZonaUnion").css("display", "");    
    
    // Cargamos el campo que contiene el texto
    $(miID + " .zonaConfirmacion").empty().append("<input type='text' class='textoExitoGrabar' name='textoExitoGrabar' value='" + texto + "' readonly />");
    
    // Compruebo que tivo de resultado muestro
    if (resultado == "correcto") {
        $(miID + " .zonaConfirmacion").css({
            "background-color": "green",
            "border-color": "purple"
        });
        
        // Vacio el formulario
        $(miID + " form")[0].reset();
    }
    if (resultado == "error") {
        $(miID + " .zonaConfirmacion").css("background-color", "#ffff00");
        $(miID + " .textoExitoGrabar").css({
            "background-color": "#ffff00",
            "color": "red"
        });
    }
    
    
    // Mostramos el resultado
    $(miID + " .contenConfirmacion").css("display", "block");
    
    // Ocultamos los errores pasados 3 segundos.
    setTimeout(function (){
        $(miID + " .contenConfirmacion").empty().css("display", "none");
        activarCampos();
        $(".bloqueAdministrar").css("display", "");
        $(miID + " .contenZonaDatos").css("display", "");            
    }, 3000);
}

/*
 * Función para mostrar los datos de un DIARIO SELECCIONADO
 * @param {type} id
 * @returns {undefined}
 */
function mostrarDatosDiario(id) {
    
    // Recuperamos los datos:
    var fechaAsiento = new Date(listaDiarios[id].fechaAsiento);

    var formatoFechaAsiento = digitosFecha(fechaAsiento.getDate()) + " / " + digitosFecha((fechaAsiento.getMonth() + 1)) + " / " + fechaAsiento.getFullYear();
    
    //Vaciamos la información anterior y cargamos la nueva
    $("#bloqueCrearAsientos .contenInformeDiario").empty().append(
            
            "<div class='contenDatosInforme'>"+
                "<div class='datosInformeDiario'>"+
                    "<label class='tituloDatosInforme'>Diario: </label>"+
                    "<input type='text' class='textoNumeroAsientosDiario' name='textoNumeroDiario' value='"+listaDiarios[id].diario+"' readonly/>"+
                "</div>"+
                "<div class='datosInformeDiario'>"+
                    "<label class='tituloDatosInforme'>Último asiento: </label>"+
                    "<input type='text' class='textoNumeroAsientosDiario' name='totalAsientosDiario' value='"+listaDiarios[id].asientos+"' readonly/>"+
                "</div>"+
                "<div class='datosInformeDiario'>"+                        
                    "<label class='tituloDatosInforme'>Fecha: </label><label class='textoDatosInforme'>"+formatoFechaAsiento+"</label>"+
                "</div>"+
            "</div>"
            );
}


/*
 * Función para mostrar los datos ABIERTO/CERRADO de un DIARIO SELECCIONADO
 * @param {type} id
 * @returns {undefined}
 */
function mostrarDatosAbiertoCerradoDiario(id) {
    var textoAbiertoCerrado = "";
    var claseAbiertoCerrado = ""
    // Comprobamos si esta abierto o cerrado el diario
    if(listaDiarios[id].cerrado == 0){
        textoAbiertoCerrado = "CERRADO";
        claseAbiertoCerrado = "contenImgDiarioCerrado";
        $("#bloqueCerrarAbrirDiario #botonAbrirCerrarDiario").val("Abrir");        
    }
    else {
        textoAbiertoCerrado = "ABIERTO";
        claseAbiertoCerrado = "contenImgDiarioAbierto";
        $("#bloqueCerrarAbrirDiario #botonAbrirCerrarDiario").val("Cerrar");        
    }
    
    //Vaciamos la información anterior y cargamos la nueva
    $("#bloqueCerrarAbrirDiario .informaCerradoAbiertoDiario").empty().append(
            "<div class='contenDatosInformeAbrirCerrarDiario'>" +
                "<input type='text' class='textoInformeAbrirCerrar' name='textoInformeAbrirCerrarDiario' value='" + textoAbiertoCerrado + "' readonly/>" +
                "<div class='" + claseAbiertoCerrado + "'></div>" +
            "<div class='cancelarFlotantes'></div>" +
            "</div>"
            );
}

function mostrarInicialFinalAsientos(id, nAsientos){
    
    /* Comprobamos si introducimos un número para realizar el calculo de asientos
    * que se crearán
    */
    if (isNaN(nAsientos) || nAsientos < 1 || nAsientos == "") {
        // Eliminamos los resultados
        $("#textoAsientoInicial").val("");
        $("#textoAsientoFinal").val("");
    } else {
        var primerAsiento = parseInt(listaDiarios[id].asientos) + 1;
        var ultimoAsiento = parseInt(listaDiarios[id].asientos) + nAsientos;

        // Mostramos los valores en los campos correspondientes
        $("#textoAsientoInicial").val(primerAsiento);
        $("#textoAsientoFinal").val(ultimoAsiento);

    }
}


/*
 * Función para mostrar datos en el campo ADMINISTRAR-CREAR ASIENTOS
 * 
 */

function  mostrarBloqueCrearAsientos() {
    
    // Recuperamos la lista de diarios
    $.ajax({
        url: "./miAjax/listarDiarios.php",
        type: 'POST',
        dataType: 'json',        
    }).done(function (diarios){        
        // Guardamos en la variable golbal
        listaDiarios = diarios;
        
        // Borramos los datos anteriores
        $("#bloqueCrearAsientos #diario").empty();
        
        // Recorremos todos los diarios
        for (var i in diarios) {            
            // Solo introducimos los diarios activos
            if(diarios[i].cerrado == 1)
                $("#bloqueCrearAsientos #diario").append("<option value='" + i + "'>" + diarios[i].diario + "</option>");
        }
        
        // Mostramos los datos del primer diario seleccionado
        mostrarDatosDiario(0);
        
        // Recuperamos el valor del número de asientos que se quiere crear
        var nAsientos = parseInt($("#numeroAsientos").val());
        
        // Mostramos los datos de los asientos que se crearan
        mostrarInicialFinalAsientos(0, nAsientos);        
        
    }).fail(function() {
         alert("No su pudo listar los DIARIOS de la base de datos!");
    });
    
    $("#bloqueCrearAsientos").show("slow");
}


/*
 *  Función para mostrar datos en el campo ADMINISTRAR-CREAR DIARIO
 */
function  mostrarBloqueCrearDiario() {
    
    // Recuperamos la lista de diarios
    $.ajax({
        url: "./miAjax/listarDiarios.php",
        type: 'POST',
        dataType: 'json',        
    }).done(function (diarios){        
        // Guardamos en la variable golbal        
        listaDiarios = diarios;
        
        $ultimoDiario = parseInt(diarios[0].diario);
        
        // Mostramos el último diario creado
        $("#bloqueCrearDiario .textoUltimoDiario").val($ultimoDiario);
        
        // Mostramos el diario correlativo que se puede crear
        $("#bloqueCrearDiario #numeroDiario").val($ultimoDiario+1);
        
    }).fail(function() {
         alert("No su pudo listar los DIARIOS de la base de datos!");
    });
    
    $("#bloqueCrearDiario").show("slow");
}


/*
 * Función para mostrar datos en el campo ADMINISTRAR-CERRAR/ABRIR DIARIO
 */
function  mostrarBloqueAbrirCerrarDiario() {
    
    // Recuperamos la lista de diarios
    $.ajax({
        url: "./miAjax/listarDiarios.php",
        type: 'POST',
        dataType: 'json',        
    }).done(function (diarios){        
        // Guardamos en la variable golbal
        listaDiarios = diarios;
        
        // Borramos los datos anteriores
        $("#bloqueCerrarAbrirDiario #diarioAbrirCerrar").empty();
        
        // Recorremos todos los diarios
        for (var i in diarios) {                        
                $("#bloqueCerrarAbrirDiario #diarioAbrirCerrar").append("<option value='" + i + "'>" + diarios[i].diario + "</option>");
        }        
        
        // Mostramos los datos del primer diario seleccionado
        mostrarDatosAbiertoCerradoDiario(0);
        
    }).fail(function() {
         alert("No su pudo listar los DIARIOS de la base de datos!");
    });
    
    $("#bloqueCerrarAbrirDiario").show("slow");
}



/*
 * FUNCIÓN PARA VALIDAR LOS DATOS INTRODUCIDOS EN EL FORMULARIO DE CREACIÓN
 * DE NUEVOS ASIENTOS.
 * 
 * @param {type} miID
 * @returns {Boolean}
 */
function  validarDatosNuevosAsientos(miID) {
    // Variable de control
    var validado = true;
    // Inicializamos el array
    datosGrabar = new Array(); 
    
    /*
     * VALIDO LOS DATOS INTRODUCIDOS
     * @type jQuery
     */
    
    var idDiario = $(miID + " #diario").val(); 
    // Valido el número de Diario
    var miDiario = parseInt(listaDiarios[idDiario].diario);    
    if (isNaN(miDiario) || miDiario == "" || miDiario < 1) {
        validado = false;   // Cambiamos la variable de control
        // Mostramos el error            
        $(miID + " #diario").focus().after("<span class='campoError'>Número incorrecto!</span>");
    }  
    
    var nAsientos = $(miID + " #numeroAsientos").val(); 
    // Valido el número de Asientos    
    if (isNaN(nAsientos) || nAsientos == "" || nAsientos < 1) {
        validado = false;   // Cambiamos la variable de control
        // Mostramos el error            
        $(miID + " #numeroAsientos").focus().after("<span class='campoError'>Número incorrecto!</span>");
    }  
    
    // Recupero el valor introducido
    var miFecha = new Date($(miID + " #fechaAsientos").val());
    
    // Compruebo que el formato introducido de la fecha es correcto
    if (validado && ((miFecha.getDate() < 1 || miFecha.getDate() > 31) || ((miFecha.getMonth() + 1) < 1 || (miFecha.getMonth() + 1) > 12) || miFecha.getFullYear() < 2016 || $(miID + " #fechaAsientos").val() == "")) {
        validado = false;   // Cambiamos la variable de control            
        // Mostramos el error            
        $(miID + " #fechaAsientos").focus().after("<span class='campoError'>Fecha no valida!</span>");
    } else {
        // Comprobamos que la fecha ahora introducida es mayor o igual que la del último asiento grabado
        var fechaUltimoAsiento = new Date(listaDiarios[idDiario].fechaAsiento);
        if (miFecha < fechaUltimoAsiento) {
            validado = false;   // Cambiamos la variable de control            
            // Mostramos el error            
            $(miID + " #fechaAsientos").focus().after("<span class='campoError'>Fecha no valida!</span>");
        }
    }
    
     // Devolvemos el resultado
    if(validado){        
        datosGrabar = {idDiario: listaDiarios[idDiario].id, diario: miDiario, ultimoAsiento: listaDiarios[idDiario].asientos, nAsientos: nAsientos , fechaAsiento: $(miID + " #fechaAsientos").val()};        
        return validado;
    }
    else {
        // Ocultamos los errores pasados 3 segundos.
        setTimeout("$('.campoError').hide('slow');", 2000);       
    }
    
}

/*
 * FUNCIÓN PARA VALIDAR LOS DATOS INTRODUCIDOS EN EL FORMULARIO DE CREACIÓN
 * DE NUEVOS DIARIOS.
 * 
 * @param {type} miID
 * @returns {Boolean}
 */
function  validarDatosNuevoDiario(miID) {
    // Variable de control
    var validado = true;
    
    // Inicializamos el array
    datosGrabar = new Array(); 
    
    
    /*
     * VALIDO LOS DATOS INTRODUCIDOS
     *     
     */        
    // Valido el número de Diario
    var miDiario = parseInt($(miID + " #numeroDiario").val());        
    if (isNaN(miDiario) || miDiario == "" || miDiario < 1) {
        validado = false;   // Cambiamos la variable de control
        // Mostramos el error            
        $(miID + " #numeroDiario").focus().after("<span class='campoError'>Número incorrecto!</span>");
    }  
    
    // Recupero el valor introducido
    var miFecha = new Date($(miID + " #fechaDiario").val());
    
    // Compruebo que el formato introducido de la fecha es correcto
    if (validado && ((miFecha.getDate() < 1 || miFecha.getDate() > 31) || ((miFecha.getMonth() + 1) < 1 || (miFecha.getMonth() + 1) > 12) || miFecha.getFullYear() < 2016 || $(miID + " #fechaDiario").val() == "")) {
        validado = false;   // Cambiamos la variable de control            
        // Mostramos el error            
        $(miID + " #fechaDiario").focus().after("<span class='campoError'>Fecha no valida!</span>");
    }
    
     // Devolvemos el resultado
    if(validado){        
        datosGrabar = {diario: miDiario, fechaAsiento: $(miID + " #fechaDiario").val()};        
        return validado;
    }
    else {
        // Ocultamos los errores pasados 3 segundos.
        setTimeout("$('.campoError').hide('slow');", 2000);       
    }
    
}


function crearNuevosAsientos(miID){
    $.ajax({
        url: "./miAjax/grabarNuevosAsientos.php",
        type: 'POST',
        dataType: 'json',
        data: {datos: datosGrabar}
    }).done(function (resultado){
        if (resultado[0].noGrabados == 0 && resultado[0].grabadoDiario == true) {
            var texto = "¡ Creados correctamente: " + datosGrabar.nAsientos + " asientos en el diario: " + datosGrabar.diario + " !";
            mostrarCampoResultadoGrabar("correcto", miID, texto);
        } else {
            var texto = "¡ Error al crear los asientos en el diario: " + datosGrabar.diario + " (ver acciones) !";
            mostrarCampoResultadoGrabar("error", miID, texto);
        }                
    }).fail(function() {
         alert("No su pudo grabar los nuevos asientos!");
    });
    
    
}

function crearNuevoDiario(miID){
    $.ajax({
        url: "./miAjax/grabarNuevoDiario.php",
        type: 'POST',
        dataType: 'json',
        data: {datos: datosGrabar}
    }).done(function (resultado){
        
        if (resultado[0].grabadoDiario == true) {
            var miFecha = new Date(datosGrabar.fechaAsiento);
            var formatoFechaDiario = digitosFecha(miFecha.getDate()) + "/" + digitosFecha((miFecha.getMonth() + 1)) + "/" + miFecha.getFullYear();                
            var texto = "¡ Creado correctamente el diario: " + datosGrabar.diario + " con fecha apertura: " + formatoFechaDiario + " !";
            mostrarCampoResultadoGrabar("correcto", miID, texto);
        } else {
            var texto = "¡ Error al crear el diario: " + datosGrabar.diario + " (ver acciones) !";
            mostrarCampoResultadoGrabar("error", miID, texto);
        }                
    }).fail(function() {
         alert("No su pudo grabar el NUEVO DIARIO !");
    });
}


function modificarAbrirCerrarDiario(miID){
    $.ajax({
        url: "./miAjax/modificarAbrirCerrarDiario.php",
        type: 'POST',
        dataType: 'json',
        data: {datos: datosGrabar}
    }).done(function (resultado){
        // Formo el texto para mostrar en el campo resultados
        var textoAbiertoCerrado = "";
        var textoErrorAbiertoCerrado = "";
        // Comprobamos si esta abierto o cerrado el diario
        if (datosGrabar.cerrado == 0) {
            textoAbiertoCerrado = "CERRADO";
            textoErrorAbiertoCerrado = "CERRAR";
        }
        else {
            textoAbiertoCerrado = "ABIERTO";
            textoErrorAbiertoCerrado = "ABRIR";
        }
        
        if (resultado[0].grabadoDiario == true) {           
            var texto = "¡ "+textoAbiertoCerrado+ " correctamente el diario: " + datosGrabar.diario  + " !";
            mostrarCampoResultadoGrabar("correcto", miID, texto);
        } else {
            var texto = "¡ Error al " + textoErrorAbiertoCerrado + " el diario: " + datosGrabar.diario + " !";
            mostrarCampoResultadoGrabar("error", miID, texto);
        }                
    }).fail(function() {
         alert("No su pudo MODIFICAR el diario seleccionado !");
    });
}


/*
 * Cuando la página esté preparada
 * 
 */

$(function () {
    
    // Introducimos la información del proyecto en su campo
    mostrarInformacion();

    /*
     * 
     * DEFINIMOS LOS EVENTOS:
     * 
     */
    
    establecerEventosPagina();
    
    /*
     * Establecemos el evento para el boton diario de ADMINISTRAR ASIENTOS
     */
    $("#bloqueCrearAsientos #diario, #bloqueCrearAsientos #numeroAsientos").on('change keyup', function(){
        // Recuperamos la posición del diario seleccionado en el array de diarios
        var idDiario = $("#bloqueCrearAsientos #diario").val();        
        
        // Mostramos los datos del diario seleccionado
        mostrarDatosDiario(idDiario);
        
        // Recuperamos el valor del número de asientos que se quiere crear
        var nAsientos = parseInt($("#numeroAsientos").val());
        
        // Mostramos los datos de los asientos que se crearan
        mostrarInicialFinalAsientos(idDiario, nAsientos);        
        
    });
    
    
    /*
     * Establecemos el evento para el boton diario de ADMINISTRAR CERRAR/ABRIR DIARIO
     */
    $("#bloqueCerrarAbrirDiario #diarioAbrirCerrar").on('change', function(){
        // Recuperamos la posición del diario seleccionado en el array de diarios
        var idDiario = $("#bloqueCerrarAbrirDiario #diarioAbrirCerrar").val();        
        
        // Mostramos los datos del diario seleccionado
        mostrarDatosAbiertoCerradoDiario(idDiario);        
    });
    
    
    /* 
     * Establecemos los eventos para los botones:
     * GUARDAR/CANCELAR las modificaciones      
     */
    $(".botonGuardarConfirma, .botonCerrarConfirma").on('focus mouseenter', function () {
        mostrarBorde(this);
    });
    $(".botonGuardarConfirma, .botonCerrarConfirma").on('focusout mouseleave', function () {
        ocultarBorde(this);
    });
    
    $(".botonCerrarConfirma").click(function () {         
        // Desactivamos los campos de los demás elementos
        activarCampos();        
        // Ocultamos
        $(".bloqueAdministrar").css("display", "");    
    });
    
    $(".botonGuardarConfirma").click(function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();
        
        // Borramos las posibles notificaciones de errores existentes
        $(".campoError").remove();
        
        // Recupero el ID asignado al campo seleccionado para modificar
        var miID = $(this).data("id");
        
        // Comprobamos que evento fué seleccionado
        if (miID == "#bloqueCrearAsientos") {
            if (validarDatosNuevosAsientos(miID)) {
                // Formo el texto para mostrar en el campo confirmación
                var asientoInicial = $(miID + " #textoAsientoInicial").val();
                var asientoFinal = $(miID + " #textoAsientoFinal").val();
                var miFecha = new Date($(miID + " #fechaAsientos").val());
                var formatoFechaAsientos = digitosFecha(miFecha.getDate()) + "/" + digitosFecha((miFecha.getMonth() + 1)) + "/" + miFecha.getFullYear();
                var idDiario = $(miID + " #diario").val();                 
                var miDiario = listaDiarios[idDiario].diario;    
                
                var texto = "Crear asientos Nº: " + asientoInicial + " al " + asientoFinal + " con fecha: " + formatoFechaAsientos + " en diario: " + miDiario + " ?";
                mostraCampoConfirmacion(miID, texto);
            }
        }        
        
        if (miID == "#bloqueCrearDiario") {
            if (validarDatosNuevoDiario(miID)) {
                // Formo el texto para mostrar en el campo confirmación
                var nuevoDiario = $(miID + " #numeroDiario").val();                
                var miFecha = new Date($(miID + " #fechaDiario").val());
                var formatoFechaDiario = digitosFecha(miFecha.getDate()) + "/" + digitosFecha((miFecha.getMonth() + 1)) + "/" + miFecha.getFullYear();                
                var texto = "Crear diario número: " + nuevoDiario + " con fecha de apertura: " + formatoFechaDiario + " ?";
                
                mostraCampoConfirmacion(miID, texto);
            }
        }
        
        if (miID == "#bloqueCerrarAbrirDiario") {                        
            // Recuperamos la posición del diario seleccionado en el array de diarios
            var idDiario = $(miID + " #diarioAbrirCerrar").val();
            var valorCerradoAbierto = 0;
            
            // Inicializamos el array de datos
            datosGrabar = new Array(); 
            
            // Formo el texto para mostrar en el campo confirmación
            var textoAbiertoCerrado = "";
            // Comprobamos si esta abierto o cerrado el diario
            if (listaDiarios[idDiario].cerrado == 0){
                textoAbiertoCerrado = "ABRIR";
                valorCerradoAbierto = 1;
            }
            else {
                textoAbiertoCerrado = "CERRAR";
                valorCerradoAbierto = 0;
            }
            
            // Guardamos los datos de modificación
            datosGrabar = {id: listaDiarios[idDiario].id, diario : listaDiarios[idDiario].diario, cerrado: valorCerradoAbierto};
            
            var texto = "Realmente quieres " + textoAbiertoCerrado + " el diario: " + listaDiarios[idDiario].diario  + " ?";            

            mostraCampoConfirmacion(miID, texto);
        }
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    // Eventos para los botones GRABAR/CANCELAR nuevos datos
    $(".contenConfirmacion").on('focus mouseenter', ".botonConfirmaGrabar, .botonConfirmaCerrar", function () {
        $(this).css("border-color", "red");
        $(this).css("color", "red");
    });
    $(".contenConfirmacion").on('focusout mouseleave', ".botonConfirmaGrabar, .botonConfirmaCerrar", function () {
        $(this).css("border-color", "");
        $(this).css("color", "");
    });    
    
    $(".contenConfirmacion").on('click', ".botonConfirmaCerrar", function () {
        // Recupero el ID asignado al campo seleccionado para modificar
        var miID = $(this).data("id");
        //Oculto y vacío el campo de confirmación
        $(miID + " .contenConfirmacion").empty().css("display", "none");
        // Mostramos los datos nuevamente
        $(miID + " .contenZonaDatos").css("display", "block");
    });
    
    $(".contenConfirmacion").on('click', ".botonConfirmaGrabar", function () {
        // Recupero el ID asignado al campo seleccionado para modificar
        var miID = $(this).data("id");
        
        // Borramos los campos trabajando creados anteriormente
        $(miID + " .contenTrabajando").remove();
        
        // Ocultamos el campo de confirmación
        $(miID + " .contenConfirmacion").css("display", "none");
        // Ocultamos el campo unión de datos
        $(miID + " .contenZonaUnion").css("display", "none");
        
        
        // Añadimos la imagen de "trabajando"
        $(miID).append("<img class='contenTrabajando' src='./imagenes/trabajando.gif'/>");
        $(miID + " .contenTrabajando").css({
            "margin-left": "140px",
            "margin-top": "35px"
        }); 
        
        // Comprobamos que evento fué seleccionado
        if (miID == "#bloqueCrearAsientos") {
            // Grabo los datos correspondientes
            crearNuevosAsientos(miID);
        }
        if (miID == "#bloqueCrearDiario") {
            // Grabo los datos correspondientes
            crearNuevoDiario(miID);
        }
        if (miID == "#bloqueCerrarAbrirDiario") {
            // Grabo los datos correspondientes
            modificarAbrirCerrarDiario(miID);
        }
        
    });
    
    
    
    /*
     * Establecemos el evento "click" para el botón LISTAR ACCIONES
     */
    $("#mostrarAcciones").click(function (evento) {
        // Detenemos la acción predeterminada del evento
        evento.preventDefault(); 
        
        //LLamamos a la función para desactivar campos
        desactivarTotalCampos();
        
        //Sacamos la barra de desplazamiento
        $("#zonaRelacionControles").css("overflow-y", "hidden");
        
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
        
        // Ocultamos los bordes de selección
        ocultarBorde(".botonMenu");
        
        /*
         * Ocultamos el menú de botones y mostramos el botón para poder
         * desplegarlo nuevamente.      
         */
        $("#zonaBotonMenu").slideDown("slow"); // Muestro el botón
        $("#zonaControl").slideUp("slow");  // Oculto el menu de botones
        
        //Mostramos la barra de desplazamiento
        $("#contenedorZonaAcciones").css("overflow-y", "");
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });
    
    
    /*
     * FIN DE LA DEFINICIÓN DE EVENTOS
     */
    


}); // Fin de la página preparada