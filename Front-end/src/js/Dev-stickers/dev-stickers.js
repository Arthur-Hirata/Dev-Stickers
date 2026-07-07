const selecaoNoalbum = document.querySelector('.nome-selecao')
const album = document.querySelector('.selecao')
const userToken = localStorage.getItem("JWT_token")
let isLogged = false
window.onload = function(){
    getGrous();
    getIdentity();
}
function getIdentity(){
    if (userToken){
        fetch('http://127.0.0.1:5000/verifyIdentity', {
            method : 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
        .then(response =>{
            if (!response.ok){
                throw new Error("Token inválido no servidor")
                userNotlogged()
            }
             return response.json();
        } )
        .then(data =>{
            if (data.mensagem === "Token válido"){
                const btnLogar = document.querySelector(".login")
                btnLogar.textContent = data.nome
                userlogged();
                isLogged = true
            }
            else {
                console.log("token_invalido" )
                getStickers();
            }
        })
    }else{

    }
}
function userlogged(){
    getUserStickres();
    pegarQuantidadeMarcadas();
    
}

function getGrous(){
    fetch('http://127.0.0.1:5000/getGroups',{
        method : 'POST'
    })
    .then(response => response.json())
    .then(data =>{
        const grupos = document.querySelectorAll(".grupo-container")
        grupos.forEach(grupo=>{
            const Nomegrupo = grupo.querySelector(".grupo-titulo").textContent
            const listaGrupo = grupo.querySelector('.lista-paises')
            const selecoes = data.dados
            selecoes.forEach(selecao=>{
                if (selecao.grupo === Nomegrupo){
                    const li = document.createElement("li")
                    li.className='div-pais'
                    const btnpais = document.createElement("button")
                    btnpais.className = "pais"
                    const imgPais = document.createElement('img')
                    imgPais.className='imagem-pais'
                    imgPais.src= selecao.bandeira
                    const spanNome = document.createElement('span')
                    spanNome.className = 'nome-pais'
                    spanNome.textContent = selecao.pais
                    btnpais.appendChild(imgPais)
                    btnpais.appendChild(spanNome)
                    btnpais.addEventListener('click', function(){
                        album.innerHTML=''
                        selecaoNoalbum.textContent = selecao.pais
                        if (isLogged){
                            getUserStickres()
                        }else {
                            getStickers();
                        }
                    })
                    li.appendChild(btnpais)

                    listaGrupo.appendChild(li)
                    
                }
            })
        })
    })
}
function toastShow(){
    const toast = document.getElementById('toast');
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-24px)';
    }, 2500);

}
function getStickers(){
    const selecaoBuscada = selecaoNoalbum.textContent
    fetch('http://127.0.0.1:5000/getStickers',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            selecao : selecaoBuscada
        })
    } )
    .then(response=> response.json())
    .then(data=>{
        if(data.mensagem = "sucess"){
            const figurinhas = data.dados
            figurinhas.forEach(figurinha =>{
                const li = document.createElement('div')
                li.dataset.id = figurinha.id
                const divNomeFigurinha = document.createElement('div')
                divNomeFigurinha.className ='card-number'
                divNomeFigurinha.textContent = figurinha.nome
                li.className='missing'
                const controls= document.createElement('div')
                controls.className = 'controls'
                const btnSomar = document.createElement('button')
                btnSomar.className ='add'
                btnSomar.textContent ='📦'
                const spanDuplicate = document.createElement('span')
                spanDuplicate.className = 'duplicate'
                spanDuplicate.textContent = '1'
                const btnRemove = document.createElement('button')
                btnRemove.className = 'remove'
                btnRemove.textContent ='-'
                controls.appendChild(btnRemove)
                controls.appendChild(spanDuplicate)
                controls.appendChild(btnSomar)
                li.appendChild(divNomeFigurinha)
                li.appendChild(controls)
                album.appendChild(li)
                li.addEventListener("click", function(){
                    toastShow();
                })
            })


        } else {
            console.log("Erro no banco de dados")
        }
    }).catch(err => console.error("Erro no fetch:", err));
}
function getUserStickres(){
    const selecaoBuscada = selecaoNoalbum.textContent
    fetch('http://127.0.0.1:5000/getUsersStickers', {
        method : 'POST',
        headers : {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        }, 
        body : JSON.stringify({
            selecao : selecaoBuscada
        })
    }).then(response => response.json())
    .then(data =>{
        if (data.mensagem === "Busca efetudada com sucesso!"){
            const faltantes = data.faltantes
            const marcadas = data.marcadas
            const faltantesStatus =  faltantes.map(fig => ({ ...fig, marcada: false }));
            const marcadasStatus = marcadas.map(fig => ({ ...fig, marcada: true }));

            const todasAsFigurinhas = [...faltantesStatus, ...marcadasStatus].sort((a,b)=> a.id -b.id)

            todasAsFigurinhas.forEach(figurinha =>{
                const li = document.createElement('div');
                li.dataset.id = figurinha.id;
    
                const divNomeFigurinha = document.createElement('div');
                divNomeFigurinha.className = 'card-number';
                divNomeFigurinha.textContent = figurinha.nome;
    
                li.appendChild(divNomeFigurinha);
                

                if (figurinha.marcada){
                    li.className = 'card'
                    const controls = document.createElement('div');
                    controls.className = 'controls'
                    const btnSomar = document.createElement('button');
                    btnSomar.className = 'add';
                    btnSomar.textContent = '📦';
                    btnSomar.addEventListener("click", function(e){
                        e.stopPropagation(); 
                        aumentarFigurinhas(li.dataset.id, li)
                    })
                    const spanDuplicate = document.createElement('span');
                    spanDuplicate.className = 'duplicate';
                    const btnRemove = document.createElement('button');
                    btnRemove.className = 'remove';
                    btnRemove.textContent = '-';
                    btnRemove.addEventListener("click", function(e){
                        e.stopPropagation(); 
                        dminiuirFigurinhas(li.dataset.id, li)
                    })

                    controls.appendChild(btnRemove);
                    controls.appendChild(spanDuplicate);
                    controls.appendChild(btnSomar);
                    li.appendChild(controls);
                    spanDuplicate.textContent = figurinha.quantidade
                }else{
                    li.className = 'missing'
                    li.addEventListener("click", function(){
                        marcarFigurinha(li.dataset.id,li)
                    })
                }
                album.appendChild(li)
            })           
        }
    })
}
function marcarFigurinha (id, figurinha){
    fetch('http://127.0.0.1:5000/markSticker', {
        method : 'POST',
        headers :{
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
        body : JSON.stringify({
                figId : id
            })
        })
            .then(response => response.json())
            .then(data =>{
                if (data.mensagem === "figurinha adicionada!"){
                    pegarQuantidadeMarcadas();
                    const novoCard = figurinha.cloneNode(true)
                    figurinha.parentNode.replaceChild(novoCard, figurinha)

                    
                    novoCard.className = "card"
                    const controls = document.createElement('div');
                    controls.className = 'controls'
                    const btnSomar = document.createElement('button');
                    btnSomar.className = 'add';
                    btnSomar.textContent = '📦';
                    btnSomar.addEventListener("click", function(e){
                        e.stopPropagation(); 
                        aumentarFigurinhas(novoCard.dataset.id, novoCard)
                        pegarQuantidadeMarcadas();
                    })
                    const spanDuplicate = document.createElement('span');
                    spanDuplicate.className = 'duplicate';
                    const btnRemove = document.createElement('button');
                    btnRemove.className = 'remove';
                    btnRemove.textContent = '-';
                    btnRemove.addEventListener("click", function(e){
                        e.stopPropagation(); 
                        dminiuirFigurinhas(novoCard.dataset.id, novoCard)
                        pegarQuantidadeMarcadas();
                    })

                    controls.appendChild(btnRemove);
                    controls.appendChild(spanDuplicate);
                    controls.appendChild(btnSomar);
                    novoCard.appendChild(controls);
                    spanDuplicate.textContent = data.qnt
                    
                }
            })
}
function aumentarFigurinhas(id, figurinha){
    fetch('http://127.0.0.1:5000/increaseSticker', {
        method : 'POST',
        headers :{
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            figID : id
        })
    })
    .then(response=>response.json())
    .then(data=>{
        const spanDuplicate = figurinha.querySelector(".duplicate")
        if (data.mensagem === "Mudança efetuada com sucesso!"){
            spanDuplicate.textContent = data.qnt
        }
    })
}

