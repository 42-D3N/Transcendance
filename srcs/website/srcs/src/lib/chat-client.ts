class ChatClient {
	private ws: WebSocket | null = null;

	connect(token: string){
		if (this.ws) return;

		this.ws = new WebSocket(`wss://localhost:8081/api/chat?token=${token}`);

		this.ws.onopen = () => {
			console.log("Connected to chat server");
		};

		this.ws.onclose = () => {
			console.log("Disconnected from chat server");
			this.ws = null;
		};
	}

	disconnect() {
		this.ws?.close();
		this.ws = null;
	}

	send(message: string) {
		this.ws?.send(message);
	}
}

export const chatClient = new ChatClient();