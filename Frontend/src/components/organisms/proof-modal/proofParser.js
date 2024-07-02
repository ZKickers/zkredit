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

  // Combine the bytes to form a BigInt
  var result = BigInt(0);
  for (let i = 0; i < bytes.length; i++) {
    result = (result << BigInt(8)) | BigInt(bytes[i]);
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

<<<<<<< HEAD

=======
>>>>>>> 3a2698de602a527b63d9a62834725b03e6714b18
  return {
    threshold,
    result,
    timestamp,
    clientFullName,
  };
};

export default extractProof;
