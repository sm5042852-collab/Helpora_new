# Helpora iOS rebuild

This folder is the clean native iOS track for Helpora. The existing web prototype remains untouched.

## First milestone
- Native SwiftUI app shell
- Four tabs: Start, Help requests, Community, Profile
- Clear empty states until real data and authentication exist

## Build order
1. Establish the Xcode app target and launchable shell.
2. Implement the help request flow and local validation.
3. Add real authentication and backend persistence.
4. Connect community and profile features.
5. Add tests, device build, and iPhone distribution.

Do not present sample or local-only data as live service data. No backend, authentication, or deployable iPhone build is included in this first shell.
