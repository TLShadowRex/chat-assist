import React from 'react';
import EventService from '../service/EventService';
import moment from 'moment';

export default function ChatStamp({ data }) {
    return <div className="timeStamp vertical-items-center vertical-align-items-center flex">
        {moment(data.context['tmi-sent-ts'], "x").format("HH:mm:ss")}
    </div>
}