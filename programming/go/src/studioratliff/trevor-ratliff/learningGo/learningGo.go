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
//----
import (
	"fmt"
)


//----
// variables out here can only be var xxx [TYPE] = yyy
//----
// var gintMyInt int = 0

//----
// all executable go files need a main function
//----
func main() {
	fmt.Printf("hello, this is how you use GO\n")

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
		billy string = "billy"
		bob, joe string = "bob", "joe"
		thorton = "thorton"
	)

	//----
	// the defer command waits until the current scope finishes then runs
	//	also all variables in a go program need to be used
	//----
	defer println("\n", lblnFlag, lblnFlag2, lintNumber, lintNum2, lintNum3, 
		lintNum4, billy, bob, joe, thorton)

	//----
	// if blocks are like c without '()'. '{}' required
	//----
	if lblnFlag {
		fmt.Printf("the flag is %v\n", lblnFlag)
	}

	//----
	// you can pre-set values like a for loop too
	//----
	if lstrTest := "Ned"; !lblnFlag {
		fmt.Printf("%v was here; only here - out of scope elsewhere\n", lstrTest)
	}
}

