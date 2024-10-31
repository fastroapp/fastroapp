// deno-lint-ignore-file no-explicit-any
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { Message } from "@app/modules/index/index.message.tsx";
import useWebSocket from "@app/modules/hook/socket.ts";
import { formatTime, ulidToDate } from "@app/utils/ulid.ts";
import useFetch from "@app/modules/hook/fetch.ts";
import type { DataType, RoomType } from "@app/modules/types/mod.ts";
import { initialData } from "@app/modules/socket/init.ts";
import { AppContext } from "@app/modules/index/index.context.ts";
import { effect } from "https://esm.sh/@preact/signals@1.3.0";
import MessageInput from "@app/modules/index/index.input.tsx";

function ListMessage(props: { data: DataType[] }) {
    const listRef = useRef<HTMLDivElement>(null);
    const data = props.data;

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [props.data]);

    return (
        <div
            ref={listRef}
            class={`overflow-auto pt-3 z-0`}
        >
            <ul class={`flex flex-col justify-end gap-y-2`}>
                {data && data.map((item, index) => {
                    return (
                        <ul
                            class={`px-4 text-sm flex flex-col justify-end gap-y-2`}
                            key={index}
                        >
                            {item.messages.map((d, x) => {
                                const idx = x;
                                return (
                                    <Message
                                        id={d.id}
                                        idx={idx}
                                        msg={d.msg}
                                        time={formatTime(d.time)}
                                        username={item.username}
                                        img={item.img}
                                    />
                                );
                            })}
                        </ul>
                    );
                })}
            </ul>
        </div>
    );
}

function Background() {
    return (
        <div style="content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('/bg.png'); background-position: center; opacity: 0.1; z-index: 0;" />
    );
}

function Loading(props: { text: string }) {
    return (
        <div class="relative grow h-screen max-w-8/12 flex flex-col justify-center bg-gray-950 border-t border-l border-r border-gray-700 p-4 text-center">
            {props.text}
            <Background />
        </div>
    );
}

export function Main(
    props: { avatar_url: string; username: string; ws_url: string },
) {
    const state = useContext(AppContext);
    const [room, setRoom] = useState<RoomType>({
        name: "global",
        id: "01JAC4GM721KGRWZHG53SMXZP0",
    });
    const { data: d, loading, setLoading, error } = useFetch<DataType[]>(
        `api/message/${room.id}/${props.username}`,
    );
    const [data, setData] = useState<DataType[]>(d as any);
    const { message, sendMessage, isConnected } = useWebSocket(
        props.ws_url,
        room.id,
    );

    const insertData = (newMessage: {
        msg: string;
        username: string;
        id: string;
        img: string;
    }) => {
        const updatedData = [...data];
        const lastUser = updatedData[updatedData.length - 1];
        const time = ulidToDate(newMessage.id);
        const msg = {
            type: "message",
            msg: newMessage.msg,
            id: newMessage.id,
            time,
        };

        if (lastUser.username === newMessage.username) {
            const lastUserMessages = lastUser.messages;
            lastUserMessages.push(msg);
        } else {
            updatedData.push({
                type: "message",
                username: newMessage.username,
                img: newMessage.img,
                messages: [msg],
            });
        }

        setData(updatedData);
    };

    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data]);

    useEffect(() => {
        if (isConnected && message) {
            insertData(JSON.parse(message));
        }
    }, [message, isConnected]);

    useEffect(() => {
        if (isConnected && d) {
            const arr = [...initialData];
            arr[0].messages[0].msg =
                `Hello ${props.username}! Welcome to ${room.name} room.`;

            const dd = [...arr, ...d];
            const ddd = dd.map((v) => {
                const msg = v.messages.map((m) => {
                    m.time = ulidToDate(m.id);
                    return m;
                });
                v.messages = msg;
                return v;
            });
            setData(ddd);
        }
    }, [d, initialData, isConnected]);

    useEffect(() => {
        setLoading(true);
    }, [room]);

    effect(() => {
        setRoom(state.room.value);
    });

    return (
        <>
            {error && <Loading text={error} />}
            {loading && <Loading text="Loading" />}
            {!loading && (
                <div class={`grow static md:relative`}>
                    <Background />
                    <div class="h-screen flex flex-col justify-end bg-gray-950 pb-20 md:border-l-[1px] md:border-r-[1px] border-gray-800">
                        <ListMessage data={data} />
                    </div>
                    <div class="fixed md:absolute bottom-0 left-0 right-0 md:flex md:flex-col p-3 z-10 bg-gray-900 border-t-[1px] border-gray-800">
                        <MessageInput
                            avatar_url={props.avatar_url}
                            ws_url={props.ws_url}
                            username={props.username}
                            room={room}
                            sendMessage={sendMessage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}