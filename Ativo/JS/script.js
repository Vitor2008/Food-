/*========== SCROLL SECTIONS ACTIVE LINK =========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active-link');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active-link');
            });
        };
    });
};


/*========== SHOW MENU =========*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/*========== MENU SHOW=========*/
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/*========== MENU HIDDEN =========*/
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}



/*========== HOME SWPER =========*/
var homeSswiper = new Swiper('.home-swiper', {
    spaceBetween: 30,
    loop: 'true',
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});


/*========== DEALS TAB =========*/
const tabs = document.querySelectorAll('[data-target]'),
    tabContents = document.querySelectorAll('[content]');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);
        tabContents.forEach((tabContent) => {
            tabContent.classList.remove('active-tab');
        });

        target.classList.add('active-tab');

        tabs.forEach((tab) => {
            tab.classList.remove('active-tab');
        });

        tab.classList.add('active-tab');
    });
});

/*========== SHOW SCROLL UP =========*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    //Quando a rolagem for maior que 350 viewport heigt, adicione a classe show-scroll a uma tag com a classe scroll-top
    if (this.scrollY >= 350) scrollUp.classList.add('show-scroll');
    else scrollUp.classList.remove('show-scroll')
}


window.addEventListener('scroll', scrollUp);





/*========== Metódos do cardapio e Pedido =========*/
$(document).ready(function () {
    cardapio.eventos.init();
})


var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

var DADOS_RESERVA = null;

var CELULAR_EMPRESA = '5565984794759';


cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    // Obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers') => {

        var filtro = MENU[categoria];
        console.log(filtro);

        $("#itensCardapio").html('')

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id);

            $("#itensCardapio").append(temp);

        })

        //remover o ativo
        $(".container-menu a").removeClass('active-menu');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active-menu')

    },


    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },


     // adicionar ao carrinho o item do cardápio
     adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // Obter a categoria ativa
            var categoria = $(".container-menu a.active-menu").attr('id').split('menu-')[1];

            // obtem a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });


            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                // caso ainda não exista o item no carrinho, adiciona ele 
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }  

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();
            }
        }
     },


     // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },


    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },


    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {

            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itemCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active-link');
            $(".etapa1").addClass('active-link');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }

        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itemCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active-link');
            $(".etapa1").addClass('active-link');
            $(".etapa2").addClass('active-link');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itemCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active-link');
            $(".etapa1").addClass('active-link');
            $(".etapa2").addClass('active-link');
            $(".etapa3").addClass('active-link');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
    },



     // botão de voltar etapa
     voltarEtapa: () => {

        let etapa = $(".etapa.active-link").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itemCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itensCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itemCarrinho").append(temp);

                // último item 
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })

        }

        else {
            $("#itemCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }

    },


    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(id)
        }

    },



    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },



    // botão remover item do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
    },



    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },


    // carrega os valores de SubTotal, Entrega e Total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })

    },


    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        } 

        cardapio.metodos.carregarEtapa(2);

    },

    

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }

                })

            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }

    },


    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },


    // carrega a etapa de Resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);

        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();

    },


    // Atualiza o link do botão do WhatsApp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            var texto = 'Olá! gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converte a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                }

            })

        }

    },


    
     // carrega o link do botão reserva
     carregarBotaoReserva: () => {


        // Capture os valores dos campos do formulário
        let numeroConvidados = $("#txtNumeroConvidados").val().trim();
        let nome = $("#txtNome").val().trim();
        let telefone = $("#txTelefone").val().trim();
        let data = $("#txtData").val().trim();
        let horario = $("#txtHorario").val().trim();
        

        if (numeroConvidados.length <= 0) {
            cardapio.metodos.mensagem('Informe o número de convidados, por favor.');
            $("#txtNumeroConvidados").focus();
            return;
        }

        if (nome.length <= 0) {
            cardapio.metodos.mensagem('Informe o nome, por favor.');
            $("#txtNome").focus();
            return;
        }

        if (telefone.length <= 0) {
            cardapio.metodos.mensagem('Informe o telefone, por favor.');
            $("#txTelefone").focus();
            return;
        }

        if (data.length <= 0) {
            cardapio.metodos.mensagem('Informe a data, por favor.');
            $("#txtData").focus();
            return;
        }

        if (horario.length <= 0) {
            cardapio.metodos.mensagem('Informe o horário, por favor.');
            $("#txtHorario").focus();
            return;
        };

        DADOS_RESERVA = {
            numeroConvidados: numeroConvidados,
            nome: nome,
            telefone: telefone,
            data: data,
            horario: horario,
        }


        // Crie a mensagem que será enviada via WhatsApp
        let textoReserva = `Olá, gostaria de fazer uma reserva: \n*Informações da reserva:*\n\n`;
        textoReserva += `*Quantidade de pessoas:* ${DADOS_RESERVA.numeroConvidados}\n`;
        textoReserva += `*Nome:* ${DADOS_RESERVA.nome}\n`;
        textoReserva += `*Telefone:* ${DADOS_RESERVA.telefone}\n`;
        textoReserva += `*Data:* ${DADOS_RESERVA.data}\n`;
        textoReserva += `*Horário:* ${DADOS_RESERVA.horario}`;



        // Crie o link para o WhatsApp com a mensagem codificada
        let textoCodificado = encodeURI(textoReserva);
        let linkWhatsapp = `https://wa.me/${CELULAR_EMPRESA}?text=${textoCodificado}`;

        // Redirecione para o link do WhatsApp
        $("#btnReserva").attr('href', linkWhatsapp);

    },
    


    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    },



}





cardapio.templates = {


    item: `
    <div class="col-12 col-lg-4 col-md-6 col-sm-6 mb-5">
    <div class="menu_item" id="\${id}">
        <div class="menu_img-wrapper">
            <img src="\${img}" class="menu_img" />
        </div>

        <h3 class="menu_title">\${nome}</h3>
        <span class="menu_price">R$ \${preco}</span>

        <ul class="menu_rating">
            <li><i class="ri-star-fill"></i></li>
            <li><i class="ri-star-fill"></i></li>
            <li><i class="ri-star-fill"></i></li>
            <li><i class="ri-star-fill"></i></li>
            <li><i class="ri-star-fill"></i></li>
        </ul>

        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="ri-subtract-line"></i></span>
            <span class="add-numero-itens" id="qntd-\${id}">0</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="ri-add-line"></i></span>
        </div>

        <span class="menu_btn" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">
            <i class="ri-shopping-bag-line"></i>
        </span>
    </div>
    </div>                  

    `,


    itensCarrinho: `
    <div class="col-12 item-carrinho">
    <div class="menu_img-wrapper ">
        <img src="\${img}" />
    </div>
    <div class="dados-produto">
        <h3 class="menu_title"><b>\${nome}</b></h3>
        <p class="menu_price"><b>R$ \${preco}</b></p>
    </div>

    <div class="add-carrinho">
        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="ri-subtract-line"></i></span>
        <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="ri-add-line"></i></span>
        <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
    </div>
</div>
`,

itemResumo: `
<div class="col-12 item-carrinho resumo">
    <div class="img-produto-resumo">
        <img src="\${img}" />
    </div>
    <div class="dados-produto">
        <p class="title-produto-resumo">
            <b>\${nome}</b>
        </p>
        <p class="price-produto-resumo">
            <b>R$ \${preco}</b>
        </p>
    </div>
    <p class="quantidade-produto-resumo">
        x <b>\${qntd}</b>
    </p>
</div>
`,

}