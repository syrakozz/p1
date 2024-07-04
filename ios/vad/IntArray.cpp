//
// Created by Christos Tsakostas on 25/10/2023.
//

#include "IntArray.h"

#include <iostream>
#include <vector>
#include <sstream>


// TODO-TSAK

IntArray::IntArray() {
    initialCapacity = defaultInitialCapacity;
    int x = 0;
}

IntArray::IntArray(int initialCapacity): initialCapacity(initialCapacity) {
    int x = 0;
}

IntArray::IntArray(std::vector<int> a2) {
    int x = 0;
}


//    IntArray() : initialCapacity(defaultInitialCapacity) {}
//
//    IntArray(int initialCapacity) : initialCapacity(initialCapacity) {}
//
//    IntArray(std::vector<int> a2) {
//        this->initialCapacity = defaultInitialCapacity;
//        addAll(a2);
//    }




//void IntArray::clear() {
//    setSize(0);
//}

//int IntArray::getSize() {
//    return size;
//}

//void IntArray::setSize(int newSize) {
//    ensureCapacity(newSize);
//    size = newSize;
//}

void IntArray::add(int element) {
    ensureCapacity(size + 1);
    a.push_back(element);
    size++;
}

//void IntArray::addAll(std::vector<int> a2) {
//    int p = size;
//    setSize(size + a2.size());
//    for (auto element: a2) {
//        a[p++] = element;
//    }
//}

//void IntArray::set(int index, int element) {
//    a[index] = element;
//}
//
//int IntArray::get(int index) {
//    return a[index];
//}

void IntArray::ensureCapacity(int minCapacity) {
    int oldCapacity = a.size();
    if (oldCapacity >= minCapacity) {
        return;
    }
    int newCapacity = std::max(std::max(minCapacity, 2 * oldCapacity), initialCapacity);
    if (newCapacity <= 0) {
        return;
    }
    std::vector<int> newArray(newCapacity);
    for (int i = 0; i < size; i++) {
        newArray[i] = a[i];
    }
    a = newArray;
}

std::vector<int> IntArray::toArray() {
    std::vector<int> a2(size);
    if (size > 0) {
        std::copy(a.end() - size, a.end(), a2.begin());
    }
    return a2;
}

//std::string IntArray::toString(std::string delimiter) {
//    std::stringstream ss;
//    for (int p = 0; p < size; p++) {
//        if (p > 0) {
//            ss << delimiter;
//        }
//        ss << std::to_string(a[p]);
//    }
//    return ss.str();
//}

//friend std::ostream &operator<<(std::ostream &os, const IntArray &obj) {
//    os << obj.toString(" ");
//    return os;
//}

//IntArray IntArray::parse(std::string s) {
//    IntArray a;
//    int p = 0;
//    while (true) {
//        int p0 = skipListDelimiters(s, p, true);
//        if (p0 >= s.length()) {
//            break;
//        }
//        p = skipListDelimiters(s, p0, false);
//        int i = std::stoi(s.substr(p0, p - p0));
//        a.add(i);
//    }
//    return a;
//}

//IntArray * IntArray::parseOrNull(std::string s) {
//    IntArray *a = nullptr;
//    int p = 0;
//    while (true) {
//        int p0 = skipListDelimiters(s, p, true);
//        if (p0 >= s.length()) {
//            break;
//        }
//        p = skipListDelimiters(s, p0, false);
//        int i = std::stoi(s.substr(p0, p - p0));
//        if (a == nullptr) {
//            a = new IntArray();
//        }
//        a->add(i);
//    }
//    return a;
//}

//int IntArray::skipListDelimiters(std::string s, int p, bool mode) {
//    while (p < s.length()) {
//        char c = s[p];
//        if ((std::isspace(c) || c == ',' || c == ';' || c == '+') != mode) {
//            break;
//        }
//        p++;
//    }
//    return p;
//}

//bool IntArray::equals(IntArray &other) {
//    if (this == &other) {
//        return true;
//    }
//    if (other.getSize() != size) {
//        return false;
//    }
//    if (size == 0) {
//        return true;
//    }
//    std::vector<int> a2 = other.toArray();
//    for (int i = 0; i < size; i++) {
//        if (a[i] != a2[i]) {
//            return false;
//        }
//    }
//    return true;
//}
//
//int IntArray::hashCode() {
//    int hashCode = 1;
//    for (int i = 0; i < size; i++) {
//        hashCode = 31 * hashCode + a[i];
//    }
//    return hashCode;
//}
//
//IntArray IntArray::unpack(std::vector<char> b, int p0, int bitsPerEntry, int n) {
//    IntArray a;
//    a.setSize(n);
//    int vMask = (1 << bitsPerEntry) - 1;
//    int ip = p0;
//    int op = 0;
//    int w = 0;
//    int bits = 0;
//    while (op < n) {
//        if (bits >= bitsPerEntry) {
//            int v = (w >> (bits - bitsPerEntry)) & vMask;
//            a.set(op++, v);
//            bits -= bitsPerEntry;
//        } else {
//            w = ((w & 0x7fffff) << 8) | (b[ip++] & 0xff);
//            bits += 8;
//        }
//    }
//    return a;
//}
