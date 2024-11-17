#!/bin/bash

HANDLERS=(
    "email_price"
)

for name in ${HANDLERS[@]}; do
    npm run serverless deploy function -- --function $name
done

echo "Deployment completed"