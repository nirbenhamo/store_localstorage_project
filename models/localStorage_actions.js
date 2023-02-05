// functions to work with LS

// get data from ls (with json process)
export const getDataFromLS = (key)=>{
    return JSON.parse(localStorage.getItem(key));
}

// save data in ls (with json process)
export const saveDataInLS = (key, value)=>{
    localStorage.setItem(key,JSON.stringify(value));
}