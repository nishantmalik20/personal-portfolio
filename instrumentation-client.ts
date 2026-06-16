import { initBotId } from "botid/client/core";

// Invisibly collects signals on every page load so the server can classify
// the contact-form POST as human or bot. No challenge, no UI, no friction
// for real visitors. Runs on the client before hydration.
initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
