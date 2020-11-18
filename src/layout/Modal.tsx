import React, { useState, useEffect } from 'react';

import EventService from '../service/EventService';


export default function Modal() {
    let [view, setView] = useState(null);
    let closeModal = () => {
        setView(null);
    }
    
    useEffect(() => {
        EventService.register('modal', 'modal.show', setView);
        EventService.register('modal', 'modal.close', closeModal)
        return () => {
            EventService.unregister('modal', 'modal.show', setView);
            EventService.unregister('modal', 'modal.close', closeModal)
        }
    }, []);

    return <>
        {view != null && <div className={"modal"+(view!=null?' visible':'')+' '+view.modalClass}>
            <div className="fadeOut"></div>
            <div className="dialog">
                <div className="dialogHeader">
                    <div className="dialogTitle">{view.title}</div>
                    <div className="close fas fa-times" onClick={closeModal}></div>
                </div>
                <div className="dialogBody">
                    {view.view}
                </div>
            </div>
        </div>}
    </>
}