// pages/api/auth.js
export default function handler(req, res) {
  const auth = req.headers.authorization;

  if (!auth || auth.split(' ')[0] !== 'Basic') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
    return res.status(401).end('Access denied');
  }

  const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

  // Replace 'admin' and 'password' with your actual username and password
  if (username === 'tsa' && password === '123') {
    res.status(200).end('Access granted');
  } else {
    res.status(401).end('Invalid credentials');
  }
}
