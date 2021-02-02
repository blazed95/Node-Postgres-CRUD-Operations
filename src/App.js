import React, { useState } from 'react';
import styled from "styled-components";
import { validationLatitudeLongitude } from "validation-latitude-longitude";
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'

function App() {

  const [inputs, setInputs] = useState({
    longitude: undefined,
    latitude: undefined,
    serialNumber: undefined,
    name: undefined,
  });
  const [error, setError] = useState("");


  //console.log(inputs)
  const handleInputChange = (event) => {


    const form = event.target;
    setInputs(inputs => ({ ...inputs, [form.name]: form.value }));
  }

  const handleSumbit = async (event) => {
    event.preventDefault()
    if (!validationLatitudeLongitude.latLong(inputs.latitude, inputs.longitude)) {
      setError("Please put a correct latitude and longitude")
      return

    };
    //Post Request
    setError("")
    try {

      const res = await fetch("http://localhost:4000/devices", {
        method: "POST",
        body: JSON.stringify({
          name: inputs.name,
          longitude: inputs.longitude,
          latitude: inputs.latitude,
          serialNumber: inputs.serialNumber.toUpperCase()
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        },
      })
      let data = await res.json()
      if (data.type === "success") {
        alert("SUCCES - DEVICE ON POSTGRES DATABASE")
        window.location.reload(false);
      }
      else {
        alert("FAIL-SOMETHING WENT WRONG")
      }
    }
    catch (e) {
      console.log(e)
      alert("Error")
    }
  }

  return (
    <div className="App">
      <FormContainer>
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <div className="w-100" style={{ maxWidth: "600px" }}>
            <Card className="form-container">
              <Card.Body>
                <h2 className="text-center mb-4">Enter Device Information</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSumbit}>
                  <Form.Group id="name">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Your Name" onChange={handleInputChange} value={inputs.name} required />
                  </Form.Group>
                  <Form.Group id="latitude">
                    <Form.Label>Latitude:</Form.Label>
                    <Form.Control type="text" name="latitude" placeholder="Example: 40.6892" onChange={handleInputChange} value={inputs.latitude} required />
                  </Form.Group>
                  <Form.Group id="longitude">
                    <Form.Label>Longitude:</Form.Label>
                    <Form.Control type="text" name="longitude" placeholder="Example: 52.1283" onChange={handleInputChange} value={inputs.longitude} required />
                  </Form.Group>
                  <Form.Group id="serialNumber">
                    <Form.Label>SerialNumber:</Form.Label>
                    <Form.Control type="text" style={{ textTransform: "uppercase" }} name="serialNumber" placeholder="Example: XYZYTUOPFS" onChange={handleInputChange} value={inputs.serialNumber} required />
                  </Form.Group>
                  <Button className="button w-100" variant="success" type="submit">
                    Sumbit
                </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </FormContainer>
    </div>
  );
}

export default App;
const FormContainer = styled.div`
width:100vw;
height: 100vh;
background-color: #f6f7f8;
margin:0;
padding:0;
.form-container{
  -webkit-box-shadow: 7px 7px 14px -5px #000000; 
  box-shadow: 7px 7px 14px -5px #000000;
}
.button{
background-color: #09bc8a;
}
`