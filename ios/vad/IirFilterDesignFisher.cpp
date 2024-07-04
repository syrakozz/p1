//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "IirFilterDesignFisher.h"
#include "ArrayUtils.h"
#include "PolynomialUtils.h"

std::vector<Complex>
IirFilterDesignFisher::getPoles(FilterCharacteristicsType filterCharacteristicsType, int filterOrder, double ripple) {
    switch (filterCharacteristicsType) {
        case bessel: {
            // Implement BesselFilterDesign::computePoles(filterOrder)
            std::vector<Complex> poles;
            // implementation
            return poles;
        }
        case butterworth: {
            std::vector<Complex> poles(filterOrder);
            for (int i = 0; i < filterOrder; i++) {
                double theta = (filterOrder / 2.0 + 0.5 + i) * M_PI / filterOrder;
                poles[i] = Complex::expj(theta);
            }
            return poles;
        }
        case chebyshev: {
            if (ripple >= 0.0) {
                throw std::invalid_argument("Chebyshev ripple must be negative.");
            }
            auto poles = getPoles(butterworth, filterOrder, 0);
            double rip = std::pow(10, -ripple / 10);
            double eps = std::sqrt(rip - 1);
            double y = asinh(1.0 / eps) / filterOrder;
            if (y <= 0) {
                throw std::runtime_error("Assertion error");
            }
            double sinhY = std::sinh(y);
            double coshY = std::cosh(y);
            for (int i = 0; i < filterOrder; i++) {
                poles[i] = Complex(poles[i].reFunc() * sinhY, poles[i].imFunc() * coshY);
            }
            return poles;
        }
        default:
            throw std::runtime_error("Filter characteristics type not yet implemented.");
    }
}

PolesAndZeros
IirFilterDesignFisher::normalize(std::vector<Complex> poles, FilterPassType filterPassType, double fcf1, double fcf2,
                                 bool preWarp) {
    int n = poles.size();
    bool fcf2IsRelevant = filterPassType == FilterPassType::bandpass || filterPassType == FilterPassType::bandstop;
    if (fcf1 <= 0 || fcf1 >= 0.5) {
        throw std::invalid_argument("Invalid fcf1.");
    }
    if (fcf2IsRelevant && (fcf2 <= 0 || fcf2 >= 0.5)) {
        throw std::invalid_argument("Invalid fcf2.");
    }
    double fcf1Warped = tan(M_PI * fcf1) / M_PI;
    double fcf2Warped = fcf2IsRelevant ? tan(M_PI * fcf2) / M_PI : 0;
    double w1 = 2 * M_PI * (preWarp ? fcf1Warped : fcf1);
    double w2 = 2 * M_PI * (preWarp ? fcf2Warped : fcf2);

    switch (filterPassType) {
        case FilterPassType::lowpass: {
            PolesAndZeros sPlane;
            sPlane.poles = ArrayUtils::multiply(poles, w1);
            sPlane.zeros = ArrayUtils::zeros(0); // no zeros
            return sPlane;
        }
        case FilterPassType::highpass: {
            PolesAndZeros sPlane;
            sPlane.poles = std::vector<Complex>(n);
            for (int i = 0; i < n; i++) {
                sPlane.poles[i] = Complex::div(w1, poles[i]);
            }
            sPlane.zeros = ArrayUtils::zeros(n); // n zeros at (0, 0)
            return sPlane;
        }
        case FilterPassType::bandpass: {
            double w0 = sqrt(w1 * w2);
            double bw = w2 - w1;
            PolesAndZeros sPlane;
            sPlane.poles = std::vector<Complex>(2 * n);
            for (int i = 0; i < n; i++) {
                Complex hba = poles[i].mul(bw / 2);
                Complex temp = Complex::sub(1, Complex::div(w0, hba).sqr()).sqrt();
                sPlane.poles[i] = hba.mul(temp.add(1));
                sPlane.poles[n + i] = hba.mul(Complex::sub(1, temp));
            }
            sPlane.zeros = ArrayUtils::zeros(n); // n zeros at (0, 0)
            return sPlane;
        }
        case FilterPassType::bandstop: {
            double w0 = sqrt(w1 * w2);
            double bw = w2 - w1;
            PolesAndZeros sPlane;
            sPlane.poles = std::vector<Complex>(2 * n);
            for (int i = 0; i < n; i++) {
                Complex hba = Complex::div(bw / 2, poles[i]);
                Complex temp = Complex::sub(1, Complex::div(w0, hba).sqr()).sqrt();
                sPlane.poles[i] = hba.mul(temp.add(1));
                sPlane.poles[n + i] = hba.mul(Complex::sub(1, temp));
            }
            sPlane.zeros = std::vector<Complex>(2 * n);
            for (int i = 0; i < n; i++) { // 2n zeros at (0, +-w0)
                sPlane.zeros[i] = Complex(0, w0);
                sPlane.zeros[n + i] = Complex(0, -w0);
            }
            return sPlane;
        }
        default:
            throw std::runtime_error("Filter pass type not yet implemented.");
    }
}

std::vector<Complex> IirFilterDesignFisher::doBilinearTransform(const std::vector<Complex> &a) {
    std::vector<Complex> a2(a.size());
    for (int i = 0; i < a.size(); i++) {
        a2.at(i) = doBilinearTransform(a.at(i));
    }
    return a2;
}

Complex IirFilterDesignFisher::doBilinearTransform(Complex x) {
    return x.add(2).div(Complex::sub(2, x));
}

