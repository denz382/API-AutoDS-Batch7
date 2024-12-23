const { test, expect } = require("@playwright/test");
const { Ajv } = require ("ajv");
const ajv = new Ajv();
const { path } = require ("path");
const { fs } = require ("fs");


test(`Latihan GET`, async ({ request }) => {
    
    const response = await request.get('https://reqres.in/api/users/2');
    expect (response.status()).toBe(200)

    const responseData = await response.json();

    expect (responseData.data.id).toBe(2);
    expect (responseData.data.email).toBe("janet.weaver@reqres.in")
    expect (responseData.data.first_name).toBe("Janet")
    expect (responseData.data.last_name).toBe("Weaver")
    expect (responseData.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg")

const valid = ajv.validate (require("./jsonschema/get-scheme.json"), responseData);
   
   if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
   };
        expect(valid).toBe(true);
});
    
test(`Latihan POST`, async ({ request }) => {
    const bodyData = {
   "name": "morpheus",
    "job": "leader",
    "id" : "619",
    "createdAt" : "2024-12-23T06:51:12.296Z"
    };
        
    const headerData= {
    Accept: 'application/json'
    }
        
    const response = await request.post('https://reqres.in/api/users', {
    headers: headerData,
    body : bodyData
    });
   
    expect (response.status()).toBe(201);
    const responseData = await response.json();
    
    expect (bodyData.name).toBe("morpheus")
    expect (bodyData.job).toBe("leader")
    expect (bodyData.id).toBe("619")
    expect (bodyData.createdAt).toBe("2024-12-23T06:51:12.296Z")
    
    const valid = ajv.compile (require("./jsonschema/post-scheme.json"), responseData);
    const isValid = valid (responseData); 
  
    if (!isValid) {
        console.error('Schema validation errors:', valid.errors);
      }
      expect(isValid).toBe(false);
    });
   
   
test(`Latihan DELETE`, async ({ request }) => {
        
    const url = 'https://reqres.in/api/users/2';
    const response = await request.delete(url);
    
    expect(response.status()).toBe(204);
    const responseBody = await response.text();
    expect(responseBody).toBe('');  
 
});

test('Latihan PUT', async ({ request }) => {
    const path = require('path');
    const fs = require('fs'); 
    
    const response = await request.put('https://reqres.in/api/users/2', {
        data: {
        id: 1,
        title: 'Title Revision',
        body: 'Penambahan',
        userId: 1,
        }
       
    });
    const responseBody = await response.json();
    const schemaPath = path.resolve(__dirname, './put-scheme.json');
    if (fs.existsSync(schemaPath)) {
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  const validate = ajv.compile(schema);

  const isValid = validate(responseBody);

  expect(isValid).toBe(true);

 
  expect(response.status()).toBe(200); 

  
  expect(responseBody).toHaveProperty('id', 1);
  expect(responseBody).toHaveProperty('title', 'Title Revision');
  expect(responseBody).toHaveProperty('body', 'Penambahan');
  expect(responseBody).toHaveProperty('userId', 1);
    };
  console.log(await response.text());

});
    
    
   
