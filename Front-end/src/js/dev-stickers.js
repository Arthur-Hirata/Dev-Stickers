
window.onload = function(){
    getGrous();
}

function getGrous(){
    fetch('http://127.0.0.1:5000/getGroups',{
        method : 'POST'
    })
    .then(response => response.json())
    .then(data =>{
        const selecoes = data.dados
        selecoes.forEach(selecao=>{
            console.log(selecao.pais)
        })
    })
}