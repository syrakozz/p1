
#include "Complex.h"

const Complex Complex::I = Complex(0, 1);
const Complex Complex::ZERO = Complex(0);
const Complex Complex::ONE = Complex(1);
const Complex Complex::TWO = Complex(2);
const Complex Complex::NaN = Complex(NAN, NAN);
const Complex Complex::INF = Complex(INFINITY, INFINITY);

Complex::Complex() {
}

Complex::Complex(double re, double im) : re(re), im(im) {}

Complex::Complex(double re) : re(re), im(0) {}

double Complex::reFunc() const {
    return re;
}

double Complex::imFunc() const {
    return im;
}

double Complex::toDouble(double eps) {
    double absIm = std::abs(im);
    if (absIm > eps && absIm > std::abs(re) * eps) {
        throw std::runtime_error("The imaginary part of the complex number is not neglectable small for the conversion to a real number. reFunc=" + std::to_string(re) + " imFunc=" + std::to_string(im) + " eps=" + std::to_string(eps) + ".");
    }
    return re;
}

bool Complex::isNaN() const {
    return std::isnan(re) || std::isnan(im);
}

bool Complex::isInfinite() const {
    return std::isinf(re) || std::isinf(im);
}

double Complex::abs() const {
    return std::hypot(re, im);
}

double Complex::arg() const {
    return std::atan2(im, re);
}

Complex Complex::conj() const {
    return Complex(re, -im);
}

Complex Complex::neg() const {
    return Complex(-re, -im);
}

Complex Complex::reciprocal() const {
    if (isNaN()) {
        return NaN;
    }
    if (isInfinite()) {
        return ZERO;
    }
    double scale = re * re + im * im;
    if (scale == 0) {
        return INF;
    }
    return Complex(re / scale, -im / scale);
}

Complex Complex::exp() const {
    return fromPolar(std::exp(re), im);
}

Complex Complex::log() const {
    return Complex(std::log(abs()), arg());
}

Complex Complex::sqr() const {
    return Complex(re * re - im * im, 2 * re * im);
}

Complex Complex::sqrt() const {
    if (re == 0 && im == 0) {
        return ZERO;
    }
    double m = abs();
    return Complex(std::sqrt((m + re) / 2), std::copysign(1, im) * std::sqrt((m - re) / 2));
}

Complex Complex::add(double x) const {
    return Complex(re + x, im);
}

Complex Complex::add(Complex x) const {
    return Complex(re + x.re, im + x.im);
}

Complex Complex::sub(double x) const {
    return Complex(re - x, im);
}

Complex Complex::sub(Complex x) const {
    return Complex(re - x.re, im - x.im);
}

Complex Complex::sub(double x, Complex y) {
    return Complex(x - y.re, -y.im);
}

Complex Complex::mul(double x) const {
    return Complex(re * x, im * x);
}

Complex Complex::mul(Complex x) const {
    return Complex(re * x.re - im * x.im, re * x.im + im * x.re);
}

Complex Complex::div(double x) const {
    return Complex(re / x, im / x);
}

Complex Complex::div(Complex x) const {
    double m = x.re * x.re + x.im * x.im;
    return Complex((re * x.re + im * x.im) / m, (im * x.re - re * x.im) / m);
}

Complex Complex::div(double x, Complex y) {
    double m = y.re * y.re + y.im * y.im;
    return Complex(x * y.re / m, -x * y.im / m);
}

Complex Complex::pow(int x) const {
    return fromPolar(std::pow(abs(), x), arg() * x);
}

Complex Complex::pow(double x) const {
    return log().mul(x).exp();
}

Complex Complex::pow(Complex x) const {
    return log().mul(x).exp();
}

bool Complex::equals(Complex x, double eps) const {
    return std::abs(reFunc() - x.reFunc()) <= eps && std::abs(imFunc() - x.imFunc()) <= eps;
}

bool Complex::operator==(const Complex &x) const {
    return re == x.re && im == x.im;
}

std::string Complex::toString() const {
    return "(" + std::to_string(re) + ", " + std::to_string(im) + ")";
}

std::ostream &operator<<(std::ostream &os, const Complex &c) {
    os << c.toString();
    return os;
}

Complex Complex::fromPolar(double abs, double arg) {
    return Complex(abs * std::cos(arg), abs * std::sin(arg));
}

Complex Complex::expj(double arg) {
    return Complex(cos(arg), sin(arg));
}
