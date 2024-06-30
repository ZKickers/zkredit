// const { exec } = require('child_process');

// // Command to run
// let command = 'cat ./proofs/65fba9d2e330f4dff548c5b7/input.json | zokrates compute-witness --abi --stdin  > ./proofs/65fba9d2e330f4dff548c5b7/o.txt';
// // Backend/app/proofs/65fabcbff542b1ddab6b0b05

// // Execute the command
// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`stderr: ${stderr}`);
//     return;
//   }
//   console.log(`stdout:\n${stdout}`);
// });

// function convertToByteArray(number) {
//     // Check if the number is within the threshold
//     if (number >= 0 && number <= 65535) { // 16-bit threshold
//         // Extract the most significant and least significant parts
//         const mostSignificantPart = (number >> 8) & 0xFF;
//         const leastSignificantPart = number & 0xFF;

//         // Return the array
//         return [mostSignificantPart, leastSignificantPart];
//     } else {
//         throw new Error('Number is not within the threshold (0-65535)');
//     }
// }

// // Example usage
// const number = 12345; // Example number
// const byteArray = convertToByteArray(number);
// console.log(byteArray); // Output: [48, 57]


// const fs = require('fs');

// // Your array
// const myArray = [1, 2, 4];

// // Create a directory (if it doesn't exist)
// const directoryPath = '../123';
// if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath);
// }

// // Write your array to a JSON file
// const filePath = '../123/input.json';
// fs.writeFile(filePath, JSON.stringify(myArray, null, 2), (err) => {
//     if (err) {
//         console.error('Error writing JSON file:', err);
//     } else {
//         console.log('JSON file has been saved successfully.');
//     }
// });
