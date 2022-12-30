import React, { useEffect, useState } from 'react'
import ContactService from '../services/ContactService'
import { useNavigate, useParams } from 'react-router-dom'

const ContactsDetail = () => {
    const requiredFields = ['name', 'email', 'phone']

    const [data, setData] = useState({
        name: '',
        nick: '',
        email: '',
        phone: ''
    })

    const [isRequesting, setRequesting] = useState(false)
    const [errors, setErrors] = useState([])

    const { id } = useParams();
    const navigate = useNavigate()

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const saveContact = (e) => {
        e.preventDefault()

        setRequesting(true);
        setErrors([])

        const contact = {
            "name": data.name,
            "nick": data.nick,
            "emails": [{ "address": data.email }],
            "phones": [{ "number": data.phone }]
        }

        const action = id
            ? ContactService.update(id, contact)
            : ContactService.create(contact)

        action
            .then((r) => navigate('/contacts'))
            .catch((err) => {
                console.log(err)
                setRequesting(false)

                if (!err.response.data.violations) return;

                const errContent = []
                err.response.data.violations
                    .map((it) => errContent.push(it.field + " " + it.reason))
                setErrors(errContent)
            })
    }

    const getById = (id) => {
        if (!id) return;

        setRequesting(true)
        ContactService.getById(id)
            .then((r) => {
                const contact = r.data.data;
                setData({
                    name: contact.name,
                    nick: contact.nick,
                    email: contact.emails[0].address,
                    phone: contact.phones[0].number
                })
            })
            .catch((err) => {
                console.log(err);
                setErrors(['error fetching user data'])
            }).finally(() => setRequesting(false))
    }

    const title = () => {
        return id
            ? <h2 className='text-center'>Edit Contact</h2>
            : <h2 className='text-center'>Add Contact</h2>
    }

    const disableSend = () => {
        const entries = Object.entries(data);
        const size = 100 / requiredFields.length

        let sum = 0;
        entries.forEach(([key, val]) => {
            if (requiredFields.includes(key) && val !== '') sum += size
        })
        return sum < 100;
    }

    useEffect(() => getById(id), [id])

    return (
        <div className='container'>
            {title()}

            {errors.length > 0 && <div className="w-75 mx-auto"> {errors.map((e, i) => <div key={`message${i}`} className=" border rounded text-center mb-1 px-1 py-1 text-bg-danger">{e}</div>)} </div>}

            <div className='card'>
                <div className='card-body'>
                    <form>
                        <div className="form-group row mb-2">
                            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type='text' placeholder='place name' name='name' className='form-control' value={data.name} onChange={handleEvent} />
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="nick" className="col-sm-2 col-form-label">Nick</label>
                            <div className="col-sm-10">
                                <input type='text' placeholder='place nick' name='nick' className='form-control' value={data.nick} onChange={handleEvent} />
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input type='text' placeholder='place email' name='email' className='form-control' value={data.email} onChange={handleEvent} />
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="phones" className="col-sm-2 col-form-label">Phone</label>
                            <div className="col-sm-10">
                                <input type='text' placeholder='place phone' name='phone' className='form-control' value={data.phone} onChange={handleEvent} />
                            </div>
                        </div>
                        <div>
                            <button className='btn btn-primary me-1' onClick={(e) => saveContact(e)} disabled={isRequesting || disableSend()}>Save</button>
                            <button className='btn btn-secondary ms-1' onClick={(e) => navigate('/contacts')} disabled={isRequesting}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default ContactsDetail