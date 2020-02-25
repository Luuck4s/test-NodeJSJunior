import React, { useState, useEffect } from "react";

import SubmitButton from "../../components/SubmitButton";
import Input from "./Input";
import { Container, TitleSectionForm, SectionForm, Form } from "./styles";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../services/api";

export default function FormArea() {
  const [dataSelects, setDataSelects] = useState([{}]);
  const [shippingDataSelects, setShippingDataSelects] = useState({
    filtredCities: [],
    filtredStates: [],
    filtredZipCodes: []
  });
  const [billingDataSelects, setBillingDataSelects] = useState({
    filtredCities: [],
    filtredStates: [],
    filtredZipCodes: []
  });
  const [contactInformation, setContactInformation] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    language: "",
    country: ""
  });
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    sameAddress: false
  });
  const [billingAddress, setBillingAddres] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [othersOptions, setOthersOptions] = useState({
    cutOffDevice: false,
    trackers: false,
    identifyDrivers: false,
    trackersPurchase: ""
  });
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);

  useEffect(() => {
    async function getData() {
      const response = await api.get("/");

      setDataSelects(response.data);

      setShippingDataSelects({
        filtredCities: response.data.cities,
        filtredStates: response.data.states,
        filtredZipCodes: response.data.zipCode
      });
      setBillingDataSelects({
        filtredCities: response.data.cities,
        filtredStates: response.data.states,
        filtredZipCodes: response.data.zipCode
      });
    }

    getData();
  }, []);

  const handleVerificationEmail = e => {
    const emailValue = e.target.value;
    setContactInformation({ ...contactInformation, email: emailValue.trim() });

    const verification = emailValue.trim().includes("@");

    if (!verification) {
      e.target.id = "error";
      e.target.title = "Valid email is required!";
      setEmailInvalid(true);
    } else {
      e.target.id = "";
      e.target.title = "Your email.";
      setEmailInvalid(false);
    }
  };

  /**
   * This function filters the states when the country is changed
   * @param {*} e
   */
  const handleChangeCountry = e => {
    const valueCountry = e.target.value;

    const indexValue = dataSelects.countries.find(
      country => country.name === valueCountry
    );

    const statesFilter = dataSelects.states.filter(
      state => state.idCountry === indexValue.id
    );

    setContactInformation({ ...contactInformation, country: valueCountry });

    setShippingDataSelects({
      ...shippingDataSelects,
      filtredStates: statesFilter
    });

    setBillingDataSelects({
      ...billingDataSelects,
      filtredStates: statesFilter
    });
  };

  /**
   * This function filters cities when states are changed
   * @param {*} e
   * @param {*} shippAddress Defines whether to be set in the delivery address or the billing address
   */
  const handleChangeState = (e, shippAddress = true) => {
    const stateValue = e.target.value;

    const indexValue = dataSelects.states.find(
      state => state.name === stateValue
    );

    const citiesFiltred = dataSelects.cities.filter(
      city => city.idState === indexValue.id
    );

    if (shippAddress) {
      setShippingAddress({ ...shippingAddress, state: stateValue });

      setShippingDataSelects({
        ...shippingDataSelects,
        filtredCities: citiesFiltred
      });
    } else {
      setBillingAddres({ ...billingAddress, state: stateValue });

      setBillingDataSelects({
        ...billingDataSelects,
        filtredCities: citiesFiltred
      });
    }
  };

  const handleChangeCity = (e, shippAddress = true) => {
    const cityValue = e.target.value;

    const indexValue = dataSelects.cities.find(city => city.name === cityValue);

    const zipCodesFiltred = dataSelects.zipCode.filter(
      zipCode => zipCode.idCity === indexValue.id
    );

    if (shippAddress) {
      setShippingAddress({ ...shippingAddress, city: cityValue });

      setShippingDataSelects({
        ...shippingDataSelects,
        filtredZipCodes: zipCodesFiltred
      });
    } else {
      setBillingAddres({ ...billingAddress, city: cityValue });

      setBillingDataSelects({
        ...billingDataSelects,
        filtredZipCodes: zipCodesFiltred
      });
    }
  };

  const handleUseSameAddress = e => {
    const checkboxValue = e.target.checked;

    setUseSameAddress(checkboxValue);

    setShippingAddress({ ...shippingAddress, sameAddress: checkboxValue });
  };

  const handleTrackersPurchase = e => {
    const trackersValue = Number(e.target.value);

    if (trackersValue < 0 || trackersValue > 100) {
      e.target.id = "error";
    } else {
      e.target.id = "";
      setOthersOptions({ ...othersOptions, trackersPurchase: trackersValue });
    }
  };

  /**
   * Validate form fields and avoid sending in case of errors
   */
  const handleValidationForm = () => {
    // Validation Contact Information
    let validationInformationContact = [];

    for (const contact in contactInformation) {
      validationInformationContact.push(
        contactInformation[contact].trim() !== ""
      );
    }

    const validContactInformation = validationInformationContact.every(
      information => information
    );

    // Validation Shipping Address
    let validationShippAddress = [];

    for (const address in shippingAddress) {
      if (address !== "addressLine2" && address !== "sameAddress") {
        validationShippAddress.push(shippingAddress[address].trim() !== "");
      }
    }

    const validShippAddress = validationShippAddress.every(
      information => information
    );

    // Validation Billing Address
    let validationBillingAddress = [];
    if (!useSameAddress) {
      for (const address in billingAddress) {
        if (address !== "addressLine2") {
          validationBillingAddress.push(billingAddress[address].trim() !== "");
        }
      }
    }

    const validBillingAddress = validationBillingAddress.every(
      information => information
    );

    // Validation Others Information

    let validationOthersOptions = [];

    for (const option in othersOptions) {
      if (option === "trackersPurchase") {
        validationOthersOptions.push(
          othersOptions[option] >= 0 &&
            othersOptions[option] <= 100 &&
            othersOptions[option] !== ""
        );
      }
    }

    const validOthersOptions = validationOthersOptions.every(
      information => information
    );

    const allValidations = [
      validContactInformation,
      validShippAddress,
      validBillingAddress,
      validOthersOptions
    ];

    const allValid = allValidations.every(information => information);

    if (allValid && !emailInvalid) {
      toast.info("Your order are submitted");
      handleSendOrder();
    } else {
      toast.error("There are errors or unfilled fields!");
    }
  };

  const handleSendOrder = async () => {
    let data = {};

    if (useSameAddress) {
      data = {
        contactInformation: contactInformation,
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress,
        othersOptions: othersOptions
      };
    } else {
      data = {
        contactInformation: contactInformation,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        othersOptions: othersOptions
      };
    }

    const response = await api.post("/order", data);

    if (!response.data.sucess) {
      toast.error(response.data.msg);
    } else {
      toast.success(response.data.msg);
    }
  };

  return (
    <>
      <Container>
        <SectionForm>
          <TitleSectionForm>Contact Information:</TitleSectionForm>
          <Form>
            <Input
              name="firstName"
              placeholder="First Name:"
              width={42}
              maxLength={50}
              value={contactInformation.firstName}
              onChange={e =>
                setContactInformation({
                  ...contactInformation,
                  firstName: e.target.value
                })
              }
            />
            <Input
              name="lastName"
              placeholder="Last Name:"
              value={contactInformation.lastName}
              width={42}
              maxLength={50}
              onChange={e =>
                setContactInformation({
                  ...contactInformation,
                  lastName: e.target.value
                })
              }
            />
            <Input
              name="email"
              placeholder="Email Address:"
              value={contactInformation.email}
              type="email"
              maxLength={100}
              width={42}
              onChange={handleVerificationEmail}
            />
            <Input
              name="phone"
              select
              defaultValue={"DEFAULT"}
              width={42}
              onChange={e =>
                setContactInformation({
                  ...contactInformation,
                  phoneCode: e.target.value
                })
              }
            >
              <option value="DEFAULT">Phone:</option>
              {dataSelects.telephoneCoders && (
                <>
                  {dataSelects.telephoneCoders.map(phone => (
                    <option key={phone.name} value={phone.dial_code}>
                      {phone.dial_code} - {phone.name}
                    </option>
                  ))}
                </>
              )}
            </Input>
            <Input
              name="language"
              select
              defaultValue={"DEFAULT"}
              width={42}
              onChange={e =>
                setContactInformation({
                  ...contactInformation,
                  language: e.target.value
                })
              }
            >
              <option value="DEFAULT">Language:</option>
              {dataSelects.languages && (
                <>
                  {dataSelects.languages.map(lang => (
                    <option key={lang.code} value={lang.language}>
                      {lang.language}
                    </option>
                  ))}
                </>
              )}
            </Input>
            <Input
              name="country"
              select
              defaultValue={"DEFAULT"}
              width={42}
              onChange={handleChangeCountry}
            >
              <option value="DEFAULT">Country:</option>

              {dataSelects.countries && (
                <>
                  {dataSelects.countries.map(country => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </>
              )}
            </Input>
          </Form>
        </SectionForm>
        <SectionForm>
          <TitleSectionForm>Shipping Address:</TitleSectionForm>
          <Form>
            <Input
              name="shipAddresLine1"
              placeholder="Address Line 1:"
              value={shippingAddress.addressLine1}
              width={89}
              maxLength={140}
              onChange={e =>
                setShippingAddress({
                  ...shippingAddress,
                  addressLine1: e.target.value
                })
              }
            />
            <Input
              name="shipAddresLine2"
              placeholder="Address Line 2:"
              value={shippingAddress.addressLine2}
              width={89}
              maxLength={140}
              onChange={e =>
                setShippingAddress({
                  ...shippingAddress,
                  addressLine2: e.target.value
                })
              }
            />
            <Input
              name="shipCity"
              width={27}
              select
              defaultValue={"DEFAULT"}
              onChange={e => handleChangeCity(e, true)}
            >
              <option value="DEFAULT">City:</option>
              {shippingDataSelects.filtredCities.map(city => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Input>
            <Input
              name="shipState"
              width={27}
              select
              defaultValue={"DEFAULT"}
              onChange={e => handleChangeState(e, true)}
            >
              <option value="DEFAULT">State:</option>
              {shippingDataSelects.filtredStates.map(state => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Input>
            <Input
              name="shipZipCode"
              width={27}
              select
              defaultValue={"DEFAULT"}
              onChange={e =>
                setShippingAddress({
                  ...shippingAddress,
                  zipCode: e.target.value
                })
              }
            >
              <option value="DEFAULT">ZIP Code:</option>
              {shippingDataSelects.filtredZipCodes.map(zipCode => (
                <option key={zipCode.id} value={zipCode.code}>
                  {zipCode.code}
                </option>
              ))}
            </Input>
          </Form>
        </SectionForm>
        <SectionForm>
          <TitleSectionForm>Billing Address:</TitleSectionForm>
          <Form>
            <Input
              name="billAddresLine1"
              placeholder="Address Line 1:"
              value={billingAddress.addressLine1}
              width={89}
              disabled={useSameAddress}
              onChange={e =>
                setBillingAddres({
                  ...billingAddress,
                  addressLine1: e.target.value
                })
              }
            />
            <Input
              name="billAddresLine2"
              placeholder="Address Line 2:"
              value={billingAddress.addressLine2}
              width={89}
              disabled={useSameAddress}
              onChange={e =>
                setBillingAddres({
                  ...billingAddress,
                  addressLine2: e.target.value
                })
              }
            />
            <Input
              name="billCity"
              width={27}
              select
              defaultValue={"DEFAULT"}
              disabled={useSameAddress}
              onChange={e => handleChangeCity(e, false)}
            >
              <option value="DEFAULT">City:</option>
              {billingDataSelects.filtredCities.map(city => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Input>
            <Input
              name="billState"
              width={27}
              select
              defaultValue={"DEFAULT"}
              disabled={useSameAddress}
              onChange={e => handleChangeState(e, false)}
            >
              <option value="DEFAULT">State:</option>
              {billingDataSelects.filtredStates.map(state => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Input>
            <Input
              name="billZipCode"
              width={27}
              select
              defaultValue={"DEFAULT"}
              disabled={useSameAddress}
              onChange={e =>
                setBillingAddres({
                  ...billingAddress,
                  zipCode: e.target.value
                })
              }
            >
              <option value="DEFAULT">ZIP Code:</option>
              {billingDataSelects.filtredZipCodes.map(zipCode => (
                <option key={zipCode.id} value={zipCode.code}>
                  {zipCode.code}
                </option>
              ))}
            </Input>
            <Input
              name="useSameAddress"
              type="checkbox"
              checkbox
              label="Use shipping addres same as billing address."
              color="primary"
              value="default"
              onChange={handleUseSameAddress}
            />
          </Form>
        </SectionForm>
        <SectionForm>
          <TitleSectionForm>Check the boxes below:</TitleSectionForm>
          <Form>
            <Input
              name="cutOffDevice"
              type="checkbox"
              checkbox
              label="Does any vehicle need to be equiped with a fuel cut off device ?"
              color="primary"
              onChange={e =>
                setOthersOptions({
                  ...othersOptions,
                  cutOffDevice: e.target.checked
                })
              }
            />
            <Input
              name="trackers"
              type="checkbox"
              checkbox
              label="Will any trackers be installed on a bike truck or machinery ?"
              color="primary"
              onChange={e =>
                setOthersOptions({
                  ...othersOptions,
                  trackers: e.target.checked
                })
              }
            />
            <Input
              name="identifyDrivers"
              type="checkbox"
              checkbox
              label="Will you need to identify the fleet drivers ?"
              color="primary"
              onChange={e =>
                setOthersOptions({
                  ...othersOptions,
                  identifyDrivers: e.target.checked
                })
              }
            />
            <Input
              name="trackersPurchase"
              placeholder="How many trackers would you like to purchase ?"
              width={89}
              type="number"
              min={0}
              max={100}
              color="primary"
              onChange={handleTrackersPurchase}
            />
          </Form>
        </SectionForm>
      </Container>
      <ToastContainer />
      <SubmitButton text={"Order Now"} onClick={handleValidationForm} />
    </>
  );
}
