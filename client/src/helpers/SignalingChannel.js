class SignalingChannel {
  constructor(signaling) {
    this.signaling = signaling;
  }

  send(message) {
    this.signaling.send(JSON.stringify({ data: message }));
  }

  set onmessage(handler) {
    this.signaling.onmessage = ({ data }) => {
      handler(JSON.parse(data));
    };
  }
}

export { SignalingChannel };
