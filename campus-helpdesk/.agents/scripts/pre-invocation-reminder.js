import fs from 'node:fs';

/**
 * Antigravity Lifecycle Hook: Quality Reminder (PreInvocation)
 * Injects an ephemeral reminder to the model before it generates a plan or tool execution.
 */

try {
  try {
    fs.readFileSync(0, 'utf-8');
  } catch {
    // Ignore empty stdin
  }

  const output = {
    injectSteps: [
      {
        ephemeralMessage:
          'Workspace Policy: Ensure all React components adhere to ESLint standards and retain clean state persistence.',
      },
    ],
  };

  console.log(JSON.stringify(output));
} catch {
  console.log(JSON.stringify({ injectSteps: [] }));
}
