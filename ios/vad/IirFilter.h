//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_IIRFILTER_H
#define KOUKLAKI_IIRFILTER_H

#include <iostream>
#include <vector>
#include <sstream>

#include "IirFilterCoefficients.h"

class IirFilter {
private:
    int n1;                           // size of input delay line
    int n2;                           // size of output delay line
    std::vector<double> a;            // A coefficients, applied to output values (negative)
    std::vector<double> b;            // B coefficients, applied to input values
    std::vector<double> buf1;         // input signal delay line (ring buffer)
    std::vector<double> buf2;         // output signal delay line (ring buffer)
    int pos1{};                         // current ring buffer position in buf1
    int pos2{};                         // current ring buffer position in buf2

public:
    IirFilter();
    IirFilter(const IirFilterCoefficients &coeffs);

    double step(double inputValue);
};


#endif //KOUKLAKI_IIRFILTER_H
