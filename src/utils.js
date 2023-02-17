export default {
    getStorage(type, key, defaultValue){
        let item = window[type].getItem(key)
        try{
            return typeof item === 'string' ? JSON.parse(item) : defaultValue
        }catch(err){
            console.warn('getStorage JSON parse error: ', err)
            return defaultValue
        }
    },
    setStorage(type, key, value){
        window[type].setItem(key, JSON.stringify(value))
    },
    getLocal(...rest){
        return this.getStorage('localStorage', ...rest)
    },
    setLocal(...rest){
        return this.setStorage('localStorage', ...rest)
    },
}