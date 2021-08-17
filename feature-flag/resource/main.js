const app = new Vue({
  el: '#app',
  data: {
    messageService: 'mensaje inicial',
    aa: '',
    title: 'Full Feature Flag Example',
    text: '',
    callbackText: '',
    disableInput: false,
    destination: '',
    messages: [],
    messagesAll: [],
    socket: null,
    userSender: '',
    userDestination: '',
    connectionStatus: false,
    activeStatus: false,
    activeVisible: true,
    connectionCreated: null,
  },
  methods: {
    async setEnabled() {
      const data = {
        "id_front": "boton",
        "enable": !this.activeStatus,
        "visible": this.activeVisible,
        "host": "localhost:3000",
        "path": "/",
        "method": "GET",
        "status": !this.activeStatus
      }
      const respuesta = await fetch('http://localhost:3200/features', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        return data;
      }).catch(function (err) {
        console.warn('Something went wrong.', err);
      });
      this.activeStatus = respuesta.data.status;
      this.activeVisible = respuesta.data.visible;
    },
    async setVisible() {
      const data = {
        "id_front": "boton",
        "enable": this.activeStatus,
        "visible": !this.activeVisible,
        "host": "localhost:3000",
        "path": "/",
        "method": "GET",
        "status": this.activeStatus
      }
      const respuesta = await fetch('http://localhost:3200/features', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        return data;
      }).catch(function (err) {
        console.warn('Something went wrong.', err);
      });
      this.activeStatus = respuesta.data.status;
      this.activeVisible = respuesta.data.visible;
    },
    async getMessage() {
      const respuesta = await fetch('http://localhost:3000/').then(function (response) {
        return response.json();
      }).then(function (data) {
        return data;
      }).catch(function (err) {
        console.warn('Something went wrong.', err);
      });
      this.messageService = respuesta.message;
      setTimeout(() => {
        this.messageService = 'mensaje inicial'
      }, 2000);
    },
  },
  computed: {
    isMemberOfActiveRoom() {
      return this.rooms[this.userSender];
    }
  },
  async created() {
    // via rest
/*     const respuesta = await fetch('http://localhost:3200/features?t=localhost:3000').then(function (response) {
      return response.json();
    }).then(function (data) {
      return data;
    }).catch(function (err) {
      console.warn('Something went wrong.', err);
    });
    this.activeStatus = respuesta[0].status;
    this.activeVisible = respuesta[0].visible; */

    // via sockets
    this.socket = io(`http://127.0.0.1:3200/realtime`, {
      transportOptions: {
        withCredentials: true,
        polling: {
          extraHeaders: {
            'x-flow-user': this.userDestination,
            'x-flow-country': 'cl',

            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
            withCredentials: true,
            cors: {

              methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
              withCredentials: true
            }
          }
        },
        cors: {

          methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
          withCredentials: true
        }
      },
      cors: {

        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        withCredentials: true,
      }
    });
    this.socket.on('eventToFrontEnd', (message)=>{
      this.activeStatus = message.status;
      this.activeVisible = message.visible;
    });
    this.socket.on('msgToClientRead', (message) => {
      if (message) {
        this.receivedMessageRead(message)
      } else {
        this.messages = []
      }
    });
    this.socket.on('msgToClientHistoric', (message) => {
      if (message) {
        this.receivedAllMessage(message)
      } else {
        this.messagesAll = []
      }
    });
    this.socket.on('connect', () => {
    });

    this.socket.on('joinedRoom', (room) => {
      this.rooms[room] = true;
    });

    this.socket.on('leftRoomServer', (room) => {
      this.rooms[room] = false;
    });
  }
});
