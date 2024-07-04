//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_ENVELOPEDETECTOR_H
#define KOUKLAKI_ENVELOPEDETECTOR_H

#include <cmath>
#include <vector>
#include <algorithm>
#include <stdexcept>
#include "IirFilterCoefficients.h"
#include "IirFilter.h"


class EnvelopeDetector {

private:
    IirFilter iirFilter;
    double gAttack;
    double gRelease;
    double level = 0;

public:
    EnvelopeDetector(int samplingRate);
    EnvelopeDetector(int samplingRate, double attackTime, double releaseTime, IirFilter iirFilter);

private:
    void init(int samplingRate, double attackTime, double releaseTime, IirFilter iirFilter);

public:
    double step(double inputValue);

    std::vector<float> process(std::vector<float> &in);
};


#endif //KOUKLAKI_ENVELOPEDETECTOR_H
