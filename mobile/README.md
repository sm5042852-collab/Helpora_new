# Helpora Mobile

iPhone and Android app built with Expo and React Native.

## Run on a phone

1. Install Node.js and Expo Go.
2. In the `mobile` folder run `npm install`.
3. Run `npx expo start` and scan the QR code with Expo Go.
4. Expo Go and Expo CLI must use the same Expo account on a physical iPhone.

## Backend setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env`.
4. Fill in `EXPO_PUBLIC_SUPABASE_URL` and the project's publishable key.
5. Restart Expo with `npx expo start -c`.

The app has a branded welcome screen, login and registration forms, home, help requests, community, and profile navigation. Authentication and cloud data are prepared for Supabase. Until the Supabase project keys are added, sign-in and registration show a setup message and cannot create real accounts. Do not put a Supabase secret/service-role key in the mobile app.
