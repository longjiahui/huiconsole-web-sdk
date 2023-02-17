import _MessageTransporter from './messageTransporter'

class _HUIConsole extends _MessageTransporter{
    constructor(params = {}){
        let { to } = params
        super({
            ...params,
            to: to || window.top,
        })
    }

    async openTab(name, data, options = {}){
        return this.command('openTab', {name, data, isTransparent: true, ...options})
    }
    async closeTab(){
        return this.command('closeTab')
    }
    async getToken(){
        return this.command('getToken')
    }
}

export const MessageTransporter = _MessageTransporter
export const HUIConsole = _HUIConsole
// export default _HUIConsole