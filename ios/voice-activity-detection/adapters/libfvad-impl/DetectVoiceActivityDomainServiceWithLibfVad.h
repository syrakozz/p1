//
// Created by Christos Tsakostas on 02/11/2023.
//

#ifndef CXX_DETECTVOICEACTIVITYDOMAINSERVICEWITHLIBFVAD_H
#define CXX_DETECTVOICEACTIVITYDOMAINSERVICEWITHLIBFVAD_H

#include <vector>
#include <string>

#include "../../domain/DetectVoiceActivityDomainService.h"
#include "./libfvad/include/fvad.h"


class DetectVoiceActivityDomainServiceWithLibfVad : public DetectVoiceActivityDomainService {
private:
    Fvad *vad;

public:
    explicit DetectVoiceActivityDomainServiceWithLibfVad(int sampleRate, int frameTimeInMilliseconds);

    void initialize() override;

    std::string execute(std::vector<short> input) override;

    void destroy() override;
};


#endif //CXX_DETECTVOICEACTIVITYDOMAINSERVICEWITHLIBFVAD_H
