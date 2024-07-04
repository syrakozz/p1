//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "ArrayUtils.h"


/**
 * Returns an array of <code>n</code> <code>Complex</code> zeros.
 */
vector<Complex> ArrayUtils::zeros(int n) {
    vector<Complex> a(n, Complex(0, 0));
    return a;
}

//--- Type conversion ----------------------------------------------------------

/**
 * Converts a <code>Complex</code> array into a <code>double</code> array.
 * Verifies that all imaginary parts are equal or below <code>eps</code>.
 */
vector<double> ArrayUtils::toDouble(const vector<Complex> &a, double eps) {
    vector<double> a2;
    for (auto &i : a) {
        if (abs(i.imFunc()) > eps) {
            throw runtime_error("Complex value with non-zero imaginary part found.");
        }
        a2.push_back(i.reFunc());
    }
    return a2;
}

/**
 * Converts a <code>double</code> array into a <code>Complex</code> array.
 */
vector<Complex> ArrayUtils::toComplex(const vector<double> &a) {
    vector<Complex> a2;
    for (auto &i : a) {
        a2.emplace_back(i, 0);
    }
    return a2;
}

//--- Arithmetic ---------------------------------------------------------------

/**
 * Returns a new array where each element of the array <code>a</code> is multiplied with the factor <code>f</code>.
 */
vector<double> ArrayUtils::multiply(const vector<double> &a, double f) {
    vector<double> a2;
    for (auto &i : a) {
        a2.push_back(i * f);
    }
    return a2;
}

/**
 * Returns a new array where each element of the array <code>a</code> is multiplied with the factor <code>f</code>.
 */
vector<Complex> ArrayUtils::multiply(const vector<Complex> &a, double f) {
    vector<Complex> a2;
    for (auto &i : a) {
        a2.push_back(i.mul(f));
    }
    return a2;
}

/**
 * Returns a new array where each element of the array <code>a</code> is divided by <code>f</code>.
 */
vector<double> ArrayUtils::divide(const vector<double> &a, double f) {
    vector<double> a2;
    for (auto &i : a) {
        a2.push_back(i / f);
    }
    return a2;
}

/**
 * Returns a new array where each element of the array <code>a</code> is divided by <code>f</code>.
 */
vector<Complex> ArrayUtils::divide(const vector<Complex> &a, double f) {
    vector<Complex> a2;
    for (auto &i : a) {
        a2.push_back(i.div(f));
    }
    return a2;
}

//--- Reorder / sort -----------------------------------------------------------

/**
 * Returns a reverse copy of the passed array.
 */
vector<double> ArrayUtils::reverse(const vector<double> &a) {
    vector<double> a2(a.rbegin(), a.rend());
    return a2;
}

vector<Complex> ArrayUtils::sortByImRe(vector<Complex> a) {
    sort(a.begin(), a.end(), [](const Complex &c1, const Complex &c2) {
        if (c1.imFunc() < c2.imFunc()) {
            return true;
        } else if (c1.imFunc() > c2.imFunc()) {
            return false;
        }
        return c1.reFunc() < c2.reFunc();
    });
    return a;
}
