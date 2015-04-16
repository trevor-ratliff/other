//====
/// @file learningGo.go
/// @brief a file to go over features of the GO programming language
/// @author Trevor Ratliff
/// @date 2015-04-14
//
/// @verbatim
///	History: Date  |  Progammer  |  Contact  |  Description  |
///		2014-04-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			file creation  |
/// @endverbatim
//====
//----
// all programs need to belong to a package and executable files need to be in 
//	the main package
//----
package main

//----
// this is where any import statements would go
//	last portion of import path becomes variable to use that package
//----
import (
	"fmt"
	"math"
	//"studioratliff/trevor-ratliff/learningGo"	// learningGo is variable name
)

// comment
/* comment */

//----
// variables out here can only be var xxx [TYPE] = yyy
//----
// var gintMyInt int = 0

//----
// all executable go files need a main function
//----
func main() {
	fmt.Printf("\n\n\n\nhello, this is how you use GO\n\n")

	//====
	// Variable assignment
	//====

	//----
	// variables can be set in the following ways
	//----
	var lblnFlag bool
	var lintNumber int = 5
	lintNum2 := 2
	lintNum3, lintNum4, lblnFlag2 := 3, 4, true

	//----
	// and the preferred way for multiple vars
	//----
	var (
		billy string = "billy\n"
		bob, joe string = "bob", "joe"
		thorton = "thorton"
	)

	//----
	// the defer command waits in a stack until the current scope finishes then
	//	runs all defer commands in a FILO order
	//	also all variables in a go program need to be used
	//----
	defer println("\nAll variables used here\n",
		"  (with their values at time of calling defer):\n    ", 
		lblnFlag, lblnFlag2, lintNumber, lintNum2, lintNum3, lintNum4, 
		billy, bob, joe, thorton)

	//====
	// control flow
	//====

	//----
	// for (go's while too) for {} == infinite loop
	//	also like c without the '()' and '{}' required
	//----
	for lintII := 65; lintII < 123; lintII++ { 
		if lintII == 91 { 
			billy += "\n"
			lintII += 6 
		}
		billy += ", " + string(lintII) 
	}
	fmt.Println("\nresult of for loop: ", billy)
	
	//----
	// all setup is optional; the following is like a while loop
	//----
	lintNumber = 1
	for ; lintNumber < 1000; { lintNumber += lintNumber }
	fmt.Printf("result of 'while' %v\n", lintNumber)

	//----
	// this is the same
	//----
	lintNum2 = 1
	for lintNum2 < 1000 { lintNum2 += lintNum2 }
	fmt.Printf("see the same: %v\n\n", lintNum2)

	//----
	// if blocks are like c without '()'. '{}' required
	//----
	if lblnFlag {
		fmt.Printf("the flag is %v\n", lblnFlag)
	} else {
		fmt.Printf("the flag is %v\n", lblnFlag)
	}

	//----
	// you can use pre-values like a for loop too
	//----
	if lstrTest := "Ned"; !lblnFlag {
		fmt.Printf("%v was here; only here - out of scope elsewhere\n\n", 
			lstrTest)
	}

	//----
	// switch
	//----
	switch lstrTest := "ned"; lstrTest {
	case "wee":
		fmt.Println("won't get here")
	case "ned":
		fmt.Printf("will hit here (%v)\n", lstrTest)
		fallthrough
	case "hoo":
		fmt.Println("and here, due to 'fallthrough'")
	default:
		fmt.Println("but not here")
	}

	//----
	// evaluates top to bottom stopping when it hits a match
	//----
	switch i := 0.0; i {
	case 0:
		fmt.Printf("will hit here (%v)\n\n", i)
	case Sqrt(2, 0.1):	// won't run
	}

	//====
	// functions
	//====

	//----
	// see definition of Sqrt below
	//	calling a function
	//----
	fmt.Printf("square root of 3 (0.000001) = %v\n", Sqrt(3, 0.000001))
	fmt.Printf("square root of 3 (0.01)     = %v\n", Sqrt(3, 0.01))
	fmt.Printf("square root of 3 (0.1)      = %v\n\n", Sqrt(3, 0.1))
}


//----
// newton's method for square roots [x = number to find square root of]
//		z = z - ((z^2-x)/2z)
//----
func Sqrt(x float64, precision float64) float64 {
	z := x/2
	zold := 0.0
	for math.Abs(z - zold) > precision {
		zold = z
		z = z - ((z*z - x) / (2 * z))
		//fmt.Printf("z = %v\n",z)
	}
	return z
}

