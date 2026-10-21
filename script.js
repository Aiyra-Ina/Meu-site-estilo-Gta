// =========================================
// 1. SELEÇÃO DE ELEMENTOS
// =========================================
let nome = document.querySelector(".nome");
let personagem = document.querySelector(".personagem");
let descricao = document.querySelector(".descricao");

// =========================================
// 2. TROCA DE PERSONAGEM E FUNDO
// =========================================
function escolherPersonagem(nomePersonagem, imagemPersonagem, cor, textoDescricao, imagemFundo, elemento) {
    // Atualiza os dados na tela
    nome.innerHTML = nomePersonagem;
    personagem.src = imagemPersonagem;
    nome.style.color = cor;
    descricao.innerHTML = textoDescricao;

    // Muda o fundo se uma imagem de fundo for enviada
    if (imagemFundo) {
        aplicarFundo(imagemFundo);
        
        // Atualiza os botões do topo para marcar o correto como ativo
        document.querySelectorAll(".fundo-btn").forEach(botao => {
            botao.classList.toggle("ativo", botao.style.backgroundImage.includes(imagemFundo));
        });
    }

    // Remove a classe "ativo" de TODOS os avatares
    document.querySelectorAll(".avatar").forEach(avatar => {
        avatar.classList.remove("ativo");
    });

    // Adiciona a classe "ativo" APENAS no avatar que foi clicado
    if (elemento) {
        elemento.classList.add("ativo");
    }
}

// =========================================
// 3. LÓGICA DE TROCA DE FUNDO (FADE)
// =========================================
const camadasFundo = [
    document.querySelector(".fundo-a"),
    document.querySelector(".fundo-b")
];
let camadaVisivel = 0; // 0 = fundo-a | 1 = fundo-b

// Lista com os caminhos das imagens de fundo
const fundos = [
    "./img/bg-lucia.jpg",
    "./img/bg-jason.jpg",
    "./img/bg-cj.jpg"
];

function aplicarFundo(url) {
    const proximaCamada = camadasFundo[1 - camadaVisivel]; // Pega a camada escondida
    proximaCamada.style.backgroundImage = `url("${url}")`;
    proximaCamada.style.opacity = "1"; // Mostra a nova

    camadasFundo[camadaVisivel].style.opacity = "0"; // Esconde a antiga
    camadaVisivel = 1 - camadaVisivel; // Inverte quem está visível
}

// =========================================
// 4. CRIAÇÃO AUTOMÁTICA DOS BOTÕES DE FUNDO
// =========================================
const menuFundo = document.querySelector(".fundo-menu");

fundos.forEach((url, indice) => {
    const botao = document.createElement("button");
    botao.className = "fundo-btn";
    botao.style.backgroundImage = `url("${url}")`;
    botao.title = "Fundo " + (indice + 1);
    
    // O que acontece quando clica no botão
    botao.addEventListener("click", () => {
        aplicarFundo(url);
        
        // Tira o ativo de todos os botões e coloca só no clicado
        document.querySelectorAll(".fundo-btn").forEach(b => {
            b.classList.toggle("ativo", b === botao);
        });
    });

    menuFundo.appendChild(botao);
});

// Marca o primeiro botão de fundo como ativo ao carregar a página
if (menuFundo.firstChild) {
    menuFundo.firstChild.classList.add("ativo");
}

// =========================================
// 5. INTELIGÊNCIA ARTIFICIAL (PUTER - SELFIE)
// =========================================
function lerfoto(foto) {
    if (!foto.files || foto.files.length === 0) return; // Garante que uma foto foi escolhida

    let leitor = new FileReader();

    leitor.onload = async function () {
        try {
            console.log("Lendo imagem... gerando personagem.");
            
            let desenho = await puter.ai.txt2img(
                "Transforme a pessoa desta foto em um personagem de videogame: contorno preto grosso, meio corpo, mantendo o rosto parecido. Fundo totalmente transparente: sem cenário sem chão e sem sombra.",
                {
                    model: "replicate:openai/gpt-image-2.5-flare",
                    provider: "openai",
                    input_image: leitor.result,
                    quality: "medium",
                    providerOptions: { background: "transparent" }
                }
            );

            console.log("Resposta do Puter:", desenho); 

            let urlImagem = desenho.src || (desenho.data && desenho.data[0] ? desenho.data[0].url : "img/lucia.png");
            
            // Aqui chamamos a função. Passamos o fundo da Lucia como padrão para a selfie e "null" no elemento (pois não é um avatar do menu).
            escolherPersonagem("Você", urlImagem, "#8b1d99", "Você acaba de chegar em Dev.City. Pronto para dominar as ruas com seu novo visual.", "./img/bg-lucia.jpg", null);

        } catch (erro) {
            console.error("Erro ao gerar a imagem com Puter:", erro);
            alert("Ocorreu um erro ao gerar a imagem. Verifique o console e sua conexão.");
        }
    }

    leitor.readAsDataURL(foto.files[0]); 
}