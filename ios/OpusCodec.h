//
// Created by Christos Tsakostas on 19/10/2023.
//

#ifndef MAGIC_OPUSCODEC_H
#define MAGIC_OPUSCODEC_H

#include <vector>
#include "./opus/include/opus.h"

class OpusCodec {
public:
    /**
     * All in one functions - Deprecated - Showcase of how to use encoding/decoding
     */

    std::vector<unsigned char> pcmToOpus(std::vector<unsigned char> pcmData);
    std::vector<unsigned char> opusToWav(std::vector<unsigned char> opusData);

    /**
     * Chunks functions
     */

    void initializeEncoder();
    std::vector<unsigned char> encodeOneFrame(std::vector<unsigned char> input);
    std::vector<unsigned char> encodeMultipleFrames(std::vector<unsigned char> input);
    void destroyEncoder();

    void initializeDecoder();
    std::vector<unsigned char> decodeOneFrame(std::vector<unsigned char> input);
    std::vector<unsigned char> decodeMultipleFrames(std::vector<unsigned char> input);
    void destroyDecoder();

    /**
     * Conversion functions
    */
    static std::vector<short> convertBytesToShort(const std::vector<unsigned char>& input);
    static std::vector<unsigned char> convertShortToBytes(const std::vector<short>& input);

    /**
     * Common functions - Most Probably will not work from Javascript due to big size of data
     */

    static std::vector<unsigned char> amplifyPcm(std::vector<unsigned char> input);
    static std::vector<unsigned char> pcmToWav(std::vector<unsigned char> input);
    static std::vector<unsigned char> wavToPcm(std::vector<unsigned char> input);

private:
    static std::vector<short> normalizeWithGain(const std::vector<short>& input, short gain);

private:
    OpusEncoder *opusEncoder = nullptr;
    OpusDecoder *opusDecoder = nullptr;
    opus_int32 sampleRate = 16000;
    int channels = 1;
    int application = OPUS_APPLICATION_AUDIO;
    int err = 0;

    int frameSize = 320;
    int chunkSize = frameSize * 2;
    int encodedSize = 40;
};


#endif //MAGIC_OPUSCODEC_H
