import SockJS from "sockjs-client";
import Stomp from "stompjs";
import EventEmitter from "events";

class Socket extends EventEmitter {
  constructor() {
    super();
  }
  setOption(houseId, housePwd, connectType) {
    const baseUrl = process.env.VUE_APP_BASE_API;
    this.socketClient = new SockJS(
      baseUrl +
        "/server?houseId=" +
        houseId +
        "&housePwd=" +
        housePwd +
        "&connectType=" +
        connectType
    );
    this.stompClient = Stomp.over(this.socketClient);
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.stompClient.connect(
        {},
        frame => {
          this.setName();
          this.subscribeAll();
          // 获取用户列表
          this.send("/house/houseuser");
          this.socketClient.onmessage = this.onMessage.bind(this);
          this.emit("onconnect");
          resolve(frame);
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  }
  onMessage(message) {
    this.emit("onmessage", message);
  }
  onClose() {}
  send(url, data) {
    return this.stompClient.send(url, {}, JSON.stringify(data));
  }
  subscribe(url, cb) {
    this.stompClient.subscribe(url, cb);
  }
  setName(name) {
    let userName = name || window.localStorage.getItem("USER_NAME");
    if (userName) {
      this.send("/setting/name", {
        name: userName,
        sendTime: Date.now()
      });
    }
  }
  subscribeAll() {
    this.subscribe("/topic/chat", () => {});
    this.subscribe("/topic/music/order", () => {});
  }
}

export default new Socket();
