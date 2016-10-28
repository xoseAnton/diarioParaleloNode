
/*
 * Función introduce los usuarios activos definidos en la base de datos
 * en un "select".
 * @returns Lista de usuarios de la base de datos
 */
function listarUsuario() {
    // Enviamos la solicitud ajax a la página del servidor
    $.getJSON("./miAjax/listarUsuarios.php", function (resultado){
        // Recorro todos los valores optenidos
        $.each(resultado, function (i, usuario){
            $("#usuario").append("<option value='"+usuario.id+"'>"+usuario.nombre+"</option>")
        });
    });
    
    // Añadimos un campo vacio
    $("#usuario").append("<option value='' selected='true'></option>");    
}



function comprobarUsuario(datos){    
    // Enviamos la solicitud ajax a la página del servidor
    $.getJSON("./miAjax/comprobarUsuario.php", datos, function (resultado) {
        // Si se produjo un error de indentificación lo mostramos
        if(resultado[0].error) {
            $("#campoError").html(resultado[0].textoError);
            $("#campoError").css("visibility", "visible");
        }
        else {
            document.location.href = "asientosDiario.php";
        }
    });
}


/*
 * Función para comprobar si un elemento tiene datos
 */
function contenDatos(idElemento) {
    /* Obtengo el valor contenido en el elemento y lo 
     * tranformo en un string
     */
   
    var valor = new String($(idElemento).val());
    /* Expresión regular para encontrar espacios en blanco: (uno o más) */
    var cadena = /\s+/;    
    // Compruebo la expresión. Coincide = true
    var compruebo = valor.match(cadena) ? true : false;
    
    /*
     * Comprobamos también que no tenga níngún valor (null)
     * o una longitud de 0.
     */
    if(valor == null || valor.length == 0 || compruebo){
        return false;
    }
    else 
        return true;
}


/*
 * Función para desplazar elemento
 */
function desplaza(idElemento) {
    $(idElemento).show(800);
}


/*
 * Función para ocultar errores
 */
function ocultarErrores() {
    $("#campoError").css("visibility", "hidden");
}


/*
 * Cuando la página esté preparada
 * @returns {undefined}
 */
$(function (){    
    // Introducimos la información del proyecto en su campo
    mostrarInformacion();
    
    // Introducimos los usuarios activos en la página
    listarUsuario();
        
   // Animación para la zona "bloque de Información" 
   $("#botonInformacion").hover(function (){ // Cuando gana el foco      
      $("#botonInformacion").css("background-color", "purple");
      $("#contenedorInformacion").fadeIn("slow"); //Aparición progresiva
   }, function (){ // Cuando pierde el foco
       $("#botonInformacion").css("background-color", "");
      $("#contenedorInformacion").hide("slow"); //Desaparición con desplazamiento
   }); 
   
   
   /* Cargamos la función de validación para el formulario
    * 
    * @param {type} idElemento
    * @returns {undefined}
    */ 
   $("#usuario, #contraseña").on("change keyup", function (){
      
      // Si tenemos datos en los dos campos
      if(contenDatos("#usuario") && contenDatos("#contraseña")) {            
          // Habilitamos el boton entrar
            $("#botonEntrar").removeAttr("disabled");
            
            // Establecemos los eventos
            $("#botonEntrar").focus( function (){
                mostrarBorde("#botonEntrar");
            });            
            $("#botonEntrar").focusout( function (){
                ocultarBorde("#botonEntrar");
            });            
            $("#botonEntrar").hover( function (){
                mostrarBorde("#botonEntrar");}, function (){
                ocultarBorde("#botonEntrar");
            });
      }
      else {    // Si no tenemos datos en los dos campos
          // Deshabilitamos el boton entrar
          $("#botonEntrar").attr("disabled", "disabled");
          // Suprimimos los eventos
          $("#botonEntrar").off("focus");
          $("#botonEntrar").off("hover");
      }
   });
   
   $("#botonEntrar").click( function(evento){
       // Detenemos la acción del botón input:submit
       evento.preventDefault();
       // Creamos el array con los datos
       var datos = {id:$("#usuario").val(), contraseña:$("#contraseña").val()};       
      // Comprobamos usuario y contraseña en la base de datos.
       comprobarUsuario(datos);      
   });
   
});


