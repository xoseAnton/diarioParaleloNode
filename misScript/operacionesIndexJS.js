
/*
 * Función introduce los usuarios activos definidos en la base de datos
 * en un "select".
 * @returns Lista de usuarios de la base de datos
 */
function listarUsuario() {        
    // Solicito el evento para buscar usuarios en el servidor
    conexionNode.emit("buscaUsuarios");    
    // En la conexión NODE creada escucho un evento llamado "usuarios"   
    conexionNode.on("usuarios", function (usuarios){
         // Recorro todos los valores optenidos
        for (var i in usuarios) {
            $("#usuario").append("<option value='"+usuarios[i].id+"'>"+usuarios[i].nombre+"</option>");
        }
    });
    
    // Añadimos un campo vacio
    $("#usuario").append("<option value='' selected='true'></option>");        
}


/*
 * Función para comprobar si un usuario está defindo
 * @param {type} datos
 * @returns {undefined}
 */
function comprobarUsuario(datos){  
    // Enviamos la solicitud ajax a la página del servidor
    $.ajax({
        url: "./miAjax/comprobarUsuario.php",
        type: 'POST',
        dataType: 'json',        
        data: {datos: datos}
    }).done(function (resultado){        
        // Si se produjo un error de indentificación lo mostramos
        if(resultado.error) {
            // Mostramos el error            
            $("#contraseña").focus().after("<span class='campoError'>"+resultado.textoError+"</span>");
        }
        else {
            document.location.href = "asientosDiario.php";
        }        
    }).fail(function() {
         alert("No su pudo comprobar la AUTENTIFICACIÓN del usuario en la base de datos!");
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
 * Función para borrar el campo de errores
 */
function borrarErrores() {
    $(".campoError").remove();
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
       // Creamos el array con los datos y codificamos la contraseña introducida
       var datos = {id:$("#usuario").val(), contraseña: md5($("#contraseña").val())};
      // Comprobamos usuario y contraseña en la base de datos.
       comprobarUsuario(datos);      
   });
   
});


