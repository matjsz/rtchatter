db = firebase.firestore();

Vue.component('room-item', {
    props: ['item'],
    template: '<li><a v-bind:href="`room?room=`+item.id">{{ item.id }}</a></li>'
})

var rooms = new Vue({
    el: '#rooms',
    data: {
        rooms: []
    }
})

db.collection("rooms").get().then((querySnapshot) => {
    querySnapshot.forEach((room) => {
        roomData = room.data();

        rooms.rooms.push({id: roomData.id, messages: roomData.messages})
    })
})


