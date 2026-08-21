import { writable } from 'svelte/store';

interface ChatContact {
	id: number,
	name: string,
	message: string,
	time: Date
}

export let activeChats:ChatContact[] = [];

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

		this.ws.onmessage = event => {
			let data = JSON.parse(event.data);
			switch (data.type) {
				case "contacts":
					activeChats = [];
					data.res.forEach((element:any) => {
						activeChats.push({id: element.id, name: element.name, message: element.message, time:new Date(element.time)});
					});
					break ;
			
				default:
					console.log(data);
					break ;
			}
		};
	}

	disconnect() {
		this.ws?.close();
		this.ws = null;
	}

	sendMessage(message: string, target: string) {
		this.ws?.send(JSON.stringify({ type: "message", target: target, message: message }));
	}

	sendRequest(target: string) {
		this.ws?.send(JSON.stringify({ type: "history", target: target }));
	}
}

export const chatClient = new ChatClient();