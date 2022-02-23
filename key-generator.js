const fs = require('fs');
const { generateKeyPairSync } = require('crypto');

const result = generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'sec1',
    format: 'pem',
  },
});

for (const key in result) {
  const fileName = `/${key.split('K')[0]}.key`;
  fs.writeFile(__dirname + fileName, result[key], err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${fileName} has been created`);
    }
  });
}
