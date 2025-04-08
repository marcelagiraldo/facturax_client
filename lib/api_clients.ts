const API = 'http://192.168.228.249:3006/clientes'

export const getClients = async() =>{
    return await fetch(API,{
        method:'GET',
    }).then(data=>data.json)
}