/**
 * Juego de hundir la flota
 * 
 * @author Oscar Monforte Prades
 * @version 1.0
 */

const TEXTO_DISPAROS = document.getElementById("disparos");
const TEXTO_TARGETS = document.getElementById("targets");
const PORTAVIONES = {
    tamano: 5,
    cantidad: 1,
    posicion: {
        columna: [],
        filas: [[]]
    },
    id: "P"
};
const ACORAZADO = {
    tamano: 4,
    cantidad: 1,
    posicion: {
        fila: [],
        columnas: [[]]
    },
    id: "A"
};
const BARCO = {
    tamano: 3,
    cantidad: 3,
    posicion: {
        fila: [],
        columnas: [[], [], []]
    },
    id: "B"
};
const LANCHA = {
    tamano: 1,
    cantidad: 5,
    posicion: {
        fila: [],
        columnas: [[], [], [], [], []]
    },
    id: "L"
};
const ACCION = {
    tocado: "x",
    fallado: "o",
    agua: "-",
    vacio: ""
};
const CLASE = {
    barco: "fa-solid fa-ship",
    agua: "fa-solid fa-water",
    tocado: "fa-solid fa-fire",
    bordeIniHor: "borde-inicio-horizontal",
    bordeMedHor: "borde-medio-horizontal",
    bordeFinHor: "borde-final-horizontal",
    bordeIniVer: "borde-inicio-vertical",
    bordeMedVer: "borde-medio-vertical",
    bordeFinVer: "borde-final-vertical",
    bordeSolo: "borde-solo",
    vacio: ""
};
const ITERACIONES = 500;
var tablaJugador = new Array(10);
var tablaOrdenador = new Array(10);
const DISPAROS = 40;
var numeroDisparos;
const TARGETS = 23;
var numeroTargets;
var partidaEmpezada = false;
const BOTON_INICIO = document.getElementById("btnIniciar");
BOTON_INICIO.addEventListener("click", iniciarPartida);
const TABLA_PARTIDA = document.getElementById("tabla-partida");
const FILAS = TABLA_PARTIDA.querySelectorAll("tbody > tr");
for (let fila of FILAS) {
    if (fila.rowIndex > 0) {
        for (let index = 1; index < fila.childElementCount; index++) {
            let columna = fila.children[index];
            columna.addEventListener("click", function () {
                if (partidaEmpezada) {
                    clickHTMLtabla(fila.rowIndex - 1, columna.cellIndex - 1);
                }
            });
        }
    }
}

/*
    PINTA LOS BORDES DE LAS CELDAS DE LA TABLA HTML DONDE ESTAN LO BARCOS HORIZONTALES
    barco: objeto del tipo barco
*/
function pintarBordesCeldasHorizontalHTML(barco) {
    let posicion;
    for (let index = 0; index < barco.cantidad; index++) {
        posicion = FILAS[barco.posicion.fila[index] + 1];
        for (let index1 = 0; index1 < barco.tamano; index1++) {
            if (barco.id == "L") {
                posicion.children[barco.posicion.columnas[index][index1] + 1].className = CLASE.bordeSolo;
            }
            else if (index1 == 0) {
                posicion.children[barco.posicion.columnas[index][index1] + 1].className = CLASE.bordeIniHor;
            } else if (index1 == barco.tamano - 1) {
                posicion.children[barco.posicion.columnas[index][index1] + 1].className = CLASE.bordeFinHor;
            } else {
                posicion.children[barco.posicion.columnas[index][index1] + 1].className = CLASE.bordeMedHor;
            }
        }
    }
}

/*
    PINTA LOS BORDES DE LAS CELDAS DE LA TABLA HTML DONDE ESTAN LO BARCOS HORIZONTALES
    barco: objeto del tipo barco
*/
function pintarBordesCeldasVerticalHTML(barco) {
    let posicion;
    for (let index = 0; index < barco.cantidad; index++) {
        for (let index1 = 0; index1 < barco.tamano; index1++) {
            posicion = FILAS[barco.posicion.filas[index][index1] + 1];
            if (barco.id == "L") {
                posicion.children[barco.posicion.columna[index] + 1].className = CLASE.bordeSolo;
            }
            else if (index1 == 0) {
                posicion.children[barco.posicion.columna[index] + 1].className = CLASE.bordeIniVer;
            } else if (index1 == barco.tamano - 1) {
                posicion.children[barco.posicion.columna[index] + 1].className = CLASE.bordeFinVer;
            } else {
                posicion.children[barco.posicion.columna[index] + 1].className = CLASE.bordeMedVer;
            }
        }
    }
}

