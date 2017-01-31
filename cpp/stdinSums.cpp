//====
/// @File stdinSums.cpp
/// @brief Takes input from stdin and maps them to a vector to sum them up
/// @author Trevor Ratliff
/// @date 2017-01-24
///
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///   2017-01-24  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///     file creation  |
/// @endverbatim
//====

#include <cstdio>
#include <vector>
#include <iostream>
//#include <algorithm>
#include <stdexcept>
using namespace std;

bool GetInt(int& rintVal);
void PrintVector(vector<int>& rvctVals);
int SumVector(vector<int>& rvctVals);

int main() {
  // will hold values from STDIN
  vector<int> vals;

  // get values from STDIN
  while (cin) {//vals.size() < 3) {
    int currVal = 0;
    bool test = false;
    test = GetInt(currVal);
    if (test) {
      vals.push_back(currVal);
    }
  }

  // print out vector
  PrintVector(vals);

  // sum values
  cout << SumVector(vals);

  return 0;
}

//====
/// @fn GetInt(int& rintVal)
/// @author Trevor Ratliff
/// @date 2017-01-24
/// @brief tries to get an integer from STDIN
/// @param int& rintVal -- reference to passed in int, will put STDIN value here
/// @return bool -- true if succesfully parses as int
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///   2017-01-24  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  | funciton
///     creation  |
/// @endverbatim
//====
bool GetInt(int& rintVal) {
  bool ret = false;
  string lstrT;
  try {
    cin >> lstrT;
    rintVal = stoi(lstrT);
    ret = true;
  } catch (invalid_argument err) {
    cerr << "error: " << err.what() << " for '" << lstrT << "'" << endl;
    rintVal = 0;
    //ret = false;
  }
  return ret;
}

//====
/// @fn void PrintVector(vector<int>& rvctVals)
/// @brief prints an int vector to STDLOG
/// @author Trevor Ratliff
/// @date 2017-01-24
/// @param vector<int>& rvctVals -- reference to an int vector
/// @return void
//
/// prints each item in a vector to STDLOG with a space padding inbetween
///   each item
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///   2017-01-24  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  file creation  |
/// @endverbatim
//====
void PrintVector(vector<int>& rvctVals) {
  //----
  // output to STDLOG
  //----
  for (int ii = 0; ii < rvctVals.size(); ii++) {
    if (ii == 0) {
      clog << rvctVals[ii];
    } else {
      clog << " " << rvctVals[ii];
    }
  }
  return;
}

//====
/// @fn int SumVector(vector<int>& rvctVals)
/// @brief sums the items together of an vector<int>
/// @author Trevor Ratliff
/// @date 2017-01-24
/// @param vector<int>& rvctVals -- reference to an int vector
/// @return int -- the sum of the items in the referenced vector
//
/// sums each item of a referenced vector and returns that values
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///   2017-01-24  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function creation  |
/// @endverbatim
//====
int SumVector(vector<int>& rvctVals) {
  int ret = 0;
  for (int ii = 0; ii < rvctVals.size(); ii++) {
    ret += rvctVals[ii];
  }

  return ret;
}
