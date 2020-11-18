import React, { useState, useEffect } from 'react';

import EventService from '../service/EventService';
import ConfigService from '../service/ConfigService';


export default function TokenSettings() {
    let [tmiToken, setTmiToken] = useState('');
    let [pubSubToken, setPubSub] = useState('');
    let [userName, setUserName] = useState('');
    let [channel, setChannel] = useState('');
    let updateTokens = () => {
        if (ConfigService.config.hasOwnProperty('userName') && ConfigService.config.userName != '' && ConfigService.config.userName != undefined) {
            setUserName(ConfigService.config.userName);
        }
        if (ConfigService.config.hasOwnProperty('channel') && ConfigService.config.channel != '' && ConfigService.config.channel != undefined) {
            setChannel(ConfigService.config.channel);
        }
        if (ConfigService.config.hasOwnProperty('tmiToken') && ConfigService.config.tmiToken != '' && ConfigService.config.tmiToken != undefined) {
            setTmiToken(ConfigService.config.tmiToken);
        }
    }



    useEffect(() => {
        updateTokens();
        EventService.register('tokenSetup', 'config.update', updateTokens);
        return () => {
            EventService.unregister('tokenSetup', 'config.update', updateTokens);
        }
    }, []);
    
    return <div>
        <div className="flex horizontal">
            <div className="flex-element input">
                <label>Benutzer:</label>
                <input className="flex-element" type="text" value={userName} onChange={(event) => {
                    setUserName(event.target.value);
                }}></input>
            </div>
        </div>
        <div className="flex horizontal top-spacing">
            <div className="flex-element input">
                <label>Kanal:</label>
                <input type="text" value={channel} onChange={(event) => {
                    setChannel(event.target.value);
                }}></input>
            </div>
        </div>
        <div className="flex horizontal top-spacing">
            <div className="flex-element input">
                <label>Chat-Token:</label>
                <input type="text" value={tmiToken} onChange={(event) => {
                    setTmiToken(event.target.value);
                }}></input>
            </div>
        </div>
        <div className="flex horizontal top-spacing">
        <div className="flex-element input">
                <label>PubSub-Token:</label>
                <input type="text" value={pubSubToken} onChange={(event) => {
                setPubSub(event.target.value);
            }}></input>
            </div>                        
        </div>
        <div className="flex horizontal top-spacing">
            <div className="flex-element vertical-items-center"></div>
            <div className="btn btn-primary fas fa-save" onClick={() => {
                EventService.trigger('config.set', { 'tmiToken': tmiToken, 'pubSubToken': pubSubToken, 'userName': userName, 'channel': channel });
                EventService.trigger('modal.show', null);
            }}></div>
        </div>
    </div>
}