class EventService {
    constructor() {
        this.listener = {};
        this.lookups = [];
    }

    register(registerer, event, callback) {
        if(!this.listener.hasOwnProperty(event)) {
            this.listener[event] = [];
        }
        this.listener[event].push({callee:registerer,function:callback});
    }

    unregister(registerer,event, callback = null) {
        if(this.listener.hasOwnProperty(event)) {
            for(let idx in this.listener[event]) {
                let listener = this.listener[event][idx];
                if(listener.callee === registerer) {
                    this.listener[event].splice(idx,1);
                }
            }
        }
    }
    trigger(event,data) {
        if(this.listener.hasOwnProperty(event)) {
            for(let obj of this.listener[event]) {
                obj.function(data);
            }
        }
    }
}

export default new EventService();
