import transportUtils from './transport'
import Emitter from './emitter'
import { nanoid } from 'nanoid'

// const command = {
//     list: '_list',
// }

export default class extends Emitter{
    constructor({
        window: _window,
        id = nanoid(),
        to,
        debug = false,
        commandTimeout = 15000,
    } = {}){
        super()
        this._id = id
        this._window = _window
        if(this._window){
            this._rInited?.()
        }
        this._to = to
        this._debug = debug
        this.commandTimeout = commandTimeout
        window.addEventListener('message', e=>{
            this.debug('received: ', e.data)
            let data
            try{
                data = JSON.parse(e.data)
            }catch(err){
                console.debug('parse window postmessage error', err)
            }
            if(data?.command && (!data.to || data.to === this._id)){
                if(data.from && !this._to){
                    this._to = data.from
                    this.debug('auto connected(from): ', data.from)
                }
                this.emit(data.command, ...(data.data || [])).then(ret=>{
                    this.debug('message handled: ', ret)
                    if(data.replyId){
                        return this.reply(data.from, data.replyId, ret, {})
                    }
                })
            }
        })
    }

    setWindow(_window){
        this._window = _window
        if(_window){
            this._rInited?.()
        }
    }

    async _send(data, { window: _window, to } = {}){
        to = to || this._to
        _window = _window || this._window
        data.to = to
        data.from = this._id
        data = await transportUtils.serialize(data)
        this.debug(`sending: `, data)
        if(!_window){
            this.debug('have not inited _window')
            await new Promise(r=>{
                this._rInited = r
            })
            this.debug('_window inited !')
        }
        _window.postMessage(JSON.stringify(data), '*')
    }

    // 只返回一个参数data，而不是...rest 因为promise resolve只能是一个参数
    async reply(from, replyId, data){
        return this._send({
            command: replyId,
            data: [data]
        }, { to: from })
    }

    to(to, _window){
        return {
            command: (...rest)=>this._command(_window, to, ...rest)
        }
    }

    window(_window){
        return {
            to: to=>this.to(to, _window),
            command: (...rest)=>this._command(_window, undefined, ...rest)
        }
    }

    async command(command, ...rest){
        return this._command(undefined, undefined, command, ...rest)
    }

    async _command(window, to, command, ...rest){
        let promise = new Promise(async (r, reject)=>{
            // 此id用来绑定 返回的消息是属于该发送的返回
            let replyId = nanoid()
            this.once(replyId, r)
            await this._send({
                replyId,
                command,
                data: rest,
            }, {
                window,
                to,
            })
            setTimeout(()=>{
                promise.catch(err=>{
                    console.warn(err)
                })
                let errInfo = `[${Date.now()}]command(${command}) request timeout: ${this.commandTimeout}ms`
                reject(errInfo)
            }, this.commandTimeout)
        })
        return promise
    }

    debug(...rest){
        if(this._debug){
            return console.warn(...rest)
        }
    }
}
