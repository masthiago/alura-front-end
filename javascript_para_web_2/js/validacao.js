// função genérica para chamar validadores por input
export function valida(input) {
    const tipoInput = input.dataset.tipo; // data-tipo no HTML

    if (validadores[tipoInput]) {
        validadores[tipoInput](input)
    }

    if (input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';

    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoInput, input);
    }
}

// vetor com lista de erros possíveis de serem retornados pelo navegador a serem validados
const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError',
]

// lista de mensagens de erros, por campo e por validação.
const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo nome não pode ser vazio.'
    },
    email: {
        valueMissing: 'O campo email não pode ser vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo senha não pode ser vazio.',
        patternMismatch: 'A senha deve conter de 6 a 12 caracteres, pelo menos um letra em maiúscula, um número e não conter símbolos.',
    },
    dataNascimento: {
        valueMissing: 'O campo data de nascimento não pode ser vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    }
}

// customErro
const validadores = {
    dataNascimento:input => validaDataNascimento(input)
}

function mostraMensagemDeErro(tipoInput, input) {
    let mensagem = '';

    // na validação, percorre listas e retorna mensagem adequada para erro verificado
    tiposDeErro.forEach(erro => {
        if (input.validity[erro]) {
            mensagem = mensagensDeErro[tipoInput][erro];
        }
    });

    return mensagem
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