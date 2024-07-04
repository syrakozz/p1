//
// Created by Christos Tsakostas on 26/10/2023.
//

#ifndef KOUKLAKI_VOICEACTIVITYDETECTION_H
#define KOUKLAKI_VOICEACTIVITYDETECTION_H

#include <vector>

#include "../OpusCodec.h"
#include "ActivityDetector.h"
#include "EnvelopeDetector.h"

class VoiceActivityDetection {
private:
    OpusCodec opusCodec;
    EnvelopeDetector envelopeDetector;
    ActivityDetector activityDetector;
    std::vector<float> buffer;
    int bufferSizeWithExtraSpace;
    void (*vadCallback)(std::string status);
    std::string previousDetection;

public:
    VoiceActivityDetection();
    virtual ~VoiceActivityDetection();

    void setParameters(float thresholdLevelArg, float minActivityTimeArg, float minSilenceTimeArg);

    void registerVadCallback(void (*vadCallback)(std::string status));

    std::string streamOpusData(const std::vector<unsigned char>& input);

    std::string streamPcmData(const std::vector<unsigned char>& input);

    void stopStreaming();

private:
    std::vector<int> checkVoiceActivity(std::vector<float> envelope);
    static std::vector<short> convertBytesToShort(const std::vector<unsigned char> &input);
    static std::vector<float> convertShortToFloat(const std::vector<short> &input);
};

#endif //KOUKLAKI_VOICEACTIVITYDETECTION_H
