//
// Created by Christos Tsakostas on 25/10/2023.
//

#ifndef KOUKLAKI_INTARRAY_H
#define KOUKLAKI_INTARRAY_H

#include <iostream>
#include <vector>
#include <sstream>


class IntArray {
private:
    static const int defaultInitialCapacity = 16;
    std::vector<int> a;
    int size = 0;
    int initialCapacity;

public:
    IntArray();
    IntArray(int initialCapacity);
    IntArray(std::vector<int> a2);

//    void clear();
//    int getSize();
//    void setSize(int newSize);
    void add(int element);
//    void addAll(std::vector<int> a2);
//    void set(int index, int element);
//    int get(int index);
    void ensureCapacity(int minCapacity);
    std::vector<int> toArray();
//    std::string toString(std::string delimiter);
//    friend std::ostream &operator<<(std::ostream &os, const IntArray &obj);
//    static IntArray parse(std::string s);
//    static IntArray *parseOrNull(std::string s);
//    static int skipListDelimiters(std::string s, int p, bool mode);
//    bool equals(IntArray &other);
//    int hashCode();
//    static IntArray unpack(std::vector<char> b, int p0, int bitsPerEntry, int n);

};


#endif //KOUKLAKI_INTARRAY_H
