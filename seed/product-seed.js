const axios = require("axios");



const levelOne = [

	"Agriculture & Food",

	"Apparel,Textiles & Accessories",

	"Auto & Transportation",

	"Bags, Shoes & Accessories",

	"Electronics",

	"Electrical Equipment, Components & Telecom",

	"Gifts, Sports & Toys",

	"Health & Beauty",

	"Home, Lights & Construction",

	"Machinery, Industrial Parts & Tools",

	"Metallurgy, Chemicals, Rubber & Plastics",

	"Packaging, Advertising & Office"

];



const levelTwo = {

	"Agriculture & Food": ["Agriculture", "Food & Beverage"],

	"Apparel,Textiles & Accessories": [

		"Apparel",

		"Textile & Leather Product",

		"Fashion Accessories",

		"Timepieces, Jewelry, Eyewear"

	],

	"Auto & Transportation": ["Vehicles & Accessories"],

	"Bags, Shoes & Accessories": ["Luggage, Bags & Cases", "Shoes & Accessories"],

	Electronics: [

		"Consumer Electronic",

		"Home Appliance",

		"Security & Protection"

	],

	"Electrical Equipment, Components & Telecom": [

		"Electrical Equipment & Supplies",

		"Telecommunication"

	],

	"Gifts, Sports & Toys": [

		"Sports & Entertainment",

		"Gifts & Crafts",

		"Toys & Hobbies"

	],

	"Health & Beauty": ["Health & Medical", "Beauty & Personal Care"],

	"Home, Lights & Construction": [

		"Construction & Real Estate",

		"Home & Garden",

		"Lights & Lighting",

		"Furniture"

	],

	"Machinery, Industrial Parts & Tools": [

		"Machinery",

		"Fabrication Services",

		"Tools & Hardware"

	],

	"Metallurgy, Chemicals, Rubber & Plastics": [

		"Minerals & Metallurgy",

		"Chemicals",

		"Rubber & Plastics",

		"Energy"

	],

	"Packaging, Advertising & Office": [

		"Packaging & Printing",

		"Office & School Supplies",

		"Service Equipment"

	]

};



const url = "http://127.0.0.1:4044/api/v1/category";



function insert(levelOne, levelTwo) {

	levelOne.forEach(data => {

		// format data

		let postData = {

			name: data,

			type: "business-category"

		};

		//post data

		axios

			.post(url, postData)

			.then(res => {

				console.log("Level-one : ", res.data.newCategory._id);

				// insert level two

				levelTwo[res.data.newCategory.name].forEach(element => {

					axios

						.post(`${url}/${res.data.newCategory._id}`, {

							name: element

						})

						.then(response => {

							console.log(

								"Level-two : ",

								response.data.newSubCategory._id,

								response.data.newSubCategory.name

							);

						})

						.catch(err => {

							console.log("Level-two ERROR: ", err.message);

						});

				});

			})

			.catch(err => {

				console.log("Level-one ERROR: ", err);

			});

	});

}

insert(levelOne, levelTwo);
