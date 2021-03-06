class SignalingChannel {
    private signaling: WebSocket;

    constructor(signaling: WebSocket) {
      this.signaling = signaling;
    }

    send(message: object) {
      this.signaling.send(JSON.stringify({ data: message }));
    }

    set onmessage(handler: Function) {
      const onMessage = ({ data }: { data: string }) => {
        handler(JSON.parse(data));
      };

      this.signaling.addEventListener('message', onMessage);

      /* TODO refactor */
      this.unsubscribe = () => {
        console.log('unsubscribe from message');
        this.signaling.removeEventListener('message', onMessage);
      };
    }

    // eslint-disable-next-line class-methods-use-this
    unsubscribe() {
      console.error('Method unsubscribe is not implemented');
    }
}

export { SignalingChannel };
