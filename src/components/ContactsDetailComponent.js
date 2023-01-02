import React, { useEffect, useState } from "react";
import ContactService from "../services/ContactService";
import { useNavigate, useParams } from "react-router-dom";
import Input from "./InputComponent";
import { ErrorComponent } from "./ErrorMessageComponent";

const REQUIRED_FIELDS = ["name", "email", "phone"];

const ContactsDetail = () => {
  const [data, setData] = useState({
    name: "",
    nick: "",
    phone: "",
    email: "",
  });

  const [isCancelDisabled, setCancelDisabled] = useState(false);
  const [isSaveDisabled, setSaveDisabled] = useState(false);
  const [errors, setErrors] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleEvent = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const setRequesting = (isRequesting) => {
    setSaveDisabled(isRequesting);
    setCancelDisabled(isRequesting);
  };

  const saveContact = (e) => {
    e.preventDefault();

    setRequesting(true);
    setErrors([]);

    const contact = {
      name: data.name,
      nick: data.nick,
      emails: [{ address: data.email }],
      phones: [{ number: data.phone }],
    };

    const action = id
      ? ContactService.update(id, contact)
      : ContactService.create(contact);

    action
      .then((r) => navigate("/contacts"))
      .catch((err) => {
        console.log(err);
        setRequesting(false);

        if (!err.response.data.violations) return;

        const errContent = [];
        err.response.data.violations.map((it) =>
          errContent.push(it.field + " " + it.reason)
        );
        console.log(errContent);
        setErrors(errContent);
      });
  };



  const changeSaveDisabledState = () => {
    console.log("calling disabled save");
    if (isCancelDisabled) return true;

    const entries = Object.entries(data);
    const size = 100 / REQUIRED_FIELDS.length;

    let sum = 0;
    entries.forEach(([key, val]) => {
      if (REQUIRED_FIELDS.includes(key) && val !== "") sum += size;
    });

    setSaveDisabled(sum < 100);
  };

  const navigateToContact = () => {
    navigate("/contacts");
  };

  useEffect(() => {
    const getById = () => {
      if (!id) return;
  
      setRequesting(true);
      ContactService.getById(id)
        .then((r) => {
          const contact = r.data.data;
          setData({
            name: contact.name,
            nick: contact.nick,
            email: contact.emails[0].address,
            phone: contact.phones[0].number,
          });
        })
        .catch((err) => {
          console.log(err);
          setErrors(["error fetching user data"]);
        })
        .finally(() => setRequesting(false));
    };
    getById();
  }, [id]);
  
  useEffect(() => {
    const interval = setInterval(changeSaveDisabledState, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="container">
      <h2 className="text-center">{id ? "Edit " : "Add"} Contact</h2>
      {errors.length > 0 && <ErrorComponent errors={errors} />}
      <div className="card">
        <div className="card-body">
          <form>
            <Input
              key="name"
              name="name"
              label="Name"
              value={data.name}
              required={true}
              handle={handleEvent}
            />
            <Input
              key="nick"
              name="nick"
              label="Nick"
              value={data.nick}
              handle={handleEvent}
            />
            <Input
              key="email"
              name="email"
              label="E-mail"
              value={data.email}
              required={true}
              handle={handleEvent}
            />
            <Input
              key="phone"
              name="phone"
              label="Phone"
              value={data.phone}
              required={true}
              handle={handleEvent}
            />

            <div>
              <button
                className="btn btn-primary me-1"
                onClick={saveContact}
                disabled={isSaveDisabled}
              >
                Save
              </button>
              <button
                className="btn btn-secondary ms-1"
                onClick={navigateToContact}
                disabled={isCancelDisabled}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactsDetail;
