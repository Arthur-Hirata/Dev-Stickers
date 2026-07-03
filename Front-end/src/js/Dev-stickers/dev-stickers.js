const selecaoNoalbum = document.querySelector('.nome-selecao')
const album = document.querySelector('.selecao')
const userToken = localStorage.getItem("JWT_token")

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
            }
            else {
                console.log("token_invalido", )
            }
        })
    }else{

    }
}
function userlogged(){
    getUserStickres();






    const figurinhasNaoMarcadas = document.querySelectorAll(".selecao > .missing")
    figurinhasNaoMarcadas.forEach(figurinha =>{
        figurinha.addEventListener("click", function(){
            const idFigurinha = figurinha.dataset.id
            console.log(idFigurinha)
            fetch("http://127.0.0.1:5000/markSticker", {
                method : 'POST',
                headers :{
                     'Authorization': `Bearer ${userToken}`,
                     'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    figId : idFigurinha
                })
            }).then(response => response.json())
            .then(data =>{
                if (data.mensagem === "figurinha adicionada!"){
                    figurinha.className = "card"
                }
            })
        })
    })
   
}
function userNotlogged(){
    getStickers();
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
                        getStickers();
                    })
                    li.appendChild(btnpais)

                    listaGrupo.appendChild(li)
                    
                }
            })
        })
    })
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
            faltantes.forEach(figurinha=>{
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
            })
            marcadas.forEach(figurinha =>{
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
            })
        }
    })
}

