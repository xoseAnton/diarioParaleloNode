<?php
// Antes de nada inicio una nueva sesión o reanudo la existente
session_start();

/*
 * Creo la clase para listar todos los DIARIOS 
 */

// Insertamos la clase para utilizar la base de datos
require_once 'operacionesBD.php';
// Insertamos la clase "Usuario"
require_once '/./../clases/Diario.php'; // Especifico la ruta absoluta

$listaDiarios = array();

//Comprobamos que el usuario está identificado para consultar los datos
if (isset($_SESSION['usuario'])) {

    $listaDiarios = operacionesBD::listarTotalDiarios();

    // Retorno un "string" con los datos optenidos
    echo json_encode($listaDiarios);
}

?>