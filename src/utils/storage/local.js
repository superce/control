const setLocal = (name, value) => {
    // if (!name || (!value && value !== 0)) {
    //     return false;
    // }
    if (typeof value !== "string") {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
};

const getLocal = (name) => {
    let value = window.localStorage.getItem(name);
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

const removeLocal = (name) => {
    window.localStorage.removeItem(name)
};

const clearLocal = () => {
    window.localStorage.clear()
};

export {setLocal, getLocal, removeLocal, clearLocal}