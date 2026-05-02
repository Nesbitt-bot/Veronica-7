#!/usr/bin/env node
// Walk every sidebar config under docs/.vitepress/sidebars and create a
// minimal stub markdown file for each `link` that doesn't yet exist on disk.
// This makes the navigation tree fully browsable before content is written.
//
//   node scripts/generate-stubs.mjs            # create missing stubs
//   node scripts/generate-stubs.mjs --force    # overwrite stub pages only
//   node scripts/generate-stubs.mjs --dry-run  # report only

import { readFile, writeFile, mkdir, access, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DOCS = join(ROOT, 'docs')
const SIDEBARS = join(DOCS, '.vitepress', 'sidebars')

const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const force = args.includes('--force')

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

// Match leaf items where `text` and `link` appear directly adjacent.
function extractPairs(src) {
  const out = []
  const re = /text:\s*'([^']+)'\s*,\s*link:\s*'([^']+)'/g
  let m
  while ((m = re.exec(src))) {
    out.push({ text: m[1], link: m[2] })
  }
  return out
}

const sidebarFiles = (await readdir(SIDEBARS)).filter((f) => f.endsWith('.ts'))

const all = []
for (const f of sidebarFiles) {
  const src = await readFile(join(SIDEBARS, f), 'utf8')
  for (const pair of extractPairs(src)) all.push(pair)
}

let written = 0
let skipped = 0

for (const { text, link } of all) {
  if (link.startsWith('http')) continue

  let rel = link.replace(/^\//, '')
  if (rel.endsWith('/')) rel = rel + 'index'
  const path = join(DOCS, rel + '.md')

  const already = await exists(path)
  if (already) {
    if (!force) {
      skipped += 1
      continue
    }
    const current = await readFile(path, 'utf8')
    if (!/^stub:\s*true\b/m.test(current)) {
      skipped += 1
      continue
    }
  }

  const body = [
    '---',
    `title: ${JSON.stringify(text)}`,
    'stub: true',
    '---',
    '',
    `# ${text}`,
    '',
    '> **Stub.** This page is reserved by the curriculum outline but does',
    '> not yet have content. Contributions welcome.',
    '',
    '## Why this article exists',
    '',
    `In the topological / chronological ordering of Project Veronica, this`,
    `entry sits between its sidebar neighbours. Filling it in is a way to`,
    `extend the curriculum without breaking the reading order.`,
    ''
  ].join('\n')

  if (dry) {
    console.log(`would write ${path}`)
  } else {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, body, 'utf8')
    console.log(`+ ${rel}.md`)
  }
  written += 1
}

console.log(`\nDone. ${written} stub${written === 1 ? '' : 's'} written, ${skipped} skipped.`)
