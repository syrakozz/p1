//
// Created by Christos Tsakostas on 19/10/2023.
//

#include "OpusCodec.h"

#include <cstdio>
#include <vector>

#define FRAME_SIZE 320
#define MAX_FRAME_SIZE 10*FRAME_SIZE

typedef struct wavfile_header_s {
    char ChunkID[4];     /*  4   */
    int32_t ChunkSize;      /*  4   */
    char Format[4];      /*  4   */

    char Subchunk1ID[4]; /*  4   */
    int32_t Subchunk1Size;  /*  4   */
    int16_t AudioFormat;    /*  2   */
    int16_t NumChannels;    /*  2   */
    int32_t SampleRate;     /*  4   */
    int32_t ByteRate;       /*  4   */
    int16_t BlockAlign;     /*  2   */
    int16_t BitsPerSample;  /*  2   */

    char Subchunk2ID[4];
    int32_t Subchunk2Size;
} wavfile_header_t;

/*Standard values for CD-quality audio*/
#define SUBCHUNK1SIZE   (16)
#define AUDIO_FORMAT    (1) /*For PCM*/
#define NUM_CHANNELS    (1)
#define SAMPLE_RATE     (16000)

#define BITS_PER_SAMPLE (16)

#define BYTE_RATE       (SAMPLE_RATE * NUM_CHANNELS * BITS_PER_SAMPLE / 8)
#define BLOCK_ALIGN     (NUM_CHANNELS * BITS_PER_SAMPLE / 8)

std::vector<unsigned char> OpusCodec::pcmToOpus(std::vector<unsigned char> pcmData) {
    std::vector<unsigned char> result;

    initializeEncoder();

    for (int i = 0; i < pcmData.size(); i = i + chunkSize) {
        std::vector<unsigned char> chunk = std::vector<unsigned char>(pcmData.begin() + i,
                                                                      pcmData.begin() + i + chunkSize);
        std::vector<unsigned char> encodedFrame = encodeMultipleFrames(chunk);
        for (int j = 0; j < encodedFrame.size(); j++) {
            result.push_back(encodedFrame.at(j));
        }
    }

    destroyEncoder();

    return result;
}

std::vector<unsigned char> OpusCodec::opusToWav(std::vector<unsigned char> opusData) {
    std::vector<unsigned char> pcmData;

    initializeDecoder();

    for (int i = 0; i < opusData.size(); i = i + encodedSize) {
        std::vector<unsigned char> chunk = std::vector<unsigned char>(opusData.begin() + i,
                                                                      opusData.begin() + i + encodedSize);
        std::vector<unsigned char> decodedFrame = decodeMultipleFrames(chunk);
        for (int j = 0; j < decodedFrame.size(); j++) {
            pcmData.push_back(decodedFrame.at(j));
        }
    }

    destroyDecoder();

    std::vector<unsigned char> amplifiedPcmData = amplifyPcm(pcmData);
    std::vector<unsigned char> wavData = pcmToWav(amplifiedPcmData);

    return wavData;
}

void OpusCodec::initializeEncoder() {
    opusEncoder = opus_encoder_create(sampleRate, channels, application, &err);
    if (err < 0) {
        fprintf(stderr, "failed to create opus encoder: %s\n", opus_strerror(err));
    }

    err = opus_encoder_ctl(opusEncoder, OPUS_SET_VBR(0));
    if (err < 0) {
        fprintf(stderr, "failed to set constant bitrate: %s\n", opus_strerror(err));
    }

    err = opus_encoder_ctl(opusEncoder, OPUS_SET_BITRATE(sampleRate));
    if (err < 0) {
        fprintf(stderr, "failed to set bitrate: %s\n", opus_strerror(err));
    }

    err = opus_encoder_ctl(opusEncoder, OPUS_SET_COMPLEXITY(3));
    if (err < 0) {
        fprintf(stderr, "failed to set complexity: %s\n", opus_strerror(err));
    }
}

