// One place to turn live updates on and off.
//
// 0 = fetch once on mount, no interval.
//
// Every dashboard poll reaches the Neon database through the backend API, so
// each one is a database wake. While we are pre-launch on Neon's free tier the
// compute-hour allowance is the binding constraint, and a 10-second poll meant
// the compute never suspended at all — the previous account was exhausted this
// way (OUT-206).
//
// Set this to 30000 (or whatever suits) once the database is on a paid plan.
export const POLL_MS = 0;
