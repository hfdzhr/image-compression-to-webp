import sharp from 'sharp';
import path from 'path';
import yargs from 'yargs';
import fs from 'fs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options] <file...>')
  .option('delete', {
    alias: 'd',
    type: 'boolean',
    description: 'Delete original files',
    default: false,
    describe: 'Delete original files after compression',
  })
  .option('quality', {
    alias: 'q',
    type: 'number',
    description: 'Compression quality',
    default: 80,
    describe: 'Compression quality (0-100)',
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output file name',
    default: null,
    describe: 'Output file name',
  })
  .demandCommand(1, 'No files selected.')
  .help().argv;

const inputFiles = argv._;
const isMultiple = inputFiles.length > 1;
const outputFileName = argv.output;
const quality = argv.quality;
const deleteOriginal = argv.delete;

if (inputFiles.length === 0) {
  console.log('No files selected.');
  process.exit(0);
}

async function compressImage(filePath, outputFileName, quality, deleteOriginal) {
  let fileName;

  if (!outputFileName) {
    fileName = path.basename(filePath, path.extname(filePath));
  } else {
    fileName = outputFileName;
  }

  const outputFile = path.join(path.dirname(filePath), fileName + '.webp');
  
  try {
    await sharp(filePath)
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(outputFile);

    console.log(`Compression and convert succesfully ${filePath} → ${outputFile}`);

    if (deleteOriginal) {
      fs.unlinkSync(filePath);
      console.log('Original file removed.');
    }
  } catch (error) {
    console.error('Failed to Compression and convert', error);

  }
}

if (!isMultiple) {
  const singleFile = inputFiles[0];

  await compressImage(singleFile, outputFileName, quality, deleteOriginal);
} else {
  if (outputFileName) {
    console.log('Cannot rename files if there is more than 1 file.');
    process.exit(0);
  }

  for (const file of inputFiles) {
    await compressImage(file, outputFileName, quality, false);
  }
}