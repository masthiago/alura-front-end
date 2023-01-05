// // Captura do input data de nascimento
// const dataNascimento = document.querySelector('#nascimento');

// //Executa validação sempre que o cursor deixar o campo.
// dataNascimento.addEventListener('blur', (evento) => {
//     validaDataNascimento(evento.target);
// });

// função genérica para chamar validadores por input
export function valida(input) {
    const tipoInput = input.dataset.tipo; // data-tipo no HTML

    if (validadores[tipoInput]) {
        validadores[tipoInput](input)
    }
}

const validadores = {
    dataNascimento:input => validaDataNascimento(input)
}

// Adiciona mensagem de erro caso não seja maior que 18 anos
function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value);
    let mensagem = '';

    if ( !maiorQue18(dataRecebida) ) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.';
    }
    
    input.setCustomValidity(mensagem);

}


// Verifica se maior que 18 anos no momento que é chamada
function maiorQue18(data) {
    const dataAtual = new Date();
    const dataMais18 = new Date(data.getUTCFullYear()+18, data.getUTCMonth(), data.getUTCDay());

    return dataMais18 <= dataAtual;
}