std::vector<unsigned char> OpusCodec::encodeOneFrame(std::vector<unsigned char> input) {
    std::vector<unsigned char> encodedDataOfFrame;

    while (input.size() < chunkSize) {
        input.push_back(0);
    }

    short *pcm_input;
    unsigned char *encodedData;
    int encodedLength = 0;
    int inputLengthIn16Bit = input.size() / 2;
    pcm_input = (short *) malloc(inputLengthIn16Bit * sizeof(short));
    encodedData = (unsigned char *) calloc(inputLengthIn16Bit, sizeof(unsigned char));

    for (int i = 0; i < inputLengthIn16Bit; i++) {
        opus_int32 s;
        s = input.at(2 * i + 1) << 8 | input.at(2 * i);
        s = ((s & 0xFFFF) ^ 0x8000) - 0x8000;
        pcm_input[i] = s;
    }

    encodedLength = opus_encode(opusEncoder, pcm_input, inputLengthIn16Bit, encodedData, inputLengthIn16Bit);

    encodedDataOfFrame.reserve(encodedLength);
    for (int i = 0; i < encodedLength; i++) {
        encodedDataOfFrame.push_back(encodedData[i]);
    }

    free(pcm_input);
    free(encodedData);

    return encodedDataOfFrame;
}

std::vector<unsigned char> OpusCodec::encodeMultipleFrames(std::vector<unsigned char> input) {
    std::vector<unsigned char> encodedDataOfFrames;

    encodedDataOfFrames.reserve(input.size() / chunkSize * encodedSize);

    for (int i = 0; i < input.size(); i = i + chunkSize) {
        std::vector<unsigned char> chunk = std::vector<unsigned char>(input.begin() + i,
                                                                      input.begin() + i + chunkSize);
        std::vector<unsigned char> encodedFrame = encodeOneFrame(chunk);
        for (int j = 0; j < encodedFrame.size(); j++) {
            encodedDataOfFrames.push_back(encodedFrame.at(j));
        }
    }

    return encodedDataOfFrames;
}

void OpusCodec::destroyEncoder() {
    opus_encoder_destroy(opusEncoder);
}

void OpusCodec::initializeDecoder() {
    opusDecoder = opus_decoder_create(sampleRate, channels, &err);
    if (err < 0) {
        fprintf(stderr, "failed to create opus decoder: %s\n", opus_strerror(err));
    }
}

std::vector<unsigned char> OpusCodec::decodeOneFrame(std::vector<unsigned char> input) {
    std::vector<unsigned char> decodedData;

    while (input.size() < encodedSize) {
        input.push_back(0);
    }

    int packetLength = input.size();
    unsigned char packetBytesInput[packetLength];
    opus_int16 decodedOutput[MAX_FRAME_SIZE * 2];

    for (int i = 0; i < packetLength; i++) {
        packetBytesInput[i] = input.at(i);
    }

    int decodedFrameSize = opus_decode(opusDecoder, packetBytesInput, packetLength, decodedOutput, MAX_FRAME_SIZE, 0);

    /* Convert to little-endian ordering. */
    for (int i = 0; i < decodedFrameSize; i++) {
        decodedData.push_back(decodedOutput[i] & 0xFF);
        decodedData.push_back((decodedOutput[i] >> 8) & 0xFF);
    }

    return decodedData;
}

std::vector<unsigned char> OpusCodec::decodeMultipleFrames(std::vector<unsigned char> input) {
    std::vector<unsigned char> decodedDataOfFrames;

    decodedDataOfFrames.reserve(input.size() / encodedSize * chunkSize);

    for (int i = 0; i < input.size(); i = i + encodedSize) {
        std::vector<unsigned char> chunk = std::vector<unsigned char>(input.begin() + i,
                                                                      input.begin() + i + encodedSize);
        std::vector<unsigned char> decodedFrame = decodeOneFrame(chunk);
        for (int j = 0; j < decodedFrame.size(); j++) {
            decodedDataOfFrames.push_back(decodedFrame.at(j));
        }
    }

    return decodedDataOfFrames;
}

void OpusCodec::destroyDecoder() {
    opus_decoder_destroy(opusDecoder);
}

std::vector<unsigned char> OpusCodec::amplifyPcm(std::vector<unsigned char> input) {
    std::vector<unsigned char> amplifiedPcmData;
    amplifiedPcmData.reserve(input.size());

    std::vector<short> samplesAsAsShort = convertBytesToShort(input);
    std::vector<short> samplesAsAsShortWithGain = normalizeWithGain(samplesAsAsShort, 32000);
    std::vector<unsigned char> samplesAsAsBytes = convertShortToBytes(samplesAsAsShortWithGain);

    for (unsigned char byte: samplesAsAsBytes) {
        amplifiedPcmData.push_back(byte);
    }

    return amplifiedPcmData;
}


