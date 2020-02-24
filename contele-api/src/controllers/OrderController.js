const db = require("../models/postgres");

const telephoneCoders = require("../utils/telephone_coders.json");
const languages = require("../utils/languages.json");
const countries = require("../utils/countries.json");
const states = require("../utils/states.json");
const cities = require("../utils/cities.json");
const zipCode = require("../utils/zip_codes.json");

module.exports = {
  /**
   * @URL /
   * @Method GET
   * @sucess {
   *  telephoneCoders:Array[object],
   *  languages:Array[object],
   *  states:Array[object],
   *  cities:Array[object],
   *  zipCode:Array[object]
   * }
   *
   */
  async index(_req, res) {
    const result = {
      telephoneCoders,
      languages,
      countries,
      states,
      cities,
      zipCode
    };

    res.json(result);
  },

  /**
   * @URL /order
   * @Method POST
   * @param {*} req
   * body:{
   *      contactInformation: object,
   *      shippingAddress: object,
   *      billingAddress: object,
   *      othersOptions: object
   * }
   * @param {*} res
   *
   * @sucess
   * {msg: "Your order has been registered", sucess: true}
   *
   * @error
   * {msg: "Error", sucess: false}
   */
  async order(req, res) {
    const {
      contactInformation: client,
      shippingAddress: shippAddress,
      billingAddress: billAddress,
      othersOptions: others
    } = req.body;

    let emailExisting = false,
      idClient,
      error = false;

    const verifyEmail = async () => {
      const queryVerify = `SELECT * FROM "contele_client" WHERE "email"=$1`;

      const queryVerifyValues = [client.email];

      await db.query(queryVerify, queryVerifyValues).then(restult => {
        if (restult.rows.length == 0) {
          insertClient();
        } else {
          emailExisting = true;
        }
      });
    };

    const insertClient = async () => {
      const queryClient = `INSERT INTO "contele_client" ("first_name","last_name","email","telephone_code","language","country") 
      VALUES($1,$2,$3,$4,$5,$6)`;

      const queryClientValues = [
        client.firstName,
        client.lastName,
        client.email,
        client.phoneCode,
        client.language,
        client.country
      ];

      await db
        .query(queryClient, queryClientValues)
        .then(searchIdClient)
        .catch(err => (error = err));
    };

    const searchIdClient = async () => {
      const query = `SELECT Id FROM "contele_client" WHERE "email"=$1`;

      const values = [client.email];

      await db
        .query(query, values)
        .then(result => {
          const [id] = result.rows;
          idClient = id.id;
        })
        .catch(err => (error = err));

      insertShippAddress();
    };

    const insertShippAddress = async () => {
      const queryClientAddress = `INSERT into "contele_client_shipp_address" ("id_client","address","city","state","zip_code","same_bill_address") 
      VALUES($1,$2,$3,$4,$5,$6);
      `;

      const address = `${shippAddress.addressLine1} ${shippAddress.addressLine2}`;

      const valuesQueryClientAddress = [
        idClient,
        address,
        shippAddress.city,
        shippAddress.state,
        shippAddress.zipCode,
        shippAddress.sameAddress
      ];

      await db
        .query(queryClientAddress, valuesQueryClientAddress)
        .then(insertBillAddress)
        .catch(err => (error = err));
    };

    const insertBillAddress = async () => {
      const queryClientBill = `INSERT into "contele_client_bill_address" ("id_client","address","city","state","zip_code") 
      VALUES($1,$2,$3,$4,$5);
      `;

      const address = `${billAddress.addressLine1} ${billAddress.addressLine2}`;

      const valuesQueryClientBill = [
        idClient,
        address,
        billAddress.city,
        billAddress.state,
        billAddress.zipCode
      ];

      await db
        .query(queryClientBill, valuesQueryClientBill)
        .then(insertOtherOptions)
        .catch(err => console.log(err));
    };

    const insertOtherOptions = async () => {
      const queryClientOthers = `INSERT into "contele_client_others" ("id_client","cut_fuel_device","trackers","identify_fleet","quantity_trackers") 
      VALUES($1,$2,$3,$4,$5);
      `;

      const valuesQueryClientOthers = [
        idClient,
        others.cutOffDevice,
        others.trackers,
        others.identifyDrivers,
        others.trackersPurchase
      ];

      await db
        .query(queryClientOthers, valuesQueryClientOthers)
        .catch(err => (error = err));
    };

    await verifyEmail();

    if (emailExisting) {
      res.json({ msg: "Email already exists", sucess: false });
    } else if (error) {
      res.json({ msg: "An error ocorred", sucess: false, error: true });
    } else {
      res.json({ msg: "Your order has been registered", sucess: true });
    }
  },

  async orders(_req, res) {
    const query = `SELECT "cc"."id" as "Id",
    "cc"."first_name" as "FirstName",
    "cc"."last_name" as "LastName",
    "cc"."email" as "Email", 
    "cc"."telephone_code" as "TelephoneCode",
    "cc"."language" as "Language",
    "cc"."country" as "Country",
    "csp"."address" as "ShippingAddress",
    "csp"."city" as "ShippingCity",
    "csp"."state" as "ShippingState",
    "csp"."zip_code" as "ShippingZipCode",
    "csp"."same_bill_address" as "SameBillAddress",
    "cba"."address" as "BillingAddress",
    "cba"."city" as "BillingCity",
    "cba"."state" as "BillingState",
    "cba"."zip_code" as "BillingZipCode",
    "cco"."cut_fuel_device" as "CutFuelDevice",
    "cco"."trackers" as "InstalleTrackersTruckOrMachinery",
    "cco"."identify_fleet" as "IndentifyFleetDrivers",
    "cco"."quantity_trackers" as "QuantityTrackers"
    FROM  "contele_client" as "cc", 
    "contele_client_shipp_address" as "csp", 
    "contele_client_bill_address" as "cba", 
    "contele_client_others" as "cco" 
      WHERE "cc"."id" = "csp"."id_client" 
        AND "cc"."id" = "cba"."id_client"
          AND "cc"."id" = "cco"."id_client"`;

    await db.query(query).then(result => {
      res.json({ Orders: result.rows });
    });
  }
};
