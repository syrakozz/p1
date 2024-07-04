//
// Created by Christos Tsakostas on 02/11/2023.
//

#include "DetectVoiceActivityDomainServiceWithLibfVad.h"
#include "../../domain/VoiceActivity.h"

DetectVoiceActivityDomainServiceWithLibfVad::DetectVoiceActivityDomainServiceWithLibfVad(int sampleRate,
                                                                                         int frameTimeInMilliseconds)
        : DetectVoiceActivityDomainService(sampleRate, frameTimeInMilliseconds) {
    this->vad = nullptr;
}

void DetectVoiceActivityDomainServiceWithLibfVad::initialize() {
    vad = fvad_new();
    if (!vad) {
        fprintf(stderr, "out of memory\n");
    }

    fvad_set_sample_rate(vad, getSampleRate());
}

std::string DetectVoiceActivityDomainServiceWithLibfVad::execute(std::vector<short> input) {
    int result = fvad_process(vad, input.data(), input.size());

    if (result < 0) {
        fprintf(stderr, "VAD processing failed\n");
    }

    if (result == -1) {
        return VoiceActivity::ERROR;
    } else {
        result = !!result; // make sure it is 0 or 1
        return result > 0 ? VoiceActivity::VOICE : VoiceActivity::SILENCE;
    }
}

void DetectVoiceActivityDomainServiceWithLibfVad::destroy() {
    if (vad) {
        fvad_free(vad);
    }
}
