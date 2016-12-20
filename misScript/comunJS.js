// Defino el array global con los datos del Proyecto
var informeProyecto = new Array(["Realizado por: ", "Jose Antonio Mariño Outeiro"],
                                ["Para: ", "Proyecto DAW"],
                                ["Versión: ", "1.0 Diario Paralelo Registro"],
                                ["Base de datos: ", "MySQL"],
                                ["Servidor web: ", "Microsoft-IIS/8.5"],
                                ["Versión de PHP: ", "5.6"]);
                                


// Creo una conexión al servidor NODE
var conexionNode = io.connect("http://localhost:2500/");    


// Creo una clase ASIENTO EN JAVASCRIPT para las modificaciones del asiento
function AsientoInicial () {
    // Atributos de la clase
    this.idInicial = "";
    this.situacion = "";
    this.incidencia = "";
    this.otroTexto = "";
    this.asignado = "";
    this.cerrado = 0;
    this.colorBorde = "";
    
    // Método para recuperar los datos introducidos en el Asiento
    this.recuperaDatosInicialAsiento = function (idAsiento) {
        this.idInicial = idAsiento;
        this.situacion = $(idAsiento + " input.textoSituacion").val();
        this.incidencia = $(idAsiento + " input.textoIncidencia").val();
        this.otroTexto = $(idAsiento + " input.textoOtros").val();
        this.asignado = $(idAsiento + " input.asignado").val();
        if ($(idAsiento + " input.checkActivo").is(':checked')) {
            this.cerrado = 1;
        } else {
            this.cerrado = 0;
        }
        this.colorBorde = $(this.idInicial + " .contenAsiento").css("border-color");
    }

    // Método para mostrar los datos modificables de un asiento
    this.mostrarDatosInicialesAsiento = function () {
        $(this.idInicial + " .textoSituacion").val(this.situacion);
        $(this.idInicial + " .asignado").val(this.asignado);
        $(this.idInicial + " .textoIncidencia").val(this.incidencia);
        $(this.idInicial + " .textoOtros").val(this.otroTexto);
        if (this.cerrado == 1) {            
            $(this.idInicial + " input.checkActivo").prop("checked", true);
            $(this.idInicial + " input.checkActivo").css("outline", "4px solid green");
        } else {            
            $(this.idInicial + " input.checkActivo").prop("checked", false);
            $(this.idInicial + " input.checkActivo").css("outline", "4px solid red");
        }        
        // Muestro el borde como estaba inicialmente
        $(this.idInicial + " .contenAsiento, " + this.idInicial + " .contenDatos").css("border-color", this.colorBorde);
        $(this.idInicial + " .contenBotonsBaixo").css("border-top-color", this.colorBorde);
    }

    // Método para actualizar datos en un asiento
    this.actualizarDatosAsiento = function (situacion, asignado, incidencia, otroTexto, cerrado) {
        $(this.idInicial + " .textoSituacion").val(situacion);
        $(this.idInicial + " .asignado").val(asignado);
        $(this.idInicial + " .textoIncidencia").val(incidencia);
        $(this.idInicial + " .textoOtros").val(otroTexto);
        if (cerrado == 1) {
            $(this.idInicial + " input.checkActivo").prop("checked", true);
            $(this.idInicial + " input.checkActivo").css("outline", "4px solid green");
        } else {
            $(this.idInicial + " input.checkActivo").prop("checked", false);
            $(this.idInicial + " input.checkActivo").css("outline", "4px solid red");
        }
        
        // Muestro el borde con otro color inidicando que fué modificado
        $(this.idInicial + " .contenAsiento, " + this.idInicial + " .contenDatos").css("border-color", "orange");
        $(this.idInicial + " .contenBotonsBaixo").css("border-top-color", "orange");
    }
    
};


/*
 * Función para mostrar la información del Proyecto
 * @returns {undefined}
 */
