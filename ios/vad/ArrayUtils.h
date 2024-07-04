//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_ARRAYUTILS_H
#define KOUKLAKI_ARRAYUTILS_H

#include <iostream>
#include <cmath>
#include <vector>

#include "Complex.h"

using namespace std;

class ArrayUtils {
public:

    //--- Constructors -------------------------------------------------------------

    /**
     * Returns an array of <code>n</code> <code>Complex</code> zeros.
     */
    static vector<Complex> zeros(int n);

    //--- Type conversion ----------------------------------------------------------

    /**
     * Converts a <code>Complex</code> array into a <code>double</code> array.
     * Verifies that all imaginary parts are equal or below <code>eps</code>.
     */
    static vector<double> toDouble(const vector<Complex> &a, double eps);

    /**
     * Converts a <code>double</code> array into a <code>Complex</code> array.
     */
    static vector<Complex> toComplex(const vector<double> &a) ;

    //--- Arithmetic ---------------------------------------------------------------

    /**
     * Returns a new array where each element of the array <code>a</code> is multiplied with the factor <code>f</code>.
     */
    static vector<double> multiply(const vector<double> &a, double f);

    /**
     * Returns a new array where each element of the array <code>a</code> is multiplied with the factor <code>f</code>.
     */
    static vector<Complex> multiply(const vector<Complex> &a, double f);

    /**
     * Returns a new array where each element of the array <code>a</code> is divided by <code>f</code>.
     */
    static vector<double> divide(const vector<double> &a, double f);

    /**
     * Returns a new array where each element of the array <code>a</code> is divided by <code>f</code>.
     */
    static vector<Complex> divide(const vector<Complex> &a, double f);

    //--- Reorder / sort -----------------------------------------------------------

    /**
     * Returns a reverse copy of the passed array.
     */
    static vector<double> reverse(const vector<double> &a);

    static vector<Complex> sortByImRe(vector<Complex> a) ;

};


#endif //KOUKLAKI_ARRAYUTILS_H
