import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
} from "@coreui/react";

export default function NewBooking() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");
  const [oneWay, setOneWay] = useState({
    date: "",
    time: "",
    passengers: "",
    status: "",
    pickup: "",
    dropoff: "",
  });
  const [returnTrip, setReturnTrip] = useState({
    onwardDate: "",
    time: "",
    passengers: "",
    status: "",
    pickup: "",
    dropoff: "",
  });

  const handleSave = () => {
    const existingBookings =
      JSON.parse(localStorage.getItem("bookings") || "[]");

    // Flatten booking object so all fields are stored
    const newBooking =
      tripType === "oneway"
        ? {
            id: Date.now(), // unique ID
            tripType,
            date: oneWay.date,
            time: oneWay.time,
            passengers: oneWay.passengers,
            status: oneWay.status,
            pickup: oneWay.pickup,
            dropoff: oneWay.dropoff,
          }
        : {
            id: Date.now(),
            tripType,
            onwardDate: returnTrip.onwardDate,
            time: returnTrip.time,
            passengers: returnTrip.passengers,
            status: returnTrip.status,
            pickup: returnTrip.pickup,
            dropoff: returnTrip.dropoff,
          };

    localStorage.setItem(
      "bookings",
      JSON.stringify([...existingBookings, newBooking])
    );

    navigate("/logistics/bookings");
  };

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader>
          <h5>Booking Details</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="tripType">Select Trip Type:</CFormLabel>
              <select
                id="tripType"
                className="form-select"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
              >
                <option value="oneway">One way transfer</option>
                <option value="return">Return transfer</option>
              </select>
            </CCol>
          </CRow>

          {/* One Way Transfer Form */}
          {tripType === "oneway" && (
            <CCard className="mb-3">
              <CCardBody>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Date:</CFormLabel>
                    <CFormInput
                      type="date"
                      value={oneWay.date}
                      onChange={(e) =>
                        setOneWay({ ...oneWay, date: e.target.value })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Pick-up Time:</CFormLabel>
                    <CFormInput
                      type="time"
                      value={oneWay.time}
                      onChange={(e) =>
                        setOneWay({ ...oneWay, time: e.target.value })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>No. of Passengers:</CFormLabel>
                    <CFormInput
                      type="number"
                      value={oneWay.passengers}
                      onChange={(e) =>
                        setOneWay({ ...oneWay, passengers: e.target.value })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Status:</CFormLabel>
                    <select
                      id="statusOneWay"
                      className="form-select"
                      value={oneWay.status}
                      onChange={(e) =>
                        setOneWay({ ...oneWay, status: e.target.value })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Change Requested">
                        Change Requested
                      </option>
                      <option value="Driver Updated">Driver Updated</option>
                    </select>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Pick-up Location:</CFormLabel>
                    <CFormInput
                      value={oneWay.pickup}
                      onChange={(e) =>
                        setOneWay({ ...oneWay, pickup: e.target.value })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Drop-off Location:</CFormLabel>
                    <CFormInput
                      value={oneWay.dropoff}
                      onChange={(e) =>
                        setOneWay({ ...oneWay, dropoff: e.target.value })
                      }
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          )}

          {/* Return Transfer Form */}
          {tripType === "return" && (
            <CCard className="mb-3">
              <CCardBody>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Date (Onward):</CFormLabel>
                    <CFormInput
                      type="date"
                      value={returnTrip.onwardDate}
                      onChange={(e) =>
                        setReturnTrip({
                          ...returnTrip,
                          onwardDate: e.target.value,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Pick-up Time:</CFormLabel>
                    <CFormInput
                      type="time"
                      value={returnTrip.time}
                      onChange={(e) =>
                        setReturnTrip({
                          ...returnTrip,
                          time: e.target.value,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>No. of Passengers:</CFormLabel>
                    <CFormInput
                      type="number"
                      value={returnTrip.passengers}
                      onChange={(e) =>
                        setReturnTrip({
                          ...returnTrip,
                          passengers: e.target.value,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Status:</CFormLabel>
                    <select
                      id="statusReturn"
                      className="form-select"
                      value={returnTrip.status}
                      onChange={(e) =>
                        setReturnTrip({
                          ...returnTrip,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Change Requested">
                        Change Requested
                      </option>
                      <option value="Driver Updated">Driver Updated</option>
                    </select>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Pick-up Location:</CFormLabel>
                    <CFormInput
                      value={returnTrip.pickup}
                      onChange={(e) =>
                        setReturnTrip({
                          ...returnTrip,
                          pickup: e.target.value,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Drop-off Location:</CFormLabel>
                    <CFormInput
                      value={returnTrip.dropoff}
                      onChange={(e) =>
                        setReturnTrip({
                          ...returnTrip,
                          dropoff: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          )}

          {/* Save Button */}
          <div className="text-center mt-3">
            <CButton color="success" size="lg" onClick={handleSave}>
              Save Booking
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}
