//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_ACTIVITYDETECTOR_H
#define KOUKLAKI_ACTIVITYDETECTOR_H

#include <iostream>
#include <vector>
#include <sstream>

#include "IntArray.h"

class ActivityDetector {
private:
    float thresholdLevel;
    int minActivityLen;
    int minSilenceLen;
    std::vector<float> signalEnvelope;
    int pos;
    IntArray activeZones;

public:
    ActivityDetector(float thresholdLevel, int minActivityLen, int minSilenceLen);

    std::vector<int> process(std::vector<float> &signalEnvelope);

    void setParameters(float thresholdLevelArg, int minActivityLenArg, int minSilenceLenArg);

public:
    enum SegmentType {
        active, silence, undef
    };

private:
    SegmentType scanSegment();

    void addActiveZone(int startPos, int endPos);

};


#endif //KOUKLAKI_ACTIVITYDETECTOR_H
