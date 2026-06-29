const olho1 = document.getElementById("eye1")
const inputSenha = document.getElementById("password")
olho1.addEventListener("click", function(){
    if (inputSenha.type === "password"){
        inputSenha.type = "text"
        olho1.className = "fas fa-eye-slash"
    } else{
        inputSenha.type = "password"
        olho1.className = "fas fa-eye"
    }
})
const olho2 = document.getElementById("eye2")
const inputConfirmarSenha = document.getElementById("confirmar-senha")
olho2.addEventListener("click", function(){
    if (inputConfirmarSenha.type === "password"){
        inputConfirmarSenha.type = "text"
        olho2.className = "fas fa-eye-slash"
    }else{
        inputConfirmarSenha.type = "password"
        olho2.className = "fas fa-eye"
    }
})
let canCreatebyName= false
let canCreatebyEmail = false
let canCreateBypassword = false
let canCreatebyConfirm = false
function estiloBaseInput(...inputs){
    inputs.forEach(input =>{
        input.style.border = ""
    })
}
function estiloErroInput(input){
    if (input) input.style.border = "1px solid #EF4444"
}
function estilioBaseSpan(...spans){
    spans.forEach(span =>{
        span.style.display = "none"
    })
}
function eslitoErroSpan(span){
    span.style.display = "flex"
}





function criarConta(){
    const inputName = document.getElementById("user-name")
    const userName = inputName.value.trim();
    const inputEmail = document.getElementById("email")
    const userEmail = inputEmail.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const senha= inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;

    const nameError = document.getElementById('name-error')
    const emailError = document.getElementById("email-error")
    const passwordError = document.getElementById("password-error")
    const confirmError = document.getElementById("confirm-error")
    estiloBaseInput(inputName, inputEmail, inputConfirmarSenha, inputSenha)
    estilioBaseSpan(nameError, emailError, passwordError, confirmError)




    if (userName){
        canCreatebyName = true
    } else{
        estiloErroInput(inputName)
        eslitoErroSpan(nameError)
    }
    if (emailRegex.test(userEmail)){
        canCreatebyEmail = true
    } else{
        estiloErroInput(inputEmail)
        eslitoErroSpan(emailError)
    }
    if (senha.length >= 8){
        canCreateBypassword = true
    } else{
        estiloErroInput(inputSenha)
        eslitoErroSpan(passwordError)
    }
    if (senha === confirmarSenha && senha !== ""){
        canCreatebyConfirm = true
    } else{
        estiloErroInput(inputConfirmarSenha)
        eslitoErroSpan(confirmError)
        inputConfirmarSenha.value=""
    }
    let canCreate = canCreatebyName && canCreatebyEmail && canCreateBypassword && canCreatebyConfirm

    if (canCreate){
        fetch('http://127.0.0.1:5000/createUser', {
            method : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                nome : userName,
                email: userEmail,
                senha: senha
            })
        })
        .then(response => response.json())
        .then(data=>{
            const modalOverlay = document.querySelector(".modal-overlay")
            const modalTittle = document.querySelector(".modal-tittle")
            const modalText = document.querySelector(".modal-text")
            let modalBtn = document.querySelector(".modal-btn")

            const novoBotao = modalBtn.cloneNode(true);
            modalBtn.parentNode.replaceChild(novoBotao, modalBtn);
            modalBtn = novoBotao; 
            if (data.mensagem === "Usuário adicionado com sucesso"){
                localStorage.setItem("JWT_token", data.JWT_token)
                inputName.value = ""
                inputEmail.value = ""
                inputSenha.value = ""
                inputConfirmarSenha.value = ""

                modalOverlay.style.display = "flex"
                modalTittle.textContent = "Conta criada com sucesso!"
                modalTittle.style.color = "#22C55E"
                modalText.textContent="Seu cadastro foi enviado com sucesso. Agora você pode acessar sua conta."
                modalBtn.style.width = "200px"
                modalBtn.textContent = "Ir para a página principal"
                modalBtn.style.backgroundColor = "#22C55E"
                modalBtn.addEventListener("click", function(){
                    window.location.href = "Dev-Stickers.html"
                })
            } else{
                modalOverlay.style.display = "flex"
                modalTittle.textContent = "Erro ao criar conta!"
                modalTittle.style.color = "#EF4444"
                modalText.textContent="Seu cadastro não foi processado corretamente, tente novamente mais tarde."
                modalBtn.style.width = "200px"
                modalBtn.textContent = "Voltar"
                modalBtn.style.backgroundColor = "#EF4444"
                modalBtn.addEventListener("click", function(){
                    modalOverlay.style.display="none"
                })
            }
            
        }) .catch(error => {
            console.error("Erro na requisição:", error);
        });
    }


}