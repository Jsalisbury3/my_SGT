
var studentArray = [];
// var addRow = $("<tr>").addClass('tableRow');

$(document).ready(initializeApp);

function initializeApp(){
      // $('#modal').hide()
      $('.btn-success').click(handleAddClicked);
      $('.btn-primary').click(handleCancelClick);
      checkAuth();
   
}

function addClickHandlersToElements(){

}

function checkAuth() {
    if(localStorage.getItem("token")) {
        loadData();
    } else {
        if(window.location.pathname == "/") {
            location.replace("http://localhost:7000/signIn.html");
        }
    }
}

function signOut(){
     localStorage.clear();
     location.replace("http://localhost:7000/signIn.html") 
}
function handleAddClicked(){
    addStudent();
}

function handleCancelClick(){
    clearAddStudentFormInputs()
    // Just reset the value inside the inputs
    //$('tbody>tr')
}

function addStudent(){
    // var newStudent = {};
    // newStudent.name = $('#studentName').val();
    // newStudent.course = $('#course').val();
    // newStudent.grade = parseInt($('#studentGrade').val());
    var studentName = $('#studentName').val();
    var studentCourse = $('#course').val();
    var studentGrade = parseInt($('#studentGrade').val());
    if(studentName ==='' || studentCourse ===''|| parseFloat(studentGrade<=0) || parseFloat(studentCourse> 100) || isNaN(studentGrade)){
        // alert("invalid input");
        invalidModal()
        return;
    }else{
        sendNewStudentData(studentName, studentGrade, studentCourse)
    }
    // studentArray.push(newStudent);
    // console.log(studentArray);
    // updateStudentList(studentArray);
    // clearAddStudentFormInputs();
}

function clearAddStudentFormInputs(){
    console.log('clear add student');
    $('input[name=studentName]').val('').blur();
    $('input[name=course]').val('').blur();
    $('input[name=studentGrade]').val('').blur();
}


function invalidModal() {

    // var thisRowIndex = $(event.currentTarget).attr("data-delete-row")
    // var ID = receiptDataArray[thisRowIndex].ID;


    // Modal
    var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true' data-backdrop='static' data-keyboard='false'>");
    var modalDialog = $("<div class='modal-dialog' role='document'>");
    var modalContent = $("<div>").addClass("modal-content");
    var modalHeader = $("<div>").addClass("modal-header");
    var modalTitle = $("<div>").addClass("modal-title").text("Invalid Input");

    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);


    var modalFooter = $("<div>").addClass("modal-footer");
    var cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelDeleteButton.text("Confirm");
    // var confirmDeleteButton = $("<button class='btn btn-danger' data-dismiss='modal'>");

    // confirmDeleteButton.on("click", () => {
    //     deleteData(ID);
    //     deleteReceiptRow(thisRowIndex)
    //       handleDeleteClicked();

    // });
    // confirmDeleteButton.text("DELETE");
    modalFooter.append(cancelDeleteButton);
    // modalFooter.append(confirmDeleteButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    $(modalFade).on('hidden.bs.modal', () => {
        $(modalFade).remove();
    });
}







