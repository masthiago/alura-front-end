function tocaSom (som) {
    som_id =  '#som_tecla_' + som;
    document.querySelector(som_id).play();
}

function tocaSomPom() {
    document.querySelector('#som_tecla_pom').play();
}

const listaDeTeclas = document.querySelectorAll('.tecla');

listaDeTeclas[0].onclick = tocaSomPom;