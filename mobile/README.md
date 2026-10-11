# Helpora Mobile

Helpora is an iPhone and Android community support app built with Expo and React Native.

## Run the preview

1. Install Node.js and Expo Go.
2. Open PowerShell in the `mobile` folder.
3. Run `npm install`.
4. Run `npx.cmd expo start` and scan the QR code with Expo Go.
5. Without backend keys, tap **Önizlemeyi aç**. Preview requests and community posts stay on that device.

Expo Go and Expo CLI must be signed in to the same Expo account when opening a development project on a physical iPhone.

## Enable real accounts and cloud data

1. Create a Supabase project.
2. In Supabase **SQL Editor**, run `supabase/schema.sql` once.
3. Copy `.env.example` to `.env` in the `mobile` folder.
4. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` using the project's **Project URL** and **publishable/anon key**.
5. Restart Metro with `npx.cmd expo start -c`.

Email confirmation is controlled from Supabase Auth settings. If confirmation is enabled, users need to confirm their email before the first sign-in.

Never put a Supabase secret or service-role key in the mobile app. The database tables use row-level security policies in `supabase/schema.sql`.

## Included

- Branded welcome, sign-in, registration, and password reset screens
- Device-only preview mode before backend configuration
- Home, help request feed and creation form, community feed and posting, profile and settings
- Supabase Auth session persistence and database integration for help requests and posts
- App icon at `assets/icon.png`