function mostrarInformacion() {
    // Comprobamos que esta definido el array de datos
    if(typeof informeProyecto != "undefined") {
        // Recorro todo el array
        for(var i=0; i<informeProyecto.length; i++) {
            $("#contenedorTextoInformacion").append("<p class='textoInformacion'><span class='textoTituloInformacion'>"+informeProyecto[i][0]+"</span>"+informeProyecto[i][1]+"</p>");
        }
        // Introducimos la localización del Registro
        $("#contenedorTextoInformacion").append("<p class='textoInformacion'><span id='textoLocalizacion' class='textoTituloInformacion'>Localización: </span>"+
                                                "<input type='button' id='botonLocalizacion' name='botonLocalizacion' value=''/></p>");
    }
    else {
         $("#contenedorTextoInformacion").html("<p class='textoInformacion'><span class='textoTituloInformacion'>Aviso: </span>Información no disponible!</p>");
    }
    
    /*
     * Animación para la zona "bloque de Información" 
     */    
    $("#botonInformacion").mouseenter(function () { // Cuando gana el foco      
        $("#botonInformacion").css("background-color", "purple");
        $("#contenedorInformacion").fadeIn("slow"); //Aparición progresiva
    });    
    $("#contenedorInformacion").hover(function () { // Cuando gana el foco      
        $("#contenedorInformacion").css("display", "block"); // Mostramos la información
    }, function () { // Cuando pierde el foco
        $("#botonInformacion").css("background-color", "");
        $("#contenedorInformacion").hide("slow"); //Desaparición con desplazamiento
    });    
    
    /* 
     * Eventos para el boton "Localización"
     */
    $("#botonLocalizacion").hover(function (){
       $("#textoLocalizacion").css("color", "red");
       $("#botonLocalizacion").css("background-size", "110%");
    }, function () {
        $("#textoLocalizacion").css("color", "");
        $("#botonLocalizacion").css("background-size", "");
    });    
    
    $("#botonLocalizacion").click(function (evento){
        // Detenemos la acción predeterminada del evento
        evento.preventDefault();        
        
        var a = document.createElement("a");
        a.target = "_blank";  
        a.href = "https://www.google.es/maps/place/Registro+de+la+Propiedad+de+Negreira/@42.9099353,-8.7367809,17.5z/data=!4m5!3m4!1s0xd2ee3f01640822b:0xec3eec67925b6d78!8m2!3d42.9097886!4d-8.7350423"
        a.click();
        
        // Paramos la propagación indeseada del evento
        evento.stopPropagation();
    });    
}


/*
 * FUNCIÓN PARA MOSTRAR EL BORDE DE UN ELEMENTO
 */
function mostrarBorde(idElemento){
    $(idElemento).css("border", "2px solid purple");
    $(idElemento).css("color", "red");
}


/*
 * FUNCIÓN PARA OCULTAR EL BORDE DE UN ELEMENTO
 */
function ocultarBorde(idElemento){
    $(idElemento).css("border", "");
    $(idElemento).css("color", "");
}


/*
 * FUNCIÓN PARA MOSTRAR EL BORDE DEL CAMPO LISTADO
 */
function mostrarBordeContenBusqueda(idElemento){
    // Cambiamos el estilo de todos los demas contenedores
    $(".contenedorBusqueda").css("border", "2px solid purple");
    // Obtenemos el nombre de la clase seleccionada
    var nombreClase = $(idElemento).attr('class');    
    var nombreId = $(idElemento).attr('id');    
    if (nombreClase == "contenedorBusqueda") {
        $(idElemento).css("border", "0.2em solid #93C572");
        if(nombreId == "buscaEstadoActivo" || nombreId == "buscaEstadoCerrado" || nombreId == "buscaEstadoTodos")
            $("#buscaEstado").css("border", "0.2em solid #93C572");
    }
    else {
        $(idElemento).parents(".contenedorBusqueda").css("border", "0.2em solid #93C572");
        if(nombreId == "buscaEstadoActivo" || nombreId == "buscaEstadoCerrado" || nombreId == "buscaEstadoTodos")
            $("#buscaEstado").css("border", "0.2em solid #93C572");
    }
}


/*
 * FUNCIÓN PARA OCULTAR EL BORDE DEL CAMPO LISTADO
 */
function ocultarBordeContenBusqueda(idElemento){
    if ($(idElemento).attr('class') == "contenedorBusqueda")
        $(idElemento).css("border", "2px solid purple");
    else
        $(idElemento).parents(".contenedorBusqueda").css("border", "2px solid purple");
}


/*
 * Función para mostrar las acciones realizadas en todas las páginas.
 */
function mostrarAcciones() {        
    $.ajax({
        url: "./miAjax/listarAcciones.php",
        type: 'POST',
        dataType: 'json',        
    }).done(function (resultado){        
        for (var i in resultado) {
            $(".contenedorIncidencias").append(resultado[i].accion+"\n");
        }
    }).fail(function() {
         alert("No su pudo listar las acciones realizadas!");
    });
    
}


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


