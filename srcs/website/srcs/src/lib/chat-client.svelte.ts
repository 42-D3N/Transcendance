import { goto } from '$app/navigation';

interface ChatContact {
	id: number,
	avatar: string,
	name: string,
	message: string,
	time: Date,
	online: boolean
}

interface Message {
	author: number,
	target: number,
	message: string,
	timestamp: Date
}

interface OpenedChat {
	id: number,
	name: string,
	avatar: string | null,
	history: Message[],
	hasError: boolean | null,
	error: string | null,
	update: boolean,
	online: boolean
}

export let activeChats:ChatContact[] = $state([]);
export let openedChats:OpenedChat[] = $state([]);
let chatLimit:number = $state(4);
let	emptyChatId:number = -1;

class ChatClient {
	private ws: WebSocket | null = null;
	private userId: number = -1;

	connect(token: string, id: number){
		if (this.ws) return;
		this.userId = id;

		this.ws = new WebSocket(`wss://`+window.location.host+`/api/chat?token=${token}`);

		this.ws.onopen = () => {
			console.log("Connected to chat server");
		};

		this.ws.onclose = (event) => {
			if (event.code == 3000)
			{
				console.log("Disconnected from chat server, token is invalid.");
				goto('/user/logout');
				return ;
			}
			console.log("Disconnected from chat server, attempting reconnection in 5s.");
			this.ws = null;
			setTimeout(() => this.connect(token, this.userId), 5000);
		};

		this.ws.onmessage = event => {
			let data = JSON.parse(event.data);
			console.log(data);
			switch (data.type) {
				case "contacts":
					activeChats.splice(0);
					data.body.forEach((element:any) => {
						activeChats.push({id: element.id, name: element.name, avatar:element.avatar, message: element.message, time:new Date(element.time), online: element.online});
					});
					break ;

				case "newChat":
					openedChats[data.body.index].hasError = false;
					openedChats[data.body.index].error = null;
					if (data.valid) {
						openedChats[data.body.index].id = data.body.id;
						openedChats[data.body.index].name = data.body.name;
						openedChats[data.body.index].avatar = data.body.avatar;
						openedChats[data.body.index].online = data.body.online;
					}
					else {
						openedChats[data.body.index].hasError = true;
						openedChats[data.body.index].error = data.body.cause;
					}
					break;

				case "message":
					if (!data.valid)
						break;
					let isIn = false;
					activeChats.forEach((contact, index, contacts) => {
						if (contact.id === data.body.author || contact.id === data.body.target) {
							isIn = true;
							contact.message = data.body.message;
							contact.time = new Date(data.body.timestamp);
						}
					});
					if (!isIn) {
						if (data.body.author === this.userId) {
							activeChats.push({id: data.body.target, name: "", avatar:"", message: data.body.message, time:new Date(data.body.timestamp), online: false});
							this.ws?.send(JSON.stringify({ type: "infos", target: data.body.target }));
						}
						else {
							activeChats.push({id: data.body.author, name: "", avatar:"", message: data.body.message, time:new Date(data.body.timestamp), online: false});
							this.ws?.send(JSON.stringify({ type: "infos", target: data.body.author }));
						}
					}
					openedChats.forEach((chat, index, contacts) => {
						if (chat.id === data.body.author || chat.id === data.body.target)
						{
							chat.history.push({author: data.body.author, target: data.body.target, message: data.body.message, timestamp: new Date(data.body.timestamp)});
							chat.update = true;
						}
					});
					break;

				case "infos":
					if (!data.valid)
						break;
					activeChats.forEach((contact, index, contacts) => {
						if (contact.id === data.body.id) {
							contact.name = data.body.name;
							contact.avatar = data.body.avatar;
							contact.online = data.body.online;
						}
					});
					break;

				case "profileChange":
					activeChats.forEach((contact, index, contacts) => {
						if (contact.id === data.body.id) {
							contact.name = data.body.name;
							contact.avatar = data.body.avatar;
						}
					});
					openedChats.forEach((chat, index, contacts) => {
						if (chat.id === data.body.id) {
							chat.name = data.body.name;
							chat.avatar = data.body.avatar;
						}
					});
					break;

				case "statusChange":
					activeChats.forEach((contact, index, contacts) => {
						if (contact.id === data.body.id) {
							contact.online = data.body.status;
						}
					});
					openedChats.forEach((chat, index, contacts) => {
						if (chat.id === data.body.id) {
							chat.online = data.body.status;
						}
					});
					break ;

				case "history":
					if (!data.valid)
						break;
					openedChats.forEach((chat, index, contacts) => {
						if (chat.id === data.body.target)
						{
							chat.history = data.body.history;
							chat.update = true;
						}
					});
					break;

				default:
					break ;
			}
		};
	}

	disconnect() {
		this.ws?.close();
		this.ws = null;
	}

	sendMessage(message: string, target: number) {
		this.ws?.send(JSON.stringify({ type: "message", target: target, message: message }));
	}

	sendRequest(target: number) {
		this.ws?.send(JSON.stringify({ type: "history", target: target }));
	}

	checkUserExists(target: string, index: number) {
		this.ws?.send(JSON.stringify({ type: "newChat", target: target, index: index}));
	}

	execProfileChange(name: string, avatar:string | null) {
		this.ws?.send(JSON.stringify({ type: "profileChange", name: name, avatar: avatar}));
	}
}

export const chatClient = new ChatClient();

export function updateChatLimit(newLimit:number) {
	chatLimit = newLimit;
	while (openedChats.length > newLimit)
		openedChats.pop();
}

export function addEmptyChat() {
	while (openedChats.length >= chatLimit)
		openedChats.pop();
	openedChats.unshift({id: emptyChatId, name: "null", avatar: null, history: [], hasError: false, error: null, update: false, online: false});
	if (emptyChatId < -10)
		emptyChatId = -1;
	else
		emptyChatId--;
}

export function addChat(index: number) {
	let isIn = false;
	openedChats.forEach((chat) => {
		if (chat.id === activeChats[index].id)
			isIn = true;
	});
	if (isIn)
		return ;
	while (openedChats.length >= chatLimit)
		openedChats.pop();
	openedChats.unshift({id: activeChats[index].id, name: activeChats[index].name, avatar: activeChats[index].avatar, history: [], hasError: false, error: null, update: false, online: activeChats[index].online});
	chatClient.sendRequest(activeChats[index].id);
}