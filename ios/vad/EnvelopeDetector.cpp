//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "EnvelopeDetector.h"

#include <cmath>
#include <vector>
#include <algorithm>
#include <stdexcept>
#include "IirFilterCoefficients.h"
#include "IirFilter.h"
#include "IirFilterDesignFisher.h"

// You should define the IirFilter, IirFilterCoefficients, and other related classes here before the EnvelopeDetector class definition.

EnvelopeDetector::EnvelopeDetector(int samplingRate) {
    double attackTime = 0.0015;
    double releaseTime = 0.03;
    double lowerFilterCutoffFreq = 130;
    double upperFilterCutoffFreq = 4700;
    int filterOrder = 4;
    double filterRipple = -0.5;
    double fcf1Rel = lowerFilterCutoffFreq / samplingRate;
    double fcf2Rel = upperFilterCutoffFreq / samplingRate;

    IirFilterDesignFisher iirFilterDesignFisher;
    IirFilterCoefficients coeffs = iirFilterDesignFisher.design(bandpass,
                                                                chebyshev,
                                                                filterOrder,
                                                                filterRipple,
                                                                fcf1Rel,
                                                                fcf2Rel);


    iirFilter = IirFilter(coeffs);
    init(samplingRate, attackTime, releaseTime, iirFilter);
}

EnvelopeDetector::EnvelopeDetector(int samplingRate, double attackTime, double releaseTime, IirFilter iirFilter) {
    init(samplingRate, attackTime, releaseTime, iirFilter);
}

void EnvelopeDetector::init(int samplingRate, double attackTime, double releaseTime, IirFilter iirFilter) {
    gAttack = exp(-1 / (samplingRate * attackTime));
    gRelease = exp(-1 / (samplingRate * releaseTime));
    this->iirFilter = iirFilter;
}

double EnvelopeDetector::step(double inputValue) {
    double prefiltered = (&iirFilter == nullptr) ? inputValue : iirFilter.step(inputValue);
    double inLevel = std::abs(prefiltered);
    double g = (inLevel > level) ? gAttack : gRelease;
    level = g * level + (1 - g) * inLevel;
    return level;
}

std::vector<float> EnvelopeDetector::process(std::vector<float> &in) {
    std::vector<float> out(in.size());
    for (size_t i = 0; i < in.size(); i++) {
        out[i] = static_cast<float>(step(in[i]));
    }
    return out;
}
