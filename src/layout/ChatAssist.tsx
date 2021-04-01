import React, { useState, useEffect } from 'react';
const ipcRenderer = window.require('electron').ipcRenderer;

import Tokens from '../settings/Tokens';
import EventService from '../service/EventService';
import ConfigService from '../service/ConfigService';
import MessageService from '../service/MessageService';
import Modal from './Modal';
import Chat from '../model/Chat';
import FilterSetting from '../settings/Filters';
import FilterRule from '../model/FilterRule';
import BlackList from '../settings/BlackList';
import Message from '../component/Message';
export default function ChatAssists() {
    let [filters, setFilters] = useState(ConfigService.config?.filters ?? []);
    let [configured, setConfigured] = useState(true);
    let [chatState, setChatState] = useState('disconencted');
    let [update, setUpdate] = useState(-1);
    let forceUpdate = () => {
        setTimeout(() => { setUpdate(Math.random()); }, 500);
    };
    useEffect(() => {
        ipcRenderer.on('user.config', (event, config) => {
            ConfigService.setConfig(config);
            EventService.trigger('config.update', null);
            if (config.hasOwnProperty('tmiToken') && config.tmiToken != '' && config.tmiToken != undefined) {
                setConfigured(true);
            }
            setFilters(config.filters ?? []);
        });
        ipcRenderer.send('user.getConfig', null);
        EventService.register('main', 'config.set', (config) => {
            console.log("updating config", config);
            setConfigured(ConfigService.config.tmiToken!=null);
            Chat.updateFilters();
            ipcRenderer.send('user.setConfig', config);
        })
        EventService.register('main', 'message.update', forceUpdate)
        EventService.register('main', 'chat.state', setChatState);
        if (false == configured) {
            showTokenSetup();
        }
        return () => {
            EventService.unregister('main', 'config.set');
            EventService.unregister('main', 'message.update', forceUpdate);
            EventService.unregister('main', 'chat.state');
        }

    }, []);
    let showTokenSetup = () => EventService.trigger('modal.show', { title: 'Settings', view: <Tokens />, modalClass: 'wide' });
    let showFilterSetup = () => EventService.trigger('modal.show', { title: 'Filter', view: <FilterSetting filter={new FilterRule()} /> });
    let showBlackList = () => EventService.trigger('modal.show', { title: 'blacklist', view: <BlackList/>, modalClass: 'wide' });

    return <div className="flex horizontal base">
        <div className={"controlBar flex vertical"}>
            <div className="btn btn-primary fas fa-cogs settings" onClick={showTokenSetup}></div>
            <div className={"btn chat fas " + (chatState == 'connected' ? ' fa-sign-out-alt ' : ' fa-sign-in-alt ') + chatState} onClick={() => {
                switch (chatState) {
                    case 'connected':
                        Chat.stop();
                        break;
                    default:
                        Chat.run();
                }
            }}></div>
            <div className="btn settings fas fa-filter" onClick={showFilterSetup}></div>
            <div className="btn settings fas fa-power-off" onClick={() => {
                let config = ConfigService.config;
                config.filters = [];
                config.blackList = [];
                EventService.trigger('config.set', config);
            }}></div>
            <div className="btn settings fas fa-user-slash" onClick={showBlackList}></div>
        </div>
        <div className="filterField flex vertical">
            <div className="title">Live</div>
            <div className="messages flex vertical">
                {MessageService.get('raw').map((data) => {
                    return <Message data={data} useBlacklist={false} key={data.context.id}/>
                })}
            </div>
        </div>
        {configured && filters.map((filter) => {
            return <div className="filterField flex vertical" key={filter.rule}>
                <div className="title flex horizontal">
                    <div className="name">{filter.rule}</div>
                    <div className="flex-element"></div>
                    <div className="remove btn fas fa-trash" onClick={() => {
                        ConfigService.config.filters = ConfigService.config.filters.filter((entry) => entry != filter);
                        EventService.trigger('config.set', ConfigService.config);
                    }}></div>
                </div>
                <div className="messages flex vertical">
                    {MessageService.get(filter.rule).map((data) => {
                        return <Message data={data} useBlacklist={true} messageKey={filter.rule} key={data.context.id}/> 
                    })}
                </div>
            </div>
        })}
        <Modal></Modal>
    </div>
}