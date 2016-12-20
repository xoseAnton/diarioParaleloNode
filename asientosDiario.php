<?php
// Antes de nada inicio una nueva sesión o reanudo la existente
session_start();

// Establecemos por defecto la zona horaria
date_default_timezone_set('Europe/Berlin');


// Comprobamos que el usuario está identificado
if (!isset($_SESSION['usuario'])) {    
    // Borramos los datos de la sesión
    session_unset();
    // Redirigimos a la pantalla inicial
    header("Location: index.php");
} 


// Comprobamos si queremos desconectar la página
if (isset($_POST['desconectar'])) {
    // Borramos los datos de la sesión
    session_unset();
    // Redirigimos a la pantalla inicial
    header("Location: index.php");
}
?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        
        <!-- Primero incluimos los estilos de la página -->
        <link href="estilos/estiloAsientosDiario.css" rel="stylesheet" type="text/css">        
        <link href="estilos/estiloComunProyecto.css" rel="stylesheet" type="text/css">
        
        <!-- Por último incluimos los Script que utilizaremos -->
        <script src="nodejs/node_modules/socket.io-client/dist/socket.io.js" type="text/javascript"></script>
        <script src="misIncludes/jquery-3.1.1.js" type="text/javascript"></script>
        <script src="misScript/comunJS.js" type="text/javascript"></script>
        <script src="misScript/operacionesAsientoDiarioJS.js" type="text/javascript"></script>
        
        <title>Listado de Asientos</title>       
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
        
        
         <!-- Zona de PROGRAMA -->        
        <div id="zonaPrograma">     
            
            
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
            
                        
            <!-- Zona de CONTROL Y BUSQUEDAS -->
            <div id="zonaControl">
                <form id="formularioBusqueda" name="formularioBusqueda" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">

                    <!-- Zona de BÚSQUEDA -->
                    <fieldset>
                        <legend>Listar por:</legend>

                        <!-- Buscar por Diario -->
                        <div id="buscaDiario" class="contenedorBusqueda">
                            <div>                                
                                <label>Diario:</label>
                            </div>
                            <div>
                                <select id="diario" name="diario"></select>
                            </div>
                        </div>

                        <!-- Buscar por Asiento -->
                        <div id="buscaAsiento" class="contenedorBusqueda">
                            <div>                                
                                <input type="checkbox" id="buscaPorAsiento" class="checkBusqueda" name="buscaPorAsiento" data-contenedor="#buscaAsiento" data-controla='"#asiento"' title="Buscar por Asiento"/>
                                <label>Asiento:</label>
                            </div>
                            <div>
                                <input type="number" id="asiento" name="asiento" value="" min="1" max="9999" disabled title="Número de asiento"/>
                            </div>
                        </div>

                        <!-- Buscar por Fecha del asiento -->
                        <div id="buscaFecha" class="contenedorBusqueda">
                            <div>                                
                                <input type="checkbox" id="buscaPorFecha" class="checkBusqueda" name="buscaPorFecha" data-contenedor="#buscaFecha" data-controla='"#fecha"' title="Buscar por Fecha"/>
                                <label>Fecha asiento:</label>
                            </div>
                            <div>
                                <input type="date" id="fecha" name="fecha" value="" disabled title="Fecha presentación asientos"/>
                            </div>
                        </div>

                        <!-- Buscar por Texto -->
                        <div id="buscaTexto" class="contenedorBusqueda">
                            <div>
                                <input type="checkbox" id="buscaPorTexto" class="checkBusqueda" name="buscaPorTexto" data-contenedor="#buscaTexto" data-controla='"#textoBusca"' title="Buscar por Texto Libre"/>
                                <label>Texto:</label>      
                            </div>
                            <div>
                                <input type="text" id="textoBusca" name="textoBusca" value="" maxlength="50" disabled title="Texto de busqueda"/>
                            </div>
                        </div>

                        <!-- Buscar por Usuario -->
                        <div id="buscaUsuario" class="contenedorBusqueda">
                            <div>
                                <input type="checkbox" id="buscaPorUsuario" class="checkBusqueda" name="buscaPorUsuario"  data-contenedor="#buscaUsuario" data-controla='"#usuario"' title="Buscar por Usuario"/>
                                <label>Asignado:</label>
                            </div>
                            <div>
                                <select id="usuario" name="usuario" disabled=""></select>
                            </div>
                        </div>

                        <!-- Buscar por Fecha de Modificacion del diario -->
                        <div id="buscaFechaModifica" class="contenedorBusqueda">
                            <div>                                
                                <input type="checkbox" id="buscaPorFechaModifica" class="checkBusqueda" name="buscaPorFechaModifica"  data-contenedor="#buscaFechaModifica" data-controla='"#fechaModifica", "#horaModifica"' title="Buscar por Fecha de Modificación del diario"/>
                                <label>Fecha/Hora modificación:</label>
                            </div>
                            <div>
                                <input type="date" id="fechaModifica" name="fechaModifica" value="" disabled title="Fecha modificación"/>
                                <input type="time" id="horaModifica" name="horaModifica" value=""  disabled title="Hora modificación"/>
                            </div>
                        </div>

                        <!-- Buscar por Activos/Cerrados/Todos -->
                        <div id="buscaEstado" class="contenedorBusqueda">
                            <div id="buscaEstadoActivo" class="contenedorBusqueda">
                                <div>
                                    <label>Activos</label>
                                </div>
                                <div>
                                    <input type="radio" id="buscaActivos" class="checkBusqueda" name="buscaEstado" value="1" checked data-contenedor="#buscaEstadoActivo" title="Buscar asientos Activos"/>
                                </div>
                            </div>
                            <div id="buscaEstadoCerrado" class="contenedorBusqueda">
                                <div>
                                    <label>Cerrados</label>
                                </div>
                                <div>
                                    <input type="radio" id="buscaCerrados" class="checkBusqueda" name="buscaEstado" value="0" data-contenedor="#buscaEstadoCerrado" title="Buscar asientos Cerrados"/>
                                </div>
                            </div>
                            <div id="buscaEstadoTodos" class="contenedorBusqueda">
                                <div>
                                    <label>Todos</label>
                                </div>
                                <div>
                                    <input type="radio" id="buscaTodos" class="checkBusqueda" name="buscaEstado" value="" data-contenedor="#buscaEstadoTodos" title="Buscar asientos Activos y Cerrados"/>
                                </div>
                            </div>
                            <div class="cancelarFlotantes"></div>
                        </div>

                        <div class="cancelarFlotantes"></div>
                    </fieldset>
                    
                    
                    <!-- Zona de MENU - BOTONES -->
                    <div id="menuBotones">
                        <div id="menuBotones1">                                                         
                            <div id="botonListar" class="contenBotonMenu"> 
                                <input type="button" id="listar" class="botonMenu" name="listar" value="Listar" title="Listamos con las opciones seleccionadas los asientos del diario"/>
                            </div>
                            <div id="botonMostrarAcciones" class="contenBotonMenu"> 
                                <input type="button" id="mostrarAcciones" class="botonMenu" name="mostrarAcciones" value="Acciones" title="Muestra la acciones realizadas por el usuario" />
                            </div>
                            <div id="botonMostrarImprimir" class="contenBotonMenu"> 
                                <input type="button" id="mostrarImprimir" class="botonMenu" name="mostrarImprimir" value="Imprimir" title="Imprimir el listado realizado" />
                            </div>
                            <?php
                            if (isset($_SESSION['usuario'])) {
                                // Si el usuario tiene un rol adecuado enseñamos el botón administrar                                
                                if ($_SESSION['usuario']['rol'] == 0 || $_SESSION['usuario']['rol'] == 1) {
                                    echo "<div id='botonAdministrar' class='contenBotonMenu'>";
                                    echo "<input type='button' id='adminDiario' class='botonMenu' name='adminDiario' value='Administrar' title='Administrar los diarios' />";
                                    echo "</div>";
                                }
                            }
                            ?>
                            <div class="cancelarFlotantes"></div>
                        </div>
                        <div id = "menuBotones2">
                            <div id="botonDesconectar">
                                <input type="submit" id="desconectar" class="botonMenu" name="desconectar" value="Desconectar" title="Salir de la aplicación" />
                            </div>  
                            <div class="cancelarFlotantes"></div>
                        </div>                        
                        <div class="cancelarFlotantes"></div>
                    </div> 
                    
                </form>
                
            </div> <!-- Fin de zona CONTROL -->
            
            <!-- ZONA PARA MOSTRAR DATOS -->
            <div id="zonaMostrar">
                <!-- Zona de detalle de un asiento -->
                <fieldset id="zonaInfoAsientos"></fieldset>
                <!-- Zona de listado de asientos -->
                <fieldset id="zonaMostrarDatos"></fieldset>                   
            </div>     
            
        </div> <!-- Fin de zona PROGRAMA -->

    </body>
</html>