std::vector<Complex> IirFilterDesignFisher::extend(const std::vector<Complex> &a, int n, const Complex &fill) {
    if (a.size() >= n) {
        return a;
    }
    std::vector<Complex> a2(n);
    for (int i = 0; i < a.size(); i++) {
        a2[i] = a[i];
    }
    for (int i = a.size(); i < n; i++) {
        a2[i] = fill;
    }
    return a2;
}


std::vector<Complex> IirFilterDesignFisher::doMatchedZTransform(const std::vector<Complex> &a) {
    std::vector<Complex> a2(a.size());
    for (int i = 0; i < a.size(); i++) {
        a2[i] = a[i].exp(); // You should define the exp() function for the Complex type
    }
    return a2;
}


PolesAndZeros IirFilterDesignFisher::MapSPlaneToZPlane(PolesAndZeros sPlane, SToZMappingMethod sToZMappingMethod) {
    switch (sToZMappingMethod) {
        case bilinearTransform: {
            PolesAndZeros zPlane;
            zPlane.poles = doBilinearTransform(sPlane.poles);
            std::vector<Complex> a = doBilinearTransform(sPlane.zeros);
            zPlane.zeros = extend(a, sPlane.poles.size(), Complex(-1)); // extend zeros with -1 to the number of poles
            return zPlane;
        }
        case matchedZTransform: {
            PolesAndZeros zPlane;
            zPlane.poles = doMatchedZTransform(sPlane.poles);
            zPlane.zeros = doMatchedZTransform(sPlane.zeros);
            return zPlane;
        }
        default:
            throw std::runtime_error("Mapping method not yet implemented.");
    }
}


PolynomialUtils::RationalFraction IirFilterDesignFisher::computeTransferFunction(PolesAndZeros zPlane) {
    std::vector<Complex> topCoeffsComplex = PolynomialUtils::expand(zPlane.zeros);
    std::vector<Complex> bottomCoeffsComplex = PolynomialUtils::expand(zPlane.poles);
    const double eps = 1E-10;
    PolynomialUtils::RationalFraction tf;
    // Conversion of Complex coefficients to double
    tf.top = ArrayUtils::toDouble(topCoeffsComplex, eps);
    tf.bottom = ArrayUtils::toDouble(bottomCoeffsComplex, eps);
    // If the toDouble() conversion fails because the coefficients are not real numbers, the poles
    // and zeros are not complex conjugates.
    return tf;
}

double IirFilterDesignFisher::computeGainAt(PolynomialUtils::RationalFraction tf, Complex w) {
    return PolynomialUtils::evaluate(tf, w).abs();
}

double IirFilterDesignFisher::computeGain(const PolynomialUtils::RationalFraction &tf, FilterPassType filterPassType,
                                          double fcf1, double fcf2) {
    switch (filterPassType) {
        case lowpass: {
            return computeGainAt(tf, Complex(1, 0));
        } // DC gain
        case highpass: {
            return computeGainAt(tf, Complex(-1, 0));
        } // gain at Nyquist frequency
        case bandpass: {
            double centerFreq = (fcf1 + fcf2) / 2;
            Complex w(std::cos(2 * M_PI * centerFreq), std::sin(2 * M_PI * centerFreq));
            return computeGainAt(tf, w);
        } // gain at center frequency
        case bandstop: {
            double dcGain = computeGainAt(tf, Complex(1, 0));
            double hfGain = computeGainAt(tf, Complex(-1, 0));
            return std::sqrt(dcGain * hfGain);
        }
        default: {
            throw std::runtime_error("Unsupported filter pass type.");
        }
    }
}


IirFilterCoefficients IirFilterDesignFisher::computeIirFilterCoefficients(const PolynomialUtils::RationalFraction &tf) {
    // Note that compared to the original C code by Tony Fisher the order of the A/B coefficients
    // is reverse and the A coefficients are negated.
    double scale = tf.bottom[0];
    IirFilterCoefficients coeffs;
    coeffs.a = ArrayUtils::divide(tf.bottom, scale);
    coeffs.a[0] = 1; // to ensure that it's exactly 1
    coeffs.b = ArrayUtils::divide(tf.top, scale);
    return coeffs;
}


IirFilterCoefficients
IirFilterDesignFisher::design(FilterPassType filterPassType, FilterCharacteristicsType filterCharacteristicsType,
                              int filterOrder, double ripple, double fcf1, double fcf2) {
    std::vector<Complex> poles = getPoles(filterCharacteristicsType, filterOrder, ripple);
    SToZMappingMethod sToZMappingMethod = (filterCharacteristicsType == bessel)
                                          ? matchedZTransform
                                          : bilinearTransform;
    bool preWarp = sToZMappingMethod == bilinearTransform;
    PolesAndZeros sPlane = normalize(poles, filterPassType, fcf1, fcf2, preWarp);
    // System.out.println(ArrayUtils.toString(sPlane.poles));
    PolesAndZeros zPlane = MapSPlaneToZPlane(sPlane, sToZMappingMethod);
    // System.out.println(ArrayUtils.toString(zPlane.zeros));
    // System.out.println(ArrayUtils.toString(zPlane.poles));
    PolynomialUtils::RationalFraction tf = computeTransferFunction(zPlane);
    double gain = computeGain(tf, filterPassType, fcf1, fcf2);
    // System.out.println("gain=" + gain);
    IirFilterCoefficients coeffs = computeIirFilterCoefficients(tf);
    // System.out.println(ArrayUtils.toString(coeffs.a));
    // System.out.println(ArrayUtils.toString(coeffs.b));
    coeffs.b = ArrayUtils::divide(coeffs.b, gain);           // gain normalization
    return coeffs;
}

