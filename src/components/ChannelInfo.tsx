import { Channel } from "@/lib/prisma";

export default function ChannelInfo({ channel }: { channel: Channel }) {
    return <div className="grow-[1]">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row items-center gap-2">
            <img src="/assets/text.png" className="w-6 h-6"/>
            <p className="text-stone-200">{channel.name}</p>
        </div>
    </div>
}