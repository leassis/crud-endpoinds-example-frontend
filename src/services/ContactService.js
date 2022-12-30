import axios from "axios";

const CONTACT_BASE_URL = "http://localhost:8080/api/contacts"


class ContactService {

    getAll(page) {
        return page
             ? axios.get(CONTACT_BASE_URL + "?page=" + page)
             : axios.get(CONTACT_BASE_URL)
    }

    create(contact) {
        return axios.post(CONTACT_BASE_URL, contact)
    }
    
    getById(id) {
        return axios.get(CONTACT_BASE_URL + "/" + id)
    }
    
    update(id, contact) {
        return axios.put(CONTACT_BASE_URL + "/" + id, contact)
    }
    
    delete(id) {
        return axios.delete(CONTACT_BASE_URL + "/" + id)
    }
}

export default new ContactService()