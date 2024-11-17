#!/usr/bin/env bash

deno -A ../util/cron.js
echo "Thank you, Cronjob is running in the background!"
echo "Will collect data objects and serve to the main page"