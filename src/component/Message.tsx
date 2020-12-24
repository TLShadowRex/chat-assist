import React from 'react';
import EventService from '../service/EventService';
import ConfigService from '../service/ConfigService';
import MessageService from '../service/MessageService';
import ChatStamp from './ChatStamp';
import ChatUser from './ChatUser';

export default function Message({ data, useBlacklist = true, messageKey = null }) {
    if (useBlacklist == true && ConfigService.config.blackList.includes(data.context["display-name"])) {
        return null;
    }

    const isUrl = (string) => { // Thx to liadala
        console.log(string);
        try {
            new URL(string);
        } catch (_) {
            return false;
        }
        return true;
    }

    const applyFilters = (message) => {
        console.log(message);
        let segments = message.split(/\s+/);
        let result = [];
        let idx = 0;
        for(let segment of segments) {
            if(true == isUrl(segment)) {
                result.push(<span className={'external-link'} onClick={() => { openLink(segment) }} key={"l-" + idx}>[link]</span>);
            } else {
                result.push(segment+" ");
            }
            idx++;
        }
        return result;
    }

    const openLink = (link) => {
        require("electron").shell.openExternal(link);
    }

    return <div className="flex vertical messageContainer">
        <div className="flex horizontal messageTitle">
            <ChatUser data={data} />
            <div className="flex-element"></div>
            <ChatStamp data={data} />
            {messageKey != null && <div className="remove btn fas fa-trash" onClick={() => {
                MessageService.remove(messageKey, data);
            }}></div>}
        </div>
        <div className="message">
            {applyFilters(data.message)}
        </div>
    </div>
}