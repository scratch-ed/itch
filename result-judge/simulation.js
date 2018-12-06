
module.exports = class Simulation {

    constructor() {
        this._startTime = (new Date()).getTime();
        this.events = [];
        this.actions = [];
    }

    getTimeStamp() {
        return (new Date()).getTime() - this._startTime;
    }

    pushEvent(type, event) {
        this.events.push({time: getTimeStamp(), type:type, event:event});
    }

    pushAction(event) {
        this.actions.push(event);
    }

    launch() {
        for (let action in this.actions) {
            setTimeout(() => {
                action.launch();
            }, action.delay);
        }
    }


};