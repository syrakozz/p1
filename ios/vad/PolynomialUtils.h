//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_POLYNOMIALUTILS_H
#define KOUKLAKI_POLYNOMIALUTILS_H

#include <iostream>
#include <cmath>
#include <vector>
#include "Complex.h"

class PolynomialUtils {
public:
    struct RationalFraction {
        std::vector<double> top; // top polynomial coefficients
        std::vector<double> bottom; // bottom polynomial coefficients
    };

    static Complex evaluate(const std::vector<double> &a, const Complex &x);

    static Complex evaluate(const RationalFraction &f, const Complex &x);

    static std::vector<double> multiply(const std::vector<double> &a1, const std::vector<double> &a2);

    static std::vector<Complex> multiply(const std::vector<Complex> &a1, const std::vector<Complex> &a2);

    static std::vector<Complex> deflate(const std::vector<Complex> &a, const Complex &z, double eps);

    static std::vector<Complex> expand(const std::vector<Complex> &zeros);
};


#endif //KOUKLAKI_POLYNOMIALUTILS_H
