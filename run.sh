#!/bin/bash

# Restart loop to go
while true; do
    node main.js
    EXIT_CODE=$?

    # 42 code exit-> for stack saver restart
    if [ $EXIT_CODE -eq 42 ]; then
        continue
    fi

    # 0 code exit -> for total exit
    break
done
