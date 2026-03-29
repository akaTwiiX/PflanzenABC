#!/usr/bin/env node
// ─────────────────────────────────────────
// commit-push.mjs
// Usage:
//   node scripts/commit-push.mjs "My message"          → commit + push only
//   node scripts/commit-push.mjs "My message" patch    → + tag patch bump
//   node scripts/commit-push.mjs "My message" minor    → + tag minor bump
//   node scripts/commit-push.mjs "My message" major    → + tag major bump
//   node scripts/commit-push.mjs tag-only              → tag last commit
// ─────────────────────────────────────────

const { execSync } = require('child_process')

// ── Parse arguments ───────────────────────
// pnpm commit:patch "my message"  → argv = ['patch', 'my message']  (bump injected first by package.json)
// pnpm commit "my message" patch  → argv = ['my message', 'patch']
const args = process.argv.slice(2);

let message, bump;

// Called via commit:patch / commit:minor etc. → first arg is the bump injected by package.json
const bumpKeywords = ['patch', 'minor', 'major', 'tag-only'];

if (bumpKeywords.includes(args[0])) {
  bump = args[0];
  message = args[1];
} else {
  message = args[0];
  bump = args[1];
}

// ── Helper ────────────────────────────────
function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe' }).toString().trim();
  } catch {
    return null;
  }
}

function runLive(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

// ── Read last tag ─────────────────────────
let lastTag = run('git describe --tags --abbrev=0');

if (!lastTag) {
  lastTag = 'v0.0.0';
  console.log(`ℹ️  No tag found, starting at ${lastTag}`);
}

console.log(`📌 Last tag: ${lastTag}`);

// ── Extract version numbers ───────────────
const version = lastTag.replace(/^v/, '');
let [major, minor, patch] = version.split('.').map(Number);

// ── Tag-only mode ─────────────────────────
if (bump === 'tag-only') {
  patch++;
  const newTag = `v${major}.${minor}.${patch}`;
  console.log(`🏷️  Tag-only mode — tagging current HEAD as ${newTag}`);
  runLive(`git tag ${newTag}`);
  runLive(`git push origin ${newTag}`);
  console.log(`✅ Tag ${newTag} pushed — Release build triggered!`);
  process.exit(0);
}

// ── Require message for commits ───────────
if (!message) {
  console.error('❌ Please provide a commit message.');
  console.error('   Usage: pnpm commit "Fix login bug" [patch|minor|major|tag-only]');
  process.exit(1);
}

// ── Calculate new version ─────────────────
if (bump === 'major') { major++; minor = 0; patch = 0; }
else if (bump === 'minor') { minor++; patch = 0; }
else if (bump === 'patch') { patch++; }

const newTag = `v${major}.${minor}.${patch}`;

// ── Commit + Push ─────────────────────────
runLive('git add .');
runLive(`git commit -m "${message}"`);
runLive('git push');

// ── Optional: Set + push tag ──────────────
if (bump) {
  console.log(`🏷️  New tag: ${newTag}`);
  runLive(`git tag ${newTag}`);
  runLive(`git push origin ${newTag}`);
  console.log('');
  console.log(`✅ Commit + Push + Tag ${newTag} successful!`);
  console.log('🚀 GitHub Actions triggered:');
  console.log('   → android-release (Signed APK)');
  console.log('   → web-deploy (GitHub Pages)');
} else {
  console.log('');
  console.log('✅ Commit + Push successful (no tag)');
  console.log('🔧 GitHub Actions triggered:');
  console.log('   → android-debug (Debug APK)');
}