function dminiuirFigurinhas(id,figurinha){
    const spanDuplicate = figurinha.querySelector(".duplicate")
    const quantidadeAtual = parseInt(spanDuplicate.textContent)
    if (quantidadeAtual > 1){
        fetch('http://127.0.0.1:5000/decreaseSticker', {
            method : 'POST',
            headers :{
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                figID : id
            })
        })
        .then(response=>response.json())
        .then(data=>{
            const spanDuplicate = figurinha.querySelector(".duplicate")
            if (data.mensagem === "Mudança efetuada com sucesso!"){
                spanDuplicate.textContent = data.qnt
            }
        })
    } else{
        fetch('http://127.0.0.1:5000/removeSticker', {
            method : 'POST',
            headers :{
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                figID : id
            })
        })
        .then(response => response.json())
        .then(data=>{
            if (data.mensagem === "Figurinha removida com sucesso!"){
                const cardFaltante = figurinha.cloneNode(true)
                figurinha.parentNode.replaceChild(cardFaltante, figurinha)
                cardFaltante.className = "missing"

                const controls = cardFaltante.querySelector(".controls")
                if (controls){
                    controls.remove()
                }
                cardFaltante.addEventListener("click", function(){
                    marcarFigurinha(cardFaltante.dataset.id, cardFaltante)
                })

            }
        })
    }
}
function pegarQuantidadeMarcadas(){
    fetch('http://127.0.0.1:5000/getMarkedStickres', {
        method : 'POST',
            headers :{
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
    })
    .then(response => response.json())
    .then(data =>{
        const stickersCount = document.getElementById("stickers-count")
        stickersCount.innerHTML = `${data.total}/980`
        const barraDeProgresso = document.querySelector(".progress-bar")
        const porcentagemProgresso = document.getElementById("progress-percentage")

        const porcentatem = ((data.total / 980) * 100).toFixed(1)
        barraDeProgresso.style.width = `${porcentatem}%`
        porcentagemProgresso.innerHTML = `${porcentatem}%`
        if ( porcentatem == 100){
            barraDeProgresso.style.color = "#22C55E"
            porcentagemProgresso.innerHTML = `<i class = "fas fa-check"></i> Parabéns você completou o album!`
            porcentagemProgresso.style.color = "#22C55E"
        }
    })
}
function pegarRepetidas(){
    fetch('http://127.0.0.1:5000/getDuplicate', {
        method : 'GET',
            headers :{
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
    })
    .then(response => {
        if (!response.ok){
            toastShow2('Você precisa estar loggado para realizar essa ação!');
            throw new Error("Erro na requisição");
        }
        return response.json()
    })
    .then(data=>{
        console.log("Dados recebidos do Flask:", data);
        if (data.mensagem === "Busca efetuada com sucesso!"){
            let userRepetidas = "🔄 *MINHAS FIGURINHAS REPETIDAS:* \n\n"
            const repetidas = data.repetidas
            if (repetidas.length === 0){
                userRepetidas += "Sem repetiadas no momento!"
            }else{
                repetidas.forEach(repetida=>{
                    userRepetidas += `• ${repetida.nome} (Repetidas: ${repetida.quantidade})\n`
                });
            }
             navigator.clipboard.writeText(userRepetidas)
                .then(()=>{
                    toastShow2('Figurinhas copiadas!')
                })
        }
        if (data.mensagem === "Erro no banco de daddos!"){
                    toastShow2('Erro em nosso banco de dados.!')
        }
    }).catch(error => console.error("Erro no processo:", error));
}
function pegarFaltantes(){
    fetch('http://127.0.0.1:5000/getMissing', {
        method : 'GET',
            headers :{
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
    })
    .then(response => {
        if (!response.ok){
            toastShow2('Você precisa estar loggado para realizar essa ação!');
            throw new Error("Erro na requisição");
        }
        return response.json()
    })
    .then(data=>{
        console.log("Dados recebidos do Flask:", data);
        if (data.mensagem === "Busca efetuada com sucesso!"){
            let userFaltantes = "🔄 *MINHAS FIGURINHAS FALTANTES:* \n\n"
            const faltantes = data.faltantes
            if (faltantes.length === 0){
                toastShow2("Parabéns você já completou o álbum")
            }else{
                faltantes.forEach(repetida=>{
                    userFaltantes += `• ${repetida.nome}`
                });
            }
             navigator.clipboard.writeText(userFaltantes)
                .then(()=>{
                    toastShow2('Figurinhas copiadas!')
                })
        }
        if (data.mensagem === "Erro no banco de daddos!"){
                    toastShow2('Erro em nosso banco de dados.!')
        }
    }).catch(error => console.error("Erro no processo:", error));
}
function toastShow2(mensagem){
    const toast2 = document.getElementById('toast2');
    toast2.textContent = mensagem
    toast2.style.opacity = '1';
    toast2.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast2.style.opacity = '0';
        toast2.style.transform = 'translateX(-50%) translateY(-24px)';
    }, 2500);
}

