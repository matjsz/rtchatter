db = firebase.firestore();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
roomID = urlParams.get('room');

// const beforeUnloadListener = (event) => {
//     event.preventDefault();
//     return event.returnValue = "Are you sure you want to exit?";
// };

// addEventListener("beforeunload", beforeUnloadListener, {capture: true});

window.onload = function() {
    db.collection("rooms").doc(roomID).update({
        messages: firebase.firestore.FieldValue.arrayUnion({'author': '💻 Sistema', 'color': '#FF0000', 'text': `${sessionStorage.username} acaba de se conectar, diga olá!`, 'date': new Date()})
    })

    db.collection("rooms").doc(roomID).update({
        users: firebase.firestore.FieldValue.arrayUnion(sessionStorage.username)
    })
}

window.onunload = function() {
    db.collection("rooms").doc(roomID).update({
        messages: firebase.firestore.FieldValue.arrayUnion({'author': '💻 Sistema', 'color': '#FF0000', 'text': `${sessionStorage.username} desconectou-se.`, 'date': new Date()})
    })

    db.collection("rooms").doc(roomID).update({
        users: firebase.firestore.FieldValue.arrayRemove(sessionStorage.username)
    })
}

window.onbeforeunload = function(){
    return 'Tem certeza que deseja sair?';
};

// Componente da mensagem
Vue.component('chat-item', {
    props: ['item'],
    template: '<li>[ {{ ("0" + item.date.toDate().getDate()).slice(-2) }}/{{ ("0" + item.date.toDate().getMonth()).slice(-2) }}/{{ item.date.toDate().getFullYear() }} | {{ ("0" + item.date.toDate().getHours()).slice(-2) }}:{{ ("0" + item.date.toDate().getMinutes()).slice(-2) }} ] <span v-bind:style="`color:`+item.color">{{ item.author }}</span>: {{ item.text }}</li>'
})

// Vue
var room = new Vue({
    el: '#room',
    data: {
        messages: []
    },
    methods: {
        sendMessage: function() {
            let author = sessionStorage.username;
            let color = sessionStorage.color;
            let text = document.getElementById('messageText').value;
            
            let cmd = text.split(" ")

            document.getElementById('messageText').value = ""
            
            db.collection("rooms").doc(roomID).update({
                messages: firebase.firestore.FieldValue.arrayUnion({'author': author, 'color': color, 'text': text, 'date': new Date()})
            })

            if(cmd[0] == "/cor"){
                sessionStorage.color = cmd[1]
                
                db.collection("rooms").doc(roomID).update({
                    messages: firebase.firestore.FieldValue.arrayUnion({'author': '💻 Sistema', 'color': '#FF0000', 'text': `${author}, sua nova cor agora é ${cmd[1]}.`, 'date': new Date()})
                })

                return
            } else if(cmd[0] == "/dark"){
                document.body.classList.toggle('dark-mode');
            } else if(cmd[0] == "/users"){
                db.collection("rooms").doc(roomID).get().then((roomSnapshot) => {
                    roomData = roomSnapshot.data()

                    db.collection("rooms").doc(roomID).update({
                        messages: firebase.firestore.FieldValue.arrayUnion({'author': '💻 Sistema', 'color': '#FF0000', 'text': `Os usuários conectados à esta sala são: ${roomData.users.join(', ')}.`, 'date': new Date()})
                    })
                })
            }
        }
    }
})

// Atualiza o componente do Vue que origina o front-end da página
db.collection("rooms").doc(roomID).onSnapshot((roomSnapshot) => {
    roomData = roomSnapshot.data()

    if(roomData.messages.length > 100){
        db.collection("rooms").doc(roomID).update({
            messages: firebase.firestore.FieldValue.delete()    
        })

        room.messages = []

        db.collection("rooms").doc(roomID).update({
            messages: firebase.firestore.FieldValue.arrayUnion({'author': '💻 Sistema', 'color': '#FF0000', 'text': 'Esta sala estava com mais de 100 mensagens registradas no banco de dados, por isso, todas as mensagens anteriores foram deletadas.', 'date': new Date()})
        })
    }

    room.messages.push(roomData.messages[roomData.messages.length-1])
})

// Ao apertar Enter a mensagem é enviada
document.getElementById('messageText').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("btnSendMsg").click();
    }
});