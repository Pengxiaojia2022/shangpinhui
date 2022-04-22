
import { v4 as uuidv4 } from 'uuid'

export const getUUID = function () {
    let uuid_token = localStorage.getItem('UUIDTOKEN');
    if (!uuid_token) {
        let uuid = uuidv4()
        localStorage.setItem('UUIDTOKEN', uuid)
    }
    return uuid_token
}