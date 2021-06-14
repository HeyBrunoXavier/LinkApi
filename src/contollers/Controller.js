const repository = require("../repository/ModelRepository");
const { DealsController } = require('pipedrive');
const XML = require("../utils/xmlConvert");
const AXIOS = require("axios");
require('dotenv').config()
module.exports = {
  getAll: async (request, response) => {
	try {
		v_response = [];
		let o_data = await repository.get();
		o_data.forEach(element => {
			let o_response = {
				"id": element.id,
				"costumer": element.customer,
				"item": element.item,
				"created_at": element.created_at
			}
			v_response.push(o_response);
		});
		return response.json(v_response).status(200).end();
	}
	catch (error) {
		console.log(error);
		return response.status(400).end();
	}
  },
  insert: async (request, response) => {
	try{
		let o_response ;
		let { st_status = 'won'} = request.query;
		let o_deal = await DealsController.getAllDeals({status: st_status});
		if(!o_deal)
			return response.status(400).end('ERR_INVALID_STATUS');
		let v_array = [];
		o_deal.data.forEach(async st_data => {
			let o_data = {
				"name": st_data.owner_name,
				"code": st_data.id,
				"title": st_data.title,
				"unitValue": st_data.value
			};
			let dataXmlConverted = XML.ConvertXML(o_data);
			v_array.push(o_data);
			let st_url = `${process.env.INTEGRATION_BLING_BASE_URL}/pedido/json/?apikey=${process.env.INTEGRATION_BLING_TOKEN}&xml=${dataXmlConverted}`;
			await AXIOS.post(st_url);
			let o_model = {
				"id_order": st_data.id,
				"customer": {
				  "company": st_data.org_name,
				  "contact_person": st_data.person_name,
				},
				"item": {
				  "code": st_data.id,
				  "description": st_data.title,
				  "currency": st_data.weighted_value_currency,
				  "total_value": st_data.weighted_value,
				},
			}
			o_response = await repository.create(o_model);
		});
		return response.json(o_response).status(204).end();
	}
	catch (error) {
		console.log(error);
		return response.status(400).end();
	}
  },
  getCashflow: async (request, response) => {
	try {
		let o_data = await repository.getCashflow();
		let re_total = o_data.reduce((total,value)=> total+value.total,0);
		let o_response = {
			"orders": o_data,
			"total": re_total
		}
		return response.json(o_response).status(200).end();
	}
	catch (error) {
		console.log(error);
		return response.status(400).end();
	}
  }
}
