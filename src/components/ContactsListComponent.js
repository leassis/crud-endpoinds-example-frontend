import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ContactService from '../services/ContactService'

const ContactsListComponent = () => {

    const [contacts, setContacts] = useState([])
    const [first, setFirst] = useState(null)
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)

    const queryParams = useLocation().search
    const navigate = useNavigate()

    const getAll = () => {
        const page = new URLSearchParams(queryParams).get('page')

        ContactService.getAll(page)
            .then((r) => {
                setContacts(r.data.data)

                setFirst(r.data.meta.first)
                setPrev(r.data.meta.prev)
                setNext(r.data.meta.next)
            })
            .catch(error => console.log(error))
    }

    const deleteContact = (id) => {
        if (window.confirm("Are you sure?")) {
            ContactService.delete(id)
                .then((r) => {
                    //getAll();
                    navigate("/contacts?page=" + first)
                })
                .catch(error => console.log(error))
        }
    }

    useEffect(getAll, [queryParams])

    return (
        <div className='container'>
            <h2 className='text-center'>List Contacts</h2>
            <Link className='btn btn-success mb-2' to='/add-contact'>Add Contact</Link>
            <table className="table table-bordered table-stripped">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>nick</th>
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        contacts.map(contact =>
                            <tr key={contact.id}>
                                <td>{contact.id}</td>
                                <td>{contact.name}</td>
                                <td>{contact.nick}</td>
                                <td>
                                    <Link to={`/contacts/${contact.id}`} className=' btn btn-info btn-sm me-1'>Edit</Link>
                                    <button onClick={() => deleteContact(contact.id)} className='btn btn-sm btn-info'>Delete</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <div>
                <Link to={`/contacts?page=${first}`} className={`btn btn-info btn-sm ${prev ? "" : "disabled"}`}>First</Link>
                <Link to={`/contacts?page=${prev ? prev : first}`} className={`btn btn-info btn-sm mx-1 ${prev ? "" : "disabled"}`}>Previous</Link>
                <Link to={`/contacts?page=${next ? next : first}`} className={`btn btn-info btn-sm ${next ? "" : "disabled"}`}>Next</Link>
            </div>
        </div>
    )
}

export default ContactsListComponent