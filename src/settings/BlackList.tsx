import React, { useState, useEffect } from 'react';

import EventService from '../service/EventService';
import ConfigService from '../service/ConfigService';


export default function BlackList() {
    let [user, setUser] = useState("");
    let [blackList, setBlackList] = useState(ConfigService.config.blackList)
    let addUser = () => {
        setBlackList([...ConfigService.config.blackList, user]);
    }

    let removeUser = (user) => {
        setBlackList([...ConfigService.config.blackList.filter((entry) => { return entry != user })]);
    }
    useEffect(() => {
        ConfigService.config.blackList = [...blackList];
        EventService.trigger('config.set', ConfigService.config);
    },[blackList])
    
    return <div>
        {blackList.map((entry) => 
            <div className="flex horizontal bottom-spacing" key={entry}>
                <div className="flex-element vertical-items-center">{entry}</div>
                <div className="vertical-space"></div>
                <div className="btn btn-primary fas fa-trash full-height" onClick={() => { removeUser(entry) }}></div>
            </div>
        )}

        <div className="flex horizontal">
            <div className="flex-element input">
                <label>Username:</label>
                <input type="text" onChange={(event) => { setUser(event.target.value) }}></input>
            </div>
            <div className="vertical-space"></div>
            <div>
                <div className="btn btn-primary fas fa-plus full-height" onClick={addUser}></div>
            </div>
        </div>
    </div>
}