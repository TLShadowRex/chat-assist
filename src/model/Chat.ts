import { client } from 'tmi.js';
import ConfigService from '../service/ConfigService';
import EventService from '../service/EventService';
import MessageService from '../service/MessageService';

import FilterRule from './FilterRule';

class Chat {
    state: string = 'disconnected';
    client: client = null;
    filters : Array<FilterRule> = [];
    constructor() {
    }

    run() {
        this.state = 'connecting';
        EventService.trigger('chat.state',this.state);
        let token = ConfigService?.config?.tmiToken ?? null;
        let userName = ConfigService?.config?.userName ?? null;
        let channel = ConfigService?.config?.channel ?? null;
        if (null == token) {
            throw "No token provided"
        }
        if (null == userName) {
            throw "No userName provided"
        }
        if (null == channel) {
            throw "No channel provided"
        }
        this.client = new client({
            identity: {
                username: userName,
                password: token
            },
            channels: [
                channel
            ]
        });
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('connected', this.onConnected);
        this.client.connect();
        this.updateFilters();
    }

    stop() {
        this.client.disconnect();
        this.state = 'disconencted';
        EventService.trigger('chat.state',this.state);
    }

    updateFilters() {
        this.filters = ConfigService.config.filters.filter((entry) => { return entry.events.includes('chat');});
    }

    onConnected() {
        this.state = 'connected';
        EventService.trigger('chat.state',this.state);
    }

    onMessage(target, context, message, self) {
        if (self) {
            return;
        }
        
        MessageService.set('raw',{context:context,message:message});
        let input = message.trim();
        for(let active of this.filters) {
            let regExp = new RegExp(active.rule,'im');
            if(input.match(regExp)){
                MessageService.set(active.rule,{context:context,message:message});
            }
        }
    }
}

export default new Chat();