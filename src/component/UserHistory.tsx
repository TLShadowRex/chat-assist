import React from 'react';
import EventService from '../service/EventService';
import MessageService from '../service/MessageService';
import moment from 'moment';
import ChatStamp from './ChatStamp';
import Message from './Message';

export default function UserHistory({ data }) {
    return <div className="filterField">
        <div className="messages flex vertical">
            {
                MessageService.get('raw')
                    .filter((object) => object.context['user-id'] == data.context['user-id'])
                    .map((data) => {
                        return <Message data={data} key={data.context.id} />
                    })
            }
        </div>
    </div>
}