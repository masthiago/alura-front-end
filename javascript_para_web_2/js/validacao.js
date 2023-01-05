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
    },
    cpf: {
        valueMissing: 'O campo CPF não pode ser vazio.',
        customError: 'O CPF digitado não é válido.'
    },
    cep: {
        valueMissing: 'O campo CEP não pode ser vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível buscar os dados do CEP.'
    },
    logradouro: {
        valueMissing: 'O campo Logradouro não pode ser vazio.'
    },
    cidade: {
        valueMissing: 'O campo Cidade não pode ser vazio.'
    },
    estado: {
        valueMissing: 'O campo Estado não pode ser vazio.'
    },
    preco: {
        valueMissing: 'O campo Preço não pode ser vazio.'
    },

}

// customErro
const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
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

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '');

    let mensagem = ''

    if (!checaCPFRepetido(cpfFormatado) || !checaEscruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido.';
    }

    input.setCustomValidity(mensagem);
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    let cpfValido = true;

    valoresRepetidos.forEach(
        valor => {
            if (valor == cpf) {
                cpfValido = false;
            }
        }
    );

    return cpfValido;
}


function checaEscruturaCPF(cpf) {

    const multiplicador = 10;

    return checaDigitoVerificador(cpf, multiplicador);

}

function checaDigitoVerificador(cpf, multiplicador) {
    if (multiplicador >= 12) {
        return true;
    }
    let multiplicadorInicial = multiplicador;
    let soma = 0;
    const cpfSemDigitos = cpf.substring(0, multiplicador - 1).split('');
    const digitoVerificador = cpf.charAt(multiplicador - 1);

    for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++;
    }

    if (digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1);
    }

    return false;
}

function confirmaDigito(soma) {
    return 11 - (soma % 11);
}

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '');
    let mensagem = ''

    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if (!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url, options)
            .then(
                response => response.json()
            )
            .then(
                data => {
                    if (data.erro) {
                        input.setCustomValidity('Não foi possível buscar os dados do CEP.');
                        return;
                    }
                    input.setCustomValidity('');
                    preencheCamposComCEP(data);
                    return;
                }
            )
    }
}

function preencheCamposComCEP(data) { // TODO: Ajustar esvaziar as informações sem CEP correto.
    const logradouro = document.querySelector('[data-tipo="logradouro"]');
    const cidade = document.querySelector('[data-tipo="cidade"]');
    const estado = document.querySelector('[data-tipo="estado"]');

    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;

}