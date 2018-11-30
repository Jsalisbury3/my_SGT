/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 

/**
 * Listen for the document to load and initialize the application
 */

var studentArray = [];


$(document).ready(initializeApp);

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
      $('.btn-success').click(handleAddClicked);
      $('.btn-default').click(handleCancelClick);
      //$('.btn-primary').click(loadData)
      loadData(); 
      
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
      clearAddStudentFormInputs()
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
      // var newStudent = {};
      // newStudent.name = $('#studentName').val();
      // newStudent.course = $('#course').val();
      // newStudent.grade = parseInt($('#studentGrade').val()); 
      var studentName = $('#studentName').val();
      var studentCourse = $('#course').val();
      var studentGrade = parseInt($('#studentGrade').val()); 
      if(studentName ==='' || studentCourse ===''|| parseFloat(studentGrade<=0) || parseFloat(studentCourse> 100) || isNaN(studentGrade)){
            alert("invalid input");
            return;
      }else{
            sendNewStudentData(studentName, studentGrade, studentCourse)
      }
      // studentArray.push(newStudent);
      // console.log(studentArray);
      // updateStudentList(studentArray);
      // clearAddStudentFormInputs();
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
      console.log('clear add student');
      $('input').val(' ');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
      var nameTableData = $('<td>',{
                   class: 'col-xs-3 col-sm-3',
                   text: studentObj.name,
                   'text-align': 'center'
      });
     var gradeTableData = $('<td>',{
                  class: 'col-xs-3 col-sm-3',
                  text: studentObj.grade,
                  'text-align': 'center'
     })
     var courseTableData = $('<td>,',{
                  class: 'col-xs-3 col-sm-3',
                  text: studentObj.course,
                  'text-align': 'center'
     })
     var deleteButton = $('<button>',{
                  class: 'btn btn-danger',
                  text: 'Delete',
                  'text-align': 'center',
                  on: {
                        click: handleDeleteClicked
                        //click: handleDeleteClicked, deleteStudentData
                        //click: deleteStudentData, handleDeleteClicked
                        
                  }
     })
     var buttonTd = $('<td>',{class: 'col-xs-1 col-sm-3'}).append(deleteButton);
     var newTableRow = $('<tr>').append(nameTableData, courseTableData, gradeTableData, buttonTd);
     $('tbody').append(newTableRow);
     
      function handleDeleteClicked(){
            var studentIndex = studentArray.indexOf(studentObj);
            studentArray.splice(studentIndex, 1);
            newTableRow.remove();
            calculateGradeAverage(studentArray);
            deleteStudentData(studentObj.id);
     }
}
/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(updatingStudentArray){
      console.log(updatingStudentArray);
      $('tbody>tr').remove();
      for(var studentIndex = 0; studentIndex< updatingStudentArray.length; studentIndex++){
            console.log(updatingStudentArray[studentIndex]);
            renderStudentOnDom(updatingStudentArray[studentIndex]);
      }
      calculateGradeAverage(updatingStudentArray);
      //renderGradeAverage(calculateGradeAverage(updatingStudentArray));
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(calculateStudentArray){
      var gradeTotal = 0;
      var numberAvg = null;
      console.log(calculateStudentArray);
      for(var student = 0; student < calculateStudentArray.length; student++){
            console.log(calculateStudentArray[student]);
            gradeTotal = parseFloat(calculateStudentArray[student].grade);
            console.log(gradeTotal)
      }
      numberAvg = gradeTotal/calculateStudentArray.length;
      numberAvg.toFixed(2)
      renderGradeAverage(numberAvg);
      //return numberAvg;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
      if(studentArray.length > 0){
            $('.avgGrade').text(average);
      }else{ 
            $('.avgGrade').text(0);
      }  
}
function handleDeleteButton(){
      $(this).closest('tr').remove();
      console.log(handleDeleteButton);

}
function loadData(){
      console.log(ajaxOptions)
      var ajaxOptions= {
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            method:'post',
            data:{
                  api_key: 'jMkjyNuaR1'
      }
}
      $.ajax(ajaxOptions).then(function(response){
            studentArray = response.data
            updateStudentList(studentArray)
            //console.log(response);
      });
}
function sendNewStudentData(name, grade, course){
      var ajaxAdd = {
            dataType: 'json',
            url: "http://s-apis.learningfuze.com/sgt/create",
            method: 'post',
            data:{
                  api_key: 'jMkjyNuaR1',
                  name: name,
                  grade: parseInt(grade),
                  course: course

            }
      }

      $.ajax(ajaxAdd).then(function(response){
            console.log('added new student to database')
            console.log(response);
            var studentObj = {
                  name: name,
                  course: course,
                  grade: grade,
                  id: response.new_id
            }

            clearAddStudentFormInputs();
            studentArray.push(studentObj);
            updateStudentList(studentObj);
            console.log(response)
      });
}

function deleteStudentData(student_id){
      var ajaxDelete = {
            dataType: 'json',
            url: "http://s-apis.learningfuze.com/sgt/delete",
            method: 'post',
            data:{
                  api_key: 'jMkjyNuaR1',
                  student_id: parseInt(student_id)
            }
      }
      $.ajax(ajaxDelete).then(function(response){
            console.log('deleted new student to database')
            console.log(response);
      //       var studentObj = {
      //             name: name,
      //             course: course,
      //             grade: grade,
      //             id: response.new_id
      //       }

      //       clearAddStudentFormInputs();
      //       studentArray.push(studentObj);
      //       updateStudentList(studentObj);
      //       console.log(response)
      });

}



