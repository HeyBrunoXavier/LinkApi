const db = require("../models/Model.js");

module.exports = class OrderModel {
	static async get() {
    try {
      const o_response = await db.find({});
      return o_response;
    } catch (error) {
      return error;
    }

  }

	static async create(model) {
    try {
      let o_response = await db.create(model);
      return o_response
    } catch (error) {
      return error;
    }
  }
  static async getCashflow() {
    try {
      let v_response = [];
      const o_response = await db.find({});
      o_response.forEach(element => {
        let o_data = {
          "code": element.item.code,
          "currency": element.item.currency,
          "total": element.item.total_value,
          "created": element.created_at
        }
        v_response.push(o_data);
      });
      return v_response;
    } catch (error) {
      return error;
    }

  }
}
