import {  SchemaObject } from "@loopback/rest"

export const CredentialSchema:SchemaObject={
    type:'object',
    required:["username","password"],
    properties:{
        username:{
            type: 'string',
            format:'email',
        },
        password:{
            type: "string",
            minLength:8,
        },

    },
}

export const CredentialsRequestBody={
    description:'The input of login function',
    required:true,
    content:{
        'application/json':{schema:CredentialSchema}
    }
  
    
}