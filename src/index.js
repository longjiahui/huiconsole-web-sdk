import _MessageTransporter from './messageTransporter'
import $const from './const'
import { nanoid } from 'nanoid'
import url from 'url'

// tabid
let isIframe = window !== window.top

class _HUIConsole extends _MessageTransporter{
    constructor(params = {}){
        let data = isIframe ? url.parse(window.location.href, true).query : params
        let {
            _tabId: tabId,
            _fromTabId: fromTabId,
            _resolveId: resolveId,
            _huiconsoleId: huiconsoleId,
        } = data
        delete params._tabId
        delete params._fromTabId
        delete params._fromTabId
        delete params._huiconsoleId
        let { type, window: _window } = params
        delete params.type
        super({
            id: huiconsoleId,
            to: tabId,
            ...params,
            window: _window || window.top,
        })
        this.debug('construct huiconsole: ', data)
        Object.assign(this, {
            tabId,
            fromTabId,
            resolveId,
            huiconsoleId,
            type,
        })
    }

    async openTab(name, data, options = {}){
        let resolveId = nanoid()
        let ret = new Promise(r=>this.once(resolveId, r))
        this.command('openTab', {
            name,
            data,
            type: this.type || $const.MT.COMPONENT,
            isTransparent: true,
            ...options
        }, resolveId,)
        return ret.finally(()=>this.debug('huiconsole-1 received resolveId: ', resolveId))
    }
    async closeTab(){
        return this.command('closeTab')
    }
    async getToken(){
        return this.command('getToken')
    }
    async resolve(...rest){
        return this.command(this.resolveId, ...rest)
    }
}
Object.assign(_HUIConsole, $const)

export const MessageTransporter = _MessageTransporter
export const HUIConsole = _HUIConsole
export const useHUIConsole = (...rest)=>{
    let vnode = Vue.getCurrentInstance()?.vnode
    let props = vnode?.props
    let { _tabId, _fromTabId, _resolveId, _huiconsoleId } = props || {}
    let huiconsole = new HUIConsole({
        _tabId,
        _fromTabId,
        _resolveId,
        _huiconsoleId,
    })
    return huiconsole
}