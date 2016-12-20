<?php
// Antes de nada inicio una nueva sesión o reanudo la existente
session_start();



// Establecemos por defecto la zona horaria
date_default_timezone_set('Europe/Berlin');


if (!isset($_SESSION['usuario'])) {    
    // Borramos los datos de la sesión
    session_unset();
    // Redirigimos a la pantalla inicial
    header("Location: index.php");
}


// Comprobamos si queremos regresar a la página anterior
if (isset($_POST['regresar'])) {
    // Redirigimos a la pantalla de Asientos Diario
    header("Location: asientosDiario.php");
}


// Comprobamos si queremos desconectar la página
if (isset($_POST['desconectar'])) {
    // Borramos los datos de la sesión
    session_unset();
    // Redirigimos a la pantalla inicial
    header("Location: index.php");
}

function mostrarCreacionAsientos(){
    //-- Zona de control PARA ASIENTOS --    
    echo "<div class='bloqueControl'>".
            "<div class='contenBotonActivar' data-id='#bloqueCrearAsientos'>".
                "<div class='contenTextoBoton'>Añadir</br>Asientos</div>".
            "</div>".

            "<div id='bloqueCrearAsientos' class='bloqueAdministrar'>".
                "<div class='contenZonaUnion'>".
                    "<div class='contenUnionDivision'></div>".
                "</div>".          
                // Zona de confirmación guardar datos
                "<div class='contenConfirmacion'></div>".
            
                "<div class='contenZonaDatos'>".            
                //-- Formulario para el envio: Añadir Asientos --
                "<form id='formularioAñadirAsientos' name='formularioAñadirAsientos'>".
                        
                    "<div id='contenTextoDiario'>".
                        "<label>Diario:</label>".
                    "</div>".
                    "<div class='contenDiario'>".
                        "<select id='diario' name='diario' required title='Número de diario'>".
                        "</select>".
                    "</div>".
                    "<div class='contenInformeDiario'></div>".                    

                    //-- Introducimos los datos para añadir al diario --
                    "<div id='contenIntroducirDatos'>".
                        "<fieldset id='introducirDatosAsiento'>".
                            "<legend>Datos para añadir al diario:</legend>".
                            "<div id='contenNumeroAsientos'>".
                                "<label class='textoIntroducirDatos'>Número de asientos:</label>".
                                "<input type='number' id='numeroAsientos' name='numeroAsientos' value='1' min='1' max='9999' step='1' required />".
                                "<div class='cancelarFlotantes'></div>".
                            "</div>".
                            "<div id='contenFechaAsientos'>".
                                "<label class='textoIntroducirDatos'>Fecha presentacion:</label>".
                                "<input type='date' id='fechaAsientos' name='fechaAsientos' required/>".
                                "<div class='cancelarFlotantes'></div>".
                            "</div>".
                        "</fieldset>".
                    "</div>".

                    "<div id='contenResultadoBotones' >".
                        "<div id='contenResultadosAsientos'>".
                            "<div class='contenTextoResultadosAsientos'><label class='textoResultadosAsientos'>Se crearán los asientos números:</label></div>".
                            "<div class='contenTextoResultadosAsientos'>".
                                "<input type='text' id='textoAsientoInicial' name='textoAsientoInicial' value='' readonly />".
                                "<div class='contenTextoResultadosIntermedio'><label class='textoResultadosAsientos'>al</label></div>".
                                "<input type='text' id='textoAsientoFinal' name='textoAsientoFinal' value='' readonly />".
                                "<div class='cancelarFlotantes'></div>".
                            "</div>".
                        "</div>".
                        "<div id='contenBotonsAsientos'>".
                            "<div id='zonaBotonGuardarAsientosID' class='zonaBotonGuardar'>".
                                "<input type='submit' class='botonGuardarConfirma' name='botonGuardarAsientos' data-id='#bloqueCrearAsientos' value='Guardar' title='Guardar los asientos nuevos en el diario'/>".
                            "</div>".
                            "<div id='zonaBotonCancelarAsientosID' class='zonaBotonCancelar'>".
                                "<input type='reset' class='botonCerrarConfirma' name='botonCancelar' value='Cancelar' title='Cancelar la operación de guardar nuevos asientos'/>".
                            "</div>".
                            "<div class='cancelarFlotantes'></div>".
                        "</div>".
                    "</div>".
                    "<div class='cancelarFlotantes'></div>".
                "</form>".
            //-- Fin formulario: Añadir Asientos --
            
            
                "</div>".
                "<div class='cancelarFlotantes'></div>".
            "</div>".
            
            "<div class='cancelarFlotantes'></div>".
        "</div>";
}

