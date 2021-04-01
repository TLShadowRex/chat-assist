import React, { useState, useEffect } from 'react';

import EventService from '../service/EventService';
import ConfigService from '../service/ConfigService';
import FilterRule from '../model/FilterRule';


export default function FilterSetting({filter}) {
    let [rule, setRule] = useState(filter.rule);
    let [events, setEvents] = useState(filter.events);
    let [event, setEvent] = useState('chat');
    
    let submitFilters = () => {
        if(rule == '' || rule == undefined || rule == null) {
            return;
        }
        let filterRule = new FilterRule();
        filterRule.rule = rule;
        filterRule.events = events.length == 0 ? ['chat']: events; //Added defaulting
        ConfigService.config.filters = [...ConfigService.config.filters, filterRule];
        EventService.trigger('config.set', ConfigService.config);
        rule = '';
    }

    return <div>
        <div className="event">
            {events.map((event) => <div key={event}>{event}</div>)}
            {/*<input type="text" onChange={(event) => {
                setEvent(event.target.value);
            }} value={event} />
            <button onClick={() => {
                if (event != '') {
                    setEvents([...events, event]);
                    event = '';
                }
            }}>addEvent</button> //Removed add event since we only have chat event for now*/} 
        </div>
        <div className="rule">
            <input type="text" onChange={(event) => {
                setRule(event.target.value);
            }} value={rule} />
            <button onClick={submitFilters}>addRule</button>
        </div>
    </div>
}