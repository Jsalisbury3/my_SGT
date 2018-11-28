/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 

/**
 * Listen for the document to load and initialize the application
 */

var studentArray = [];
var newStudent = {};

$(document).ready();

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){
      addStudent(); 
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
      // Just reset the value inside the inputs 
      //$('tbody>tr')
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
      //var newStudent = {};
      newStudent.name = $('#studentName').val();
      newStudent.course = $('#course').val();
      newStudent.grade = $('#studentGrade').val(); 
      if(newStudent.name ==='' || newStudent.course ===''|| parseFloat(newStudent.grade<=0) || parseFloat(newStudent.course> 100) || isNaN(newStudent.grade)){
            alert("invalid input")
      }
      studentArray.push(newStudent)
      console.log(studentArray)
      updateStudentList(studentArray)
      clearAddStudentFormInputs();
      
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
      console.log('clear add student')
      $('input').val(' ');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
     var nameTableData = $('<td>').text(studentObj.name);
//      var nameTableData = $('<td>',{
//                   class: 'col-xs-3 col-sm-3',
//                   text: studentObj.name,
//                   'text-align': 'center'
//      });
     var gradeTableData = $('<td>').text(studentObj.grade);
     var courseTableData = $('<td>').text(studentObj.course);
     var newTableRow = $('<tr>').append(nameTableData, gradeTableData, courseTableData);

     var deleteButton = $('<button>',{
                  class: 'btn btn-danger',
                  text: 'Delete',
                  'text-align': 'center',
                  on: {
                        click: handleDeleteClicked
                  }
     })
     
     var buttonTd = $('<td>',{class: 'col-xs-3 col-sm-3'}).append(deleteButton)
     var newTableRow = $('<tr').append(nameTableData, courseTableData, gradeTableData, buttonTd)
     $('tbody').append(newTableRow);


     function handleDeleteClicked(){
      var studentIndex = studentArray.indexOf(studentObj)
      studentArray.splice(studentIndex, 1)
      newTableRow.remove()
     }
     
     
     
     
     //$('tbody>tr').remove();
     //clearAddStudentFormInputs();


}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(updatingStudentArray){
      console.log(updatingStudentArray)
      $('tbody>tr').remove();
      for(var studentIndex = 0; studentIndex< updatingStudentArray.length; studentIndex++){
            console.log(updatingStudentArray[studentIndex])
            renderStudentOnDom(updatingStudentArray[studentIndex])
      }
      
      calculateGradeAverage(updatingStudentArray)
      //renderGradeAverage(calculateGradeAverage(updatingStudentArray));
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(calculateStudentArray){
      var gradeTotal = 0;
      var numberAvg = null
      console.log(calculateStudentArray)
      for(var student = 0; student < calculateStudentArray.length; student++){
            console.log(calculateStudentArray[student])
            gradeTotal = parseFloat(calculateStudentArray[student].grade)
      }
      numberAvg = gradeTotal/calculateStudentArray.length;
      renderGradeAverage(numberAvg)
      return numberAvg;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
      $('.avgGrade').text(average)
}
function handleDeleteButton(){
      $(this).closest('tr').remove()
      console.log(handleDeleteButton)
}



