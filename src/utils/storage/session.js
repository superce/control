const setSession = (name, value) => {
    if (!name || (!value && value !== 0)) {
        return false;
    }
    if (typeof value !== "string") {
        value = JSON.stringify(value)
    }
    window.sessionStorage.setItem(name, value)
};
const getSession = (name) => {
    let value = window.sessionStorage.getItem(name);
    if (value&&value.length > 0) {
        let result = undefined;
        try {
            result = JSON.parse(value)
        } catch (e) {
            result = value
        }
        return result;
    }
    return value
};
const removeSession = (name) => {
    window.sessionStorage.removeItem(name)
};
const clearSession = () => {
    window.sessionStorage.clear()
};


export {setSession, getSession, removeSession, clearSession}