#!/usr/bin/env node

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// CLI Configuration
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options] <file...>')
  .option('delete', {
    alias: 'd',
    type: 'boolean',
    description: 'Delete original files after compression',
    default: false,
  })
  .option('quality', {
    alias: 'q',
    type: 'number',
    description: 'Compression quality (0-100)',
    default: 80,
  })
  .option('rename', {
    alias: 'r',
    type: 'string',
    description: 'Rename file name (only valid for single file)',
    default: null,
  })
  .option('recursive', {
    alias: 'R',
    type: 'boolean',
    description: 'Scan folders recursively for image files',
    default: false,
  })
  .demandCommand(1, 'No files selected.')
  .help().argv;

// Arguments
let inputFiles = [];
const isMultiple = inputFiles.length > 1;
const { rename: renameFileName, quality, delete: deleteOriginal } = argv;

for (const input of argv._) {
  const inputPath = path.resolve(input);

  if (fs.existsSync(inputPath)) {
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      const files = getAllFiles(inputPath, argv.recursive);
      inputFiles.push(...files);
    } else {
      inputFiles.push(inputPath);
    }
  } else {
    console.warn(`Path not found: ${inputPath}`);
  }
}


// Check if any files are valid image files
const imageFiles = inputFiles.filter(isImage);

if (imageFiles.length === 0) {
  console.error('No files selected.');
  process.exit(1);
}


if (imageFiles.length === 0) {
  console.error('No valid image files detected. Supported extensions: jpg, jpeg, png, webp, svg, gif, avif, tiff');
  process.exit(1);
}

if (imageFiles.length < inputFiles.length) {
  console.warn('Some files were skipped because they are not valid image files.');
}

// Main function
for (const file of imageFiles) {
  if (isMultiple && renameFileName) {
    console.error('Cannot rename files when compressing multiple images.');
    process.exit(1);
  }

  await compressImage(file, renameFileName, quality, deleteOriginal);
}

/**
 * Checking file by extension.
 */
function isImage(filePath) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif', '.tiff'];
  const extension = path.extname(filePath).toLowerCase();
  return allowedExtensions.includes(extension);
}

/**
 * Get all files in a directory.
 */
function getAllFiles(dir, recursive = false) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (recursive) {
        results = results.concat(getAllFiles(fullPath, recursive));
      }
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Compress processing image
 */
async function compressImage(filePath, renameFileName, quality, deleteOriginal) {
  const baseName = renameFileName || path.basename(filePath, path.extname(filePath));
  const outputFile = path.join(path.dirname(filePath), `${baseName}.webp`);

  try {
    const before = fs.statSync(filePath).size;
    await sharp(filePath).webp({ quality, effort: 6, smartSubsample: true }).toFile(outputFile);
    const after = fs.statSync(outputFile).size;
    const ratio = Math.round((1 - after / before) * 100);
    
    console.log(`Compressed and converted: ${filePath} → ${outputFile} | (${ratio}%) smaller`);

    if (deleteOriginal) {
      fs.unlinkSync(filePath);
      console.log('Original file removed.');
    }
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error.message);
  }
}
