# Hindu Temple of St Louis Donation Platform
The Hindu Temple of St.Louis Education and Cultural Center vision is to enhance the religious experience for all in our diverse congregational community. The temple will enhance and expand programs in education, youth & adult activities and services to the community. Our Education & Cultural Center is a volunteer-driven, community-supported, non-profit organization under Hindu Temple of St.Louis. 

## Installation
```
 npm i
 npm i nodemon -g
```

Technologies: React(CRA), Node.js, Express, Firebase
API's: stripe, 

## Internal Flow
	suggested amount
		one time donation
			1. Create a token (encrypt credit card information)
			2. Store it on the customer (create a customer record using the generated token)
			3. Charge the customer with the amount, customer id, token
			4. Store all this data in Firebase
		reccuring donation
			1. "
			2. "
			3. As per the selected amount, using one of the already created plans, link the customer to this plan to create a subscribtion. 
			4. "
	
	custom amount
		one time donation
			1. "
			2. "
			3. "
			4. "
		reccuring donation
			1. "
			2. "
			3. create a new plan based on the new amount with a unique ID everytime. 
			4. Link the customer to this plan to create a subscribtion
			5. Store all this data in firebase
