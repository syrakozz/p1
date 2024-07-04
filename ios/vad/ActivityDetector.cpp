//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "ActivityDetector.h"
#include <vector>
#include "IntArray.h"


ActivityDetector::ActivityDetector(float thresholdLevel, int minActivityLen, int minSilenceLen) :
        thresholdLevel(thresholdLevel),
        minActivityLen(minActivityLen),
        minSilenceLen(minSilenceLen) {
    ;
}

void ActivityDetector::setParameters(float thresholdLevelArg, int minActivityLenArg, int minSilenceLenArg) {
    this->thresholdLevel = thresholdLevelArg;
    this->minActivityLen = minActivityLenArg;
    this->minSilenceLen = minSilenceLenArg;
}

std::vector<int> ActivityDetector::process(std::vector<float> &signalEnvelope) {
    this->signalEnvelope = signalEnvelope;
    pos = 0;
    activeZones = IntArray(32);
    int activeStartPos = -1;
    int undefStartPos = -1;
    while (pos < signalEnvelope.size()) {
        int segmentStartPos = pos;
        SegmentType segmentType = scanSegment();
        switch (segmentType) {
            case silence: {
                if (activeStartPos != -1) {
                    addActiveZone(activeStartPos, segmentStartPos);
                    activeStartPos = -1;
                }
                undefStartPos = -1;
                break;
            }
            case active: {
                if (activeStartPos == -1) {
                    activeStartPos = (undefStartPos != -1) ? undefStartPos : segmentStartPos;
                }
                break;
            }
            case undef: {
                if (undefStartPos == -1) {
                    undefStartPos = segmentStartPos;
                }
                break;
            }
            default:
                throw "Assertion Error";
        }
    }
    if (activeStartPos != -1) {
        addActiveZone(activeStartPos, pos);
    }
    return activeZones.toArray();
}


ActivityDetector::SegmentType ActivityDetector::scanSegment() {
    int startPos = pos;
    if (pos >= signalEnvelope.size()) {
        throw "Assertion Error";
    }
    bool active = signalEnvelope[pos++] >= thresholdLevel;
    while (pos < signalEnvelope.size() && (signalEnvelope[pos] >= thresholdLevel) == active) {
        pos++;
    }
    int minLen = active ? minActivityLen : minSilenceLen;
    if (pos - startPos < minLen) {
        return SegmentType::undef;
    }
    return active ? SegmentType::active : SegmentType::silence;
}

void ActivityDetector::addActiveZone(int startPos, int endPos) {
    activeZones.add(startPos);
    activeZones.add(endPos);
}
