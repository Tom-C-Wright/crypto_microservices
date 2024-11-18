#!/bin/bash

HANDLERS=(
    "write_event_log"
)

for name in ${HANDLERS[@]}; do
    npm run serverless deploy function -- --function $name
done

echo "Deployment completed"