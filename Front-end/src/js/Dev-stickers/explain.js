
const testCard = document.getElementById("explain-test")
testCard.addEventListener("click", function(){
    const explainText = document.querySelector(".explain")
    const divControls = document.createElement("div")
    const btnDiminuir = document.createElement("btn")
    const quantidade = document.createElement("span")
    const btnAumentar = document.createElement("btn")
    divControls.className = "controls"
    btnDiminuir.className = "remove"
    btnDiminuir.textContent="-"
    btnDiminuir.style.textAlign = "center"
    quantidade.className = "duplicate"
    quantidade.textContent = 1
    btnAumentar.classList = "add"
    btnAumentar.textContent = "📦"
    btnAumentar.style.textAlign = "center"
    if (testCard.className === "missing"){
        explainText.textContent = "Para adicionar repetidas ou remover, você deve passar o mouse por cima da figurinha e apertar nos botões"
        testCard.className = "card"
        divControls.appendChild(btnDiminuir)
        divControls.appendChild(quantidade)
        divControls.appendChild(btnAumentar)
        testCard.appendChild(divControls)
        let quantidadeAtual = 1
        btnDiminuir.addEventListener("click", function(event){
            event.stopPropagation();
            if (quantidadeAtual == 1){
                testCard.className = "missing"
                explainText.textContent = "Para marcar um figurinha você deve apertar nela, caso dê certo ela mudara de cor!"
                divControls.remove(btnDiminuir)
                divControls.remove(quantidade)
                divControls.remove(btnAumentar)
            } else {
                quantidadeAtual -= 1
                quantidade.textContent = quantidadeAtual
            }
        })
        btnAumentar.addEventListener("click", function(){
            quantidadeAtual += 1
            quantidade.textContent = quantidadeAtual
        })
    }
})