function renderStudentOnDom(studentObj){
    console.log(studentObj)
    var nameTableData = $('<td>',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Name,
        'text-align': 'center'
    });

    var gradeTableData = $('<td>',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Grade,
        'text-align': 'center'
    });

    var courseTableData = $('<td>,',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Course,
        'text-align': 'center'
    })

    var deleteButton = $('<button>',{
        class: 'btn btn-danger btn-sm glyphicon glyphicon-trash',
      //   text: 'Delete',
        'text-align': 'center',
        on: {
            // click: handleDeleteClicked
            click: deleteModal
            // click: openModal
           
        }
    })

    var editButton = $('<button>',{
        class: 'btn btn-warning btn-sm glyphicon glyphicon-edit edit',
        id:'edits',
        'text-align': 'center',
        rowNum: studentObj.ID,
        on: {
            // click: handleEditClicked
            click: handleeditModal
            // click: editModal
        }
    })

 

      function handleEditClicked(studentObj){
            changeToInputFields(studentObj);
      }
      function handleeditModal(studentObj){
          editModal(studentObj)
      }

      function handleDeleteClicked(){
            var studentIndex = studentArray.indexOf(studentObj);
            studentArray.splice(studentIndex, 1);
            newTableRow.remove();
            calculateGradeAverage(studentArray);
            console.log(studentArray)
            deleteStudentData(studentObj.ID);
      }


    var buttonTd = $('<td>').append(deleteButton, editButton);
    // var buttonTd2 = $('<td>').append(editButton);
    var newTableRow = $('<tr>').append(nameTableData, courseTableData, gradeTableData, buttonTd);
    $('tbody').append(newTableRow);


    function deleteModal() {

      // var thisRowIndex = $(event.currentTarget).attr("data-delete-row")
      // var ID = receiptDataArray[thisRowIndex].ID;
  
  
      // Modal
      var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true' data-backdrop='static' data-keyboard='false'>");
      var modalDialog = $("<div class='modal-dialog' role='document'>");
      var modalContent = $("<div>").addClass("modal-content");
      var modalHeader = $("<div>").addClass("modal-header");
      var modalTitle = $("<div>").addClass("modal-title").text("Are you sure you want to remove this student?");
  
      modalHeader.append(modalTitle);
      modalContent.append(modalHeader);
  
  
      var modalFooter = $("<div>").addClass("modal-footer");
      var cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
      cancelDeleteButton.text("Cancel");
      var confirmDeleteButton = $("<button class='btn btn-danger' data-dismiss='modal'>");
  
      confirmDeleteButton.on("click", () => {
      //     deleteData(ID);
      //     deleteReceiptRow(thisRowIndex)
            handleDeleteClicked();
  
      });
      confirmDeleteButton.text("DELETE");
      modalFooter.append(cancelDeleteButton);
      modalFooter.append(confirmDeleteButton);
      modalContent.append(modalFooter);
  
      modalDialog.append(modalContent);
      modalFade.append(modalDialog);
  
      $(modalFade).modal("show");
      $(modalFade).on('hidden.bs.modal', () => {
          $(modalFade).remove();
      });
  }

  function editModal(studentObj) {
    // var thisRowIndex = $(event.currentTarget).attr("data-delete-row")
    // var receiptData = receiptDataArray[thisRowIndex]
    // var ID = receiptDataArray[thisRowIndex].ID;
    // Modal
    var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'  data-backdrop='static' data-keyboard='false'>");
    var modalDialog = $("<div class='modal-dialog' role='document'>");
    var modalContent = $("<div>").addClass("modal-content");
    var modalHeader = $("<div>").addClass("modal-header");
    var modalTitle = $("<div>").addClass("modal-title").text("Edit Student");

    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);


    var modalBody = $("<form>").addClass("modal-body");
    var modalBodyContentStore = $("<div class='form-group'>");
    var modalBodyContentStoreNameLabel = $("<label for='store_name' class='form-control-label'>").text("Student Name");
    console.log(studentObj.name)
    console.log(studentObj.name)
    console.log(studentArray)
    var modalBodyContentStoreName = $("<input type='text' class='form-control'>");
    modalBodyContentStoreName.val(studentObj.Name);
    modalBodyContentStore.append(modalBodyContentStoreNameLabel);
    modalBodyContentStore.append(modalBodyContentStoreName);

    var modalBodyContentCategory = $("<div class='form-group'>");
    var modalBodyContentCategoryLabel = $("<label for='category' class='form-control-label'>").text("Course");
    var modalBodyContentCategoryValue = $("<input type='text' id='editCategory' class='form-control'>");
    modalBodyContentCategoryValue.val(studentObj.Course);
    modalBodyContentCategory.append(modalBodyContentCategoryLabel);
    modalBodyContentCategory.append(modalBodyContentCategoryValue);

    var modalBodyContentAmount = $("<div class='form-group'>");
    var modalBodyContentAmountLabel = $("<label for='amount' class='form-control-label'>").text("Grade");
    var modalBodyContentAmountValue = $("<input type='text' class='form-control'>")
    modalBodyContentAmountValue.val(studentObj.Grade);
    modalBodyContentAmount.append(modalBodyContentAmountLabel);
    modalBodyContentAmount.append(modalBodyContentAmountValue);

    modalBody.append(modalBodyContentStore);
    modalBody.append(modalBodyContentAmount);
    modalBody.append(modalBodyContentCategory);
    modalContent.append(modalBody);

    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelEditButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelEditButton.text("Cancel");
    let confirmEditButton = $("<button  class='btn btn-primary' data-dismiss='modal'>");
    confirmEditButton.on("click", () => {
        //   handleEditClicked(studentObj);
        //   if(studentName ==='' || studentCourse ===''|| parseFloat(studentGrade<=0) || parseFloat(studentCourse> 100) || isNaN(studentGrade)){
        //     // alert("invalid input");
        //     invalidModal()
        //     return;
        // }else{
        //         sendNewStudentData(studentName, studentGrade, studentCourse)
        // }
          CalleditStudentList(studentObj);
    });
    confirmEditButton.text("Confirm Edit");
    modalFooter.append(cancelEditButton);
    modalFooter.append(confirmEditButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    $(modalFade).on('hidden.bs.modal', () => {
        $(modalFade).remove();
    });

    function CalleditStudentList(studentObj) {
        console.log(studentObj)
        const TR = studentObj.target.parentElement.parentElement;
        console.log(studentObj)
        // const name = TR.children[0].childNodes[0].value;
        const name = modalBodyContentStoreName.val()
        // const course = TR.children[1].childNodes[0].value;
        const course =  modalBodyContentCategoryValue.val()
        // const grade = TR.children[2].childNodes[0].value;
        const grade = modalBodyContentAmountValue.val();
        // const id = TR.children[4].childNodes[0].attributes.rowNum.value; 
        const id = TR.children[3].childNodes[1].attributes.rownum.value;
        
        calculateGradeAverage(studentArray);
        editStudentList(name, course, grade, id);
    }
    
    
    function editStudentList(name, course, grade, id){
        $.ajax({
            dataType: 'json',
            method: "POST",
            url: "/api/UpdateStudent",
            data: {
                name,
                course,
                grade,
                id
            }
        }).then((reponse) => {
            if(reponse.success) {
                loadData();
            } else {
                //handle failed query here
            }
    
        })
    }








}

}














