//====
/// @file Classes.cs
/// @author Trevor Ratliff
/// @date 2012-06-25
/// @brief file for testing out various doxygen comment blocks
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-06-25  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         adding additional classes for tests  |
/// @endverbatim
//====

using System;

//====
/// @namespace Project_01
/// @brief defined in Main.cs
//====
namespace Project_01
{
    //====
    /// @class MyClass
    /// @author Trevor Ratliff
    /// @date 2012-06-21
    /// @brief test of constructor comments for class
    //  
    //  Parameters:
    //       MyCount -- simple counter
    //  
    //  Members:
    //       MyClass() -- constructor
    //       MyMethod() -- test method to set MyCount
    //       MyStaticPrivate() -- test of private static method
    //       MyStaticPublic() -- test of public static method
    //  
    //  Events:
    //       btnDone_Click() -- closses application
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2012-06-21  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    ///     2012-06-25  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         adding static members for tests  |
    /// @endverbatim
    //====
    class MyClass
    {
        #region Properties
        
        private int lintMyCount = 0;
        
        //====
        /// @property int MyCount
        /// @author Trevor Ratliff
        /// @brief a simple counter
        //====
        public int MyCount
        {
            get { return lintMyCount };
            set { lintMyCount = value };
        }
        
        #endregion
        
        
        #region Methods
        
        #region Constructors
        
        //====
        /// @fn public MyClass()
        /// @author Trevor Ratliff
        /// @date 2012-06-21
        /// @brief test of constructor comments
        //  
        //  Definitions:
        //  
        /// @verbatim 
        /// History:  Date  |  Programmer  |  Contact  |  Description  |
        ///     2012-06-21  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
        ///         function creation  |
        /// @endverbatim
        //====
        public MyClass()
        {
            //----
            // do stuff here
            //----
        }
        
        #endregion
        
        
        //====
        /// @fn public string MyMethod(string vintCount, out string rstrMessage)
        /// @author Trevor Ratliff
        /// @date 2012-06-21
        /// @param vintCount -- change the counter to this value
        /// @param[out] rstrMessage -- message to return to calling code
        /// @returns string
        /// @brief test of method comments
        //  
        //  Definitions:
        //      lstrReturn -- value to return to calling code
        //  
        /// @verbatim
        /// History:  Date  |  Programmer  |  Contact  |  Description  |
        ///     2012-06-21  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
        ///         function creation  |
        /// @endverbatim
        //====
        public string MyMethod(string vintCount, out string rstrMessage)
        {
            string lstrReturn = "";
            
            //----
            // do stuff here
            //----
            
            return lstrReturn;
        }
        
        
        //====
        /// @fn private static void MyStaticPrivate()
        /// @author Trevor Ratliff
        /// @date 2012-06-25
        /// @brief test of a private static method (doesn't really make any 
        ///     sense)
        //  
        //  Definitions:
        //      no new items
        //  
        /// @verbatim
        /// History:  Date  |  Programmer  |  Contact  |  Description  |
        ///     2012-06-25  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
        ///         function creation  |
        /// @endverbatim
        //====
        private static void MyStaticPrivate()
        {
            //----
            // do stuff
            //----
        }
        
        
        //====
        /// @fn public static bool MyStaticPublic()
        /// @author Trevor Ratliff
        /// @date 2012-06-25
        /// @brief test of a public static method
        /// @returns bool
        //  
        //  Definitions:
        //      lblnReturn -- flag for returning to calling code
        //  
        /// @verbatim
        /// History:  Date  |  Programmer  |  Contact  |  Description  |
        ///     2012-06-25  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
        ///         function creation  |
        /// @endverbatim
        //====
        public static bool MyStaticPublic()
        {
            bool lblnReturn = flase;
            
            //----
            // do stuff
            //----
            
            return lblnReturn;
        }
        
        #endregion
        
        
        #region Events
        
        //====
        /// @fn private void btnDone_Click(object sender, EventArgs e)
        /// @author Trevor Ratliff
        /// @date 2012-06-21
        /// @param sender -- calling object reference
        /// @param e -- event arguments for this event
        /// @brief test of constructor comments for events
        //  
        //  Definitions:
        //      lblnFlag -- test flag
        //      lintMath -- test int
        //      lstrTest -- test string
        // 
        /// @verbatim
        /// History:  Date  |  Programmer  |  Contact  |  Description  |
        ///     2012-06-21  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
        ///         event creation  |
        /// @endverbatim
        //====
        private void btnDone_Click(object sender, EventArgs e)
        {
            bool lblnFlag = false;
            int lintMath = 0;
            lstrTest = "";
            
            //----
            // do something here
            //----
            if (!lblnFlag) lblnFlag = true;
            
            lintMath += 1;
            
            lstrTest = "test";
        }
        
        #endregion
    }
}