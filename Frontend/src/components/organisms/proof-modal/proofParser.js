const getSingleByteFromHex = (hexString) => {
  // Remove the "0x" prefix if it exists
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }
  // Convert the hex string to a number
  return parseInt(hexString, 16);
};

const concatenateBytesToLong = (hexStrings) => {
  // Convert each hex string to bytes
  const bytes = hexStrings.map((hexString) => getSingleByteFromHex(hexString));

  // Calculate the number of bytes based on the array length
  const numBytes = bytes.length;

  // Combine the bytes to form an integer
  let result = 0;
  for (let i = 0; i < numBytes; i++) {
    result = (result << 8) | bytes[i];
  }

  return result;
};

const concatenateBytesToString = (hexStrings) => {
  const bytes = hexStrings.map((hexString) => getSingleByteFromHex(hexString));

  // Remove trailing zero bytes
  let trimmedBytes = [];
  for (let i = bytes.length - 1; i >= 0; i--) {
    if (bytes[i] !== 0) {
      trimmedBytes = bytes.slice(0, i + 1);
      break;
    }
  }

  // Convert trimmed bytes to characters and concatenate them into a string
  const characters = trimmedBytes
    .map((byte) => String.fromCharCode(byte))
    .join("");

  return characters;
};

const extractProof = (proof) => {
  const inputs = proof.inputs;

  // Extracting data according to comments
  const threshold = concatenateBytesToLong(inputs.slice(0, 2));
  const result = getSingleByteFromHex(inputs[2]) !== 0;
  const timestamp = concatenateBytesToLong(inputs.slice(3, 11));
  const clientFullName = concatenateBytesToString(inputs.slice(11));

  return {
    threshold,
    result,
    timestamp,
    clientFullName,
  };
};

export default extractProof;