std::vector<short> OpusCodec::convertBytesToShort(const std::vector<unsigned char> &input) {
    std::vector<short> samples;
    samples.reserve(input.size() / 2);

    /* Convert from little-endian ordering. */
    for (int i = 0; i < input.size() / 2; i++) {
        opus_int32 s;
        s = input.at(2 * i + 1) << 8 | input.at(2 * i);
        s = ((s & 0xFFFF) ^ 0x8000) - 0x8000;
        samples.push_back(s);
    }

    return samples;
}

std::vector<short> OpusCodec::normalizeWithGain(const std::vector<short> &input, short gain) {
    std::vector<short> samples;
    samples.reserve(input.size());

    short maximumValue = *max_element(std::begin(input), std::end(input));
    short minimumValue = *min_element(std::begin(input), std::end(input));
    int maximumAbsoluteValue = std::max(std::abs(maximumValue), std::abs(minimumValue));

    for (short sample: input) {
        samples.push_back(sample * gain / maximumAbsoluteValue);
    }

    return samples;
}

std::vector<unsigned char> OpusCodec::convertShortToBytes(const std::vector<short> &input) {
    std::vector<unsigned char> bytes;
    bytes.reserve(input.size() * 2);

    /* Convert to little-endian ordering. */
    for (short sample: input) {
        bytes.push_back(sample & 0xFF);
        bytes.push_back((sample >> 8) & 0xFF);
    }

    return bytes;
}

std::vector<unsigned char> OpusCodec::pcmToWav(std::vector<unsigned char> input) {
    std::vector<unsigned char> wavData;

    wavfile_header_t wav_header;
    int32_t subchunk2_size;
    int32_t chunk_size;

    int32_t FrameCount = input.size() / 2;
    subchunk2_size = FrameCount * NUM_CHANNELS * BITS_PER_SAMPLE / 8;
    chunk_size = 4 + (8 + SUBCHUNK1SIZE) + (8 + subchunk2_size);

    wav_header.ChunkID[0] = 'R';
    wav_header.ChunkID[1] = 'I';
    wav_header.ChunkID[2] = 'F';
    wav_header.ChunkID[3] = 'F';

    wav_header.ChunkSize = chunk_size;

    wav_header.Format[0] = 'W';
    wav_header.Format[1] = 'A';
    wav_header.Format[2] = 'V';
    wav_header.Format[3] = 'E';

    wav_header.Subchunk1ID[0] = 'f';
    wav_header.Subchunk1ID[1] = 'm';
    wav_header.Subchunk1ID[2] = 't';
    wav_header.Subchunk1ID[3] = ' ';

    wav_header.Subchunk1Size = SUBCHUNK1SIZE;
    wav_header.AudioFormat = AUDIO_FORMAT;
    wav_header.NumChannels = NUM_CHANNELS;
    wav_header.SampleRate = SAMPLE_RATE;
    wav_header.ByteRate = BYTE_RATE;
    wav_header.BlockAlign = BLOCK_ALIGN;
    wav_header.BitsPerSample = BITS_PER_SAMPLE;

    wav_header.Subchunk2ID[0] = 'd';
    wav_header.Subchunk2ID[1] = 'a';
    wav_header.Subchunk2ID[2] = 't';
    wav_header.Subchunk2ID[3] = 'a';
    wav_header.Subchunk2Size = subchunk2_size;

    auto *bytePtr = (uint8_t *) &wav_header;
    wavData.reserve(sizeof(wav_header));
    for (int i = 0; i < sizeof(wav_header); i++) {
        wavData.push_back(bytePtr[i]);
    }

    for (unsigned char byte: input) {
        wavData.push_back(byte);
    }

    return wavData;
}

std::vector<unsigned char> OpusCodec::wavToPcm(std::vector<unsigned char> input) {
    std::vector<unsigned char> pcmData;

    wavfile_header_t wav_header;
    auto *bytePtr = (uint8_t *) &wav_header;
    int sizeofWavHeader = sizeof(wav_header);
    for (int i = 0; i < sizeofWavHeader; i++) {
        bytePtr[i] = input.at(i);
    }

    pcmData.reserve(wav_header.Subchunk2Size);

    pcmData = std::vector<unsigned char>(input.begin() + sizeofWavHeader,
                                         input.begin() + sizeofWavHeader + wav_header.Subchunk2Size);

    return pcmData;
}
