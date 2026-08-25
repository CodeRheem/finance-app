#!/bin/bash
SECRET="sk_test_ba52be618612ab93c06cf73a886d9c31006e07b7"
BODY='{"event":"charge.success","data":{"reference":"test123","amount":50000}}'
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha512 -hmac "$SECRET" | sed 's/^.* //')

curl -X POST http://localhost:3000/payments/paystack/webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIGNATURE" \
  -d "$BODY"