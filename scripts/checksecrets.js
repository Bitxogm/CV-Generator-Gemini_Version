#!/usr/bin/env node

/**
 * checksecrets.js - Detecta credenciales expuestas en commits
 * Compatible con Windows, Mac y Linux
 */

const { execSync } = require('child_process');
const readline = require('readline');

console.log('🔍 Checking for exposed secrets...\n');

// Valores placeholder que se ignoran (documentación, ejemplos, etc.)
const PLACEHOLDER_REGEX =
  /^(your[-_]?|<|example|placeholder|changeme|xxx+|test[-_]?|dummy|fake|sample|todo|replace|insert|put[-_]?your|add[-_]?your|here|api[-_]?key[-_]?here|secret[-_]?here|password[-_]?here|\*+|\.\.\.)/i;

// Solo detecta valores que parezcan credenciales reales (>= 16 chars de entropía)
const PATTERNS = [
  // API keys reales: variables de entorno con valor largo y sin placeholder
  { regex: /\bVITE_\w+KEY\s*=\s*([A-Za-z0-9_\-]{20,})/, label: 'API key en variable de entorno' },
  // JWT secrets reales
  { regex: /\bJWT_SECRET\s*=\s*([A-Za-z0-9_\-]{20,})/, label: 'JWT secret en variable de entorno' },
  // Contraseñas SMTP reales
  {
    regex: /\bSMTP_PASSWORD\s*=\s*([A-Za-z0-9_\-!@#$%]{8,})/,
    label: 'SMTP password en variable de entorno',
  },
  // DATABASE_URL con usuario y password reales (no placeholder)
  { regex: /\b\w+:\/\/\w+:([^@\s<>]{8,})@[\w.-]+/, label: 'Credenciales en DATABASE_URL' },
  // MongoDB Atlas con credenciales reales
  { regex: /mongodb\+srv:\/\/[^:]+:([^@\s<>]{8,})@/, label: 'Credenciales en MongoDB URI' },
  // Private keys
  { regex: /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----/, label: 'Clave privada' },
  // Tokens largos (Bearer, auth tokens, etc.)
  { regex: /(?:bearer|token)\s*[:=]\s*['"]([A-Za-z0-9_\-.]{32,})['"]/, label: 'Auth token' },
  // API keys genéricas con valor largo
  { regex: /api[_-]?key\s*[:=]\s*['"]([A-Za-z0-9_\-]{20,})['"]/, label: 'API key genérica' },
];

function isPlaceholder(value) {
  return PLACEHOLDER_REGEX.test(value.trim());
}

function checkFile(file) {
  const matches = [];
  let diff;
  try {
    diff = execSync(`git diff --cached "${file}"`, { encoding: 'utf8' });
  } catch {
    return matches;
  }

  for (const { regex, label } of PATTERNS) {
    const globalRegex = new RegExp(regex.source, 'gi');
    let match;
    while ((match = globalRegex.exec(diff)) !== null) {
      const capturedValue = match[1] || match[0];
      if (!isPlaceholder(capturedValue)) {
        matches.push({ label, value: capturedValue.slice(0, 8) + '...' });
      }
    }
  }
  return matches;
}

let files;
try {
  files = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
} catch {
  console.log('✅ No staged files to check');
  process.exit(0);
}

const SKIP_PATTERNS = ['node_modules', '.min.js', '.lock', 'dist/', 'build/'];

const findings = {};

for (const file of files) {
  if (SKIP_PATTERNS.some((p) => file.includes(p))) continue;
  const matches = checkFile(file);
  if (matches.length > 0) findings[file] = matches;
}

if (Object.keys(findings).length === 0) {
  console.log('✅ No secrets detected');
  process.exit(0);
}

// Mostrar hallazgos
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('⚠️  Posibles secretos detectados:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const [file, matches] of Object.entries(findings)) {
  console.log(`📄 ${file}:`);
  for (const { label, value } of matches) {
    console.log(`   ⚠  ${label}: ${value}`);
  }
  console.log('');
}

console.log('Opciones:');
console.log('  1. Elimina los secretos y usa archivos .env (ya están en .gitignore)');
console.log('  2. Si son valores de ejemplo/documentación, puedes continuar.\n');

// Pedir confirmación al usuario
const rl = readline.createInterface({ input: process.stdin, output: process.stderr });

rl.question('¿Continuar con el commit de todas formas? [y/N]: ', (answer) => {
  rl.close();
  if (answer.trim().toLowerCase() === 'y') {
    console.log('\n⚠️  Commit permitido por el usuario.');
    process.exit(0);
  } else {
    console.log('\n❌ Commit cancelado. Revisa los archivos antes de continuar.\n');
    process.exit(1);
  }
});