/*
    ESCRIBE EN LA TABLA HTML LA FILA COMPLETA CON LA MISMA CLASE
    fila: elemento <tr> HTML
    texto: string con la clase
*/
function escribirFilaHTML(fila, texto) {
    let collection = fila.children;
    for (let index = 1; index < collection.length; index++) {
        collection[index].className = texto;
        collection[index].firstChild.className = texto;
    }
}

/*
    ESCRIBE CLASE EN LA CELDA DE LA TABLA HTML CORRESPONDIENTE 
    fila: elemento <tr> HTML
    numColumna: numero de columna que se quiere escribir
    texto: caracter que indica la accion
*/
function escribirCeldaHTML(fila, numColumna, texto) {
    let clase;
    switch (texto) {
        case ACCION.tocado:
            clase = CLASE.tocado;
            break;

        case ACCION.fallado:
            clase = CLASE.agua;
            break;

        case ACCION.vacio:
            clase = CLASE.vacio;
            break;

        case PORTAVIONES.id:
        case ACORAZADO.id:
        case BARCO.id:
        case LANCHA.id:
            clase = CLASE.barco;
            break;

        default:
            break;
    }
    fila.children[numColumna + 1].firstChild.className = clase;
}

/*
    ELIMINA TODAS LAS CALSES DE LA TABLA HTML
*/
function borrarTablaHTML() {
    for (let index = 1; index < FILAS.length; index++) {
        escribirFilaHTML(FILAS[index], CLASE.vacio);
    }
}

/*
    RELLENA TODA LA TABLA HTML CON LOS VALORES DE UNA MATRIZ
    tabla: matriz bidimensional de tamañano 10 x 10
*/
function escribirTablaHTML(tabla) {
    for (let index1 = 0; index1 < tabla.length; index1++) {
        for (let index2 = 0; index2 < tabla[index1].length; index2++) {
            escribirCeldaHTML(FILAS[index1 + 1], index2, tabla[index1][index2]);
        }
    }
}

/*
    CREA UNA MATRIZ BIDIMENSIONAL DE TAMAÑO 10 x 10 CON "-"
    tabla: puntero de la matriz
*/
function crearTabla(tabla) {
    for (let index = 0; index < 10; index++) {
        tabla[index] = new Array(10);
        for (let index2 = 0; index2 < 10; index2++) {
            tabla[index][index2] = ACCION.agua;
        }
    }
}

/*
    INSERTA UN TIPO DE BARCO EN HORIZONTAL DE TAMAÑO DETERMINADO EN UNA MATRIZ
    tabla: puntero de la matriz donde se inserta el barco
    barco: objeto del tipo de barco
    iteraciones: numero de veces que se repite el bucle
*/
function insertarBarcoHorizontal(tabla, barco, iteraciones) {
    let tamanyo = barco.tamano;
    let letra = barco.id;
    let cantidad = barco.cantidad;
    for (let index = 0; index < cantidad; index++) {
        while (iteraciones > 0) {
            let elegirFila = parseInt(Math.random() * 10);
            let elegirColumna = parseInt(Math.random() * 10);
            let cont = 0;

            if (elegirColumna <= tamanyo) {
                for (let index1 = 0; index1 < tamanyo; index1++) {
                    if (tabla[elegirFila][elegirColumna + index1] == ACCION.agua) {
                        cont++;
                    }
                }
                if (cont == tamanyo) {
                    for (let index2 = 0; index2 < tamanyo; index2++) {
                        tabla[elegirFila][elegirColumna + index2] = letra;
                        barco.posicion.fila[index] = elegirFila;
                        barco.posicion.columnas[index].push(elegirColumna + index2);
                    }
                    break;
                }
            }
            iteraciones--;
        }
    }
}

