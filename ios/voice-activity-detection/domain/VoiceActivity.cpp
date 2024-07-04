//
// Created by Christos Tsakostas on 08/11/2023.
//

#include "VoiceActivity.h"

const std::string VoiceActivity::SILENCE = "SILENCE";
const std::string VoiceActivity::VOICE = "VOICE";
const std::string VoiceActivity::ERROR = "ERROR";
const std::string VoiceActivity::UNKNOWN = "UNKNOWN";

void VoiceActivity::setParameters(float minimumSilenceTimeInSecondsArg, float minimumVoiceTimeInSecondsArg, int sampleRate) {
    this->minimumSilenceTimeInSeconds = minimumSilenceTimeInSecondsArg;
    this->minimumVoiceTimeInSeconds = minimumVoiceTimeInSecondsArg;
    this->minimumSilenceLengthInSamples = round(this->minimumSilenceTimeInSeconds * (float) sampleRate);
    this->minimumVoiceLengthInSamples = round(this->minimumVoiceTimeInSeconds * (float) sampleRate);
    this->counterOfSilenceLengthInSamples = 0;
    this->counterOfVoiceLengthInSamples = 0;
    this->latestEstimation = VoiceActivity::UNKNOWN;
}

void VoiceActivity::evaluateFrameResult(const std::string& voiceActivityFrameResult, int frameSizeInSamples) {
    if (voiceActivityFrameResult == VoiceActivity::SILENCE) {
        this->counterOfSilenceLengthInSamples += frameSizeInSamples;
        this->counterOfVoiceLengthInSamples = 0;
    } else if (voiceActivityFrameResult == VoiceActivity::VOICE) {
        this->counterOfSilenceLengthInSamples = 0;
        this->counterOfVoiceLengthInSamples += frameSizeInSamples;
    } else {
        this->counterOfSilenceLengthInSamples = 0;
        this->counterOfVoiceLengthInSamples = 0;
    }
}

std::string VoiceActivity::getEstimation() {
    if (this->counterOfSilenceLengthInSamples >= this->minimumSilenceLengthInSamples) {
        this->latestEstimation = VoiceActivity::SILENCE;
    } else if (this->counterOfVoiceLengthInSamples >= this->minimumVoiceLengthInSamples) {
        this->latestEstimation = VoiceActivity::VOICE;
    }

    return this->latestEstimation;
}
