import { writable } from 'svelte/store';

interface ChatContact {
	id: number,
	name: string,
	message: string,
	time: Date
}

type OpenedChatsType = [ChatContact?, ChatContact?, ChatContact?, ChatContact?]

export let activeChats:ChatContact[] = [];
export let openedChats = $state([]);

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

				case "newChat":
					openedChats[data.index].hasError = false;
					openedChats[data.index].error = null;
					if (data.isOk) {
						openedChats[data.index].id = data.user.id;
						openedChats[data.index].name = data.user.name;
					}
					else {
						openedChats[data.index].hasError = true;
						openedChats[data.index].error = data.reason;
					}
					break;

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

	checkUserExists(target: string, index: number) {
		this.ws?.send(JSON.stringify({ type: "newChat", target: target, index: index}));
	}
}

export const chatClient = new ChatClient();