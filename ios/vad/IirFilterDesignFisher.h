//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_IIRFILTERDESIGNFISHER_H
#define KOUKLAKI_IIRFILTERDESIGNFISHER_H

#include <vector>
#include <cmath>
#include <stdexcept>
#include "Complex.h"
#include "Enumerations.h"
#include "PolesAndZeros.h"
#include "IirFilterCoefficients.h"
#include "PolynomialUtils.h"

class IirFilterDesignFisher {
public:
    std::vector<Complex> getPoles(FilterCharacteristicsType filterCharacteristicsType, int filterOrder, double ripple);
    PolesAndZeros normalize(std::vector<Complex> poles, FilterPassType filterPassType, double fcf1, double fcf2, bool preWarp);

    IirFilterCoefficients design(FilterPassType filterPassType, FilterCharacteristicsType filterCharacteristicsType,
                                           int filterOrder, double ripple, double fcf1, double fcf2);

    std::vector<Complex> doBilinearTransform(const std::vector<Complex> &a);
    Complex doBilinearTransform(Complex x);

    std::vector<Complex> extend(const std::vector<Complex> &a, int n, const Complex &fill);
    std::vector<Complex> doMatchedZTransform(const std::vector<Complex> &a);

    double computeGainAt(PolynomialUtils::RationalFraction tf, Complex w);
    double computeGain(const PolynomialUtils::RationalFraction &tf, FilterPassType filterPassType, double fcf1, double fcf2);

    PolynomialUtils::RationalFraction computeTransferFunction(PolesAndZeros zPlane);

    IirFilterCoefficients computeIirFilterCoefficients(const PolynomialUtils::RationalFraction &tf);

    PolesAndZeros MapSPlaneToZPlane(PolesAndZeros sPlane, SToZMappingMethod sToZMappingMethod);
};


#endif //KOUKLAKI_IIRFILTERDESIGNFISHER_H
