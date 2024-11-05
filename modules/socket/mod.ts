// deno-lint-ignore-file
import { Context, Fastro } from "@app/mod.ts";
import { createCollection } from "@app/modules/store/mod.ts";
import { DAY } from "jsr:@std/datetime@^0.221.0/constants";

interface Message {
    img: string;
    username: string;
    msg: string;
    id: string;
}

interface Data {
    type: string;
    room: string;
    user: string;
    message?: Message;
}

export default function socketModule(s: Fastro) {
    function broadcastMessage(connections: any, room: string, message: string) {
        const sockets = connections.get(room);
        if (sockets) {
            for (const client of sockets) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            }
        }
    }

    async function broadcastConnection(ctx: Context, data: Data) {
        const connectedUsers: any[] = [];
        const c = ctx.stores.get("connected");
        if (!c) return;
        const entries = c.entries().toArray();
        if (entries) {
            for (const key in entries) {
                const [username, { value: { data } }] = entries[key];
                connectedUsers.push({
                    username,
                    room: data.room,
                    avatar_url: data.avatar_url,
                });
            }
            for (const key in entries) {
                const [, { value: { socket } }] = entries[key];
                socket.send(JSON.stringify(connectedUsers));
            }
        }
    }

    async function joinRoom(
        ctx: Context,
        socket: WebSocket,
        data: Data,
    ) {
        const connected = ctx.stores.get("connected");
        connected?.set(data.user, { data, socket });
    }

    const injectData = async (ctx: Context, data: Data) => {
        let rs = ctx.stores.get(data.room);
        const d: any = { ...data };
        delete d["room"];
        const id = data.message?.id as string;
        if (!rs) {
            const store = await createCollection("rooms", data.room);
            await store.set(id, d, DAY).commit();
            ctx.stores.set(d.room, store);
            rs = store;
        }

        await rs?.set(id, d, DAY).commit();
    };

    function handleConnection(
        ctx: Context,
        socket: WebSocket,
    ) {
        socket.onopen = () => {
            console.log("CONNECTED");
        };

        socket.onmessage = async (event) => {
            const data: Data = JSON.parse(event.data);
            await joinRoom(ctx, socket, data);
            if (data.type === "ping") {
                return broadcastConnection(ctx, data);
            }
            if (data.type === "message" && data.message?.msg !== "") {
                const c = await ctx.stores.get("core")?.get("connections");
                broadcastMessage(c, data.room, JSON.stringify(data.message));
                return await injectData(ctx, data);
            }
        };
        socket.onclose = async () => {
            const c = ctx.stores.get("connected");
            if (!c) return;
            const entries = c.entries().toArray();
            for (const key in entries) {
                const [username, { value: { socket, data } }] = entries[key];
                if (socket && socket.readyState !== WebSocket.OPEN) {
                    c.delete(username);
                    broadcastConnection(ctx, {
                        type: "ping",
                        room: data.room,
                        user: data.user,
                    });
                }
            }
            console.log("DISCONNECTED");
        };

        socket.onerror = (error) => console.error("ERROR:", error);
    }

    s.use((request, ctx) => {
        const ws = request.headers.get("upgrade");
        if (ws && ws === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(request);
            handleConnection(ctx, socket);
            return response;
        }
    });

    return s;
}
