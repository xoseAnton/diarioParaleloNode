<?php

// Establecemos por defecto la zona horaria
date_default_timezone_set('Europe/Berlin');

?>

<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        
        <!-- Primero incluimos los estilos de la página -->
        <link href="estilos/estiloIndex.css" rel="stylesheet" type="text/css">        
        <link href="estilos/estiloComunProyecto.css" rel="stylesheet" type="text/css">
        
        <!-- Por último incluimos los Script que utilizaremos -->
        <script src="nodejs/node_modules/socket.io-client/dist/socket.io.js" type="text/javascript"></script>
        <script src="misIncludes/jquery-3.1.1.js" type="text/javascript"></script>
        <script src="misIncludes/md5.min.js" type="text/javascript"></script>
        <script src="misScript/comunJS.js" type="text/javascript"></script>
        <script src="misScript/operacionesIndexJS.js" type="text/javascript"></script>     
        
        <title>Acceso Diario Paralelo</title>        
    </head>
    
    <body onload="desplaza('#zonaControlUsuario')">
        
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

            <!-- Zona de control de Usuario -->
            <div id="zonaControlUsuario">
                
                <form id="formControlUsuarios" name="formControlUsuarios" method="post">
                    <fieldset>
                        <legend><span id="textoAcceso">Acceso - </span><span id="textoDiario">Diario Paralelo</span></legend>
                        
                        <!-- Zona de USUARIO -->
                        <div class="campo">
                            <label>Usuario:</label><br/>                         
                            <select id="usuario" name="usuario" onchange="borrarErrores()" required></select><br/>
                        </div>

                        <!-- Zona de CONTRASEÑA -->
                        <div class="campo">
                            <label for="password" >Contraseña:</label><br/>
                            <input type="password" name="contraseña" id="contraseña" onkeydown="borrarErrores()" required /><br/>
                        </div>

                        <!-- Zona de BOTONES -->
                        <div class="campo">                       
                            <input type="submit" id="botonEntrar" class="botonMenu" name="entrar" disabled value="Entrar" />
                        </div>
                        
                    </fieldset>            
                </form>            
                
            </div>
        
    </body>
</html>