/*
    INSERTA UN TIPO DE BARCO EN VERTICAL DE TAMAÑO DETERMINADO EN UNA MATRIZ
    tabla: puntero de la matriz donde se inserta el barco
    barco: objeto del tipo de barco
    iteraciones: numero de veces que se repite el bucle
*/
function insertarBarcoVertical(tabla, barco, iteraciones) {
    let tamanyo = barco.tamano;
    let letra = barco.id;
    let cantidad = barco.cantidad;
    for (let index = 0; index < cantidad; index++) {
        while (iteraciones > 0) {
            let elegirFila = parseInt(Math.random() * 10);
            let elegirColumna = parseInt(Math.random() * 10);
            let cont = 0;

            if (elegirFila <= tamanyo) {
                for (let index1 = 0; index1 < tamanyo; index1++) {
                    if (tabla[elegirFila + index1][elegirColumna] == ACCION.agua) {
                        cont++;
                    }
                }
                if (cont == tamanyo) {
                    for (let index2 = 0; index2 < tamanyo; index2++) {
                        tabla[elegirFila + index2][elegirColumna] = letra;
                        barco.posicion.columna[index] = elegirColumna;
                        barco.posicion.filas[index].push(elegirFila + index2);
                    }
                    break;
                }
            }
            iteraciones--;
        }
    }
}

/*
    EVENTO CUANDO SE HACE CLICK SOBRE UN ELEMENTO <td> DE LA TABLA HTML
    fila: numero del indice de la fila de la matriz
    celda: numero del indice de la columna de la matriz
*/
function clickHTMLtabla(fila, celda) {
    if (numeroDisparos > 0 && numeroTargets > 0) {
        if (tablaOrdenador[fila][celda] == ACCION.agua) {
            tablaOrdenador[fila][celda] = ACCION.fallado;
            tablaJugador[fila][celda] = ACCION.fallado;
            numeroDisparos--;
            TEXTO_DISPAROS.innerHTML = "Disparos = " + numeroDisparos;
            TEXTO_TARGETS.innerHTML = "Targets = " + numeroTargets;
        } else if (tablaOrdenador[fila][celda] != ACCION.tocado && tablaOrdenador[fila][celda] != ACCION.fallado) {
            tablaJugador[fila][celda] = ACCION.tocado;
            tablaOrdenador[fila][celda] = ACCION.tocado;
            numeroTargets--;
            numeroDisparos--;
            TEXTO_DISPAROS.innerHTML = "Disparos = " + numeroDisparos;
            TEXTO_TARGETS.innerHTML = "Targets = " + numeroTargets;
        }
        escribirTablaHTML(tablaJugador);
    }
    if (numeroDisparos == 0 || numeroTargets == 0) {
        escribirTablaHTML(tablaOrdenador);
        pintarBordesCeldasVerticalHTML(PORTAVIONES);
        pintarBordesCeldasHorizontalHTML(ACORAZADO);
        pintarBordesCeldasHorizontalHTML(BARCO);
        pintarBordesCeldasHorizontalHTML(LANCHA);
        partidaEmpezada = false;
        if (numeroDisparos == 0 && numeroTargets > 0) {
            window.alert("FINAL DE PARTIDA\nHAS PERDIDO :(");
        } else {
            window.alert("FINAL DE PARTIDA\nHAS GANADO :)");
        }
    }
}

/*
    FUNCION PARA INICIAR LAS VARIABLES AL EMPEZAR LA PARTIDA
*/
function iniciarVarialbes() {
    numeroDisparos = DISPAROS;
    numeroTargets = TARGETS;
    PORTAVIONES.posicion.columna = [];
    PORTAVIONES.posicion.filas = [[]];
    ACORAZADO.posicion.fila = [];
    ACORAZADO.posicion.columnas = [[]];
    BARCO.posicion.fila = [];
    BARCO.posicion.columnas = [[], [], []];
    LANCHA.posicion.fila = [];
    LANCHA.posicion.columnas = [[], [], [], [], []];
}

function iniciarPartida() {
    iniciarVarialbes();
    borrarTablaHTML();
    crearTabla(tablaJugador);
    crearTabla(tablaOrdenador);
    insertarBarcoVertical(tablaOrdenador, PORTAVIONES, ITERACIONES);
    insertarBarcoHorizontal(tablaOrdenador, ACORAZADO, ITERACIONES);
    insertarBarcoHorizontal(tablaOrdenador, BARCO, ITERACIONES);
    insertarBarcoHorizontal(tablaOrdenador, LANCHA, ITERACIONES);
    TEXTO_DISPAROS.innerHTML = "Disparos = " + numeroDisparos;
    TEXTO_TARGETS.innerHTML = "Targets = " + numeroTargets;
    partidaEmpezada = true;
    window.alert("INICIAR PARTIDA");
}
