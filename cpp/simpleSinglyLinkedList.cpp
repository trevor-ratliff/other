//====
/// @file simpleSinglyLinkedList.cpp
/// @brief test of a method to reverse a singly linked list in one pass
/// @author Trevor Ratliff
/// @date 2013-09-20
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-09-20  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         file creation  |
/// @endverbatim
//====

#include <iostream>
#include <typeinfo>
using namespace std;

//====
/// @struct SinglyListElement
/// @brief an element of a singly linked list (abreviated as lel - i.e. vlelElement)
/// @author Trevor Ratliff
/// @date 2013-09-20
//
//  Properties:
//      SinglyListElement *pNext -- pointer to next element in the list
//      int Value -- value of element
//      string Type -- a string representing the type of the value
//
//  Methods:
//      SinglyListElement(int) -- constructor that sets the value
//      void Push(SinglyListElement*) -- sets the link to next element
//      SinglyListElement* Next() -- returns the address of the next element
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-09-20  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         class creation  |
/// @endverbatim
//====
struct SinglyListElement {
    SinglyListElement *pNext;
    int Value;
    string Type;
    
    //====
    /// @fn SinglyListElement(int vintValue)
    /// @brief constructor that sets the elements value to vintValue
    /// @author Trevor Ratliff
    /// @date 2013-09-20
    /// @param int vintValue -- value to assign to the element
    /// @return SinglyListElement
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-09-20  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    SinglyListElement(int vintValue) {
        this->pNext = NULL;
        this->Value = vintValue;
        this->Type = typeid(this->Value).name();
    }
    
    //~ void Push(SinglyListElement vlelNext) {
        //~ this->pNext = &vlelNext;
    //~ }
    
    
    //====
    /// @fn void Push(SinglyListElement *plelNext)
    /// @brief creates the link to the next element
    /// @author Trevor Ratliff
    /// @date 2013-09-20
    /// @param SinglyListElement *plelNext -- pointer to the next element
    /// @return void
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     _  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    void Push(SinglyListElement *plelNext) {
        this->pNext = plelNext;
        return;
    }
    
    
    //====
    /// @fn SinglyListElement* Next()
    /// @brief returns the address of the next element
    /// @author Trevor Ratliff
    /// @date 2013-09-20
    /// @return SinglyListElement*
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-09-20  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    SinglyListElement *Next() {
        return this->pNext;
    }
};


//====
/// @fn int main()
/// @brief creates a list and reverses it
/// @author Trevor Ratliff
/// @date 2013-09-20
/// @return int -- 0 on success;
//  
//  Definitions:
//      bool lblnContinue -- loop flag;
//      int lintII -- element counter;
//      SinglyListElement llelStart -- first element in list;
//      SinglyListElement llel[1-9] -- the next elements to make a list;
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-09-20  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====

int main () {
    bool lblnContinue = true;
    int lintII = 0;
    SinglyListElement llelStart = SinglyListElement(0);
    SinglyListElement llel1 = SinglyListElement(1);
    SinglyListElement llel2 = SinglyListElement(2);
    SinglyListElement llel3 = SinglyListElement(3);
    SinglyListElement llel4 = SinglyListElement(4);
    SinglyListElement llel5 = SinglyListElement(5);
    SinglyListElement llel6 = SinglyListElement(6);
    SinglyListElement llel7 = SinglyListElement(7);
    SinglyListElement llel8 = SinglyListElement(8);
    SinglyListElement llel9 = SinglyListElement(9);
    
    SinglyListElement *pMyList = &llelStart;
    SinglyListElement *pMyRev = NULL;
    
    //----
    // output some info
    //----
    cout << endl << "Program creates a Singly Linked List and reverse it" << 
        endl << endl;
    cout << "Ensure pointer access to struct property works" << endl;
    cout << llelStart.pNext << ": " << llelStart.Value << ": " << 
        llelStart.Type << ": " << &llelStart << endl;
    cout << pMyList->pNext << ": " << pMyList->Value << ": " << 
        pMyList->Type << ": " << pMyList << endl << endl;
    
    //----
    // add to list
    //----
    llelStart.Push(&llel1);
    llel1.Push(&llel2);
    llel2.Push(&llel3);
    llel3.Push(&llel4);
    llel4.Push(&llel5);
    llel5.Push(&llel6);
    llel6.Push(&llel7);
    llel7.Push(&llel8);
    llel8.Push(&llel9);
    
    //----
    // print list
    //----
    cout << "The list:" << endl;
    while (lblnContinue) {
        cout << lintII++ << ": value - '" << pMyList->Value << "': next - '" << 
            pMyList->pNext << "': type - '" << pMyList->Type << "': ref - '" << 
            pMyList << "'" << endl;
        
        if (pMyList->Next()) {
            pMyList = pMyList->Next();
        } else {
            lblnContinue = false;
        }
    }
    
    cout << endl;
    
    //----
    // reset to reverse list
    //----
    lblnContinue = true;
    lintII = 0;
    pMyList = &llelStart;
    pMyRev = NULL;
    
    //----
    // reverse the list
    //----
    while (lblnContinue) {
        if (pMyList->Next()) {
            cout << lintII++ << ",";
            SinglyListElement *pNext = pMyList->Next();
            pMyList->Push(pMyRev);
            pMyRev = pMyList;
            pMyList = pNext;
        } else {
            cout << lintII++ << " - end" << endl << endl;
            lblnContinue = false;
            pMyList->Push(pMyRev);
        }
    }
        
    //----
    // reset to print list
    //----
    lblnContinue = true;
    lintII = 0;
    
    cout << "The reversed list:" << endl;
    while (lblnContinue) {
        cout << lintII++ << ": value - '" << pMyList->Value << "': next - '" << 
            pMyList->pNext << "': type - '" << pMyList->Type << "': ref - '" << 
            pMyList << "'" << endl;
        
        if (pMyList->Next()) {
            pMyList = pMyList->Next();
        } else {
            lblnContinue = false;
        }
    }

    return 0;
}
