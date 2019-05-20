import URLSafeBase64 from 'urlsafe-base64';

function JWTPaylodeDecode(jwtData) {
  if (!jwtData || typeof jwtData !== 'string') {
    throw new Error(`function "decodeJWTPayload" must recieve a url-safe base-64 encoded argument\nRecieved: ${jwtData}`);
  }

  const tempPayload = jwtData.split('.')[1];
  const payloadBuffer = URLSafeBase64.decode(tempPayload);
  const payload = JSON.parse(payloadBuffer.toString());

  return payload;
}

export { JWTPaylodeDecode };
