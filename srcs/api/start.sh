#!/bin/bash
sleep 2
npx drizzle-kit push --force
exec npm run dev