function mostrarCrearDiario(){
    //-- Zona de control PARA CREAR NUEVO DIARIO --
    echo "<div class='bloqueControl'>".
            "<div class='contenBotonActivar' data-id='#bloqueCrearDiario'>".
                "<div class='contenTextoBoton'>Crear</br>Diario</div>".
            "</div>".

            "<div id='bloqueCrearDiario' class='bloqueAdministrar'>".
                "<div class='contenZonaUnion'>".
                    "<div class='contenUnionDivision'></div>".
                "</div>".

                // Zona de confirmación guardar datos
                "<div class='contenConfirmacion'></div>".

                "<div class='contenZonaDatos'>".

                    //-- Formulario para el envio: Crear Diario --            
                    "<form id='formularioCrearDiario' name='formularioCrearDiario'>".
                        "<div id='contenInformeUltimoDiario'>".
                            "<div class='contenDatosInformeUltimoDiario'>".
                                "<div class='datosInformeDiario'>".
                                    "<label class='tituloDatosInforme'>Último diario creado:</label>".
                                "</div>".
                                "<div class='datosInformeDiario'>".
                                    "<input type='text' class='textoUltimoDiario' name='ultimoDiario' value='' readonly/>".
                                "</div>".
                            "</div>".
                        "</div>".
                                        
                        //-- Introducimos los datos para CREAR EL NUEVO DIARIO --
                        "<div id='contenIntroducirDatosCrearDiario'>".
                            "<fieldset id='introducirDatosCrearDiario'>".
                                "<legend>Datos para crear nuevo diario:</legend>".
                                "<div id='contenNumeroDiario'>".
                                    "<label class='textoIntroducirDatos'>Nuevo diario:</label>".                            
                                    "<input type='text' id='numeroDiario' name='numeroDiario' value='' readonly required/>".
                                    "<div class='cancelarFlotantes'></div>".
                                "</div>".
                                "<div id='contenFechaDiario'>".
                                    "<label class='textoIntroducirDatos'>Fecha apertura:</label>".
                                    "<input type='date' id='fechaDiario' name='fechaDiario' value='' required/>".
                                    "<div class='cancelarFlotantes'></div>".
                                "</div>".
                            "</fieldset>".
                        "</div>".                             

                        "<div id='contenResultadoBotonesCrearDiario'>".
                            "<div id='contenBotonsCrearDiario'>".
                                "<div id='zonaBotonCrearDiario' class='zonaBotonGuardar'>".
                                    "<input type='button' class='botonGuardarConfirma' name='botonCrearDiario' data-id='#bloqueCrearDiario' value='Crear' title='Crea el nuevo diario'/>".
                                "</div>".
                                "<div id='zonaBotonCancelarDiario' class='zonaBotonCancelar'>".
                                    "<input type='reset' class='botonCerrarConfirma' name='botonCancelarDiario' value='Cancelar' title='Cancelar la operación de crear nuevo diario'/>".
                                "</div>".
                                "<div class='cancelarFlotantes'></div>".
                            "</div>".
                        "</div>".                             

                        "<div class='cancelarFlotantes'></div>".
                    "</form>".            
                //-- Fin formulario: Crear nuevo Diario
            
                "</div>".
                "<div class='cancelarFlotantes'></div>".
            "</div>".

        "<div class='cancelarFlotantes'></div>".
    "</div>";
}

function mostrarAbrirCerrarDiario(){
    
    //-- Zona de control ABRIR/CERRAR DIARIOS --
    echo "<div class='bloqueControl'>".
        "<div class='contenBotonActivar' data-id='#bloqueCerrarAbrirDiario'>".
            "<div class='contenTextoBoton'><label>Abrir</br>Cerrar</br>Diario</label></div>".
        "</div>".

        "<div id='bloqueCerrarAbrirDiario' class='bloqueAdministrar'>".
            "<div class='contenZonaUnion'>".
                "<div class='contenUnionDivision'></div>".
            "</div>".
            
            // Zona de confirmación guardar datos
            "<div class='contenConfirmacion'></div>".
            
            "<div class='contenZonaDatos'>".
            //-- Formulario para el envio: Cerrar/Abrir diario --
            
            "<form id='formularioAbrirCerrarDiario' name='formularioAbrirCerrarDiario'>".
            
                "<div id='contenTextoDiario'>".
                    "<label>Diario:</label>".
                "</div>".
                "<div class='contenDiario'>".
                    "<select id='diarioAbrirCerrar' name='diarioAbrirCerrar' required title='Número de diario'></select>".
                "</div>".
                "<div class='informaCerradoAbiertoDiario'></div>".

                "<div id='contenResultadoBotonesAbrirCerrarDiario' >".
                    "<div id='contenBotonsAbrirCerrarDiario'>".
                        "<div id='zonaBotonAbrirCerrarDiario' class='zonaBotonGuardar'>".
                            "<input type='button' id='botonAbrirCerrarDiario' class='botonGuardarConfirma' name='botonConfirmaAbrirCerrarDiario' data-id='#bloqueCerrarAbrirDiario' value='Cerrar' title='Cerrar/Abrir el diario'/>".
                        "</div>".
                        "<div id='zonaBotonCancelarAbrirCerrarDiario' class='zonaBotonCancelar'>".
                            "<input type='button' class='botonCerrarConfirma' name='botonCancelarAbrirCerrarDiario' value='Cancelar' title='Cancelar la operación de abrir/cerrar un diario'/>".
                        "</div>".
                        "<div class='cancelarFlotantes'></div>".
                    "</div>".
                "</div>".
                "<div class='cancelarFlotantes'></div>".
            "</form>".
            
            
            //-- Fin formulario: Cerrar/Abrir diario --
            "</div>".
            "<div class='cancelarFlotantes'></div>".
        "</div>".

        "<div class='cancelarFlotantes'></div>".
    "</div>";
}


