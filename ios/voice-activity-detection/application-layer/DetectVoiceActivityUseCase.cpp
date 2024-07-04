//
// Created by Christos Tsakostas on 02/11/2023.
//

#include "DetectVoiceActivityUseCase.h"

DetectVoiceActivityUseCase::DetectVoiceActivityUseCase(
        DetectVoiceActivityDomainService *detectVoiceActivityDomainService,
        float minimumSilenceTimeInSeconds,
        float minimumVoiceTimeInSeconds)
        : detectVoiceActivityDomainService(detectVoiceActivityDomainService) {
    this->voiceActivity.setParameters(minimumSilenceTimeInSeconds,
                                      minimumVoiceTimeInSeconds,
                                      detectVoiceActivityDomainService->getSampleRate());
    this->frameSizeInSamples = (int) round((float) detectVoiceActivityDomainService->getFrameTimeInMilliseconds() / 1000
                                           * (float) detectVoiceActivityDomainService->getSampleRate());
}

void DetectVoiceActivityUseCase::initialize() {
    this->detectVoiceActivityDomainService->initialize();
}

std::string DetectVoiceActivityUseCase::execute(const std::vector<short> &input) {
    executeForMultipleFrames(input);
    return voiceActivity.getEstimation();
}

std::string DetectVoiceActivityUseCase::execute(const std::vector<unsigned char> &input) {
    std::vector<short> samplesInShort = convertBytesToShort(input);
    return execute(samplesInShort);
}


void DetectVoiceActivityUseCase::setParameters(float minimumSilenceTimeInSeconds, float minimumVoiceTimeInSeconds) {
    this->voiceActivity.setParameters(minimumSilenceTimeInSeconds,
                                      minimumVoiceTimeInSeconds,
                                      detectVoiceActivityDomainService->getSampleRate());
}

void DetectVoiceActivityUseCase::destroy() {
    this->detectVoiceActivityDomainService->destroy();
}

void DetectVoiceActivityUseCase::executeForMultipleFrames(const std::vector<short> &input) {
    for (int i = 0; i < input.size(); i = i + frameSizeInSamples) {
        std::vector<short> frame = std::vector<short>(input.begin() + i,
                                                      input.begin() + i + frameSizeInSamples);
        executeForOneFrame(frame);
    }
}

void DetectVoiceActivityUseCase::executeForOneFrame(const std::vector<short> &input) {
    voiceActivity.evaluateFrameResult(this->detectVoiceActivityDomainService->execute(input),
                                      input.size());
}

std::vector<short> DetectVoiceActivityUseCase::convertBytesToShort(const std::vector<unsigned char> &input) {
    std::vector<short> samples;
    samples.reserve(input.size() / 2);

    /* Convert from little-endian ordering. */
    for (int i = 0; i < input.size() / 2; i++) {
        int s;
        s = input.at(2 * i + 1) << 8 | input.at(2 * i);
        s = ((s & 0xFFFF) ^ 0x8000) - 0x8000;
        samples.push_back(s);
    }

    return samples;
}

