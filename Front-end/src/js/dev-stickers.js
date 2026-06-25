
window.onload = function(){
    getGrous();
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
                    li.appendChild(btnpais)

                    listaGrupo.appendChild(li)
                    
                }
            })
        })
    })
}
/*

<li><button class="pais"><img class="imagem-pais" src=""><span class="nome-pais">FWC</span></button></li>
<li><button class="pais"><img src="" alt="" class="imagem-pais"><span class="nome-pais">Coca-Cola</span></button></li>
<li><button class="pais"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJnm5HLbREuXMvOzMXWobYgHfLFpAi3v1J2b1d4SroLQ&s" class="imagem-pais"><span class="nome-pais">México</span></button></li>
<li><button class="pais"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kvBDum_l0NSP1v5PX-PHMAaBuUU7e78_ol3kiT1dNg&s=10" class="imagem-pais"><span class="nome-pais">Coreia do Sul</span></button></li>                <li><button class="pais"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIbiPM0QYxuYXw91OPQEkCCZDoBJ9zyUbFZ-HZWHbD7w&s=10" alt="" class="imagem-pais"><span class="nome-pais">Tchéquia</span></button></li>
<li><button class="pais"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwiMwQuQBHif3h3Jdag1OyRGiVjIFmZkTuCSZ537h3A&s=10" alt="" class="imagem-pais"> <span class="nome-pais">África do Sul</span></button></li>


*/
