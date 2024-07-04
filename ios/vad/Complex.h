#ifndef COMPLEX_H
#define COMPLEX_H

#include <cmath>
#include <iostream>

class Complex {
private:
    double re;
    double im;

public:
    static const Complex I;
    static const Complex ZERO;
    static const Complex ONE;
    static const Complex TWO;
    static const Complex NaN;
    static const Complex INF;

    Complex();
    Complex(double re, double im);
    Complex(double re);

    double reFunc() const;
    double imFunc() const;
    double toDouble(double eps);
    bool isNaN() const;
    bool isInfinite() const;
    double abs() const;
    double arg() const;
    Complex conj() const;
    Complex neg() const;
    Complex reciprocal() const;
    Complex exp() const;
    Complex log() const;
    Complex sqr() const;
    Complex sqrt() const;
    Complex add(double x) const;
    Complex add(Complex x) const;
    Complex sub(double x) const;
    Complex sub(Complex x) const;
    static Complex sub(double x, Complex y);
    Complex mul(double x) const;
    Complex mul(Complex x) const;
    Complex div(double x) const;
    Complex div(Complex x) const;
    static Complex div(double x, Complex y);
    Complex pow(int x) const;
    Complex pow(double x) const;
    Complex pow(Complex x) const;
    bool equals(Complex x, double eps) const;
    bool operator==(const Complex &x) const;
    std::string toString() const;
    static Complex expj(double arg);

    friend std::ostream &operator<<(std::ostream &os, const Complex &c);

private:
    static Complex fromPolar(double abs, double arg);
};

#endif // COMPLEX_H
