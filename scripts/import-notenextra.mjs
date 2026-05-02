#!/usr/bin/env node
// Import ML-related lecture notes from Trance-0/NoteNextra into the
// Lavender VitePress site. Imports land under `docs/_imports/` so they
// don't pollute the topic-oriented sidebar; topic pages can reference
// them as needed.
//
//   node scripts/import-notenextra.mjs           # fetch all
//   node scripts/import-notenextra.mjs cv        # fetch one section
//   node scripts/import-notenextra.mjs --dry-run # don't write files

import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DOCS = join(ROOT, 'docs')

const RAW = (path) =>
  `https://raw.githubusercontent.com/Trance-0/NoteNextra/main/${path}`
const SRC = (path) =>
  `https://github.com/Trance-0/NoteNextra/blob/main/${path}`

const range = (n, start = 1) =>
  Array.from({ length: n }, (_, i) => i + start)

const manifest = [
  // Reinforcement Learning lectures
  ...range(26).map((i) => ({
    section: 'rl',
    src: `content/CSE510/CSE510_L${i}.md`,
    dest: `_imports/rl-lectures/L${String(i).padStart(2, '0')}.md`,
    title: `Deep Reinforcement Learning · Lecture ${i}`,
    order: i
  })),

  // Computer Vision foundations lectures
  ...range(26).map((i) => ({
    section: 'cv-foundations',
    src: `content/CSE559A/CSE559A_L${i}.md`,
    dest: `_imports/cv-foundations-lectures/L${String(i).padStart(2, '0')}.md`,
    title: `Computer Vision Foundations · Lecture ${i}`,
    order: i
  })),

  // Modern CV paper notes, by topic
  ...[
    { letter: 'A', n: 4, dest: 'semantic-segmentation' },
    { letter: 'B', n: 5, dest: 'vision-language' },
    { letter: 'C', n: 4, dest: 'neural-rendering' },
    { letter: 'D', n: 5, dest: 'generation' },
    { letter: 'E', n: 5, dest: 'geometric' },
    { letter: 'F', n: 5, dest: 'representation' },
    { letter: 'G', n: 4, dest: 'sfm', start: 2 },
    { letter: 'H', n: 4, dest: 'safety', start: 2 },
    { letter: 'I', n: 4, dest: 'embodied' },
    { letter: 'J', n: 4, dest: 'open-vocab', explicit: [1, 2, 3, 5] }
  ].flatMap(({ letter, n, dest, start = 1, explicit }) => {
    const idxs = explicit ?? range(n, start)
    return idxs.map((i, k) => ({
      section: 'cv-modern',
      src: `content/CSE5519/CSE5519_${letter}${i}.md`,
      dest: `_imports/cv-modern/${dest}/era-${i}.md`,
      title: `${dest.replace(/-/g, ' ')} · era ${i}`,
      order: k + 1
    }))
  }),

  // Information theory lectures
  ...range(27).map((i) => ({
    section: 'info-theory',
    src: `content/CSE5313/CSE5313_L${i}.md`,
    dest: `_imports/information-theory-lectures/L${String(i).padStart(2, '0')}.md`,
    title: `Information Theory · Lecture ${i}`,
    order: i
  }))
]

const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const filter = args.find((a) => !a.startsWith('--'))

const sectionsToRun = new Set(
  filter
    ? [filter]
    : ['rl', 'cv-foundations', 'cv-modern', 'info-theory']
)

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

function frontmatter({ title, source, order }) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    `order: ${order}`,
    `source: ${source}`,
    'imported: true',
    '---',
    ''
  ].join('\n')
}

let okCount = 0
let failCount = 0

for (const entry of manifest) {
  if (!sectionsToRun.has(entry.section)) continue

  const url = RAW(entry.src)
  const outPath = join(DOCS, entry.dest)
  process.stdout.write(`• ${entry.dest}  ← ${entry.src} ... `)

  try {
    const body = await fetchText(url)
    const fm = frontmatter({
      title: entry.title,
      source: SRC(entry.src),
      order: entry.order
    })
    const note = `\n\n> _Imported from [${entry.src}](${SRC(entry.src)}) — Trance-0/NoteNextra._\n`
    const content = fm + body.trimEnd() + note

    if (!dry) {
      await mkdir(dirname(outPath), { recursive: true })
      await writeFile(outPath, content, 'utf8')
    }
    process.stdout.write(dry ? 'OK (dry)\n' : 'OK\n')
    okCount += 1
  } catch (err) {
    process.stdout.write(`FAIL (${err.message})\n`)
    failCount += 1
  }
}

console.log(`\nDone. ${okCount} written, ${failCount} failed.`)
