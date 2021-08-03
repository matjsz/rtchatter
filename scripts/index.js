function loginUser(){
    username = document.getElementById('username').value;
    color = document.getElementById('color').value;

    if(username == "" || username == " "){
        window.alert("Usuário incorreto!")
        return
    }

    if(color == "" || color == " "){
        window.alert("Cor incorreta!")
        return
    }

    sessionStorage.username = username;
    sessionStorage.color = color;

    window.location = "rooms"
}

function logoutUser(){
    sessionStorage.clear();
    window.location = "index"
}

var login = new Vue({
    el: '#form-signin',
    data: {
        seen: true,
        logged: false,
        username: null
    }
})

if(sessionStorage.username == undefined){
    login.seen = true
} else{
    login.seen = false
    login.logged = true
    login.username = sessionStorage.username
}