// function changeToInputFields(studentObj) {
//       const TR = studentObj.target.parentElement.parentElement;
//       TR.children[0].remove();
//       TR.children[1].remove();
//       TR.children[0].remove();
//       let gradeTD = TR.children[0] = document.createElement("td");
//       let courseTD = TR.children[0] = document.createElement("td");
//       let nameTD = TR.children[0] = document.createElement("td");
//       let inputTag1 = document.createElement("input");
//       let inputTag2 = document.createElement("input");
//       let inputTag3 = document.createElement("input");
//       inputTag1.classList.add("col-xs-12");
//       inputTag2.classList.add("col-xs-12");
//       inputTag3.classList.add("col-xs-12");
//       gradeTD.append(inputTag1);
//       courseTD.append(inputTag2);
//       nameTD.append(inputTag3);
//       TR.prepend(gradeTD);
//       TR.prepend(courseTD);
//       TR.prepend(nameTD);
//       $(".edit").off("click");
//       TR.children[4].childNodes[0].addEventListener("click", CalleditStudentList);
//   }






function handleDeleteClicked(){
      var studentIndex = studentArray.indexOf(studentObj);
      studentArray.splice(studentIndex, 1);
      newTableRow.remove();
      calculateGradeAverage(studentArray);
      deleteStudentData(studentObj.ID);
}




function validation(){
    const tests = [
        {
            element: "input[name=email]",
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            message: 'must be a valid email address'
        },

        {
            element: "input[name=password]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital and a number'
        },
    ];

    if( tests.length === tests.filter( validateInputAndDisplayError).length){
        console.log("it worked!");
        logUserIn();
    }
}

