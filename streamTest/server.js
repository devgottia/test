const ffmpeg = require('fluent-ffmpeg');

// Input URL and output parameters
const inputUrl = 'http://zaiqabiryani.rozi-roti.com/W@aq@@ar52/asAKM/1664990';
const outputPath = 'output.m3u8';

ffmpeg(inputUrl)
  .outputOptions([
    '-c:v libx264',        // Video codec
    '-b:v 1200k',          // Video bitrate
    '-c:a aac',            // Audio codec
    '-b:a 128k',           // Audio bitrate
    '-f hls',              // Format
    '-hls_time 10',        // Segment duration
    '-hls_list_size 0',    // No limit on playlist size
    '-hls_segment_filename segment_%03d.ts' // Segment file pattern
  ])
  .on('end', () => {
    console.log('Processing finished!');
  })
  .on('error', (err) => {
    console.error('An error occurred:', err.message);
  })
  .save(outputPath);
