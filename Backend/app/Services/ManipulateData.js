function ManipulateData(apiResponse) {
    // Extract relevant fields from the API response
    const { fullname, address, birthdate, ssn, score, signature } = apiResponse;
  
    const clientData = {
        name: [...fullname].map(char => char.charCodeAt(0).toString()),
        address: [...address].map(char => char.charCodeAt(0).toString()),
        birthdate: [...birthdate].map(char => char.charCodeAt(0).toString()),
        ssn: [...ssn].map(char => char.charCodeAt(0).toString()),
        score:  [score >> 8, score & 0xFF],
        signature: {
          R: signature.R,
          S: signature.S
        }
      };
    
      return clientData;
  }
  
  // Export the function to be used in other files
  module.exports = ManipulateData;