function validateInputAndDisplayError( incomingTests ){
    const element = incomingTests.element, pattern = incomingTests.pattern, errorMessage = incomingTests.message;
    const value = $( element ).val();
    const result = pattern.test( value );
    if( !result ){
        $( element ).next().text( errorMessage ).css("color", "red");
    } else {
        $( element ).next().text('');
    }
    return result;
}

function logUserIn() {
    const Email = $('input[name=email]').val();
    const Password = $('input[name=password]').val();
    $.ajax({
        method: "POST",
        url: "/api/LogIn",
        data: {
            Email,
            Password
        }
    }).then((response) => {
        if(response.success) {
            localStorage.setItem("token", response.token);
            location.replace("http://localhost:7000/");
        } else {
            $('.errorMessage').css("display", "block").css("color", "red").text(response.message);
        }
    })
}

function updateStudentList(updatingStudentArray){
    console.log(updatingStudentArray);
    $('tbody>tr').remove();
    for(var studentIndex = 0; studentIndex < updatingStudentArray.length; studentIndex++){
        console.log(updatingStudentArray[studentIndex]);
        renderStudentOnDom(updatingStudentArray[studentIndex]);
    }
    calculateGradeAverage(updatingStudentArray);
}

function calculateGradeAverage(calculateStudentArray){
    var gradeTotal = 0;
    var numberAvg = null;
    console.log(calculateStudentArray);
    for(var student = 0; student < calculateStudentArray.length; student++){
        console.log(calculateStudentArray[student]);
        gradeTotal += parseFloat(calculateStudentArray[student].Grade);
        console.log(gradeTotal);
    }

    numberAvg = gradeTotal/calculateStudentArray.length;
    numberAvg.toFixed(2);
    renderGradeAverage(numberAvg);
}

function renderGradeAverage(average){
    if(studentArray.length > 0){
        $('.avgGrade').text(average.toFixed(2));
    }else{
        $('.avgGrade').text(0);
    }
}

function handleDeleteButton(){
    $(this).closest('tr').remove();
    console.log(handleDeleteButton);
}

function loadData(){
    var ajaxOptions= {
        dataType: 'json',
        url: '/api/getAllStudents',
        method:'post',
    }
    $.ajax(ajaxOptions).then(function(response){
        console.log(response);
        studentArray = response.data;
        updateStudentList(studentArray)
    });
}

function sendNewStudentData(name, grade, course){
    var ajaxAdd = {
        dataType: 'json',
        url: "/api/addStudent",
        method: 'post',
        data:{ name: name, grade: grade, course: course},
    }



    $.ajax(ajaxAdd).then(function(response){
        var studentObj = {
            name: name,
            course: course,
            grade: grade,
            id: response.data.insertId
        }

        clearAddStudentFormInputs();
        studentArray.push(studentObj);
        updateStudentList(studentObj);
        loadData();
        console.log(response)
    });
}

function deleteStudentData(student_id){
    var ajaxDelete = {
        dataType: 'json',
        url: "/api/deleteStudent",
        method: 'post',
        data: {
            id: student_id
        }
    }

    $.ajax(ajaxDelete).then(function(response){
        console.log('deleted new student to database');
        console.log(response);
    });
}

function validationSignUp(){
    const tests = [
        {
            element: "input[name=emailSignUp]",
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            message: 'must be a valid email address'
        },

        {
            element: "input[name=passwordSignUp]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital and a number'
        },
        {
            element: "input[name=passwordConfirm]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital, a number and match the password above'
        },
    ];

    if( tests.length === tests.filter( validateInputAndDisplayError).length){
        if(checkPasswords()) {
            console.log("it worked!");
            SignUserIn();
        } else {
            const message = "Both passwords must match!";
            $("input[name=passwordConfirm]").next().text( message ).css("color", "red");
        }

    }
}

