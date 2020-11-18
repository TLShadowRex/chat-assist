import EventService from './EventService';
class MessageService {
    constructor() {
        this.messages = {};
    }

    set(rule,message) {
        if(this.messages.hasOwnProperty(rule) == false) {
            this.messages[rule] = [];
        }
        this.messages[rule].push(message);
        EventService.trigger('message.update',null);
    }
    get(rule) {
        if(this.messages.hasOwnProperty(rule) == false) {
            return [];
        }
        return this.messages[rule];
    }

    remove(rule, message) {
        this.messages[rule] = this.messages[rule].filter((element) => element != message);
        EventService.trigger('message.update',null);
    }
}

export default new MessageService();
