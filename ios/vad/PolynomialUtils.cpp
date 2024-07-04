//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "PolynomialUtils.h"

Complex PolynomialUtils::evaluate(const std::vector<double> &a, const Complex &x) {
    if (a.size() == 0) {
        throw std::invalid_argument("Invalid argument");
    }
    Complex sum(a[0]);
    for (int i = 1; i < a.size(); i++) {
        sum = sum.mul(x).add(Complex(a[i]));
    }
    return sum;
}

Complex PolynomialUtils::evaluate(const RationalFraction &f, const Complex &x) {
    Complex v1 = evaluate(f.top, x);
    Complex v2 = evaluate(f.bottom, x);
    return v1.div(v2);
}

std::vector<double> PolynomialUtils::multiply(const std::vector<double> &a1, const std::vector<double> &a2) {
    int n1 = a1.size() - 1;
    int n2 = a2.size() - 1;
    int n3 = n1 + n2;
    std::vector<double> a3(n3 + 1, 0);
    for (int i = 0; i <= n3; i++) {
        double t = 0;
        int p1 = std::max(0, i - n2);
        int p2 = std::min(n1, i);
        for (int j = p1; j <= p2; j++) {
            t += a1[n1 - j] * a2[n2 - i + j];
        }
        a3[n3 - i] = t;
    }
    return a3;
}

std::vector<Complex> PolynomialUtils::multiply(const std::vector<Complex> &a1, const std::vector<Complex> &a2) {
    int n1 = a1.size() - 1;
    int n2 = a2.size() - 1;
    int n3 = n1 + n2;
    std::vector<Complex> a3(n3 + 1, Complex(0, 0));
    for (int i = 0; i <= n3; i++) {
        Complex t(0, 0);
        int p1 = std::max(0, i - n2);
        int p2 = std::min(n1, i);
        for (int j = p1; j <= p2; j++) {
            t = t.add(a1[n1 - j].mul(a2[n2 - i + j]));
        }
        a3[n3 - i] = t;
    }
    return a3;
}

std::vector<Complex> PolynomialUtils::deflate(const std::vector<Complex> &a, const Complex &z, double eps) {
    int n = a.size() - 1;
    std::vector<Complex> a2(n, Complex(0, 0));
    a2[0] = a[0];
    for (int i = 1; i < n; i++) {
        a2[i] = z.mul(a2[i - 1]).add(a[i]);
    }
    Complex remainder = z.mul(a2[n - 1]).add(a[n]);
    if (eps > 0 && (std::abs(remainder.reFunc()) > eps || std::abs(remainder.imFunc()) > eps)) {
        throw std::runtime_error("Polynomial deflation failed, remainder = " + std::to_string(remainder.reFunc()) + ", " + std::to_string(remainder.imFunc()));
    }
    return a2;
}

std::vector<Complex> PolynomialUtils::expand(const std::vector<Complex> &zeros) {
    int n = zeros.size();
    if (n == 0) {
        return {Complex(1)};
    }
    std::vector<Complex> a = {Complex(1), zeros[0].neg()}; // start with (x - zeros[0])
    for (int i = 1; i < n; i++) {
        std::vector<Complex> a2 = {Complex(1), zeros[i].neg()};
        a = multiply(a, a2);
    }
    return a;
}