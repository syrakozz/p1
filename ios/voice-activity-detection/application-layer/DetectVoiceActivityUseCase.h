//
// Created by Christos Tsakostas on 02/11/2023.
//

#ifndef CXX_DETECTVOICEACTIVITYUSECASE_H
#define CXX_DETECTVOICEACTIVITYUSECASE_H

#include <iostream>
#include <vector>
#include <string>

#include "../domain/DetectVoiceActivityDomainService.h"
#include "../domain/VoiceActivity.h"

class DetectVoiceActivityUseCase {
private:
    DetectVoiceActivityDomainService *detectVoiceActivityDomainService;
    VoiceActivity voiceActivity;
    int frameSizeInSamples;

public:
    explicit DetectVoiceActivityUseCase(DetectVoiceActivityDomainService *detectVoiceActivityDomainService,
                                        float minimumSilenceTimeInSeconds,
                                        float minimumVoiceTimeInSeconds);

    void initialize();

    std::string execute(const std::vector<short> &input);

    std::string execute(const std::vector<unsigned char> &input);


    void setParameters(float minimumSilenceTimeInSeconds,
                       float minimumVoiceTimeInSeconds);

    void destroy();

private:
    void executeForMultipleFrames(const std::vector<short> &input);

    void executeForOneFrame(const std::vector<short> &input);

    static std::vector<short> convertBytesToShort(const std::vector<unsigned char> &input);

};


#endif //CXX_DETECTVOICEACTIVITYUSECASE_H
