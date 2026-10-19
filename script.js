let nome = document.querySelector(".nome")
let personagem = document.querySelector(".personagem")

console.log(nome)
console.log(personagem)

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {
    nome.innerHTML = nomePersonagem
    personagem.src = imagemPersonagem
    nome.style.color = cor
}

function lerfoto(foto) {
    if (!foto.files || foto.files.length === 0) return; // Garante que uma foto foi escolhida

    let leitor = new FileReader()

    // 1. Define o que acontece quando terminar de ler a foto
    leitor.onload = async function () {
        try {
            console.log("Lendo imagem... gerando personagem.")
            
            let desenho = await puter.ai.txt2img(
                "Transforme a pessoa desta foto em um personagem de videogame: contorno preto grosso, meio corpo, mantendo o rosto parecido. Fundo totalmente transparente: sem cenário sem chão e sem sombra.",
                {
                    model: "replicate:openai/gpt-image-2.5-flare",
                    provider: "openai",
                    input_image: leitor.result,
                    quality: "medium",
                    providerOptions: { background: "transparent" }
                }
            )

            console.log("Resposta do Puter:", desenho) // Ajuda a debugar o que a API retornou

            // 2. Correção da URL: O Puter retorna um elemento de imagem (img), então usamos .src
            let urlImagem = desenho.src || (desenho.data && desenho.data[0] ? desenho.data[0].url : "img/lucia.png");
            
            escolherPersonagem("Você", urlImagem, "#8b1d99")

        } catch (erro) {
            console.error("Erro ao gerar a imagem com Puter:", erro)
            alert("Ocorreu um erro ao gerar a imagem. Verifique o console e sua conexão.")
        }
    }

    // 3. Correção da ordem: Só manda ler o arquivo DEPOIS de definir o que fazer com ele
    leitor.readAsDataURL(foto.files[0]) 
}