?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <!-- Primero incluimos los estilos de la página -->
        <link href="estilos/estiloAdminDiario.css" rel="stylesheet" type="text/css">
        <link href="estilos/estiloComunProyecto.css" rel="stylesheet" type="text/css">
        <!-- Por último incluimos los Script que utilizaremos -->
        <script src="misIncludes/jquery-3.1.1.js" type="text/javascript"></script>
        <script src="misScript/comunJS.js" type="text/javascript"></script>
        <script src="misScript/operacionesAdminDiarioJS.js" type="text/javascript"></script>
        <title>Administrar Diario Paralelo</title>
    </head>
    <body>
        
        <!-- Zona de Información -->
        <div id="bloqueInformacion">
            <div id="contenedorBotonInformacion">
                <input type="button" id="botonInformacion" name="botonInformacion" value="" />
                <div id="contenedorInformacion">
                    <div id="contenedorTextoInformacion"></div>
                </div>
            </div>           
            <div class="cancelarFlotantes"></div>
        </div>
        

        <!-- Zona para mostrar las acciones realizadas -->
        <div id="contenedorZonaAcciones">                
            <div id="zonaAcciones">
                <div id="zonaTextoAcciones">
                    <label id="portadaAcciones">Acciones:</label>
                    <div id="contenedorTextoIncidencias">
                        <textarea class='contenedorIncidencias' cols='54' rows='22' readonly></textarea>
                    </div>                                
                </div>
                <div id="zonaBotonAcciones">
                    <input type="button" id="cerrarAcciones" name="cerrarAcciones"/>
                </div>
            </div>
        </div>


        <!-- Zona para mostrar los botones Generales de Control -->        
        <div id="campoMenuControl">
            <div id="zonaControl">
                <form id="formularioControl" name="formularioBusqueda" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">

                    <!-- Zona de MENU - BOTONES -->
                    <div id="menuBotones">
                        <div id="menuBotones1">                                                         
                            <div id="botonRegresar" class="contenBotonMenu"> 
                                <input type="submit" id="regresar" class="botonMenu" name="regresar" value="Volver"/>                                                                                              
                            </div>
                            <div id="botonMostrarAcciones" class="contenBotonMenu"> 
                                <input type="button" id="mostrarAcciones" class="botonMenu" name="mostrarAcciones" value="Acciones" />
                            </div>
                            <div class="cancelarFlotantes"></div>
                        </div>
                        <div id = "menuBotones2">
                            <div id="botonDesconectar">
                                <input type="submit" id="desconectar" class="botonMenu" name="desconectar" value="Desconectar" />
                            </div>  
                            <div class="cancelarFlotantes"></div>
                        </div>                        
                        <div class="cancelarFlotantes"></div>
                    </div>
                </form>
            </div>
            <div id="zonaBotonMenu">
                <input type="button" id="botonMostrarMenu" class="botonMenuAdmin" name="botonMostrarMenu" value="MENU" />
            </div>
        </div>
        
        

        <!-- ZONA PARA MOSTRAR LOS CONTROLES DEL DIARIO PARALELO -->
        <div id="zonaMostrar">                
            <fieldset id="contenZonaMostrar">
                <legend id="legendAñadir">Control sobre los Diarios Paralelos:</legend>
                <div id="zonaRelacionControles">

                    <?php
                    if (isset($_SESSION['usuario'])) {
                        // Si tenemos el rol adecuado mostramos la posibilidad de crear nuevos asientos
                        if ($_SESSION['usuario']['rol'] == 0 || $_SESSION['usuario']['rol'] == 1){
                            mostrarCreacionAsientos();
                        }

                        // Si tenemos el rol adecuado mostramos la posibilidad de crear nuevos diarios
                        if ($_SESSION['usuario']['rol'] == 0 || $_SESSION['usuario']['rol'] == 1) {                            
                            mostrarCrearDiario();
                        }

                        // Si tenemos el rol adecuado mostramos la posibilidad de cerrar/abrir diarios
                        if ($_SESSION['usuario']['rol'] == 0 || $_SESSION['usuario']['rol'] == 1){
                            mostrarAbrirCerrarDiario();                           
                        }
                    }
                    ?>

                </div>
            </fieldset>
        </div>         

    </body>
</html>
