#include <iostream>
using namespace std;

struct ListElement {
    ListElement *pNext;
    int Value;
};

struct List {
    ListElement *pFirst;
};

int main () {
    List llstMyList;
    ListElement llelCurrent;
    ListElement *plelListMarker = NULL;
    ListElement *plelCurrent = &llelCurrent;
    
    llstMyList.pFirst = &llelCurrent;
    
    //----
    // loop to make list elements
    //----
    for(int II = 0; II < 10; II++) {
        ListElement lobjEl;
        lobjEl.Value = II;
        plelCurrent->pNext = &lobjEl;
        plelCurrent = &lobjEl;
        cout << II << ": " << lobjEl.Value << ": " << lobjEl.pNext << ": " << plelCurrent->Value << ": " << plelCurrent->pNext << endl;
    }
    
    //----
    // reverse list in one pass
    //----
    // 
    plelListMarker = llstMyList.pFirst;
    plelCurrent = llstMyList.pFirst;
    
    //----
    // get the address of the current element,
    //      set the current element to the next element
    //      set the new current element's pNext to previous element address
    //----
    //while (plelListMarker->pNext) {
    for (int II = 0; II < 10; II++) {
        /*ListElement *plelReverse = plelCurrent;
        plelCurrent = plelCurrent->pNext;
        plelCurrent->pNext = plelReverse;*/
        cout << plelListMarker->Value << endl;
        
        //----
        // increment marker
        //----
        plelListMarker = plelListMarker->pNext;
    }
    
    //----
    // print out new list
    //----
    
    return 0;
}
