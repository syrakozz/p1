//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "IirFilter.h"


#include <vector>
#include <stdexcept>
#include "IirFilterCoefficients.h"

IirFilter::IirFilter() {

}

IirFilter::IirFilter(const IirFilterCoefficients &coeffs) : a(coeffs.a), b(coeffs.b) {
    if (a.size() < 1 || b.size() < 1 || a[0] != 1.0) {
        throw std::invalid_argument("Invalid coefficients.");
    }
    n1 = b.size() - 1;
    n2 = a.size() - 1;
    buf1 = std::vector<double>(n1);
    buf2 = std::vector<double>(n2);
}


double IirFilter::step(double inputValue) {
    double acc = b[0] * inputValue;
    for (int j = 1; j <= n1; j++) {
        int p = (pos1 + n1 - j) % n1;
        acc += b[j] * buf1[p];
    }
    for (int j = 1; j <= n2; j++) {
        int p = (pos2 + n2 - j) % n2;
        acc -= a[j] * buf2[p];
    }
    if (n1 > 0) {
        buf1[pos1] = inputValue;
        pos1 = (pos1 + 1) % n1;
    }
    if (n2 > 0) {
        buf2[pos2] = acc;
        pos2 = (pos2 + 1) % n2;
    }
    return acc;
}

