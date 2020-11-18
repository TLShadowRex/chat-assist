import React from 'react';
import EventService from '../service/EventService';
import UserHistory from './UserHistory';

export default function ChatUser({ data }) {
    const showHistory = () => {
        EventService.trigger('modal.show', { title: data.context["display-name"], view: <UserHistory data={data} />, modalClass: 'no-padding wide' });
    }
    return <div className="user vertical-items-center vertical-align-items-center flex-element flex" onClick={showHistory}>
        {data.context["display-name"]}
    </div>
}