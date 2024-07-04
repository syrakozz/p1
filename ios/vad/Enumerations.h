//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_ENUMERATIONS_H
#define KOUKLAKI_ENUMERATIONS_H

enum FilterCharacteristicsType {
    bessel,
    butterworth,
    chebyshev
};

enum FilterPassType {
    lowpass,
    highpass,
    bandpass,
    bandstop
};

enum SToZMappingMethod {
    bilinearTransform,
    matchedZTransform
};



#endif //KOUKLAKI_ENUMERATIONS_H
