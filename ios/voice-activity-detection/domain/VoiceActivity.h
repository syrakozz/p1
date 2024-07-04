//
// Created by Christos Tsakostas on 08/11/2023.
//

#ifndef CXX_VOICEACTIVITY_H
#define CXX_VOICEACTIVITY_H

#include <string>

class VoiceActivity {
private:
    float minimumSilenceTimeInSeconds;
    float minimumVoiceTimeInSeconds;
    int minimumSilenceLengthInSamples;
    int minimumVoiceLengthInSamples;
    int counterOfSilenceLengthInSamples;
    int counterOfVoiceLengthInSamples;
    std::string latestEstimation;

public:
    static const std::string SILENCE;
    static const std::string VOICE;
    static const std::string ERROR;
    static const std::string UNKNOWN;

public:
    void setParameters(float minimumSilenceTimeInSecondsArg, float minimumVoiceTimeInSecondsArg, int sampleRate);

    void evaluateFrameResult(const std::string& voiceActivityFrameResult, int frameSizeInSamples);

    std::string getEstimation();
};


#endif //CXX_VOICEACTIVITY_H
