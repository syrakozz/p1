//
// Created by Christos Tsakostas on 26/10/2023.
//

#include "VoiceActivityDetection.h"

#include <algorithm>
#include <utility>

int sampleRate = 16000;
float thresholdLevel = 0.005F; // 0.002F;
float minActivityTime = 1; // 0.25F;     // minimum activity segment time in seconds
float minSilenceTime = 2; //0.20F;     // minimum silence segment time in seconds

int minActivityLen = round(minActivityTime * (float) sampleRate);
int minSilenceLen = round(minSilenceTime * (float) sampleRate);

static std::string SILENCE = "SILENCE";
static std::string VOICE = "VOICE";
static std::string UNKNOWN = "UNKNOWN";

VoiceActivityDetection::VoiceActivityDetection() :
        envelopeDetector(EnvelopeDetector(sampleRate)),
        activityDetector(ActivityDetector(thresholdLevel, minActivityLen, minSilenceLen)) {
    opusCodec.initializeDecoder();

    bufferSizeWithExtraSpace = std::max(minActivityLen, minSilenceLen);
    buffer.reserve(bufferSizeWithExtraSpace);
    previousDetection = UNKNOWN;
}

VoiceActivityDetection::~VoiceActivityDetection() {
    opusCodec.destroyDecoder();
}

void VoiceActivityDetection::setParameters(float thresholdLevelArg, float minActivityTimeArg, float minSilenceTimeArg) {
    int newMinActivityLen = round(minActivityTimeArg * (float) sampleRate);
    int newMinSilenceLen = round(minSilenceTimeArg * (float) sampleRate);

    activityDetector.setParameters(thresholdLevelArg, newMinActivityLen, newMinSilenceLen);

    bufferSizeWithExtraSpace = std::max(minActivityLen, minSilenceLen);
    buffer.clear();
    buffer.reserve(bufferSizeWithExtraSpace);
    previousDetection = UNKNOWN;
}

void VoiceActivityDetection::registerVadCallback(void (*vadCallback)(std::string)) {
    this->vadCallback = vadCallback;
}

std::string VoiceActivityDetection::streamOpusData(const std::vector<unsigned char> &input) {
    std::vector<unsigned char> decodedPcmData = opusCodec.decodeMultipleFrames(input);
    return streamPcmData(decodedPcmData);
}

std::string VoiceActivityDetection::streamPcmData(const std::vector<unsigned char> &input) {
    std::vector<short> samplesAsShort = convertBytesToShort(input);
    std::vector<float> samplesAsFloat = convertShortToFloat(samplesAsShort);

    buffer.insert(buffer.end(), std::begin(samplesAsFloat), std::end(samplesAsFloat));

    // conditions are met
    if (buffer.size() >= minActivityLen) {
        std::vector<float> bufferEnvelopeAsFloat = envelopeDetector.process(buffer);
        std::vector<int> activeZones = checkVoiceActivity(bufferEnvelopeAsFloat);

        if (activeZones.size() == 0) {
            if (previousDetection != SILENCE) {
                vadCallback(SILENCE);
            }
            previousDetection = SILENCE;
        } else {
            if (previousDetection != VOICE) {
                vadCallback(VOICE);
            }
            previousDetection = VOICE;
        }
    }

    if (buffer.size() >= bufferSizeWithExtraSpace) {
        int numberOfSamplesToErase = samplesAsShort.size();
        std::move(buffer.begin() + numberOfSamplesToErase, buffer.end(), buffer.begin());
        buffer.erase(buffer.end() - numberOfSamplesToErase, buffer.end());
    }

    return previousDetection;
}

void VoiceActivityDetection::stopStreaming() {
    buffer.clear();
    buffer.reserve(bufferSizeWithExtraSpace);
    previousDetection = UNKNOWN;

    opusCodec.destroyDecoder();
    opusCodec.initializeDecoder();
}

std::vector<int> VoiceActivityDetection::checkVoiceActivity(std::vector<float> envelope) {
    std::vector<int> activeZones = activityDetector.process(envelope);
    return activeZones;
}

std::vector<short> VoiceActivityDetection::convertBytesToShort(const std::vector<unsigned char> &input) {
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

std::vector<float> VoiceActivityDetection::convertShortToFloat(const std::vector<short> &input) {
    std::vector<float> floatSamples;
    floatSamples.resize(input.size());

    for (int i = 0; i < input.size(); i++) {
        floatSamples.at(i) = (float) input[i] / 32768;
    }

    return floatSamples;
}
