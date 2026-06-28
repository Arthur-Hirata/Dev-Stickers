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
        alert("pode criar")
    }


}