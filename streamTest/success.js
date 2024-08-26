const express = require('express');
const fluentFfmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

const app = express();
const port = 3000;

// Test URL with binary stream content
const testStreamUrl = 'http://zaiqabiryani.rozi-roti.com/W@aq@@ar52/asAKM/1664990';

app.get('/media.mp4', (req, res) => {
    // Set headers to indicate video streaming
    res.setHeader('Content-Type', 'video/mp4');

    // Create a PassThrough stream to handle continuous data
    const passThroughStream = new PassThrough();

    fluentFfmpeg()
        .input(testStreamUrl)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mp4')
        .outputOptions([
            '-movflags', 'frag_keyframe+empty_moov', // Ensure the MP4 container is streamable
            '-preset', 'fast', // Fast encoding preset
            '-crf', '23' // Quality level
        ])
        .on('start', (commandLine) => {
            console.log('FFmpeg process started with command:', commandLine);
        })
        .on('stderr', (stderrLine) => {
            console.error('FFmpeg STDERR:', stderrLine);
        })
        .on('error', (err) => {
            console.error('FFmpeg error:', err);
            if (!res.headersSent) {
                res.status(500).send('Error processing media');
            }
        })
        .on('end', () => {
            console.log('FFmpeg processing finished.');
        })
        .pipe(passThroughStream, { end: false });

    passThroughStream.pipe(res);

    // Handle client disconnection
    req.on('close', () => {
        console.log('Client disconnected');
        passThroughStream.unpipe(res);
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
