//
// Created by Christos Tsakostas on 02/11/2023.
//

#ifndef CXX_DETECTVOICEACTIVITYDOMAINSERVICE_H
#define CXX_DETECTVOICEACTIVITYDOMAINSERVICE_H

#include <vector>
#include <string>

class DetectVoiceActivityDomainService {
private:
    int sampleRate;
    int frameTimeInMilliseconds;

public:
    explicit DetectVoiceActivityDomainService(int sampleRate, int frameTimeInMilliseconds) :
            sampleRate(sampleRate),
            frameTimeInMilliseconds(frameTimeInMilliseconds) {}

    virtual void initialize() = 0;

    virtual std::string execute(std::vector<short> input) = 0;

    virtual void destroy() = 0;

    [[nodiscard]] int getSampleRate() const {
        return sampleRate;
    }

    [[nodiscard]] int getFrameTimeInMilliseconds() const {
        return frameTimeInMilliseconds;
    }
};


#endif //CXX_DETECTVOICEACTIVITYDOMAINSERVICE_H