function validateInputAndDisplayError( incomingTests ){
    const element = incomingTests.element, pattern = incomingTests.pattern, errorMessage = incomingTests.message;
    const value = $( element ).val();
    const result = pattern.test( value );
    if( !result ){
        $( element ).next().text( errorMessage ).css("color", "red");
    } else {
        $( element ).next().text('');
    }
    return result;
}

function SignUserIn() {
    const Email = $('input[name=emailSignUp]').val();
    const Password = $('input[name=passwordConfirm]').val();
    $.ajax({
        method: "POST",
        url: "/api/SignUp",
        data: {
            Email,
            Password
        }
    }).then((response) => {
        if(response.success) {
            localStorage.setItem("token", response.token);
            location.replace("http://localhost:7000/");
        } else {
            $('.errorMessageSignUp').css("display", "block").css("color", "red").text(response.message);
        }
    })
}

function checkPasswords() {
    const password1 = $('input[name=passwordConfirm]').val();
    const password2 = $('input[name=passwordSignUp]').val();
    if(password1 === password2) {
        return true;
    } else {
        return false;
    }
};





// function openModal(){

//       $('#modal').show()

// }

// function hideModal(){
//       $('#modal').hide()
// }




function editModal(studentObj) {
    // var thisRowIndex = $(event.currentTarget).attr("data-delete-row")
    // var receiptData = receiptDataArray[thisRowIndex]
    // var ID = receiptDataArray[thisRowIndex].ID;
    // Modal
    var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'  data-backdrop='static' data-keyboard='false'>");
    var modalDialog = $("<div class='modal-dialog' role='document'>");
    var modalContent = $("<div>").addClass("modal-content");
    var modalHeader = $("<div>").addClass("modal-header");
    var modalTitle = $("<div>").addClass("modal-title").text("Edit Student");

    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);


    var modalBody = $("<form>").addClass("modal-body");
    var modalBodyContentStore = $("<div class='form-group'>");
    var modalBodyContentStoreNameLabel = $("<label for='store_name' class='form-control-label'>").text("Student Name");
    console.log(studentObj.Name)
    var modalBodyContentStoreName = $("<input type='text' class='form-control'>").text(studentObj.Name);
    modalBodyContentStoreName.val(studentObj.name);
    modalBodyContentStore.append(modalBodyContentStoreNameLabel);
    modalBodyContentStore.append(modalBodyContentStoreName);

    var modalBodyContentCategory = $("<div class='form-group'>");
    var modalBodyContentCategoryLabel = $("<label for='category' class='form-control-label'>").text("Course");
    var modalBodyContentCategoryValue = $("<input type='text' class='form-control'>").text(studentObj.Course);
    modalBodyContentCategoryValue.val(studentObj.course);
    modalBodyContentCategory.append(modalBodyContentCategoryLabel);
    modalBodyContentCategory.append(modalBodyContentCategoryValue);

    var modalBodyContentAmount = $("<div class='form-group'>");
    var modalBodyContentAmountLabel = $("<label for='amount' class='form-control-label'>").text("Grade");
    var modalBodyContentAmountValue = $("<input type='text' class='form-control'>").text(studentObj.Grade);
    modalBodyContentAmountValue.val(studentObj.grade);
    modalBodyContentAmount.append(modalBodyContentAmountLabel);
    modalBodyContentAmount.append(modalBodyContentAmountValue);

    modalBody.append(modalBodyContentStore);
    modalBody.append(modalBodyContentAmount);
    modalBody.append(modalBodyContentCategory);
    modalContent.append(modalBody);

    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelEditButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelEditButton.text("Cancel");
    let confirmEditButton = $("<button  class='btn btn-primary' data-dismiss='modal'>");
    confirmEditButton.on("click", () => {
          // handleEditClicked(studentObj);
          CalleditStudentList(studentObj);
    });
    confirmEditButton.text("Confirm Edit");
    modalFooter.append(cancelEditButton);
    modalFooter.append(confirmEditButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    $(modalFade).on('hidden.bs.modal', () => {
        $(modalFade).remove();
    });
}